var TableRowGroupGenerator = ChildBlockTreeGenerator.extend({
  _onCreateBox : function(box, parent){
    box.partition = parent.partition;
  },
  _createStream : function(){
    return new DirectTokenStream(this.markup.tableChilds);
  }
});
