var ParallelGenerator = (function(){
  /**
     @memberof Nehan
     @class ParallelGenerator
     @classdesc wrapper generator to generate multicolumn layout like LI(list-mark,list-body) or TR(child TD).
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
     @param generators {Array<Nehan.LayoutGenerator>}
  */
  function ParallelGenerator(style, generators){
    LayoutGenerator.call(this, style, null);
    this.generators = generators;
  }
  Nehan.Class.extend(ParallelGenerator, LayoutGenerator);

  ParallelGenerator.prototype._yield = function(context){
    if(this.hasCache()){
      return this.popCache();
    }
    var blocks = this._yieldParallelBlocks(context);
    if(blocks === null){
      return null;
    }
    var wrap_block = this._wrapBlocks(context, blocks);
    var wrap_extent = wrap_block.getLayoutExtent(this.style.flow);
    if(!context.hasBlockSpaceFor(wrap_extent)){
      this.pushCache(wrap_block);
      return null;
    }
    context.addBlockElement(wrap_block, wrap_extent);
    return wrap_block;
  };

  /**
     @memberof Nehan.ParallelGenerator
     @method hasNext
     @override
     @param context {Nehan.CurosrContext}
     @return {boolean}
  */
  ParallelGenerator.prototype.hasNext = function(context){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    return Nehan.List.exists(this.generators, function(gen){
      return gen.hasNext();
    });
  };

  ParallelGenerator.prototype._yieldParallelBlocks = function(context){
    var blocks = Nehan.List.map(this.generators, function(gen){
      return gen.yield(context);
    });
    return Nehan.List.forall(blocks, function(block){ return block === null; })? null : blocks;
  };

  ParallelGenerator.prototype._findMaxBlock = function(blocks){
    var flow = this.style.flow;
    return Nehan.List.maxobj(blocks, function(block){
      return block? block.getLayoutExtent(flow) : 0;
    });
  };

  ParallelGenerator.prototype._alignContentExtent = function(blocks, content_extent){
    var flow = this.style.flow;
    var generators = this.generators;
    return Nehan.List.map(blocks, function(block, i){
      if(block === null){
	return generators[i].style.createBlock({
	  elements:[],
	  extent:content_extent
	});
      }
      return block.resizeExtent(flow, content_extent);
    });
  };

  ParallelGenerator.prototype._wrapBlocks = function(context, blocks){
    var flow = this.style.flow;
    var max_block = this._findMaxBlock(blocks);
    var wrap_extent = max_block.getContentExtent(flow);
    var rest_extent = context.getBlockRestExtent() - wrap_extent;
    var after_edge_size = this.style.getEdgeAfter();
    var uniformed_blocks = this._alignContentExtent(blocks, wrap_extent);
    return this.style.createBlock({
      elements:uniformed_blocks,
      extent:max_block.getLayoutExtent(flow),
      useBeforeEdge:this.isFirstOutput(),
      useAfterEdge:(!this.hasNext() && after_edge_size <= rest_extent)
    });
  };

  return ParallelGenerator;
})();


