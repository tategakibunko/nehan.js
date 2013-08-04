test("block-token-stream1", function(){
  var token;
  var stream = new BlockTokenStream("aaaあ<p>bbb</p>いccc<span>hige</span>hahaha");

  var stream2 = stream.get(); // inline elements are returned as inline-token-stream
  ok(stream2 instanceof TokenStream);
  token = stream2.get();
  ok(token instanceof Word);
  token = stream2.get();
  ok(token instanceof Char);

  token = stream.get();
  ok(token instanceof Tag);
  equal(token.getContentRaw(), "bbb");

  var stream3 = stream.get();
  ok(stream3 instanceof TokenStream);

  token = stream3.get();
  ok(token instanceof Char);

  token = stream3.get();
  ok(token instanceof Word);

  token = stream3.get();
  ok(token instanceof Tag);
  equal(token.getName(), "span");
  equal(token.getContentRaw(), "hige");

  token = stream3.get();
  ok(token instanceof Word);
});

