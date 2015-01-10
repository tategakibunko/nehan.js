var ListStyleImage = (function(){
  function ListStyleImage(image){
    this.image = image;
  }

  ListStyleImage.prototype = {
    getMarkerHtml : function(count){
      var url = this.image.url;
      var width = this.image.width || Display.fontSize;
      var height = this.image.height || Display.fontSize;
      return Html.tagSingle("img", {
	"src":url,
	"class":"nehan-list-image",
	"width":width,
	"height":height
      });
    }
  };

  return ListStyleImage;
})();

