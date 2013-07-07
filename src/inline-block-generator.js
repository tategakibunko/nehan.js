var InlineBlockGenerator = BlockTreeGenerator.extend({
  _getBoxType : function(){
    return "inline-block";
  },
  _getBoxSize : function(parent){
    return this._getMarkupStaticSize(parent) || parent.getRestSize();
  },
  // ctx : LineContext
  yield : function(parent){
    var box = this._super(parent);
    if(typeof box === "number"){
      return box; // exception
    }
    return box;
  }
});
