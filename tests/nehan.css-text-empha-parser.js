describe("CssTextEmphaParser", function(){
  var prop = new Nehan.CssProp("text-emphasis");

  it("CssTextEmphaParser.formatValue(direct attr)", function(){
    expect(Nehan.CssTextEmphaParser.formatValue(new Nehan.CssProp("text-emphasis-style"), "filled circle")).toEqual({style:"filled circle"});
    expect(Nehan.CssTextEmphaParser.formatValue(new Nehan.CssProp("text-emphasis-position"), "over right")).toEqual({
      position:{
	hori:"over",
	vert:"right"
      }
    });
  });

  it("CssTextEmphaParser.formatValue(shorthand)", function(){
    expect(Nehan.CssTextEmphaParser.formatValue(prop, "none")).toEqual({});
    expect(Nehan.CssTextEmphaParser.formatValue(prop, "filled")).toEqual({style:"filled"});
    expect(Nehan.CssTextEmphaParser.formatValue(prop, "dot")).toEqual({style:"dot"});
    expect(Nehan.CssTextEmphaParser.formatValue(prop, "'foo'")).toEqual({style:"'foo'"});
    expect(Nehan.CssTextEmphaParser.formatValue(prop, "filled dot 'foo'")).toEqual({style:"'foo'"});
    expect(Nehan.CssTextEmphaParser.formatValue(prop, "filled dot red")).toEqual({
      style:"filled dot",
      color:"red"
    });
  });

  it("CssTextEmphaParser.formatValue(object)", function(){
    expect(Nehan.CssTextEmphaParser.formatValue(prop, {style:"filled circle"})).toEqual({style:"filled circle"});
  });
});
