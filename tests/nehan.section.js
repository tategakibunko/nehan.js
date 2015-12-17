describe("Section", function(){
  it("Sestion.isRoot", function(){
    expect(new Nehan.Section({
      parent:null,
      pageNo:0
    }).isRoot()).toBe(true); // root is no parent.
  });
});
