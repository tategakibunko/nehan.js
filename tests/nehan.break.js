describe("Nehan.Break", function(){
  it("Break::isAlways", function(){
    expect(new Nehan.Break("always").isAlways()).toBe(true);
  });

  it("Break::isAvoid", function(){
    expect(new Nehan.Break("avoid").isAvoid()).toBe(true);
  });

  it("Break::isFirst", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var tb_rl = Nehan.BoxFlows.getByName("tb-rl");
    var tb_lr = Nehan.BoxFlows.getByName("tb-lr");
    var break_left = new Nehan.Break("left");
    var break_right = new Nehan.Break("right");
    expect(break_left.isFirst(lr_tb)).toBe(true);
    expect(break_left.isFirst(tb_lr)).toBe(true);
    expect(break_left.isFirst(tb_rl)).toBe(false);
    expect(break_right.isFirst(lr_tb)).toBe(false);
    expect(break_right.isFirst(tb_lr)).toBe(false);
    expect(break_right.isFirst(tb_rl)).toBe(true);
  });

  it("Break::isSecond", function(){
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var tb_rl = Nehan.BoxFlows.getByName("tb-rl");
    var tb_lr = Nehan.BoxFlows.getByName("tb-lr");
    var break_left = new Nehan.Break("left");
    var break_right = new Nehan.Break("right");
    expect(break_left.isSecond(lr_tb)).toBe(false);
    expect(break_left.isSecond(tb_lr)).toBe(false);
    expect(break_left.isSecond(tb_rl)).toBe(true);
    expect(break_right.isSecond(lr_tb)).toBe(true);
    expect(break_right.isSecond(tb_lr)).toBe(true);
    expect(break_right.isSecond(tb_rl)).toBe(false);
  });
});
