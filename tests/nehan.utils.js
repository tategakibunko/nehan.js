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

  it("Utils.getPercentValue", function(){
    expect(Nehan.Utils.getPercentValue(10, 100)).toBe(10);
    expect(Nehan.Utils.getPercentValue(10.1, 100)).toBe(10);
    expect(Nehan.Utils.getPercentValue(10.5, 100)).toBe(11); // floating point is rounded.
    expect(Nehan.Utils.getPercentValue(55, 100)).toBe(55);
    expect(Nehan.Utils.getPercentValue(110, 100)).toBe(110);
  });

  it("Utils.getEmSize", function(){
    expect(Nehan.Utils.getEmSize(0.5, 16)).toBe(8);
    expect(Nehan.Utils.getEmSize(0.6, 16)).toBe(10); // Math.round(9.6) -> 10
    expect(Nehan.Utils.getEmSize(1, 16)).toBe(16);
    expect(Nehan.Utils.getEmSize(2, 16)).toBe(32);
  });

  // 1pt = 4/3px
  it("Utils.getPxFromPt", function(){
    expect(Nehan.Utils.getPxFromPt(1)).toBe(1);
    expect(Nehan.Utils.getPxFromPt(1.5)).toBe(2);
    expect(Nehan.Utils.getPxFromPt(2)).toBe(3);
    expect(Nehan.Utils.getPxFromPt(3)).toBe(4);
  });

  it("Utils.replaceFirstLetter", function(){
    expect(Nehan.Utils.replaceFirstLetter("foo", function(letter){
      return "<letter>" + letter + "</letter>";
    })).toBe("<letter>f</letter>oo");

    expect(Nehan.Utils.replaceFirstLetter("\n\t  foo", function(letter){
      return "<letter>" + letter + "</letter>";
    })).toBe("\n\t  <letter>f</letter>oo");

    expect(Nehan.Utils.replaceFirstLetter("<p>foo</p>", function(letter){
      return "<letter>" + letter + "</letter>";
    })).toBe("<p><letter>f</letter>oo</p>");

    expect(Nehan.Utils.replaceFirstLetter("<p>\nfoo</p>", function(letter){
      return "<letter>" + letter + "</letter>";
    })).toBe("<p>\n<letter>f</letter>oo</p>");

    expect(Nehan.Utils.replaceFirstLetter("<p>\n\t  foo</p>", function(letter){
      return "<letter>" + letter + "</letter>";
    })).toBe("<p>\n\t  <letter>f</letter>oo</p>");
  });

  it("Utils.charCodeOfCharRef", function(){
    expect(Nehan.Utils.charCodeOfCharRef("&#xFB00;")).toEqual(64256);
    expect(Nehan.Utils.charCodeOfCharRef("&#64256;")).toEqual(64256);
  });

  it("Utils.charRefToUni", function(){
    expect(Nehan.Utils.charRefToUni("&#xFB00;")).toBe("\uFB00");
    expect(Nehan.Utils.charRefToUni("&#xfb00;")).toBe("\uFB00");
    expect(Nehan.Utils.charRefToUni("&#64256;")).toBe("\uFB00");
  });
});
