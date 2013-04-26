// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = PageGenerator.extend({
  hasNext : function(){
    return false;
  },
  yield : function(parent, size){
    var wrap = Layout.createBox(size, parent, "ipage");
    var page = this._super(wrap); // yield page to wrap.
    wrap.addChild(page);
    wrap.blockAlign = page.blockAlign;
    return wrap;
  }
});
