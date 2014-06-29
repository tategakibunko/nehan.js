var FloatGroup = (function(){
  function FloatGroup(elements, float_direction){
    this.elements = elements || [];
    this.floatDirection = float_direction || FloatDirections.get("start");
  }

  FloatGroup.prototype = {
    add : function(element){
      // float-stack | float-group
      //    [f1,f2]  |  []
      // => [f1]     |  [f2]
      // => []       |  [f1, f2]
      this.elements.unshift(element); // keep original stack order
    },
    isFloatStart : function(){
      return this.floatDirection.isStart();
    },
    isFloatEnd : function(){
      return this.floatDirection.isEnd();
    },
    getElements : function(){
      return this.isFloatStart()? this.elements : List.reverse(this.elements);
    },
    getMeasure : function(flow){
      return List.fold(this.elements, 0, function(measure, element){
	return measure + element.getLayoutMeasure(flow);
      });
    },
    getExtent : function(flow){
      return List.fold(this.elements, 0, function(extent, element){
	return Math.max(extent, element.getLayoutExtent(flow));
      });
    }
  };

  return FloatGroup;
})();

