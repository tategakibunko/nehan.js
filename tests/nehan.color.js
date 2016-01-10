describe("Color", function(){
  it("Color.setValue, Color.getValue", function(){
    expect(new Nehan.Color("red").getValue()).toBe("red");
    expect(new Nehan.Color("#ff0000").getValue()).toBe("#ff0000");
    expect(new Nehan.Color("#f00").getValue()).toBe("#f00");
  });

  it("Color.getCssValue", function(){
    expect(new Nehan.Color("red").getCssValue()).toBe("red");
  });

  it("Color.getCss", function(){
    expect(new Nehan.Color("red").getCss()).toEqual({
      color:"red"
    });
  });
});
