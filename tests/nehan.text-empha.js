describe("TextEmpha", function(){
  it("TextEmpha.isEnable", function(){
    expect(new Nehan.TextEmpha({style:new Nehan.TextEmphaStyle()}).isEnable()).toBe(false);
    expect(new Nehan.TextEmpha({style:new Nehan.TextEmphaStyle("none")}).isEnable()).toBe(false);
    expect(new Nehan.TextEmpha({style:new Nehan.TextEmphaStyle("filled dot")}).isEnable()).toBe(true);
  });

  it("TextEmpha.getExtent", function(){
    expect(new Nehan.TextEmpha({style:new Nehan.TextEmphaStyle()}).getExtent(16)).toBe(16);
    expect(new Nehan.TextEmpha({style:new Nehan.TextEmphaStyle("filled dot")}).getExtent(16)).toBe(32);
  });
});
