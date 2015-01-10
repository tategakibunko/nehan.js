Nehan.PagedElement = (function(){
  /**
     @memberof Nehan
     @class PagedElement
     @classdesc DOM element with {@link Nehan.PageStream}
     @constructor
     @param engine_args {Object}
     @param engine_args.config {Nehan.Config} - system config
     @param engine_args.display {Nehan.Display} - standard page parameters
     @param engine_args.style {Nehan.Style} - engine local style
  */
  function NehanPagedElement(engine_args){
    this.pageNo = 0;
    this.element = document.createElement("div");
    this.engine = Nehan.setup(engine_args);
    this._pageStream = null;
  }

  NehanPagedElement.prototype = {
    isLastPage : function(){
      return this.getPageNo() + 1 >= this.getPageCount();
    },
    getEngine : function(){
      return this.engine;
    },
    getElement : function(){
      return this.element;
    },
    getContent : function(){
      return this._pageStream? this._pageStream.text : "";
    },
    getPageCount : function(){
      return this._pageStream? this._pageStream.getPageCount() : 0;
    },
    getPage : function(page_no){
      return this._pageStream? this._pageStream.getPage(page_no) : null;
    },
    getPagedElement : function(page_no){
      var page = this.getPage(page_no);
      return page? page.element : null;
    },
    getPageNo : function(){
      return this.pageNo;
    },
    setNextPage : function(){
      if(this.pageNo + 1 < this.getPageCount()){
	return this.setPage(this.pageNo + 1);
      }
      return null;
    },
    setPrevPage : function(){
      if(this.pageNo > 0){
	return this.setPage(this.pageNo - 1);
      }
      return null;
    },
    setStyle : function(name, value){
      this.engine.setStyle(name, value);
      return this;
    },
    setStyles : function(values){
      this.engine.setStyles(values);
      return this;
    },
    setContent : function(content, opt){
      this._pageStream = this.engine.createPageStream(content);
      this._asyncGet(opt || {});
      return this;
    },
    addContent : function(content, opt){
      this._pageStream.addText(content);
      this._asyncGet(opt || {});
    },
    setPage : function(page_no){
      var page = this.getPage(page_no);
      if(page === null || page.element === null){
	throw "page_no(" + page_no + ") is not found";
      }
      this.pageNo = page_no;
      while(this.element.firstChild){
	this.element.removeChild(this.element.firstChild);
      }
      this.element.appendChild(page.element);
      return page;
    },
    _asyncGet : function(opt){
      this._pageStream.asyncGet({
	onProgress : function(stream, tree){
	  if(tree.pageNo === 0){
	    this.setPage(tree.pageNo);
	  }
	  if(opt.onProgress){
	    opt.onProgress(tree);
	  }
	}.bind(this),
	onComplete : function(stream, time){
	  if(opt.onComplete){
	    opt.onComplete(time);
	  }
	}.bind(this)
      });
    }
  };
  
  return NehanPagedElement;
})();

Nehan.createPagedElement = function(engine_args){
  return new Nehan.PagedElement(engine_args || {});
};
