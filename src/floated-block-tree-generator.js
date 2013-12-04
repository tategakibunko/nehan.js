var FloatedBlockTreeGenerator = (function(){
  function FloatedBlockTreeGenerator(context, floated_box){
    BlockTreeGenerator.call(this, context);
    this.floatedBox = floated_box;
  }
  Class.extend(FloatedBlockTreeGenerator, BlockTreeGenerator);
  
  FloatedBlockTreeGenerator.prototype.yield = function(parent){
    var wrap_box = this._getFloatedWrapBox(parent, this.floatedBox);
    var rest_box = this._getFloatedRestBox(parent, wrap_box, this.floatedBox);
    this._yieldBlocksTo(rest_box);
    if(this.floatedBox.logicalFloat === "start"){
      wrap_box.addChildBlock(this.floatedBox);
      wrap_box.addChildBlock(rest_box);
    } else {
      wrap_box.addChildBlock(rest_box);
      wrap_box.addChildBlock(this.floatedBox);
    }
    return wrap_box;
  };

  FloatedBlockTreeGenerator.prototype._getFloatedRestBox = function(parent, wrap_box, floated_box){
    var rest_measure = parent.getContentMeasure() - floated_box.getBoxMeasure(parent.flow);
    var rest_extent = floated_box.getBoxExtent(parent.flow);
    var rest_size = parent.flow.getBoxSize(rest_measure, rest_extent);
    var rest_box = Layout.createBox(rest_size, wrap_box, "box");
    rest_box.setFlow(parent.flow);
    return rest_box;
  };

  FloatedBlockTreeGenerator.prototype._getFloatedWrapBox = function(parent, floated_box){
    var wrap_measure = parent.getContentMeasure();
    var wrap_extent = floated_box.getBoxExtent(parent.flow);
    var wrap_box_size = parent.flow.getBoxSize(wrap_measure, wrap_extent);
    var wrap_box = Layout.createBox(wrap_box_size, parent, "box");
    var wrap_flow = parent.getFloatedWrapFlow();
    wrap_box.setParent(parent, false);
    wrap_box.setFlow(wrap_flow);
    floated_box.setParent(wrap_box, true);
    return wrap_box;
  };

  return FloatedBlockTreeGenerator;
})();

