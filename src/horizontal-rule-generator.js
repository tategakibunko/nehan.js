var HorizontalRuleGenerator = StaticBlockGenerator.extend({
  _getBoxSize : function(parent){
    var measure = parent? parent.getContentMeasure() : Layout.getStdMeasure();
    return parent.flow.getBoxSize(measure, 1);
  }
});
