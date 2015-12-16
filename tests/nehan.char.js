describe("Char", function(){
  it("Char.getCharCount", function(){
    expect(new Nehan.Char({data:"\t"}).getCharCount()).toBe(0);
    expect(new Nehan.Char({data:" "}).getCharCount()).toBe(0);
    expect(new Nehan.Char({data:"\u3000"}).getCharCount()).toBe(0);
    expect(new Nehan.Char({ref:"&nbsp;"}).getCharCount()).toBe(0);
  });

  it("Char.isNbsp", function(){
    expect(new Nehan.Char({ref:"&nbsp;"}).isNbsp()).toBe(true);
    expect(new Nehan.Char({data:"\u00a0"}).isNbsp()).toBe(true);
  });

  it("Char.isThinsp", function(){
    expect(new Nehan.Char({ref:"&thinsp;"}).isThinsp()).toBe(true);
    expect(new Nehan.Char({data:"\u2009"}).isThinsp()).toBe(true);
  });
});
