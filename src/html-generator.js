var HtmlGenerator = (function(){
  function HtmlGenerator(context){
    this.context = context;
    this.generator = this._createGenerator();
  }

  HtmlGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
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
    _createGenerator : function(){
      while(this.context.hasNextToken()){
	var tag = this.context.getNextToken();
	switch(tag.getName()){
	case "head":
	  this._parseHead(this.context.getHeader(), tag.getContentRaw());
	  break;
	case "body":
	  return this._createBodyGenerator(tag);
	}
      }
      return this._createBodyGenerator(
	new Tag("<body>", this.context.getStreamSrc())
      );
    },
    _createBodyGenerator : function(body_tag){
      return new BodyBlockTreeGenerator(
	this.context.createBlockRoot(
	  body_tag, new TokenStream(body_tag.getContentRaw())
	)
      );
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

