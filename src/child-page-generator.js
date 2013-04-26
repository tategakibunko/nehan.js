var ChildPageGenerator = PageGenerator.extend({
  // resize page to sum of total child size.
  _onCompletePage : function(page){
    page.shortenExtent(page.getParentFlow());
  }
});
