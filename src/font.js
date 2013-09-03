var Font = (function(){
  function Font(parent_font){
    Args.merge(this, {
      weight:"normal",
      style:"normal",
      size:Layout.fontSize,
      family:"monospace"
    }, parent_font || {});
    this.parent = parent_font || null;
  }

  Font.prototype = {
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    toString : function(){
      return [this.weight, this.style, this.size + "px", this.family].join(" ");
    },
    getCss : function(){
      var css = {}, is_root_font = this.parent === null;
      if(is_root_font || this.weight != this.parent.weight){
	css["font-weight"] = this.weight;
      }
      if(is_root_font || this.style != this.parent.style){
	css["font-style"] = this.style;
      }
      if(is_root_font || this.size != this.parent.size){
	css["font-size"] = this.size + "px";
      }
      if(is_root_font || this.family != this.parent.family){
	css["font-family"] = this.family;
      }
      return css;
    }
  };

  return Font;
})();

