var Border = (function(){
  /**
     @memberof Nehan
     @class Border
     @classdesc logical border object that contains border-width, border-radius, border-style, border-color for each logical directions.
     @constructor
     @extends {Nehan.Edge}
  */
  function Border(){
    Edge.call(this, "border");
  }
  Class.extend(Border, Edge);

  /**
     return cloned border object
     @memberof Nehan.Border
     @method clone
     @return {Nehan.Border}
  */
  Border.prototype.clone = function(){
    var border = this.copyTo(new Border());
    if(this.radius){
      // TODO
      // border.radius = this.radius.clone();
      border.radius = this.radius;
    }
    if(this.style){
      // TODO
      // border.style = this.style.clone();
      border.style = this.style;
    }
    if(this.color){
      // TODO
      // border.color = this.color.clone();
      border.color = this.color;
    }
    return border;
  };

  Border.prototype.clearBefore = function(flow){
    this.setBefore(flow, 0);
    if(this.radius){
      this.radius.clearBefore(flow);
    }
  };

  Border.prototype.clearAfter = function(flow){
    this.setAfter(flow, 0);
    if(this.radius){
      this.radius.clearAfter(flow);
    }
  };

  Border.prototype.getDirProp = function(dir){
    return ["border", dir, "width"].join("-");
  };

  Border.prototype.setRadius = function(flow, radius){
    this.radius = new BorderRadius();
    this.radius.setSize(flow, radius);
  };

  Border.prototype.setColor = function(flow, color){
    this.color = new BorderColor();
    this.color.setColor(flow, color);
  };

  Border.prototype.setStyle = function(flow, style){
    this.style = new BorderStyle();
    this.style.setStyle(flow, style);
  };

  Border.prototype.getCss = function(){
    var css = Edge.prototype.getCss.call(this);
    if(this.radius){
      Args.copy(css, this.radius.getCss());
    }
    if(this.color){
      Args.copy(css, this.color.getCss());
    }
    if(this.style){
      Args.copy(css, this.style.getCss());
    }
    return css;
  };

  return Border;
})();
