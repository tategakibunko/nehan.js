describe("Nehan::Color", function(){
  it("Color.setValue, Color.getValue", function(){
    expect(new Nehan.Color("red").getValue()).toBe("ff0000");
    expect(new Nehan.Color("ff0000").getValue()).toBe("ff0000");
    expect(new Nehan.Color("f00").getValue()).toBe("ff0000");
  });

  it("Color.getCssValue", function(){
    expect(new Nehan.Color("red").getCssValue()).toBe("#ff0000");
  });

  it("Color.getCss", function(){
    expect(new Nehan.Color("red").getCss()).toEqual({
      color:"#ff0000"
    });
  });
});
