describe("ComplexSelector", function(){
  //
  // <div class='sample'>
  //   <p class='line'>foo</li>
  //   <ul class='test-list'>
  //     <li class='first'>first</li>
  //     <li class='second'>second</li>
  //     <li class='third'>third</li>
  //   </ul>
  //   <blockquote>quote</blockquote>
  // </div>
  var ctx = Nehan.createRootContext();
  var sample_style = ctx.createChildStyle(new Nehan.Tag("<div class='sample'>"));
  var sample_ctx = ctx.createChildContext(sample_style);
  var line_style = sample_ctx.createChildStyle(new Nehan.Tag("<p class='line'>"));
  var line_ctx = sample_ctx.createChildContext(line_style);
  var test_list_style = sample_ctx.createChildStyle(new Nehan.Tag("<ul class='test-list'>"));
  var test_list_ctx = sample_ctx.createChildContext(test_list_style);
  var first_item_style = test_list_ctx.createChildStyle(new Nehan.Tag("<li class='first'>"));
  var first_item_ctx = test_list_ctx.createChildContext(first_item_style);
  var second_item_style = test_list_ctx.createChildStyle(new Nehan.Tag("<li class='second'>"));
  var second_item_ctx = test_list_ctx.createChildContext(second_item_style);
  var third_item_style = test_list_ctx.createChildStyle(new Nehan.Tag("<li class='third'>"));
  var third_item_ctx = test_list_ctx.createChildContext(third_item_style);
  var blockquote_style = sample_ctx.createChildStyle(new Nehan.Tag("<blockquote>"));
  var blockquote_ctx = sample_ctx.createChildContext(blockquote_style);

  it("ComplexSelector.test(div)", function(){
    var selector = new Nehan.ComplexSelector("div");
    expect(selector.test(sample_style)).toBe(true);
    expect(selector.test(line_style)).toBe(false);
    expect(selector.test(test_list_style)).toBe(false);
    expect(selector.test(first_item_style)).toBe(false);
    expect(selector.test(second_item_style)).toBe(false);
    expect(selector.test(third_item_style)).toBe(false);
  });

  it("ComplexSelector.test(div>ul)", function(){
    var selector = new Nehan.ComplexSelector("div>ul");
    expect(selector.test(sample_style)).toBe(false);
    expect(selector.test(line_style)).toBe(false);
    expect(selector.test(test_list_style)).toBe(true);
    expect(selector.test(first_item_style)).toBe(false);
    expect(selector.test(second_item_style)).toBe(false);
    expect(selector.test(third_item_style)).toBe(false);
  });

  it("ComplexSelector.test(div>ul li)", function(){
    var selector = new Nehan.ComplexSelector("div>ul li");
    expect(selector.test(sample_style)).toBe(false);
    expect(selector.test(line_style)).toBe(false);
    expect(selector.test(test_list_style)).toBe(false);
    expect(selector.test(first_item_style)).toBe(true);
    expect(selector.test(second_item_style)).toBe(true);
    expect(selector.test(third_item_style)).toBe(true);
  });

  it("ComplexSelector.test(div>p+ul)", function(){
    var selector = new Nehan.ComplexSelector("div>p+ul");
    expect(selector.test(sample_style)).toBe(false);
    expect(selector.test(line_style)).toBe(false);
    expect(selector.test(test_list_style)).toBe(true);
    expect(selector.test(first_item_style)).toBe(false);
    expect(selector.test(second_item_style)).toBe(false);
    expect(selector.test(third_item_style)).toBe(false);
  });

  it("ComplexSelector.test(div>p~blockquote)", function(){
    var selector = new Nehan.ComplexSelector("div>p~blockquote");
    expect(selector.test(sample_style)).toBe(false);
    expect(selector.test(line_style)).toBe(false);
    expect(selector.test(test_list_style)).toBe(false);
    expect(selector.test(first_item_style)).toBe(false);
    expect(selector.test(second_item_style)).toBe(false);
    expect(selector.test(third_item_style)).toBe(false);
    expect(selector.test(blockquote_style)).toBe(true);
  });
});
