describe("Tcy", function(){
  it("Tcy.getData", function(){
    var tcy = new Nehan.Tcy("10");
    expect(new Nehan.Tcy("20").getData()).toBe("20");
  });

  it("should count as one character", function(){
    expect(new Nehan.Tcy("a").getCharCount()).toBe(1);
    expect(new Nehan.Tcy("20").getCharCount()).toBe(1);
  });

  it("tcy is not both head_ng and tail_ng", function(){
    var tcy = new Nehan.Tcy("10");
    expect(tcy.isHeadNg()).toBe(false);
    expect(tcy.isTailNg()).toBe(false);
  });
});
