var ListStyle = (function(){
  function ListStyle(opt){
    this.type = new ListStyleType(opt.type || "none");
    this.position = new ListStylePos(opt.position || "outside");
    this.image = (opt.image !== "none")? new ListStyleImage(opt.image) : null;
  }

  ListStyle.prototype = {
    isMultiCol : function(){
      return this.position.isOutside();
    },
    isInside : function(){
      return this.position.isInside();
    },
    isImageList : function(){
      return (this.image !== null);
    },
    getMarker : function(count){
      if(this.image !== null){
	return this.image.getMarker();
      }
      return this.type.getMarker(count);
    },
    getMarkerAdvance : function(font_size, item_count){
      if(this.image){
	return this.image.getMarkerAdvance();
      }
      return this.type.getMarkerAdvance(font_size, item_count);
    }
  };

  return ListStyle;
})();
