Nehan.LinkGenerator = (function(){
  /**
     @memberof Nehan
     @class LinkGenerator
     @classdesc generator of &lt;a&gt; tag, set anchor context to {@link Nehan.DocumentContext} if exists.
     @constructor
     @extends {Nehan.InlineGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function LinkGenerator(context){
    Nehan.InlineGenerator.call(this, context);
    //context.addAnchor();
  }
  Nehan.Class.extend(LinkGenerator, Nehan.InlineGenerator);

  LinkGenerator.prototype._onComplete = function(element){
    this.context.addAnchor(); 
  };

  return LinkGenerator;
})();

