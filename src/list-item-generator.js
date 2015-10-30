Nehan.ListItemGenerator = (function(){
  /**
     @memberof Nehan
     @class ListItemGenerator
     @classdesc generator of &lt;li&gt; tag, consists parallel generator of list-item and list-body.
     @constructor
     @extends {Nehan.ParallelGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function ListItemGenerator(context){
    Nehan.ParallelGenerator.call(this, context.extend({
      parallelGenerators:[
	this._createListMarkGenerator(context),
	this._createListBodyGenerator(context)
      ]
    }));
  }
  Nehan.Class.extend(ListItemGenerator, Nehan.ParallelGenerator);

  ListItemGenerator.prototype._createListMarkGenerator = function(context){
    var marker_size = context.style.getListMarkerSize();
    var item_order = context.style.getChildIndex();
    var marker_text = context.style.getListMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(context.style.flow);
    var marker_style = context.style.createChild("li-marker", {
      "float":"start",
      "measure":measure
    }, {
      "class":"nehan-li-marker"
    });
    var marker_stream = new Nehan.TokenStream(marker_text, {
      flow:context.style.flow
    });
    return context.createChildBlockGenerator(marker_style, marker_stream);
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(context){
    var marker_size = context.style.getListMarkerSize();
    var measure = context.style.contentMeasure - marker_size.getMeasure(context.style.flow);
    var body_style = context.style.createChild("li-body", {
      "float":"start",
      "measure":measure
    }, {
      "class":"nehan-li-body"
    });
    var body_stream = context.stream;
    return context.createChildBlockGenerator(body_style, body_stream);
  };

  return ListItemGenerator;
})();
  
