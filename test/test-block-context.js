test("block-context", function(){
  var ctx = new BlockContext();
  ctx.pushBlock(new Tag("<p>"));
  equal(ctx.getDepth(), 1);
  ctx.pushBlock(new Tag("<div style='font-size:2.0em'>"));
  equal(ctx.getDepth(), 2);
  equal(ctx.getDepthByName("p"), 1);
  equal(ctx.getDepthByName("div"), 1);
  equal(ctx.getHead().getName(), "div");
  ctx.popBlock();
  equal(ctx.getDepth(), 1);
  equal(ctx.isTagNameEnable("div"), false);
  equal(ctx.isTagNameEnable("p"), true);
  ctx.popBlock();
  equal(ctx.isTagNameEnable("p"), false);
  equal(ctx.isEmpty(), true);
});
