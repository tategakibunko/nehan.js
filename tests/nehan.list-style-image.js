describe("ListStyleImage", function(){
  it("ListStyleImage.getMarkerHtml", function(){
    var list_image = new Nehan.ListStyleImage("hoge.png");
    var list_image_tag = new Nehan.Tag(list_image.getMarkerHtml(0));
    expect(list_image_tag.getAttr("src")).toBe("hoge.png");
    expect(list_image_tag.getAttr("width")).toBe(Nehan.Config.defaultFontSize.toString());
    expect(list_image_tag.getAttr("height")).toBe(Nehan.Config.defaultFontSize.toString());
    expect(list_image_tag.hasClass("list-image")).toBe(true); // note that 'list-image' is converted to 'nehan-list-image' after evaluation
  });
});
