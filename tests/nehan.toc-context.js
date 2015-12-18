describe("TocContext", function(){
  it("TocContext.toString", function(){
    var ctx = new Nehan.TocContext();
    expect(ctx.toString()).toBe("1");
    ctx.stepNext();
    expect(ctx.toString()).toBe("2");
    ctx.startRoot();
    expect(ctx.toString()).toBe("2.1");
    ctx.stepNext();
    expect(ctx.toString()).toBe("2.2");
    ctx.endRoot();
    expect(ctx.toString()).toBe("2");
  });
});

