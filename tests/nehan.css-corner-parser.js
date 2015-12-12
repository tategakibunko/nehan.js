describe("Nehan.CssCornerParser", function(){
  it("CssCornerParser.parseUnit", function(){
    expect(Nehan.CssCornerParser.parseUnit("1")).toEqual(["1","1"]);
    expect(Nehan.CssCornerParser.parseUnit("1/2")).toEqual(["1","2"]);
  });

  it("CssCornerParser.parseSet", function(){
    expect(Nehan.CssCornerParser.parseSet("1")).toEqual({
      "before-start":["1", "1"],
      "before-end":["1", "1"],
      "after-end":["1", "1"],
      "after-start":["1", "1"]
    });
    expect(Nehan.CssCornerParser.parseSet("1 2")).toEqual({
      "before-start":["1", "1"],
      "before-end":["2", "2"],
      "after-end":["2", "2"],
      "after-start":["1", "1"]
    });
    expect(Nehan.CssCornerParser.parseSet("1/2")).toEqual({
      "before-start":["1", "2"],
      "before-end":["1", "2"],
      "after-end":["1", "2"],
      "after-start":["1", "2"]
    });
    expect(Nehan.CssCornerParser.parseSet("1/2 3/4")).toEqual({
      "before-start":["1", "2"],
      "before-end":["3", "4"],
      "after-end":["3", "4"],
      "after-start":["1", "2"]
    });
    expect(Nehan.CssCornerParser.parseSet("1/2 3/4 5/6")).toEqual({
      "before-start":["1", "2"],
      "before-end":["3", "4"],
      "after-end":["3", "4"],
      "after-start":["5", "6"]
    });
    expect(Nehan.CssCornerParser.parseSet("1/2 3/4 5/6 7/8")).toEqual({
      "before-start":["1", "2"],
      "before-end":["3", "4"],
      "after-end":["5", "6"],
      "after-start":["7", "8"]
    });
    expect(Nehan.CssCornerParser.parseSet("1/2 3/4 5/6 7")).toEqual({
      "before-start":["1", "2"],
      "before-end":["3", "4"],
      "after-end":["5", "6"],
      "after-start":["7", "7"]
    });
  });
});
