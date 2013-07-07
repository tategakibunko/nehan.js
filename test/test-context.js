test("inline-context", function(){
  var ctx = new InlineContext();
  ctx.pushTag(new Tag("<a href='#'>"));
  ctx.pushTag(new Tag("<b>"));

  equal(ctx.getTagDepth(), 2);
  ctx.popTag();
  equal(ctx.getTagDepth(), 1);
});

test("document-context", function(){
  var ctx = new DocumentContext();
  ctx.pushInlineTag(new Tag("<a href='#'>"));
  ctx.pushInlineTag(new Tag("<b>"));

  equal(ctx.getInlineTagDepth(), 2);
  var tag = ctx.popInlineTag();
  equal(tag.name, "b");
  equal(ctx.getInlineTagDepth(), 1);

  ctx.pushBlockTag(new Tag("<p>"));
  equal(ctx.getBlockDepth(), 1);
  equal(ctx.getCurBlockTag().getName(), "p");

  var tag = ctx.popBlockTag();
  equal(tag.name, "p");
  equal(ctx.getBlockDepth(), 0);
  equal(ctx.getCurBlockTag(), null);
});
