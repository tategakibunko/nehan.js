describe("BoxPosition", function(){
  var pos = new Nehan.BoxPosition("relative");
  pos.start = 1;
  pos.end = 2;
  pos.before = 3;
  pos.after = 4;

  it("BoxPosition.isAbsolute", function(){
    expect(new Nehan.BoxPosition("absolute").isAbsolute()).toBe(true);
  });

  it("BoxPosition.getCss(lr-tb)", function(){
    var css = pos.getCss(Nehan.BoxFlows.getByName("lr-tb"));
    expect(css.left).toBe("1px");
    expect(css.right).toBe("2px");
    expect(css.top).toBe("3px");
    expect(css.bottom).toBe("4px");
  });

  it("BoxPosition.getCss(tb-rl)", function(){
    var css = pos.getCss(Nehan.BoxFlows.getByName("tb-rl"));
    expect(css.left).toBe("4px");
    expect(css.right).toBe("3px");
    expect(css.top).toBe("1px");
    expect(css.bottom).toBe("2px");
  });

  it("BoxPosition.getCss(tb-lr)", function(){
    var css = pos.getCss(Nehan.BoxFlows.getByName("tb-lr"));
    expect(css.left).toBe("3px");
    expect(css.right).toBe("4px");
    expect(css.top).toBe("1px");
    expect(css.bottom).toBe("2px");
  });
});
