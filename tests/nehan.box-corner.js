describe("Nehan.BoxCorner", function(){
  it("BoxCorner::getCornerName", function(){
    expect(Nehan.BoxCorner.getCornerName("top", "right")).toBe("topRight");
    expect(Nehan.BoxCorner.getCornerName("right", "top")).toBe("topRight");

    expect(Nehan.BoxCorner.getCornerName("top", "left")).toBe("topLeft");
    expect(Nehan.BoxCorner.getCornerName("left", "top")).toBe("topLeft");

    expect(Nehan.BoxCorner.getCornerName("bottom", "left")).toBe("bottomLeft");
    expect(Nehan.BoxCorner.getCornerName("left", "bottom")).toBe("bottomLeft");

    expect(Nehan.BoxCorner.getCornerName("bottom", "right")).toBe("bottomRight");
    expect(Nehan.BoxCorner.getCornerName("right", "bottom")).toBe("bottomRight");
  });
});
