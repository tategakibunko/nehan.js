var BoxPosition = (function(){
  function BoxPosition(position, offset){
    offset = offset || {};
    this.position = position;
    this.top = (typeof offset.top !== "undefined")? offset.top : "auto";
    this.left = (typeof offset.left !== "undefined")? offset.left : "auto";
    this.right = (typeof offset.right !== "undefined")? offset.right : "auto";
    this.bottom = (typeof offset.bottom !== "undefined")? offset.bottom : "auto";
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

