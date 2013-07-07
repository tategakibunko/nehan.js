// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = BlockTreeGenerator.extend({
  hasNext : function(){
    return false;
  },
  /*
  _getBoxSize : function(parent){
    return this._getMarkupStaticSize(parent);
  },
  */
  yield : function(parent, size){
    var wrap = Layout.createBox(size, parent, "div");
    var page = this._super(wrap); // yield page to wrap.
    wrap.addChildBlock(page);
    wrap.logicalFloat = page.logicalFloat;
    return wrap;
  }
});
