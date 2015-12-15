describe("FloatDirection", function(){
  var start = Nehan.FloatDirections.start;
  var end = Nehan.FloatDirections.end;

  it("getCss(start, hori)", function(){
    var css = start.getCss(false);
    expect(css["css-float"]).toBe("left");
  });

  it("getCss(start, vert)", function(){
    var css = start.getCss(true);
    expect(css["css-float"]).toBeUndefined();
  });

  it("getCss(end, hori)", function(){
    var css = end.getCss(false);
    expect(css["css-float"]).toBe("right");
  });

  it("getCss(end, vert)", function(){
    var css = end.getCss(true);
    expect(css["css-float"]).toBeUndefined();
  });
});
