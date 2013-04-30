var ImageGenerator = StaticBlockGenerator.extend({
  _onCreateBox : function(box, parent){
    box.src = this.markup.getTagAttr("src");
  }
});
