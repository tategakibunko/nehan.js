Nehan.DocumentGenerator = (function(){
  /**
   @memberof Nehan
   @class DocumentGenerator
   @classdesc generator of formal html content including &lt;!doctype&gt; tag.
   @constructor
   @param text {String} - html source text
   @param context {Nehan.RenderingContext}
  */
  function DocumentGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
    this._initContext();
  }
  Nehan.Class.extend(DocumentGenerator, Nehan.LayoutGenerator);

  DocumentGenerator.prototype._yield = function(){
    return this.context.yieldChildLayout();
  };

  DocumentGenerator.prototype._initContext = function(){
    this.context.stream = this.context.createDocumentStream(this.context.text);

    var html_tag = null;
    while(this.context.stream.hasNext()){
      var tag = this.context.stream.get();
      switch(tag.getName()){
      case "!doctype":
	// var doc_type = tag.getSrc().split(/\s+/)[1];
	this.context.documentThis.Context.setDocumentType("html"); // TODO
	break;
      case "html":
	html_tag = tag;
	break;
      }
    }
    html_tag = html_tag || new Nehan.Tag("html", this.context.stream.getSrc());
    var html_style = this.context.createChildStyle(html_tag);
    var html_context = this.context.createChildContext(html_style, {
      stream:this.context.createHtmlStream(html_tag.getContent())
    });
    new Nehan.HtmlGenerator(html_context);
  };

  return DocumentGenerator;
})();

