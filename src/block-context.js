var BlockContext = (function(){
  function BlockContext(max_extent, extent_edges){
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
    this.breakAfter = false;
    this.extentEdges = extent_edges || {before:0, after:0};
  }

  BlockContext.prototype = {
    isSpaceLeft : function(){
      return this.getRestExtent() > 0;
    },
    hasSpaceFor : function(extent, block_opt){
      return this.getRestExtent() >= this.getContextExtent(extent, block_opt || {});
    },
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    addElement : function(element, extent, block_opt){
      this.curExtent += this.getContextExtent(extent, block_opt || {});
      if(element.breakAfter){
	this.breakAfter = true;
      }
      if(element.pushed){
	this.pushedElements.push(element);
      } else if(element.pulled){
	this.pulledElements.unshift(element);
      } else {
	this.elements.push(element);
      }
    },
    getCurExtent : function(){
      return this.curExtent;
    },
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
    },
    getContextExtent : function(extent, block_opt){
      return extent + this.getEdgeExtent(block_opt || {});
    },
    getEdgeExtent : function(block_opt){
      var edge_extent = 0;
      block_opt = block_opt || {};
      if(block_opt.isFirst){
	edge_extent += this.extentEdges.before;
      }
      if(block_opt.isLast){
	edge_extent += this.extentEdges.after;
      }
      return edge_extent;
    },
    getMaxExtent : function(){
      return this.maxExtent;
    },
    getElements : function(){
      return this.pulledElements
	.concat(this.elements)
	.concat(this.pushedElements);
    }
  };

  return BlockContext;
})();

