describe("TagAttrs", function(){
  var attrs = new Nehan.TagAttrs("class='foo' id='hoge'");

  it("TagAttrs.hasAttr(class)", function(){
    expect(attrs.hasAttr("class")).toBe(true);
  });

  it("TagAttrs.hasAttr(id)", function(){
    expect(attrs.hasAttr("id")).toBe(true);
  });

  it("TagAttrs.hasClass", function(){
    expect(attrs.hasClass("foo")).toBe(true);
  });
});
