test("tag-stack", function(){
  var stack = new TagStack();
  stack.push(new Tag("<span class='nehan-large'>"));
  equal(stack.getDepth(), 1);
  stack.push(new Tag("<a href='hoge'>"));
  equal(stack.getDepth(), 2);
  stack.push(new Tag("<span class='nehan-small'>"));
  equal(stack.getDepth(), 3);
  equal(stack.getDepthByName("span"), 2);
  equal(stack.isTagNameEnable("span"), true);

  stack.popByName("span");
  equal(stack.getDepth(), 2);
  stack.popByName("a");
  equal(stack.getDepth(), 1);
  stack.popByName("span");
  equal(stack.getDepth(), 0);
  equal(stack.isTagNameEnable("span"), false);
});