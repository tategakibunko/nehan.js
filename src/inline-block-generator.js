var InlineBlockGenerator = (function(){
  function InlineBlockGenerator(context){
    BlockTreeGenerator.call(this, context);
  }
  Class.extend(InlineBlockGenerator, BlockTreeGenerator);
  
  InlineBlockGenerator.prototype._getBoxType = function(){
    return "inline-block";
  };

  return InlineBlockGenerator;
})();

