var TablePartition = (function(){
  function TablePartition(){
    this.entry = {};
  }

  TablePartition.prototype = {
    add : function(partition){
      var col_count = partition.getLength();
      this.entry[col_count] = partition;
    },
    getPartition : function(col_count){
      return (this.entry[col_count] || null);
    }
  };

  return TablePartition;
})();
