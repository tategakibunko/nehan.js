var HrGenerator = (function(){
  function HrGenerator(context){
    ElementGenerator.call(this, context);
  }
  Class.extend(HrGenerator, ElementGenerator);
  
  HrGenerator.prototype._getBoxSize = function(parent){
    var measure = parent? parent.getContentMeasure() : Layout.getStdMeasure();
    return parent.flow.getBoxSize(measure, 1);
  };
  
  HrGenerator.prototype.yield = function(parent){
    var size = this._getBoxSize(parent);
    var box = this._createBox(size, parent);
    return box;
  };

  return HrGenerator;
})();

