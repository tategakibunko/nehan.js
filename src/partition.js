var Partition = (function(){
  function Partition(parts, max_size){
    switch(arguments.length){
    case 1:
      this.parts = parts;
      break;
    case 2:
      this.parts = this._mapSize(parts, max_size);
      break;
    }
  }

  Partition.prototype = {
    getLength : function(){
      return this.parts.length;
    },
    getSize : function(index){
      return this.parts[index] || null;
    },
    _mapSize : function(parts, max_size){
      var auto_parts = List.filter(parts, function(size){ return size === 0; });
      var auto_count = auto_parts.length;
      if(auto_count === 0){
	return parts;
      }
      var total_size = List.sum(parts);
      var rest_size = max_size - total_size;
      var auto_size = Math.floor(rest_size / auto_count);
      return List.map(parts, function(size){
	return size? size : auto_size;
      });
    }
  };

  return Partition;
})();
