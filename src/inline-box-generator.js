var InlineBoxGenerator = StaticBlockGenerator.extend({
  _getBoxType : function(){
    return "ibox";
  },
  _onCreateBox : function(box, parent){
    box.content = this.markup.getContentRaw();
    box.css.overflow = "hidden";
  }
});
