var InlineContext = (function(){
  function InlineContext(){
    this.tagStack = new TagStack();
  }

  InlineContext.prototype = {
    pushTag : function(tag){
      this.tagStack.push(tag);
    },
    popTag : function(){
      return this.tagStack.pop();
    },
    getHeadTag : function(){
      return this.tagStack.getHead();
    },
    getTagStack : function(){
      return this.tagStack;
    },
    getTagDepth : function(){
      return this.tagStack.getDepth();
    },
    findTag : function(fn){
      return this.tagStack.find(fn);
    },
    isEmpty : function(){
      return this.tagStack.isEmpty();
    },
    isTagEnable : function(fn){
      return this.tagStack.exists(fn);
    },
    isTagNameEnable : function(tag_name){
      return this.tagStack.isTagNameEnable(tag_name);
    }
  };

  return InlineContext;
})();
