test("box", function(){
  var size = new BoxSize(100,200);
  var box = new Box(size, null);
  var flow = new BoxFlow("lr", "tb");
  var margin0 = new Margin();
  box.edge = new BoxEdge();
  box.setEdge(margin0);
  box.setFlow(flow);
  equal(box.getBoxWidth(), 100);
  equal(box.getBoxHeight(), 200);

  var margin = new Margin();
  margin.left = 20;
  margin.top = 10;
  box.setEdge(margin);
  equal(box.getBoxWidth(), 120);
  equal(box.getBoxHeight(), 210);
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
  var lsize = size.toLogicalSize(flow);
  equal(lsize.measure, size.width);
  equal(lsize.extent, size.height);

  var size = new BoxSize(100,200);
  var flow = new BoxFlow("tb", "rl");
  equal(size.getMeasure(flow), size.height);
  equal(size.getExtent(flow), size.width);

  var size = new BoxSize(100,200);
  var lsize = size.toLogicalSize(flow);
  equal(lsize.measure, size.height);
  equal(lsize.extent, size.width);
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

test("box-shorten", function(){
  var box = new Box(new BoxSize(100,100));
  box.flow = new BoxFlow("lr", "tb");
  box.addChild(new Box(new BoxSize(50, 10)));
  box.addChild(new Box(new BoxSize(90, 10)));
  box.addChild(new Box(new BoxSize(20, 10)));
  box.shortenBox();
  equal(box.getBoxWidth(), 90);
  equal(box.getBoxHeight(), 30);
});