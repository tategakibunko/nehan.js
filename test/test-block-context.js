test("block-context", function(){
  var ctx = new BlockContext();
  ctx.pushTag(new Tag("<p>"));
  equal(ctx.getTagDepth(), 1);
  ctx.pushTag(new Tag("<div style='font-size:2.0em'>"));
  equal(ctx.getTagDepth(), 2);
  equal(ctx.getTagDepthByName("p"), 1);
  equal(ctx.getTagDepthByName("div"), 1);
  equal(ctx.getHeadTag().getName(), "div");
  ctx.popTag();
  equal(ctx.getTagDepth(), 1);
  equal(ctx.isTagNameEnable("div"), false);
  equal(ctx.isTagNameEnable("p"), true);
  ctx.popTag();
  equal(ctx.isTagNameEnable("p"), false);
  equal(ctx.isEmpty(), true);
});
