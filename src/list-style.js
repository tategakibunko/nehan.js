Nehan.ListStyle = (function(){
  /**
     @memberof Nehan
     @class ListStyle
     @classdesc abstraction of list-style.
     @constructor
     @param opt {Object}
     @param opt.type {Nehan.ListStyleType}
     @param opt.position {Nehan.ListStylePos}
     @param opt.image {Nehan.ListStyleImage}
  */
  function ListStyle(opt){
    this.type = new Nehan.ListStyleType(opt.type || "none");
    this.position = new Nehan.ListStylePos(opt.position || "outside");
    this.image = (opt.image !== "none")? new Nehan.ListStyleImage(opt.image) : null;
  }

  ListStyle.prototype = {
    /**
       @memberof Nehan.ListStyle
       @return {boolean}
    */
    isMultiCol : function(){
      return this.position.isOutside();
    },
    /**
       @memberof Nehan.ListStyle
       @return {boolean}
    */
    isInside : function(){
      return this.position.isInside();
    },
    /**
       @memberof Nehan.ListStyle
       @return {boolean}
    */
    isImageList : function(){
      return (this.image !== null);
    },
    /**
       @memberof Nehan.ListStyle
       @param count {int}
       @return {String}
    */
    getMarkerHtml : function(count){
      if(this.image !== null){
	return this.image.getMarkerHtml(count);
      }
      return this.type.getMarkerHtml(count);
    }
  };

  return ListStyle;
})();
