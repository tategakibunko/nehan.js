Nehan.Border = (function(){
  /**
     @memberof Nehan
     @class Border
     @classdesc logical border object that contains border-width, border-radius, border-style, border-color for each logical directions.
     @constructor
     @extends {Nehan.Edge}
  */
  function Border(){
    Nehan.Edge.call(this, "border");
  }
  Nehan.Class.extend(Border, Nehan.Edge);

  /**
     return cloned border object
     @memberof Nehan.Border
     @method clone
     @return {Nehan.Border}
  */
  Border.prototype.clone = function(){
    var border = this.copyTo(new Border());
    if(this.radius){
      border.radius = this.radius.clone();
    }
    if(this.style){
      border.style = this.style.clone();
    }
    if(this.color){
      border.color = this.color.clone();
    }
    return border;
  };

  /**
     clear border values of logical before
     @memberof Nehan.Border
     @method clearBefore
     @param flow {Nehan.BoxFlow}
  */
  Border.prototype.clearBefore = function(flow){
    this.setBefore(flow, 0);
    if(this.radius){
      this.radius.clearBefore(flow);
    }
  };

  /**
     clear border values of logical after
     @memberof Nehan.Border
     @method clearAfter
     @param flow {Nehan.BoxFlow}
  */
  Border.prototype.clearAfter = function(flow){
    this.setAfter(flow, 0);
    if(this.radius){
      this.radius.clearAfter(flow);
    }
  };

  /**
     @memberof Nehan.Border
     @method getDirProp
     @param dir {string} - "top", "right", "bottom", "left"
     @example
     * new Border().getDirProp("top"); // => "border-top-width"
  */
  Border.prototype.getDirProp = function(dir){
    return ["border", dir, "width"].join("-");
  };

  /**
     set border radius
     @memberof Nehan.Border
     @method setRadius
     @param flow {Nehan.BoxFlow}
     @param radius {Nehan.BorderRadius}
  */
  Border.prototype.setRadius = function(flow, radius){
    this.radius = new Nehan.BorderRadius();
    this.radius.setSize(flow, radius);
  };

  /**
     set border color
     @memberof Nehan.Border
     @method setColor
     @param flow {Nehan.BoxFlow}
     @param color {Nehan.Color}
  */
  Border.prototype.setColor = function(flow, color){
    this.color = new Nehan.BorderColor();
    this.color.setColor(flow, color);
  };

  /**
     set border style
     @memberof Nehan.Border
     @method setStyle
     @param flow {Nehan.BoxFlow}
     @param style {Nehan.BorderStyle}
  */
  Border.prototype.setStyle = function(flow, style){
    this.style = new Nehan.BorderStyle();
    this.style.setStyle(flow, style);
  };

  /**
     get css object
     @memberof Nehan.Border
     @method getCss
     @return {Object}
  */
  Border.prototype.getCss = function(){
    var css = Nehan.Edge.prototype.getCss.call(this);
    if(this.radius){
      Nehan.Args.copy(css, this.radius.getCss());
    }
    if(this.color){
      Nehan.Args.copy(css, this.color.getCss());
    }
    if(this.style){
      Nehan.Args.copy(css, this.style.getCss());
    }
    return css;
  };

  return Border;
})();
