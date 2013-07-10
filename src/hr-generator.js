var HrGenerator = ElementGenerator.extend({
  _getBoxSize : function(parent){
    var measure = parent? parent.getContentMeasure() : Layout.getStdMeasure();
    return parent.flow.getBoxSize(measure, 1);
  },
  yield : function(parent){
    var size = this._getBoxSize(parent);
    var box = this._createBox(size, parent);
    return box;
  }
});
