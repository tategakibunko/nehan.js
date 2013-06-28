var InlineBlockGenerator = BlockTreeGenerator.extend({
  _getBoxType : function(){
    return "inline-block";
  },
  // ctx : LineContext
  yield : function(parent){
    var box = this._super(parent);
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
