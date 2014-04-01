var BlockLayoutContext = (function(){
  function BlockLayoutContext(max_extent){
    this.extent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
  }

  BlockLayoutContext.prototype = {
    addElement : function(element, extent){
      this.elements.push(element);
      this.extent += extent;
    },
    pushElement : function(element, extent){
      this.pushedElements.push(element);
      this.extent += extent;
    },
    pullElement : function(element, extent){
      this.pulledElements.unshift(element);
      this.extent += extent;
    },
    setMaxExtent : function(extent){
      this.maxExtent = extent;
    },
    getExtent : function(){
      return this.extent;
    },
    getRestExtent : function(){
      return this.maxExtent - this.extent;
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

  return BlockLayoutContext;
})();

