describe("TokenStream", function(){
  // <div><b>foo</b></div>
  // <p>bar</p>
  // <ul><li>baz</li></ul>
  // <p>hoge</p>
  var create_stream = function(){
    return new Nehan.TokenStream({
      lexer:new Nehan.HtmlLexer("<div><b>foo</b></div><p>bar</p><ul><li>baz</li></ul><p>hoge</p>")
    });
  };

  it("check stream functionality for html lexer", function(){
    var stream = create_stream();
    var token;
    expect(stream.isHead()).toBe(true);
    expect(stream.hasNext()).toBe(true);
    token = stream.get();
    expect(token.getName()).toBe("div");
    expect(token.isFirstChild()).toBe(true);
    expect(token.isFirstOfType()).toBe(true);
    expect(token.isLastOfType()).toBe(true);
    expect(token.isLastChild()).toBe(false);
    token = stream.get();
    expect(token.getName()).toBe("p");
    expect(token.isFirstChild()).toBe(false);
    expect(token.isFirstOfType()).toBe(true);
    expect(token.isLastOfType()).toBe(false);
    expect(token.isLastChild()).toBe(false);
    token = stream.get();
    expect(token.getName()).toBe("ul");
    expect(token.isFirstChild()).toBe(false);
    expect(token.isFirstOfType()).toBe(true);
    expect(token.isLastOfType()).toBe(true);
    expect(token.isLastChild()).toBe(false);
    token = stream.get();
    expect(token.getName()).toBe("p");
    expect(token.isFirstChild()).toBe(false);
    expect(token.isFirstOfType()).toBe(false);
    expect(token.isLastOfType()).toBe(true);
    expect(token.isLastChild()).toBe(true);
  });

  it("TokenStream.iterWhile", function(){
    var stream = create_stream();
    stream.iterWhile(function(token){
      return token instanceof Nehan.Tag && token.getName() !== "p";
    });
    var token = stream.get();
    expect(token.getName()).toBe("p");
    expect(token.getContent()).toBe("bar");
  });

  it("TokenStream.skipIf", function(){
    var stream = create_stream();
    stream.skipIf(function(token){
      return token.getName() === "div";
    });
    var token = stream.get();
    expect(token.getName()).toBe("p");
    expect(token.getContent()).toBe("bar");
  });
});

