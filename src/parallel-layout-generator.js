var ParallelLayoutGenerator = (function(){
  function ParallelLayoutGenerator(style, generators){
    LayoutGenerator.call(this, style, null);
    this.generators = generators;
  }
  Class.extend(ParallelLayoutGenerator, LayoutGenerator);

  ParallelLayoutGenerator.prototype.yield = function(context){
    if(this.hasCache()){
      return this.popCache();
    }
    context = context || this._createStartContext();
    //console.log("[%s]:para yield, rest_extent = %d", this.style.getMarkupName(), context.getBlockRestExtent());
    var blocks = this._yieldParallelBlocks(context);
    if(blocks === null){
      return null;
    }
    var wrap_block = this._wrapBlocks(blocks);
    var wrap_extent = wrap_block.getBoxExtent(this.style.flow);
    //wrap_block.debug("wrap_block");
    if(context.getBlockExtent() + wrap_extent > context.getBlockMaxExtent()){
      //console.log("[%s]:wrap box layout over", this.style.markup.name);
      this.pushCache(wrap_block);
      return null;
    }
    context.addBlockElement(wrap_block, wrap_extent);
    return wrap_block;
  };

  ParallelLayoutGenerator.prototype.hasNext = function(context){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    return List.exists(this.generators, function(gen){
      //console.log("%s gen has next:%o", gen.style.getMarkupName(), gen.hasNext());
      return gen.hasNext();
    });
  };

  ParallelLayoutGenerator.prototype._yieldParallelBlocks = function(context){
    var rest_extent = context.getBlockRestExtent();
    var blocks = List.map(this.generators, function(gen){
      var rest_measure = gen.style.getContentMeasure();
      var edge_extent = gen.style.parent2? gen.style.parent2.getEdgeExtent() : 0;
      return gen.yield(context.createStaticBlockContext(rest_measure, rest_extent - edge_extent));
    });
    return List.forall(blocks, function(block){ return block === null; })? null : blocks;
  };

  ParallelLayoutGenerator.prototype._wrapBlocks = function(blocks){
    var flow = this.style.flow;
    var generators = this.generators;
    var max_block = List.maxobj(blocks, function(block){
      return block? block.getBoxExtent(flow) : 0;
    });
    var max_content_extent = max_block.getContentExtent(flow);
    var uniformed_blocks = List.mapi(blocks, function(i, block){
      return block || generators[i].style.createBlock({elements:[], extent:max_content_extent});
    });
    return this.style.createBlock({
      elements:uniformed_blocks,
      extent:max_block.getBoxExtent(flow)
    });
  };

  return ParallelLayoutGenerator;
})();


