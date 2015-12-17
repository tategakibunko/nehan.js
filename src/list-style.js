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
    opt = opt || {};
    this.type = new Nehan.ListStyleType(opt.type || "none");
    this.position = new Nehan.ListStylePos(opt.position || "outside");
    this.image = (!opt.image || opt.image === "none")? null : new Nehan.ListStyleImage(opt.image);
  }

  /**
   @memberof Nehan.ListStyle
   @return {boolean}
   */
  ListStyle.prototype.isOutside = function(){
    return this.position.isOutside();
  };
  /**
   @memberof Nehan.ListStyle
   @return {boolean}
   */
  ListStyle.prototype.isInside = function(){
    return this.position.isInside();
  };
  /**
   @memberof Nehan.ListStyle
   @return {boolean}
   */
  ListStyle.prototype.isImageList = function(){
    return (this.image !== null);
  };
  /**
   @memberof Nehan.ListStyle
   @param count {int}
   @return {String}
   */
  ListStyle.prototype.getMarkerHtml = function(count, opt){
    if(this.image !== null){
      return this.image.getMarkerHtml(count, opt || {});
    }
    var html = this.type.getMarkerHtml(count);
    if(html === "" && this.isOutside()){
      return "&nbsp;";
    }
    return html;
  };

  return ListStyle;
})();
