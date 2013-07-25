var DocumentGenerator = (function(){
  function DocumentGenerator(context){
    this.context = context;
    this.generator = this._createGenerator(this.context.stream);
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
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    _createGenerator : function(){
      while(this.context.hasNextToken()){
	var tag = this.context.getNextToken();
	switch(tag.getName()){
	case "!doctype":
	  this.context.setDocumentType(tag);
	  break;
	case "html":
	  return new HtmlGenerator(
	    this.context.createBlockRoot(
	      tag, new HtmlTagStream(tag.getContentRaw())
	    )
	  );
	}
      }
      throw "invalid document:<html> not found";
    }
  };

  return DocumentGenerator;
})();

