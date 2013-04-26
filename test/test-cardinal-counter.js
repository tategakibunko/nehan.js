test("cardinal-counter-alpha", function(){
  var cs = new CardinalCounter(CardinalStrings.get("lower-alpha"));

  equal(cs.getString(0), "a");
  equal(cs.getString(1), "b");
  equal(cs.getString(25), "z");
  equal(cs.getString(26), "aa");
  equal(cs.getString(27), "ab");
  equal(cs.getString(52), "ba");
  equal(cs.getString(53), "bb");
});

test("cardinal-counter-kana", function(){
  var cs = new CardinalCounter(CardinalStrings.get("hiragana"));
  equal(cs.getString(0), "あ");
  equal(cs.getString(1), "い");
  equal(cs.getString(cs.getBase() - 1), "ん");
  equal(cs.getString(cs.getBase()), "ああ");
});

test("cardinal-counter-cjk-ideographic", function(){
  var cs = new CardinalCounter(CardinalStrings.get("cjk-ideographic"));
  equal(cs.getString(0), "一");
  equal(cs.getString(1), "二");
  equal(cs.getString(9), "十");
  equal(cs.getString(10), "一一"); // "十一" is true answer, but I don't care.
  equal(cs.getString(11), "一二");
  equal(cs.getString(12), "一三");
});


