test("color", function(){
  var color = new Color("azure");
  equal(color.getValueLower(), "f0ffff");
  equal(color.getValueUpper(), "F0FFFF");

  var color = new Color("fff");
  equal(color.getValueLower(), "ffffff");
  equal(color.getValueUpper(), "FFFFFF");
  equal(color.getPaletteValueLower(), "ffffff");
  equal(color.getPaletteValueUpper(), "FFFFFF");

  var color = new Color("f00"); // pure red
  equal(color.getValueLower(), "ff0000");
  equal(color.getPaletteValueLower(), "ff0000");
});

