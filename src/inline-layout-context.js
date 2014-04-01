var InlineLayoutContext = (function(){
  function InlineLayoutContext(max_measure){
    this.charCount = 0;
    this.measure = 0;
    this.maxMeasure = max_measure; // const
    this.elements = [];
    this.texts = [];
    this.br = false;
  }

  InlineLayoutContext.prototype = {
    isEmpty : function(){
      return !this.br && this.elements.length === 0;
    },
    hasLineBreak : function(){
      return this.br;
    },
    setLineBreak : function(status){
      this.br = status;
    },
    setMaxMeasure : function(measure){
      this.maxMeasure = measure;
    },
    addElement : function(element, measure){
      this.elements.push(element);
      if(Token.isText(element)){
	this.texts.push(element);
	if(element.getCharCount){
	  this.charCount += element.getCharCount();
	}
      }
      this.measure += measure;
    },
    getPrevText : function(){
      return List.last(this.texts);
    },
    getTexts : function(){
      return this.texts;
    },
    getElements : function(){
      return this.elements;
    },
    getMeasure : function(){
      return this.measure;
    },
    getRestMeasure : function(){
      return this.maxMeasure - this.measure;
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
    },
    restoreContext : function(line){
      this.texts = line.texts || [];
      this.elements = line.elements || [];
      this.br = line.hasLineBreak || false;
      this.measure = line.inlineMeasure || 0;
      this.charCount = this.texts.length || 0;
    }
  };

  return InlineLayoutContext;
})();

