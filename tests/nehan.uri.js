describe("Uri", function(){
  it("Uri.getAddress", function(){
    expect(new Nehan.Uri("http://example.com/top").getAddress()).toBe("http://example.com/top");
    expect(new Nehan.Uri("http://example.com/top#foo").getAddress()).toBe("http://example.com/top#foo");
  });

  it("Uri.getAnchorName", function(){
    expect(new Nehan.Uri("http://example.com/top").getAnchorName()).toBe("");
    expect(new Nehan.Uri("http://example.com/top#foo").getAnchorName()).toBe("foo");
  });
});
