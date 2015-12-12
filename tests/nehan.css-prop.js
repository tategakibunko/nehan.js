describe("Nehan::CssProp", function(){
  it("CssProp.getName", function(){
    expect(new Nehan.CssProp("margin").getName()).toBe("margin");
    expect(new Nehan.CssProp("margin-start").getName()).toBe("margin");
  });

  it("CssProp.getAttr", function(){
    expect(new Nehan.CssProp("margin").getAttr()).toBe(null);
    expect(new Nehan.CssProp("margin-start").getAttr()).toBe("start");
  });
});
