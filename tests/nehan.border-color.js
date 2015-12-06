describe("Nehan.BorderColor", function(){
  it("BorderColor::setColor(lr-tb)", function(){
    var flow = Nehan.BoxFlows.getByName("lr-tb");
    var border = new Nehan.BorderColor();
    border.setColor(flow, {
      before:"FF0000",
      after:"00FF00",
      start:"0000FF",
      end:"FFFF00"
    });
    expect(border.top.value).toEqual(new Nehan.Color("FF0000").value);
    expect(border.bottom.value).toEqual(new Nehan.Color("00FF00").value);
    expect(border.left.value).toEqual(new Nehan.Color("0000FF").value);
    expect(border.right.value).toEqual(new Nehan.Color("FFFF00").value);
  });

  it("BorderColor::setColor(tb-rl)", function(){
    var flow = Nehan.BoxFlows.getByName("tb-rl");
    var border = new Nehan.BorderColor();
    border.setColor(flow, {
      before:"FF0000",
      after:"00FF00",
      start:"0000FF",
      end:"FFFF00"
    });
    expect(border.right.value).toEqual(new Nehan.Color("FF0000").value);
    expect(border.left.value).toEqual(new Nehan.Color("00FF00").value);
    expect(border.top.value).toEqual(new Nehan.Color("0000FF").value);
    expect(border.bottom.value).toEqual(new Nehan.Color("FFFF00").value);
  });

  it("BorderColor::getCss", function(){
    var flow = Nehan.BoxFlows.getByName("lr-tb");
    var border = new Nehan.BorderColor();
    border.setColor(flow, {
      before:"FF0000",
      after:"00FF00",
      start:"0000FF",
      end:"FFFF00"
    });

    // note: color value is lowercased
    var css = border.getCss();
    expect(css["border-top-color"]).toBe("#ff0000");
    expect(css["border-bottom-color"]).toBe("#00ff00");
    expect(css["border-left-color"]).toBe("#0000ff");
    expect(css["border-right-color"]).toBe("#ffff00");
  });
});
