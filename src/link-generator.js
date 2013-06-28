var LinkGenerator = ChildInlineTreeGenerator.extend({
  init : function(markup, context){
    this._super(markup, new TokenStream(markup.getContent()), context);
    var anchor_name = markup.getTagAttr("name");
    if(anchor_name){
      context.setAnchor(anchor_name);
    }
  }
});
