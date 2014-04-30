var FloatRestGenerator = (function(){
  function FloatRestGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(FloatRestGenerator, BlockGenerator);

  var get_line_start_pos = function(line){
    var head = line.elements[0];
    return (head instanceof Box)? head.style.getMarkupPos() : head.pos;
  };

  FloatRestGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline, and measure size varies, reget line if need.
    if(this.hasChildLayout() && cache.display === "inline"){
      if(cache.getLayoutMeasure(this.style.flow) <= this.style.contentMeasure && cache.br){
	return cache;
      }
      this._childLayout.stream.setPos(get_line_start_pos(cache)); // rewind stream to the head of line.
      this._childLayout.clearCache(); // stream rewinded, so cache must be destroyed.
      return this.yieldChildLayout(context);
    }
    return cache;
  };

  return FloatRestGenerator;
})();

