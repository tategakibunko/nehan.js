var FirstLineGenerator = (function(){
  function FirstLineGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
  }
  Class.extend(FirstLineGenerator, ChildInlineTreeGenerator);

  FirstLineGenerator.prototype._createLine = function(parent){
    // first-line already created, so clear static attr for first-line tag.
    if(!this.context.isStreamHead()){
      this.context.markup.cssAttrStatic = {};
    }
    return ChildInlineTreeGenerator.prototype._createLine.call(this, parent);
  }

  return FirstLineGenerator;
})();

