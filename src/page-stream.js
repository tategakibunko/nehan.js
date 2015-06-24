var PageStream = (function(){
  /**
     @memberof Nehan
     @class PageStream
     @classdesc async stream of paged-media.
     @consturctor
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
    /**
       @memberof Nehan.PageStream
       @param page_no {int} - page index
       @return {boolean}
    */
    hasPage : function(page_no){
      return (typeof this._trees[page_no] != "undefined");
    },
    /**
       @memberof Nehan.PageStream
       @return {boolean}
    */
    hasNext : function(){
      return this.generator.hasNext();
    },
    /**
       @memberof Nehan.PageStream
       @param text {String}
    */
    addText : function(text){
      this.generator.addText(text);
    },
    /**
       @memberof Nehan.PageStream
       @param status {boolean}
    */
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    /**
       calculate pages by blocking loop until max_page_count if defined.

       @memberof Nehan.PageStream
       @param max_page_count {int}
       return {float} ellapsed time
    */
    syncGet : function(max_page_count){
      var page_no = 0;
      max_page_count = max_page_count || -1;
      this._setTimeStart();
      while(this.hasNext()){
	if(max_page_count >= 0 && page_no >= max_page_count){
	  break;
	}
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
    /**
       calculate all pages by asyncronous way.

       @memberof Nehan.PageStream
       @param opt {Object}
       @param opt.onProgress {Function} - fun {@link Nehan.PageStream} -> {@link Nehan.Box} -> ()
       @param opt.onComplete {Function} - fun {@link Nehan.PageStream} -> ellapse_time:float -> ()
       @param opt.onError {Function} - fun {@link Nehan.PageStream} -> ()
       @param opt.maxPageCount {int} upper bound of page count
    */
    asyncGet : function(opt){
      var wait = opt.wait || 0;
      var max_page_count = opt.maxPageCount || -1;
      Nehan.Args.merge(this, {
	onComplete : function(sender, time){},
	onProgress : function(sender, tree){},
	onError : function(sender){}
      }, opt || {});
      this._setTimeStart();
      this._asyncGet(wait, max_page_count);
    },
    /**
       @memberof Nehan.PageStream
       @return {int}
    */
    getPageCount : function(){
      return this._trees.length;
    },
    /**
       same as getPage, defined to keep compatibility of older version of nehan.js

       @memberof Nehan.PageStream
       @param page_no {int} - page index starts from 0.
       @deprecated
    */
    get : function(page_no){
      return this.getPage(page_no);
    },
    /**
       get evaluated page object.

       @memberof Nehan.PageStream
       @param page_no {int} - page index starts from 0.
       @return {Nehan.Page}
    */
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
    /**
       get pre evaluated page tree.

       @memberof Nehan.PageStream
       @param page_no {int} - page index starts from 0.
       @return {Nehan.Box}
    */
    getTree : function(page_no){
      return this._trees[page_no] || null;
    },
    /**
       find tree object by fn(Nehan.Box -> bool).

       @memberof Nehan.PageStream
       @param fn {Function} - Nehan.Box -> bool
       @return {Nehan.Box}
    */
    findTree : function(fn){
      return Nehan.List.find(this._trees, fn);
    },
    /**
       find page object by fn(Nehan.Page -> bool).

       @memberof Nehan.PageStream
       @param fn {Function} - Nehan.Page -> bool
       @return {Nehan.Page}
    */
    findPage : function(fn){
      return Nehan.List.find(this._pages, fn);
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
    _asyncGet : function(wait, max_page_count){
      if(!this.generator.hasNext() || (max_page_count >= 0 && this._trees.length >= max_page_count)){
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
      reqAnimationFrame(function(){
	this._asyncGet(wait, max_page_count);
      }.bind(this));
    },
    _addTree : function(tree){
      this._trees.push(tree);
    },
    _createSource : function(text){
      return text
	//.replace(/\t/g, "") // discard TAB
	.replace(/<!--[\s\S]*?-->/g, "") // discard comment
	.replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
	.replace(/<rb>/gi, "") // discard rb
	.replace(/<\/rb>/gi, "") // discard /rb
	.replace(/<rt><\/rt>/gi, ""); // discard empty rt
    },
    _createGenerator : function(text){
      switch(Nehan.Display.root){
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

