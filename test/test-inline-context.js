test("inline-context", function(){
  var ctx = new InlineContext();
  var parent = {fontSize:16}; // dummy parent
  equal(ctx.getFontSize(parent), 16);
  equal(ctx.isEmpty(), true);
  ctx.pushTag(new Tag("<b>"));
  equal(ctx.isBoldEnable(), true);
  equal(ctx.getTagDepth(), 1);
  ctx.popTag();
  equal(ctx.isBoldEnable(), false);
  equal(ctx.getTagDepth(), 0);
});
