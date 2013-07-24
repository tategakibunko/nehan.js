// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = TreeGenerator.extend({
  hasNext : function(){
    return false;
  },
  yield : function(parent){
    var size = this._getBoxSize(parent);
    var wrap = Layout.createBox(size, parent, "div");
    var page = this._super(wrap); // yield page to wrap.
    if(typeof page === "number"){
      return page; // exception
    }
    wrap.addChildBlock(page);
    wrap.logicalFloat = page.logicalFloat;
    return wrap;
  }
});
