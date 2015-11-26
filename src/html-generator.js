Nehan.HtmlGenerator = (function(){
  /**
   @memberof Nehan
   @class HtmlGenerator
   @classdesc generator of &lt;html&gt; tag content.
   @constructor
   @param context {Nehan.RenderingContext}
  */
  function HtmlGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
    this._initContext();
  }
  Nehan.Class.extend(HtmlGenerator, Nehan.LayoutGenerator);

  HtmlGenerator.prototype._yield = function(){
    return this.context.yieldChildLayout();
  };

  HtmlGenerator.prototype._initContext = function(){
    if(!this.context.stream){
      this.context.stream = this.context.createHtmlStream(this.context.text);
    }
    var body_tag = null;
    while(this.context.stream.hasNext()){
      var tag = this.context.stream.get();
      switch(tag.getName()){
      case "head":
	this._parseDocumentHeader(new Nehan.TokenStream(tag.getContent(), {
	  filter:Nehan.Closure.isTagName(["title", "meta", "link", "style", "script"])
	}));
	break;
      case "body":
	body_tag = tag;
	break;
      }
    }
    body_tag = body_tag || new Nehan.Tag("body", this.context.stream.getSrc());
    var body_style = this.context.createChildStyle(body_tag);
    var body_context = this.context.createChildContext(body_style);
    new Nehan.BodyGenerator(body_context);
  };

  HtmlGenerator.prototype._parseDocumentHeader = function(stream){
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
    this.context.documentContext.setDocumentHeader(document_header);
  };

  return HtmlGenerator;
})();

