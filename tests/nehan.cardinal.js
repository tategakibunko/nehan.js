describe("Cardinal", function(){
  it("Cardinal.getStringByName(lower-alpha)", function(){
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 0)).toBe("a");
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 1)).toBe("a");
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 2)).toBe("b");
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 25)).toBe("y");
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 26)).toBe("z");
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 27)).toBe("aa");
    expect(Nehan.Cardinal.getStringByName("lower-alpha", 28)).toBe("ab");
  });

  it("Cardinal.getStringByName(hiragana)", function(){
    expect(Nehan.Cardinal.getStringByName("hiragana", 0)).toBe("あ");
    expect(Nehan.Cardinal.getStringByName("hiragana", 1)).toBe("あ");
    expect(Nehan.Cardinal.getStringByName("hiragana", 2)).toBe("い");
    expect(Nehan.Cardinal.getStringByName("hiragana", 47)).toBe("を");
    expect(Nehan.Cardinal.getStringByName("hiragana", 48)).toBe("ん");
    expect(Nehan.Cardinal.getStringByName("hiragana", 49)).toBe("ああ");
    expect(Nehan.Cardinal.getStringByName("hiragana", 50)).toBe("あい");
  });
});

