var InlineContext = (function(){
  function InlineContext(max_measure){
    this.charCount = 0;
    this.curMeasure = 0;
    this.maxMeasure = max_measure; // const
    this.elements = [];
    this.texts = [];
    this.br = false;
  }

  InlineContext.prototype = {
    isEmpty : function(){
      return !this.br && this.elements.length === 0;
    },
    isSpaceLeft : function(){
      return this.getRestMeasure() > 0;
    },
    hasSpaceFor : function(measure){
      return this.getRestMeasure() >= measure;
    },
    hasBr : function(){
      return this.br;
    },
    setLineBreak : function(status){
      this.br = status;
    },
    addElement : function(element, measure){
      this.elements.push(element);
      if(Token.isText(element)){
	this.texts.push(element);
	if(element.getCharCount){
	  this.charCount += element.getCharCount();
	}
      }
      this.curMeasure += measure;
    },
    getLastText : function(){
      return List.last(this.texts);
    },
    getTexts : function(){
      return this.texts;
    },
    getElements : function(){
      return this.elements;
    },
    getCurMeasure : function(){
      return this.curMeasure;
    },
    getRestMeasure : function(){
      return this.maxMeasure - this.curMeasure;
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getLastChar : function(){
      return List.last(this.texts);
    },
    justify : function(head){
      var last = this.texts.length - 1;
      var ptr = last;
      while(ptr >= 0){
	var tail = this.texts[ptr];
	if(head && head.isHeadNg && head.isHeadNg() || tail.isTailNg && tail.isTailNg()){
	  head = tail;
	  ptr--;
	} else {
	  break;
	}
      }
      // if ptr moved, justification is executed.
      if(0 <= ptr && ptr < last){
	// disable text after new tail pos.
	this.elements = List.filter(this.elements, function(element){
	  return element.pos? (element.pos <= tail.pos) : true;
	});
	return tail; // return new tail
      }
      return null; // justify failed or not required.
    }
  };

  return InlineContext;
})();

