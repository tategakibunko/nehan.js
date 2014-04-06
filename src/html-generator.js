var HtmlGenerator = (function(){
  function HtmlGenerator(text){
    this.stream = new HtmlTokenStream(text);
    this.generator = this._createGenerator();
  }

  HtmlGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    _createGenerator : function(){
      while(this.stream.hasNext()){
	var tag = this.stream.get();
	switch(tag.getName()){
	case "head":
	  this._parseHead(new HeadTokenStream(tag.getContent()));
	  break;
	case "body":
	  return this._createBodyGenerator(tag);
	}
      }
      var body_tag = new Tag("<body>", this.context.getStreamSrc());
      return this._createBodyGenerator(body_tag);
    },
    _createBodyGenerator : function(tag){
      return new BodyGenerator(
	new StyleContext(tag, null),
	new TokenStream(tag.getContent())
      );
    },
    _parseHead : function(){
      var stream = new HeadTokenStream(content);
      var header = new DocumentHeader();
      while(stream.hasNext()){
	var tag = stream.get();
	switch(tag.getName()){
	case "title":
	  header.setTitle(tag.getContent());
	  break;
	case "meta":
	  header.addMeta(tag);
	  break;
	case "link":
	  header.addLink(tag);
	  break;
	case "style":
	  header.addStyle(tag);
	  break;
	case "script":
	  header.addScript(tag);
	  break;
	}
      }
      DocumentContext.setDocumentHeader(header);
    }
  };

  return HtmlGenerator;
})();

