var ListItemGenerator = ParallelPageGenerator.extend({
  init : function(markup, parent, context){
    var list_style = parent.listStyle;
    markup.marker = list_style.getMarker(markup.order);
    if(list_style.isInside()){
      // move to marker text to marker body.
      markup.content = markup.marker + Const.space + markup.content;
      markup.marker = Const.space;
    }
    this._super([
      new ListItemMarkGenerator(markup, context),
      new ListItemBodyGenerator(markup, context)
    ], markup, context, parent.partition);
  }
});
