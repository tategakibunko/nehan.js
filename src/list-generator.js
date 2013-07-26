var ListGenerator = ChildBlockTreeGenerator.extend({
  _onCreateBox : function(box, parent){
    var item_count = this.context.getStreamTokenCount();
    var list_style_type = this.context.markup.getCssAttr("list-style-type", "none");
    var list_style_pos = this.context.markup.getCssAttr("list-style-position", "outside");
    var list_style_image = this.context.markup.getCssAttr("list-style-image", "none");
    var list_style_format = this.context.markup.getCssAttr("list-style-format");
    var list_style = new ListStyle({
      type:list_style_type,
      position:list_style_pos,
      image:list_style_image,
      format:list_style_format
    });
    var marker_advance = list_style.getMarkerAdvance(parent.flow, parent.fontSize, item_count);
    box.listStyle = list_style;
    box.partition = new Partition([marker_advance, box.getContentMeasure() - marker_advance]);
  }
});
