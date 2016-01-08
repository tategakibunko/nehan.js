describe("Box", function(){
  var lr_tb = Nehan.BoxFlows.getByName("lr-tb");
  var void_box1 = new Nehan.Box({elements:[]});
  var void_box2 = new Nehan.Box({size:new Nehan.BoxSize(0,0)});
  var void_box3 = new Nehan.Box({elements:[void_box1, void_box2]});
  var root_cont = new Nehan.RenderingContext().setStyle("body", {flow:"lr-tb"}).createRootGenerator().context;
  var body_cont = root_cont.createChildContext(root_cont.createChildStyle(new Nehan.Tag("body")));
  var edged_box = new Nehan.Box({
    context:body_cont,
    size:new Nehan.BoxSize(1,2),
    edge:new Nehan.BoxEdge({
      padding:new Nehan.Padding().setSize(lr_tb, {start:1, end:2, before:3, after:4}),
      margin:new Nehan.Margin().setSize(lr_tb, {start:5, end:6, before:7, after:8}),
      border:new Nehan.Border().setSize(lr_tb, {start:9, end:10, before:11, after:12})
    })
  });

  it("Box.isVoid(elements empty)", function(){
    expect(void_box1.isVoid()).toBe(true);
  });

  it("Box.isVoid(size invalid)", function(){
    expect(void_box2.isVoid()).toBe(true);
  });

  it("Box.isVoid(elements void only)", function(){
    expect(void_box3.isVoid()).toBe(true);
  });

  it("Box.isTextBlock", function(){
    expect(new Nehan.Box({type:"text-block"}).isTextBlock()).toBe(true);
  });

  it("Box.isInvalidSize", function(){
    expect(new Nehan.Box({size:new Nehan.BoxSize(0,0)}).isInvalidSize()).toBe(true);
    expect(new Nehan.Box({size:new Nehan.BoxSize(1,0)}).isInvalidSize()).toBe(true);
    expect(new Nehan.Box({size:new Nehan.BoxSize(0,1)}).isInvalidSize()).toBe(true);
    expect(new Nehan.Box({size:new Nehan.BoxSize(1,1)}).isInvalidSize()).toBe(false);
  });

  it("Box.getTextElements", function(){
    var box1 = new Nehan.Box({
      elements:[new Nehan.Char({data:"a"}), new Nehan.Char({data:"b"})]
    });
    var box1_texts = box1.getTextElements();
    expect(box1_texts[0].data).toBe("a");
    expect(box1_texts[1].data).toBe("b");
    var box2 = new Nehan.Box({
      elements:[
	new Nehan.Char({data:"a"}),
	new Nehan.Box({
	  elements:[new Nehan.Char({data:"b"})]
	})
      ]
    });
    var box2_texts = box2.getTextElements();
    expect(box2_texts[0].data).toBe("a");
    expect(box2_texts[1].data).toBe("b");
  });

  it("Box.toString", function(){
    var box1 = new Nehan.Box({
      elements:[new Nehan.Char({data:"a"}), new Nehan.Char({data:"b"})]
    });
    var box2 = new Nehan.Box({
      elements:[
	new Nehan.Char({data:"a"}),
	new Nehan.Box({
	  elements:[new Nehan.Char({data:"b"})]
	})
      ]
    });
    expect(box1.toString(lr_tb)).toBe("ab");
    expect(box2.toString(lr_tb)).toBe("ab");
  });

  it("Box.getContentWidth", function(){
    var box = new Nehan.Box({
      size:new Nehan.BoxSize(1,2)
    });
    expect(box.getContentWidth()).toBe(1);
  });

  it("Box.getContentHeight", function(){
    var box = new Nehan.Box({
      size:new Nehan.BoxSize(1,2)
    });
    expect(box.getContentHeight()).toBe(2);
  });

  it("Box.getContentMeasure", function(){
    var box = new Nehan.Box({
      size:new Nehan.BoxSize(1,2)
    });
    expect(box.getContentMeasure(Nehan.BoxFlows.getByName("lr-tb"))).toBe(1);
    expect(box.getContentMeasure(Nehan.BoxFlows.getByName("tb-rl"))).toBe(2);
  });

  it("Box.getContentExtent", function(){
    var box = new Nehan.Box({
      size:new Nehan.BoxSize(1,2)
    });
    expect(box.getContentExtent(Nehan.BoxFlows.getByName("lr-tb"))).toBe(2);
    expect(box.getContentExtent(Nehan.BoxFlows.getByName("tb-rl"))).toBe(1);
  });

  it("Box.getContentExtent", function(){
    var box = new Nehan.Box({
      size:new Nehan.BoxSize(1,2)
    });
    expect(box.getContentExtent(Nehan.BoxFlows.getByName("lr-tb"))).toBe(2);
    expect(box.getContentExtent(Nehan.BoxFlows.getByName("tb-rl"))).toBe(1);
  });

  it("Box.getLayoutExtent", function(){
    expect(edged_box.getLayoutExtent(lr_tb)).toBe(2+3+4+7+8+11+12);
  });

  it("Box.getLayoutMeasure", function(){
    expect(edged_box.getLayoutMeasure(lr_tb)).toBe(1+1+2+5+6+9+10);
  });

  it("Box.resizeExtent", function(){
    var box = new Nehan.Box({
      size:new Nehan.BoxSize(1,2)
    });
    expect(box.resizeExtent(lr_tb, 0).size.height).toBe(0);
  });

  it("Box.clearBorderBefore", function(){
    var box = new Nehan.Box({
      context:body_cont,
      edge:new Nehan.BoxEdge({
	border:new Nehan.Border().setSize(lr_tb, {before:1, after:2})
      })
    });
    expect(box.edge.border.top).toBe(1);
    expect(box.clearBorderBefore(lr_tb).edge.border.top).toBe(0);
  });

  it("Box.clearBorderAfter", function(){
    var box = new Nehan.Box({
      context:body_cont,
      edge:new Nehan.BoxEdge({
	border:new Nehan.Border().setSize(lr_tb, {before:1, after:2})
      })
    });
    expect(box.edge.border.bottom).toBe(2);
    expect(box.clearBorderAfter(lr_tb).edge.border.bottom).toBe(0);
  });
});
