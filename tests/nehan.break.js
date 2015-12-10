describe("Nehan.Break", function(){
  it("Break::isAlways", function(){
    expect(new Nehan.Break("always").isAlways()).toBe(true);
  });

  it("Break::isAvoid", function(){
    expect(new Nehan.Break("avoid").isAvoid()).toBe(true);
  });
});
