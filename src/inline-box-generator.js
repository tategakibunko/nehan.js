var InlineBoxGenerator = StaticBlockGenerator.extend({
  _getBoxType : function(){
    return "ibox";
  },
  _onCreateBox : function(box, parent){
    box.content = this.markup.getSrc();
    box.css.overflow = "hidden";
  }
});
