var Partition = (function(){
  function Partition(punits){
    this._punits = punits || []; // partition units
  }

  var __levelize = function(sizes, min_size){
    var delta_total = List.fold(sizes, 0, function(ret, size){
      return (size < min_size)?  ret + (min_size - size) : ret;
    });
    // all elements has enough space for min_size.
    if(delta_total === 0){
      return sizes;
    }
    var larger_part_count = List.filter(sizes, function(size){ return size > min_size; }).length;
    if(larger_part_count === 0){
      return sizes; // can't levelize because there is no rest space.
    }
    var delta_minus_avg = Math.floor(delta_total / larger_part_count);
    return List.map(sizes, function(size){
      return (size < min_size)? min_size : size - delta_minus_avg;
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

