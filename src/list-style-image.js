var ListStyleImage = (function(){
  function ListStyleImage(image){
    this.image = image;
  }

  ListStyleImage.prototype = {
    getMarkerAdvance : function(){
      return this.image.width || Layout.fontSize;
    },
    getMarkerHtml : function(count){
      var font_size = Layout.fontSize;
      var url = this.image.url;
      var width = this.image.width || font_size;
      var height = this.image.height || font_size;
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

