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
      if(cache_count >= Config.maxRollbackCount){
	console.error("too many cache count(%d), force terminate", cache_count);
	this.setTerminate(true); // this error sometimes causes infinite loop, so force terminate generator.
	return;
      }
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

  LayoutGenerator.prototype._createFloatBlockContext = function(context){
    return new LayoutContext(
      new BlockLayoutContext(context.getBlockRestExtent() - this.style.getEdgeExtent()),
      new InlineLayoutContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createParallelBlockContext = function(context){
    var edge_extent = this.style.parent2? this.style.parent2.getEdgeExtent() : 0;
    return new LayoutContext(
      new BlockLayoutContext(context.getBlockRestExtent() - edge_extent),
      new InlineLayoutContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createChildBlockContext = function(context, child_style){
    var edge_extent = child_style? child_style.getEdgeExtent() : 0;
    var edge_measure = child_style? child_style.getEdgeMeasure() : 0;
    return new LayoutContext(
      new BlockLayoutContext(context.getBlockRestExtent() - edge_extent),
      new InlineLayoutContext(context.getInlineMaxMeasure() - edge_measure)
    );
  };

  LayoutGenerator.prototype._createChildInlineContext = function(context){
    return new LayoutContext(
      context.block,
      new InlineLayoutContext(context.getInlineRestMeasure())
    );
  };

  return LayoutGenerator;
})();

