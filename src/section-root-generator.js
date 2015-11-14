Nehan.SectionRootGenerator = (function(){
  /**
   @memberof Nehan
   @class SectionRootGenerator
   @classdesc generator of sectionning root tag (body, fieldset, figure, blockquote etc).
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function SectionRootGenerator(context){
    Nehan.BlockGenerator.call(this, context);
    context.startOutlineContext(); // create new section root
  }
  Nehan.Class.extend(SectionRootGenerator, Nehan.BlockGenerator);

  SectionRootGenerator.prototype._onComplete = function(block){
    this.context.endOutlineContext();
  };

  return SectionRootGenerator;
})();
