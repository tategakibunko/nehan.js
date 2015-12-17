describe("ListStylePos", function(){
  it("ListStylePos.isOutside", function(){
    expect(new Nehan.ListStylePos("outside").isOutside()).toBe(true);
    expect(new Nehan.ListStylePos("inside").isOutside()).toBe(false);
  });

  it("ListStylePos.isInside", function(){
    expect(new Nehan.ListStylePos("outside").isInside()).toBe(false);
    expect(new Nehan.ListStylePos("inside").isInside()).toBe(true);
  });
});
