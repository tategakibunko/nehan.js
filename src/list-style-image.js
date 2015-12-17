Nehan.ListStyleImage = (function(){
  /**
   @memberof Nehan
   @class ListStyleImage
   @classdesc abstraction of list-style-image.
   @constructor
   @param image {String}
   */
  function ListStyleImage(image){
    this.image = image;
  }

  /**
   @memberof Nehan.ListStyleImage
   @param count {int}
   @return {string}
   */
  ListStyleImage.prototype.getMarkerHtml = function(count, opt){
    opt = opt || {};
    var url = Nehan.Css.getImageURL(this.image); // url('xxx.png') -> 'xxx.png'
    var width = opt.width || Nehan.Config.defaultFontSize;
    var height = opt.height || Nehan.Config.defaultFontSize;
    var classes = ["nehan-list-image"].concat(opt.classes || []);
    return Nehan.Html.tagSingle("img", {
      "src":url,
      "class":classes.join(" "),
      "width":width,
      "height":height
    });
  };

  return ListStyleImage;
})();

