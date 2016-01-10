describe("ColorParser", function(){
  it("ColorParser.parse(color name)", function(){
    expect(Nehan.Colors.get("red")).toBe("ff0000");
    expect(Nehan.Colors.get("blue")).toBe("0000ff");
    expect(Nehan.Colors.get("green")).toBe("008000");
    expect(Nehan.Colors.get("#ff8000")).toBe("ff8000");
    expect(Nehan.Colors.get("#f0f")).toBe("ff00ff");
  });
});
