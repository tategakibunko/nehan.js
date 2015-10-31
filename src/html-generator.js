Nehan.HtmlGenerator = (function(){
  /**
     @memberof Nehan
     @class HtmlGenerator
     @classdesc generator of &lt;html&gt; tag content.
     @constructor
     @param text {String}
  */
  function HtmlGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
    this.generator = this._createBodyGenerator(context);
  }
  Nehan.Class.extend(HtmlGenerator, Nehan.LayoutGenerator);

  HtmlGenerator.prototype._yield = function(){
    return this.generator.yield();
  };

  HtmlGenerator.prototype._createBodyGenerator = function(context){
    var body_tag = null;
    while(context.stream.hasNext()){
      var tag = context.stream.get();
      switch(tag.getName()){
      case "head":
	this._parseDocumentHeader(context, new Nehan.TokenStream(tag.getContent(), {
	  filter:Nehan.Closure.isTagName(["title", "meta", "link", "style", "script"])
	}));
	break;
      case "body":
	body_tag = tag;
	break;
      }
    }
    body_tag = body_tag || new Nehan.Tag("body", context.stream.getSrc());
    var body_style = context.createChildStyle(body_tag);
    return new Nehan.BodyGenerator(context.createChildContext(body_style));
  };

  HtmlGenerator.prototype._parseDocumentHeader = function(context, stream){
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
    context.documentContext.setDocumentHeader(document_header);
  };

  return HtmlGenerator;
})();

