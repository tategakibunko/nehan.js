var LinkGenerator = (function(){
  function LinkGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
    var anchor_name = this.context.markup.getTagAttr("name");
    if(anchor_name){
      this.context.setAnchor(anchor_name);
    }
  }
  Class.extend(LinkGenerator, ChildInlineTreeGenerator);

  return LinkGenerator;
})();

