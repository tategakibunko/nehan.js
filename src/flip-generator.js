Nehan.FlipGenerator = (function(){
  /**
     @memberof Nehan
     @class FlipGenerator
     @classdesc generate fliped layout of [style]
     @constructor
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function FlipGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(FlipGenerator, Nehan.BlockGenerator);

  /**
     @memberof Nehan.FlipGenerator
     @method yield
     @param context {Nehan.LayoutContext}
     @return {Nehan.Box}
  */
  FlipGenerator.prototype.yield = function(){
    this.context.style.updateContextSize(
      this.context.layoutContext.getBlockRestExtent(), // measure -> extent
      this.context.layoutContext.getInlineMaxMeasure() // extent -> measure
    );
    return Nehan.BlockGenerator.prototype.yield.call(this);
  };

  return FlipGenerator;
})();

