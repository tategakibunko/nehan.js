describe("Font", function(){
  it("Font.isBold", function(){
    expect(new Nehan.Font({weight:"bold"}).isBold()).toBe(true);
    expect(new Nehan.Font({weight:"lighter"}).isBold()).toBe(false);
  });

  it("Font.inherit", function(){
    var parent_font = new Nehan.Font({
      size:10,
      family:"monospace",
      style:"italic",
      variant:"small-caps"
    });
    var font = new Nehan.Font({size:20});
    font.inherit(parent_font);
    expect(font.size).toBe(20);
    expect(font.family).toBe("monospace");
    expect(font.style).toBe("italic");
    expect(font.variant).toBe("small-caps");
  });
});
