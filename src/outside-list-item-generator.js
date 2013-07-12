var OutsideListItemGenerator = ParallelGenerator.extend({
  init : function(markup, parent, context){
    var marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    var markup_marker = new Tag("<li-marker>", marker);
    var markup_body = new Tag("<li-body>", markup.getContent());
    this._super([
      new ParaChildGenerator(markup_marker, context),
      new ParaChildGenerator(markup_body, context)
    ], markup, context, parent.partition);
  }
});
