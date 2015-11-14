Nehan.SectionContentGenerator = (function(){
  /**
   @memberof Nehan
   @class SectionContentGenerator
   @classdesc generator of sectionning content tag (section, article, nav, aside).
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function SectionContentGenerator(context){
    Nehan.BlockGenerator.call(this, context);
    this.context.startSectionContext();
  }
  Nehan.Class.extend(SectionContentGenerator, Nehan.BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(block){
    this.context.endSectionContext();
  };

  return SectionContentGenerator;
})();

