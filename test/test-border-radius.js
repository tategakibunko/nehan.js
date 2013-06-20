test("border-radius", function(){
  var br = new BorderRadius();
  equal(br.getCssValue(), "0px 0px 0px 0px/0px 0px 0px 0px");

  var flow = BoxFlows.getByName("lr-tb");
  br.setSize(flow, {
    "start-before":[10, 1],
    "end-before":[20, 2],
    "end-after":[30, 3],
    "start-after":[40, 4]
  });
  equal(br.getCssValue(), "10px 20px 30px 40px/1px 2px 3px 4px");

  br.clearBefore(flow);
  equal(br.getCssValue(), "0px 0px 30px 40px/0px 0px 3px 4px");

  br.setSize(flow, {
    "start-before":[10, 1],
    "end-before":[20, 2],
    "end-after":[30, 3],
    "start-after":[40, 4]
  });
  br.clearAfter(flow);
  equal(br.getCssValue(), "10px 20px 0px 0px/1px 2px 0px 0px");
});
