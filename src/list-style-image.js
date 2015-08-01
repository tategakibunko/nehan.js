Nehan.ListStyleImage = (function(){
  /**
     @memberof Nehan
     @class ListStyleImage
     @classdesc abstraction of list-style-image.
     @constructor
     @param image {Object}
     @param image.width {Int} - if undefined, use {@link Nehan.Display}.fontSize
     @param image.height {Int} - if undefined, use {@link Nehan.Display}.fontSize
     @param image.url {String}
  */
  function ListStyleImage(image){
    this.image = image;
  }

  /**
   @memberof Nehan.ListStyleImage
   @param count {int}
   @return {string}
   */
  ListStyleImage.prototype.getMarkerHtml = function(count){
    var url = this.image.url;
    var width = this.image.width || Nehan.Display.fontSize;
    var height = this.image.height || Nehan.Display.fontSize;
    return Nehan.Html.tagSingle("img", {
      "src":url,
      "class":"nehan-list-image",
      "width":width,
      "height":height
    });
  };

  return ListStyleImage;
})();

