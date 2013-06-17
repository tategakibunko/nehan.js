test("border-color-by-object", function(){
  var bc = new BorderColor();
  var flow = BoxFlows.getByName("lr-tb");
  bc.setColor(flow, {
    start:"black",
    end:"red",
    before:"green",
    after:"blue"
  });

  equal(bc.left.getValue(), "000000");
  equal(bc.right.getValue(), "ff0000");
  equal(bc.top.getValue(), "008000");
  equal(bc.bottom.getValue(), "0000ff");
});

test("border-color-by-array-1", function(){
  var bc = new BorderColor();
  var flow = BoxFlows.getByName("lr-tb");
  bc.setColor(flow, ["red"]);
  equal(bc.top.getValue(), "ff0000");
  equal(bc.right.getValue(), "ff0000");
  equal(bc.bottom.getValue(), "ff0000");
  equal(bc.left.getValue(), "ff0000");
});

test("border-color-by-array-2", function(){
  var bc = new BorderColor();
  var flow = BoxFlows.getByName("lr-tb");
  bc.setColor(flow, ["red", "blue"]);
  equal(bc.top.getValue(), "ff0000");
  equal(bc.right.getValue(), "0000ff");
  equal(bc.bottom.getValue(), "ff0000");
  equal(bc.left.getValue(), "0000ff");
});

test("border-color-by-array-3", function(){
  var bc = new BorderColor();
  var flow = BoxFlows.getByName("lr-tb");
  bc.setColor(flow, ["red", "blue", "green"]);
  equal(bc.top.getValue(), "ff0000");
  equal(bc.right.getValue(), "0000ff");
  equal(bc.bottom.getValue(), "008000");
  equal(bc.left.getValue(), "0000ff");
});

test("border-color-by-array-4", function(){
  var bc = new BorderColor();
  var flow = BoxFlows.getByName("lr-tb");
  bc.setColor(flow, ["red", "blue", "green", "black"]);
  equal(bc.top.getValue(), "ff0000");
  equal(bc.right.getValue(), "0000ff");
  equal(bc.bottom.getValue(), "008000");
  equal(bc.left.getValue(), "000000");
});

test("border-color-by-single", function(){
  var bc = new BorderColor();
  var flow = BoxFlows.getByName("lr-tb");
  bc.setColor(flow, "red");
  equal(bc.top.getValue(), "ff0000");
  equal(bc.right.getValue(), "ff0000");
  equal(bc.bottom.getValue(), "ff0000");
  equal(bc.left.getValue(), "ff0000");
});



