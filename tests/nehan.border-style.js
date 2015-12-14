describe("BorderStyle", function(){
  var bs = new Nehan.BorderStyle();
  var flow = Nehan.BoxFlows.getByName("lr-tb");
  bs.setStyle(flow, {
    start:"solid",
    end:"underline",
    before:"dotted",
    after:"dashed"
  });

  it("BorderStyle.setStyle", function(){
    expect(bs.left).toBe("solid");
    expect(bs.right).toBe("underline");
    expect(bs.top).toBe("dotted");
    expect(bs.bottom).toBe("dashed");
  });

  it("BorderStyle.getCss", function(){
    var css = bs.getCss();
    expect(css["border-left-style"]).toBe("solid");
    expect(css["border-right-style"]).toBe("underline");
    expect(css["border-top-style"]).toBe("dotted");
    expect(css["border-bottom-style"]).toBe("dashed");
  });
});
