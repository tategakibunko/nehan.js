Nehan.ParallelGenerator = (function(){
  /**
   @memberof Nehan
   @class ParallelGenerator
   @classdesc wrapper generator to generate multicolumn layout like LI(list-mark,list-body) or TR(child TD).
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ParallelGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(ParallelGenerator, Nehan.BlockGenerator);

  ParallelGenerator.prototype._onInitialize = function(context){
    context.setParallelGenerators(this._createChildGenerators(context));
    context.stream = null;
  };

  ParallelGenerator.prototype._createChildGenerators = function(context){
    throw "_createChildGenerators is not defined.";
  };

  ParallelGenerator.prototype._popCache = function(){
    var cache = this.context.popCache();
    if(cache && cache.elements){
      cache.elements.forEach(function(element){
	element.breakAfter = false;
      });
    }
    return cache;
  };

  ParallelGenerator.prototype._onElement = function(element){
    element.breakAfter = Nehan.List.exists(element.elements, function(block){
      return block && block.breakAfter;
    }) && this.hasNext();
  };

  ParallelGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this._popCache();
    }
    return this.context.yieldParallelBlocks() || null;
  };

  return ParallelGenerator;
})();


