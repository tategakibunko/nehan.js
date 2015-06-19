var TableCellGenerator = (function(){
  /**
     @memberof Nehan
     @class TableCellGenerator
     @classdesc generator of table-cell(td, th) content.
     @constructor
     @extends {Nehan.SectionRootGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function TableCellGenerator(style, stream){
    SectionRootGenerator.call(this, style, stream);
  }
  // notice that table-cell is sectioning root, so extends SectionRootGenerator.
  Nehan.Class.extend(TableCellGenerator, SectionRootGenerator);

  return TableCellGenerator;
})();

