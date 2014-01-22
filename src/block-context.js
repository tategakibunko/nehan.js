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
      var is_absolute = element.isPositionAbsolute();
      var extent = element.getBoxExtent(this.page.flow);
      if(element instanceof Box && !element.isTextLine() && extent <= 0){
	element.pageBreakAfter = true;
      }
      if(!is_absolute && this.curExtent + extent > this.maxExtent){
	throw "OverflowBlock";
      }
      this.page.addChildBlock(element);
      if(!is_absolute){
	this.curExtent += extent;
      }
      if(!is_absolute && this.curExtent === this.maxExtent){
	throw "FinishBlock";
      }
    }
  };
  
  return BlockContext;
})();

