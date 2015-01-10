var BlockContext = (function(){
  /** @memberof Nehan
      @class BlockContext
      @classdesc context data of block level.
      @constructor
      @param {int} max_extent - maximus position of block in px.
      @param opt {Object} - optional argument
      @param opt.isFirstBlock {boolean} - is this first generated block by this context object?
      @param opt.contextEdge {Object} - special edge size of this block context
      @param opt.contextEdge.before {int} - before edge size in px
      @param opt.contextEdge.after {int} - after edge size in px
  */
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
    /**
       check if this block context has enough size of [extent]
       @memberof Nehan.BlockContext
       @method hasSpaceFor
       @param extent {int} - size of extent in px
       @param is_last_block {boolean} - is this the last output of source block generation? default false
       @return {boolean}
    */
    hasSpaceFor : function(extent, is_last_block){
      is_last_block = is_last_block || false;
      var cancel_size = this.getCancelSize(is_last_block);
      return this.getRestExtent() >= (extent - cancel_size);
    },
    /**
       check if this block context has break after flag.
       @memberof Nehan.BlockContext
       @method hasBreakAfter
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    /**
       add box element to this block context
       @memberof Nehan.BlockContext
       @method addElement
       @param element {Nehan.Box} - Box object added to this context
       @param extent {int} - extent size of this element
    */
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
    /**
       cancel edge is available if posotion of current block cursor is not at first or at last,
       because first edge of block is already added to parent block in first time yielding,
       and last edge of block is only added to last block.
       @memberof Nehan.BlockContext
       @param is_last_block {boolean}
       @return {Object} {before:[int value], after:[int value]}
    */
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
    /**
       get size amount that is abled to be eliminated align to block direction, obtained by {@link Nehan.BlockContext.getCancelEdge}.
       @memberof Nehan.BlockContext
       @param is_last_block {boolean}
       @return {int} canceled size of extent
    */
    getCancelSize : function(is_last_block){
      var cancel_edge = this.getCancelEdge(is_last_block);
      return cancel_edge.before + cancel_edge.after;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} current extent
    */
    getCurExtent : function(){
      return this.curExtent;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} current rest size of extent
    */
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} max available size of this block context
    */
    getMaxExtent : function(){
      return this.maxExtent;
    },
    /**
       @memberof Nehan.BlockContext
       @return {Array.<Nehan.Box>} current elements added to this block context
    */
    getElements : function(){
      return this.pulledElements
	.concat(this.elements)
	.concat(this.pushedElements);
    }
  };

  return BlockContext;
})();

