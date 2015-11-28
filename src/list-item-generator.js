Nehan.ListItemGenerator = (function(){
  /**
   @memberof Nehan
   @class ListItemGenerator
   @classdesc generator of &lt;li&gt; tag, consists parallel generator of list-item and list-body.
   @constructor
   @extends {Nehan.ParallelGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ListItemGenerator(context){
    Nehan.ParallelGenerator.call(this, context);
  }
  Nehan.Class.extend(ListItemGenerator, Nehan.ParallelGenerator);

  ListItemGenerator.prototype._createOutput = function(){
    var block = Nehan.BlockGenerator.prototype._createOutput.call(this);
    var list = block.elements[0];
    var items = list? list.elements : [];
    //console.log("output list item:mark = %o, body = %o", items[0], items[1]);
    if(!items[0] || !items[1]){
      console.warn("invalid list item(undefined)");
      return null;
    }
    if(items[1] && items[1].isInvalidSize()){
      console.warn("invalid list item(zero size)");
      return null;
    }
    if(items[1].elements.length === 0){
      console.warn("invalid list item(empty body)");
      return null;
    }
    return block;
  };

  ListItemGenerator.prototype._createChildGenerators = function(context){
    var list_context = context.parent.listContext;
    var list_index = context.style.getChildIndex();

    // [li]
    //   [li-marker][li-body]
    return [
      this._createListMarkerGenerator(context, list_context, list_index),
      this._createListBodyGenerator(context, list_context)
    ];
  };

  // inherit from ParallelGenerator::_isBreakAfter
  ListItemGenerator.prototype._isBreakAfter = function(blocks){
    return blocks[1] && blocks[1].breakAfter;
  };

  ListItemGenerator.prototype._createListMarkerGenerator = function(context, list_context, list_index){
    var content = context.parent.style.getListMarkerHtml(list_index + 1);
    //console.log("marker html:%s", content);
    var marker_markup = new Nehan.Tag("marker", content);
    var marker_style = context.createChildStyle(marker_markup, {
      float:"start",
      measure:list_context.indentSize
    });
    var marker_context = context.createChildContext(marker_style);
    //console.log("ListItemGenerator::marker context:%o", marker_context);
    return new Nehan.BlockGenerator(marker_context);
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(context, list_context){
    var body_markup = new Nehan.Tag("li-body");
    var body_style = context.createChildStyle(body_markup, {
      display:"block",
      float:"start",
      measure:list_context.bodySize
    });
    var body_context =  context.createChildContext(body_style, {
      stream:context.stream // share li.stream for li-body.stream.
    });
    //console.log("li-body context:%o", body_context);
    return new Nehan.BlockGenerator(body_context);
  };

  return ListItemGenerator;
})();
  
