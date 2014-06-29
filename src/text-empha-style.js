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

  function TextEmphaStyle(value){
    this.value = value || "none";
  }

  TextEmphaStyle.prototype = {
    isEnable : function(){
      return this.value != "none";
    },
    setValue : function(value){
      this.value = value;
    },
    getText : function(){
      return __empha_marks[this.value] || this.value || __empha_marks[__default_empha_style];
    },
    getCss : function(){
      var css = {};
      //return css["text-emphasis-style"] = this.value;
      return css;
    }
  };

  return TextEmphaStyle;
})();

