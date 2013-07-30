var HtmlGenerator = (function(){
  function HtmlGenerator(context){
    this.context = context;
    this.generator = this._getGenerator();
  }

  HtmlGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    _getGenerator : function(){
      while(this.context.hasNextToken()){
	var tag = this.context.getNextToken();
	switch(tag.getName()){
	case "head":
	  this._parseHead(this.context.getHeader(), tag.getContentRaw());
	  break;
	case "body":
	  return new BodyBlockTreeGenerator(
	    this.context.createBlockRoot(tag, new TokenStream(tag.getContentRaw()))
	  );
	}
      }
      throw "invalid html:<body> not found";
    },
    _parseHead : function(header, content){
      var stream = new HeadTagStream(content);
      while(stream.hasNext()){
	var tag = stream.get();
	switch(tag.getName()){
	case "title":
	  header.setTitle(tag.getContentRaw());
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
    }
  };

  return HtmlGenerator;
})();

