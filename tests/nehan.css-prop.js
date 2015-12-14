describe("Nehan::CssProp", function(){
  it("CssProp.getName", function(){
    expect(new Nehan.CssProp("margin").getName()).toBe("margin");
    expect(new Nehan.CssProp("margin-start").getName()).toBe("margin");
  });

  it("CssProp.getAttr", function(){
    expect(new Nehan.CssProp("margin").getAttr()).toBe(null);
    expect(new Nehan.CssProp("margin-start").getAttr()).toBe("start");
    expect(new Nehan.CssProp("list-style-type").getAttr()).toBe("type");
    expect(new Nehan.CssProp("list-style-image").getAttr()).toBe("image");
    expect(new Nehan.CssProp("list-style-position").getAttr()).toBe("position");
    expect(new Nehan.CssProp("border-before-start-radius").getAttr()).toBe("before-start");
    expect(new Nehan.CssProp("text-emphasis-style").getAttr()).toBe("style");
  });

  it("CssProp.hasAttr", function(){
    expect(new Nehan.CssProp("margin").hasAttr()).toBe(false);
    expect(new Nehan.CssProp("margin-start").hasAttr()).toBe(true);
  });
});
