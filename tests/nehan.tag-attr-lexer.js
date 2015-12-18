describe("TagAttrLexer", function(){
  it("TagAttrLexer.get(simple)", function(){
    var lexer = new Nehan.TagAttrLexer("class='foo' id='hoge'");
    expect(lexer.get()).toBe("class");
    expect(lexer.get()).toBe("=");
    expect(lexer.get()).toBe("foo");
    expect(lexer.get()).toBe("id");
    expect(lexer.get()).toBe("=");
    expect(lexer.get()).toBe("hoge");
    expect(lexer.isEnd()).toBe(true);
  });

  it("TagAttrLexer.get(with single attr)", function(){
    var lexer = new Nehan.TagAttrLexer("class='foo' checked");
    expect(lexer.get()).toBe("class");
    expect(lexer.get()).toBe("=");
    expect(lexer.get()).toBe("foo");
    expect(lexer.get()).toBe("checked");
    expect(lexer.isEnd()).toBe(true);
  });
});

