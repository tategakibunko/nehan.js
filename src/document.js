Nehan.Document = (function(){
  var __create_stream = function(text){
    var stream = new Nehan.TokenStream(text, {
      filter:Nehan.Closure.isTagName(["!doctype", "html"])
    });
    if(stream.isEmptyTokens()){
      stream.tokens = [new Nehan.Tag("html", text)];
    }
    return stream;
  };

  function Document(text){
    this.context = new Nehan.RenderingContext({
      markup:null,
      style:null,
      stream:__create_stream(Nehan.Html.normalize(text))
    });
  }

  Document.prototype.render = function(opt){
    this.pageStream = new Nehan.PageStream(this.context);
    this.pageStream.asyncGet(opt);
    return this;
  };
  
  Document.prototype.getPage = function(index){
    return this.pageStream.getPage(index);
  };

  Document.prototype.getPageCount = function(index){
    return this.pageStream.getPageCount();
  };

  Document.prototype.setStyle = function(key, value){
    this.context.setStyle(key, value);
    return this;
  };

  Document.prototype.setStyles = function(values){
    this.context.setStyles(values);
    return this;
  };

  Document.prototype.getContent = function(){
    return this.context.getContent();
  };

  Document.prototype.getAnchorPageNo = function(anchor_name){
    return this.context.getAnchorPageNo(anchor_name);
  };

  Document.prototype.createOutlineElement = function(callbacks){
    return this.context.createBodyOutlineElement(callbacks);
  };

  return Document;
})();
