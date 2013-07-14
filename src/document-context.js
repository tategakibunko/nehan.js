var DocumentContext = (function(){

  // header id to associate each header with outline.
  var __global_header_id = 0;
  
  function DocumentContext(option){
    var opt = option || {};
    this.charPos = opt.charPos || 0;
    this.pageNo = opt.pageNo || 0;
    this.meta = opt.meta || new DocumentMeta();
    this.blockContext = opt.blockContext || new BlockContext();
    this.inlineContext = opt.inlineContext || new InlineContext();
    this.styleContext = opt.styleContext || new StyleContext();
    this.outlineContext = opt.outlineContext || new OutlineContext();
    this.anchors = opt.anchors || {};
  }

  DocumentContext.prototype = {
    setTitle : function(title){
      this.setMeta("title", title);
    },
    getTitle : function(){
      return this.getMeta("title");
    },
    setMeta : function(name, value){
      this.meta.add(name, value);
    },
    getMeta : function(name){
      return this.meta.get(name);
    },
    getPageNo : function(){
      return this.pageNo;
    },
    getCharPos : function(){
      return this.charPos;
    },
    stepPageNo : function(){
      this.pageNo++;
    },
    addCharPos : function(char_count){
      this.charPos += char_count;
    },
    createInlineRoot : function(){
      return new DocumentContext({
	charPos:this.charPos,
	pageNo:this.pageNo,
	meta:this.meta,
	anchors:this.anchors,
	outlineContext:this.outlineContext,
	blockContext:this.blockContext,
	styleContext:this.styleContext
      });
    },
    inheritTag : function(tag){
      var parent_tag = this.getCurBlockTag();
      if(!tag.hasLayout()){
	return;
      }
      if(parent_tag){
	tag.inherit(parent_tag);
      }
      var onload = tag.getCssAttr("onload");
      if(onload){
	onload(this, tag);
      }
    },
    isEmptyMarkupContext : function(){
      return this.inlineContext.isEmpty();
    },
    // style
    addStyle : function(markup){
      var scope = markup.getDataset("scope", "global");
      if(scope === "local"){
	this.styleContext.addLocalStyle(markup, this.pageNo);
      } else {
	this.styleContext.addGlobalStyle(markup);
      }
    },
    getPageStyles : function(page_no){
      var global_styles = this.getGlobalStyles();
      var local_styles = this.getLocalStyles(page_no);
      return global_styles.concat(local_styles);
    },
    getLocalStyles : function(page_no){
      var _page_no = (typeof page_no != "undefined")? page_no : this.pageNo;
      return this.styleContext.getLocalStyles(_page_no);
    },
    getGlobalStyles : function(){
      return this.styleContext.getGlobalStyles();
    },
    // anchors
    setAnchor : function(anchor_name){
      this.anchors[anchor_name] = this.pageNo;
    },
    getAnchors : function(){
      return this.anchors;
    },
    getAnchorPageNo : function(anchor_name){
      return this.anchors[anchor_name] || -1;
    },
    // inline context
    getCurInlineTag : function(){
      return this.inlineContext.getHeadTag();
    },
    getInlineTagStack : function(){
      return this.inlineContext.getTagStack();
    },
    getInlineTagDepth : function(){
      return this.inlineContext.getTagDepth();
    },
    pushInlineTag : function(tag){
      this.inlineContext.pushTag(tag);
    },
    popInlineTag : function(){
      return this.inlineContext.popTag();
    },
    findInlineTag : function(fn){
      return this.inlineContext.findTag(fn);
    },
    isInlineTagEnable : function(fn){
      return this.inlineContext.isTagEnable(fn);
    },
    // block context
    isHeaderEnable : function(){
      return this.blockContext.isHeaderEnable();
    },
    pushBlockTag : function(tag){
      this.blockContext.pushTag(tag);
    },
    popBlockTag : function(){
      return this.blockContext.popTag();
    },
    getBlockTagStack : function(){
      return this.blockContext.getTagStack();
    },
    getCurBlockTag : function(){
      return this.blockContext.getHeadTag();
    },
    getBlockDepth : function(){
      return this.blockContext.getTagDepth();
    },
    getBlockDepthByName : function(name){
      return this.blockContext.getTagDepthByName(name);
    },
    getOutlineTitle : function(){
      return this.blockContext.getOutlineTitle();
    },
    findBlockTag : function(fn){
      return this.blockContext.findTag(fn);
    },
    isBlockTagEnable : function(fn){
      return this.blockContext.isTagEnable(fn);
    },
    // outline context
    getOutlineBuffer : function(root_name){
      return this.outlineContext.getOutlineBuffer(root_name);
    },
    startSectionRoot : function(tag){
      var type = tag.getName();
      this.outlineContext.startSectionRoot(type);
    },
    endSectionRoot : function(tag){
      var type = tag.getName();
      return this.outlineContext.endSectionRoot(type);
    },
    logStartSection : function(tag){
      var type = tag.getName();
      this.outlineContext.logStartSection(type, this.pageNo);
    },
    logEndSection : function(tag){
      var type = tag.getName();
      this.outlineContext.logEndSection(type);
    },
    logSectionHeader : function(tag){
      var type = tag.getName();
      var rank = tag.getHeaderRank();
      var title = tag.getContentRaw();
      var page_no = this.pageNo;
      var header_id = __global_header_id++;
      this.outlineContext.logSectionHeader(type, rank, title, page_no, header_id);
      return header_id;
    }
  };

  return DocumentContext;
})();

