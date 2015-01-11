// parent : table
// tag : tbody, thead, tfoot
// stream : [tr]
// yield : [tr]
var TableRowGroupGenerator = (function(){
  /**
     @memberof Nehan
     @class TabeRowGroupGenerator
     @classdesc generator of table group(tbody, thead, tfoo) content.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
  function TableRowGroupGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableRowGroupGenerator, BlockGenerator);

  return TableRowGroupGenerator;
})();

