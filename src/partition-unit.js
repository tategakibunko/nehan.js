var PartitionUnit = (function(){
  function PartitionUnit(opt){
    this.weight = opt.weight || 0;
    this.isImportant = opt.isImportant || false;
  }

  PartitionUnit.prototype = {
    getSize : function(measure, total_weight){
      return Math.floor(measure * this.weight / total_weight);
    },
    mergeTo : function(punit){
      if(this.isImportant && !punit.isImportant){
	return this;
      } else if(!this.isImportant && punit.isImportant){
	return punit;
      } else {
	return (this.weight > punit.weight)? this : punit;
      }
    }
  };

  return PartitionUnit;
})();

