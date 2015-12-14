describe("CssEntry", function(){
  it("CssEntry.getPropName", function(){
    var entry = Nehan.CssParser.formatEntry("margin-after", "1em");
    expect(entry.getPropName()).toBe("margin");
    var entry2 = Nehan.CssParser.formatEntry("margin", "1em");
    expect(entry2.getPropName()).toBe("margin");
  });
  it("CssEntry.getPropAttr", function(){
    var entry = Nehan.CssParser.formatEntry("margin-after", "1em");
    expect(entry.getPropAttr()).toBe("after");
    var entry2 = Nehan.CssParser.formatEntry("margin", "1em");
    expect(entry2.getPropAttr()).toBe(null);
  });
});
