test("margin", function(){
  var margin = new Margin();
  var css = {};
  deepEqual(margin.getCss(), css);
  equal(margin.getWidth(), 0);
  equal(margin.getHeight(), 0);
  equal(margin.getDirProp("right"), "margin-right");

  var flow = new BoxFlow("lr", "tb");

  margin.setStart(flow, 10);
  equal(margin.getWidth(), 10);
  css["margin-left"] = "10px";
  deepEqual(margin.getCss(), css);

  margin.setEnd(flow, 10);
  equal(margin.getWidth(), 20);
  css["margin-right"] = "10px";
  deepEqual(margin.getCss(), css);

  margin.setBefore(flow, 10);
  equal(margin.getHeight(), 10);
  css["margin-top"] = "10px";
  deepEqual(margin.getCss(), css);

  margin.setAfter(flow, 10);
  css["margin-bottom"] = "10px";
  equal(margin.getHeight(), 20);
  deepEqual(margin.getCss(), css);
});

test("padding", function(){
  var padding = new Padding();
  var css = {};
  deepEqual(padding.getCss(), css);
  equal(padding.getWidth(), 0);
  equal(padding.getHeight(), 0);
  equal(padding.getDirProp("right"), "padding-right");

  var flow = new BoxFlow("lr", "tb");

  padding.setStart(flow, 10);
  equal(padding.getWidth(), 10);
  css["padding-left"] = "10px";
  deepEqual(padding.getCss(), css);

  padding.setEnd(flow, 10);
  equal(padding.getWidth(), 20);
  css["padding-right"] = "10px";
  deepEqual(padding.getCss(), css);

  padding.setBefore(flow, 10);
  equal(padding.getHeight(), 10);
  css["padding-top"] = "10px";
  deepEqual(padding.getCss(), css);

  padding.setAfter(flow, 10);
  css["padding-bottom"] = "10px";
  equal(padding.getHeight(), 20);
  deepEqual(padding.getCss(), css);

  padding = new Padding();
  flow = new BoxFlow("lr", "tb");
  padding.setSize(flow, [1, 2, 3, 4]);
  equal(padding.top, 1);
  equal(padding.right, 2);
  equal(padding.bottom, 3);
  equal(padding.left, 4);
});

test("border", function(){
  var border = new Border();
  var css = {};
  deepEqual(border.getCss(), css);
  equal(border.getWidth(), 0);
  equal(border.getHeight(), 0);
  equal(border.getDirProp("right"), "border-right-width");

  var flow = new BoxFlow("lr", "tb");

  border.setStart(flow, 10);
  equal(border.getWidth(), 10);
  css["border-left-width"] = "10px";
  deepEqual(border.getCss(), css);

  border.setEnd(flow, 10);
  equal(border.getWidth(), 20);
  css["border-right-width"] = "10px";
  deepEqual(border.getCss(), css);

  border.setBefore(flow, 10);
  equal(border.getHeight(), 10);
  css["border-top-width"] = "10px";
  deepEqual(border.getCss(), css);

  border.setAfter(flow, 10);
  css["border-bottom-width"] = "10px";
  equal(border.getHeight(), 20);
  deepEqual(border.getCss(), css);
});

test("edge-radius", function(){
  var radius = new Radius2d();
  equal(radius.hori, 0);
  equal(radius.vert, 0);
  equal(radius.getCssValue(), "0px");

  radius.setSize(10, 0);
  equal(radius.hori, 10);
  equal(radius.vert, 0);
  equal(radius.getCssValue(), "10px 0px");

  radius.setSize(10);
  equal(radius.hori, 10);
  equal(radius.vert, 10);
  equal(radius.getCssValue(), "10px");

  var radius = new Radius2d();
  radius.setSize({hori:10, vert:20});
  equal(radius.hori, 10);
  equal(radius.vert, 20);
  radius.setSize([20,10]);

  equal(radius.hori, 20);
  equal(radius.vert, 10);

  radius.setSize([5]);
  equal(radius.hori, 5);
  equal(radius.vert, 5);

  radius.setSize(10, 5);
  equal(radius.hori, 10);
  equal(radius.vert, 5);
  equal(radius.getCssValue(), "10px 5px");
});

test("border-radius", function(){
  var borderRadius = new BorderRadius();
  deepEqual(borderRadius.getCss(), {});

  borderRadius.borderTopLeftRadius.setSize(10);
  deepEqual(borderRadius.getCss(), {
    "-moz-border-top-left-radius":"10px",
    "-webkit-border-top-left-radius":"10px",
    "-o-border-top-left-radius":"10px",
    "-ms-border-top-left-radius":"10px",
    "border-top-left-radius":"10px"
  });

  borderRadius.setAll(10);
  deepEqual(borderRadius.getCss(), {
    "-moz-border-bottom-left-radius": "10px",
    "-moz-border-bottom-right-radius": "10px",
    "-moz-border-top-left-radius": "10px",
    "-moz-border-top-right-radius": "10px",
    "-ms-border-bottom-left-radius": "10px",
    "-ms-border-bottom-right-radius": "10px",
    "-ms-border-top-left-radius": "10px",
    "-ms-border-top-right-radius": "10px",
    "-o-border-bottom-left-radius": "10px",
    "-o-border-bottom-right-radius": "10px",
    "-o-border-top-left-radius": "10px",
    "-o-border-top-right-radius": "10px",
    "-webkit-border-bottom-left-radius": "10px",
    "-webkit-border-bottom-right-radius": "10px",
    "-webkit-border-top-left-radius": "10px",
    "-webkit-border-top-right-radius": "10px",
    "border-bottom-left-radius": "10px",
    "border-bottom-right-radius": "10px",
    "border-top-left-radius": "10px",
    "border-top-right-radius": "10px"
  });

  var flow = new BoxFlow("lr", "tb");
  borderRadius.setAll(0);
  borderRadius.setStartBefore(flow, 10);
  deepEqual(borderRadius.getCss(), {
    "-moz-border-top-left-radius": "10px",
    "-webkit-border-top-left-radius": "10px",
    "-o-border-top-left-radius": "10px",
    "-ms-border-top-left-radius": "10px",
    "border-top-left-radius": "10px"
  });

  borderRadius.setAll(0);
  borderRadius.setStartAfter(flow, 10);
  deepEqual(borderRadius.getCss(), {
    "-moz-border-bottom-left-radius": "10px",
    "-webkit-border-bottom-left-radius": "10px",
    "-o-border-bottom-left-radius": "10px",
    "-ms-border-bottom-left-radius": "10px",
    "border-bottom-left-radius": "10px"
  });

  borderRadius.setAll(0);
  borderRadius.setEndBefore(flow, 10);
  deepEqual(borderRadius.getCss(), {
    "-moz-border-top-right-radius": "10px",
    "-webkit-border-top-right-radius": "10px",
    "-o-border-top-right-radius": "10px",
    "-ms-border-top-right-radius": "10px",
    "border-top-right-radius": "10px"
  });

  borderRadius.setAll(0);
  borderRadius.setEndAfter(flow, 10);
  deepEqual(borderRadius.getCss(), {
    "-moz-border-bottom-right-radius": "10px",
    "-webkit-border-bottom-right-radius": "10px",
    "-o-border-bottom-right-radius": "10px",
    "-ms-border-bottom-right-radius": "10px",
    "border-bottom-right-radius": "10px"
  });
});

test("box-edge", function(){
  var flow = new BoxFlow("lr", "tb");
  var box_edge = new BoxEdge();
  box_edge.padding.setStart(flow, 10);
  equal(box_edge.getMeasureSize(flow), 10);
  equal(box_edge.getWidth(), 10);
  box_edge.margin.setStart(flow, 10);
  equal(box_edge.getMeasureSize(flow), 20);
  equal(box_edge.getWidth(), 20);
  box_edge.border.setStart(flow, 10);
  equal(box_edge.getMeasureSize(flow), 30);
  equal(box_edge.getWidth(), 30);
  deepEqual(box_edge.getCss(), {
    "padding-left": "10px",
    "margin-left": "10px",
    "border-left-width": "10px"
  });

  box_edge.padding.setEnd(flow, 10);
  equal(box_edge.getMeasureSize(flow), 40);
  equal(box_edge.getWidth(), 40);
  box_edge.margin.setEnd(flow, 10);
  equal(box_edge.getMeasureSize(flow), 50);
  equal(box_edge.getWidth(), 50);
  box_edge.border.setEnd(flow, 10);
  equal(box_edge.getMeasureSize(flow), 60);
  equal(box_edge.getWidth(), 60);
  deepEqual(box_edge.getCss(), {
    "padding-left": "10px",
    "margin-left": "10px",
    "border-left-width": "10px",
    "padding-right": "10px",
    "margin-right": "10px",
    "border-right-width": "10px"
  });

  box_edge.padding.setBefore(flow, 10);
  equal(box_edge.getExtentSize(flow), 10);
  equal(box_edge.getHeight(), 10);
  box_edge.margin.setBefore(flow, 10);
  equal(box_edge.getExtentSize(flow), 20);
  equal(box_edge.getHeight(), 20);
  box_edge.border.setBefore(flow, 10);
  equal(box_edge.getExtentSize(flow), 30);
  equal(box_edge.getHeight(), 30);
  deepEqual(box_edge.getCss(), {
    "padding-left": "10px",
    "margin-left": "10px",
    "border-left-width": "10px",
    "padding-right": "10px",
    "margin-right": "10px",
    "border-right-width": "10px",
    "padding-top": "10px",
    "margin-top": "10px",
    "border-top-width": "10px"
  });

  box_edge.padding.setAfter(flow, 10);
  equal(box_edge.getExtentSize(flow), 40);
  equal(box_edge.getHeight(), 40);
  box_edge.margin.setAfter(flow, 10);
  equal(box_edge.getExtentSize(flow), 50);
  equal(box_edge.getHeight(), 50);
  box_edge.border.setAfter(flow, 10);
  equal(box_edge.getExtentSize(flow), 60);
  equal(box_edge.getHeight(), 60);
  deepEqual(box_edge.getCss(), {
    "padding-left": "10px",
    "margin-left": "10px",
    "border-left-width": "10px",
    "padding-right": "10px",
    "margin-right": "10px",
    "border-right-width": "10px",
    "padding-top": "10px",
    "margin-top": "10px",
    "border-top-width": "10px",
    "padding-bottom": "10px",
    "margin-bottom": "10px",
    "border-bottom-width": "10px"
  });
});
