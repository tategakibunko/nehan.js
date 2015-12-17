describe("OutlineContextParser", function(){
  it("section>h1", function(){
    var ctx = new Nehan.OutlineContext().add({
      name:"start-section",
      type:"body",
      pageNo:0
    }).add({
      name:"set-header",
      headerId:0,
      type:"h1",
      pageNo:1,
      rank:1,
      title:"foo"
    });
    var root = Nehan.OutlineContextParser.parse(ctx);
    console.log(root);
    var section1 = root.getChild();
    var header1 = section1.getHeader();
    
    // section
    expect(section1.getType()).toBe("body");
    expect(section1.getHeaderId()).toBe(0);
    expect(section1.getTitle()).toBe("foo");
    expect(section1.getRank()).toBe(1);

    // section>h1
    expect(header1.getId()).toBe(0);
    expect(header1.getTitle()).toBe("foo");
    expect(header1.getRank()).toBe(1);
  });
});
