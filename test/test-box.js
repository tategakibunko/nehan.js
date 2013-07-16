test("content-box-sizing", function(){
  var size = new BoxSize(100,200);
  var box = new Box(size, null);
  var flow = new BoxFlow("lr", "tb");
  box.sizing = BoxSizings.getByName("content-box");
  box.setFlow(flow);

  equal(box.getBoxWidth(), 100);
  equal(box.getBoxHeight(), 200);

  var edge = new BoxEdge();
  edge.padding.right = 20;
  edge.padding.top = 10;

  // set edge with box-sizing mode "content-box"
  box.setEdge(edge);

  // content size not change
  equal(box.getContentWidth(), 100);
  equal(box.getContentHeight(), 200);

  // box outer size change by padding
  equal(box.getBoxWidth(), 120);
  equal(box.getBoxHeight(), 210);
});

test("border-box-sizing", function(){
  var size = new BoxSize(100,200);
  var box = new Box(size, null);
  var flow = new BoxFlow("lr", "tb");
  box.sizing = BoxSizings.getByName("border-box");
  box.setFlow(flow);

  equal(box.getBoxWidth(), 100);
  equal(box.getBoxHeight(), 200);

  var edge = new BoxEdge();
  edge.margin.left = 20;
  edge.padding.right = 20;
  edge.padding.top = 10;

  // set edge with box-sizing mode "border-box"
  box.setEdge(edge);

  // margin size is added
  equal(box.getBoxWidth(), 120);
  equal(box.getBoxHeight(), 200);

  // content size is shorten by padding
  equal(box.getContentWidth(), 80);
  equal(box.getContentHeight(), 190);
});

test("margin-box-sizing", function(){
  var size = new BoxSize(100,200);
  var box = new Box(size, null);
  var flow = new BoxFlow("lr", "tb");
  box.sizing = BoxSizings.getByName("margin-box");
  box.setFlow(flow);

  equal(box.getBoxWidth(), 100);
  equal(box.getBoxHeight(), 200);

  var edge = new BoxEdge();
  edge.margin.left = 20;
  edge.margin.top = 10;

  // set edge with box-sizing mode "margin-box"
  box.setEdge(edge);

  // box size not change
  equal(box.getBoxWidth(), 100);
  equal(box.getBoxHeight(), 200);

  // content size shorten by any kind of edge(margin/border/padding).
  equal(box.getContentWidth(), 80);
  equal(box.getContentHeight(), 190);
});

test("box-size", function(){
  var size = new BoxSize(100,200);
  equal(size.canInclude(new BoxSize(10,10)), true);
  equal(size.canInclude(new BoxSize(100,200)), true);
  equal(size.canInclude(new BoxSize(101,200)), false);
  equal(size.canInclude(new BoxSize(100,201)), false);
  equal(size.canInclude(new BoxSize(200,300)), false);

  var box = new Box(size);
  equal(box.canInclude(new BoxSize(10,10)), true);
  equal(box.canInclude(new BoxSize(100,200)), true);
  equal(box.canInclude(new BoxSize(100,201)), false);
  equal(box.canInclude(new BoxSize(101,200)), false);

  var size = new BoxSize(100,200);
  var flow = new BoxFlow("lr", "tb");
  size.setExtent(flow, 202);
  equal(size.getMeasure(flow), size.width);
  equal(size.getExtent(flow), size.height);
  equal(size.getExtent(flow), 202);

  var size = new BoxSize(100,200);
  var flow = new BoxFlow("tb", "rl");
  equal(size.getMeasure(flow), size.height);
  equal(size.getExtent(flow), size.width);
});

test("box-child", function(){
  var child = new BoxChild();
  var back_box = new Box(new BoxSize(900,900));
  back_box.backward = true;

  child.add(back_box);
  child.add(new Box(new BoxSize(100,100)));
  child.add(new Box(new BoxSize(200,200)));
  var childs = child.get();
  equal(childs.length, 3);
  equal(childs[0].getContentWidth(), 100);
  equal(childs[1].getContentWidth(), 200);
  equal(childs[2].getContentWidth(), 900);
});

