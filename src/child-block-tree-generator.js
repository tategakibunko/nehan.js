var ChildBlockTreeGenerator = BlockTreeGenerator.extend({
  // resize page to sum of total child size.
  _onCompleteTree : function(page){
    page.shortenExtent(page.getParentFlow());
  }
});
