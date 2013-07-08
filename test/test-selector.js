test("selector-class", function(){
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

  selector = new Selector("div .hoge");
  equal(selector.test("div p.hoge"), true);
  equal(selector.test("div ul li.hoge"), true);

  selector = new Selector(".nehan-drop-caps :first-letter");
  equal(selector.test("p.nehan-drop-caps :first-letter"), true);
});

test("selector-id", function(){
  var selector;
  selector = new Selector("#hoge", {border:1});
  equal(selector.test("#hoge"), true);
  equal(selector.test("p#hoge"), true);
  equal(selector.test("p#hige"), false);

  selector = new Selector("p#hoge", {border:1});
  equal(selector.test("#hoge"), false);
  equal(selector.test("p#hoge"), true);

  selector = new Selector("#hoge div", {border:1});
  equal(selector.test("#hoge"), false);
  equal(selector.test("#hoge div"), true);
  equal(selector.test("p#hoge div"), true);
  equal(selector.test("p#hoge nav div"), true);

  selector = new Selector("div #hoge");
  equal(selector.test("div p#hoge"), true);
  equal(selector.test("div ul li#hoge"), true);

  selector = new Selector("div#hoge");
  equal(selector.test("div#hoge"), true);
  equal(selector.test("div p#hoge"), false);
  equal(selector.test("div ul li#hoge"), false);
});

test("test-selector-merged", function(){
  var engine = Nehan.setup({
    test:true
  });
  engine.setStyle(".hoge", {
    "font-size":"16px"
  });
  engine.setStyle("#foo", {
    "font-size":"18px"
  });
  var style = engine.Selectors.getMergedValue(["p.hoge", "p#foo"]);
  equal(style["font-size"], "18px"); // id selector wins
});

