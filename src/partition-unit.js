var PartitionUnit = (function(){
  function PartitionUnit(opt){
    this.size = opt.size || 0;
    this.isImportant = opt.isImportant || false;
  }

  PartitionUnit.prototype = {
    mergeTo : function(punit){
      if(this.isImportant && !punit.isImportant){
	return this;
      } else if(!this.isImportant && punit.isImportant){
	return punit;
      } else {
	return (this.size > punit.size)? this : punit;
      }
    }
  };

  return PartitionUnit;
})();

