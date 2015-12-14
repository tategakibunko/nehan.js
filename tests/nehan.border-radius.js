describe("BorderRadius", function(){
  var flow = Nehan.BoxFlows.getByName("lr-tb");
  var radius = new Nehan.BorderRadius();

  radius.setSize(flow, {
    "before-start":[1, 2], // top-left
    "after-start":[3, 4], // bottom-left
    "before-end":[5, 6], // top-right
    "after-end":[7, 8] // bottom-right
  });

  it("BorderRadius.setSize", function(){
    expect(radius.topLeft.hori).toBe(1);
    expect(radius.topLeft.vert).toBe(2);
    expect(radius.bottomLeft.hori).toBe(3);
    expect(radius.bottomLeft.vert).toBe(4);
    expect(radius.topRight.hori).toBe(5);
    expect(radius.topRight.vert).toBe(6);
    expect(radius.bottomRight.hori).toBe(7);
    expect(radius.bottomRight.vert).toBe(8);
  });

  it("BorderRadius.setBeforeStart", function(){
    var tmp = radius.clone();
    tmp.setBeforeStart(flow, [100, 200]); // top-left
    expect(tmp.topLeft.hori).toBe(100);
    expect(tmp.topLeft.vert).toBe(200);
  });

  it("BorderRadius.setAfterStart", function(){
    var tmp = radius.clone();
    tmp.setAfterStart(flow, [100, 200]); // bottom-left
    expect(tmp.bottomLeft.hori).toBe(100);
    expect(tmp.bottomLeft.vert).toBe(200);
  });

  it("BorderRadius.setBeforeEnd", function(){
    var tmp = radius.clone();
    tmp.setBeforeEnd(flow, [100, 200]); // top-right
    expect(tmp.topRight.hori).toBe(100);
    expect(tmp.topRight.vert).toBe(200);
  });

  it("BorderRadius.setAfterEnd", function(){
    var tmp = radius.clone();
    tmp.setAfterEnd(flow, [100, 200]); // bottom-right
    expect(tmp.bottomRight.hori).toBe(100);
    expect(tmp.bottomRight.vert).toBe(200);
  });
  
  it("BorderRadius.clearBefore", function(){
    var tmp = radius.clone();
    tmp.clearBefore(flow);
    expect(tmp.topLeft.hori).toBe(0);
    expect(tmp.topLeft.vert).toBe(0);
    expect(tmp.topRight.hori).toBe(0);
    expect(tmp.topRight.vert).toBe(0);
  });

  it("BorderRadius.clearAfter", function(){
    var tmp = radius.clone();
    tmp.clearAfter(flow);
    expect(tmp.bottomLeft.hori).toBe(0);
    expect(tmp.bottomLeft.vert).toBe(0);
    expect(tmp.bottomRight.hori).toBe(0);
    expect(tmp.bottomRight.vert).toBe(0);
  });

  it("BorderRadius.getCssValue", function(){
    var css = radius.getCssValue();
    // top-left, top-right, bottom-right, bottom-left
    expect(radius.getCssValue()).toBe("1px 5px 7px 3px/2px 6px 8px 4px");
  });

  it("BorderRadius.getCorner", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var tb_rl = Nehan.BoxFlows.getByName("tb-rl");
    var left_top = radius.getCorner(lr_tb, "before-start");
    expect(left_top.hori).toBe(1);
    expect(left_top.vert).toBe(2);

    var left_bottom = radius.getCorner(lr_tb, "after-start");
    expect(left_bottom.hori).toBe(3);
    expect(left_bottom.vert).toBe(4);

    var right_top = radius.getCorner(lr_tb, "before-end");
    expect(right_top.hori).toBe(5);
    expect(right_top.vert).toBe(6);

    var right_bottom = radius.getCorner(lr_tb, "after-end");
    expect(right_bottom.hori).toBe(7);
    expect(right_bottom.vert).toBe(8);
  });
});
