var DocumentContext = (function(){

  // header id to associate each header with outline.
  var __global_header_id = 0;
  var __global_page_no = 0;
  
  function DocumentContext(option){
    var opt = option || {};
    this.markup = opt.markup || null;
    this.stream = opt.stream || null;
    this.charPos = opt.charPos || 0;
    this.localPageNo = opt.localPageNo || 0;
    this.localLineNo = opt.localLineNo || 0;
    this.header = opt.header || new DocumentHeader();
    this.blockContext = opt.blockContext || null;
    this.inlineContext = opt.inlineContext || null;
    this.outlineContext = opt.outlineContext || new OutlineContext();
    this.anchors = opt.anchors || {};
  }

  DocumentContext.prototype = {
    // docunemt type context
    setDocumentType : function(markup){
      this.documentType = markup;
    },
    // document position context
    isFirstLocalPage : function(){
      return this.localPageNo === 0;
    },
    isFirstLocalLine : function(){
      return this.localLineNo === 0;
    },
    stepLocalPageNo : function(){
      this.localPageNo++;
      return this.localPageNo;
    },
    getLocalPageNo : function(){
      return this.localPageNo;
    },
    // stream context
    getStream : function(){
      return this.stream;
    },
    getStreamSrc : function(){
      return this.stream.getSrc();
    },
    hasNextToken : function(){
      return this.stream.hasNext();
    },
    getNextToken : function(){
      return this.stream.get();
    },
    pushBackToken : function(){
      this.stream.prev();
    },
    getStreamPos : function(){
      return this.stream.getPos();
    },
    getSeekPos : function(){
      return this.stream.getSeekPos();
    },
    getSeekPercent : function(){
      return this.stream.getSeekPercent();
    },
    getStreamTokenCount : function(){
      return this.stream.getTokenCount();
    },
    isStreamHead : function(){
      return this.stream.isHead();
    },
    // markup context
    inheritMarkup : function(markup, parent){
      parent = parent || this.markup;
      return markup.inherit(parent, this);
    },
    getMarkup : function(){
      return this.markup;
    },
    getMarkupStaticSize : function(parent){
      var font_size = parent? parent.getFontSize() : Layout.fontSize;
      var measure = parent? parent.getContentMeasure(parent.flow) : Layout.getStdMeasure();
      return this.markup? this.markup.getStaticSize(font_size, measure) : null;
    },
    getMarkupName : function(){
      return this.markup? this.markup.getName() : "";
    },
    getMarkupClasses : function(){
      return this.markup? this.markup.classes : [];
    },
    // block context
    createBlockRoot : function(markup, stream){
      stream = (stream === null)? null : (stream || new TokenStream(markup.getContent()));
      return new DocumentContext({
	markup:(markup? this.inheritMarkup(markup, this.markup) : null),
	stream:stream,
	charPos:this.charPos,
	header:this.header,
	outlineContext:this.outlineContext,
	anchors:this.anchors
      });
    },
    createFloatedRoot : function(){
      return new DocumentContext({
	markup:this.markup,
	stream:this.stream,
	charPos:this.charPos,
	header:this.header,
	blockContext:this.blockContext,
	outlineContext:this.outlineContext,
	anchors:this.anchors
      });
    },
    createInlineBlockRoot : function(markup, stream){
      var ctx = this.createBlockRoot(markup, stream);
      ctx.mode = "inline-block";
      return ctx;
    },
    createBlockContext : function(parent){
      this.blockContext = new BlockContext(parent);
      return this.blockContext;
    },
    addBlockElement : function(element){
      this.blockContext.addElement(element);
      if(element.isTextLine()){
	this.localLineNo++;
      }
    },
    canContainExtent : function(extent){
      if(this.blockContext){
	return this.blockContext.getRestExtent() >= extent;
      }
      return true;
    },
    // inline context
    createInlineRoot : function(markup, stream){
      stream = (stream === null)? null : (stream || new TokenStream(markup.getContent()));
      return new DocumentContext({
	markup:this.inheritMarkup(markup, this.markup),
	stream:stream,
	charPos:this.charPos,
	header:this.header,
	blockContext:this.blockContext, // inherit block context
	outlineContext:this.outlineContext,
	anchors:this.anchors
      });
    },
    createChildInlineRoot : function(markup, stream){
      var context = this.createInlineRoot(markup, stream);
      context.blockContext = null; // hide block context for child-inline-generator
      return context;
    },
    createInlineStream : function(){
      return this.stream.createRefStream(function(token){
	return token !== null && Token.isInline(token);
      });
    },
    createInlineContext : function(line){
      this.inlineContext = new InlineContext(line, this.stream);
      return this.inlineContext;
    },
    createLine : function(){
      return this.inlineContext.createLine();
    },
    getRestMeasure : function(){
      return this.inlineContext? this.inlineContext.getRestMeasure() : 0;
    },
    getInlineNextToken : function(){
      return this.inlineContext.getNextToken();
    },
    getInlineMaxMeasure : function(){
      return this.inlineContext.getMaxMeasure();
    },
    getInlineMaxExtent : function(){
      return this.inlineContext.getMaxExtent();
    },
    getInlineMaxFontSize : function(){
      return this.inlineContext.getMaxFontSize();
    },
    getInlineFontSize : function(){
      return this.inlineContext? this.inlineContext.getFontSize() : Layout.fontSize;
    },
    setLineBreak : function(){
      this.inlineContext.setLineBreak();
    },
    isJustified : function(){
      return this.inlineContext.isJustified();
    },
    restartInlineContext : function(max_measure){
      this.inlineContext.restart(max_measure);
    },
    addInlineElement : function(element){
      this.inlineContext.addElement(element);
    },
    // header context
    getHeader : function(){
      return this.header;
    },
    addScript : function(markup){
      this.header.addScript(markup);
    },
    addStyle : function(markup){
      this.header.addStyle(markup);
    },
    getPageNo : function(){
      return __global_page_no;
    },
    getCharPos : function(){
      return this.charPos;
    },
    stepPageNo : function(){
      __global_page_no++;
    },
    addCharPos : function(char_count){
      this.charPos += char_count;
    },
    // anchor context
    setAnchor : function(anchor_name){
      this.anchors[anchor_name] = this.getPageNo();
    },
    getAnchors : function(){
      return this.anchors;
    },
    getAnchorPageNo : function(anchor_name){
      return this.anchors[anchor_name] || -1;
    },
    // outline context
    getOutlineBuffer : function(root_name){
      return this.outlineContext.getOutlineBuffer(root_name);
    },
    startSectionRoot : function(){
      var type = this.markup.getName();
      this.outlineContext.startSectionRoot(type);
    },
    endSectionRoot : function(){
      var type = this.markup.getName();
      return this.outlineContext.endSectionRoot(type);
    },
    logStartSection : function(){
      var type = this.markup.getName();
      this.outlineContext.logStartSection(type, this.getPageNo());
    },
    logEndSection : function(){
      var type = this.markup.getName();
      this.outlineContext.logEndSection(type);
    },
    logSectionHeader : function(){
      var type = this.markup.getName();
      var rank = this.markup.getHeaderRank();
      var title = this.markup.getContentRaw();
      var page_no = this.getPageNo();
      if(typeof this.markup.headerId === "undefined"){
	this.markup.headerId = __global_header_id++;
      }
      this.outlineContext.logSectionHeader(type, rank, title, page_no, this.markup.headerId);
      return this.markup.headerId;
    }
  };

  return DocumentContext;
})();

