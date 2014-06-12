var TableCellGenerator = (function(){
  function TableCellGenerator(style, stream){
    SectionRootGenerator.call(this, style, stream);
  }
  // notice that table-cell is sectioning root, so extends SectionRootGenerator.
  Class.extend(TableCellGenerator, SectionRootGenerator);

  return TableCellGenerator;
})();

