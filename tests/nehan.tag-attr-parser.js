describe("TagAttrParser", function(){
  it("TagAttrParser.parse(simple)", function(){
    expect(Nehan.TagAttrParser.parse("class='foo' id='hoge'")).toEqual({
      class:"foo",
      id:"hoge"
    });
  });

  it("TagAttrParser.parse(with single attr)", function(){
    expect(Nehan.TagAttrParser.parse("class='foo' id='hoge' checked")).toEqual({
      class:"foo",
      id:"hoge",
      checked:true
    });
  });
});
