var TableRowGroupGenerator = (function(){
  function TableRowGroupGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(TableRowGroupGenerator, ChildBlockTreeGenerator);

  TableRowGroupGenerator.prototype._onCreateBox = function(box, parent){
    box.partition = parent.partition;
  };

  return TableRowGroupGenerator;
})();

