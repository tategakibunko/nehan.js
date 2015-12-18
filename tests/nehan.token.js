describe("Token", function(){
  it("Token.isText", function(){
    expect(Nehan.Token.isText(new Nehan.Char({data:"a"}))).toBe(true);
    expect(Nehan.Token.isText(new Nehan.Word({data:"foo"}))).toBe(true);
    expect(Nehan.Token.isText(new Nehan.Tcy("01"))).toBe(true);
    expect(Nehan.Token.isText(new Nehan.Ruby([], ""))).toBe(true);
  });

  it("Token.isEmphaTargetable", function(){
    expect(Nehan.Token.isEmphaTargetable(new Nehan.Char({data:"a"}))).toBe(true);
    expect(Nehan.Token.isEmphaTargetable(new Nehan.Word({data:"foo"}))).toBe(false); // in current state, word can't contain ruby.
    expect(Nehan.Token.isEmphaTargetable(new Nehan.Tcy("01"))).toBe(true);
    expect(Nehan.Token.isEmphaTargetable(new Nehan.Ruby([], ""))).toBe(false);
  });

  it("Token.isNewLine", function(){
    expect(Nehan.Token.isNewLine(new Nehan.Char({data:"\n"}))).toBe(true);
    expect(Nehan.Token.isNewLine(new Nehan.Char({data:"a"}))).toBe(false);
    expect(Nehan.Token.isNewLine(new Nehan.Word("foo"))).toBe(false);
  });

  it("Token.isWhiteSpace", function(){
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({data:"\n"}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({data:"\t"}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({data:" "}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({ref:"&nbsp;"}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({ref:"&emsp;"}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({ref:"&ensp;"}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Char({ref:"&thinsp;"}))).toBe(true);
    expect(Nehan.Token.isWhiteSpace(new Nehan.Word("foo"))).toBe(false);
  });
});
