Nehan.DocumentContext = (function(){
  /**
   @memberof Nehan
   @class Nehan.DocumentContext
   @constructor
  */
  function DocumentContext(){
    this.documentType = "html";
    this.documentHeader = null;
    this.pages = [];
    this.pageNo = 0;
    this.charPos = 0;
    this.anchors = {};
    this.outlineContexts = [];
    this.headerId = 0; // unique header-id
    this.blockId = 0; // unique block-id
    this.lineBreakCount = 0; // count of <BR> tag, used to generate paragraph-id(<block_id>-<br_count>).
  }

  /**
   @memberof Nehan.DocumentContext
   @param document_type {String}
   */
  DocumentContext.prototype.setDocumentType = function(document_type){
    this.documentType = document_type;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {String}
   */
  DocumentContext.prototype.getDocumentType = function(){
    return this.documentType;
  };
  /**
   @memberof Nehan.DocumentContext
   @param document_header {Nehan.DocumentHeader}
   */
  DocumentContext.prototype.setDocumentHeader = function(document_header){
    this.documentHeader = document_header;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {Nehan.DocumentHeader}
   */
  DocumentContext.prototype.getDocumentHeader = function(){
    return this.documentHeader;
  };
  /**
   @memberof Nehan.DocumentContext
   @param char_pos {int}
   */
  DocumentContext.prototype.stepCharPos = function(char_pos){
    this.charPos += char_pos;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.getCharPos = function(){
    return this.charPos;
  };
  /**
   @memberof Nehan.DocumentContext
   */
  DocumentContext.prototype.stepPageNo = function(){
    this.pageNo++;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.getPageNo = function(){
    return this.pageNo;
  };
  /**
   @memberof Nehan.DocumentContext
   @param page {Nehan.Box | Nehan.Page}
   */
  DocumentContext.prototype.addPage = function(page){
    this.pages.push(page);
  };
  /**
   @memberof Nehan.DocumentContext
   @param outline_context {Nehan.OutlineContext}
   */
  DocumentContext.prototype.addOutlineContext = function(outline_context){
    this.outlineContexts.push(outline_context);
  };
  /**
   @memberof Nehan.DocumentContext
   @param name {String}
   */
  DocumentContext.prototype.addAnchor = function(name){
    this.anchors[name] = this.pageNo;
  };
  /**
   @memberof Nehan.DocumentContext
   @param name {String}
   @return {int}
   */
  DocumentContext.prototype.getAnchorPageNo = function(name){
    return (typeof this.anchors[name] === "undefined")? null : this.anchors[name];
  };
  /**
   @memberof Nehan.DocumentContext
   @return {String}
   */
  DocumentContext.prototype.genHeaderId = function(){
    return [Nehan.engineId, this.headerId++].join("-");
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.genBlockId = function(){
    return this.blockId++;
  };
  /**
   @memberof Nehan.DocumentContext
   */
  DocumentContext.prototype.incLineBreakCount = function(){
    this.lineBreakCount++;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {String}
   */
  DocumentContext.prototype.getParagraphId = function(){
    return [this.blockId, this.lineBreakCount].join("-");
  };
  /**
   * create outline element for [section_root_name], returns multiple elements,<br>
   * because there may be multiple section root(&lt;figure&gt;, &lt;fieldset&gt; ... etc) in document.<br>
   * for details of callback function, see {@link Nehan.SectionTreeConverter}.

   @memberof Nehan.DocumentContext
   @param section_root_name {String}
   @param callbacks {Object} - hooks for each outline element.
   @param callbacks.onClickLink {Function}
   @param callbacks.createRoot {Function}
   @param callbacks.createChild {Function}
   @param callbacks.createLink {Function}
   @param callbacks.createToc {Function}
   @param callbacks.createPageNoItem {Function}
   */
  DocumentContext.prototype.createOutlineElementByName = function(section_root_name, callbacks){
    var contexts = this._getOutlineContextByName(section_root_name);
    return contexts.reduce(function(ret, context){
      var element = this._convertOutlineContextToElement(context, callbacks);
      return element? ret.concat(element) : ret;
    }.bind(this), []);
  };

  DocumentContext.prototype._getOutlineContextByName = function(section_root_name){
    return this.outlineContexts.filter(function(context){
      return context.getMarkupName() === section_root_name;
    });
  };

  DocumentContext.prototype._convertOutlineContextToElement = function(context, callbacks){
    var tree = Nehan.OutlineContextParser.parse(context);
    return tree? Nehan.SectionTreeConverter.convert(tree, callbacks) : null;
  };

  return DocumentContext;
})();

