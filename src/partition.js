var Partition = (function(){
  function Partition(punits){
    this._punits = punits || []; // partition units
  }

  var __levelize = function(sizes, min_size){
    // filter parts that is smaller than min_size.
    var smaller_parts = List.filter(sizes, function(size){ return size < min_size; });

    // if all elements has enough space for min_size, nothing to do.
    if(smaller_parts.length === 0){
      return sizes;
    }

    // total size that must be added to small parts.
    var delta_plus_total = List.fold(smaller_parts, 0, function(ret, size){ return ret + (min_size - size); });

    // filter parts that has enough space.
    var larger_parts = List.filter(sizes, function(size){
      return size - min_size >= min_size; // check if size is greater equal to min_size even if min_size is subtracted.
    });

    // if there are no enough rest space, nothing to do.
    if(larger_parts.length === 0){
      return sizes;
    }

    var delta_minus_avg = Math.floor(delta_plus_total / larger_parts.length);
    return List.map(sizes, function(size){
      return (size < min_size)? min_size : ((size - min_size >= min_size)? size - delta_minus_avg : size);
    });
  };

  Partition.prototype = {
    get : function(index){
      return this._punits[index] || null;
    },
    getLength : function(){
      return this._punits.length;
    },
    getTotalWeight : function(){
      return List.fold(this._punits, 0, function(ret, punit){
	return ret + punit.weight;
      });
    },
    // merge(this._punits[0], partition._punits[0]),
    // merge(this._punits[1], partition._punits[1]),
    // ...
    // merge(this._punits[n-1], partition._punits[n-1])
    mergeTo : function(partition){
      if(this.getLength() !== partition.getLength()){
	throw "Partition::mergeTo:invalid merge target(length not matched)";
      }
      var merged_punits =  List.mapi(this._punits, function(i, punit){
	return punit.mergeTo(partition.get(i));
      });
      return new Partition(merged_punits);
    },
    mapMeasure : function(measure){
      var total_weight = this.getTotalWeight();
      var min_size = Layout.minTableCellSize;
      var sizes =  List.map(this._punits, function(punit){
	return punit.getSize(measure, total_weight);
      });
      return __levelize(sizes, min_size);
    }
  };

  return Partition;
})();

