var TextEmphaStyle = (function(){
  var __default_empha_style = "filled dot";
  var __empha_marks = {
    // dot
    "filled dot":"&#x2022;",
    "open dot":"&#x25e6;",

    // circle
    "filled circle":"&#x25cf;",
    "open circle":"&#x25cb;",

    // double-circle
    "filled double-circle":"&#x25c9;",
    "open double-circle":"&#x25ce;",

    // triangle
    "filled triangle":"&#x25b2;",
    "open triangle":"&#x25b3;",

    // sesame
    "filled sesame":"&#xfe45;",
    "open sesame":"&#xfe46;"
  };

  /**
     @memberof Nehan
     @class TextEmphaStyle
     @classdesc abstraction of text-empha-position.
     @constructor
     @param value {String} - style name. default "none".
     @example
     * new TextEmphaStyle().getText(); // ""
     * new TextEmphaStyle().getText("none"); // ""
     * new TextEmphaStyle("filled dot").getText(); // "&#x2022";
     * new TextEmphaStyle("foo").getText(); // "foo";
  */
  function TextEmphaStyle(value){
    this.value = value || "none";
  }

  TextEmphaStyle.prototype = {
    /**
       @memberof Nehan.TextEmphaStyle
       @return {bool}
    */
    isEnable : function(){
      return this.value != "none";
    },
    /**
       @memberof Nehan.TextEmphaStyle
       @param value {String} - empha style name
    */
    setValue : function(value){
      this.value = value;
    },
    /**
       @memberof Nehan.TextEmphaStyle
       @return {String}
    */
    getText : function(){
      if(!this.isEnable()){
	return "";
      }
      return __empha_marks[this.value] || this.value || __empha_marks[__default_empha_style];
    },
    /**
       @memberof Nehan.TextEmphaStyle
       @return {Object}
    */
    getCss : function(){
      var css = {};
      //return css["text-emphasis-style"] = this.value;
      return css;
    }
  };

  return TextEmphaStyle;
})();

