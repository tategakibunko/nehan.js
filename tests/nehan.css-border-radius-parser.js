// note that string value are already formatted(cut space, cut space around slash ... etc).
describe("Nehan.CssBorderRadiusParser", function(){
  var prop = new Nehan.CssProp("border-radius");

  it("CssBorderRadiusParser.formatValue(prop, '1')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1")).toEqual({
      "before-start":["1", "1"],
      "before-end":["1", "1"],
      "after-end":["1", "1"],
      "after-start":["1", "1"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1/2')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1/2")).toEqual({
      "before-start":["1", "2"],
      "before-end":["1", "2"],
      "after-end":["1", "2"],
      "after-start":["1", "2"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, [])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, [])).toEqual({});
  });

  it("CssBorderRadiusParser.formatValue(prop, [1])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, ["1"])).toEqual({
      "before-start":["1", "1"],
      "before-end":["1", "1"],
      "after-end":["1", "1"],
      "after-start":["1", "1"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, [1, 2])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, ["1","2"])).toEqual({
      "before-start":["1", "1"],
      "before-end":["2", "2"],
      "after-end":["1", "1"],
      "after-start":["2", "2"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, [[1],[2]])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, [["1"], ["2"]])).toEqual({
      "before-start":["1", "2"],
      "before-end":["1", "2"],
      "after-end":["1", "2"],
      "after-start":["1", "2"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, [[1,2],[3,4]])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, [["1","2"],["3","4"]])).toEqual({
      "before-start":["1", "3"],
      "before-end":["2", "4"],
      "after-end":["1", "3"],
      "after-start":["2", "4"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, [[1,2,3],[4,5,6]])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, [["1","2","3"],["4","5","6"]])).toEqual({
      "before-start":["1", "4"],
      "before-end":["2", "5"],
      "after-end":["3", "6"],
      "after-start":["2", "5"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, [[1,2,3,4],[5,6,7,8]])", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, [["1","2","3","4"],["5","6","7","8"]])).toEqual({
      "before-start":["1", "5"],
      "before-end":["2", "6"],
      "after-end":["3", "7"],
      "after-start":["4", "8"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1")).toEqual({
      "before-start":["1", "1"],
      "before-end":["1", "1"],
      "after-end":["1", "1"],
      "after-start":["1", "1"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1 2')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1 2")).toEqual({
      "before-start":["1", "1"],
      "before-end":["2", "2"],
      "after-end":["1", "1"],
      "after-start":["2", "2"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1/2')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1/2")).toEqual({
      "before-start":["1", "2"],
      "before-end":["1", "2"],
      "after-end":["1", "2"],
      "after-start":["1", "2"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1 2/3 4')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1 2/3 4")).toEqual({
      "before-start":["1", "3"],
      "before-end":["2", "4"],
      "after-end":["1", "3"],
      "after-start":["2", "4"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1 2 3/4 5 6')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1 2 3/4 5 6")).toEqual({
      "before-start":["1", "4"],
      "before-end":["2", "5"],
      "after-end":["3", "6"],
      "after-start":["2", "5"]
    });
  });

  it("CssBorderRadiusParser.formatValue(prop, '1 2 3 4/5 6 7 8')", function(){
    expect(Nehan.CssBorderRadiusParser.formatValue(prop, "1 2 3 4/5 6 7 8")).toEqual({
      "before-start":["1", "5"],
      "before-end":["2", "6"],
      "after-end":["3", "7"],
      "after-start":["4", "8"]
    });
  });
});
