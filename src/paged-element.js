Nehan.PagedElement = (function(){
  /**
     @memberof Nehan
     @class PagedElement
     @classdesc DOM element with {@link Nehan.Document}
  */
  function NehanPagedElement(){
    this.pageNo = 0;
    this.document = new Nehan.Document();
    this.element = document.createElement("div");
  }

  /**
   check if current page position is at last.

   @memberof Nehan.PagedElement
   @return {boolean}
   */
  NehanPagedElement.prototype.isLastPage = function(){
    return this.getPageNo() + 1 >= this.getPageCount();
  };
  /**
   get inner DOMElement containning current page element.

   @memberof Nehan.PagedElement
   */
  NehanPagedElement.prototype.getElement = function(){
    return this.element;
  };
  /**
   get content text

   @memberof Nehan.PagedElement
   @return {String}
   */
  NehanPagedElement.prototype.getContent = function(){
    return this.document.getContent();
  };
  /**
   @memberof Nehan.PagedElement
   @return {int}
   */
  NehanPagedElement.prototype.getPageCount = function(){
    return this.document.getPageCount();
  };
  /**
   @memberof Nehan.PagedElement
   @param index {int}
   @return {Nehan.Page}
   */
  NehanPagedElement.prototype.getPage = function(index){
    return this.document.getPage(index);
  };
  /**
   get current page index

   @memberof Nehan.PagedElement
   @return {int}
   */
  NehanPagedElement.prototype.getPageNo = function(){
    return this.pageNo;
  };
  /**
   set inner page position to next page and return next page if exists, else null.

   @memberof Nehan.PagedElement
   @return {Nehan.Page | null}
   */
  NehanPagedElement.prototype.setNextPage = function(){
    if(this.pageNo + 1 < this.getPageCount()){
      return this.setPage(this.pageNo + 1);
    }
    return null;
  };
  /**
   set inner page posision to previous page and return previous page if exists, else null.

   @memberof Nehan.PagedElement
   @return {Nehan.Page | null}
   */
  NehanPagedElement.prototype.setPrevPage = function(){
    if(this.pageNo > 0){
      return this.setPage(this.pageNo - 1);
    }
    return null;
  };
  /**
   * set selector value. [name] is selector key, value is selector value.<br>
   * see example at setStyle of {@link Nehan.Engine}.

   @memberof Nehan.PagedElement
   @param name {String} - selector string
   @param value {selector_value}
   */
  NehanPagedElement.prototype.setStyle = function(name, value){
    this.document.setStyle(name, value);
    return this;
  };
  /**
   set selector key and values. see example at setStyles of {@link Nehan.Engine}.

   @memberof Nehan.PagedElement
   @param value {Object}
   */
  NehanPagedElement.prototype.setStyles = function(values){
    this.document.setStyles(values);
    return this;
  };
  /**
   set content string.
   @memberof Nehan.PagedElement
   @param content {String} - html text.
   */
  NehanPagedElement.prototype.setContent = function(content, opt){
    this.document.setContent(content);
    this.document.render(opt);
    this.setPage(0);
    return this;
  };
  /**
   start parsing.
   @memberof Nehan.PagedElement
   @param opt {Object} - optinal argument
   @param opt.onProgress {Function} - fun {@link Nehan.Box} -> {@link Nehan.PagedElement} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> {@link Nehan.PagedElement} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} - upper bound of page count
   */
  NehanPagedElement.prototype.render = function(opt){
    this.document.render(opt);
    return this;
  };
  /**
   set current page index to [page_no]

   @memberof Nehan.PagedElement
   @param page_no {int}
   @return {Nehan.Page | null}
   */
  NehanPagedElement.prototype.setPage = function(page_no){
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
  };
  /**<pre>
   * create outline element of "<body>",
   * if multiple body exists, only first one is returned.
   * about callback argument, see {@link Nehan.SectionTreeConverter}.
   *</pre>
   @memberof Nehan.PagedElement
   @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
   */
  NehanPagedElement.prototype.createOutlineElement = function(callbacks){
    return this.document.createOutlineElement(callbacks);
  };

  return NehanPagedElement;
})();

/**
   @namespace Nehan
   @memberof Nehan
   @method createPagedElement
   @return {Nehan.PagedElement}
*/
Nehan.createPagedElement = function(){
  return new Nehan.PagedElement();
};
