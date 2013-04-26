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

  ctx.pushBlock(new Tag("<p>"));
  equal(ctx.getBlockDepth(), 1);
  equal(ctx.getCurBlock().getName(), "p");

  var tag = ctx.popBlock();
  equal(tag.name, "p");
  equal(ctx.getBlockDepth(), 0);
  equal(ctx.getCurBlock(), null);
});

test("document-context-font-size", function(){
  var ctx = new DocumentContext();
  var parent = {fontSize:16}; // dummy parent

  ctx.pushInlineTag(new Tag("<span class='nehan-large'>"), parent);
  equal(ctx.getInlineFontSize(parent), 18);
  ctx.pushInlineTag(new Tag("<a href='hoge'>"), parent);
  equal(ctx.getInlineFontSize(parent), 18);
  ctx.pushInlineTag(new Tag("<span class='nehan-small'>"), parent);
  equal(ctx.getInlineFontSize(parent), 13);

  ctx.popInlineTagByName("span");
  equal(ctx.getInlineFontSize(parent), 18);
  ctx.popInlineTagByName("a");
  equal(ctx.getInlineFontSize(parent), 18);
  ctx.popInlineTagByName("span");
  equal(ctx.getInlineFontSize(parent), 16);
});

