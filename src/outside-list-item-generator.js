var OutsideListItemGenerator = ParallelGenerator.extend({
  init : function(markup, parent, context){
    var marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    var markup_marker = new Tag("<div class='nehan-li-marker'>", marker);
    this._super([
      new ListItemMarkGenerator(markup_marker, context),
      new ListItemBodyGenerator(markup, context)
    ], markup, context, parent.partition);
  }
});
