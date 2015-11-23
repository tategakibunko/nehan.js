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
      //console.log("first-line:", element);
      var parent = this.context.parent;
      var old_child = this.context.child;
      var new_inline = parent.createChildInlineGenerator(parent.style, this.context.stream);
      new_inline.context.child = old_child;
      var child = new_inline.context.child, child_parent = new_inline.context;
      while(child){
	child.style = child_parent.style;
	child.parent = child_parent;
	var cache = child.peekLastCache();
	if(cache && child.generator instanceof Nehan.TextGenerator && cache.setMetrics){
	  cache.setMetrics(child.style.flow, child.style.getFont());
	}
	child_parent = child;
	child = child.child;
      }
    }
  };

  return FirstLineGenerator;
})();

