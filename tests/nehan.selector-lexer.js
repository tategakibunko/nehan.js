describe("SelectorLexer", function(){
  it("E(simple selector)", function(){
    var tokens = new Nehan.SelectorLexer("body").getTokens();
    expect(tokens.length).toBe(1);
    expect(tokens[0].name).toBe("body");
  });

  it("E.foo.bar(compound selector)", function(){
    var tokens = new Nehan.SelectorLexer("p.foo.bar").getTokens();
    //console.log("compound selector:%o", tokens);
    expect(tokens.length).toBe(1);
    expect(tokens[0].name).toBe("p");
    expect(tokens[0].classes.length).toBe(2);
    expect(tokens[0].classes[0]).toBe("bar"); // classes are sorted
    expect(tokens[0].classes[1]).toBe("foo");
  });

  // note that space is a combinator, so this is not compound selector.
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
    //console.log("following-sibling combinator:%o", tokens);
    expect(tokens.length).toBe(3);
    expect(tokens[0].name).toBe("body");
    expect(tokens[1]).toBe("~");
    expect(tokens[2].name).toBe("p");
    expect(tokens[2].classes.length).toBe(1);
    expect(tokens[2].classes[0]).toBe("foo");
  });

  it("attr selector", function(){
    var tokens = new Nehan.SelectorLexer("a[target='_blank'][href='#']").getTokens();
    //console.log("attr selector:%o", tokens);
    expect(tokens.length).toBe(1);
    expect(tokens[0].name).toBe("a");
    expect(tokens[0].attrs.length).toBe(2);
    expect(tokens[0].attrs[0].left).toBe("target");
    expect(tokens[0].attrs[0].op).toBe("=");
    expect(tokens[0].attrs[0].right).toBe("_blank");
    expect(tokens[0].attrs[1].left).toBe("href");
    expect(tokens[0].attrs[1].op).toBe("=");
    expect(tokens[0].attrs[1].right).toBe("#");
  });

  it("pseudo-class", function(){
    var tokens = new Nehan.SelectorLexer("a:first-child").getTokens();
    //console.log("pseudo-class:%o", tokens);
    expect(tokens.length).toBe(1);
    expect(tokens[0].name).toBe("a");
    expect(tokens[0].pseudo.name).toBe(":first-child");
    expect(tokens[0].pseudo.args.length).toBe(0);
  });

  it("pseudo-class with args", function(){
    var tokens = new Nehan.SelectorLexer("a:not(.foo, .bar, .baz)").getTokens();
    //console.log("pseudo-class with args:%o", tokens);
    expect(tokens.length).toBe(1);
    expect(tokens[0].name).toBe("a");
    expect(tokens[0].pseudo.name).toBe(":not");
    expect(tokens[0].pseudo.args.length).toBe(3);
    expect(tokens[0].pseudo.args[0] instanceof Nehan.CompoundSelector).toBe(true);
    expect(tokens[0].pseudo.args[1] instanceof Nehan.CompoundSelector).toBe(true);
    expect(tokens[0].pseudo.args[2] instanceof Nehan.CompoundSelector).toBe(true);
  });
});
