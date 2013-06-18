var InsideListItemGenerator = ChildPageGenerator.extend({
  init : function(markup, parent, context){
    var marker = parent.listStyle.getMarker(markup.order + 1);
    markup.content = marker + Const.space + markup.content;
    this._super(markup, context);
  }
});
