describe("Utils", function(){
  it("Utils.convBase", function(){
    expect(Nehan.Utils.convBase(128, 10)).toEqual([1, 2, 8]);
    expect(Nehan.Utils.convBase(128, 16)).toEqual([8, 0]);
  });

  it("Utils.trimHeadCRLF", function(){
    expect(Nehan.Utils.trimHeadCRLF("\r\n\nhoge")).toBe("hoge");
  });

  it("Utils.trimTailCRLF", function(){
    expect(Nehan.Utils.trimTailCRLF("hoge\r\n\n\r\n")).toBe("hoge");
  });

  it("Utils.trimCRLF", function(){
    expect(Nehan.Utils.trimCRLF("\r\n\nhoge\n\r\n")).toBe("hoge");
  });

  it("Utils.trim", function(){
    expect(Nehan.Utils.trim("  \nhoge  \n")).toBe("hoge");
  });

  it("Utils.cutQuote", function(){
    expect(Nehan.Utils.cutQuote("'hoge' \"hige\"")).toBe("hoge hige");
  });

  it("Utils.capitalize", function(){
    expect(Nehan.Utils.capitalize("japan")).toBe("Japan");
  });

  it("Utils.filenameConcat", function(){
    expect(Nehan.Utils.filenameConcat("/path/to", "foo")).toBe("/path/to/foo");
    expect(Nehan.Utils.filenameConcat("/path/to/", "foo")).toBe("/path/to/foo");
  });

  it("Utils.camelToChain", function(){
    expect(Nehan.Utils.camelToChain("fontSize")).toBe("font-size");
    expect(Nehan.Utils.camelToChain("helpMeDoraemon")).toBe("help-me-doraemon");
  });

  it("Utils.camelize", function(){
    expect(Nehan.Utils.camelize("font-size")).toBe("fontSize");
    expect(Nehan.Utils.camelize("help-me-doraemon")).toBe("helpMeDoraemon");
  });

  it("Utils.splitBy", function(){
    expect(Nehan.Utils.splitBy("foo", ",")).toEqual(["foo"]);
    expect(Nehan.Utils.splitBy("foo,bar", ",")).toEqual(["foo", "bar"]);
  });

  it("Utils.splitBySpace", function(){
    expect(Nehan.Utils.splitBySpace("foo")).toEqual(["foo"]);
    expect(Nehan.Utils.splitBySpace("foo bar\tbaz")).toEqual(["foo", "bar", "baz"]);
  });

  it("Utils.isNumber", function(){
    expect(Nehan.Utils.isNumber(true)).toBe(false);
    expect(Nehan.Utils.isNumber(false)).toBe(false);
    expect(Nehan.Utils.isNumber(0)).toBe(true);
    expect(Nehan.Utils.isNumber(1)).toBe(true);
    expect(Nehan.Utils.isNumber("0")).toBe(true);
    expect(Nehan.Utils.isNumber("1")).toBe(true);
    expect(Nehan.Utils.isNumber("1.0")).toBe(true);
    expect(Nehan.Utils.isNumber("1.5")).toBe(true);
    expect(Nehan.Utils.isNumber("10e+2")).toBe(true);
    expect(Nehan.Utils.isNumber("10e-2")).toBe(true);
    expect(Nehan.Utils.isNumber(Infinity)).toBe(true);
  });
});
