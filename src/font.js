var Font = (function(){
  function Font(){
    this.size = Layout.fontSize;
  }

  Font.prototype = {
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    getFontSize : function(){
      return this.size || Layout.fontSize;
    },
    toString : function(){
      var parts = [];
      if(this.weight){
	parts.push(this.weight);
      }
      if(this.style){
	parts.push(this.style);
      }
      if(this.size){
	parts.push(this.size + "px");
      }
      if(this.family){
	parts.push(this.family);
      }
      return parts.join(" ");
    },
    getCss : function(){
      var css = {};
      if(this.weight){
	css["font-weight"] = this.weight;
      }
      if(this.style){
	css["font-style"] = this.style;
      }
      if(this.size){
	css["font-size"] = this.size + "px";
      }
      if(this.family){
	css["font-family"] = this.family;
      }
      return css;
    }
  };

  return Font;
})();

