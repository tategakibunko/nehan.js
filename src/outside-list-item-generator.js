var OutsideListItemGenerator = ParallelPageGenerator.extend({
  init : function(markup, parent, context){
    markup.marker = parent.listStyle.getMarker(markup.order + 1);
    this._super([
      new ListItemMarkGenerator(markup, context),
      new ListItemBodyGenerator(markup, context)
    ], markup, context, parent.partition);
  }
});
