// key : partition count
// value : Partition
var PartitionHashSet = (function(){
  function PartitionHashSet(){
    HashSet.call(this);
  }
  Class.extend(PartitionHashSet, HashSet);

  PartitionHashSet.prototype.merge = function(old_part, new_part){
    return old_part.mergeTo(new_part);
  };

  // [arugments]
  // opt.partitionCount : int
  // opt.measure : int
  PartitionHashSet.prototype.getSizes = function(opt){
    var partition = this.get(opt.partitionCount);
    return partition.mapMeasure(opt.measure);
  };

  return PartitionHashSet;
})();

