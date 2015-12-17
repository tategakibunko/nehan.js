describe("Padding", function(){
  it("Padding.getType", function(){
    expect(new Nehan.Padding().getType()).toBe("padding");
  });

  it("Padding.clone", function(){
    var padding = new Nehan.Padding();
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    padding.setSize(lr_tb, {before:1, end:2, after:3, start:4});
    var padding2 = padding.clone();
    expect(padding !== padding2).toBe(true);
    expect(padding.top).toBe(padding2.top);
    expect(padding.right).toBe(padding2.right);
    expect(padding.bottom).toBe(padding2.bottom);
    expect(padding.left).toBe(padding2.left);
  });
});
