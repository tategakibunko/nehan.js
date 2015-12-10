describe("Nehan.BoxRect", function(){
  it("BoxRect::setLogicalValues(lr-tb)", function(){
    var flow = Nehan.BoxFlows.getByName("lr-tb");
    var value = Nehan.BoxRect.setLogicalValues({}, flow, {
      start:1,
      end:2,
      before:3,
      after:4
    });
    expect(value.left).toBe(1);
    expect(value.right).toBe(2);
    expect(value.top).toBe(3);
    expect(value.bottom).toBe(4);
  });

  it("BoxRect::setLogicalValues(tb-rl)", function(){
    var flow = Nehan.BoxFlows.getByName("tb-rl");
    var value = Nehan.BoxRect.setLogicalValues({}, flow, {
      start:1,
      end:2,
      before:3,
      after:4
    });
    expect(value.left).toBe(4);
    expect(value.right).toBe(3);
    expect(value.top).toBe(1);
    expect(value.bottom).toBe(2);
  });
});
