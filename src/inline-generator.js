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
  function InlineGenerator(style, stream, child_generator){
    Nehan.LayoutGenerator.call(this, style, stream);
    if(child_generator){
      this.setChildLayout(child_generator);
    }
  }
  Nehan.Class.extend(InlineGenerator, Nehan.LayoutGenerator);

  InlineGenerator.prototype._yield = function(context){
    if(!context.hasInlineSpaceFor(1)){
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var measure = this._getMeasure(element);
      //console.log("[i:%s]%o(%s), m = %d (%d/%d)", this.style.markupName, element, (element.toString() || ""), measure, (context.inline.curMeasure + measure), context.inline.maxMeasure);
      if(measure === 0){
	break;
      }
      if(!context.hasInlineSpaceFor(measure)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, measure);
      if(element.hangingPunctuation){
	if(element.hangingPunctuation.style === this.style){
	  var chr = this._yieldHangingChar(context, element.hangingPunctuation.data);
	  this._addElement(context, chr, 0);
	} else {
	  context.setHangingPunctuation(element.hangingPunctuation); // inherit to parent generator
	}
      }
      if(element.hasLineBreak){
	context.setLineBreak(true);
	break;
      }
    }
    // if element is the last full-filled line, skip continuous <br>.
    if(element && element.lineOver && this._child && !this._child.hasNext()){
      this.stream.skipIf(function(token){
	return (token instanceof Nehan.Tag && token.getName() === "br");
      });
    }
    return this._createOutput(context);
  };

  InlineGenerator.prototype._yieldHangingChar = function(context, chr){
    chr.setMetrics(this.style.flow, this.style.getFont());
    var font_size = this.style.getFontSize();
    return this.style.createTextBlock({
      elements:[chr],
      measure:chr.bodySize,
      extent:font_size,
      charCount:0,
      maxExtent:font_size,
      maxFontSize:font_size
    });
  };

  InlineGenerator.prototype._createChildContext = function(context){
    var child_context = new Nehan.LayoutContext(
      context.block, // inline generator inherits block context as it is.
      new Nehan.InlineContext(context.getInlineRestMeasure())
    );
    //console.log("create child context:%o", child_context);
    return child_context;
  };

  InlineGenerator.prototype._createOutput = function(context){
    if(context.isInlineEmpty()){
      return null;
    }
    var line = this.style.createLine({
      lineNo:context.getBlockLineNo(),
      hasLineBreak:context.hasLineBreak(), // is line break included in?
      breakAfter:context.hasBreakAfter(), // is break after included in?
      hyphenated:context.isHyphenated(), // is line hyphenated?
      measure:context.getInlineCurMeasure(), // actual measure
      elements:context.getInlineElements(), // all inline-child, not only text, but recursive child box.
      charCount:context.getInlineCharCount(),
      maxExtent:(context.getInlineMaxExtent() || this.style.getFontSize()),
      maxFontSize:context.getInlineMaxFontSize(),
      hangingPunctuation:context.getHangingPunctuation()
    });

    //console.log("%o create output(%s): conetxt max measure = %d, context:%o", this, line.toString(), context.inline.maxMeasure, context);

    // set position in parent stream.
    if(this._parent && this._parent.stream){
      line.pos = Math.max(0, this._parent.stream.getPos() - 1);
    }

    if(this.style.isRootLine()){
      context.incBlockLineNo();
    }

    // call _onCreate callback for 'each' output
    this._onCreate(context, line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, line);
    }
    //console.log(">> line:%o, context = %o", line, context);
    return line;
  };

  InlineGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    if(this.hasChildLayout()){
      // block context is delegated, but inline context is always re-constructed.
      // see LayoutGenerator::_createChildContext
      return this.yieldChildLayout(context);
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    //console.log("inline token:%o", token);

    // text block
    if(token instanceof Nehan.Text || token instanceof Nehan.Tcy || token instanceof Nehan.Word){
      this.setChildLayout(context.createTextGenerator(token));
      return this.yieldChildLayout(context);
    }

    // child inline without stream.
    switch(token.getName()){
    case "br":
      context.setLineBreak(true);
      if(!this.style.isPre()){
	this.stream.skipUntil(function(token){
	  return (token instanceof Nehan.Text && token.isWhiteSpaceOnly());
	});
      }
      return null;

    case "wbr":
      // context.setInlineWordBreakable(true); // TODO
      return this._getNext(context);

    case "page-break": case "pbr": case "end-page":
      context.setBreakAfter(true);
      return null;

    default:
      break;
    }

    // if not text, it's tag token, inherit style
    var child_style = new Nehan.Style(token, this.style, {cursorContext:context});

    if(child_style.isDisabled()){
      return this._getNext(context); // just skip
    }

    var child_stream = this._createStream(child_style);

    // if inline -> block(or floated layout), force terminate inline
    if(child_style.isBlock() || child_style.isFloated()){
      var child_gen = this._createChildBlockGenerator(child_style, child_stream, context);
      if(child_style.isFloated()){
	child_gen = this._createFloatGenerator(context, child_gen);
      }
      this._breakInline(child_gen);

      // add line-break to avoid empty-line.
      // because empty-line is returned as null to parent block generator,
      // and it causes page-break of parent block generator.
      context.setLineBreak(true);
      return null;
    }

    // inline child
    switch(child_style.getMarkupName()){
    case "img":
      return child_style.createImage();

    default:
      var child_generator = this._createChildInlineGenerator(child_style, child_stream, context);
      this.setChildLayout(child_generator);
      return this.yieldChildLayout(context);
    }
  };

  InlineGenerator.prototype._breakInline = function(block_gen){
    this.setTerminate(true);
    if(this._parent === null){
      return;
    }
    if(this._parent instanceof InlineGenerator){
      this._parent._breakInline(block_gen);
    } else {
      this._parent.setChildLayout(block_gen);
    }
  };

  InlineGenerator.prototype._getMeasure = function(element){
    return element.getLayoutMeasure(this.style.flow);
  };

  InlineGenerator.prototype._addElement = function(context, element, measure){
    context.addInlineBoxElement(element, measure);

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(context, element);
  };

  return InlineGenerator;
})();

