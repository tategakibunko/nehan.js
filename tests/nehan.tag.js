describe("Tag", function(){
  var tag = new Nehan.Tag("<div id='woo' class='hoge hige hage' data-name='taro' data-age='10' width='100'>");
  it("Tag.getName", function(){
    expect(tag.getName()).toBe("div");
  });

  it("Tag.getAlias", function(){
    var tmp = tag.clone();
    tmp.setAlias("foo");
    expect(tmp.getName()).toBe("foo");
  });

  it("Tag.getPath", function(){
    expect(tag.getPath()).toBe("div#woo.hoge.hige.hage");
  });
  
  it("Tag.getAttr", function(){
    expect(tag.getAttr("width")).toBe("100");
  });

  it("Tag.getClasses", function(){
    expect(tag.getClasses()).toEqual(["hoge", "hige", "hage"]);
  });

  it("Tag.hasClass", function(){
    expect(tag.hasClass("hoge")).toBe(true);
    expect(tag.hasClass("hige")).toBe(true);
    expect(tag.hasClass("hage")).toBe(true);
    expect(tag.hasClass("hee")).toBe(false);
  });
  
  it("Tag.getData", function(){
    expect(tag.getData("name")).toEqual("taro");
    expect(tag.getData("age")).toBe(10);
  });

  it("Tag.setAttr", function(){
    var tmp = tag.clone();
    tmp.setAttr("width", "200");
    expect(tmp.getAttr("width")).toBe("200");
    tmp.setAttr("height", 100); // as integer
    expect(tmp.getAttr("height")).toBe(100);
  });

  it("Tag.setAttrs", function(){
    var tmp = tag.clone();
    tmp.setAttrs({
      width:100,
      height:200
    });
    expect(tmp.getAttr("width")).toBe(100);
    expect(tmp.getAttr("height")).toBe(200);
  });

  it("Tag.addClass", function(){
    var tmp = tag.clone();
    tmp.addClass("foo");
    expect(tmp.getClasses()).toContain("foo");
  });

  it("Tag.removeClass", function(){
    var tmp = tag.clone();
    tmp.removeClass("hoge");
    expect(tmp.getClasses()).not.toContain("hoge");
  });

  it("Tag.isHeaderTag", function(){
    expect(new Nehan.Tag("h1").isHeaderTag()).toBe(true);
    expect(new Nehan.Tag("h6").isHeaderTag()).toBe(true);
    expect(new Nehan.Tag("h7").isHeaderTag()).toBe(false);
    expect(new Nehan.Tag("hi").isHeaderTag()).toBe(false);
  });
});


