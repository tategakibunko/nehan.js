var Radius2d = (function(){
  /**
     @memberof Nehan
     @class Radius2d
     @classdesc abstraction of radius with 2 direction vert and hori.
     @constructor
  */
  function Radius2d(){
    this.hori = 0;
    this.vert = 0;
  }

  Radius2d.prototype = {
    /**
       @memberof Nehan.Radius2d
       @param value {Array<int>} - 2 length array, value[0] as horizontal radius, value[1] as vertical radius.
       @param value.0 {int} - horizontal radius
       @param value.1 {int} - vertical radius
    */
    setSize : function(value){
      this.hori = value[0];
      this.vert = value[1];
    },
    /**
       @memberof Nehan.Radius2d
       @return {String}
    */
    getCssValueHori : function(){
      return this.hori + "px";
    },
    /**
       @memberof Nehan.Radius2d
       @return {String}
    */
    getCssValueVert : function(){
      return this.vert + "px";
    }
  };
  
  return Radius2d;
})();
