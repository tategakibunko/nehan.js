test("selector", function(){
  var selector;
  selector = new Selector("div", {border:1});
  equal(selector.match("div"), true);
  equal(selector.match("divp"), false);

  selector = new Selector(".hoge", {border:1});
  equal(selector.match(".hoge"), true);
  equal(selector.match("p.hoge"), true);
  equal(selector.match("p.hige"), false);

  selector = new Selector("p.hoge", {border:1});
  equal(selector.match(".hoge"), false);
  equal(selector.match("p.hoge"), true);

  selector = new Selector(".hoge div", {border:1});
  equal(selector.match(".hoge"), false);
  equal(selector.match(".hoge div"), true);
  equal(selector.match("p.hoge div"), true);
  equal(selector.match("p.hoge nav div"), true);
});
