// note that string value are already formatted(cut space, cut space around slash ... etc).
describe("CssEdgeParser", function(){
  var prop = new Nehan.CssProp("margin");
  var zero_edge = {before:"0", end:"0", after:"0", start:"0"};

  it("CssEdgeParser.formatValue(prop, '0')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, "0")).toEqual(zero_edge);
    expect(Nehan.CssEdgeParser.formatValue(prop, 0)).toEqual(zero_edge);
  });

  it("CssEdgeParser.formatValue(prop, object)", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, {})).toEqual({});
    expect(Nehan.CssEdgeParser.formatValue(prop, {before:1})).toEqual({before:1});
    expect(Nehan.CssEdgeParser.formatValue(prop, {before:1, end:2})).toEqual({before:1, end:2});
  });
  
  it("CssEdgeParser.formatValue(prop, '')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, "")).toEqual({});
  });

  it("CssEdgeParser.formatValue(prop, ' ')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, " ")).toEqual({});
  });

  it("CssEdgeParser.formatValue(prop, '0')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, "0")).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
  });

  it("CssEdgeParser.formatValue(prop, '0 1')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, "0 1")).toEqual({
      before:"0",
      end:"1",
      after:"0",
      start:"1"
    });
  });

  it("CssEdgeParser.formatValue(prop, '0 1 2')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, "0 1 2")).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"1"
    });
  });

  it("CssEdgeParser.formatValue(prop, '0 1 2 3')", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, "0 1 2 3")).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"3"
    });
  });

  it("CssEdgeParser.formatValue(prop, ['0'])", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, ["0"])).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
  });

  it("CssEdgeParser.formatValue(prop, ['0', '1'])", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, ["0","1"])).toEqual({
      before:"0",
      end:"1",
      after:"0",
      start:"1"
    });
  });

  it("CssEdgeParser.formatValue(prop, ['0', '1', '2'])", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, ["0","1","2"])).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"1"
    });
  });

  it("CssEdgeParser.formatValue(prop, ['0', '1', '2', '3'])", function(){
    expect(Nehan.CssEdgeParser.formatValue(prop, ["0","1","2","3"])).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"3"
    });
  });
});
