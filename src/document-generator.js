Nehan.DocumentGenerator = (function(){
  /**
     @memberof Nehan
     @class DocumentGenerator
     @classdesc generator of formal html content including &lt;!doctype&gt; tag.
     @constructor
     @param text {String} - html source text
  */
  function DocumentGenerator(text, context){
    Nehan.LayoutGenerator.call(this, context.extend({
      stream:this._createDocumentStream(Nehan.Html.normalize(text))
    }));
    this.generator = this._createHtmlGenerator(this.context);
  }
  Nehan.Class.extend(DocumentGenerator, Nehan.LayoutGenerator);

  DocumentGenerator.prototype._yield = function(){
    var page = this.generator.yield();
    this.context.addPage(page);
    return page;
  };

  DocumentGenerator.prototype._createDocumentStream = function(text){
    var stream = new Nehan.TokenStream(text, {
      filter:Nehan.Closure.isTagName(["!doctype", "html"])
    });
    if(stream.isEmptyTokens()){
      stream.tokens = [new Nehan.Tag("html", text)];
    }
    return stream;
  };

  DocumentGenerator.prototype._createHtmlGenerator = function(context){
    var html_tag = null;
    while(context.stream.hasNext()){
      var tag = context.stream.get();
      switch(tag.getName()){
      case "!doctype":
	// var doc_type = tag.getSrc().split(/\s+/)[1];
	context.documentContext.setDocumentType("html"); // TODO
	break;
      case "html":
	html_tag = tag;
	break;
      }
    }
    html_tag = html_tag || new Nehan.Tag("html", context.stream.getSrc());
    var html_style = context.createChildStyle(html_tag);
    return new Nehan.HtmlGenerator(context.createChildContext(html_style));
  };

  return DocumentGenerator;
})();

