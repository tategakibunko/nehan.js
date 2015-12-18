describe("TextAlign", function(){
  it("TextAlign.isStart", function(){
    expect(new Nehan.TextAlign("start").isStart()).toBe(true);
    expect(new Nehan.TextAlign("center").isStart()).toBe(false);
  });

  it("TextAlign.isCenter", function(){
    expect(new Nehan.TextAlign("start").isCenter()).toBe(false);
    expect(new Nehan.TextAlign("center").isCenter()).toBe(true);
  });

  it("TextAlign.isStart", function(){
    expect(new Nehan.TextAlign("center").isEnd()).toBe(false);
    expect(new Nehan.TextAlign("end").isEnd()).toBe(true);
  });
});
