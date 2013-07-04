var BoxSizing = (function(){
  function BoxSizing(){
    // 'margin-box' is original sizing scheme of nehan,
    // even if margin is included in box size.
    this.value = "margin-box";
  }

  BoxSizing.prototype = {
    isContentBox : function(){
      return this.value === "content-box";
    },
    isMarginBox : function(){
      return this.value === "margin-box";
    },
    isBorderBox : function(){
      return this.value === "border-box";
    },
    containPadding : function(){
      return this.isBorderBox();
    },
    containBorder : function(){
      return this.isBorderBox();
    },
    containMargin : function(){
      return this.isMarginBox();
    },
    getCss : function(){
      var css = {};
      css["box-sizing"] = "content-box";
      return css;
    }
  };

  return BoxSizing;
})();

