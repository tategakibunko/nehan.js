var ListItemGenerator = (function(){
  /**
     @memberof Nehan
     @class ListItemGenerator
     @classdesc generator of &lt;li&gt; tag, consists parallel generator of list-item and list-body.
     @constructor
     @extends {Nehan.ParallelGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function ListItemGenerator(style, stream){
    ParallelGenerator.call(this, style, [
      this._createListMarkGenerator(style),
      this._createListBodyGenerator(style, stream)
    ]);
  }
  Nehan.Class.extend(ListItemGenerator, ParallelGenerator);

  ListItemGenerator.prototype._createListMarkGenerator = function(style){
    var marker_size = style.getListMarkerSize();
    var item_order = style.getChildIndex();
    var marker_text = style.getListMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "measure":measure
    }, {
      "class":"nehan-li-marker"
    });
    return new BlockGenerator(marker_style, new TokenStream(marker_text));
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(style, stream){
    var marker_size = style.getListMarkerSize();
    var measure = style.contentMeasure - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "measure":measure
    }, {
      "class":"nehan-li-body"
    });
    return new BlockGenerator(body_style, stream);
  };

  return ListItemGenerator;
})();
  
