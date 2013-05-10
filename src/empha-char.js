var EmphaChar = (function(){
  function EmphaChar(opt){
    this.data = opt.data || "&#x2022";
    this.startPos = opt.startPos || 0;
    this.parent = opt.parent;
    this.fontSize = this.parent.fontSize;
  }

  EmphaChar.prototype = {
    getCss : function(flow){
      var css = {};
      css.position = "absolute";
      css.width = css.height = this.fontSize + "px";
      css.display = flow.isTextVertical()? "block" : "inline-block";
      css[flow.getPropStart()] = this.startPos + "px";
      if(flow.isTextHorizontal()){
	css["text-align"] = "center";
      }
      if(Env.isIE && flow.isTextVertical()){
	css["left"] = "50%";
	css["margin-left"] = (-Math.floor(this.fontSize / 2)) + "px";
      }
      return css;
    },
    getAdvance : function(flow){
      return this.parent.getAdvance(flow);
    }
  };

  return EmphaChar;
})();

