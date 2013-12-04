var RtGenerator = (function(){
  function RtGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
  }
  Class.extend(RtGenerator, ChildInlineTreeGenerator);

  RtGenerator.prototype._getLineSize = function(parent){
    var measure = parent.getContentMeasure();
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  };

  return RtGenerator;
})();

