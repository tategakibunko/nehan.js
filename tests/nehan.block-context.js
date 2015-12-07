describe("Nehan.BlockContext", function(){
  var root = new Nehan.RenderingContext().setStyle("body", {flow:"lr-tb"}).createRootGenerator().context;
  var cont = root.createChildContext(root.createChildStyle(new Nehan.Tag("body")));

  var e1 = new Nehan.Box({
    context:cont,
    size:new Nehan.BoxSize(1, 100)
  });
  var e2 = new Nehan.Box({
    context:cont,
    size:new Nehan.BoxSize(1, 200)
  });
  var pushed = new Nehan.Box({
    context:cont,
    size:new Nehan.BoxSize(1, 300),
    pushed:true
  });
  var pulled = new Nehan.Box({
    context:cont,
    size:new Nehan.BoxSize(1, 400),
    pulled:true
  });

  it("BlockContext::addElement", function(){
    var bc = new Nehan.BlockContext(1000);
    expect(bc.getMaxExtent()).toBe(1000);

    bc.addElement(e1, 100);
    expect(bc.getCurExtent()).toBe(100);
    expect(bc.getRestExtent()).toBe(900);
    expect(bc.getElements().length).toBe(1);

    bc.addElement(e2, 200);
    expect(bc.getCurExtent()).toBe(300);
    expect(bc.getRestExtent()).toBe(700);
    expect(bc.getElements().length).toBe(2);

    bc.addElement(pushed, 300);
    expect(bc.getCurExtent()).toBe(600);
    expect(bc.getRestExtent()).toBe(400);
    expect(bc.getElements().length).toBe(3);
    expect(Nehan.List.last(bc.getElements())).toBe(pushed);

    bc.addElement(pulled, 400);
    expect(bc.getCurExtent()).toBe(1000);
    expect(bc.getRestExtent()).toBe(0);
    expect(bc.getElements().length).toBe(4);
    expect(bc.getElements()[0]).toBe(pulled);
  });
});
