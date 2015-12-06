describe("Nehan.Box", function(){
  var void_box1 = new Nehan.Box({elements:[]});
  var void_box2 = new Nehan.Box({size:new Nehan.BoxSize(0,0)});
  var void_box3 = new Nehan.Box({elements:[void_box1, void_box2]});

  it("Box::isVoid(elements empty)", function(){
    expect(void_box1.isVoid()).toBe(true);
  });

  it("Box::isVoid(size invalid)", function(){
    expect(void_box2.isVoid()).toBe(true);
  });

  it("Box::isVoid(elements void only)", function(){
    expect(void_box3.isVoid()).toBe(true);
  });

});
