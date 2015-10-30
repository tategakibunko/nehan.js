Nehan.Document = (function(){
  function Document(text){
    var normalized_text = this._normalizeSource(text);
    this.context = new Nehan.RenderingContext({
      markup:null,
      style:null,
      stream:this._createStream(normalized_text)
    });
    this.pageStream = new Nehan.PageStream(this.context);
  }

  Document.prototype.render = function(opt){
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

  Document.prototype._createStream = function(text){
    var stream = new Nehan.TokenStream(text, {
      filter:Nehan.Closure.isTagName(["!doctype", "html"])
    });
    if(stream.isEmptyTokens()){
      stream.tokens = [new Nehan.Tag("<html>", text)];
    }
    return stream;
  };

  Document.prototype._normalizeSource = function(text){
    return text
      .replace(/<!--[\s\S]*?-->/g, "") // discard comment
      .replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
      .replace(/<rb>/gi, "") // discard rb
      .replace(/<\/rb>/gi, "") // discard /rb
      .replace(/<rt><\/rt>/gi, ""); // discard empty rt
  };

  return Document;
})();
