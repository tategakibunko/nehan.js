// key : partition count
// value : Partition
var PartitionHashSet = (function(){
  function PartitionHashSet(measure){
    HashSet.call(this);
    this.measure = measure || 0;
  }
  Class.extend(PartitionHashSet, HashSet);

  PartitionHashSet.prototype.merge = function(old_part, new_part){
    return old_part.mergeTo(new_part);
  };

  PartitionHashSet.prototype.getSizes = function(part_count){
    var partition = this.get(part_count);
    return partition.mapMeasure(this.measure);
  };

  PartitionHashSet.prototype.getSize = function(part_count, index){
    var sizes = this.getSizes(part_count);
    return sizes[index] || 0;
  };

  return PartitionHashSet;
})();

