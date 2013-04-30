var ListGenerator = ChildPageGenerator.extend({
  _onCreateBox : function(box, parent){
    var item_count = this.stream.getTokenCount();
    var list_style_type = this.markup.getCssAttr("list-style-type", "none");
    var list_style_pos = this.markup.getCssAttr("list-style-position", "outside");
    var list_style_image = this.markup.getCssAttr("list-style-image", "none");
    var list_style = new ListStyle({
      type:list_style_type,
      position:list_style_pos,
      imageURL:list_style_image
    });
    var marker_advance = list_style.getMarkerAdvance(parent.fontSize, item_count);
    box.listStyle = list_style;
    box.partition = new Partition([marker_advance, box.getContentMeasure() - marker_advance]);
  },
  _createStream : function(){
    return new ListTagStream(this.markup.content);
  }
});
