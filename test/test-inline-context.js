test("inline-context", function(){
  var ctx = new InlineContext();
  var parent = {fontSize:16}; // dummy parent
  equal(ctx.isEmpty(), true);
  ctx.pushTag(new Tag("<b>"));
  equal(ctx.getTagDepth(), 1);
  ctx.popTag();
  equal(ctx.getTagDepth(), 0);
});
