describe("Nehan::CssParser", function(){
  it("CssParser.normalizeProp(margin)", function(){
    expect(Nehan.CssParser.normalizeProp("margin")).toBe("margin");
    expect(Nehan.CssParser.normalizeProp("margin-after")).toBe("margin");
  });

  it("CssParser.normalizeProp(border-width)", function(){
    expect(Nehan.CssParser.normalizeProp("border-width-before")).toBe("border-width");
  });

  it("CssParser.formatValue", function(){
    expect(Nehan.CssParser.formatValue("margin", {start:"1em"})).toEqual({start:"1em"});
    expect(Nehan.CssParser.formatValue("margin-start", "1em")).toEqual({start:"1em"});
  });
});
