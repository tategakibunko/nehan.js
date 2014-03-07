var Font = (function(){
  function Font(size, opt){
    this.size = size;
    Args.copy(this, opt || {});
  }

  Font.prototype = {
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    toString : function(){
      return [
	this.weight || "normal",
	this.style || "normal",
	this.size + "px",
	this.family || "monospace"
      ].join(" ");
    },
    getCss : function(){
      var css = {};
      if(this.size){
	css["font-size"] = this.size + "px";
      }
      if(this.weight){
	css["font-weight"] = this.weight;
      }
      if(this.style){
	css["font-style"] = this.style;
      }
      if(this.family){
	css["font-family"] = this.family;
      }
      return css;
    }
  };

  return Font;
})();

