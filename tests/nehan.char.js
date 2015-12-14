describe("Char", function(){
  it("Char.getCharCount", function(){
    expect(new Nehan.Char({data:"\t"}).getCharCount()).toBe(0);
    expect(new Nehan.Char({data:" "}).getCharCount()).toBe(0);
    expect(new Nehan.Char({data:"\u3000"}).getCharCount()).toBe(0);
    expect(new Nehan.Char({ref:"&nbsp;"}).getCharCount()).toBe(0);
  });
});
