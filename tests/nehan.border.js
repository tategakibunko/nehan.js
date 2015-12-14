describe("Border", function(){
  var border = new Nehan.Border();
  var flow = Nehan.BoxFlows.getByName("lr-tb");

  it("BorderStyle.getDirProp", function(){
    expect(border.getDirProp("top")).toBe("border-top-width");
    expect(border.getDirProp("bottom")).toBe("border-bottom-width");
    expect(border.getDirProp("left")).toBe("border-left-width");
    expect(border.getDirProp("right")).toBe("border-right-width");
  });
});
