describe("Radius2d", function(){
  it("Radius2d.setSize", function(){
    var radius = new Nehan.Radius2d({hori:1, vert:2}).setSize([2,3]);
    expect(radius.hori).toBe(2);
    expect(radius.vert).toBe(3);
  });

  it("Radius2d.clone", function(){
    var radius = new Nehan.Radius2d({hori:1, vert:2});
    var radius2 = radius.clone();
    expect(radius.hori === radius2.hori).toBe(true);
    expect(radius.vert === radius2.vert).toBe(true);
    expect(radius === radius2).toBe(false);
    radius2.setSize([2,3]);
    expect(radius.hori !== radius2.hori).toBe(true);
    expect(radius.vert !== radius2.vert).toBe(true);
  });
});
