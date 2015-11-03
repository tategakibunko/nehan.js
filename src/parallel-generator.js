Nehan.ParallelGenerator = (function(){
  /**
     @memberof Nehan
     @class ParallelGenerator
     @classdesc wrapper generator to generate multicolumn layout like LI(list-mark,list-body) or TR(child TD).
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.Style}
     @param generators {Array<Nehan.LayoutGenerator>}
  */
  function ParallelGenerator(context, generators){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(ParallelGenerator, Nehan.LayoutGenerator);

  ParallelGenerator.prototype._yield = function(){
    if(this.context.hasCache()){
      return this.context.popCache();
    }
    var blocks = this._yieldParallelBlocks();
    if(blocks === null){
      return null;
    }
    var wrap_block = this._wrapBlocks(blocks);
    var wrap_extent = wrap_block.getLayoutExtent(this.context.style.flow);
    if(!this.context.layoutContext.hasBlockSpaceFor(wrap_extent)){
      this.context.pushCache(wrap_block);
      return null;
    }
    this.context.layoutContext.addBlockElement(wrap_block, wrap_extent);
    return wrap_block;
  };

  /**
     @memberof Nehan.ParallelGenerator
     @method hasNext
     @override
     @param context {Nehan.CurosrContext}
     @return {boolean}
  */
  ParallelGenerator.prototype.hasNext = function(){
    if(this.context.terminate){
      return false;
    }
    if(this.context.hasCache()){
      return true;
    }
    return this.context.hasNextParallelLayout();
  };

  ParallelGenerator.prototype._yieldParallelBlocks = function(){
    var blocks = this.context.parallelGenerators.map(function(gen){
      return gen.yield();
    });
    return blocks.every(function(block){
      return block === null;
    })? null : blocks;
  };

  ParallelGenerator.prototype._findMaxBlock = function(blocks){
    var flow = this.context.style.flow;
    return Nehan.List.maxobj(blocks, function(block){
      return block? block.getLayoutExtent(flow) : 0;
    });
  };

  ParallelGenerator.prototype._alignContentExtent = function(blocks, content_extent){
    var flow = this.context.style.flow;
    var generators = this.context.parallelGenerators;
    return blocks.map(function(block, i){
      if(block === null){
	return generators[i].context.style.createBlock({
	  elements:[],
	  extent:content_extent
	});
      }
      return block.resizeExtent(flow, content_extent);
    });
  };

  ParallelGenerator.prototype._wrapBlocks = function(blocks){
    var flow = this.context.style.flow;
    var max_block = this._findMaxBlock(blocks);
    var wrap_extent = max_block.getContentExtent(flow);
    var rest_extent = this.context.layoutContext.getBlockRestExtent() - wrap_extent;
    var after_edge_size = this.context.style.getEdgeAfter();
    var uniformed_blocks = this._alignContentExtent(blocks, wrap_extent);
    return this.context.style.createBlock({
      elements:uniformed_blocks,
      extent:max_block.getLayoutExtent(flow),
      useBeforeEdge:this.context.isFirstOutput(),
      useAfterEdge:(!this.hasNext() && after_edge_size <= rest_extent)
    });
  };

  return ParallelGenerator;
})();


