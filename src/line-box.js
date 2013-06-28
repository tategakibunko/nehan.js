var LineBox = (function(){
  function LineBox(opt){
    this._type = "line-box";
    this.parent = opt.parent;
    this.measure = opt.measure || 0;
    this.extent = opt.extent || 0;
    this.rubyLine = opt.rubyLine || null;
    this.textLine = opt.textLine || null;
  }

  LineBox.prototype = {
    _getLinesRubyLineFirst : function(){
      var ret = [];
      if(this.rubyLine){
	ret.push(this.rubyLine);
      }
      if(this.textLine){
	ret.push(this.textLine);
      }
      return ret;
    },
    _getLinesTextLineFirst : function(){
      var ret = [];
      if(this.textLine){
	ret.push(this.textLine);
      }
      if(this.rubyLine){
	ret.push(this.rubyLine);
      }
      return ret;
    },
    getLines : function(){
      var flow = this.parent.flow;
      if(flow.isRubyLineFirst()){
	return this._getLinesRubyLineFirst();
      }
      return this._getLinesTextLineFirst();
    },
    getCharCount : function(){
      return this.textLine? this.textLine.getCharCount() : 0;
    },
    getTextLine : function(){
      return this.textLine;
    },
    getRubyLine : function(){
      return this.rubyLine;
    },
    getTextMeasure : function(){
      return this.textLine.getTextMeasure();
    },
    getContentMeasure : function(){
      return this.textLine.getContentMeasure();
    },
    getBoxMeasure : function(){
      return this.measure;
    },
    getBoxExtent : function(){
      return this.extent;
    }
  };

  return LineBox;
})();
