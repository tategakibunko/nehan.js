Nehan.ParagraphGenerator = (function(){
  /**
   @memberof Nehan
   @class ParagraphGenerator
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ParagraphGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(ParagraphGenerator, Nehan.BlockGenerator);

  ParagraphGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);
    context.initParagraphContext();
  };

  return ParagraphGenerator;
})();
