var HtmlGenerator = (function(){
  /**
     @memberof Nehan
     @class HtmlGenerator
     @classdesc generator of &lt;html&gt; tag content.
     @constructor
     @param text {String}
  */
  function HtmlGenerator(text){
    this.stream = new TokenStream(text, {
      filter:Nehan.Closure.isTagName(["head", "body"])
    });
    if(this.stream.isEmptyTokens()){
      this.stream.tags = [new Nehan.Tag("body", text)];
    }
    this.generator = this._createGenerator();
  }

  HtmlGenerator.prototype = {
    /**
       @memberof Nehan.HtmlGenerator
       @return {Nehan.Box}
    */
    yield : function(){
      return this.generator.yield();
    },
    /**
       @memberof Nehan.HtmlGenerator
       @return {boolean}
    */
    hasNext : function(){
      return this.generator.hasNext();
    },
    /**
       @memberof Nehan.HtmlGenerator
       @param status {boolean}
    */
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    /**
       @memberof Nehan.HtmlGenerator
       @param text {String}
    */
    addText : function(text){
      this.generator.addText(text);
    },
    _createGenerator : function(){
      while(this.stream.hasNext()){
	var tag = this.stream.get();
	switch(tag.getName()){
	case "head":
	  this._parseDocumentHeader(new TokenStream(tag.getContent(), {
	    filter:Nehan.Closure.isTagName(["title", "meta", "link", "style", "script"])
	  }));
	  break;
	case "body":
	  return this._createBodyGenerator(tag.getContent());
	}
      }
      return this._createBodyGenerator(this.stream.getSrc());
    },
    _createBodyGenerator : function(text){
      return new BodyGenerator(text);
    },
    _parseDocumentHeader : function(stream){
      var document_header = new Nehan.DocumentHeader();
      while(stream.hasNext()){
	var tag = stream.get();
	switch(tag.getName()){
	case "title":
	  document_header.setTitle(tag.getContent());
	  break;
	case "meta":
	  document_header.addMeta(tag);
	  break;
	case "link":
	  document_header.addLink(tag);
	  break;
	case "style":
	  document_header.addStyle(tag);
	  break;
	case "script":
	  document_header.addScript(tag);
	  break;
	}
      }
      DocumentContext.setDocumentHeader(document_header);
    }
  };

  return HtmlGenerator;
})();

