Nehan.BlockContext = (function(){
  /** @memberof Nehan
      @class BlockContext
      @classdesc context data of block level.
      @constructor
      @param {int} max_extent - maximus position of block in px.
      @param opt {Object} - optional argument
  */
  function BlockContext(max_extent, opt){
    opt = opt || {};
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
    this.breakAfter = false;
    this.lineNo = opt.lineNo || 0;
  }

  /**
   check if this block context has enough size of [extent]
   @memberof Nehan.BlockContext
   @method hasSpaceFor
   @param extent {int} - size of extent in px
   @return {boolean}
   */
  BlockContext.prototype.hasSpaceFor = function(extent){
    return this.getRestExtent() >= extent;
  };
  /**
   check if this block context has break after flag.
   @memberof Nehan.BlockContext
   @method hasBreakAfter
   @return {boolean}
   */
  BlockContext.prototype.hasBreakAfter = function(){
    return this.breakAfter;
  };
  /**
   add box element to this block context
   @memberof Nehan.BlockContext
   @method addElement
   @param element {Nehan.Box} - Box object added to this context
   @param extent {int} - extent size of this element
   */
  BlockContext.prototype.addElement = function(element, extent){
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
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} current extent
   */
  BlockContext.prototype.getCurExtent = function(){
    return this.curExtent;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} current rest size of extent
   */
  BlockContext.prototype.getRestExtent = function(){
    return this.maxExtent - this.curExtent;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} max available size of this block context
   */
  BlockContext.prototype.getMaxExtent = function(){
    return this.maxExtent;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} max available size of this block context
   */
  BlockContext.prototype.getLineNo = function(){
    return this.lineNo;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} max available size of this block context
   */
  BlockContext.prototype.incLineNo = function(){
    return this.lineNo++;
  };
  /**
   @memberof Nehan.BlockContext
   @return {Array.<Nehan.Box>} current elements added to this block context
   */
  BlockContext.prototype.getElements = function(){
    return this.pulledElements
      .concat(this.elements)
      .concat(this.pushedElements);
  };

  return BlockContext;
})();

