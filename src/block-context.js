var BlockContext = (function(){
  function BlockContext(max_extent){
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
    this.breakAfter = false;
  }

  BlockContext.prototype = {
    isSpaceLeft : function(){
      return this.getRestExtent() > 0;
    },
    hasSpaceFor : function(extent){
      return this.getRestExtent() >= extent;
    },
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    _onAddElement : function(element, extent){
      this.curExtent += extent;
      if(element.breakAfter){
	this.breakAfter = true;
      }
    },
    addElement : function(element, extent){
      this.elements.push(element);
      this._onAddElement(element, extent);
    },
    pushElement : function(element, extent){
      this.pushedElements.push(element);
      this._onAddElement(element, extent);
    },
    pullElement : function(element, extent){
      this.pulledElements.unshift(element);
      this._onAddElement(element, extent);
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

