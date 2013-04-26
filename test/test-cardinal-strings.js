test("test-cardinals", function(){
  var lower_alpha = CardinalStrings.get("lower-alpha");
  equal(lower_alpha.getBase(), 26);
  equal(lower_alpha.getChar(0), "a");
  equal(lower_alpha.getChar(1), "b");
  equal(lower_alpha.getChar(25), "z");
  
  var lower_latin = CardinalStrings.get("lower-latin");
  equal(lower_latin.getBase(), 26);
  equal(lower_latin.getChar(0), "a");
  equal(lower_latin.getChar(1), "b");
  equal(lower_latin.getChar(25), "z");

  var upper_alpha = CardinalStrings.get("upper-alpha");
  equal(upper_alpha.getBase(), 26);
  equal(upper_alpha.getChar(0), "A");
  equal(upper_alpha.getChar(1), "B");
  equal(upper_alpha.getChar(25), "Z");

  var upper_latin = CardinalStrings.get("upper-latin");
  equal(upper_latin.getBase(), 26);
  equal(upper_latin.getChar(0), "A");
  equal(upper_latin.getChar(1), "B");
  equal(upper_latin.getChar(25), "Z");

  var cjk = CardinalStrings.get("cjk-ideographic");
  equal(cjk.getBase(), 10);
  equal(cjk.getChar(0), "一");
  equal(cjk.getChar(1), "二");
  equal(cjk.getChar(9), "十");
});
