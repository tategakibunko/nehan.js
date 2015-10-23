Nehan.BorderRadius = (function(){
  /**
     @memberof Nehan
     @class BorderRadius
     @classdesc logical border radius object
     @constructor
  */
  function BorderRadius(){
    this.topLeft = new Nehan.Radius2d();
    this.topRight = new Nehan.Radius2d();
    this.bottomRight = new Nehan.Radius2d();
    this.bottomLeft = new Nehan.Radius2d();
  }

  /**
   @memberof Nehan.BorderRadius
   @method clone
   @return {Nehan.BorderRadius}
   */
  BorderRadius.prototype.clone = function(){
    var radius = new BorderRadius();
    radius.topLeft = this.topLeft.clone();
    radius.topRight = this.topRight.clone();
    radius.bottomRight = this.bottomRight.clone();
    radius.bottomLeft = this.bottomLeft.clone();
    return radius;
  };
  /**
   @memberof Nehan.BorderRadius
   @method getArray
   @return {Array.<Nehan.Radius2d>}
   */
  BorderRadius.prototype.getArray = function(){
    return [
      this.topLeft,
      this.topRight,
      this.bottomRight,
      this.bottomLeft
    ];
  };
  /**
   get css value of border-radius for horizontal direction
   @memberof Nehan.BorderRadius
   @method getCssValueHroi
   @return {Object}
   */
  BorderRadius.prototype.getCssValueHori = function(){
    return this.getArray().map(function(radius){
      return radius.getCssValueHori();
    }).join(" ");
  };
  /**
   get css value of border-radius for vertical direction
   @memberof Nehan.BorderRadius
   @method getCssValueVert
   @return {Object}
   */
  BorderRadius.prototype.getCssValueVert = function(){
    return this.getArray().map(function(radius){
      return radius.getCssValueVert();
    }).join(" ");
  };
  /**
   get css value of border-radius for both vert and horizontal direction
   @memberof Nehan.BorderRadius
   @method getCssValue
   @return {Object}
   */
  BorderRadius.prototype.getCssValue = function(){
    return [this.getCssValueHori(), this.getCssValueVert()].join("/");
  };
  /**
   get css object of border-radius
   @memberof Nehan.BorderRadius
   @method getCss
   @return {Object}
   */
  BorderRadius.prototype.getCss = function(){
    var css = {};
    var css_value = this.getCssValue();
    css["border-radius"] = css_value; // without vender prefix
    Nehan.List.iter(Nehan.Const.cssVenderPrefixes, function(prefix){
      var prop = [prefix, "border-radius"].join("-"); // with vender prefix
      css[prop] = css_value;
    });
    return css;
  };
  /**
   get corner value
   @memberof Nehan.BorderRadius
   @method getCorner
   @param dir1 {string} - physical direction of logical start or end
   @param dir2 {string} - physical direction of logical before or after
   @return {Nehan.Radius2d}
   */
  BorderRadius.prototype.getCorner = function(dir1, dir2){
    var name = Nehan.BoxCorner.getCornerName(dir1, dir2);
    return this[name];
  };
  /**
   set corner size
   @memberof Nehan.BorderRadius
   @method setSize
   @param flow {Nehan.BoxFlow} - base layout flow
   @param size {Object} - size values for each logical corner
   @param size.start-before {int}
   @param size.start-after {int}
   @param size.end-before {int}
   @param size.end-after {int}
   */
  BorderRadius.prototype.setSize = function(flow, size){
    if(typeof size["start-before"] != "undefined"){
      this.setStartBefore(flow, size["start-before"]);
    }
    if(typeof size["start-after"] != "undefined"){
      this.setStartAfter(flow, size["start-after"]);
    }
    if(typeof size["end-before"] != "undefined"){
      this.setEndBefore(flow, size["end-before"]);
    }
    if(typeof size["end-after"] != "undefined"){
      this.setEndAfter(flow, size["end-after"]);
    }
  };
  /**
   set corner of logical "start-before"
   @memberof Nehan.BorderRadius
   @method setStartBefore
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   @example
   * new BorderRadius().setStartBefore(BoxFlows.getByName("lr-tb"), [5, 10]); // horizontal 5px, vertical 10px
   */
  BorderRadius.prototype.setStartBefore = function(flow, value){
    var radius = this.getCorner(flow.getPropStart(), flow.getPropBefore());
    radius.setSize(value);
  };
  /**
   set corner of logical "start-after"
   @memberof Nehan.BorderRadius
   @method setStartAfter
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   */
  BorderRadius.prototype.setStartAfter = function(flow, value){
    var radius = this.getCorner(flow.getPropStart(), flow.getPropAfter());
    radius.setSize(value);
  };
  /**
   set corner of logical "end-before"
   @memberof Nehan.BorderRadius
   @method setEndBefore
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   */
  BorderRadius.prototype.setEndBefore = function(flow, value){
    var radius = this.getCorner(flow.getPropEnd(), flow.getPropBefore());
    radius.setSize(value);
  };
  /**
   set corner of logical "end-after"
   @memberof Nehan.BorderRadius
   @method setEndAfter
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   */
  BorderRadius.prototype.setEndAfter = function(flow, value){
    var radius = this.getCorner(flow.getPropEnd(), flow.getPropAfter());
    radius.setSize(value);
  };
  /**
   clear corner values of logical before direction("start-before" and "end-before")
   @memberof Nehan.BorderRadius
   @method clearBefore
   @param flow {Nehan.BoxFlow} - base layout flow
   */
  BorderRadius.prototype.clearBefore = function(flow){
    this.setStartBefore(flow, [0, 0]);
    this.setEndBefore(flow, [0, 0]);
  };
  /**
   clear corner values of logical before direction("start-after" and "end-after")
   @memberof Nehan.BorderRadius
   @method clearAfter
   @param flow {Nehan.BoxFlow} - base layout flow
   */
  BorderRadius.prototype.clearAfter = function(flow){
    this.setStartAfter(flow, [0, 0]);
    this.setEndAfter(flow, [0, 0]);
  };

  return BorderRadius;
})();
