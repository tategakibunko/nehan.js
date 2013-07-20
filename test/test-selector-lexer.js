test("selector-lexer-star", function(){
  var lexer = new SelectorLexer("*");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "*");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-class-1", function(){
  var lexer = new SelectorLexer(".hoge");
  var token;
  
  token = lexer._getNextToken();
  equal(token.className, "hoge");
  equal(token.name, "");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-class-2", function(){
  var lexer = new SelectorLexer("div.hoge");
  var token;
  
  token = lexer._getNextToken();
  equal(token.className, "hoge");
  equal(token.name, "div");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-id-1", function(){
  var lexer = new SelectorLexer("#hoge");
  var token;
  
  token = lexer._getNextToken();
  equal(token.id, "hoge");
  equal(token.name, "");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-id-2", function(){
  var lexer = new SelectorLexer("div#hoge");
  var token;
  
  token = lexer._getNextToken();
  equal(token.id, "hoge");
  equal(token.name, "div");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-1", function(){
  var lexer = new SelectorLexer("h1 h2");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "h1");

  token = lexer._getNextToken();
  equal(token.name, "h2");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-2", function(){
  var lexer = new SelectorLexer("h1>h2");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "h1");

  token = lexer._getNextToken();
  equal(token, ">");

  token = lexer._getNextToken();
  equal(token.name, "h2");

  token = lexer._getNextToken();
  equal(token, null);

  // with extra space
  var lexer = new SelectorLexer("  h1  > h2  ");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "h1");

  token = lexer._getNextToken();
  equal(token, ">");

  token = lexer._getNextToken();
  equal(token.name, "h2");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-3", function(){
  var lexer = new SelectorLexer("h1>h2[class='foo']");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "h1");

  token = lexer._getNextToken();
  equal(token, ">");

  token = lexer._getNextToken();
  equal(token.name, "h2");
  equal(token.attrs[0].left, "class");
  equal(token.attrs[0].op, "=");
  equal(token.attrs[0].right, "foo");

  token = lexer._getNextToken();
  equal(token, null);
});

test("selector-lexer-4", function(){
  var lexer = new SelectorLexer("h1>h2[class='foo']:first-child");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "h1");

  token = lexer._getNextToken();
  equal(token, ">");

  token = lexer._getNextToken();
  equal(token.name, "h2");
  equal(token.attrs[0].left, "class");
  equal(token.attrs[0].op, "=");
  equal(token.attrs[0].right, "foo");
  //equal(token.pseudo,":first-child");

  token = lexer._getNextToken();
  equal(token, null);

  // with extra spaces, pseudo-elements
  var lexer = new SelectorLexer("h1 > h2 [class='foo'] ::first-letter");
  var token;
  
  token = lexer._getNextToken();
  equal(token.name, "h1");

  token = lexer._getNextToken();
  equal(token, ">");

  token = lexer._getNextToken();
  equal(token.name, "h2");
  equal(token.attrs[0].left, "class");
  equal(token.attrs[0].op, "=");
  equal(token.attrs[0].right, "foo");
  //equal(token.pseudo,"::first-letter");

  token = lexer._getNextToken();
  equal(token, null);
});

