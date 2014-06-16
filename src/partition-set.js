// key : column count of table row
// value : Partition
var PartitionSet = (function(){
  function PartitionSet(measure){
    HashSet.call(this);
    this.measure = measure || 0;
  }
  Class.extend(PartitionSet, HashSet);

  PartitionSet.prototype.addSet = function(partition_set){
    var self = this;
    partition_set.iter(function(key, value){
      self.add(key, value);
    });
  };

  PartitionSet.prototype.merge = function(old_part, new_part){
    return old_part.mergeTo(new_part);
  };

  // key : column_count
  PartitionSet.prototype.getSizes = function(column_count){
    var partition = this.get(column_count);
    return partition.mapMeasure(this.measure);
  };

  PartitionSet.prototype.getSize = function(column_count, index){
    var sizes = this.getSizes(column_count);
    return sizes[index] || 0;
  };

  return PartitionSet;
})();

