Nehan.Document = (function(){
  function Document(text){
    this.text = text;
    this.context = new Nehan.RenderingContext();
  }

  Document.prototype.render = function(opt){
    this.pageStream = new Nehan.PageStream(this.text, this.context);
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
