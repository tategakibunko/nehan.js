describe("Nehan.AttrSelector", function(){
  var context = new Nehan.RenderingContext();
  it("AttrSelector::test", function(){
    var tag = new Nehan.Tag("<a href='#' target='_blank'>");
    var style = context.createChildStyle(tag);
    var selector = new Nehan.AttrSelector("[href='#']");
    expect(selector.test(style)).toBe(true);

    var selector2 = new Nehan.AttrSelector("[target='_blank']");
    expect(selector2.test(style)).toBe(true);
  });
});
