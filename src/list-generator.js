var ListGenerator = (function(){
  function ListGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.setListItemCount(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  return ListGenerator;
})();

