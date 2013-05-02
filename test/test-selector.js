test("test", function(){
  var selector;
  selector = new Selector("div", {border:1});
  equal(selector.test("div"), true);
  equal(selector.test("divp"), false);

  selector = new Selector(".hoge", {border:1});
  equal(selector.test(".hoge"), true);
  equal(selector.test("p.hoge"), true);
  equal(selector.test("p.hige"), false);

  selector = new Selector("p.hoge", {border:1});
  equal(selector.test(".hoge"), false);
  equal(selector.test("p.hoge"), true);

  selector = new Selector(".hoge div", {border:1});
  equal(selector.test(".hoge"), false);
  equal(selector.test(".hoge div"), true);
  equal(selector.test("p.hoge div"), true);
  equal(selector.test("p.hoge nav div"), true);
});
