var LinkGenerator = (function(){
  function LinkGenerator(style, stream, outline_context){
    InlineGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(LinkGenerator, InlineGenerator);

  LinkGenerator.prototype._onComplete = function(output){
    var anchor_name = style.getMarkupAttr("name");
    if(anchor_name){
      DocumentContext.addAnchor(anchor_name);
    }
  };

  return LinkGenerator;
})();

