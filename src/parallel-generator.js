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
  }
  Nehan.Class.extend(ParallelGenerator, Nehan.BlockGenerator);

  ParallelGenerator.prototype._isBreakAfter = function(blocks){
    return Nehan.List.exists(blocks, function(block){
      console.info("para block:%o, breakAfter=%o", block, block.breakAfter);
      return block && block.breakAfter;
    });
  };

  ParallelGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this.context.popCache();
    }
    var box = this.context.yieldParallelBlocks();
    box.breakAfter = this._isBreakAfter(box.elements);
    return box;
  };

  return ParallelGenerator;
})();


