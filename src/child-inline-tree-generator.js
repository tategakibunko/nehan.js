var ChildInlineTreeGenerator = InlineTreeGenerator.extend({
  _createLine : function(parent){
    var line = this._super(parent);
    this._setBoxStyle(line, parent);
    return line;
  },
  _getLineSize : function(parent){
    var measure = parent.getTextRestMeasure();
    var extent = parent.getContentExtent();
    console.log("rest measure = %d", measure);
    return parent.flow.getBoxSize(measure, extent);
  },
  _onCompleteLine : function(line){
    line.shortenMeasure();
  }
});

