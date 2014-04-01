var LayoutGenerator = (function(){
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._childLayout = null;
    this._cachedElements = [];
    this._terminate = false;
  }

  LayoutGenerator.prototype.setTerminate = function(status){
    this._terminate = status;
  };

  LayoutGenerator.prototype.setChildLayout = function(generator){
    this._childLayout = generator;
  };

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

  LayoutGenerator.prototype.hasChildLayout = function(){
    if(this._childLayout && this._childLayout.hasNext()){
      //console.log("layout child %s has next", this._childLayout.style.getMarkupName());
      return true;
    }
    return false;
  };

  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._childLayout.yield(context);
    //console.log("child next:%o", next);
    return next;
  };

  LayoutGenerator.prototype.peekLastCache = function(){
    return List.last(this._cachedElements);
  };

  LayoutGenerator.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      //console.info("[%s]:multi cache detected! count = %d, element = %o", this.style.getMarkupName(), cache_count, element);
      if(cache_count >= Config.maxRollbackCount){
	console.error("too many cache count(%d), force terminate", cache_count);
	this.setTerminate(true); // this error sometimes causes infinite loop, so force terminate generator.
	return;
      }
    }
    if(element instanceof Box){
      var flow = this.style.flow;
      var measure = element.getBoxMeasure(flow);
      var extent = element.getBoxExtent(flow);
      //console.log("[%s]:push cache:%o(%d,%d)", this.style.getMarkupName(), element, measure, extent);
    }
    element.cacheCount = cache_count + 1;
    this._cachedElements.push(element);
  };

  LayoutGenerator.prototype.popCache = function(){
    var cache = this._cachedElements.pop();
    //console.log("[%s]:pop cache:%o", this.style.markup.name, cache);
    return cache;
  };

  LayoutGenerator.prototype.clearCache = function(){
    this._cachedElements = [];
  };

  LayoutGenerator.prototype._createStartContext = function(){
    return new LayoutContext(
      new BlockLayoutContext(this.style.getContentExtent()),
      new InlineLayoutContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createChildBlockContext = function(current_context, child_style){
    return new LayoutContext(
      new BlockLayoutContext(current_context.getBlockRestExtent() - child_style.getEdgeExtent()),
      new InlineLayoutContext(current_context.getInlineMaxMeasure() - child_style.getEdgeMeasure())
    );
  };

  return LayoutGenerator;
})();

