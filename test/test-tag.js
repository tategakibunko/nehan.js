test("tag1", function(){
  var src = "<a href='http://google.com?id=10&gid=20' target = '_blank'>";
  var tag = new Tag(src);
  equal(tag.name, "a");
  equal(tag.getTagAttr("href"), "http://google.com?id=10&gid=20");
  equal(tag.getTagAttr("target"), "_blank");
  deepEqual(tag.getCloseTag(), new Tag("</a>"));
  equal(tag.getCloseSrc(), "</a>");
});


test("tag2", function(){
  var tag = new Tag("<input type='checkbox' checked />");
  equal(tag.name, "input");
  equal(tag.getTagAttr("type"), "checkbox");
  equal(tag.getTagAttr("checked"), true);
});

test("tag3", function(){
  var tag = new Tag("<b special:prop='hoge'>");
  equal(tag.name, "b");
  equal(tag.getTagAttr("special:prop"), "hoge");
});

test("tag4", function(){
  var tag = new Tag("<p>");
  tag.content = "hoge";
  equal(tag.name, "p");
  equal(tag.getWrapSrc(), "<p>" + tag.content + "</p>");
});

test("tag5", function(){
  var tag = new Tag("<p class='hi hey'>");

  equal(tag.getName(), "p");
  deepEqual(tag._parseClasses(), ["hi", "hey"]);
  deepEqual(tag._parseCssClasses(tag.classes), [".hi", ".hey"]);
  deepEqual(tag._parseClasses(), ["hi", "hey"]);
  deepEqual(tag._parseSelectors(tag._parseClasses()), ["p", "p.hi", "p.hey"]);

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
  equal(tag.isOpen(), true);

  tag = new Tag("</a>");
  equal(tag.isClose(), true);

  tag = new Tag("<a href='#hoge'>");
  equal(tag.isAnchorLinkTag(), true);

  tag = new Tag("<:first-letter>");
  equal(tag.isPseudoElementTag(), true);
  equal(tag.getPseudoElementName(), "first-letter");

  tag = new Tag("<span class='nehan-empha-dot-filled'>");
  equal(tag.isEmphaTag(), true);

  tag = new Tag("<span style='empha-mark:aaa'>");
  equal(tag.isEmphaTag(), true);

  tag = new Tag("<iframe>");
  equal(tag.isEmbeddableTag(), true);

  tag = new Tag("<div>");
  equal(tag.isBlock(), true);

  tag = new Tag("<img>");
  equal(tag.isBlock(), false); // img is default inline!
  equal(tag.isInline(), true); // img is default inline!

  tag = new Tag("<img class='nehan-float-start'>");
  equal(tag.isBlock(), true); // aligned img is block

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

  tag = new Tag("<p>");
  equal(tag.isChildContentTag(), true);

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

test("tag-contextual-keys", function(){
  var tag1 = new Tag("<div class='parent level-1'>");
  var tag2 = new Tag("<p class='child level-2'>");
  var parent_selectors = tag1._parseSelectors(tag1._parseClasses());
  var child_selectors = tag2._parseSelectors(tag2._parseClasses());
  deepEqual(parent_selectors, ["div", "div.parent", "div.level-1"]);
  deepEqual(child_selectors, ["p", "p.child", "p.level-2"]);
  deepEqual(tag2._parseContextSelectors(parent_selectors), [
    "div p",
    "div p.child",
    "div p.level-2",
    "div.parent p",
    "div.parent p.child",
    "div.parent p.level-2",
    "div.level-1 p",
    "div.level-1 p.child",
    "div.level-1 p.level-2"
  ]);
});
