describe("OutlineContext", function(){
  it("OutlineContext.isEmpty", function(){
    expect(new Nehan.OutlineContext("body").isEmpty()).toBe(true);
  });

  it("OutlineContext.getMarkupName", function(){
    expect(new Nehan.OutlineContext().getMarkupName()).toBe("body"); // default root is 'body'
    expect(new Nehan.OutlineContext("body").getMarkupName()).toBe("body");
  });
});
