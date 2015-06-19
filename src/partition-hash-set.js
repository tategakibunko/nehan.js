// key : partition count
// value : Partition
var PartitionHashSet = (function(){
  /**
     @memberof Nehan
     @class PartitionHashSet
     @classdesc hash set to manage partitioning of layout. key = partition_count, value = {@link Nehan.Partition}.
     @extends {Nehan.HashSet}
   */
  function PartitionHashSet(){
    Nehan.HashSet.call(this);
  }
  Nehan.Class.extend(PartitionHashSet, Nehan.HashSet);

  /**
     @memberof Nehan.PartitionHashSet
     @param old_part {Nehan.Partition}
     @param new_part {Nehan.Partition}
     @return {Nehan.Partition}
  */
  PartitionHashSet.prototype.merge = function(old_part, new_part){
    return old_part.mergeTo(new_part);
  };

  /**
     get partition size(in px) array.

     @memberof Nehan.PartitionHashSet
     @param opt {Object}
     @param opt.partitionCount {int}
     @param opt.measure {int}
     @return {Array.<int>}
  */
  PartitionHashSet.prototype.getSizes = function(opt){
    var partition = this.get(opt.partitionCount);
    return partition.mapMeasure(opt.measure);
  };

  return PartitionHashSet;
})();

