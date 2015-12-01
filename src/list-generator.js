Nehan.ListGenerator = (function(){
  /**
   @memberof Nehan
   @class ListGenerator
   @classdesc generator of &lt;ul&gt;, &lt;ol&gt; tag. need to count child item if list-style is set to numeral property like 'decimal'.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ListGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(ListGenerator, Nehan.BlockGenerator);

  ListGenerator.prototype._onInitialize = function(context){
    context.initListContext(); // context.listContext is available.
  };

  return ListGenerator;
})();

