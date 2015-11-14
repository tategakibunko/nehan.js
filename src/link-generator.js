Nehan.LinkGenerator = (function(){
  /**
   @memberof Nehan
   @class LinkGenerator
   @classdesc generator of &lt;a&gt; tag, set anchor context to {@link Nehan.DocumentContext} if exists.
   @constructor
   @extends {Nehan.InlineGenerator}
   @param context {Nehan.RenderingContext}
   */
  function LinkGenerator(context){
    Nehan.InlineGenerator.call(this, context);
  }
  Nehan.Class.extend(LinkGenerator, Nehan.InlineGenerator);

  LinkGenerator.prototype._onComplete = function(element){
    this.context.addAnchor(); 
  };

  return LinkGenerator;
})();

