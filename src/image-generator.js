var ImageGenerator = StaticBlockGenerator.extend({
  _onCompleteBox : function(box, parent){
    box.src = this.markup.getTagAttr("src");
  }
});
