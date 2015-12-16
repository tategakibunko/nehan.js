describe("InlineFlow", function(){
  var lr = new Nehan.InlineFlow("lr");
  var rl = new Nehan.InlineFlow("rl");
  var tb = new Nehan.InlineFlow("tb");

  it("InlineFlow.getPropStart", function(){
    expect(lr.getPropStart()).toBe("left");
    expect(rl.getPropStart()).toBe("right");
    expect(tb.getPropStart()).toBe("top");
  });

  it("InlineFlow.getPropEnd", function(){
    expect(lr.getPropEnd()).toBe("right");
    expect(rl.getPropEnd()).toBe("left");
    expect(tb.getPropEnd()).toBe("bottom");
  });
});
