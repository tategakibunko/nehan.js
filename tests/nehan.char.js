describe("Char", function(){
  var space = new Nehan.Char({data:"\u0020"});
  var nbsp = new Nehan.Char({ref:"&nbsp;"});
  var ensp = new Nehan.Char({ref:"&ensp;"});
  var emsp = new Nehan.Char({ref:"&emsp;"});
  var thinsp = new Nehan.Char({ref:"&thinsp;"});
  var tab = new Nehan.Char({data:"\t"});
  var newline = new Nehan.Char({data:"\n"});

  it("Char.isSpace", function(){
    expect(new Nehan.Char({data:"\u0020"}).isSpace()).toBe(true);
    expect(new Nehan.Char({data:" "}).isSpace()).toBe(true);
  });

  it("Char.isTabSpace", function(){
    expect(new Nehan.Char({data:"\t"}).isTabSpace()).toBe(true);
    expect(new Nehan.Char({ref:"&#09;"}).isTabSpace()).toBe(true);
  });

  it("Char.isNbsp", function(){
    expect(new Nehan.Char({ref:"&nbsp;"}).isNbsp()).toBe(true);
    expect(new Nehan.Char({data:"\u00a0"}).isNbsp()).toBe(true);
  });

  it("Char.isThinsp", function(){
    expect(new Nehan.Char({ref:"&thinsp;"}).isThinsp()).toBe(true);
    expect(new Nehan.Char({data:"\u2009"}).isThinsp()).toBe(true);
  });

  it("Char.isEnsp", function(){
    expect(new Nehan.Char({ref:"&ensp;"}).isEnsp()).toBe(true);
    expect(new Nehan.Char({data:"\u2002"}).isEnsp()).toBe(true);
  });

  it("Char.isEmsp", function(){
    expect(new Nehan.Char({ref:"&emsp;"}).isEmsp()).toBe(true);
    expect(new Nehan.Char({data:"\u2003"}).isEmsp()).toBe(true);
  });

  it("Char.isIdeographicSpace", function(){
    expect(new Nehan.Char({data:"\u3000"}).isIdeographicSpace()).toBe(true);
  });

  it("Char.isNoBreakSpace", function(){
    expect(new Nehan.Char({ref:"&nbsp;"}).isNoBreakSpace()).toBe(true);
    expect(new Nehan.Char({data:" "}).isNoBreakSpace()).toBe(false);
  });

  it("Char.isSpaceGroup", function(){
    expect(space.isSpaceGroup()).toBe(true);
    expect(nbsp.isSpaceGroup()).toBe(true);
    expect(ensp.isSpaceGroup()).toBe(true);
    expect(thinsp.isSpaceGroup()).toBe(true);
    expect(tab.isSpaceGroup()).toBe(true);
    expect(newline.isSpaceGroup()).toBe(false);
  });

  it("Char.isWhiteSpace", function(){
    expect(space.isWhiteSpace()).toBe(true);
    expect(nbsp.isWhiteSpace()).toBe(true);
    expect(ensp.isWhiteSpace()).toBe(true);
    expect(thinsp.isWhiteSpace()).toBe(true);
    expect(tab.isWhiteSpace()).toBe(true);
    expect(newline.isWhiteSpace()).toBe(true);
  });

  it("Char.isNewLine", function(){
    expect(new Nehan.Char({data:"\n"}).isNewLine()).toBe(true);
    expect(new Nehan.Char({data:"\u000a"}).isNewLine()).toBe(true);
  });

  it("Char.isLessThanSign", function(){
    expect(new Nehan.Char({ref:"&lt;"}).isLessThanSign()).toBe(true);
    expect(new Nehan.Char({data:"\u003c"}).isLessThanSign()).toBe(true);
  });

  it("Char.isGreaterThanSign", function(){
    expect(new Nehan.Char({ref:"&gt;"}).isGreaterThanSign()).toBe(true);
    expect(new Nehan.Char({data:"\u003e"}).isGreaterThanSign()).toBe(true);
  });

  it("Char.isCharRef", function(){
    expect(new Nehan.Char({ref:"&lt;"}).isCharRef()).toBe(true);
    expect(new Nehan.Char({data:"\n"}).isCharRef()).toBe(false);
  });

  it("Char.getCharCount", function(){
    expect(new Nehan.Char({data:"\t"}).getCharCount()).toBe(0);
    expect(new Nehan.Char({data:" "}).getCharCount()).toBe(0);
    expect(new Nehan.Char({data:"\u3000"}).getCharCount()).toBe(0);
    expect(new Nehan.Char({ref:"&nbsp;"}).getCharCount()).toBe(0);
  });
});
