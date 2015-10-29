Nehan.DocumentGenerator = (function(){
  /**
     @memberof Nehan
     @class DocumentGenerator
     @classdesc generator of formal html content including &lt;!doctype&gt; tag.
     @constructor
     @param text {String} - html source text
  */
  function DocumentGenerator(context){
    this.generator = this._createGenerator(context);
  }

  /**
   @memberof Nehan.DocumentGenerator
   @return {Nehan.Box}
   */
  DocumentGenerator.prototype.yield = function(context){
    return this.generator.yield(context);
  };

  DocumentGenerator.prototype._createGenerator = function(context){
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
    return this._createHtmlGenerator(context, html_tag);
  };

  DocumentGenerator.prototype._createHtmlGenerator = function(context, html_tag){
    return new HtmlGenerator(context.createChildContext(html_tag));
  };

  return DocumentGenerator;
})();

