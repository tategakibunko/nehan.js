var TableRowGroupGenerator = ChildBlockTreeGenerator.extend({
  _onCreateBox : function(box, parent){
    box.partition = parent.partition;
  }
});
