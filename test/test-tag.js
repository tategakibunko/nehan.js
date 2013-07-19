test("tag-normal", function(){
  var tag;
  tag = new Tag("<a href=\"http://google.com?id=10&gid=20\" target = '_blank'>");
  equal(tag.name, "a");
  equal(tag.getTagAttr("href"), "http://google.com?id=10&gid=20");
  equal(tag.getTagAttr("target"), "_blank");

  tag = new Tag("<a href=http://google.com?id=10&gid=20 target = _blank   >");
  equal(tag.name, "a");
  equal(tag.getTagAttr("href"), "http://google.com?id=10&gid=20");
  equal(tag.getTagAttr("target"), "_blank");
});

test("tag-empty-value", function(){
  var tag = new Tag("<a href=''>");
  equal(tag.getTagAttr("href", ""), "");
});

test("tag-zero-value", function(){
  var tag = new Tag("<img width='0'>");
  equal(tag.getTagAttr("width"), "0");
});

test("tag-empty-attrib", function(){
  var tag;
  tag = new Tag("<input type='checkbox' checked    />");
  equal(tag.name, "input");
  equal(tag.getTagAttr("type"), "checkbox");
  equal(tag.getTagAttr("checked"), true);

  tag = new Tag("<input checked type='checkbox'/>");
  equal(tag.name, "input");
  equal(tag.getTagAttr("type"), "checkbox");
  equal(tag.getTagAttr("checked"), true);

  tag = new Tag("<input type='checkbox' checked/>");
  equal(tag.name, "input");
  equal(tag.getTagAttr("type"), "checkbox");
  equal(tag.getTagAttr("checked"), true);

  // invalid syntax
  tag = new Tag("<input type=/>");
  equal(tag.name, "input");
  equal(tag.getTagAttr("type"), null);
});

test("tag-special-prop", function(){
  var tag = new Tag("<b special:prop='hoge'>");
  equal(tag.name, "b");
  equal(tag.getTagAttr("special:prop"), "hoge");
});

test("tag-selector-class", function(){
  var tag = new Tag("<p class='hi hey'>");

  equal(tag.getName(), "p");
  deepEqual(tag._parseCssClasses(tag.classes), [".hi", ".hey"]);
  deepEqual(tag.classes, ["hi", "hey"]);

  equal(tag.hasClass("hi"), true);
  equal(tag.hasClass("hey"), true);
});

test("tag-selector-id-class", function(){
  var tag = new Tag("<p id='foo' class='hi hey'>");

  equal(tag.getName(), "p");
  deepEqual(tag.id, "foo");
  deepEqual(tag.classes, ["hi", "hey"]);

  equal(tag.hasClass("hi"), true);
  equal(tag.hasClass("hey"), true);
});

test("tag-inline-style", function(){
  var tag = new Tag("<span style='color:red'>");
  equal(tag.getCssAttr("color"), "red");
});

test("tag-static-size", function(){
  var tag = new Tag("<img width='100' height='200' />");
  var size = new BoxSize(100, 200);
  deepEqual(tag.getStaticSize(), size);
});

test("tag-header", function(){
  equal((new Tag("<h1>")).getHeaderRank(), 1);
  equal((new Tag("<h6>")).getHeaderRank(), 6);
  equal((new Tag("<h7>")).getHeaderRank(), 0);
  equal((new Tag("<hx>")).getHeaderRank(), 0);
});

test("tag-is", function(){
  var tag;
  tag = new Tag("<a name='hoge'>");
  equal(tag.isAnchorTag(), true);

  tag = new Tag("</a>");
  equal(tag.isClose(), true);

  tag = new Tag("<a href='#hoge'>");
  equal(tag.isAnchorLinkTag(), true);

  tag = new Tag("<iframe>");
  equal(tag.isEmbeddableTag(), true);

  tag = new Tag("<div>");
  equal(tag.isBlock(), true);

  tag = new Tag("<img>");
  equal(tag.isBlock(), false); // img is default inline!
  equal(tag.isInline(), true); // img is default inline!

  tag = new Tag("<img width='20' height='20' class='nehan-float-start'>");
  equal(tag.isBlock(), true); // aligned block with static size is block

  tag = new Tag("<div style='display:inline'>");
  equal(tag.isInline(), true);

  tag = new Tag("<div style='display:inline-block'>");
  equal(tag.isInlineBlock(), true);

  tag = new Tag("<b>");
  equal(tag.isBoldTag(), true);

  tag = new Tag("<strong>");
  equal(tag.isBoldTag(), true);

  tag = new Tag("<section>");
  equal(tag.isSectionTag(), true);

  tag = new Tag("<aside>");
  equal(tag.isSectionTag(), true);

  tag = new Tag("<article>");
  equal(tag.isSectionTag(), true);

  tag = new Tag("<header>");
  equal(tag.isSectionTag(), true);

  tag = new Tag("<nav>");
  equal(tag.isSectionTag(), true);

  tag = new Tag("<footer>");
  equal(tag.isSectionTag(), true);

  tag = new Tag("<body>");
  equal(tag.isSectionRootTag(), true);

  tag = new Tag("<blockquote>");
  equal(tag.isSectionRootTag(), true);

  tag = new Tag("<details>");
  equal(tag.isSectionRootTag(), true);

  tag = new Tag("<fieldset>");
  equal(tag.isSectionRootTag(), true);

  tag = new Tag("<figure>");
  equal(tag.isSectionRootTag(), true);

  tag = new Tag("<td>");
  equal(tag.isSectionRootTag(), true);

  tag = new Tag("<input>");
  equal(tag.isSingleTag(), true);

  tag = new Tag("<span class='nehan-tcy'>");
  equal(tag.isTcyTag(), true);

  tag = new Tag("<span class='nehan-text-combine'>");
  equal(tag.isTcyTag(), true);
});

test("tag-dataset", function(){
  var tag;
  tag = new Tag("<div data-age='10'>");
  equal(tag.getDataset("age"), "10");

  tag = new Tag("<div data-family-name='yamada'>");
  equal(tag.getDataset("familyName"), "yamada");
});

test("tag-nth", function(){
  var ctx = new DocumentContext();
  var gtid = 0;
  var create_token = function(name){
    var ret = new Tag("<" + name + ">");
    ret._gtid = gtid++;
    return ret;
  };
  var div = create_token("div");

  var ul = create_token("ul");
  ul.inherit(div);

  var li1 = create_token("li");
  li1.inherit(ul);

  var li2 = create_token("li");
  li2.inherit(ul);

  var li3 = create_token("li");
  li3.inherit(ul);

  var p = create_token("p");
  p.inherit(div);

  equal(li1.isFirstChild(), true);
  equal(li1.getChildNth(), 0);
  equal(li1.getLastChildNth(), 2);

  equal(li2.isFirstChild(), false);
  equal(li2.getChildNth(), 1);
  equal(li2.getLastChildNth(), 1);

  equal(li3.isFirstChild(), false);
  equal(li3.getChildNth(), 2);
  equal(li3.getLastChildNth(), 0);

  equal(ul.getChildNth(), 0);
  equal(ul.getChildOfTypeNth(), 0);

  equal(p.getChildNth(), 1);
  equal(p.getChildOfTypeNth(), 0);
});

