var SectionContentGenerator = (function(){
  /**
     @memberof Nehan
     @class SectionContentGenerator
     @classdesc generator of sectionning content tag (section, article, nav, aside).
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function SectionContentGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.startSectionContext();
  }
  Class.extend(SectionContentGenerator, BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(context, block){
    this.style.endSectionContext();
  };

  return SectionContentGenerator;
})();

