test("list-token-stream", function(){
  var stream = new ListTagStream("<li>hoge</li><li>hige</li>");
  var token = stream.get();
  equal(token.name, "li");
  equal(token.order, 0);
  equal(token.content, "hoge");

  var token = stream.get();
  equal(token.name, "li");
  equal(token.order, 1);
  equal(token.content, "hige");
});

test("def-list-token-stream", function(){
  var stream = new DefListTagStream("<dt>dt1</dt><dd>dd1</dd><dt>dt2</dt>");
  var token = stream.get();
  equal(token.name, "dt");
  equal(token.content, "dt1");

  var token = stream.get();
  equal(token.name, "dd");
  equal(token.content, "dd1");

  var token = stream.get();
  equal(token.name, "dt");
  equal(token.content, "dt2");
});

