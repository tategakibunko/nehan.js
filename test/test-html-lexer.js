test("html-lexer1", function(){
  var source = "<p>a<p>b<p>c</p></p></p>";
  var lexer = new HtmlLexer(source);
  var token = lexer.get();
  equal(token._type, "tag");
  equal(token.name, "p");
  equal(token.getContentRaw(), "a<p>b<p>c</p></p>");
});

test("html-lexer2", function(){
  var source = "<div>aaa<div>bbb"; // unclosed div
  var lexer = new HtmlLexer(source);
  var token = lexer.get();
  equal(token._type, "tag");
  equal(token.name, "div");
  equal(token.getContentRaw(), "aaa<div>bbb");
});

test("html-lexer3", function(){
  var source = "<section>a<section>b</section><section>c</section></section>";
  var lexer = new HtmlLexer(source);
  var token = lexer.get();
  equal(token.name, "section");
  equal(token.getContentRaw(), "a<section>b</section><section>c</section>");
});