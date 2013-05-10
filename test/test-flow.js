test("flow-inline", function(){
  var inflow = new InlineFlow("lr");
  ok(inflow.isHorizontal());
  equal(inflow.getPropStart(), "left");
  equal(inflow.getPropEnd(), "right");
  equal(inflow.reverse(), "rl");

  var inflow = new InlineFlow("rl");
  ok(inflow.isHorizontal());
  equal(inflow.getPropStart(), "right");
  equal(inflow.getPropEnd(), "left");
  equal(inflow.reverse(), "lr");

  var inflow = new InlineFlow("tb");
  ok(inflow.isVertical());
  equal(inflow.getPropStart(), "top");
  equal(inflow.getPropEnd(), "bottom");
  equal(inflow.reverse(), "tb");
});

test("flow-block", function(){
  var blockflow = new BlockFlow("lr");
  ok(blockflow.isHorizontal());
  equal(blockflow.getPropBefore(), "left");
  equal(blockflow.getPropAfter(), "right");
  equal(blockflow.reverse(), "rl");

  var blockflow = new BlockFlow("rl");
  ok(blockflow.isHorizontal());
  equal(blockflow.getPropBefore(), "right");
  equal(blockflow.getPropAfter(), "left");
  equal(blockflow.reverse(), "lr");

  var blockflow = new BlockFlow("tb");
  ok(blockflow.isVertical());
  equal(blockflow.getPropBefore(), "top");
  equal(blockflow.getPropAfter(), "bottom");
  equal(blockflow.reverse(), "tb");
});

test("flow-floated-wrap", function(){
  // horizontal
  var flow = new BoxFlow("lr", "tb");
  var aligned_wrap_flow = flow.getFloatedWrapFlow();
  equal(aligned_wrap_flow.inflow.dir, "lr");
  equal(aligned_wrap_flow.blockflow.dir, "tb");
  equal(aligned_wrap_flow.blockflow.multicol, true);

  // vertical
  var flow = new BoxFlow("tb", "rl");
  var aligned_wrap_flow = flow.getFloatedWrapFlow();
  equal(aligned_wrap_flow.inflow.dir, "tb");
  equal(aligned_wrap_flow.blockflow.dir, "rl");
  equal(aligned_wrap_flow.blockflow.multicol, false);
});

test("flow-valid", function(){
  var flow = new BoxFlow("tb", "rl");
  ok(flow.isValid());

  var flow = new BoxFlow("lr", "tb");
  ok(flow.isValid());

  var flow = new BoxFlow("lr", "bt");
  equal(flow.isValid(), false);
});