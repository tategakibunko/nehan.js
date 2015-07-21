var FirstLineGenerator = (function(){
  /**
   * style of first line generator is enabled until first line is yielded.<br>
   * after yielding first line, parent style is inherited.
   @memberof Nehan
   @class FirstLineGenerator
   @classdesc generator to yield first line block.
   @constructor
   @param style {Nehan.StyleContext}
   @param stream {Nehan.TokenStream}
   @extends {Nehan.BlockGenerator}
  */
  function FirstLineGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Nehan.Class.extend(FirstLineGenerator, BlockGenerator);

  FirstLineGenerator.prototype._onAddElement = function(context, element){
    if(context.getBlockLineNo() !== 1){
      return;
    }
    // first-line yieled, so switch style to parent one.
    this.style = this.style.parent;
    var child = this._child, parent = this;
    while(child){
      child.style = parent.style;
      var cache = child.peekLastCache();
      if(cache && child instanceof TextGenerator && cache.setMetrics){
	cache.setMetrics(child.style.flow, child.style.getFont());
      }
      parent = child;
      child = child._child;
    }
  };

  return FirstLineGenerator;
})();

