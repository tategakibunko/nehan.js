var BackgroundRepeat2d = (function(){
  // inline: BackgroundRepeat
  // block: BackgroundRepeat
  function BackgroundRepeat2d(inline, block){
    this.inline = inline;
    this.block = block;
  }

  BackgroundRepeat2d.prototype = {
    _getRepeatValue : function(flow, value){
      var is_vert = flow.isTextVertical();
      switch(value){
      case "repeat-inline": case "repeat-x":
	return is_vert? "repeat-y" : "repeat-x";
      case "repeat-block": case "repeat-y":
	return is_vert? "repeat-x" : "repeat-y";
      default:
	return value;
      }
    },
    getCssValue : function(flow){
      var values = [this.inline];
      if(!this.inline.isSingleValue()){
	values.push(this.block);
      }
      return List.map(values, function(value){
	return value.getCssValue(flow);
      }).join(" ");
    }
  };

  return BackgroundRepeat2d;
})();

