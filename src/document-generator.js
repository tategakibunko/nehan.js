var DocumentGenerator = (function(){
  /**
     @memberof Nehan
     @class DocumentGenerator
     @classdesc generator of formal html content including &lt;!doctype&gt; tag.
     @constructor
     @param text {String} - html source text
  */
  function DocumentGenerator(text){
    this.stream = new Nehan.TokenStream(text, {
      filter:Nehan.Closure.isTagName(["!doctype", "html"])
    });
    if(this.stream.isEmptyTokens()){
      this.stream.tokens = [new Nehan.Tag("html", text)];
    }
    this.generator = this._createGenerator();
  }

  DocumentGenerator.prototype = {
    /**
       @memberof Nehan.DocumentGenerator
       @return {Nehan.Box}
    */
    yield : function(){
      return this.generator.yield();
    },
    /**
       @memberof Nehan.DocumentGenerator
       @return {boolean}
    */
    hasNext : function(){
      return this.generator.hasNext();
    },
    /**
       @memberof Nehan.DocumentGenerator
       @param status {boolean}
    */
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    /**
       @memberof Nehan.DocumentGenerator
       @param text {String}
    */
    addText : function(text){
      this.generator.addText(text);
    },
    _createGenerator : function(){
      while(this.stream.hasNext()){
	var tag = this.stream.get();
	switch(tag.getName()){
	case "!doctype":
	  DocumentContext.setDocumentType("html"); // TODO
	  break;
	case "html":
	  return this._createHtmlGenerator(tag);
	}
      }
      var html_tag = new Nehan.Tag("<html>", this.stream.getSrc());
      return this._createHtmlGenerator(html_tag);
    },
    _createHtmlGenerator : function(html_tag){
      return new HtmlGenerator(html_tag.getContent());
    }
  };

  return DocumentGenerator;
})();

