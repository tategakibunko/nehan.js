Nehan.PagedElement = (function(){
  /**
     @memberof Nehan
     @class PagedElement
     @classdesc DOM element with {@link Nehan.PageStream}
     @constructor
     @param engine_args {Object}
     @param engine_args.style {Nehan.Style} - engine local style
  */
  function NehanPagedElement(engine_args){
    this.pageNo = 0;
    this.element = document.createElement("div");
    this.engine = Nehan.createEngine(engine_args);
    this._pageStream = null;
  }

  NehanPagedElement.prototype = {
    /**
       check if current page position is at last.

       @memberof Nehan.PagedElement
       @return {boolean}
    */
    isLastPage : function(){
      return this.getPageNo() + 1 >= this.getPageCount();
    },
    /**
       get nner {@link Nehan.Engine} interfaces.

       @memberof Nehan.PagedElement
       @return {Nehan.Engine}
    */
    getEngine : function(){
      return this.engine;
    },
    /**
       get inner DOMElement containning current page element.

       @memberof Nehan.PagedElement
    */
    getElement : function(){
      return this.element;
    },
    /**
       get content text

       @memberof Nehan.PagedElement
       @return {String}
    */
    getContent : function(){
      return this._pageStream? this._pageStream.text : "";
    },
    /**
       @memberof Nehan.PagedElement
       @return {int}
    */
    getPageCount : function(){
      return this._pageStream? this._pageStream.getPageCount() : 0;
    },
    /**
       @memberof Nehan.PagedElement
       @return {Nehan.Page}
    */
    getPage : function(page_no){
      return this._pageStream? this._pageStream.getPage(page_no) : null;
    },
    /**
       @memberof Nehan.PagedElement
       @param page_no {int} - page index starts from 0.
       @return {DOMElement}
    */
    getPagedElement : function(page_no){
      var page = this.getPage(page_no);
      return page? page.element : null;
    },
    /**
       get current page index

       @memberof Nehan.PagedElement
       @return {int}
    */
    getPageNo : function(){
      return this.pageNo;
    },
    /**
       find logical page object by fn(Nehan.Box -> bool).

       @memberof Nehan.PagedElement
       @param fn {Function} - Nehan.Box -> bool
       @return {Nehan.Box}
    */
    find : function(fn){
      return this._pageStream? this._pageStream.find(fn) : null;
    },
    /**
       filter logical page object by fn(Nehan.Box -> bool).

       @memberof Nehan.PagedElement
       @param fn {Function} - Nehan.Box -> bool
       @return {Array.<Nehan.Page>}
    */
    filter: function(fn){
      return this._pageStream? this._pageStream.filter(fn) : [];
    },
    /**
       set inner page position to next page and return next page if exists, else null.

       @memberof Nehan.PagedElement
       @return {Nehan.Page | null}
    */
    setNextPage : function(){
      if(this.pageNo + 1 < this.getPageCount()){
	return this.setPage(this.pageNo + 1);
      }
      return null;
    },
    /**
       set inner page posision to previous page and return previous page if exists, else null.

       @memberof Nehan.PagedElement
       @return {Nehan.Page | null}
    */
    setPrevPage : function(){
      if(this.pageNo > 0){
	return this.setPage(this.pageNo - 1);
      }
      return null;
    },
    /**
     * set selector value. [name] is selector key, value is selector value.<br>
     * see example at setStyle of {@link Nehan.Engine}.

       @memberof Nehan.PagedElement
       @param name {String} - selector string
       @param value {selector_value}
    */
    setStyle : function(name, value){
      this.engine.setStyle(name, value);
      return this;
    },
    /**
       set selector key and values. see example at setStyles of {@link Nehan.Engine}.

       @memberof Nehan.PagedElement
       @param value {Object}
    */
    setStyles : function(values){
      this.engine.setStyles(values);
      return this;
    },
    /**
       set content string to paged element and start parsing.

       @memberof Nehan.PagedElement
       @param content {String} - html text.
       @param opt {Object} - optinal argument
       @param opt.onProgress {Function} - fun tree ctx -> ()
       @param opt.onComplete {Function} - fun time ctx -> ()
       @param opt.capturePageText {bool} output text node or not for each page object.
       @param opt.maxPageCount {int} - upper bound of page count
       @example
       * paged_element.setContent("<h1>hello, nehan.js!!</h1>", {
       *   onProgress:function(tree, ctx){
       *     console.log("page no:%d", tree.pageNo);
       *     console.log("progress:%d", tree.percent);
       *   },
       *   onComplete:function(time){
       *     console.log("complete:%fmsec", time);
       *   }
       * });
    */
    setContent : function(content, opt){
      this._pageStream = this.engine.createPageStream(content);
      this._asyncGet(opt || {});
      return this;
    },
    /**
       append additional text to paged element.

       @memberof Nehan.PagedElement
       @param content {String} - html text.
       @param opt {Object} - optinal argument
       @param opt.onProgress {Function} - fun tree ctx -> ()
       @param opt.onComplete {Function} - fun time ctx -> ()
       @param opt.maxPageCount {int} - upper bound of page count
    */
    addContent : function(content, opt){
      this._pageStream.addText(content);
      this._asyncGet(opt || {});
    },
    /**
       set current page index to [page_no]

       @memberof Nehan.PagedElement
       @param page_no {int}
       @return {Nehan.Page | null}
    */
    setPage : function(page_no){
      var page = this.getPage(page_no);
      if(page === null || page.element === null){
	//console.error("page_no(%d) is not found", page_no);
	return null;
      }
      this.pageNo = page_no;
      while(this.element.firstChild){
	this.element.removeChild(this.element.firstChild);
      }
      this.element.appendChild(page.element);
      return page;
    },
    /**<pre>
     * create outline element of "<body>",
     * if multiple body exists, only first one is returned.
     * about callback argument, see {@link Nehan.SectionTreeConverter}.
     *</pre>
     @memberof Nehan.PagedElement
     @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
    */
    createOutlineElement : function(callbacks){
      return this.engine.createOutlineElement(callbacks);
    },
    _asyncGet : function(opt){
      this._pageStream.asyncGet({
	capturePageText:(opt.capturePageText || false),
	maxPageCount:(opt.maxPageCount || -1),
	onProgress : function(sender, tree){
	  if(tree.pageNo === 0){
	    this.setPage(tree.pageNo);
	  }
	  if(opt.onProgress){
	    opt.onProgress(tree, {
	      sender:this
	    });
	  }
	}.bind(this),
	onComplete : function(sender, time){
	  if(opt.onComplete){
	    opt.onComplete(time, {
	      sender:this
	    });
	  }
	}.bind(this)
      });
    }
  };
  
  return NehanPagedElement;
})();

/**
   @namespace Nehan
   @memberof Nehan
   @method createPagedElement
   @param engine_args {Object}
   @param engine_args.config {Nehan.Config} - system config
   @param engine_args.display {Nehan.Display} - standard page parameters
   @param engine_args.style {Nehan.Style} - engine local style
   @return {Nehan.PagedElement}
*/
Nehan.createPagedElement = function(engine_args){
  return new Nehan.PagedElement(engine_args || {});
};
