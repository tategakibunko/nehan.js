Nehan.Partition = (function(){
  /**
   @memberof Nehan
   @class Partition
   @classdesc abstraction for partition of measure size.
   @constructor
   @param punits {Array.<PartitionUnit>}
   */
  function Partition(punits){
    this._punits = punits || []; // partition units
  }

  var __levelize = function(sizes, min_size){
    // filter parts that is smaller than min_size.
    var smaller_parts = sizes.filter(function(size){
      return size < min_size;
    });

    // if all elements has enough space for min_size, nothing to do.
    if(smaller_parts.length === 0){
      return sizes;
    }

    // total size that must be added to small parts.
    var delta_plus_total = smaller_parts.reduce(function(ret, size){
      return ret + (min_size - size);
    }, 0);

    // filter parts that has enough space.
    var larger_parts = sizes.filter(function(size){
      return size - min_size >= min_size; // check if size is more than min_size and over even if min_size is subtracted.
    });

    // if there are no enough rest space, nothing to do.
    if(larger_parts.length === 0){
      return sizes;
    }

    var delta_minus_avg = Math.floor(delta_plus_total / larger_parts.length);
    return sizes.map(function(size){
      return (size < min_size)? min_size : ((size - min_size >= min_size)? size - delta_minus_avg : size);
    });
  };

  /**
   @memberof Nehan.Partition
   @param index {int}
   @return {Nehan.PartitionUnit}
   */
  Partition.prototype.get = function(index){
    return this._punits[index] || null;
  },
  /**
   @memberof Nehan.Partition
   @return {int}
   */
  Partition.prototype.getLength = function(){
    return this._punits.length;
  },
  /**
   @memberof Nehan.Partition
   @return {int}
   */
  Partition.prototype.getTotalWeight = function(){
    return this._punits.reduce(function(ret, punit){
      return ret + punit.weight;
    }, 0);
  },
  /**
   @memberof Nehan.Partition
   @param partition {Nehan.Partition}
   @return {Nehan.Partition}
   */
  Partition.prototype.mergeTo = function(partition){
    if(this.getLength() !== partition.getLength()){
      throw "Partition::mergeTo, invalid merge target(length not same)";
    }
    // merge(this._punits[0], partition._punits[0]),
    // merge(this._punits[1], partition._punits[1]),
    // ...
    // merge(this._punits[n-1], partition._punits[n-1])
    var merged_punits =  this._punits.map(function(punit, i){
      return punit.mergeTo(partition.get(i));
    });
    return new Nehan.Partition(merged_punits);
  },
  /**
   @memberof Nehan.Partition
   @param measure {int} - max measure size in px
   @return {Array<int>} - divided size array
   */
  Partition.prototype.mapMeasure = function(measure){
    var total_weight = this.getTotalWeight();
    var sizes =  this._punits.map(function(punit){
      return punit.getSize(measure, total_weight);
    });
    return __levelize(sizes, Nehan.Config.minTableCellSize);
  };

  return Partition;
})();

