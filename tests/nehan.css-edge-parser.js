describe("Nehan::CssEdgeParser", function(){
  it("CssEdgeParser.parseUnit", function(){
    expect(Nehan.CssEdgeParser.parseUnit("0")).toBe("0");
    expect(Nehan.CssEdgeParser.parseUnit(0)).toBe("0");
  });

  it("CssEdgeParser.parseUnit(exception)", function(){
    var fn1 = function(){
      Nehan.CssEdgeParser.parseUnit({});
    };
    expect(fn1).toThrow();
    var fn2 = function(){
      Nehan.CssEdgeParser.parseUnit([]);
    };
    expect(fn2).toThrow();
  });

  it("CssEdgeParser.parseSet(object)", function(){
    expect(Nehan.CssEdgeParser.parseSet({before:1})).toEqual({before:1});
  });

  it("CssEdgeParser.parseSet(string)", function(){
    expect(Nehan.CssEdgeParser.parseSet("")).toEqual({});
    expect(Nehan.CssEdgeParser.parseSet(" ")).toEqual({});
    expect(Nehan.CssEdgeParser.parseSet("0")).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.CssEdgeParser.parseSet(" 0   ")).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.CssEdgeParser.parseSet("0 1")).toEqual({
      before:"0",
      end:"1",
      after:"0",
      start:"1"
    });
    expect(Nehan.CssEdgeParser.parseSet("0 1 2")).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"1"
    });
    expect(Nehan.CssEdgeParser.parseSet("0 1 2 3")).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"3"
    });
  });

  it("CssEdgeParser.parseSet(Array)", function(){
    expect(Nehan.CssEdgeParser.parseSet(["0"])).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.CssEdgeParser.parseSet(["0","1"])).toEqual({
      before:"0",
      end:"1",
      after:"0",
      start:"1"
    });
    expect(Nehan.CssEdgeParser.parseSet(["0","1","2"])).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"1"
    });
    expect(Nehan.CssEdgeParser.parseSet(["0","1","2","3"])).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"3"
    });
  });
});
