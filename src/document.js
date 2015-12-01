Nehan.Document = (function(){
  function Document(opt){
    opt = opt || {};
    this.text = opt.text || "no text";
    this.styles = opt.styles || {};
    this.generator = null; // created when render
  }

  Document.prototype.render = function(opt){
    opt = opt || {};
    this.text = opt.text || this.text;
    this.generator = new Nehan.RenderingContext({
      text:Nehan.Html.normalize(this.text)
    }).setStyles(this.styles).createRootGenerator();
    new Nehan.PageParser(this.generator).parse(opt || {});
    return this;
  };
  
  Document.prototype.getPage = function(index){
    return this.generator.context? this.generator.context.getPage(index) : null;
  };

  Document.prototype.getPageCount = function(index){
    return this.generator.context? this.generator.context.getPageCount() : 0;
  };

  Document.prototype.setContent = function(text){
    this.text = text;
    return this;
  };

  Document.prototype.getContent = function(text){
    return this.text;
  };

  Document.prototype.setStyle = function(key, value){
    this.styles[key] = value;
    return this;
  };

  Document.prototype.setStyles = function(values){
    for(var key in values){
      this.setStyle(key, values[key]);
    }
    return this;
  };

  Document.prototype.getAnchorPageNo = function(anchor_name){
    return this.generator.context? this.generator.context.getAnchorPageNo(anchor_name) : -1;
  };

  Document.prototype.createOutlineElement = function(callbacks){
    return this.generator.context? this.generator.context.createOutlineElementByName("body", callbacks) : null;
  };

  return Document;
})();
