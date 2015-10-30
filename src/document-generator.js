Nehan.DocumentGenerator = (function(){
  /**
     @memberof Nehan
     @class DocumentGenerator
     @classdesc generator of formal html content including &lt;!doctype&gt; tag.
     @constructor
     @param text {String} - html source text
  */
  function DocumentGenerator(context){
    Nehan.LayoutGenerator.call(this, context.extend({
      childGenerator:this._createHtmlGenerator(context)
    }));
  }
  Nehan.Class.extend(DocumentGenerator, Nehan.LayoutGenerator);

  DocumentGenerator.prototype._yield = function(){
    return this.context.yieldChildLayout();
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
    return new Nehan.HtmlGenerator(context.createChildContext({
      markup:html_tag
    }));
  };

  return DocumentGenerator;
})();

