test("list-token-stream", function(){
  var stream = new ListTagStream("<li>hoge</li><li>hige</li>");
  var token = stream.get();
  equal(token.name, "li");
  equal(token.order, 0);
  equal(token.getContentRaw(), "hoge");

  var token = stream.get();
  equal(token.name, "li");
  equal(token.order, 1);
  equal(token.getContentRaw(), "hige");
});

test("def-list-token-stream", function(){
  var stream = new DefListTagStream("<dt>dt1</dt><dd>dd1</dd><dt>dt2</dt>");
  var token = stream.get();
  equal(token.name, "dt");
  equal(token.getContentRaw(), "dt1");

  var token = stream.get();
  equal(token.name, "dd");
  equal(token.getContentRaw(), "dd1");

  var token = stream.get();
  equal(token.name, "dt");
  equal(token.getContentRaw(), "dt2");
});

