describe("Nehan.BoxEdge", function(){
  var flow = Nehan.BoxFlows.getByName("lr-tb");
  var margin = new Nehan.Margin();
  margin.setLogicalValues(flow, {
    start:1,
    end:2,
    before:3,
    after:4
  });
  var padding = new Nehan.Padding();
  padding.setLogicalValues(flow, {
    start:5,
    end:6,
    before:7,
    after:8
  });
  var border = new Nehan.Border();
  border.setLogicalValues(flow, {
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

  it("BoxEdge::getStart", function(){
    expect(edge.getStart(flow)).toBe(1+5+9);
  });

  it("BoxEdge::getEnd", function(){
    expect(edge.getEnd(flow)).toBe(2+6+10);
  });

  it("BoxEdge::getBefore", function(){
    expect(edge.getBefore(flow)).toBe(3+7+11);
  });

  it("BoxEdge::getAfter", function(){
    expect(edge.getAfter(flow)).toBe(4+8+12);
  });

  it("BoxEdge::getMeasure", function(){
    expect(edge.getMeasure(flow)).toBe(1+2+5+6+9+10);
  });

  it("BoxEdge::getInnerMeasure", function(){
    expect(edge.getInnerMeasureSize(flow)).toBe(5+6+9+10);
  });

  it("BoxEdge::getHeight", function(){
    expect(edge.getHeight()).toBe(3+4+7+8+11+12);
  });

  it("BoxEdge::getExtent", function(){
    expect(edge.getExtent(flow)).toBe(3+4+7+8+11+12);
  });

  it("BoxEdge::getInnerExtent", function(){
    expect(edge.getInnerExtentSize(flow)).toBe(7+8+11+12);
  });

  it("BoxEdge::clearAfter", function(){
    var tmp = edge.clone();
    expect(tmp.getAfter(flow)).toBe(4+8+12);
    tmp.clearAfter(flow);
    expect(tmp.getAfter(flow)).toBe(0);
  });
});
