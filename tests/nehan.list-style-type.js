describe("ListStyleType", function(){
  it("ListStyleType.isDecimal", function(){
    expect(new Nehan.ListStyleType("decimal").isDecimal()).toBe(true);
    expect(new Nehan.ListStyleType("decimal-leading-zero").isDecimal()).toBe(true);
    expect(new Nehan.ListStyleType("disc").isDecimal()).toBe(false);
  });

  it("ListStyleType.isNone", function(){
    expect(new Nehan.ListStyleType().isNone()).toBe(true);
    expect(new Nehan.ListStyleType("none").isNone()).toBe(true);
  });

  it("ListStyleType.isMark", function(){
    expect(new Nehan.ListStyleType("disc").isMark()).toBe(true);
    expect(new Nehan.ListStyleType("circle").isMark()).toBe(true);
    expect(new Nehan.ListStyleType("square").isMark()).toBe(true);
  });

  it("ListStyleType.isIncremental", function(){
    expect(new Nehan.ListStyleType("decimal").isIncremental()).toBe(true);
    expect(new Nehan.ListStyleType("decimal-leading-zero").isIncremental()).toBe(true);
    expect(new Nehan.ListStyleType("lower-alpha").isIncremental()).toBe(true);
    expect(new Nehan.ListStyleType("none").isIncremental()).toBe(false);
    expect(new Nehan.ListStyleType("disc").isIncremental()).toBe(false);
  });

  it("ListStyleType.isHankaku", function(){
    expect(new Nehan.ListStyleType("decimal").isHankaku()).toBe(true);
    expect(new Nehan.ListStyleType("lower-alpha").isHankaku()).toBe(true);
    expect(new Nehan.ListStyleType("upper-alpha").isHankaku()).toBe(true);
    expect(new Nehan.ListStyleType("lower-roman").isHankaku()).toBe(true);
    expect(new Nehan.ListStyleType("upper-roman").isHankaku()).toBe(true);
    expect(new Nehan.ListStyleType("disc").isHankaku()).toBe(true);
    expect(new Nehan.ListStyleType("hiragana").isHankaku()).toBe(false);
  });

  it("ListStyleType.isZenkaku", function(){
    expect(new Nehan.ListStyleType("disc").isZenkaku()).toBe(false);
    expect(new Nehan.ListStyleType("hiragana").isZenkaku()).toBe(true);
  });

  it("ListStyleType.getMarkerText(disc)", function(){
    expect(new Nehan.ListStyleType("disc").getMarkerText(0)).toBe("&#x2022;");
    expect(new Nehan.ListStyleType("disc").getMarkerText(1)).toBe("&#x2022;");
    expect(new Nehan.ListStyleType("disc").getMarkerText(100)).toBe("&#x2022;");
    expect(new Nehan.ListStyleType("disc").getMarkerText(101)).toBe("&#x2022;");
  });

  it("ListStyleType.getMarkerText(decimal)", function(){
    expect(new Nehan.ListStyleType("decimal").getMarkerText(0)).toBe("1.");
    expect(new Nehan.ListStyleType("decimal").getMarkerText(1)).toBe("1.");
    expect(new Nehan.ListStyleType("decimal").getMarkerText(2)).toBe("2.");
    expect(new Nehan.ListStyleType("decimal").getMarkerText(100)).toBe("100.");
    expect(new Nehan.ListStyleType("decimal").getMarkerText(101)).toBe("101.");
  });

  it("ListStyleType.getMarkerText(decimal-leading-zero)", function(){
    expect(new Nehan.ListStyleType("decimal-leading-zero").getMarkerText(0)).toBe("01.");
    expect(new Nehan.ListStyleType("decimal-leading-zero").getMarkerText(1)).toBe("01.");
    expect(new Nehan.ListStyleType("decimal-leading-zero").getMarkerText(2)).toBe("02.");
    expect(new Nehan.ListStyleType("decimal-leading-zero").getMarkerText(10)).toBe("10.");
    expect(new Nehan.ListStyleType("decimal-leading-zero").getMarkerText(100)).toBe("100.");
    expect(new Nehan.ListStyleType("decimal-leading-zero").getMarkerText(101)).toBe("101.");
  });
});
