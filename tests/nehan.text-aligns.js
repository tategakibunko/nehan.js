describe("TextAligns", function(){
  it("TextAligns.get", function(){
    expect(Nehan.TextAligns.get("start").isStart()).toBe(true);
    expect(Nehan.TextAligns.get("center").isCenter()).toBe(true);
    expect(Nehan.TextAligns.get("end").isEnd()).toBe(true);
  });
});
