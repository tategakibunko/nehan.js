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
    Nehan.LayoutGenerator.call(this, context);
    context.parallelGenerators = this._createChildGenerators(context);
    context.stream = null;
  }
  Nehan.Class.extend(ParallelGenerator, Nehan.BlockGenerator);

  ParallelGenerator.prototype._createChildGenerators = function(context){
    throw "ParallelGenerator::_createChildGenerators must be implemented in child class";
  };

  ParallelGenerator.prototype._isBreakAfter = function(blocks){
    return Nehan.List.exists(blocks, function(block){
      return block && block.breakAfter;
    });
  };

  ParallelGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this.context.popCache();
    }
    var box = this.context.yieldParallelBlocks();
    if(!box){
      return null;
    }
    box.breakAfter = this._isBreakAfter(box.elements);
    return box;
  };

  return ParallelGenerator;
})();


