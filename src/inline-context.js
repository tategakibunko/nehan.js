var InlineContext = (function(){
  function InlineContext(){
    this.tagStack = new TagStack();
    this.fontSizeStack = [];
    this.fontColorStack = [];
    this.emphaStack = [];
  }

  InlineContext.prototype = {
    // this func is used when we want temporary context and temporary font size.
    // mainly used from ruby label generator.
    setFixedFontSize : function(font_size){
      this.fixedFontSize = font_size;
    },
    getHeadTag : function(){
      return this.tagStack.getHead();
    },
    getCurEmpha : function(){
      return List.last(this.emphaStack, "");
    },
    getTagStack : function(){
      return this.tagStack;
    },
    getFontSize : function(){
      if(this.fixedFontSize){
	return this.fixedFontSize;
      }
      return List.last(this.fontSizeStack, Layout.fontSize);
    },
    getFontColor : function(parent){
      return List.last(this.fontColorStack, parent.color);
    },
    getTagDepth : function(){
      return this.tagStack.getDepth();
    },
    isTagEnable : function(fn){
      return this.tagStack.exists(fn);
    },
    isTagNameEnable : function(tag_name){
      return this.tagStack.isTagNameEnable(tag_name);
    },
    isBoldEnable : function(){
      return this.tagStack.exists(function(tag){
	return tag.isBoldTag();
      });
    },
    isEmpty : function(){
      return this.tagStack.isEmpty();
    },
    findTag : function(fn){
      return this.tagStack.find(fn);
    },
    findLastTagByName : function(name){
      return this.tagStack.revfind(function(tag){
	return tag.getName() == name;
      });
    },
    pushTag : function(tag){
      var font_size = tag.getCssAttr("font-size");
      if(font_size){
	var cur_font_size = this.getFontSize(parent);
	var new_font_size = UnitSize.getUnitSize(font_size, cur_font_size);
	tag.setFontSizeUpdate(new_font_size);
	this.fontSizeStack.push(new_font_size);
      }
      var font_color = tag.getCssAttr("color", "inherit");
      if(font_color !== "inherit"){
	font_color = new Color(font_color);

	// store inline color update info in markup object.
	tag.setFontColorUpdate(font_color);
	this.fontColorStack.push(font_color);
      }
      var empha = tag.getCssAttr("empha-mark");
      if(empha){
	this.emphaStack.push(empha);
      }
      this.tagStack.push(tag);
    },
    popTag : function(){
      var tag = this.tagStack.pop();
      if(tag){
	this._onPopTag(tag);
      }
      return tag;
    },
    popTagByName : function(name){
      var tag = this.tagStack.popByName(name);
      if(tag){
	this._onPopTag(tag);
      }
      return tag;
    },
    _onPopTag : function(tag){
      if(tag.fontSize && this.fontSizeStack.length > 0){
	this.fontSizeStack.pop();
      }
      if(tag.color && this.fontColorStack.length > 0){
	this.fontColorStack.pop();
      }
      if(tag.isEmphaTag()){
	this.emphaStack.pop();
      }
    }
  };

  return InlineContext;
})();
