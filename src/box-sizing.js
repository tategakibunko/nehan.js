var BoxSizing = (function(){
  function BoxSizing(value){
    // 'margin-box' is original sizing scheme of nehan,
    // even if margin is included in box size.
    this.value = value || "margin-box";
  }

  BoxSizing.prototype = {
    containEdgeSize : function(){
      return this.value !== "margin-box";
    },
    containMarginSize : function(){
      return this.value === "margin-box";
    },
    containBorderSize : function(){
      return this.value === "margin-box" || this.value === "border-box";
    },
    containPaddingSize : function(){
      return this.value === "margin-box" || this.value === "border-box" || this.value === "padding-box";
    },
    getSubEdge : function(edge){
      var ret = new BoxEdge();
      if(this.containMarginSize()){
	ret.margin = edge.margin;
      }
      if(this.containPaddingSize()){
	ret.padding = edge.padding;
      }
      if(this.containBorderSize()){
	ret.border = edge.border;
      }
      return ret;
    },
    getCss : function(){
      var css = {};
      css["box-sizing"] = "content-box";
      return css;
    }
  };

  return BoxSizing;
})();

