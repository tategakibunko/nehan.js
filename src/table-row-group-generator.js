// parent : table
// tag : tbody, thead, tfoot
// stream : [tr]
// yield : [tr]
var TableRowGroupGenerator = (function(){
  function TableRowGroupGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(TableRowGroupGenerator, BlockGenerator);

  return TableRowGroupGenerator;
})();

