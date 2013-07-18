test("selector-lexer-star", function(){
  var lexer = new SelectorLexer("*");
  var token;
  
  token = lexer.get();
  equal(token.name, "*");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-class-1", function(){
  var lexer = new SelectorLexer(".hoge");
  var token;
  
  token = lexer.get();
  equal(token.className, "hoge");
  equal(token.name, "");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-class-2", function(){
  var lexer = new SelectorLexer("div.hoge");
  var token;
  
  token = lexer.get();
  equal(token.className, "hoge");
  equal(token.name, "div");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-id-1", function(){
  var lexer = new SelectorLexer("#hoge");
  var token;
  
  token = lexer.get();
  equal(token.id, "hoge");
  equal(token.name, "");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-id-2", function(){
  var lexer = new SelectorLexer("div#hoge");
  var token;
  
  token = lexer.get();
  equal(token.id, "hoge");
  equal(token.name, "div");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-1", function(){
  var lexer = new SelectorLexer("h1 h2");
  var token;
  
  token = lexer.get();
  equal(token.name, "h1");

  token = lexer.get();
  equal(token.name, "h2");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-2", function(){
  var lexer = new SelectorLexer("h1>h2");
  var token;
  
  token = lexer.get();
  equal(token.name, "h1");

  token = lexer.get();
  equal(token, ">");

  token = lexer.get();
  equal(token.name, "h2");

  token = lexer.get();
  equal(token, null);

  // with extra space
  var lexer = new SelectorLexer("  h1  > h2  ");
  var token;
  
  token = lexer.get();
  equal(token.name, "h1");

  token = lexer.get();
  equal(token, ">");

  token = lexer.get();
  equal(token.name, "h2");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-3", function(){
  var lexer = new SelectorLexer("h1>h2[class='foo']");
  var token;
  
  token = lexer.get();
  equal(token.name, "h1");

  token = lexer.get();
  equal(token, ">");

  token = lexer.get();
  equal(token.name, "h2");
  equal(token.attr.left, "class");
  equal(token.attr.op, "=");
  equal(token.attr.right, "foo");

  token = lexer.get();
  equal(token, null);
});

test("selector-lexer-4", function(){
  var lexer = new SelectorLexer("h1>h2[class='foo']:first-child");
  var token;
  
  token = lexer.get();
  equal(token.name, "h1");

  token = lexer.get();
  equal(token, ">");

  token = lexer.get();
  equal(token.name, "h2");
  equal(token.attr.left, "class");
  equal(token.attr.op, "=");
  equal(token.attr.right, "foo");
  //equal(token.pseudo,":first-child");

  token = lexer.get();
  equal(token, null);

  // with extra spaces, pseudo-elements
  var lexer = new SelectorLexer("h1 > h2 [class='foo'] ::first-letter");
  var token;
  
  token = lexer.get();
  equal(token.name, "h1");

  token = lexer.get();
  equal(token, ">");

  token = lexer.get();
  equal(token.name, "h2");
  equal(token.attr.left, "class");
  equal(token.attr.op, "=");
  equal(token.attr.right, "foo");
  //equal(token.pseudo,"::first-letter");

  token = lexer.get();
  equal(token, null);
});

