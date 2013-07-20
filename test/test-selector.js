test("selector-spec", function(){
  var selector = new Selector("h1");
  equal(selector.getSpec(), 1);
});

test("selector-single", function(){
  var selector = new Selector("h1");
  var h1 = new Tag("<h1>");
  equal(selector.test(h1), true);
});

test("selector-descend-1", function(){
  var selector = new Selector("h1 h2");
  var h2 = new Tag("<h2>");
  equal(selector.test(h2), false);

  var h1 = new Tag("<h1>");
  h2.inherit(h1);
  equal(selector.test(h2), true);
});

test("selector-descend-2", function(){
  var selector = new Selector("h1 h2");
  var h2 = new Tag("<h2>");
  equal(selector.test(h2), false);

  var div = new Tag("<div>");
  h2.inherit(div);
  equal(selector.test(h2), false);

  var h1 = new Tag("<h1>");
  div.inherit(h1);
  equal(selector.test(h2), true);
});

test("selector-child-1", function(){
  var selector = new Selector("h1>h2");
  var h2 = new Tag("<h2>");
  equal(selector.test(h2), false);

  var h1 = new Tag("<h1>");
  h2.inherit(h1);
  equal(selector.test(h2), true);
});

test("selector-child-2", function(){
  var selector = new Selector("h1>h2");
  var h2 = new Tag("<h2>");
  equal(selector.test(h2), false);

  var div = new Tag("<div>");
  h2.inherit(div);
  equal(selector.test(h2), false);

  var h1 = new Tag("<h1>");
  div.inherit(h1);
  equal(selector.test(h2), false);
});

test("selector-child-3", function(){
  var selector = new Selector("h1>h2>h3");
  var h3 = new Tag("<h3>");
  equal(selector.test(h3), false);

  var h2 = new Tag("<h2>");
  h3.inherit(h2);
  equal(selector.test(h3), false);

  var h1 = new Tag("<h1>");
  h2.inherit(h1);
  equal(selector.test(h3), true);
});

test("selector-adj-sibling-1", function(){
  var selector = new Selector("ul+p");
  var div = new Tag("<div>");
  var ul = new Tag("<ul>");
  var p = new Tag("<p>");

  ul.inherit(div);
  equal(selector.test(p), false);

  p.inherit(div);
  equal(selector.test(p), true);
});

test("selector-gen-sibling-1", function(){
  var selector = new Selector("ul~p");
  var div = new Tag("<div>");
  var ul = new Tag("<ul>");
  var p = new Tag("<p>");
  var p2 = new Tag("<p>");

  ul.inherit(div);
  p.inherit(div);
  p2.inherit(div);

  equal(selector.test(p), true);
  equal(selector.test(p2), true);
});

test("selector-first-child", function(){
  var selector = new Selector("li:first-child");
  var ul = new Tag("<ul>");
  var list1 = new Tag("<li>");
  var list2 = new Tag("<li>");
  var list3 = new Tag("<li>");
  list1.inherit(ul);
  list2.inherit(ul);
  list3.inherit(ul);

  equal(selector.test(list1), true);
  equal(selector.test(list2), false);
  equal(selector.test(list3), false);
});

test("selector-last-child", function(){
  var selector = new Selector("li:last-child");
  var ul = new Tag("<ul>");
  var list1 = new Tag("<li>");
  var list2 = new Tag("<li>");
  var list3 = new Tag("<li>");
  list1.inherit(ul);
  list2.inherit(ul);
  list3.inherit(ul);

  equal(selector.test(list1), false);
  equal(selector.test(list2), false);
  equal(selector.test(list3), true);
});

test("selector-xxx-of-type", function(){
  var selector;
  var div = new Tag("<div>");
  var ul1 = new Tag("<ul>");
  var p1 = new Tag("<p>");
  var p2 = new Tag("<p>");
  var p3 = new Tag("<p>");
  var ul2 = new Tag("<ul>");
  ul1.inherit(div);
  p1.inherit(div);
  p2.inherit(div);
  p3.inherit(div);
  ul2.inherit(div);

  selector = new Selector("p:first-of-type");
  equal(selector.test(p1), true);
  equal(selector.test(p2), false);
  equal(selector.test(p3), false);
  selector = new Selector("ul:first-of-type");
  equal(selector.test(ul1), true);
  equal(selector.test(ul2), false);
  selector = new Selector("p:last-of-type");
  equal(selector.test(p1), false);
  equal(selector.test(p2), false);
  equal(selector.test(p3), true);
  selector = new Selector("ul:last-of-type");
  equal(selector.test(ul1), false);
  equal(selector.test(ul2), true);
});

test("selector-pseudo-element", function(){
  var first_letter = new Selector("div::first-letter");
  var first_line = new Selector("div::first-line");
  var before = new Selector("div::before");
  var after = new Selector("div::after");
  var div;

  div = new Tag("<div>");
  equal(first_letter.test(div), false);
  equal(first_line.test(div), false);
  equal(before.test(div), true);
  equal(after.test(div), true);

  div = new Tag("<div>", "dummy");
  equal(first_letter.test(div), true);
  equal(first_line.test(div), true);
  equal(before.test(div), true);
  equal(after.test(div), true);
});

test("selector-has-pseudo-element", function(){
  var first_letter = new Selector("div::first-letter");
  equal(first_letter.hasPseudoElement("first-letter"), true);
  equal(first_letter.isPseudoElement(), true);
});

