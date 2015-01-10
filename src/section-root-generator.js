var SectionRootGenerator = (function(){
  /**
     @memberof Nehan
     @class SectionRootGenerator
     @classdesc generator of sectionning root tag (body, fieldset, figure, blockquote etc).
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.startOutlineContext(); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onComplete = function(context, block){
    this.style.endOutlineContext();
  };

  return SectionRootGenerator;
})();
