var HorizontalRuleGenerator = StaticBlockGenerator.extend({
  yield : function(parent){
    var measure = parent.getContentMeasure();
    var size = parent.flow.getBoxSize(measure, 1);
    return this._super(parent, size);
  }
});
