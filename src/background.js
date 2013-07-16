var Background = (function(){
  function Background(){
  }

  Background.prototype = {
    getCss : function(flow){
      var css = {};
      if(this.pos){
	Args.copy(css, this.pos.getCss(flow));
      }
      if(this.repeat){
	Args.copy(css, this.repeat.getCss(flow));
      }
      if(this.origin){
	css["background-origin"] = this.origin;
      }
      if(this.color){
	css["background-color"] = this.color;
      }
      if(this.image){
	css["background-image"] = this.image;
      }
      if(this.attachment){
	css["background-attachment"] = this.attachment;
      }
      return css;
    }
  };

  return Background;
})();

