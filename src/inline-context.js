var InlineContext = (function(){
  function InlineContext(max_measure){
    this.charCount = 0;
    this.curMeasure = 0;
    this.maxMeasure = max_measure; // const
    this.maxExtent = 0;
    this.maxFontSize = 0;
    this.elements = [];
    this.texts = [];
    this.lineBreak = false; // is line-break included in line?
    this.breakAfter = false; // is break-after incuded in line?
  }

  InlineContext.prototype = {
    isEmpty : function(){
      return !this.lineBreak && !this.breakAfter && this.elements.length === 0;
    },
    hasSpaceFor : function(measure){
      return this.getRestMeasure() >= measure;
    },
    hasLineBreak : function(){
      return this.lineBreak;
    },
    setLineBreak : function(status){
      this.lineBreak = status;
    },
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    setBreakAfter : function(status){
      this.breakAfter = status;
    },
    addElement : function(element, measure){
      this.elements.push(element);
      if(Token.isText(element)){
	this.texts.push(element);
	if(element.getCharCount){
	  this.charCount += element.getCharCount();
	}
      } else if(element instanceof Box){
	if(element.maxExtent){
	  this.maxExtent = Math.max(this.maxExtent, element.maxExtent);
	} else {
	  this.maxExtent = Math.max(this.maxExtent, element.getLayoutExtent());
	}
	if(element.maxFontSize){
	  this.maxFontSize = Math.max(this.maxFontSize, element.maxFontSize);
	}
	if(element.breakAfter){
	  this.breakAfter = true;
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
    getMaxExtent : function(){
      return this.maxExtent;
    },
    getMaxFontSize : function(){
      return this.maxFontSize;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getLastChar : function(){
      return List.last(this.texts);
    },
    justify : function(head){
      var last = this.texts.length - 1, ptr = last, tail;
      while(ptr >= 0){
	tail = this.texts[ptr];
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

