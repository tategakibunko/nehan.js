var Color = (function(){
  /**
     @memberof Nehan
     @class Color
     @classdesc abstraction for css 'color'.
     @param value {String}
  */
  function Color(value){
    this.setValue(value);
  }

  Color.prototype = {
    /**
       @memberof Nehan.Color
       @param value {String}
    */
    setValue : function(value){
      this.value = Colors.get(value);
    },
    /**
       @memberof Nehan.Color
       @return {String}
    */
    getValue : function(){
      return this.value;
    },
    /**
       @memberof Nehan.Color
       @return {String}
       @example
       * new Color("transparent").getCssValue(); // "transparent"
       * new Color("ff0022").getCssValue(); // "#ff0022"
       * new Color("red").getCssValue(); // "#ff0000"
    */
    getCssValue : function(){
      return (this.value === "transparent")? this.value : "#" + this.value;
    },
    /**
       @memberof Nehan.Color
       @return {Nehan.Rgb}
    */
    getRgb : function(){
      return new Nehan.Rgb(this.value);
    },
    /**
       @memberof Nehan.Color
       @return {Object}
    */
    getCss : function(){
      var css = {};
      css.color = this.getCssValue();
      return css;
    }
  };

  return Color;
})();
