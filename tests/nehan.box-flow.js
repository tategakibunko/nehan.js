describe("Nehan.BoxFlow", function(){
  var lr_tb = new Nehan.BoxFlow("lr", "tb");
  var tb_rl = new Nehan.BoxFlow("tb", "rl");
  var tb_lr = new Nehan.BoxFlow("tb", "lr");

  it("BoxFlow::isTextLineFirst", function(){
    expect(lr_tb.isTextLineFirst()).toBe(false);
    expect(tb_rl.isTextLineFirst()).toBe(false);
    expect(tb_lr.isTextLineFirst()).toBe(true);
  });

  it("BoxFlow::isBlockflowVertical", function(){
    expect(lr_tb.isBlockflowVertical()).toBe(true);
    expect(tb_rl.isBlockflowVertical()).toBe(false);
    expect(tb_lr.isBlockflowVertical()).toBe(false);
  });

  it("BoxFlow::isTextVertical", function(){
    expect(lr_tb.isTextVertical()).toBe(false);
    expect(tb_rl.isTextVertical()).toBe(true);
    expect(tb_lr.isTextVertical()).toBe(true);
  });

  it("BoxFlow::isTextLeftToRight", function(){
    expect(lr_tb.isTextLeftToRight()).toBe(true);
    expect(tb_rl.isTextLeftToRight()).toBe(false);
    expect(tb_lr.isTextLeftToRight()).toBe(false);
  });

  it("BoxFlow::isTextRightToLeft", function(){
    expect(lr_tb.isTextRightToLeft()).toBe(false);
    expect(tb_rl.isTextRightToLeft()).toBe(false);
    expect(tb_lr.isTextRightToLeft()).toBe(false);
  });

  it("BoxFlow::isBlockLeftToRight", function(){
    expect(lr_tb.isBlockLeftToRight()).toBe(false);
    expect(tb_rl.isBlockLeftToRight()).toBe(false);
    expect(tb_lr.isBlockLeftToRight()).toBe(true);
  });

  it("BoxFlow::isBlockRightToLeft", function(){
    expect(lr_tb.isBlockRightToLeft()).toBe(false);
    expect(tb_rl.isBlockRightToLeft()).toBe(true);
    expect(tb_lr.isBlockRightToLeft()).toBe(false);
  });

  it("BoxFlow::getCss", function(){
    expect(lr_tb.getCss()["css-float"]).toBe("left");
    expect(tb_rl.getCss()["css-float"]).toBe("right");
    expect(tb_lr.getCss()["css-float"]).toBe("left");
  });

  it("BoxFlow::getName", function(){
    expect(lr_tb.getName()).toBe("lr-tb");
    expect(tb_rl.getName()).toBe("tb-rl");
    expect(tb_lr.getName()).toBe("tb-lr");
  });

  it("BoxFlow::getProp('start')", function(){
    expect(lr_tb.getProp("start")).toBe("left");
    expect(tb_rl.getProp("start")).toBe("top");
    expect(tb_lr.getProp("start")).toBe("top");
  });

  it("BoxFlow::getProp('end')", function(){
    expect(lr_tb.getProp("end")).toBe("right");
    expect(tb_rl.getProp("end")).toBe("bottom");
    expect(tb_lr.getProp("end")).toBe("bottom");
  });

  it("BoxFlow::getProp('before')", function(){
    expect(lr_tb.getProp("before")).toBe("top");
    expect(tb_rl.getProp("before")).toBe("right");
    expect(tb_lr.getProp("before")).toBe("left");
  });

  it("BoxFlow::getProp('after')", function(){
    expect(lr_tb.getProp("after")).toBe("bottom");
    expect(tb_rl.getProp("after")).toBe("left");
    expect(tb_lr.getProp("after")).toBe("right");
  });

  it("BoxFlow::getPropWidth", function(){
    expect(lr_tb.getPropWidth()).toBe("measure");
    expect(tb_rl.getPropWidth()).toBe("extent");
    expect(tb_lr.getPropWidth()).toBe("extent");
  });

  it("BoxFlow::getPropHeight", function(){
    expect(lr_tb.getPropHeight()).toBe("extent");
    expect(tb_rl.getPropHeight()).toBe("measure");
    expect(tb_lr.getPropHeight()).toBe("measure");
  });

  it("BoxFlow::getFlipFlow", function(){
    expect(lr_tb.getFlipFlow().inflow.dir).toBe("tb");
    expect(lr_tb.getFlipFlow().blockflow.dir).toBe("rl");
    expect(tb_rl.getFlipFlow().inflow.dir).toBe("lr");
    expect(tb_rl.getFlipFlow().blockflow.dir).toBe("tb");
    expect(tb_lr.getFlipFlow().inflow.dir).toBe("lr");
    expect(tb_lr.getFlipFlow().blockflow.dir).toBe("tb");
  });

  it("BoxFlow::getBoxSize", function(){
    expect(lr_tb.getBoxSize(100, 200).width).toBe(100);
    expect(lr_tb.getBoxSize(100, 200).height).toBe(200);
    expect(tb_rl.getBoxSize(100, 200).width).toBe(200);
    expect(tb_rl.getBoxSize(100, 200).height).toBe(100);
    expect(tb_lr.getBoxSize(100, 200).width).toBe(200);
    expect(tb_lr.getBoxSize(100, 200).height).toBe(100);
  });
});
