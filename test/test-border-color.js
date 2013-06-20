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
