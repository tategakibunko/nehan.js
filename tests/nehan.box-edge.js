describe("Nehan.BoxEdge", function(){
  var flow = Nehan.BoxFlows.getByName("lr-tb");
  var margin = new Nehan.Margin();
  margin.setSize(flow, {
    start:1,
    end:2,
    before:3,
    after:4
  });
  var padding = new Nehan.Padding();
  padding.setSize(flow, {
    start:5,
    end:6,
    before:7,
    after:8
  });
  var border = new Nehan.Border();
  border.setSize(flow, {
    start:9,
    end:10,
    before:11,
    after:12
  });

  var edge = new Nehan.BoxEdge({
    margin:margin,
    padding:padding,
    border:border
  });

  it("BoxEdge::getWidth", function(){
    expect(edge.getWidth()).toBe(1+2+5+6+9+10);
  });

  it("BoxEdge::getMeasure", function(){
    expect(edge.getMeasure(flow)).toBe(1+2+5+6+9+10);
  });

  it("BoxEdge::getHeight", function(){
    expect(edge.getHeight()).toBe(3+4+7+8+11+12);
  });

  it("BoxEdge::getExtent", function(){
    expect(edge.getExtent(flow)).toBe(3+4+7+8+11+12);
  });
});
