describe("Margin", function(){
  it("Margin.getType", function(){
    expect(new Nehan.Margin().getType()).toBe("margin");
  });

  it("Margin.clone", function(){
    var margin = new Nehan.Margin();
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    margin.setSize(lr_tb, {before:1, end:2, after:3, start:4});
    var margin2 = margin.clone();
    expect(margin !== margin2).toBe(true);
    expect(margin.top).toBe(margin2.top);
    expect(margin.right).toBe(margin2.right);
    expect(margin.bottom).toBe(margin2.bottom);
    expect(margin.left).toBe(margin2.left);
  });
});
