describe("Nehan.BoxSize", function(){
  var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
  var tb_rl = Nehan.BoxFlows.getByName("tb-rl");
  var box = new Nehan.BoxSize(100, 200);

  it("BoxSize::clone", function(){
    var box2 = box.clone();
    expect(box2.width).toBe(box.width);
    expect(box2.height).toBe(box.height);
  });

  it("BoxSize::setMeasure", function(){
    var tmp = box.clone();
    tmp.setMeasure(lr_tb, 300);
    expect(tmp.width).toBe(300);

    tmp.setMeasure(tb_rl, 400);
    expect(tmp.height).toBe(400);
  });

  it("BoxSize::setExtent", function(){
    var tmp = box.clone();
    tmp.setExtent(lr_tb, 300);
    expect(tmp.height).toBe(300);

    tmp.setExtent(tb_rl, 400);
    expect(tmp.width).toBe(400);
  });

  it("BoxSize::getMeasure", function(){
    expect(box.getMeasure(lr_tb)).toBe(100);
    expect(box.getMeasure(tb_rl)).toBe(200);
  });

  it("BoxSize::getExtent", function(){
    expect(box.getExtent(lr_tb)).toBe(200);
    expect(box.getExtent(tb_rl)).toBe(100);
  });

  it("BoxSize::getCss", function(){
    var css = box.getCss();
    expect(css.width).toBe("100px");
    expect(css.height).toBe("200px");
  });

  it("BoxSize::isEqualTo", function(){
    expect(new Nehan.BoxSize(1,2).isEqualTo(new Nehan.BoxSize(1,2))).toBe(true);
  });
});
