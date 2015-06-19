var FloatGroup = (function(){
  /**
     @memberof Nehan
     @class FloatGroup
     @classdesc element set with same floated direction.
     @constructor
     @param elements {Array.<Nehan.Box>}
     @param float_direction {Nehan.FloatDirection}
  */
  function FloatGroup(elements, float_direction){
    this.elements = elements || [];
    this.floatDirection = float_direction || FloatDirections.get("start");
  }

  FloatGroup.prototype = {
    /**
       element is popped from float-stack, but unshifted to elements in float-group to keep original stack order.
     *<pre>
     * float-stack  | float-group
     *     [f1,f2]  |  []
     *  => [f1]     |  [f2] (pop f2 from float-stack, unshift f2 to float-group)
     *  => []       |  [f1, f2] (pop f1 from float-stack, unshift f1 to float-group)
     *</pre>

      @memberof Nehan.FloatGroup
      @param element {Nehan.Box}
    */
    add : function(element){
      this.elements.unshift(element); // keep original stack order
    },
    /**
       @memberof Nehan.FloatGroup
       @return {boolean}
    */
    isFloatStart : function(){
      return this.floatDirection.isStart();
    },
    /**
       @memberof Nehan.FloatGroup
       @return {boolean}
    */
    isFloatEnd : function(){
      return this.floatDirection.isEnd();
    },
    /**
       @memberof Nehan.FloatGroup
       @return {Array.<Nehan.Box>}
    */
    getElements : function(){
      return this.isFloatStart()? this.elements : Nehan.List.reverse(this.elements);
    },
    /**
       @memberof Nehan.FloatGroup
       @return {int}
    */
    getMeasure : function(flow){
      return Nehan.List.fold(this.elements, 0, function(measure, element){
	return measure + element.getLayoutMeasure(flow);
      });
    },
    /**
       @memberof Nehan.FloatGroup
       @return {int}
    */
    getExtent : function(flow){
      return Nehan.List.fold(this.elements, 0, function(extent, element){
	return Math.max(extent, element.getLayoutExtent(flow));
      });
    }
  };

  return FloatGroup;
})();

