var TableCellGenerator = (function(){
  function TableCellGenerator(style, stream){
    this.outlineContext = new OutlineContext();
  }
  // notice that table-cell is sectioning root, so extends SectionRootGenerator.
  Class.extend(TableCellGenerator, SectionRootGenerator);

  /*
  TableCellGenerator.prototype.yield = function(context){
  };*/

  return TableCellGenerator;
})();

