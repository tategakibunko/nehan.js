// parent : table
// tag : tbody, thead, tfoot
// stream : [tr]
// yield : [tr]
var TableRowGroupGenerator = (function(){
  function TableRowGroupGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableRowGroupGenerator, BlockGenerator);

  return TableRowGroupGenerator;
})();

