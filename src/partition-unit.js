var PartitionUnit = (function(){
  /**
     @memberof Nehan
     @class PartitionUnit
     @classdesc abstraction for unit size of partition.
     @constructor
     @param opt {Object}
     @param opt.weight {int} - partition weight, larger one gets more measure.
     @param opt.isStatic {boolean} - if true, size is fixed.
  */
  function PartitionUnit(opt){
    this.weight = opt.weight || 0;
    this.isStatic = opt.isStatic || false;
  }

  PartitionUnit.prototype = {
    /**
       get unit size in px.

       @memberof Nehan.PartitionUnit
       @param measure {int}
       @param total_weight {int}
       @return {int} - size in px
    */
    getSize : function(measure, total_weight){
      return Math.floor(measure * this.weight / total_weight);
    },
    /**
       @memberof Nehan.PartitionUnit
       @param punit {Nehan.ParitionUnit}
       @return {Nehan.PartitionUnit}
    */
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

