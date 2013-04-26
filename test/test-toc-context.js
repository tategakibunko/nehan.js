test("toc-context", function(){
  var ctx = new TocContext();
  equal(ctx.getTocId(), "1");
  ctx.stepNext();
  equal(ctx.getTocId(), "2");
  ctx.startRoot();
  equal(ctx.getTocId(), "2.1");
  ctx.stepNext();
  equal(ctx.getTocId(), "2.2");
  ctx.endRoot();
  equal(ctx.getTocId(), "2");
  ctx.stepNext();
  equal(ctx.getTocId(), "3");
});