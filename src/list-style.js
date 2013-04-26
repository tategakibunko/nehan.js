var ListStyle = (function(){
  function ListStyle(opt){
    this.type = opt.type || "none";
    this.position = opt.position || "outside";
    this.imageURL = opt.imageURL || "none";
    this.counter = this._getCounter();
  }

  ListStyle.prototype = {
    isInside : function(){
      return this.position === "inside";
    },
    isImageList : function(){
      return this.imageURL !== "none";
    },
    isSimpleDecimalList : function(){
      return this.type === "decimal";
    },
    isArithmeticDecimalList : function(){
      return this.type === "decimal-leading-zero";
    },
    isDecimalList : function(){
      return this.isSimpleDecimalList() || this.isArithmeticDecimalList();
    },
    isUnitList : function(){
      return this.type === "none";
    },
    getMarkerAdvance : function(font_size, item_count){
      var font_size_half = Math.floor(font_size / 2);
      var period_size = font_size_half;
      var marker_space_size = Layout.getListMarkerSpacingSize(font_size);
      var marker_font_size = font_size_half;
      var max_marker_text = "";
      if(this.isInside()){
	return font_size + marker_space_size;
      }
      if(this.isImageList()){
	return Layout.fontSize;
      }
      if(this.isDecimalList()){
	max_marker_text = this._getMarkerText(item_count - 1);
	return max_marker_text.length * marker_font_size + period_size + marker_space_size;
      }
      if(this.counter){
	marker_font_size = this.counter.isZenkaku()? font_size : font_size_half;
	max_marker_text = this._getMarkerText(item_count - 1);
	return max_marker_text.length * marker_font_size + period_size + marker_space_size;
      }
      return font_size + marker_space_size;
    },
    getMarker : function(order){
      var body = this._getMarkerBody(order);
      if(this.isInside()){
	return Html.tagWrap("span", body, {
	  "class":"nehan-inside-marker"
	});
      }
      return body;
    },
    _getMarkerBody : function(order){
      if(this.isImageList()){
	return this._getImageMarker();
      }
      if(this.isDecimalList()){
	return this._getMarkerText(order) + ".";
      }
      if(this.counter){
	var text = this._getMarkerText(order) + ".";
	return this.counter.isZenkaku()? Html.tagWrap("span", text, {"class":"nehan-tcy"}) : text;
      }
      return this._getMarkerText(order);
    },
    _getMarkerText : function(order){
      if(this.isUnitList()){
	return Const.space;
      }
      if(this.isSimpleDecimalList()){
	return (order + 1).toString(10);
      }
      if(this.isArithmeticDecimalList()){
	if(order + 1 < 10){
	  return "0" + (order + 1).toString(10);
	}
	return (order + 1).toString(10);
      }
      if(this.counter){
	return this._getCounterMarker(order);
      }
      return this._getSingleMarker();
    },
    _getCounter : function(){
      var cardinal_string = CardinalStrings.get(this.type);
      if(cardinal_string){
	return new CardinalCounter(cardinal_string);
      }
      return null;
    },
    _getCounterMarker : function(order){
      return this.counter.getString(order);
    },
    _getSingleMarker : function(){
      switch(this.type){
      case "disc": return "&#x2022;"; // disc black(bullet)
      case "circle": return "&#x25CB;"; // circle white
      case "square": return "&#x25A0;"; // square black
      }
      return "";
    },
    _getImageMarker : function(){
      var font_size = Layout.fontSize;
      return Html.tagSingle("img", {
	"src":this.imageURL,
	"width":font_size,
	"height":font_size
      });
    }
  };

  return ListStyle;
})();
