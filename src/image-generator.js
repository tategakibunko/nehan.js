var ImageGenerator = StaticBlockGenerator.extend({
  _onCreateBox : function(box, parent){
    box.src = this.context.markup.getTagAttr("src");
  }
});
