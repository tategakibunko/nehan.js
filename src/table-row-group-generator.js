var TableRowGroupGenerator = ChildPageGenerator.extend({
  _onCompleteBox : function(box, parent){
    box.partition = parent.partition;
  },
  _createStream : function(){
    return new DirectTokenStream(this.markup.childs);
  }
});
