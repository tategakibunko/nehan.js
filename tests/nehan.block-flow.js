describe("Nehan.BlockFlow", function(){
  it("BlockFlow::getProp", function(){
    var tb = new Nehan.BlockFlow("tb");
    expect(tb.getPropBefore()).toBe("top");
    expect(tb.getPropAfter()).toBe("bottom");

    var rl = new Nehan.BlockFlow("rl");
    expect(rl.getPropBefore()).toBe("right");
    expect(rl.getPropAfter()).toBe("left");

    var lr = new Nehan.BlockFlow("lr");
    expect(lr.getPropBefore()).toBe("left");
    expect(lr.getPropAfter()).toBe("right");
  });
});
