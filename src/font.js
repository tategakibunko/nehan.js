var Font = (function(){
  function Font(parent_font){
    Args.merge(this, {
      weight:"normal",
      style:"normal",
      size:Layout.fontSize,
      family:"monospace"
    }, parent_font || {});
  }

  Font.prototype = {
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    toString : function(){
      return [this.weight, this.style, this.size + "px", this.family].join(" ");
    },
    getCss : function(){
      var css = {};
      css["font-weight"] = this.weight;
      css["font-style"] = this.style;
      css["font-size"] = this.size + "px";
      css["font-family"] = this.family;
      return css;
    }
  };

  return Font;
})();

