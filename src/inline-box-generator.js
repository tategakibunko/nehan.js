var InlineBoxGenerator = (function(){
  function InlineBoxGenerator(context){
    StaticBlockGenerator.call(this, context);
  }
  Class.extend(InlineBoxGenerator, StaticBlockGenerator);
  
  InlineBoxGenerator.prototype._getBoxType = function(){
    return "ibox";
  };

  InlineBoxGenerator.prototype._onCreateBox = function(box, parent){
    box.content = this.context.markup.getContentRaw();
    box.css.overflow = "hidden";
  };

  return InlineBoxGenerator;
})();

