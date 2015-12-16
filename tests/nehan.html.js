describe("Html", function(){
  it("Html.escape", function(){
    expect(Nehan.Html.escape("<script>")).toBe("&lt;script&gt;");
    expect(Nehan.Html.escape("&nbsp;")).toBe("&amp;nbsp;");
    expect(Nehan.Html.escape("'foo'")).toBe("&#39;foo&#39;");
    expect(Nehan.Html.escape("\"foo\"")).toBe("&quot;foo&quot;");
  });

  it("Html.unescape", function(){
    expect(Nehan.Html.unescape(Nehan.Html.escape("<script>foo</script>"))).toBe("<script>foo</script>");
    expect(Nehan.Html.unescape("&amp;")).toBe("&");
    //var c1 = Nehan.Html.unescape("&nbsp;").charCodeAt(0); // &#160; U+00A0 (NO-BREAK SPACE)
    //var c2 = " ".charCodeAt(0); // &#32; U+0020 (SPACE)
    //console.log("space code(%d, %d)", c1, c2);
    expect(Nehan.Html.unescape("&nbsp;")).toEqual("\u00a0");
    expect(Nehan.Html.unescape("\u0020")).toEqual("\u00a0");
  });

  it("Html.attr", function(){
    expect(Nehan.Html.attr({width:100, height:200})).toBe("width='100' height='200'");
  });

  it("Html.tagStart", function(){
    expect(Nehan.Html.tagStart("div", {class:"foo"})).toBe("<div class='foo'>");
  });

  it("Html.tagEnd", function(){
    expect(Nehan.Html.tagEnd("div")).toBe("</div>");
  });

  it("Html.tagSingle", function(){
    expect(Nehan.Html.tagSingle("img", {width:100, height:200})).toBe("<img width='100' height='200'/>");
  });

  it("Html.tagWrap", function(){
    expect(Nehan.Html.tagWrap("a", "homepage", {href:"foo"})).toBe("<a href='foo'>homepage</a>");
  });

  it("Html.normalize(comment disable)", function(){
    expect(Nehan.Html.normalize("hoge<!-- hige -->hage")).toBe("hogehage");
  });

  it("Html.normalize(disable rb/rp)", function(){
    expect(Nehan.Html.normalize("<ruby><rb>山</rb><rp>(</rp><rt>やま</rt><rp>)</rp></ruby>")).toBe("<ruby>山<rt>やま</rt></ruby>");
    expect(Nehan.Html.normalize("<ruby><RB>山</Rb><rp>(</rP><rt>やま</rt><Rp>)</RP></ruby>")).toBe("<ruby>山<rt>やま</rt></ruby>");
  });

  it("Html.normalize(disable empty rt)", function(){
    expect(Nehan.Html.normalize("<ruby><rb>山</rb><rp>(</rp><rt></rt><rp>)</rp></ruby>")).toBe("<ruby>山</ruby>");
  });
});
