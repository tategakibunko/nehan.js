var InlineGenerator = (function(){
  /**
     @memberof Nehan
     @class InlineGenerator
     @classdesc inline level generator, output inline level block.
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
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
    LayoutGenerator.call(this, style, stream);
    if(child_generator){
      this.setChildLayout(child_generator);
    }
  }
  Class.extend(InlineGenerator, LayoutGenerator);

  var __get_line_start_pos = function(line){
    var head = line.elements[0];
    return (head instanceof Box)? head.style.getMarkupPos() : head.pos;
  };

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
      if(measure === 0){
	break;
      }
      if(!context.hasInlineSpaceFor(measure)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, measure);
      if(!context.hasInlineSpaceFor(1)){
	break;
      }
    }
    return this._createOutput(context);
  };

  /**
     rollback stream position by cached element of parent generator.

     @memberof Nehan.InlineGenerator
     @param parent_cache {Nehan.Box}
  */
  InlineGenerator.prototype.rollback = function(parent_cache){
    if(this.stream === null){
      return;
    }
    var start_pos = __get_line_start_pos(parent_cache);
    this.stream.setPos(start_pos); // rewind stream to the head of line.

    var cache = this.popCache();

    // inline child is always inline, so repeat this rollback while cache exists.
    if(cache && this._childLayout && this._childLayout.rollback){
      this._childLayout.rollback(cache);
    }
  };

  InlineGenerator.prototype._createChildContext = function(context){
    return new CursorContext(
      context.block, // inline generator inherits block context as it is.
      new InlineContext(context.getInlineRestMeasure())
    );
  };

  InlineGenerator.prototype._createOutput = function(context){
    // no like-break, no page-break, no element
    if(context.isInlineEmpty()){
      return null;
    }
    var line = this.style.createLine({
      lineBreak:context.hasLineBreak(), // is line break included in?
      breakAfter:context.hasBreakAfter(), // is break after included in?
      measure:context.getInlineCurMeasure(), // actual measure
      elements:context.getInlineElements(), // all inline-child, not only text, but recursive child box.
      charCount:context.getInlineCharCount(),
      maxExtent:context.getInlineMaxExtent(),
      maxFontSize:context.getInlineMaxFontSize()
    });

    // set position in parent stream.
    if(this._parentLayout && this._parentLayout.stream){
      line.pos = Math.max(0, this._parentLayout.stream.getPos() - 1);
    }

    // call _onCreate callback for 'each' output
    this._onCreate(context, line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, line);
    }
    return line;
  };

  InlineGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    if(this.hasChildLayout()){
      return this.yieldChildLayout();
      //return this.yieldChildLayout(context);
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // text block
    if(token instanceof Text){
      this.setChildLayout(this._createTextGenerator(this.style, token));
      return this.yieldChildLayout(context);
    }

    // if not text, it's tag token, inherit style
    var child_style = new StyleContext(token, this.style, {cursorContext:context});

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

    // if inline-block, yield immediately, and return as child inline element.
    if(child_style.isInlineBlock()){
      return (new InlineBlockGenerator(child_style, child_stream)).yield(context);
    }

    // inline child
    switch(child_style.getMarkupName()){
    case "img":
      return child_style.createImage();

    case "br":
      context.setLineBreak(true);
      return null;

    case "page-break": case "pbr": case "end-page":
      context.setBreakAfter(true);
      return null;

    default:
      var child_generator = this._createChildInlineGenerator(child_style, child_stream, context);
      this.setChildLayout(child_generator);
      return this.yieldChildLayout(context);
    }
  };

  InlineGenerator.prototype._breakInline = function(block_gen){
    this.setTerminate(true);
    if(this._parentLayout === null){
      return;
    }
    if(this._parentLayout instanceof InlineGenerator){
      this._parentLayout._breakInline(block_gen);
    } else {
      this._parentLayout.setChildLayout(block_gen);
    }
  };

  InlineGenerator.prototype._getMeasure = function(element){
    return element.getLayoutMeasure(this.style.flow);
  };

  InlineGenerator.prototype._addElement = function(context, element, measure){
    context.addInlineBoxElement(element, measure);

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(element);
  };

  return InlineGenerator;
})();

