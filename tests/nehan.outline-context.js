describe("OutlineContext", function(){
  it("OutlineContext.isEmpty", function(){
    expect(new Nehan.OutlineContext("body").isEmpty()).toBe(true);
  });

  it("OutlineContext.getMarkupName", function(){
    expect(new Nehan.OutlineContext().getMarkupName()).toBe("body"); // default root is 'body'
    expect(new Nehan.OutlineContext("body").getMarkupName()).toBe("body");
  });

  it("OutlineContext.add, get", function(){
    var ctx = new Nehan.OutlineContext();
    var start_section1 = {name:"start-section", type:"body", pageNo:0};
    var set_header1 = {name:"set-header", headerId:0, type:"h1", pageNo:0, rank:1, title:"foo"};

    expect(ctx.get(0)).toBe(null);

    ctx.add(start_section1);
    ctx.add(set_header1);

    expect(ctx.get(0)).toBe(start_section1);
    expect(ctx.get(1)).toBe(set_header1);
  });
});
