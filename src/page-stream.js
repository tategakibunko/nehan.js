var PageStream = (function(){
  /**
     @memberof Nehan
     @class PageStream
     @classdesc async stream of paged-media.
     @param text {String} - html source text
  */
  function PageStream(text){
    this.text = this._createSource(text);
    this._trees = [];
    this._pages = [];
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
  }

  PageStream.prototype = {
    hasPage : function(page_no){
      return (typeof this._trees[page_no] != "undefined");
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    addText : function(text){
      this.generator.addText(text);
    },
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    syncGet : function(){
      var page_no = 0;
      this._setTimeStart();
      while(this.hasNext()){
	if(!this.hasPage(page_no)){
	  var tree = this._yield();
	  if(tree){
	    this._addTree(tree);
	    page_no++;
	  }
	}
      }
      return this._getTimeElapsed();
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
      return this._trees.length;
    },
    // same as getPage, defined to keep compatibility of older version of nehan.js
    get : function(page_no){
      return this.getPage(page_no);
    },
    // int -> Page
    getPage : function(page_no){
      if(this._pages[page_no]){
	return this._pages[page_no];
      }
      var tree = this._trees[page_no] || null;
      if(tree === null){
	return null;
      }
      var page = this.evaluator.evaluate(tree);
      this._pages[page_no] = page;
      return page;
    },
    getTree : function(page_no){
      return this._trees[page_no] || null;
    },
    // () -> tree
    _yield : function(){
      return this.generator.yield();
    },
    _setTimeStart : function(){
      this._timeStart = (new Date()).getTime();
      return this._timeStart;
    },
    _getTimeElapsed : function(){
      return (new Date()).getTime() - this._timeStart;
    },
    _asyncGet : function(wait){
      if(!this.generator.hasNext()){
	this.onComplete(this, this._getTimeElapsed());
	return;
      }
      // notice that result of yield is not a page object, it's abstruct layout tree,
      // so you need to call 'getPage' to get actual page object.
      var tree = this._yield();
      if(tree){
	this._addTree(tree);
	this.onProgress(this, tree);
      }
      var self = this;
      reqAnimationFrame(function(){
	self._asyncGet(wait);
      });
    },
    _addTree : function(tree){
      this._trees.push(tree);
    },
    _createSource : function(text){
      return text
	.replace(/\t/g, "") // discard TAB
	.replace(/<!--[\s\S]*?-->/g, "") // discard comment
	.replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
	.replace(/<rb>/gi, "") // discard rb
	.replace(/<\/rb>/gi, "") // discard /rb
	.replace(/<rt><\/rt>/gi, ""); // discard empty rt
    },
    _createGenerator : function(text){
      switch(Display.root){
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

