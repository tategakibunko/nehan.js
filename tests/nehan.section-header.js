describe("SectionHeader", function(){
  it("SectionHeader.getXXX", function(){
    var header = new Nehan.SectionHeader({id:0, rank:1, title:"foo"});
    expect(header.getId()).toBe(0);
    expect(header.getRank()).toBe(1);
    expect(header.getTitle()).toBe("foo");
  });
});

