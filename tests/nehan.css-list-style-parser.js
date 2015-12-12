describe("Nehan::CssListStyleParser", function(){
  it("Nehan.parseSet", function(){
    expect(Nehan.CssListStyleParser.parseSet({
      type:"decimal"
    })).toEqual({
      type:"decimal"
    });
    expect(Nehan.CssListStyleParser.parseSet({
      type:"decimal",
      position:"inside"
    })).toEqual({
      type:"decimal",
      position:"inside"
    });
    expect(Nehan.CssListStyleParser.parseSet("square")).toEqual({
      type:"square"
    });
    expect(Nehan.CssListStyleParser.parseSet("decimal url('hoge.img')")).toEqual({
      type:"decimal",
      image:"url('hoge.img')"
    });
    expect(Nehan.CssListStyleParser.parseSet("square url('hoge.img') outside")).toEqual({
      type:"square",
      image:"url('hoge.img')",
      position:"outside"
    });
  });
  it("Nehan.formatValue", function(){
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
