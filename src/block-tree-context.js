var BlockTreeContext = (function(){
  function BlockTreeContext(page, markup, stream, context){
    this.page = page;
    this.markup = markup;
    this.stream = stream;
    this.context = context;
    this.curExtent = 0;
    this.maxExtent = page.getContentExtent();
    this.flow = page.flow;
  }

  BlockTreeContext.prototype = {
    addElement : function(element){
      var extent = element.getBoxExtent(this.flow);
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
    },
    pushBackToken : function(){
      this.stream.prev();
    },
    getNextToken : function(){
      var token = this.stream.get();
      if(token && Token.isTag(token) && this.markup){
	token.inherit(this.markup);
      }
      return token;
    }
  };
  
  return BlockTreeContext;
})();

