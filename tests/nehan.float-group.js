describe("FloatGroup", function(){
  var ctx = Nehan.createRootContext({
    styles:{body:{flow:"lr-tb"}}
  });
  var lr_tb = ctx.getFlow();

  it("FloatGroup.isFloatStart", function(){
    var group = new Nehan.FloatGroup([], Nehan.FloatDirections.start);
    expect(group.isFloatStart()).toBe(true);
  });

  it("FloatGroup.isFloatEnd", function(){
    var group = new Nehan.FloatGroup([], Nehan.FloatDirections.end);
    expect(group.isFloatEnd()).toBe(true);
  });

  it("FloatGroup.add", function(){
    var group = new Nehan.FloatGroup([], Nehan.FloatDirections.start);
    var element = ctx.yieldWrapBlock(10, 20, []);
    var element2 = ctx.yieldWrapBlock(30, 40, []);
    group.add(element);
    expect(group.getElements().length).toBe(1);
    group.add(element2);
    expect(group.getElements().length).toBe(2);
    expect(group.getElements()[0]).toBe(element2); // last in is at the head.
  });

  it("FloatGroup.getMeasure, getExtent", function(){
    var group = new Nehan.FloatGroup([], Nehan.FloatDirections.start);
    var element = ctx.yieldWrapBlock(10, 20, []);
    var element2 = ctx.yieldWrapBlock(30, 40, []);
    var element3 = ctx.yieldWrapBlock(50, 10, []);
    group.add(element);
    expect(group.getMeasure(ctx.getFlow())).toBe(10);
    expect(group.getExtent(ctx.getFlow())).toBe(20);

    group.add(element2);
    expect(group.getMeasure(ctx.getFlow())).toBe(40);
    expect(group.getExtent(ctx.getFlow())).toBe(40);

    group.add(element3);
    expect(group.getMeasure(ctx.getFlow())).toBe(90);
    expect(group.getExtent(ctx.getFlow())).toBe(40);
  });
});
