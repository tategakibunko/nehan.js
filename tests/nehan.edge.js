describe("Edge", function(){
  var lr_tb = Nehan.BoxFlows.getByName("lr-tb");

  it("initialized by zero values", function(){
    var edge = new Nehan.Edge();
    expect(edge.top).toBe(0);
    expect(edge.right).toBe(0);
    expect(edge.bottom).toBe(0);
    expect(edge.left).toBe(0);
  });

  it("Edge.clear", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {start:10, end:20});
    expect(edge.left).toBe(10);
    expect(edge.right).toBe(20);
    edge.clear();
    expect(edge.left).toBe(0);
    expect(edge.right).toBe(0);
  });

  it("Edge.clear(each)", function(){
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

  it("Edge.cancelAfter", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {after:20});
    expect(edge.cancelAfter(lr_tb, 5)).toBe(5);
    expect(edge.getAfter(lr_tb)).toBe(15);
    expect(edge.cancelAfter(lr_tb, 100)).toBe(15);
    expect(edge.getAfter(lr_tb)).toBe(0);
  });

  it("Edge.getDirProp(must fail)", function(){
    var edge = new Nehan.Edge();
    var to_fail = function(){
      edge.getDirProp();
    };
    expect(to_fail).toThrow();
  });

  it("Edge.getCss(must fail)", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {start:10});
    // if some value is set, getDirProp is called internal.
    var to_fail = function(){
      edge.getCss(); 
    };
    expect(to_fail).toThrow();
  });

  it("Edge.getWidth", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {start:10, end:20});
    expect(edge.getWidth()).toBe(30);
  });

  it("Edge.getHeight", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {before:10, after:20});
    expect(edge.getHeight()).toBe(30);
  });

  it("Edge.getMeasure", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {start:10, end:20});
    expect(edge.getMeasure(lr_tb)).toBe(30);
  });

  it("Edge.getExtent", function(){
    var edge = new Nehan.Edge();
    edge.setSize(lr_tb, {before:10, after:20});
    expect(edge.getExtent(lr_tb)).toBe(30);
  });

  it("Edge.setByName, getByName", function(){
    var edge = new Nehan.Edge();
    edge.setByName(lr_tb, "start", 10);
    expect(edge.getByName(lr_tb, "start")).toBe(10);
    expect(edge.getStart(lr_tb)).toBe(10);
  });
});
