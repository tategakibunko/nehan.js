Nehan.Document = (function(){
  function Document(text){
    var normalized_text = this._normalizeSource(text);
    this.context = new Nehan.RenderingContext({
      stream:this._createStream(normalized_text)
    });
  }

  Document.prototype.render = function(opt){
    this.pages = new Nehan.PageStream(this.context);
    this.pages.asyncGet(opt);
  };
  
  Document.protoype._createStream = function(text){
    var stream = new Nehan.TokenStream(text, {
      filter:Nehan.Closure.isTagName(["!doctype", "html"])
    });
    if(stream.isEmptyTokens()){
      stream.tokens = [new Nehan.Tag("<html>", text)];
    }
    return stream;
  };

  Document.protoype._normalizeSource = function(text){
    return text
      .replace(/<!--[\s\S]*?-->/g, "") // discard comment
      .replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
      .replace(/<rb>/gi, "") // discard rb
      .replace(/<\/rb>/gi, "") // discard /rb
      .replace(/<rt><\/rt>/gi, ""); // discard empty rt
  };

  Document.prototype.setStyle = function(key, value){
    this.context.selectors.setValue(key, value);
  };

  Document.prototype.setStyles = function(values){
    for(var key in values){
      this.context.selectors.setValue(key, values[key]);
    }
  };

  Document.prototype.getAnchorPageNo = function(anchor_name){
    return this.context.getAnchorPageNo(anchor_name);
  };

  Document.prototype.createOutlineElement = function(callbacks){
    return this.context.createBodyOutlineElement(callbacks);
  };

  return Document;
})();
