// [note]
// for allmost all modern browsers is now supporting vertical writing mode already,
// this module will be deprecated soon.
describe("Palette", function(){
  it("getColor(ff0000)", function(){
    expect(Nehan.Palette.getColor(new Nehan.Rgb("ff0000"))).toBe("ff0000");
    expect(Nehan.Palette.getColor(new Nehan.Rgb("ff0001"))).toBe("ff0000");
  });
});
