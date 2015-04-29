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
    this.lineBreak = false; // is line-break included in line?
    this.breakAfter = false; // is break-after incuded in line?
    this.justified = false; // is line justified?
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
       @return {boolean}
    */
    isJustified : function(){
      return this.justified;
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
       @param status {boolean}
    */
    setJustified : function(status){
      this.justified = status;
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
       @param measure {int}
    */
    addMeasure : function(measure){
      this.curMeasure += measure;
    },
    /**
       @memberof Nehan.InlineContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addTextElement : function(element, measure){
      this.elements.push(element);
      this.curMeasure += measure;
      if(element.getCharCount){
	this.charCount += element.getCharCount();
      }
    },
    /**
       @memberof Nehan.InlineContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addBoxElement : function(element, measure){
      this.elements.push(element);
      this.curMeasure += measure;
      this.charCount += (element.charCount || 0);
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
      if(element.justified){
	this.justified = true;
      }
    },
    /**
       @memberof Nehan.InlineContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getLastElement : function(){
      return List.last(this.elements);
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
      return this.isEmpty()? 0 : this.maxExtent;
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
       justify inline element with next head character, return null if nothing happend, or return new tail char if justified.

       @memberof Nehan.InlineContext
       @param head {Nehan.Char} - head_char at next line.
       @return {Nehan.Char | null}
    */
    justify : function(head){
      var last = this.elements.length - 1;
      var ptr = last;
      var tail = this.elements[ptr] || null;
      var is_tail_ng = function(tail){
	return (tail && tail.isTailNg && tail.isTailNg())? true : false;
      };
      var is_head_ng = function(head){
	return (head && head.isHeadNg && head.isHeadNg())? true : false;
      };

      if(!is_tail_ng(tail) && !is_head_ng(head)){
	return null;
      }

      //console.log("start justify:tail:%o(tail NG:%o), head:%o(head NG:%o)", tail, is_tail_ng(tail), head, is_head_ng(head));

      // if [word] is divided into [word1], [word2], then
      //    [char][word]<br>[char(head_ng)]
      // => [char][word1]<br>[word2][char(head_ng)]
      // so nothing to justify.
      if(tail && tail instanceof Word && tail.isDivided()){
	return null;
      }

      while(ptr >= 0){
	tail = this.elements[ptr];
	if(is_head_ng(head) || is_tail_ng(tail)){
	  head = tail;
	  ptr--;
	} else {
	  break;
	}
      }
      if(ptr < 0){
	return tail;
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

