var InlineContext = (function(){
  /**
     @memberof Nehan
     @class InlineContext
     @classdesc context data of inline level.
     @constructor
     @param max_measure {int} - maximum posistion of inline in px.
  */
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
    /**
       @memberof Nehan.InlineContext
       @return {boolean}
    */
    isEmpty : function(){
      return !this.lineBreak && !this.breakAfter && this.elements.length === 0;
    },
    /**
       @memberof Nehan.InlineContext
       @param measure {int}
       @return {boolean}
    */
    hasSpaceFor : function(measure){
      return this.getRestMeasure() >= measure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {boolean}
    */
    hasLineBreak : function(){
      return this.lineBreak;
    },
    /**
       @memberof Nehan.InlineContext
       @param status {boolean}
    */
    setLineBreak : function(status){
      this.lineBreak = status;
    },
    /**
       @memberof Nehan.InlineContext
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    /**
       @memberof Nehan.InlineContext
       @param status {boolean}
    */
    setBreakAfter : function(status){
      this.breakAfter = status;
    },
    /**
       @memberof Nehan.InlineContext
       @param element {Nehan.Box}
       @param measure {int}
    */
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
    /**
       @memberof Nehan.InlineContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getLastText : function(){
      return List.last(this.texts);
    },
    /**
       get text elements.

       @memberof Nehan.InlineContext
       @return {Array}
    */
    getTexts : function(){
      return this.texts;
    },
    /**
       get all elements.

       @memberof Nehan.InlineContext
       @return {Array}
    */
    getElements : function(){
      return this.elements;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getCurMeasure : function(){
      return this.curMeasure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getRestMeasure : function(){
      return this.maxMeasure - this.curMeasure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getMaxExtent : function(){
      return this.maxExtent;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getMaxFontSize : function(){
      return this.maxFontSize;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getCharCount : function(){
      return this.charCount;
    },
    /**
       @memberof Nehan.InlineContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getLastChar : function(){
      return List.last(this.texts);
    },
    /**
       justify inline element with next head character, return null if nothing happend, or return new tail char if justified.

       @memberof Nehan.InlineContext
       @param head {Nehan.Char} - head_char at next line.
       @return {Nehan.Char | null}
    */
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
	  return element.pos? (element.pos < head.pos) : true;
	});
	return head; // return new head
      }
      return null; // justify failed or not required.
    }
  };

  return InlineContext;
})();

