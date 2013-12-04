var ChildInlineTreeGenerator = (function(){
  function ChildInlineTreeGenerator(context){
    InlineTreeGenerator.call(this, context);
  }
  Class.extend(ChildInlineTreeGenerator, InlineTreeGenerator);

  ChildInlineTreeGenerator.prototype._createLine = function(parent){
    var line = InlineTreeGenerator.prototype._createLine.call(this, parent);
    this._setBoxStyle(line, parent);
    return line;
  };

  ChildInlineTreeGenerator.prototype._getLineSize = function(parent){
    var measure = parent.getContentMeasure();
    if(this.context.isFirstLocalLine()){
      measure -= parent.childMeasure;
    }
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  };

  ChildInlineTreeGenerator.prototype._onCompleteLine = function(line){
    line.shortenMeasure();
  };

  return ChildInlineTreeGenerator;
})();

