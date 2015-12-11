describe("Nehan::EdgeParser", function(){
  it("EdgeParser.formatProp", function(){
    expect(Nehan.EdgeParser.formatProp("margin")).toBe("margin");
    expect(Nehan.EdgeParser.formatProp("margin-start")).toBe("margin");
  });

  it("EdgeParser.formatValue", function(){
    expect(Nehan.EdgeParser.formatValue("margin", "0")).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.EdgeParser.formatValue("margin-start", "1")).toEqual({
      start:"1"
    });
  });

  it("EdgeParser.parseUnit", function(){
    expect(Nehan.EdgeParser.parseUnit("0")).toBe("0");
    expect(Nehan.EdgeParser.parseUnit(0)).toBe("0");
  });

  it("EdgeParser.parseUnit(exception)", function(){
    var fn1 = function(){
      Nehan.EdgeParser.parseUnit({});
    };
    expect(fn1).toThrow();
    var fn2 = function(){
      Nehan.EdgeParser.parseUnit([]);
    };
    expect(fn2).toThrow();
  });

  it("EdgeParser.parseSet(object)", function(){
    expect(Nehan.EdgeParser.parseSet({before:1})).toEqual({before:1});
  });

  it("EdgeParser.parseSet(string)", function(){
    expect(Nehan.EdgeParser.parseSet("")).toEqual({});
    expect(Nehan.EdgeParser.parseSet(" ")).toEqual({});
    expect(Nehan.EdgeParser.parseSet("0")).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.EdgeParser.parseSet(" 0   ")).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.EdgeParser.parseSet("0 1")).toEqual({
      before:"0",
      end:"1",
      after:"0",
      start:"1"
    });
    expect(Nehan.EdgeParser.parseSet("0 1 2")).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"1"
    });
    expect(Nehan.EdgeParser.parseSet("0 1 2 3")).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"3"
    });
  });

  it("EdgeParser.parseSet(Array)", function(){
    expect(Nehan.EdgeParser.parseSet(["0"])).toEqual({
      before:"0",
      end:"0",
      after:"0",
      start:"0"
    });
    expect(Nehan.EdgeParser.parseSet(["0","1"])).toEqual({
      before:"0",
      end:"1",
      after:"0",
      start:"1"
    });
    expect(Nehan.EdgeParser.parseSet(["0","1","2"])).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"1"
    });
    expect(Nehan.EdgeParser.parseSet(["0","1","2","3"])).toEqual({
      before:"0",
      end:"1",
      after:"2",
      start:"3"
    });
  });
});
