Nehan.TextEmphaStyle = (function(){
  var __default_empha_style = "filled dot";
  var __empha_marks = {
    // dot
    "filled dot":"&#x2022;",
    "open dot":"&#x25E6;",

    // circle
    "filled circle":"&#x25CF;",
    "open circle":"&#x25CB;",

    // double-circle
    "filled double-circle":"&#x25C9;",
    "open double-circle":"&#x25CE;",

    // triangle
    "filled triangle":"&#x25B2;",
    "open triangle":"&#x25B3;",

    // sesame
    "filled sesame":"&#xFE45;",
    "open sesame":"&#xFE46;"
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
   * new TextEmphaStyle("filled dot").getText(); // "&#x2022;";
   * new TextEmphaStyle("foo").getText(); // "foo";
   */
  function TextEmphaStyle(value){
    this.value = value || "none";
  }

  /**
   @memberof Nehan.TextEmphaStyle
   @return {bool}
   */
  TextEmphaStyle.prototype.isEnable = function(){
    return this.value != "none";
  };
  /**
   @memberof Nehan.TextEmphaStyle
   @param value {String} - empha style name
   */
  TextEmphaStyle.prototype.setValue = function(value){
    this.value = value;
  };
  /**
   @memberof Nehan.TextEmphaStyle
   @return {String}
   */
  TextEmphaStyle.prototype.getText = function(){
    if(!this.isEnable()){
      return "";
    }
    return __empha_marks[this.value] || this.value || __empha_marks[__default_empha_style];
  };
  /**
   @memberof Nehan.TextEmphaStyle
   @return {Object}
   */
  TextEmphaStyle.prototype.getCss = function(){
    var css = {};
    //return css["text-emphasis-style"] = this.value;
    return css;
  };

  return TextEmphaStyle;
})();

