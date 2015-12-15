describe("Flow", function(){
  it("Flow.isHorizontal", function(){
    expect(new Nehan.Flow("lr").isHorizontal()).toBe(true);
    expect(new Nehan.Flow("rl").isHorizontal()).toBe(true);
    expect(new Nehan.Flow("tb").isHorizontal()).toBe(false);
  });

  it("Flow.isVertical", function(){
    expect(new Nehan.Flow("lr").isVertical()).toBe(false);
    expect(new Nehan.Flow("rl").isVertical()).toBe(false);
    expect(new Nehan.Flow("tb").isVertical()).toBe(true);
  });

  it("Flow.isLeftToRight", function(){
    expect(new Nehan.Flow("lr").isLeftToRight()).toBe(true);
    expect(new Nehan.Flow("rl").isLeftToRight()).toBe(false);
    expect(new Nehan.Flow("tb").isLeftToRight()).toBe(false);
  });

  it("Flow.isRightToLeft", function(){
    expect(new Nehan.Flow("lr").isRightToLeft()).toBe(false);
    expect(new Nehan.Flow("rl").isRightToLeft()).toBe(true);
    expect(new Nehan.Flow("tb").isRightToLeft()).toBe(false);
  });
});
