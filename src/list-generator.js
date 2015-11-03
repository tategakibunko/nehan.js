Nehan.ListGenerator = (function(){
  /**
     @memberof Nehan
     @class ListGenerator
     @classdesc generator of &lt;ul&gt;, &lt;ol&gt; tag. need to count child item if list-style is set to numeral property like 'decimal'.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function ListGenerator(context){
    Nehan.BlockGenerator.call(this, context);
    context.initListContext();
  }
  Nehan.Class.extend(ListGenerator, Nehan.BlockGenerator);

  return ListGenerator;
})();

