var InlineBoxGenerator = StaticBlockGenerator.extend({
  _getBoxType : function(){
    return "ibox";
  },
  _getBoxContent : function(){
    return this.markup.isChildContentTag()? this.markup.getWrapSrc() : this.markup.getSrc();
  },
  _onCreateBox : function(box, parent){
    box.content = this._getBoxContent();
    box.css.overflow = "hidden";
  }
});
