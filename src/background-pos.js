var BackgroundPos = (function(){
  function BackgroundPos(pos, offset){
    this.pos = pos || "center";
    this.offset = offset || 0;
  }

  BackgroundPos.prototype = {
    getCssValue : function(flow){
      var ret = [flow.getProp(this.pos)];
      if(this.offset){
	ret.push(this.offset);
      }
      return ret.join(" ");
    }
  };

  return BackgroundPos;
})();

