describe("TokenStream", function(){
  var create_stream = function(){
    return new Nehan.TokenStream({
      lexer:new Nehan.HtmlLexer("<div><b>foo</b></div><p>bar</p><ul><li>baz</li></ul><p>hoge</p>")
    });
  };

  it("check stream functionality for html lexer", function(){
    var stream = create_stream();
    var token;
    // last-child and last-of-type is set by Nehan.Style.
    expect(stream.isHead()).toBe(true);
    expect(stream.hasNext()).toBe(true);
    token = stream.get();
    expect(token.getName()).toBe("div");
    expect(token.isFirstChild()).toBe(true);
    expect(token.isFirstOfType()).toBe(true);
    token = stream.get();
    expect(token.getName()).toBe("p");
    expect(token.isFirstChild()).toBe(false);
    expect(token.isFirstOfType()).toBe(true);
    token = stream.get();
    expect(token.getName()).toBe("ul");
    expect(token.isFirstChild()).toBe(false);
    expect(token.isFirstOfType()).toBe(true);
    token = stream.get();
    expect(token.getName()).toBe("p");
    expect(token.isFirstChild()).toBe(false);
    expect(token.isFirstOfType()).toBe(false);
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
});

