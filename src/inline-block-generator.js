var InlineBlockGenerator = PageGenerator.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
    this.stream = this._createStream();
  },
  _getBoxType : function(){
    return "inline-block";
  },
  // ctx : LineContext
  yield : function(ctx){
    var rest_measure = ctx.restMeasure;
    var rest_extent = ctx.restExtent;
    var parent_flow = ctx.getParentFlow();
    var size = parent_flow.getBoxSize(rest_measure, rest_extent);
    var box = this._createBox(size, ctx.parent);
    box = this._yieldPageTo(box);
    if(typeof box === "number"){
      return box; // exception
    }
    box.shortenBox();
    if(!box.isTextVertical()){
      box.display = "inline-block";
    }
    return box;
  }
});
