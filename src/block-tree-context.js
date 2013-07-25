var BlockTreeContext = (function(){
  function BlockTreeContext(page){
    this.page = page;
    this.curExtent = 0;
    this.maxExtent = page.getContentExtent();
  }

  BlockTreeContext.prototype = {
    addElement : function(element){
      var extent = element.getBoxExtent(this.page.flow);
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
  
  return BlockTreeContext;
})();

