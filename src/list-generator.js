var ListGenerator = (function(){
  /**
     @memberof Nehan
     @class ListGenerator
     @classdesc generator of &lt;ul&gt;, &lt;ol&gt; tag. need to count child item if list-style is set to numeral property like 'decimal'.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function ListGenerator(style, stream){
    BlockGenerator.call(this, style, stream);

    // by setting max item count, 'this.style.listMarkerSize' is created.
    this.style.setListItemCount(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  return ListGenerator;
})();

