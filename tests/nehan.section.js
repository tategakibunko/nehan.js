describe("Section", function(){
  it("Sestion.isRoot", function(){
    var root = new Nehan.Section({parent:null, pageNo:0});
    expect(root.isRoot()).toBe(true);
  });

  it("Sestion.getHeader, getTitle, getRank", function(){
    var root = new Nehan.Section({parent:null, pageNo:0});
    expect(root.getHeader()).toBe(null);
    expect(root.getRank()).toBe(0);
    expect(root.getTitle()).toBe("");
    var h1 = new Nehan.SectionHeader({id:0, rank:1, title:"foo"});
    root.setHeader(h1);
    expect(root.getHeader()).toBe(h1);
    expect(root.getRank()).toBe(1);
    expect(root.getTitle()).toBe("foo");
  });
});
