var PartitionUnit = (function(){
  function PartitionUnit(opt){
    this.weight = opt.weight || 0;
    this.isStatic = opt.isStatic || false;
  }

  PartitionUnit.prototype = {
    getSize : function(measure, total_weight){
      return Math.floor(measure * this.weight / total_weight);
    },
    mergeTo : function(punit){
      if(this.isStatic && !punit.isStatic){
	return this;
      }
      if(!this.isStatic && punit.isStatic){
	return punit;
      }
      return (this.weight > punit.weight)? this : punit;
    }
  };

  return PartitionUnit;
})();

