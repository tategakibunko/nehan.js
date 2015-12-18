describe("CompoundSelector", function(){
  var check = function(selector, tag){
    var ctx = Nehan.createRootContext();
    var style = ctx.createChildStyle(tag);
    return selector.test(style);
  };

  it("CompoundSelector.test(type)", function(){
    var selector = new Nehan.CompoundSelector({
      name:"div"
    });
    var tag = new Nehan.Tag("div");
    expect(check(selector, tag)).toBe(true);
  });

  it("CompoundSelector.test(type+class)", function(){
    var selector = new Nehan.CompoundSelector({
      name:"div",
      classes:["foo"]
    });
    var tag = new Nehan.Tag("<div class='foo'>");
    expect(check(selector, tag)).toBe(true);
    var tag2 = new Nehan.Tag("<div>");
    expect(check(selector, tag2)).toBe(false);
  });

  it("CompoundSelector.test(type+class+id)", function(){
    var selector = new Nehan.CompoundSelector({
      name:"div",
      id:"hoge",
      classes:["foo"]
    });
    var tag = new Nehan.Tag("<div id='hoge' class='foo'>");
    expect(check(selector, tag)).toBe(true);
  });

  it("CompoundSelector.test(type+class+id+attrs)", function(){
    var selector = new Nehan.CompoundSelector({
      name:"a",
      id:"hoge",
      classes:["foo"],
      attrs:[
	new Nehan.AttrSelector("href='#'"),
	new Nehan.AttrSelector("target='_blank'")
      ]
    });
    var tag = new Nehan.Tag("<a href='#' target='_blank' id='hoge' class='foo'>");
    expect(check(selector, tag)).toBe(true);
  });

  it("CompoundSelector.test(:pseudo-class)", function(){
    var selector = new Nehan.CompoundSelector({
      name:"div",
      pseudo:new Nehan.PseudoSelector(":first-child")
    });
    var tag = new Nehan.Tag("<div>");
    tag.setFirstChild(true); // normally, this attribute is set by Nehan.TokenStream
    expect(check(selector, tag)).toBe(true);
  });
});
