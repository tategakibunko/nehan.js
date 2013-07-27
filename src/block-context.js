var BlockContext = (function(){
  function BlockContext(page){
    this.page = page;
    this.curExtent = 0;
    this.maxExtent = page.getContentExtent();
  }

  BlockContext.prototype = {
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
    },
    addElement : function(element){
      var extent = element.getBoxExtent(this.page.flow);
      console.log("addBlcokElement:%o(extent = %d)", element, extent);
      if(element instanceof Box && !element.isTextLine() && extent <= 0){
	throw "EmptyBlock";
      }
      if(this.curExtent + extent > this.maxExtent){
	throw "OverflowBlock";
      }
      this.page.addChildBlock(element);
      this.curExtent += extent;
      if(this.curExtent === this.maxExtent){
	throw "FinishBlock";
      }
    }
  };
  
  return BlockContext;
})();

