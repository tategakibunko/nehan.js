var BlockGenerator = (function(){
  function BlockGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
  }
  Class.extend(BlockGenerator, LayoutGenerator);

  var get_line_start_pos = function(line){
    var head = line.elements[0];
    return (head instanceof Box)? head.style.getMarkupPos() : head.pos;
  };

  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline, and measure size varies, reget line if need.
    if(this.hasChildLayout() && cache.display === "inline"){
      if(cache.getBoxMeasure(this.style.flow) <= this.style.getContentMeasure() && cache.br){
	return cache;
      }
      this._childLayout.stream.setPos(get_line_start_pos(cache)); // rewind stream to the head of line.
      this._childLayout.clearCache(); // stream rewinded, so cache must be destroyed.
      return this.yieldChildLayout(context);
    }
    return cache;
  };

  BlockGenerator.prototype._yield = function(context){
    if(!context.isBlockSpaceLeft()){
      return null;
    }
    while(true){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var extent = element.getBoxExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent)){
	this.pushCache(element);
	break;
      }
      if(this.style.isPushed()){
	context.pushBockElement(element, extent);
      } else if(this.style.isPulled()){
	context.pullBlockElement(element, extent);
      } else {
	context.addBlockElement(element, extent);
      }
      if(!context.isBlockSpaceLeft()){
	break;
      }
    }
    return this._createBlock(context);
  };

  BlockGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }
    
    if(this.hasChildLayout()){
      return this.yieldChildLayout(context);
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // if tag token, inherit style
    var child_style = (token instanceof Tag)? new StyleContext(token, this.style) : this.style;

    // inline text or inline tag
    if(Token.isText(token) || child_style.isInline()){
      this.stream.prev();
      this.setChildLayout(new InlineGenerator(this.style, this.stream));
      return this.yieldChildLayout(context);
    }

    // child block with float
    if(child_style.isFloated()){
      this.stream.prev();
      this.setChildLayout(new FloatGenerator(this.style, this.stream));
      return this.yieldChildLayout(context);
    }

    if(child_style.display === "list-item"){
      this.setChildLayout(new ListItemGenerator(child_style, this._createStream(token), context));
      return this.yieldChildLayout(context);
    }

    if(child_style.display === "table-row"){
      this.setChildLayout(new TableRowGenerator(child_style, this._createStream(token), context));
      return this.yieldChildLayout(context);
    }

    switch(child_style.getMarkupName()){
    case "ul":
    case "ol":
      this.setChildLayout(new ListGenerator(child_style, this._createStream(token)));
      return this.yieldChildLayout(context);
    default:
      this.setChildLayout(new BlockGenerator(child_style, this._createStream(token)));
      return this.yieldChildLayout(context);
    }
  };

  return BlockGenerator;
})();

