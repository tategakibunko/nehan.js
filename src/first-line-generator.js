Nehan.FirstLineGenerator = (function(){
  /**
   * style of first line generator is enabled until first line is yielded.<br>
   * after yielding first line, parent style is inherited.
   @memberof Nehan
   @class FirstLineGenerator
   @classdesc generator to yield first line block.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function FirstLineGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(FirstLineGenerator, Nehan.BlockGenerator);

  // this is called after each element(line-block) is yielded.
  /*
  FirstLineGenerator.prototype._onAddElement = function(element){
    if(this.context.getBlockLineNo() !== 1){
      return;
    }
    // first-line yieled, so switch style to parent one.
    this.context.style = this.context.parent.style;
    var child_gen = this.context.childGenerator, parent_gen = this;
    while(child_gen){
      child_gen.context.style = parent_gen.context.style;
      var cache = child_gen.context.peekLastCache();
      if(cache && child_gen instanceof Nehan.TextGenerator && cache.setMetrics){
	cache.setMetrics(child_gen.context.style.flow, child_gen.context.style.getFont());
      }
      parent_gen = child_gen;
      child_gen = child_gen.context.childGenerator;
    }
  };*/

  return FirstLineGenerator;
})();

