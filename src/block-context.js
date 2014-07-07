var BlockContext = (function(){
  function BlockContext(max_extent, opt){
    opt = opt || {};
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
    this.breakAfter = false;
    this.contextEdge = opt.contextEdge || {before:0, after:0};
    this.isFirstBlock = (typeof opt.isFirstBlock === "undefined")? true : opt.isFirstBlock;
  }

  BlockContext.prototype = {
    hasSpaceFor : function(extent, is_last_block){
      is_last_block = is_last_block || false;
      var cancel_size = this.getCancelSize(is_last_block);
      return this.getRestExtent() >= (extent - cancel_size);
    },
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    addElement : function(element, extent){
      this.curExtent += extent;
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
    getCancelEdge : function(is_last_block){
      return {
	// if not first output, we can reduce before edge.
	// bacause first edge is only available to 'first' block.
	before:(this.isFirstBlock? 0 : this.contextEdge.before),
	
	// if not last output, we can reduce after edge,
	// because after edge is only available to 'last' block.
	after:(is_last_block? 0 : this.contextEdge.after)
      };
    },
    getCancelSize : function(is_last_block){
      var cancel_edge = this.getCancelEdge(is_last_block);
      return cancel_edge.before + cancel_edge.after;
    },
    getCurExtent : function(){
      return this.curExtent;
    },
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
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

