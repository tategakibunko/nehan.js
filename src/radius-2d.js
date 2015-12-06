Nehan.Radius2d = (function(){
  /**
     @memberof Nehan
     @class Radius2d
     @classdesc abstraction of radius with 2 direction vert and hori.
     @constructor
  */
  function Radius2d(opt){
    opt = opt || {};
    this.hori = (typeof opt.hori !== "undefined")? opt.hori : 0;
    this.vert = (typeof opt.vert !== "undefined")? opt.vert : 0;
  }

  Radius2d.prototype.clone = function(){
    var radius2d = new Nehan.Radius2d();
    radius2d.hori = this.hori;
    radius2d.vert = this.vert;
    return radius2d;
  };
  /**
   @memberof Nehan.Radius2d
   @param value {Array<int>} - 2 length array, value[0] as horizontal radius, value[1] as vertical radius.
   @param value.0 {int} - horizontal radius
   @param value.1 {int} - vertical radius
   */
  Radius2d.prototype.setSize = function(value){
    this.hori = value[0];
    this.vert = value[1];
  };
  /**
   @memberof Nehan.Radius2d
   @return {String}
   */
  Radius2d.prototype.getCssValueHori = function(){
    return this.hori + "px";
  };
  /**
   @memberof Nehan.Radius2d
   @return {String}
   */
  Radius2d.prototype.getCssValueVert = function(){
    return this.vert + "px";
  };
  
  return Radius2d;
})();
