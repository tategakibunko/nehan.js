var BoxPosition = (function(){
  function BoxPosition(position){
    this.position = position;
  }

  BoxPosition.prototype = {
    isAbsolute : function(){
      return this.position === "absolute";
    },
    getCss : function(flow){
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
    }
  };

  return BoxPosition;
})();

