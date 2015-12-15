describe("Edge", function(){
  it("initialized by zero values", function(){
    var edge = new Nehan.Edge();
    expect(edge.top).toBe(0);
    expect(edge.right).toBe(0);
    expect(edge.bottom).toBe(0);
    expect(edge.left).toBe(0);
  });

  it("Edge.clear", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {start:10, end:20});
    expect(edge.left).toBe(10);
    expect(edge.right).toBe(20);
    edge.clear();
    expect(edge.left).toBe(0);
    expect(edge.right).toBe(0);
  });

  it("Edge.clear(each)", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {start:10, end:20, before:30, after:40});
    expect(edge.getStart(lr_tb)).toBe(10);
    edge.clearStart(lr_tb);
    expect(edge.getStart(lr_tb)).toBe(0);

    expect(edge.getEnd(lr_tb)).toBe(20);
    edge.clearEnd(lr_tb);
    expect(edge.getEnd(lr_tb)).toBe(0);

    expect(edge.getBefore(lr_tb)).toBe(30);
    edge.clearBefore(lr_tb);
    expect(edge.getBefore(lr_tb)).toBe(0);

    expect(edge.getAfter(lr_tb)).toBe(40);
    edge.clearAfter(lr_tb);
    expect(edge.getAfter(lr_tb)).toBe(0);
  });

  it("Edge.subtractAfter", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {after:40});
    expect(edge.getAfter(lr_tb)).toBe(40);

    edge.subtractAfter(lr_tb, 10);
    expect(edge.getAfter(lr_tb)).toBe(30);

    edge.subtractAfter(lr_tb, 10);
    expect(edge.getAfter(lr_tb)).toBe(20);

    edge.subtractAfter(lr_tb, 10);
    expect(edge.getAfter(lr_tb)).toBe(10);

    edge.subtractAfter(lr_tb, 10);
    expect(edge.getAfter(lr_tb)).toBe(0);

    edge.subtractAfter(lr_tb, 10);
    expect(edge.getAfter(lr_tb)).toBe(0); // not minus!
  });
});
