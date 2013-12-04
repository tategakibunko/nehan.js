var ParaChildGenerator = (function(){
  function ParaChildGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(ParaChildGenerator, ChildBlockTreeGenerator);

  ParaChildGenerator.prototype._setBoxEdge = function(){
    // do nothing
  };

  ParaChildGenerator.prototype._onReadyBox = function(box, parent){
    // wrap box(parent) has parallel flow, so flip it to get original one.
    var flow = parent.getParallelFlipFlow();
    box.setFlow(flow);
  };

  return ParaChildGenerator;
})();

