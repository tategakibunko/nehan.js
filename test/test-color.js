test("color", function(){
  var color = new Color("azure");
  equal(color.getValue(), "f0ffff");

  var color = new Color("fff");
  equal(color.getValue(), "ffffff");

  var color = new Color("f00"); // pure red
  equal(color.getValue(), "ff0000");
});

