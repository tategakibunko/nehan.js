var BackgroundPos2d = (function(){
  function BackgroundPos2d(inline, block){
    this.inline = inline;
    this.block = block;
  }

  BackgroundPos2d.prototype = {
    getCssValue : function(flow){
      return [
	this.inline.getCssValue(flow),
	this.block.getCssValue(flow)
      ].join(" ");
    },
    getCss : function(flow){
      var css = {};
      css["background-pos"] = this.getCssValue(flow);
      return css;
    }
  };

  return BackgroundPos2d;
})();

