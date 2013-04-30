// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = PageGenerator.extend({
  hasNext : function(){
    return false;
  },
  yield : function(parent, size){
    this._onReadyMarkupEvent(parent);
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    this._onReadyBox(box);
    this._onReadyBoxEvent(box);
    this._setBoxStyle(box, parent);
    this._onCompleteBox(box, parent);
    return this._yieldPageTo(box);
  }
});
