test("utils-utils", function(){
  equal(Utils.capitalize("this is it"), "This is it");
  equal(Utils.capitalize(""), "");
});

test("utils-obj", function(){
  equal(Obj.isEmpty({}), true);
  equal(Obj.isEmpty({name:"taro"}), false);
});

test("utils-css", function(){
  equal(Css.toString({"width":"100px", "height":"200px"}), "width:100px;height:200px");
});

test("utils-camel-name", function(){
  equal(Utils.capitalize("yours"), "Yours");
  equal(Utils.getCamelName(""), "");
  equal(Utils.getCamelName("foo"), "foo");
  equal(Utils.getCamelName("foo-var"), "fooVar");
  equal(Utils.getCamelName("foo-var-baz"), "fooVarBaz");
});

test("utils-html", function(){
  equal(Html.escape("<script>"), "&lt;script&gt;")
  equal(Html.escape("&nbsp;"), "&amp;nbsp;");
  equal(Html.escape("\"hoge\""), "&quot;hoge&quot;");
  equal(Html.escape("'hoge'"), "&#039;hoge&#039;");
  equal(Html.attr({width:"100", height:"200"}), "width='100' height='200'");
});

test("utils-closure", function(){
  var fn_id = Closure.id();
  equal(fn_id(5), 5);

  var fn_eq = Closure.eq(5);
  ok(fn_eq(5));
});

test("utils-args", function(){
  var obj = {hoge:10, hige:20};
  deepEqual(Args.copy({}, obj), obj);
  deepEqual(Args.copy({age:100}, obj), {hoge:10, hige:20, age:100});
  deepEqual(Args.copy({hoge:10}, {hoge:20, hige:21}), {hoge:20, hige:21});
  deepEqual(Args.merge(obj, {age:100}, {}), {hoge:10, hige:20, age:100});
  deepEqual(Args.merge(obj, {age:100}, {age:200}), {hoge:10, hige:20, age:200});
  deepEqual(Args.merge(obj, {hoge:50}, {age:200}), {hoge:50, hige:20, age:200});
});

