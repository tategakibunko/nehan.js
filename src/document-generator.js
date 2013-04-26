var DocumentGenerator = (function(){
  function DocumentGenerator(src){
    this.context = new DocumentContext();
    this.stream = new DocumentTagStream(src);
    this.generator = this._createGenerator();
    if(this.generator === null){
      throw "DocumentGenerator::invalid document";
    }
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
    _parseDocType : function(tag){
    },
    _createGenerator : function(){
      var generator = null;
      while(true){
	var tag = this.stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "!doctype":
	  this._parseDocType(tag);
	  break;
	case "html":
	  generator = new HtmlGenerator(tag, this.context);
	  break;
	}
      }
      return generator;
    }
  };

  return DocumentGenerator;
})();

