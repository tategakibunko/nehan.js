var LayoutGenerator = (function(){
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._childLayout = null;
    this._cachedElements = [];
    this._terminate = false;
  }

  LayoutGenerator.prototype.yield = function(parent_context){
    var context = parent_context? this._createChildContext(parent_context) : this._createStartContext();
    return this._yield(context);
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  LayoutGenerator.prototype.cloneStyle = function(opt){
    this.style = this.style.clone(opt);
  };

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
      return true;
    }
    return false;
  };

  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._childLayout.yield(context);
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

  LayoutGenerator.prototype._createChildContext = function(context){
    return new LayoutContext(
      new BlockLayoutContext(context.getBlockRestExtent() - this.style.getContextEdgeExtent()),
      new InlineLayoutContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createStream = function(tag){
    switch(tag.getName()){
    case "ruby": return new RubyTagStream(tag);
    default: return new TokenStream(tag.getContent());
    } 
  };

  return LayoutGenerator;
})();

