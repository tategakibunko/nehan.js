describe("Word", function(){
  var flow = Nehan.BoxFlows.getByName("lr-tb");
  it("Word.isHeadNg", function(){
    expect(new Nehan.Word("foo").isHeadNg()).toBe(false);
  });

  it("Word.isTailNg", function(){
    expect(new Nehan.Word("foo").isTailNg()).toBe(false);
  });

  it("Word.getData", function(){
    expect(new Nehan.Word("foo").getData(flow)).toBe("foo");
  });

  it("Word.countUpper", function(){
    expect(new Nehan.Word("foo").countUpper()).toBe(0);
    expect(new Nehan.Word("Foo").countUpper()).toBe(1);
    expect(new Nehan.Word("FoO").countUpper()).toBe(2);
  });

  it("Word.getLetterCount", function(){
    expect(new Nehan.Word("foo").getLetterCount()).toBe(3);
    expect(new Nehan.Word("hoge").getLetterCount()).toBe(4);
  });

  it("Word.isDivided", function(){
    var word = new Nehan.Word("foo");
    var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
    var font = new Nehan.Font({size:16});
    expect(word.isDivided()).toBe(false);
    word.setMetrics(lr_tb, font);
    word.cutMeasure(lr_tb, font, 8);
    expect(word.isDivided()).toBe(true);
  });
});
