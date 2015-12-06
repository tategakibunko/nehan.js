Nehan.Document = (function(){
  /**
   @memberof Nehan
   @class Document
   @classdesc document abstraction for paged-media.
   @constructor
   */
  function Document(){
    this.text = "no text";
    this.styles = {};
    this.generator = null; // created when render
  }

  /**
   @memberof Nehan.Document
   @param opt {Object}
   @param opt.onProgress {Function} - fun tree:{@link Nehan.Box} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onPage {Function} - fun page:{@link Nehan.Page} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> context:{@link Nehan.RenderingContext} -> ()
   @param opt.onError {Function} - fun error:{String} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} upper bound of page count
   */
  Document.prototype.render = function(opt){
    opt = opt || {};
    this.generator =
      new Nehan.RenderingContext({
	text:Nehan.Html.normalize(this.text)
      })
      .setStyles(Nehan.globalStyle || {})
      .setStyles(this.styles)
      .createRootGenerator();
    new Nehan.PageParser(this.generator).parse(opt);
    return this;
  };
  
  /**
   @memberof Nehan.Document
   @param index {int}
   @return {Nehan.Page}
   */
  Document.prototype.getPage = function(index){
    return this.generator.context? this.generator.context.getPage(index) : null;
  };

  /**
   @memberof Nehan.Document
   @param index {int} - page index(starts from zero).
   @return {Nehan.Page}
   */
  Document.prototype.getPageCount = function(index){
    return this.generator.context? this.generator.context.getPageCount() : 0;
  };

  /**
   @memberof Nehan.Document
   @param text {String} - content html text.
   */
  Document.prototype.setContent = function(text){
    this.text = text;
    return this;
  };

  /**
   @memberof Nehan.Document
   @return {String} - content html text.
   */
  Document.prototype.getContent = function(){
    return this.text;
  };

  /**
   @memberof Nehan.Document
   @param key {String} - selector key
   @param value {Object} - selector value
   @example
   * var doc = new Nehan.Document();
   * doc.setStyle("body", {fontSize:"16px"});
   */
  Document.prototype.setStyle = function(key, value){
    this.styles[key] = value;
    return this;
  };

  /**
   @memberof Nehan.Document
   @param values {Object} - (selector, value) set
   @example
   * var doc = new Nehan.Document();
   * doc.setStyles({
   *   body:{
   *     fontSize:"16px"
   *   },
   *   h1:{
   *     margin:{after:"1rem"}
   *   }
   * });
   */
  Document.prototype.setStyles = function(values){
    for(var key in values){
      this.setStyle(key, values[key]);
    }
    return this;
  };

  /**
   @memberof Nehan.Document
   @param anchor_name {String}
   @return {int}
   */
  Document.prototype.getAnchorPageNo = function(anchor_name){
    return this.generator.context? this.generator.context.getAnchorPageNo(anchor_name) : -1;
  };

  /**
   @memberof Nehan.Document
   @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
   @return {DOMElement}
   */
  Document.prototype.createOutlineElement = function(callbacks){
    return this.generator.context? this.generator.context.createOutlineElementByName("body", callbacks) : null;
  };

  return Document;
})();
