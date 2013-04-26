test("lexer1", function(){
  var source = "<p>a<p>b<p>c</p></p></p>";
  var lexer = new Lexer(source);
  var token = lexer.get();
  equal(token._type, "tag");
  equal(token.name, "p");
  equal(token.content, "a<p>b<p>c</p></p>");
});

test("lexer2", function(){
  var source = "<div>aaa<div>bbb"; // unclosed div
  var lexer = new Lexer(source);
  var token = lexer.get();
  equal(token._type, "tag");
  equal(token.name, "div");
  equal(token.content, "aaa<div>bbb");
});

test("lexer3", function(){
  var source = "<section>a<section>b</section><section>c</section></section>";
  var lexer = new Lexer(source);
  var token = lexer.get();
  equal(token.name, "section");
  equal(token.content, "a<section>b</section><section>c</section>");
});