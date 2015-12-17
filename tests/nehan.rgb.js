describe("Rgb", function(){
  var rgb = new Nehan.Rgb("ff70aa");
  var rgb2 = new Nehan.Rgb("8f2");

  it("Rgb.getRed", function(){
    expect(rgb.getRed()).toBe(15*16+15);
    expect(rgb2.getRed()).toBe(8*16+8);
  });

  it("Rgb.getGreen", function(){
    expect(rgb.getGreen()).toBe(7*16);
    expect(rgb2.getGreen()).toBe(15*16+15);
  });

  it("Rgb.getBlue", function(){
    expect(rgb.getBlue()).toBe(10*16+10);
    expect(rgb2.getBlue()).toBe(2*16+2);
  });

  it("Rgb.getColorValue", function(){
    expect(rgb.getColorValue()).toBe("ff70aa");
    expect(rgb2.getColorValue()).toBe("88ff22");
  });
});
