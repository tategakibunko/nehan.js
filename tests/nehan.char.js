describe("Nehan.Char", function(){
  it("Char.getCharCount", function(){
    expect(new Nehan.Char("\t").getCharCount()).toBe(0);
    expect(new Nehan.Char(" ").getCharCount()).toBe(0);
    expect(new Nehan.Char("\u3000").getCharCount()).toBe(0);
    expect(new Nehan.Char("&nbsp;", {isRef:true}).getCharCount()).toBe(0);
  });
});
