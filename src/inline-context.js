var InlineContext = (function(){
  function InlineContext(){
    this.tagStack = new TagStack();
    this.fontSizeStack = [];
    this.fontColorStack = [];
    this.lineContext = new LineContext();
  }

  InlineContext.prototype = {
    setNewLine : function(parent, stream, context){
      this.lineContext.setNewLine(parent, stream, context);
    },
    // this func is used when we want temporary context and temporary font size.
    // mainly used from ruby label generator.
    setFixedFontSize : function(font_size){
      this.fixedFontSize = font_size;
    },
    getTagStack : function(){
      return this.tagStack;
    },
    getFontSize : function(parent){
      if(this.fixedFontSize){
	return this.fixedFontSize;
      }
      if(this.fontSizeStack.length > 0){
	return this.fontSizeStack[this.fontSizeStack.length - 1];
      }
      return parent.fontSize;
    },
    getFontColor : function(parent){
      if(this.fontColorStack.length > 0){
	return this.fontColorStack[this.fontColorStack.length - 1];
      }
      return parent.color;
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
    pushTag : function(tag, parent){
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
      this.tagStack.push(tag);
    },
    popTag : function(){
      var tag = this.tagStack.pop();
      if(tag){
	this._updateStatus(tag);
      }
      return tag;
    },
    popTagByName : function(name){
      var tag = this.tagStack.popByName(name);
      if(tag){
	this._updateStatus(tag);
      }
      return tag;
    },
    _updateStatus : function(tag){
      if(tag.fontSize && this.fontSizeStack.length > 0){
	this.fontSizeStack.pop();
      }
      if(tag.color && this.fontColorStack.length > 0){
	this.fontColorStack.pop();
      }
    }
  };

  return InlineContext;
})();
