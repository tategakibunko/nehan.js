var LinkGenerator = ChildInlineTreeGenerator.extend({
  init : function(markup, context, parent_line_no){
    this._super(markup, context, parent_line_no);
    var anchor_name = markup.getTagAttr("name");
    if(anchor_name){
      context.setAnchor(anchor_name);
    }
  }
});

