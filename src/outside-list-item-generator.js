var OutsideListItemGenerator = ParallelGenerator.extend({
  init : function(markup, parent, context){
    markup.marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    this._super([
      new ListItemMarkGenerator(markup, context),
      new ListItemBodyGenerator(markup, context)
    ], markup, context, parent.partition);
  }
});
