describe("Spacing", function(){
  it("should add half space before char", function(){
    var pre = new Nehan.Char({data:"a"});
    var cur = new Nehan.Char({data:"("});
    Nehan.Spacing.add(cur, pre, null);
    expect(cur.spaceRateStart).toBe(0.5);
  });

  it("should add half space after char", function(){
    var cur = new Nehan.Char({data:")"});
    var next = new Nehan.Char({data:"a"});
    Nehan.Spacing.add(cur, null, next);
    expect(cur.spaceRateEnd).toBe(0.5);
  });

  it("should add quarter space between word and char", function(){
    var pre = new Nehan.Char({data:"a"});
    var cur = new Nehan.Word("foo");
    var next = new Nehan.Char({data:"b"});
    Nehan.Spacing.add(cur, pre, next);
    expect(cur.spaceRateStart).toBe(0.25);
    expect(cur.spaceRateEnd).toBe(0.25);
  });
});
