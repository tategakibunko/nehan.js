describe("CssListStyleParser", function(){
  var prop = new Nehan.CssProp("list-style");

  it("CssListStyleParser.formatValue", function(){
    expect(Nehan.CssListStyleParser.formatValue(prop, {
      type:"decimal"
    })).toEqual({
      type:"decimal"
    });
    expect(Nehan.CssListStyleParser.formatValue(prop, {
      type:"decimal",
      position:"inside"
    })).toEqual({
      type:"decimal",
      position:"inside"
    });
    expect(Nehan.CssListStyleParser.formatValue(prop, "square")).toEqual({
      type:"square"
    });
    expect(Nehan.CssListStyleParser.formatValue(prop, "decimal url('hoge.img')")).toEqual({
      type:"decimal",
      image:"url('hoge.img')"
    });
    expect(Nehan.CssListStyleParser.formatValue(prop, "square url('hoge.img') outside")).toEqual({
      type:"square",
      image:"url('hoge.img')",
      position:"outside"
    });
  });

  it("CssListStyleParser.formatValue", function(){
    expect(Nehan.CssListStyleParser.formatValue(new Nehan.CssProp("list-style-type"), "square")).toEqual({
      type:"square"
    });
    expect(Nehan.CssListStyleParser.formatValue(new Nehan.CssProp("list-style-image"), "hoge.png")).toEqual({
      image:"hoge.png"
    });
    expect(Nehan.CssListStyleParser.formatValue(new Nehan.CssProp("list-style-position"), "outside")).toEqual({
      position:"outside"
    });
  });
});
