describe("LexingRule", function(){
  it("LexingRule.isSingleTag", function(){
    expect(Nehan.LexingRule.isSingleTag("img")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("hr")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("br")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("meta")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("wbr")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("input")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("link")).toBe(true);
    expect(Nehan.LexingRule.isSingleTag("div")).toBe(false);
  });

  it("LexingRule.addSingleTagByName/removeSingleTagByName", function(){
    Nehan.LexingRule.addSingleTagByName("foo");
    expect(Nehan.LexingRule.isSingleTag("foo")).toBe(true);
    Nehan.LexingRule.removeSingleTagByName("foo");
    expect(Nehan.LexingRule.isSingleTag("foo")).toBe(false);
  });
});
