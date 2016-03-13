describe("PseudoElementSelector", function(){
  var ctx = Nehan.createRootContext().setStyle("div::first-letter", {
    fontSize:"larger"
  });
  var div = ctx.createChildStyle(new Nehan.Tag("div", "foo"));

  it("PseudoElementSelector.test", function(){
    expect(new Nehan.PseudoElementSelector("::first-letter").test(div)).toBe(true);
  });

  it("PseudoElementSelector.test", function(){
    expect(new Nehan.PseudoElementSelector("::first-letter").test(div)).toBe(true);
  });

  it("should not match if markup is empty", function(){
    var div2 = ctx.createChildStyle(new Nehan.Tag("div"));
    expect(new Nehan.PseudoElementSelector("::first-letter").test(div2)).toBe(false);
  });
});
