Nehan.TableCellGenerator = (function(){
  /**
     @memberof Nehan
     @class TableCellGenerator
     @classdesc generator of table-cell(td, th) content.
     @constructor
     @extends {Nehan.SectionRootGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function TableCellGenerator(context){
    Nehan.SectionRootGenerator.call(this, context);
  }
  Nehan.Class.extend(TableCellGenerator, Nehan.SectionRootGenerator);

  return TableCellGenerator;
})();

