var DocumentGenerator = (function(){
  function DocumentGenerator(context){
    this.context = context;
    this.generator = this._createGenerator();
  }

  DocumentGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    getTitle : function(){
      return this.context.getTitle();
    },
    getMeta : function(name){
      return this.context.getMeta(name);
    },
    hasOutline : function(root_name){
      return this.generator.hasOutline(root_name);
    },
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineTree : function(root_name){
      return this.generator.getOutlineTree(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    getAnchors : function(){
      return this.generator.getAnchors();
    },
    getAnchorPageNo : function(anchor_name){
      return this.generator.getAnchorPageNo(anchor_name);
    },
    _createGenerator : function(){
      while(this.context.hasNextToken()){
	var tag = this.context.getNextToken();
	switch(tag.getName()){
	case "!doctype":
	  this.context.setDocumentType(tag);
	  break;
	case "html":
	  return this._createHtmlGenerator(tag);
	}
      }
      return this._createHtmlGenerator(
	new Tag("<html>", this.context.getStreamSrc())
      );
    },
    _createHtmlGenerator : function(html_tag){
      return new HtmlGenerator(
	this.context.createBlockRoot(
	  html_tag, new HtmlTokenStream(html_tag.getContentRaw())
	)
      );
    }
  };

  return DocumentGenerator;
})();

