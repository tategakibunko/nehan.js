var HeaderGenerator = (function(){
  function HeaderGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(HeaderGenerator, ChildBlockTreeGenerator);

  HeaderGenerator.prototype._onCompleteBlock = function(page){
    ChildBlockTreeGenerator.prototype._onCompleteBlock.call(this, page);
    var header_id = this.context.logSectionHeader();
    page.id = Css.addNehanHeaderPrefix(header_id);
  };
  
  HeaderGenerator.prototype._onCreateBox = function(box, parent){
    box.addClass("nehan-header");
  };

  return HeaderGenerator;
})();

