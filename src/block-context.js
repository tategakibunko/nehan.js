var BlockContext = (function(){
  function BlockContext(){
    this.tagStack = new TagStack();
  }

  BlockContext.prototype = {
    pushBlock : function(tag){
      var parent_tag = this.getHeadTag();
      if(parent_tag){
	// copy 'inherit' value from parent in 'markup' level.
	tag.inherit(parent_tag);
      }
      this.tagStack.push(tag);
    },
    popBlock : function(){
      return this.tagStack.pop();
    },
    getHeadTag : function(){
      return this.tagStack.getHead();
    },
    getTagStack : function(){
      return this.tagStack;
    },
    getDepth : function(){
      return this.tagStack.getDepth();
    },
    getDepthByName : function(name){
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
    isHeaderEnable : function(){
      return this.tagStack.exists(function(tag){
	return tag.isHeaderTag();
      });
    },
    isTagNameEnable : function(tag_name){
      return this.tagStack.isTagNameEnable(tag_name);
    }
  };

  return BlockContext;
})();
