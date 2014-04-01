var FloatGroup = (function(){
  function FloatGroup(elements, logical_float){
    this.elements = elements || [];
    this.logicalFloat = logical_float || LogicalFloats.get("start");
  }

  FloatGroup.prototype = {
    add : function(element){
      // [f1,f2], [] => [f1], [f2] => [], [f1, f2]
      this.elements.unshift(element); // keep original stack order
    },
    isFloatStart : function(){
      return this.logicalFloat.isStart();
    },
    isFloatEnd : function(){
      return this.logicalFloat.isEnd();
    },
    getElements : function(){
      return this.isFloatStart()? this.elements : List.reverse(this.elements);
    },
    getMeasure : function(flow){
      return List.fold(this.elements, 0, function(measure, element){
	return measure + element.getBoxMeasure(flow);
      });
    },
    getExtent : function(flow){
      return List.fold(this.elements, 0, function(extent, element){
	return Math.max(extent, element.getBoxExtent(flow));
      });
    }
  };

  return FloatGroup;
})();

