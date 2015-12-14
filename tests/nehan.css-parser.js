describe("CssParser", function(){
  it("CssParser.formatEntry(margin)", function(){
    var entry = Nehan.CssParser.formatEntry("margin", {start:"1em"});
    expect(entry.getValue()).toEqual({start:"1em"});
  });

  it("CssParser.formatEntry(margin-xxx)", function(){
    var entry = Nehan.CssParser.formatEntry("margin-start", "1em");
    expect(entry.getValue()).toEqual({start:"1em"});
  });
});
