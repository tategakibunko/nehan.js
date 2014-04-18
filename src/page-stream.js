var PageStream = (function(){
  function PageStream(text, group_size){
    this.text = this._createSource(text);
    this.groupSize = group_size;
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
    this.buffer = [];
    this._timeStart = null;
    this._timeElapsed = null;
  }

  PageStream.prototype = {
    hasPage : function(page_no){
      return (typeof this.buffer[page_no] != "undefined");
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    syncGet : function(){
      var page_no = 0;
      this._setTimeStart();
      while(this.hasNext()){
	if(!this.hasPage(page_no)){
	  var tree = this._yield();
	  this._addBuffer(tree);
	}
	var page = this.getPage(page_no);
	page_no++;
      }
      return this._setTimeElapsed();
    },
    asyncGet : function(opt){
      Args.merge(this, {
	onComplete : function(self, time){},
	onProgress : function(self, tree){},
	onError : function(self){}
      }, opt || {});
      this._setTimeStart();
      this._asyncGet(opt.wait || 0);
    },
    getPageCount : function(){
      return this.buffer.length;
    },
    // getGroupPageNo is called from PageGroupStream.
    // notice that this stream is constructed by single page,
    // so cell_page_no is always equals to group_page_no.
    getGroupPageNo : function(cell_page_no){
      return cell_page_no;
    },
    getTimeElapsed : function(){
      return this._timeElapsed;
    },
    // same as getPage, defined to keep compatibility of older version of nehan.js
    get : function(page_no){
      return this.getPage(page_no);
    },
    // int -> Page
    getPage : function(page_no){
      var entry = this.buffer[page_no];
      if(this._isEvaluated(entry)){
	return entry; // already evaluated
      }
      // if still not evaluated, eval and get EvalResult
      var result = this.evaluator.evaluate(entry);
      this.buffer[page_no] = result; // over write buffer entry by result.
      return result;
    },
    // () -> tree
    _yield : function(){
      return this.generator.yield();
    },
    _isEvaluated : function(entry){
      return (entry instanceof Page);
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
	this.onComplete(this, this._setTimeElapsed());
	return;
      }
      // notice that result of yield is not a page object, it's abstruct layout tree,
      // so you need to call 'getPage' to get actual page object.
      var tree = this._yield();
      if(tree){
	this._addBuffer(tree);
	this.onProgress(this, tree);
      }
      var self = this;
      reqAnimationFrame(function(){
	self._asyncGet(wait);
      });
    },
    _addBuffer : function(tree){
      this.buffer.push(tree);
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

