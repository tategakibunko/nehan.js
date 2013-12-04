var ImageGenerator = (function(){
  function ImageGenerator(context){
    StaticBlockGenerator.call(this, context);
  }
  Class.extend(ImageGenerator, StaticBlockGenerator);

  ImageGenerator.prototype._onCreateBox = function(box, parent){
    box.src = this.context.markup.getTagAttr("src");
  };

  return ImageGenerator;
})();

