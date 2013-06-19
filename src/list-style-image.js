var ListStyleImage = (function(){
  function ListStyleImage(image){
    this.image = image;
  }

  ListStyleImage.prototype = {
    getMarkerAdvance : function(){
      return Layout.fontSize;
    },
    getMarkerHtml : function(count){
      var font_size = Layout.fontSize;
      return Html.tagSingle("img", {
	"src":this.imageURL,
	"width":font_size,
	"height":font_size
      });
    }
  };

  return ListStyleImage;
})();

