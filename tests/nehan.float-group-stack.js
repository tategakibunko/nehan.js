describe("FloatGroupStack", function(){
  var ctx = Nehan.createRootContext({
    root:"body",
    styles:{body:{flow:"lr-tb"}}
  });
  var start1 = ctx.yieldWrapBlock(10, 20, []);
  var start2 = ctx.yieldWrapBlock(20, 30, []);
  var start3 = ctx.yieldWrapBlock(30 , 5, []);
  var end1 = ctx.yieldWrapBlock(30, 30, []);
  var end2 = ctx.yieldWrapBlock(40, 50, []);
  var end3 = ctx.yieldWrapBlock(10, 20, []);

  it("FloatGroupStack.isEmpty", function(){
    var stack = new Nehan.FloatGroupStack(ctx.getFlow(), [], []);
    expect(stack.isEmpty()).toBe(true);
  });

  it("FloatGroupStack.getExtent", function(){
    var empty = new Nehan.FloatGroupStack(ctx.getFlow(), [], []);
    expect(empty.getExtent()).toBe(0);
    var stack = new Nehan.FloatGroupStack(ctx.getFlow(), [start1], []);
    expect(stack.getExtent()).toBe(20);
    var stack2 = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2], []);
    expect(stack2.getExtent()).toBe(30);
    var stack3 = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2], [end1]);
    expect(stack3.getExtent()).toBe(30);
    var stack4 = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2], [end1, end2]);
    expect(stack4.getExtent()).toBe(50);
    var stack5 = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2], [end1, end2, end3]);
    expect(stack4.getExtent()).toBe(50);
  });

  it("FloatGroupStack.pop(1)", function(){
    // +--+--+----+--+--+
    // |s1|s2|    |e2|e1|
    // +--+  |    |  |  |
    //    |  |    |  |  |
    //    +--+    |  |--+
    //            |  |
    //            +--+
    var stack = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2], [end1, end2]);
    var group = stack.pop(); // group(e1,e2)
    expect(group.getExtent()).toBe(50);
    expect(group.isLast()).toBe(true);
    expect(stack.isEmpty()).toBe(false);

    var group2 = stack.pop(); // group(s1,s2)
    expect(group2.getExtent()).toBe(30);
    expect(stack.isEmpty()).toBe(true);
    expect(group2.isLast()).toBe(true);
  });

  it("FloatGroupStack.pop(2)", function(){
    // +--+--+--+--+--+--+
    // |s1|s2|  |e3|e2|e1|
    // +--+  |  +--+  |  |
    //    |  |     |  |  |
    //    +--+     |  +--+
    //             |  |
    //             +--+
    var stack = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2], [end1, end2, end3]);
    var group = stack.pop(); // group(e1,e2)
    expect(group.getExtent()).toBe(50);
    expect(group.getLength()).toBe(2);
    expect(group.isLast()).toBe(false);
    expect(stack.isEmpty()).toBe(false);

    var group2 = stack.pop(); // group(s1,s2)
    expect(group2.getExtent()).toBe(30);
    expect(group2.getLength()).toBe(2);
    expect(stack.isEmpty()).toBe(false);
    expect(group2.isLast()).toBe(true);

    var group3 = stack.pop(); // group(e3)
    expect(group3.getExtent()).toBe(20);
    expect(group3.getLength()).toBe(1);
    expect(group3.isLast()).toBe(true);
    expect(stack.isEmpty()).toBe(true);
  });

  it("FloatGroupStack.pop(3)", function(){
    // +--+--+--+--+--+--+--+
    // |s1|s2|s3|  |e3|e2|e1|
    // +--+  |--+  +--+  |  |
    //    |  |        |  |  |
    //    +--+        |  +--+
    //                |  |
    //                +--+
    var stack = new Nehan.FloatGroupStack(ctx.getFlow(), [start1, start2, start3], [end1, end2, end3]);
    var group = stack.pop(); // group(e1,e2)
    expect(group.getExtent()).toBe(50);
    expect(group.getLength()).toBe(2);
    expect(group.isLast()).toBe(false);
    expect(stack.isEmpty()).toBe(false);

    var group2 = stack.pop(); // group(s1,s2)
    expect(group2.getExtent()).toBe(30);
    expect(group2.getLength()).toBe(2);
    expect(stack.isEmpty()).toBe(false);
    expect(group2.isLast()).toBe(false);

    var group3 = stack.pop(); // group(e3)
    expect(group3.getExtent()).toBe(20);
    expect(group3.getLength()).toBe(1);
    expect(group3.isLast()).toBe(true); // end of end-groups
    expect(stack.isEmpty()).toBe(false);

    var group4 = stack.pop(); // group(s3)
    expect(group4.getExtent()).toBe(5);
    expect(group4.getLength()).toBe(1);
    expect(group4.isLast()).toBe(true); // end of start-groups
    expect(stack.isEmpty()).toBe(true);
  });
});
