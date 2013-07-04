var BlockContext = (function(){
  function BlockContext(){
    this.tagStack = new TagStack();
  }

  BlockContext.prototype = {
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
    getTagDepthByName : function(name){
      return this.tagStack.getDepthByName(name);
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
    },
    isHeaderEnable : function(){
      return this.tagStack.exists(function(tag){
	return tag.isHeaderTag();
      });
    }
  };

  return BlockContext;
})();
