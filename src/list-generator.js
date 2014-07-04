var ListGenerator = (function(){
  function ListGenerator(style, stream){
    BlockGenerator.call(this, style, stream);

    // by setting max item count, 'this.style.listMarkerSize' is created.
    this.style.setListItemCount(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  return ListGenerator;
})();

