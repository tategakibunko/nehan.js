describe("PseudoSelector", function(){
  var ctx = Nehan.createRootContext().setStyle("div::first-letter", {
    fontSize:"larger"
  });
  var div = ctx.createChildStyle(new Nehan.Tag("div", "foo"));

  it("PseudoSelector.hasPseudoElement", function(){
    expect(new Nehan.PseudoSelector("::before").hasPseudoElement()).toBe(true);
    expect(new Nehan.PseudoSelector("::after").hasPseudoElement()).toBe(true);
    expect(new Nehan.PseudoSelector("::first-line").hasPseudoElement()).toBe(true);
    expect(new Nehan.PseudoSelector("::first-letter").hasPseudoElement()).toBe(true);
    expect(new Nehan.PseudoSelector("::marker").hasPseudoElement()).toBe(true);
    expect(new Nehan.PseudoSelector(":first-child").hasPseudoElement()).toBe(false);
  });

  it("PseudoSelector.test", function(){
    expect(new Nehan.PseudoSelector("::first-letter").test(div)).toBe(true);
  });

  it("PseudoSelector.test", function(){
    expect(new Nehan.PseudoSelector("::first-letter").test(div)).toBe(true);
  });

  it("should not match if markup is empty", function(){
    var div2 = ctx.createChildStyle(new Nehan.Tag("div"));
    expect(new Nehan.PseudoSelector("::first-letter").test(div2)).toBe(false);
  });
});
