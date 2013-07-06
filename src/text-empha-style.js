var TextEmphaStyle = (function(){
  var empha_marks = {
    "dot filled":"&#x2022;",
    "dot open":"&#x25e6;",

    "circle filled":"&#x25cf;",
    "circle open":"&#x25cb;",

    "double-circle filled":"&#x25c9;",
    "double-circle open":"&#x25ce;",

    "triangle filled":"&#x25b2;",
    "triangle open":"&#x25b3;",

    "sesame filled":"&#xfe45;",
    "sesame open":"&#xfe46;"
  };

  function TextEmphaStyle(value){
    this.value = value || "dot filled";
  }

  TextEmphaStyle.prototype = {
    setValue : function(value){
      this.value = value;
    },
    getText : function(){
      return empha_marks[this.value] || this.value || empha_marks["dot filled"];
    },
    getCss : function(){
      var css = {};
      //return css["text-emphasis-style"] = this.value;
      return css;
    }
  };

  return TextEmphaStyle;
})();

