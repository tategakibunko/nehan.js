var InlineBlockGenerator = BlockTreeGenerator.extend({
  _getBoxType : function(){
    return "inline-block";
  },
  // ctx : InlineTreeContext
  yield : function(parent){
    var box = this._super(parent);
    if(typeof box === "number"){
      return box; // exception
    }
    return box;
  }
});
