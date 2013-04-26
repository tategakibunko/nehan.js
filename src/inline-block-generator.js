var InlineBlockGenerator = PageGenerator.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
    this.stream = this._createStream();
  },
  _getBoxType : function(){
    return "inline-block";
  },
  yield : function(parent, rest_measure){
    var rest_extent = parent.getRestContentExtent();
    var size = parent.getBoxFlowBoxSize(rest_measure, rest_extent);
    var box = this._createBox(size, parent);
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
