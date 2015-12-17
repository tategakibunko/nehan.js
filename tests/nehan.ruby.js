describe("Ruby", function(){
  var ruby = new Nehan.Ruby([new Nehan.Char({data:"漢"}), new Nehan.Char({data:"字"})], new Nehan.Tag("rt", "かんじ"));

  it("getCharCount", function(){
    expect(ruby.getCharCount()).toBe(2);
  });

  it("getRbString", function(){
    expect(ruby.getRbString()).toBe("漢字");
  });

  it("getRtString", function(){
    expect(ruby.getRtString()).toBe("かんじ");
  });
});
