describe("Css", function(){
  it("Css.normalizeValue", function(){
    expect(Nehan.Css.normalizeValue("red;")).toBe("red");
    expect(Nehan.Css.normalizeValue("  10   20   30")).toBe("10 20 30");
    expect(Nehan.Css.normalizeValue("  10   20 / 10   30")).toBe("10 20/10 30");
    expect(Nehan.Css.normalizeValue("url   ( 'hoge' )")).toBe("url('hoge')");
    expect(Nehan.Css.normalizeValue("Meiryo   ,   monospace")).toBe("Meiryo,monospace");
  });
});
