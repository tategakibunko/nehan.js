Nehan.BoxPosition = (function(){
  /**
     @memberof Nehan
     @class BoxPosition
     @classdesc logical css 'position' property
     @constructor
     @param position {string}
  */
  function BoxPosition(position){
    this.position = position;
  }

  /**
   @memberof Nehan.BoxPosition
   @return {boolean}
   */
  BoxPosition.prototype.isAbsolute = function(){
    return this.position === "absolute";
  };
  /**
   @memberof Nehan.BoxPosition
   @return {Object}
   */
  BoxPosition.prototype.getCss = function(flow){
    var css = {};
    css.position = this.position;
    if(this.start){
      css[flow.getPropStart()] = this.start + "px";
    }
    if(this.end){
      css[flow.getPropEnd()] = this.end + "px";
    }
    if(this.before){
      css[flow.getPropBefore()] = this.before + "px";
    }
    if(this.after){
      css[flow.getPropAfter()] = this.after + "px";
    }
    return css;
  };

  return BoxPosition;
})();

