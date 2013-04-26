test("eval-result", function(){
  var ret = new EvalResult({
    html:"aaa",
    groupLength:1
  });
  equal(ret.isGroup(), false);
  equal(ret.getGroupCount(), 1);
  equal(ret.getPageCount(), 1);

  var ret2 = new EvalResult({
    html:["aaa", "bbb"],
    groupLength:2
  });
  equal(ret2.isGroup(), true);
  equal(ret2.getGroupCount(), 2);
  equal(ret2.getPageCount(), 2);

  var ret3 = new EvalResult({
    html:["aaa"],
    groupLength:2
  });
  equal(ret3.isGroup(), true);
  equal(ret3.getGroupCount(), 2);
  equal(ret3.getPageCount(), 1);
});
    