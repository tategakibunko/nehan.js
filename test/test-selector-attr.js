test("selector-attr-expr-1", function(){
  var sattr = new SelectorAttr("[class]");
  equal(sattr.left, "class");
  equal(sattr.op, null);
  equal(sattr.right, null);
});

test("selector-attr-expr-2", function(){
  var sattr = new SelectorAttr("[class='foo']");
  equal(sattr.left, "class");
  equal(sattr.op, "=");
  equal(sattr.right, "foo");
});

test("selector-attr-expr-3", function(){
  var sattr = new SelectorAttr("[class^='foo']");
  equal(sattr.left, "class");
  equal(sattr.op, "^=");
  equal(sattr.right, "foo");
});

test("selector-attr-expr-4", function(){
  var sattr = new SelectorAttr("[class|='foo']");
  equal(sattr.left, "class");
  equal(sattr.op, "|=");
  equal(sattr.right, "foo");
});

test("selector-attr-expr-5", function(){
  var sattr = new SelectorAttr("[class~='foo bar']");
  equal(sattr.left, "class");
  equal(sattr.op, "~=");
  equal(sattr.right, "foo bar");
});

test("selector-attr-equal", function(){
  var sattr = new SelectorAttr("[class='foo']");
  equal(sattr.test(new Tag("<p class='foo'>")), true);
  equal(sattr.test(new Tag("<p class='bar'>")), false);
});

test("selector-attr-caret", function(){
  var sattr = new SelectorAttr("[class^='bar']");
  equal(sattr.test(new Tag("<p class='bar'>")), true);
  equal(sattr.test(new Tag("<p class='barbar'>")), true);
  equal(sattr.test(new Tag("<p class='foobar'>")), false);
});

test("selector-attr-dollar", function(){
  var sattr = new SelectorAttr("[class$='bar']");
  equal(sattr.test(new Tag("<p class='bar'>")), true);
  equal(sattr.test(new Tag("<p class='barbar'>")), true);
  equal(sattr.test(new Tag("<p class='foobar'>")), true);
  equal(sattr.test(new Tag("<p class='barfoo'>")), false);
});

test("selector-attr-pipe", function(){
  var sattr = new SelectorAttr("[class|='bar']");
  equal(sattr.test(new Tag("<p class='bar'>")), true);
  equal(sattr.test(new Tag("<p class='bar-foo'>")), true);
  equal(sattr.test(new Tag("<p class='foo'>")), false);
});

test("selector-attr-tilde", function(){
  var sattr = new SelectorAttr("[class~='bar']");
  equal(sattr.test(new Tag("<p class='foo bar'>")), true);
  equal(sattr.test(new Tag("<p class='foo hoge'>")), false);
});
