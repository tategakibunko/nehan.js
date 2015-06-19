var ListStyleType = (function(){
  /**
     @memberof Nehan
     @class ListStyleType
     @classdesc abstraction of list-style-type.
     @constructor
     @param pos {String} - "disc", "circle", "square", "lower-alpha" .. etc
  */
  function ListStyleType(type){
    this.type = type;
  }

  var __marker_text = {
    "disc": "&#x2022;",
    "circle":"&#x25CB;",
    "square":"&#x25A0;"
  };

  ListStyleType.prototype = {
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isDecimalList : function(){
      return (this.type === "decimal" || this.type === "decimal-leading-zero");
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isNoneList : function(){
      return this.type === "none";
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isMarkList : function(){
      return (this.type === "disc" ||
	      this.type === "circle" ||
	      this.type === "square");
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isCountableList : function(){
      return (!this.isNoneList() && !this.isMarkList());
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isHankaku : function(){
      return (this.type === "lower-alpha" || this.type === "upper-alpha" ||
	      this.type === "lower-roman" || this.type === "upper-roman" ||
	      this.isDecimalList());
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isZenkaku : function(){
      return !this.isHankaku();
    },
    _getMarkerDigitString : function(decimal){
      if(this.type === "decimal"){
	return decimal.toString(10);
      }
      if(this.type === "decimal-leading-zero"){
	if(decimal < 10){
	  return "0" + decimal.toString(10);
	}
	return decimal.toString(10);
      }
      return Cardinal.getStringByName(this.type, decimal);
    },
    /**
       @memberof Nehan.ListStyleType
       @return {String}
    */
    getMarkerHtml : function(count){
      var text = this.getMarkerText(count);
      if(this.isZenkaku()){
	return Nehan.Html.tagWrap("span", text, {
	  "class":"nehan-tcy"
	});
      }
      return text;
    },
    /**
       @memberof Nehan.ListStyleType
       @return {String}
    */
    getMarkerText : function(count){
      if(this.isNoneList()){
	return Nehan.Const.space;
      }
      if(this.isMarkList()){
	return __marker_text[this.type] || "";
      }
      var digit = this._getMarkerDigitString(count);
      return digit + "."; // add period as postfix.
    }
  };

  return ListStyleType;
})();

