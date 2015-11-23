Nehan.FirstLineGenerator = (function(){
  /**
   @memberof Nehan
   @class FirstLineGenerator
   @constructor
   @extends {Nehan.InlineGenerator}
   @param context {Nehan.RenderingContext}
  */
  function FirstLineGenerator(context){
    Nehan.InlineGenerator.call(this, context);
  }
  Nehan.Class.extend(FirstLineGenerator, Nehan.InlineGenerator);

  FirstLineGenerator.prototype._onCreate = function(element){
    // now first-line is yieled, switch new style
    if(this.context.isFirstOutput()){
      var parent = this.context.parent;
      var old_child = this.context.child;
      var new_inline_root = parent.createChildInlineGenerator(parent.style, this.context.stream).context;
      new_inline_root.child = old_child;
      old_child.updateInlineParent(new_inline_root);
    }
  };

  return FirstLineGenerator;
})();

