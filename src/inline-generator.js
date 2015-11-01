Nehan.InlineGenerator = (function(){
  /**
     @memberof Nehan
     @class InlineGenerator
     @classdesc inline level generator, output inline level block.
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
     @param child_generator {Nehan.LayoutGenerator}
     @description <pre>
     * constructor argument child_generator is available when block generator yield
     * child inline level, but firt token is not text element but child inline markup.
     * for example see below.
     *
     * &lt;p&gt;&lt;a href="#"&gt;foo&lt;/a&gt;text,text&lt;/p&gt;
     *
     * &lt;p&gt; is block level, and &lt;a&gt; is inline level, then inline generator is
     * spawned sharing same token stream of &lt;p&gt; and with inline generator of &lt;a&gt; as 'first' inline child generator.
     * this mechanism is mainly performance issue, because inline level markup(&lt;a&gt; in this case) is
     * already parsed and selector style is calculated, so to avoid double parse,
     * we pass the first child generator to the consctuctor of inline generator.
     *</pre>
  */
  function InlineGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(InlineGenerator, Nehan.LayoutGenerator);

  InlineGenerator.prototype._yield = function(){
    if(!this.context.layoutContext.hasInlineSpaceFor(1)){
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext();
      if(element === null){
	console.log("eof");
	break;
      }
      var measure = this.context.getElementLayoutMeasure(element);
      this.context.debugInlineElement(element, measure);
      if(measure === 0){
	break;
      }
      if(!this.context.layoutContext.hasInlineSpaceFor(measure)){
	this.context.pushCache(element);
	break;
      }
      this._addElement(element, measure);
      if(element.hangingPunctuation){
	if(element.hangingPunctuation.style === this.context.style){
	  var chr = this._yieldHangingChar(element.hangingPunctuation.data);
	  this._addElement(chr, 0);
	} else {
	  this.context.layoutContext.setHangingPunctuation(element.hangingPunctuation); // inherit to parent generator
	}
      }
      if(element.hasLineBreak){
	this.context.layoutContext.setLineBreak(true);
	console.log("line break");
	break;
      }
    }
    // if element is the last full-filled line, skip continuous <br>.
    if(element && element.lineOver && this.context.childGenerator && !this.context.childGenerator.hasNext()){
      this.context.stream.skipIf(function(token){
	return (token instanceof Nehan.Tag && token.getName() === "br");
      });
    }
    return this._createOutput();
  };

  InlineGenerator.prototype._yieldHangingChar = function(chr){
    chr.setMetrics(this.context.style.flow, this.context.style.getFont());
    var font_size = this.context.style.getFontSize();
    return this.context.style.createTextBlock({
      elements:[chr],
      measure:chr.bodySize,
      extent:font_size,
      charCount:0,
      maxExtent:font_size,
      maxFontSize:font_size
    });
  };

  InlineGenerator.prototype._createOutput = function(){
    var line = this.context.createLine();

    // call _onCreate callback for 'each' output
    this._onCreate(line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(line);
    }
    //console.log(">> line:%o, context = %o", line, context);
    return line;
  };

  InlineGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      var cache = this.context.popCache();
      return cache;
    }

    if(this.context.hasChildLayout()){
      // block context is delegated, but inline context is always re-constructed.
      // see LayoutGenerator::_createChildContext
      return this.context.yieldChildLayout();
    }

    // read next token
    var token = this.context.stream.get();
    if(token === null){
      return null;
    }

    //console.log("inline token:%o", token);

    // text block
    if(token instanceof Nehan.Text || token instanceof Nehan.Tcy || token instanceof Nehan.Word){
      this.context.createChildTextGenerator(token);
      return this.context.yieldChildLayout();
    }

    // child inline without stream.
    switch(token.getName()){
    case "br":
      this.context.layoutContext.setLineBreak(true);
      if(!this.context.style.isPre()){
	this.context.stream.skipUntil(function(token){
	  return (token instanceof Nehan.Text && token.isWhiteSpaceOnly());
	});
      }
      return null;

    case "wbr":
      // this.context.layoutContext.setInlineWordBreakable(true); // TODO
      return this._getNext();

    case "page-break": case "pbr": case "end-page":
      this.context.layoutContext.setBreakAfter(true);
      return null;

    default:
      break;
    }

    // if not text, it's tag token, inherit style
    var child_style = this.context.createChildStyle(token);

    if(child_style.isDisabled()){
      return this._getNext(); // just skip
    }

    // if inline -> block(or floated layout), force terminate inline
    if(child_style.isBlock() || child_style.isFloated()){
      var child_gen = this.context.createChildBlockGenerator(child_style);
      if(child_style.isFloated()){
	child_gen = this.context.createFloatGenerator(child_gen);
      }
      // add line-break to avoid empty-line.
      // because empty-line is returned as null to parent block generator,
      // and it causes page-break of parent block generator.
      this.context.layoutContext.setLineBreak(true);
      return null;
    }

    // inline child
    switch(child_style.getMarkupName()){
    case "img":
      return child_style.createImage();

    default:
      this.context.createChildInlineGenerator(child_style);
      return this.context.yieldChildLayout();
    }
  };

  InlineGenerator.prototype._addElement = function(element, measure){
    this.context.layoutContext.addInlineBoxElement(element, measure);

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(element);
  };

  return InlineGenerator;
})();

