test("token-stream", function(){
  var stream = new TokenStream("あいうえお<blockquote>かきくけこ</blockquote>");
  var token = stream.peek();
  equal(token.data, "あ");
  stream.next();

  var token = stream.peek();
  equal(token.data, "い");
  stream.next();

  var token = stream.peek();
  equal(token.data, "う");
  stream.next();

  var token = stream.peek();
  equal(token.data, "え");
  stream.next();

  var token = stream.peek();
  equal(token.data, "お");
  stream.next();
});

test("token-stream-kerning", function(){
  var stream = new TokenStream("「「あ。。」」");
  var token = stream.get();
  equal(token.data, "「");

  var token = stream.get();
  equal(token.data, "「");

  var token = stream.get();
  equal(token.data, "あ");

  var token = stream.get();
  equal(token.data, "。");

  var token = stream.get();
  equal(token.data, "。");

  var token = stream.get();
  equal(token.data, "」");

  var token = stream.get();
  equal(token.data, "」");
});

