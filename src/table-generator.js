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
Nehan.TableGenerator = (function(){
  /**
   @memberof Nehan
   @class TableGenerator
   @classdesc generator of table tag content.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function TableGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(TableGenerator, Nehan.BlockGenerator);

  TableGenerator.prototype._onInitialize = function(context){
    // if table-layout is auto, need to calc partition before parsing.
    if(context.style.getCssAttr("table-layout") === "auto"){
      context.initTablePartition(context.stream); // context.tablePartition is generated.
    }
  };

  return TableGenerator;
})();

