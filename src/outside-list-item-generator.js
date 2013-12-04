var OutsideListItemGenerator = (function(){
  function OutsideListItemGenerator(markup, parent, context){
    var marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    var markup_marker = new Tag("<li-marker>", marker);
    var markup_body = new Tag("<li-body>", markup.getContent());
    ParallelGenerator.call(this, [
      new ParaChildGenerator(markup_marker, context),
      new ParaChildGenerator(markup_body, context)
    ], markup, context, parent.partition);
  }
  Class.extend(OutsideListItemGenerator, ParallelGenerator);

  return OutsideListItemGenerator;
})();

