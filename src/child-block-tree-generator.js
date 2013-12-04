var ChildBlockTreeGenerator = (function(){
  function ChildBlockTreeGenerator(context){
    BlockTreeGenerator.call(this, context);
  }
  Class.extend(ChildBlockTreeGenerator, BlockTreeGenerator);
  
  // resize page to sum of total child size.
  ChildBlockTreeGenerator.prototype._onCompleteBlock = function(page){
    page.shortenExtent(page.getParentFlow());
  };

  return ChildBlockTreeGenerator;
})();
