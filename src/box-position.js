var BoxPosition = (function(){
  function BoxPosition(position, offset){
    offset = offset || {};
    this.position = position;
    this.top = offset.top || "auto";
    this.left = offset.left || "auto";
    this.right = offset.right || "auto";
    this.bottom = offset.bottom || "auto";
  }

  BoxPosition.prototype = {
    isAbsolute : function(){
      return this.position === "absolute";
    },
    getCss : function(){
      var css = {};
      css.position = this.position;
      css.top = this.top;
      css.left = this.left;
      css.right = this.right;
      css.bottom = this.bottom;
      return css;
    }
  };

  return BoxPosition;
})();

