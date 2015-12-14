describe("Nehan.BoxCorner", function(){
  it("BoxCorner::getPhysicalCornerName", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var tb_rl = Nehan.BoxFlows.getByName("tb-rl");
    expect(Nehan.BoxCorner.getPhysicalCornerName(lr_tb, "before-start")).toBe("top-left");
    expect(Nehan.BoxCorner.getPhysicalCornerName(tb_rl, "before-start")).toBe("top-right");
  });
});
