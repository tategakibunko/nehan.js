describe("Nehan::CssFontParser", function(){
  it("CssFontParser.formatValue(attr prop)", function(){
    expect(Nehan.CssFontParser.formatValue(new Nehan.CssProp("font-family"), "monospace")).toEqual({
      family:"monospace"
    });
  });

  // assume that all css-string is already normalized by 'Nehan.Utils.formatCssValueStr'
  var shorthands = [
    "14px Georgia,serif",
    "14px/1.4 Georgia,serif",
    "italic lighter 14px/1.4 Georgia,serif",
    "italic small-caps lighter 14px/1.4 Georgia,serif"
  ];

  // 14px Georgia,serif;
  it("CssFontParser.formatValue(" + shorthands[0] + ")", function(){
    var prop = new Nehan.CssProp("font");
    expect(Nehan.CssFontParser.formatValue(prop, shorthands[0])).toEqual({
      size:"14px",
      family:"Georgia,serif"
    });
  });

  // 14px/1.4 Georgia,serif;
  it("CssFontParser.formatValue(" + shorthands[1] + ")", function(){
    var prop = new Nehan.CssProp("font");
    expect(Nehan.CssFontParser.formatValue(prop, shorthands[1])).toEqual({
      size:"14px",
      "line-height":"1.4",
      family:"Georgia,serif"
    });
  });

  // italic lighter 14px/1.4 Georgia,serif;
  it("CssFontParser.formatValue(" + shorthands[2] + ")", function(){
    var prop = new Nehan.CssProp("font");
    expect(Nehan.CssFontParser.formatValue(prop, shorthands[2])).toEqual({
      style:"italic",
      weight:"lighter",
      size:"14px",
      "line-height":"1.4",
      family:"Georgia,serif"
    });
  });

  // italic small-caps lighter 14px/1.4 Georgia,serif;
  it("CssFontParser.formatValue(" + shorthands[3] + ")", function(){
    var prop = new Nehan.CssProp("font");
    expect(Nehan.CssFontParser.formatValue(prop, shorthands[3])).toEqual({
      style:"italic",
      variant:"small-caps",
      weight:"lighter",
      size:"14px",
      "line-height":"1.4",
      family:"Georgia,serif"
    });
  });
});
