test("cardinal-counter-alpha", function(){
  var name = "lower-alpha";
  var base = Cardinal.getBaseByName(name);
  var get = function(decimal){
    return Cardinal.getStringByName(name, decimal);
  };
  equal(get(0), "a");
  equal(get(1), "a");
  equal(get(2), "b");
  equal(get(base - 1), "z");
  equal(get(base), "aa");
  equal(get(base + 1), "ab");
  equal(get(base + 2), "ac");
  equal(get(base * 2 - 1), "az");
  equal(get(base * 2), "ba");
  equal(get(base * 2 + 1), "bb");
});

test("cardinal-counter-hiragana", function(){
  var name = "hiragana";
  var base = Cardinal.getBaseByName(name);
  var get = function(decimal){
    return Cardinal.getStringByName(name, decimal);
  };
  equal(get(0), "あ");
  equal(get(1), "あ");
  equal(get(2), "い");
  equal(get(base - 1), "ん");
  equal(get(base), "ああ");
  equal(get(base + 1), "あい");
});

test("cardinal-counter-cjk-ideographic", function(){
  var name = "cjk-ideographic";
  var base = Cardinal.getBaseByName(name);
  var get = function(decimal){
    return Cardinal.getStringByName(name, decimal);
  };
  equal(get(0), "〇");
  equal(get(1), "一");
  equal(get(2), "二");
  equal(get(10), "十");
  equal(get(11), "一一"); // "十一" is true answer, but I don't care.
  equal(get(12), "一二");
  equal(get(13), "一三");
});


