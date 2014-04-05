var BodyGenerator = (function(){
  function BodyGenerator(style, stream){
    SectionRootGenerator.call(this, style, stream);
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onAddElement = function(element){
  };

  return BodyGenerator;
})();
