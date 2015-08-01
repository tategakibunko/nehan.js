Nehan.FloatDirection = (function(){
  /**
     @memberof Nehan
     @class FloatDirection
     @classdesc abstraction of logical float direction.
     @constructor
     @param value {String} - "start" or "end" or "none"
   */
  function FloatDirection(value){
    this.value = value || "none";
  }

  /**
   @memberof Nehan.FloatDirection
   @param is_vert {bool}
   @return {Object}
   */
  FloatDirection.prototype.getCss = function(is_vert){
    var css = {};
    if(!is_vert){
      if(this.isStart()){
	css["css-float"] = "left";
      } else if(this.isEnd()){
	css["css-float"] = "right";
      }
    }
    return css;
  };
  /**
   @memberof Nehan.FloatDirection
   @return {string}
   */
  FloatDirection.prototype.getName = function(){
    return this.value;
  };
  /**
   @memberof Nehan.FloatDirection
   @return {boolean}
   */
  FloatDirection.prototype.isStart = function(){
    return this.value === "start";
  };
  /**
   @memberof Nehan.FloatDirection
   @return {boolean}
   */
  FloatDirection.prototype.isEnd = function(){
    return this.value === "end";
  };
  /**
   @memberof Nehan.FloatDirection
   @return {boolean}
   */
  FloatDirection.prototype.isNone = function(){
    return this.value === "none";
  };

  return FloatDirection;
})();

