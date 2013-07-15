var HtmlGenerator = (function(){
  function HtmlGenerator(markup, context){
    this.markup = markup;
    this.context = context || new DocumentContext();
    this.stream = this._createStream();
    this.generator = this._getGenerator();
    if(this.generator === null){
      throw "HtmlGenerator::invalid html";
    }
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
    _createStream : function(){
      return new HtmlTagStream(this.markup.getContentRaw());
    },
    _getGenerator : function(){
      var generator = null;
      while(true){
	var tag = this.stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "head":
	  this._parseHead(tag.getContentRaw());
	  break;
	case "body":
	  generator = new BodyBlockTreeGenerator(tag, this.context);
	  break;
	}
      }
      return generator;
    },
    _parseHead : function(content){
      var stream = new HeadTagStream(content);
      var header = this.context.getHeader();
      while(true){
	var tag = stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "title":
	  this._parseTitle(header, tag);
	  break;
	case "meta":
	  this._parseMeta(header, tag);
	  break;
	case "link":
	  this._parseLink(header, tag);
	  break;
	case "style":
	  this._parseStyle(header, tag);
	  break;
	case "script":
	  this._parseScript(header, tag);
	  break;
	}
      }
    },
    _parseTitle : function(header, tag){
      header.setTitle(tag.getContentRaw());
    },
    _parseMeta : function(header, tag){
      header.addMeta(tag);
    },
    _parseLink : function(header, tag){
      header.addLink(tag);
    },
    _parseStyle : function(header, tag){
      header.addStyle(tag);
    },
    _parseScript : function(header, tag){
      header.addScript(tag);
    }
  };

  return HtmlGenerator;
})();

