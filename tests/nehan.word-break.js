describe("WordBreak", function(){
  it("WordBreak.isWordBreakAll", function(){
    expect(new Nehan.WordBreak("break-all").isWordBreakAll()).toBe(true);
    expect(new Nehan.WordBreak("keep-all").isWordBreakAll()).toBe(false);
    expect(new Nehan.WordBreak("normal").isWordBreakAll()).toBe(false);
  });

  it("WordBreak.isHyphenationEnable", function(){
    expect(new Nehan.WordBreak("break-all").isHyphenationEnable()).toBe(false);
    expect(new Nehan.WordBreak("keep-all").isHyphenationEnable()).toBe(false);
    expect(new Nehan.WordBreak("normal").isHyphenationEnable()).toBe(true);
  });
});

