Nehan.SectionContentGenerator = (function(){
  /**
     @memberof Nehan
     @class SectionContentGenerator
     @classdesc generator of sectionning content tag (section, article, nav, aside).
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function SectionContentGenerator(style, stream){
    Nehan.BlockGenerator.call(this, style, stream);
    this.style.startSectionContext();
  }
  Nehan.Class.extend(SectionContentGenerator, Nehan.BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(context, block){
    this.style.endSectionContext();
  };

  return SectionContentGenerator;
})();

