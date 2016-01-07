describe("UprightTextLexer", function(){
  it("UprightTextLexer.get", function(){
    var lexer = new Nehan.UprightTextLexer("あabc&copy;");
    expect(lexer.get().data).toBe("あ"); // char
    expect(lexer.get().data).toBe("a"); // char
    expect(lexer.get().data).toBe("b"); // char
    expect(lexer.get().data).toBe("c"); // char
    expect(lexer.get().ref).toBe("&copy;"); // char
    expect(lexer.get()).toBe(null);
  });
});

