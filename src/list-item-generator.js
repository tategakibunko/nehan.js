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
    Nehan.LayoutGenerator.call(this, context);

    var list_context = context.parent.listContext;
    var list_index = context.style.getChildIndex();

    // [li]
    //   [li-marker][li-body]
    context.parallelGenerators = [
      this._createListMarkerGenerator(context, list_context, list_index),
      this._createListBodyGenerator(context, list_context, list_index)
    ];
  }
  Nehan.Class.extend(ListItemGenerator, Nehan.ParallelGenerator);

  ListItemGenerator.prototype._createListMarkerGenerator = function(context, list_context, list_index){
    var content = context.parent.style.getListMarkerHtml(list_index + 1);
    var markup = new Nehan.Tag("li-marker", content);
    var child_style = context.createChildStyle(markup, {
      forceCss:{float:"start", measure:list_context.indentSize}
    });
    var child_context = context.createChildContext(child_style);
    return new Nehan.BlockGenerator(child_context);
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(context, list_context, list_index){
    // we share li.stream for li-body.stream, so content not required for <li-body>.
    //var markup = new Nehan.Tag("li-body", context.style.getContent()); 
    var markup = new Nehan.Tag("li-body");
    var style = context.createChildStyle(markup, {
      forceCss:{display:"block", float:"start", measure:list_context.bodySize}
    });
    console.log("li-body style:", style);
    return new Nehan.BlockGenerator(
      context.createChildContext(style, {
	stream:context.stream // share li.stream for li-body.stream.
      })
    );
  };

  /*
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
   */

  return ListItemGenerator;
})();
  
