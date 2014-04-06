var PageStream = (function(){
  function PageStream(text){
    this.text = this._createSource(text);
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
    this.buffer = [];
    this._timeStart = null;
    this._timeElapsed = null;
    this._seekPageNo = 0;
    this._seekPercent = 0;
    this._seekPos = 0;
  }

  PageStream.prototype = {
    hasPage : function(page_no){
      return (typeof this.buffer[page_no] != "undefined");
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    syncGet : function(){
      this._setTimeStart();
      while(this.generator.hasNext()){
	this._getNext();
      }
      return this._setTimeElapsed();
    },
    asyncGet : function(opt){
      Args.merge(this, {
	onComplete : function(time){},
	onProgress : function(self){},
	onError : function(self){}
      }, opt || {});
      this._setTimeStart();
      this._asyncGet(opt.wait || 0);
    },
    getPageCount : function(){
      return this.buffer.length;
    },
    getGroupPageNo : function(cell_page_no){
      return cell_page_no;
    },
    getSeekPageResult : function(){
      return this._getPage(this._seekPageNo);
    },
    getSeekPageNo : function(){
      return this._seekPageNo;
    },
    getSeekPercent : function(){
      return this._seekPercent;
    },
    getSeekPos : function(){
      return this._seekPos;
    },
    getTimeElapsed : function(){
      return this._timeElapsed;
    },
    // int -> EvalResult
    _getPage : function(page_no){
      var entry = this.buffer[page_no];
      if(entry instanceof EvalResult){ // already evaluated.
	return entry;
      }
      // if still not evaluated, eval and get EvalResult
      var result = this.evaluator.evaluate(entry);
      this.buffer[page_no] = result; // over write buffer entry by result.
      return result;
    },
    _getNext : function(){
      if(!this.hasNext()){
	return null;
      }
      var cur_page_no = this._seekPageNo;
      if(!this.hasPage(cur_page_no)){
	var entry = this._yield();
	this._addBuffer(entry);
	this._seekPageNo++;
	this._seekPercent = entry.percent;
	this._seekPos = entry.seekPos;
      }
      return this._getPage(cur_page_no);
    },
    _yield : function(){
      return this.generator.yield();
    },
    _setTimeStart : function(){
      this._timeStart = (new Date()).getTime();
      return this._timeStart;
    },
    _setTimeElapsed : function(){
      this._timeElapsed = (new Date()).getTime() - this._timeStart;
      return this._timeElapsed;
    },
    _asyncGet : function(wait){
      if(!this.generator.hasNext()){
	var time = this._setTimeElapsed();
	this.onComplete(time);
	return;
      }
      var self = this;
      var entry = this._yield();
      this._addBuffer(entry);
      this.onProgress(this);
      this._seekPageNo++;
      this._seekPercent = entry.percent;
      this._seekPos = entry.seekPos;
      reqAnimationFrame(function(){
	self._asyncGet(wait);
      });
    },
    _addBuffer : function(entry){
      this.buffer.push(entry);
    },
    // common preprocessor
    _createSource : function(text){
      return text
	.replace(/(<\/[a-zA-Z0-9\-]+>)[\s]+</g, "$1<") // discard white-space between close tag and next tag.
	.replace(/\t/g, "") // discard TAB
	.replace(/<!--[\s\S]*?-->/g, "") // discard comment
	.replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
	.replace(/<rb>/gi, "") // discard rb
	.replace(/<\/rb>/gi, "") // discard /rb
	.replace(/<rt><\/rt>/gi, ""); // discard empty rt
    },
    _createGenerator : function(text){
      switch(Layout.root){
      case "document":
	return new DocumentGenerator(text);
      case "html":
	return new HtmlGenerator(text);
      default:
	return new BodyGenerator(text);
      }
    },
    _createEvaluator : function(){
      return new PageEvaluator();
    }
  };

  return PageStream;
})();

