/*
  type partion_set = (col_count, partition) HashSet.t
  and col_count = int
  and partition = [partition_unit]
  and partition_unit = PartitionUnit(size, is_important)
  and size = int
  and is_important = bool
*/

// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
var TableGenerator = (function(){
  /**
     @memberof Nehan
     @class TableGenerator
     @classdesc generator of table tag content.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
  function TableGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGenerator, BlockGenerator);

  return TableGenerator;
})();

