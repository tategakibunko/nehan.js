describe("TextLexer", function(){
  it("TextLexer.get", function(){
    var lexer = new Nehan.TextLexer("漢字kanji&nbsp;10年 ok");
    expect(lexer.get().data).toBe("漢"); // char
    expect(lexer.get().data).toBe("字"); // char
    expect(lexer.get().data).toBe("kanji"); // word
    expect(lexer.get().ref).toBe("&nbsp;"); // html-entity
    expect(lexer.get().data).toBe("10"); // tcy
    expect(lexer.get().data).toBe("年"); // char
    expect(lexer.get().data).toBe(" "); // char(u+0020)
    expect(lexer.get().data).toBe("ok"); // tcy
    expect(lexer.get()).toBe(null);
  });
});

