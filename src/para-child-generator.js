var ParaChildGenerator = ChildBlockTreeGenerator.extend({
  _setBoxEdge : function(){
    // do nothing
  },
  _onReadyBox : function(box, parent){
    // wrap box(parent) has parallel flow, so flip it to get original one.
    var flow = parent.getParallelFlipFlow();
    box.setFlow(flow);
  }
});
