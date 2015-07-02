var LayoutGenerator = (function(){
  /**
     @memberof Nehan
     @class LayoutGenerator
     @classdesc root abstract class for all generator
     @constructor
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._parent = null;
    this._child = null;
    this._cachedElements = [];
    this._terminate = false; // used to force terminate generator.
    this._yieldCount = 0;
  }

  /**
     @memberof Nehan.LayoutGenerator
     @method yield
     @param parent_context {Nehan.CursorContext} - cursor context from parent generator
     @return {Nehan.Box}
  */
  LayoutGenerator.prototype.yield = function(parent_context){
    // create child cursor context from parent cursor context.
    var context = parent_context? this._createChildContext(parent_context) : this._createStartContext();

    // call _yield implemented in inherited class.
    var result = this._yield(context);

    // increment inner yield count
    if(result !== null){
      this._yieldCount++;
    }
    if(this._yieldCount > Nehan.Config.maxYieldCount){
      console.error("[%s]too many yield! gen:%o, context:%o, stream:%o", this.style.markupName, this, context, this.stream);
      throw "too many yield";
    }
    return result;
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method setTerminate
     @param status {boolean}
  */
  LayoutGenerator.prototype.setTerminate = function(status){
    this._terminate = status;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method setChildLayout
     @param generator {Nehan.LayoutGenerator}
  */
  LayoutGenerator.prototype.setChildLayout = function(generator){
    this._child = generator;
    generator._parent = this;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method hasNext
     @return {boolean}
  */
  LayoutGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    if(this.hasChildLayout()){
      return true;
    }
    return this.stream? this.stream.hasNext() : false;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method hasChildLayout
     @return {boolean}
  */
  LayoutGenerator.prototype.hasChildLayout = function(){
    if(this._child && this._child.hasNext()){
      return true;
    }
    return false;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method hasCache
     @return {boolean}
  */
  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method isFirstOutput
     @return {boolean}
  */
  LayoutGenerator.prototype.isFirstOutput = function(){
    return this._yieldCount === 0;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method yieldChildLayout
     @param context {Nehan.CursorContext}
     @return {Nehan.Box}
  */
  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._child.yield(context);
    return next;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method peekLastCache
     @return {Nehan.Box | Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  LayoutGenerator.prototype.peekLastCache = function(){
    return Nehan.List.last(this._cachedElements);
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method pushCache
     @param element {Nehan.Box | Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  LayoutGenerator.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      if(cache_count >= Nehan.Config.maxRollbackCount){
	var element_str = (element instanceof Box)? element.toString() : (element.data || "??");
	console.warn("[%s] too many retry:%o, element:%o(%s)", this.style.getMarkupName(), this.style, element, element_str);
	// to avoid infinite loop, force child or this generator terminate!
	if(this._child && this._child.hasNext()){
	  this._child.setTerminate(true);
	} else {
	  this.setTerminate(true);
	}
	return;
      }
    }
    element.cacheCount = cache_count + 1;
    this._cachedElements.push(element);
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method popCache
     @return {Nehan.Box | Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  LayoutGenerator.prototype.popCache = function(){
    var cache = this._cachedElements.pop();
    return cache;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method clearCache
  */
  LayoutGenerator.prototype.clearCache = function(){
    this._cachedElements = [];
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method addText
     @param text {String}
  */
  LayoutGenerator.prototype.addText = function(text){
    if(this.stream){
      this.stream.addText(text);
    }
  };

  // called 'after' generated each element of target output is added to each context.
  LayoutGenerator.prototype._onAddElement = function(context, block){
  };

  // called 'after' output element is generated.
  LayoutGenerator.prototype._onCreate = function(context, output){
  };

  // called 'after' final output element is generated.
  LayoutGenerator.prototype._onComplete = function(context, output){
  };

  LayoutGenerator.prototype._createStartContext = function(){
    var edge_size = this._getContextEdgeSize();
    var context = new Nehan.CursorContext(
      new Nehan.BlockContext(this.style.outerExtent - edge_size),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
    //console.info("[%s]start context:%o", this.style.markupName, context);
    return context;
  };

  LayoutGenerator.prototype._createChildContext = function(parent_context){
    var edge_size = this._getContextEdgeSize();
    var max_extent = parent_context.getBlockRestExtent() - edge_size;
    var child_context = new Nehan.CursorContext(
      new Nehan.BlockContext(max_extent, {
	lineNo:parent_context.lineNo
      }),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
    //console.info("[%s]child context:%o", this.style.markupName, child_context);
    return child_context;
  };

  LayoutGenerator.prototype._getContextEdgeSize = function(style){
    return this.isFirstOutput()? this.style.getEdgeBefore() : 0;
  };

  LayoutGenerator.prototype._createStream = function(style){
    var markup_name = style.getMarkupName();
    var markup_content = style.getMarkupContent();
    if(style.getTextCombine() === "horizontal" || markup_name === "tcy"){
      return new Nehan.TokenStream(markup_content, {
	tokens:[new Nehan.Tcy(markup_content)]
      });
    }
    switch(markup_name){
    case "word":
      return new Nehan.TokenStream(markup_content, {
	tokens:[new Nehan.Word(markup_content)]
      });
    case "ruby":
      return new Nehan.RubyTokenStream(markup_content);
    case "tbody": case "thead": case "tfoot":
      return new Nehan.TokenStream(style.getContent(), {
	filter:Nehan.Closure.isTagName(["tr"])
      });
    case "tr":
      return new Nehan.TokenStream(style.getContent(), {
	filter:Nehan.Closure.isTagName(["td", "th"])
      });
    default: return new Nehan.TokenStream(style.getContent());
    } 
  };

  LayoutGenerator.prototype._createFloatGenerator = function(context, first_float_gen){
    var self = this, parent_style = this.style;
    var floated_generators = [first_float_gen];
    var tokens = this.stream.iterWhile(function(token){
      if(token instanceof Nehan.Text && token.isWhiteSpaceOnly()){
	return true;
      }
      if(!Nehan.Token.isTag(token)){
	return false;
      }
      var child_style = new StyleContext(token, parent_style, {cursorContext:context});
      if(!child_style.isFloated()){
	parent_style.removeChild(child_style);
	return false;
      }
      var child_stream = self._createStream(child_style);
      var generator = self._createChildBlockGenerator(child_style, child_stream, context);
      floated_generators.push(generator);
      return true; // continue
    });
    return new FloatGenerator(this.style, this.stream, floated_generators);
  };

  LayoutGenerator.prototype._createChildBlockGenerator = function(style, stream, context){
    if(style.hasFlipFlow()){
      return new FlipGenerator(style, stream, context);
    }

    // if child style with 'pasted' attribute, yield block with direct content by LazyGenerator.
    // notice that this is nehan.js original attribute,
    // is required to show some html(like form, input etc) that can't be handled by nehan.js.
    if(style.isPasted()){
      return new LazyGenerator(style, style.createBlock({content:style.getContent()}));
    }

    // switch generator by display
    switch(style.display){
    case "list-item":
      return new ListItemGenerator(style, stream);

    case "table":
      return new TableGenerator(style, stream);

    case "table-row":
      return new TableRowGenerator(style, stream);

    case "table-cell":
      return new TableCellGenerator(style, stream);
    }

    // switch generator by markup name
    switch(style.getMarkupName()){
    case "img":
      return new LazyGenerator(style, style.createImage());

    case "hr":
      // create block with no elements, but with edge(border).
      return new LazyGenerator(style, style.createBlock());

    case "first-line":
      return new FirstLineGenerator(style, stream);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      return new SectionRootGenerator(style, stream);

    case "section":
    case "article":
    case "nav":
    case "aside":
      return new SectionContentGenerator(style, stream);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return new HeaderGenerator(style, stream);

    case "ul":
    case "ol":
      return new ListGenerator(style, stream);

    default:
      return new BlockGenerator(style, stream);
    }
  };

  LayoutGenerator.prototype._createTextGenerator = function(style, text){
    if(text instanceof Nehan.Tcy || text instanceof Nehan.Word){
      return new TextGenerator(this.style, new Nehan.TokenStream(text.getData(), {
	tokens:[text]
      }));
    }
    var content = text.getContent();
    return new TextGenerator(this.style, new Nehan.TokenStream(content, {
      lexer:new Nehan.TextLexer(content)
    }));
  };

  LayoutGenerator.prototype._createChildInlineGenerator = function(style, stream, context){
    if(style.isInlineBlock()){
      return new InlineBlockGenerator(style, stream);
    }
    if(style.isPasted()){
      return new LazyGenerator(style, style.createLine({content:style.getContent()}));
    }
    switch(style.getMarkupName()){
    case "ruby":
      return new TextGenerator(style, stream);
    case "img":
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      return new LazyGenerator(style, style.createImage());
    case "a":
      return new LinkGenerator(style, stream);
    default:
      return new InlineGenerator(style, stream);
    }
  };

  return LayoutGenerator;
})();

