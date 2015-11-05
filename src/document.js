Nehan.Document = (function(){
  function Document(text){
    this.text = text || "no text";
    this.context = new Nehan.RenderingContext();
  }

  Document.prototype.render = function(opt){
    new Nehan.PageParser(this.text, this.context).parse(opt);
    return this;
  };
  
  Document.prototype.getPage = function(index){
    return this.context.getPage(index);
  };

  Document.prototype.getPageCount = function(index){
    return this.context.yieldCount;
  };

  Document.prototype.setContent = function(text){
    this.text = text;
    return this;
  };

  Document.prototype.getContent = function(text){
    return this.text;
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
    return this.context.createOutlineElementByName("body", callbacks);
  };

  return Document;
})();
