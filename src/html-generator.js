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
      while(true){
	var tag = stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "title":
	  this._parseTitle(tag);
	  break;
	case "meta":
	  this._parseMeta(tag);
	  break;
	case "link":
	  this._parseLink(tag);
	  break;
	case "style":
	  this._parseStyle(tag);
	  break;
	case "script":
	  this._parseScript(tag);
	  break;
	}
      }
    },
    _parseTitle : function(tag){
      this.context.setTitle(tag.getContentRaw());
    },
    _parseMeta : function(tag){
      var context = this.context;
      tag.iterTagAttr(function(prop, value){
	context.setMeta(prop, value);
      });
    },
    _parseLink : function(tag){
    },
    _parseStyle : function(tag){
    },
    _parseScript : function(tag){
    }
  };

  return HtmlGenerator;
})();

