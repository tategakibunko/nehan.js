describe("SelectorLexer", function(){
  it("E(single selector)", function(){
    var tokens = new Nehan.SelectorLexer("body").getTokens();
    expect(tokens.length).toBe(1);
    expect(tokens[0].name).toBe("body");
  });

  it("E F(descendant combinator)", function(){
    var tokens = new Nehan.SelectorLexer("body p.foo").getTokens();
    //console.log("descendant combinator:%o", tokens);
    expect(tokens.length).toBe(2);
    expect(tokens[0].name).toBe("body");
    expect(tokens[1].name).toBe("p");
    expect(tokens[1].classes.length).toBe(1);
    expect(tokens[1].classes[0]).toBe("foo");
  });

  it("E > F(child combinator)", function(){
    var tokens = new Nehan.SelectorLexer("body > p.foo").getTokens();
    //console.log("child combinator:%o", tokens);
    expect(tokens.length).toBe(3);
    expect(tokens[0].name).toBe("body");
    expect(tokens[1]).toBe(">");
    expect(tokens[2].name).toBe("p");
    expect(tokens[2].classes.length).toBe(1);
    expect(tokens[2].classes[0]).toBe("foo");
  });

  it("E + F(next-sibling combinator)", function(){
    var tokens = new Nehan.SelectorLexer("body + p.foo").getTokens();
    //console.log("next-sibling combinator:%o", tokens);
    expect(tokens.length).toBe(3);
    expect(tokens[0].name).toBe("body");
    expect(tokens[1]).toBe("+");
    expect(tokens[2].name).toBe("p");
    expect(tokens[2].classes.length).toBe(1);
    expect(tokens[2].classes[0]).toBe("foo");
  });

  it("E ~ F(following-sibling combinator)", function(){
    var tokens = new Nehan.SelectorLexer("body ~ p.foo").getTokens();
    console.log("following-sibling combinator:%o", tokens);
    expect(tokens.length).toBe(3);
    expect(tokens[0].name).toBe("body");
    expect(tokens[1]).toBe("~");
    expect(tokens[2].name).toBe("p");
    expect(tokens[2].classes.length).toBe(1);
    expect(tokens[2].classes[0]).toBe("foo");
  });
});
