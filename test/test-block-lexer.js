test("block-lexer1", function(){
  var lexer = new BlockLexer("aaa<p>bbb</p>ccc");
  var token;
  token = lexer.get();
  ok(token instanceof Text);
  equal(token.value, "aaa");

  token = lexer.get();
  ok(token instanceof Tag);
  equal(token.getContentRaw(), "bbb");

  token = lexer.get();
  ok(token instanceof Text);
  equal(token.value, "ccc");
});

test("block-lexer2", function(){
  var lexer = new BlockLexer("<p>bbb</p><img src='hoge' />ccc<div class='hogeU>ddd</div><span>hogehige</span>hahaha");
  var token;
  token = lexer.get();
  ok(token instanceof Tag);
  equal(token.getContentRaw(), "bbb");

  token = lexer.get();
  ok(token instanceof Text);
  equal(token.getValue(), "<img src='hoge' />");

  token = lexer.get();
  ok(token instanceof Text);
  equal(token.getValue(), "ccc");

  token = lexer.get();
  ok(token instanceof Tag);
  equal(token.getName(), "div");
  equal(token.getContentRaw(), "ddd");

  token = lexer.get();
  ok(token instanceof Text);
  equal(token.getValue(), "<span>hogehige</span>");

  token = lexer.get();
  ok(token instanceof Text);
  equal(token.getValue(), "hahaha");
});

