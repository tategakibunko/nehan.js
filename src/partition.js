var Partition = (function(){
  function Partition(parts){
    this._parts = parts || [];
  }

  Partition.prototype = {
    get : function(index){
      return this._parts[index] || null;
    },
    mergeTo : function(partition){
      var merged_parts = List.mapi(this._parts, function(i, part){
	return part.mergeTo(partition.get(i));
      });
      return new Partition(merged_parts);
    },
    add : function(size, is_important){
      this._parts.push(new PartitionUnit({
	size:size,
	isImportant:is_imporatnt
      }));
    },
    mapMeasure : function(max_measure){
      var sum = List.fold(this._parts, 0, function(ret, part){ return ret + part.size; });
      return List.map(this._parts, function(part){
	return Math.floor(max_measure * part.size / sum);
      });
    }
  };

  return Partition;
})();

