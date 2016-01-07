describe("UprightTextLexer", function(){
  it("UprightTextLexer.get", function(){
    var lexer = new Nehan.UprightTextLexer("あabc&copy;");
    var token;
    token = lexer.get();
    expect(token.data).toBe("あ");
    expect(token instanceof Nehan.Char).toBe(true);
    token = lexer.get();
    expect(token.data).toBe("a");
    expect(token instanceof Nehan.Tcy).toBe(true);
    token = lexer.get();
    expect(token.data).toBe("b");
    expect(token instanceof Nehan.Tcy).toBe(true);
    token = lexer.get();
    expect(token.data).toBe("c");
    expect(token instanceof Nehan.Tcy).toBe(true);
    token = lexer.get();
    expect(token.data).toBe("&copy;");
    expect(token instanceof Nehan.Tcy).toBe(true);
    expect(lexer.get()).toBe(null);
  });
});

