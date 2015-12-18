describe("TagAttrs", function(){
  var attrs = new Nehan.TagAttrs("class='foo' id='hoge'");
  var data_attrs = new Nehan.TagAttrs("data-name='taro' data-age=10");

  it("TagAttrs.hasAttr(class)", function(){
    expect(attrs.hasAttr("class")).toBe(true);
  });

  it("TagAttrs.hasAttr(id)", function(){
    expect(attrs.hasAttr("id")).toBe(true);
  });

  it("TagAttrs.hasClass", function(){
    expect(attrs.hasClass("foo")).toBe(true);
  });

  it("TagAttrs.getAttr(class)", function(){
    expect(attrs.getAttr("class")).toEqual(["foo"]);
  });

  it("TagAttrs.getAttr(id)", function(){
    expect(attrs.getAttr("id")).toBe("hoge");
  });

  it("TagAttr.getData", function(){
    expect(data_attrs.getData("name")).toBe("taro");
    expect(data_attrs.getData("age")).toBe("10");
  });
});
