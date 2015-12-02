Nehan.InsideListItemGenerator = (function(){
  /**
   @memberof Nehan
   @class InsideListItemGenerator
   @classdesc list-item with list-style-position:inside.
   @constructor
   @extends {Nehan.ParallelGenerator}
   @param context {Nehan.RenderingContext}
  */
  function InsideListItemGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(InsideListItemGenerator, Nehan.BlockGenerator);

  InsideListItemGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);

    var child_index = context.style.getChildIndex();
    var marker_html = context.style.getListMarkerHtml(child_index + 1) + "&nbsp;";
    var marker_stream = new Nehan.TokenStream(marker_html);
    context.stream.tokens = marker_stream.getTokens().concat(context.stream.getTokens());
  };

  return InsideListItemGenerator;
})();
  
