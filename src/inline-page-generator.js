// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = (function(){
  function InlinePageGenerator(context){
    BlockTreeGenerator.call(this, context);
  }
  Class.extend(InlinePageGenerator, BlockTreeGenerator);

  InlinePageGenerator.prototype.hasNext = function(){
    return false;
  };

  InlinePageGenerator.prototype.yield = function(parent){
    var size = this._getBoxSize(parent);
    var wrap = Layout.createBox(size, parent, "div");
    var page = BlockTreeGenerator.prototype.yield.call(this, wrap);
    if(typeof page === "number"){
      return page; // exception
    }
    wrap.addChildBlock(page);
    wrap.logicalFloat = page.logicalFloat;
    return wrap;
  };

  return InlinePageGenerator;
})();

