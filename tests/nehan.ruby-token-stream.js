describe("RubyTokenStream", function(){
  it("RubyTokenStream.get(single)", function(){
    var stream = new Nehan.RubyTokenStream("<rb>漢字</rb><rt>かんじ</rt>");
    var ruby = stream.get();
    expect(ruby instanceof Nehan.Ruby).toBe(true);
    expect(ruby.rbs.length).toBe(2); // 漢, 字
    expect(ruby.rbs[0].data).toBe("漢");
    expect(ruby.rbs[1].data).toBe("字");
    expect(ruby.rt instanceof Nehan.Tag).toBe(true);
    expect(ruby.rt.content).toBe("かんじ");
  });

  it("RubyTokenStream.get(many)", function(){
    var stream = new Nehan.RubyTokenStream("<rb>漢</rb><rt>かん</rt><rb>字</rb><rt>じ</rt>");
    var ruby = stream.get();
    expect(ruby instanceof Nehan.Ruby).toBe(true);
    expect(ruby.rbs.length).toBe(1); // 漢
    expect(ruby.rbs[0].data).toBe("漢");
    expect(ruby.rt instanceof Nehan.Tag).toBe(true);
    expect(ruby.rt.content).toBe("かん");
    var ruby2 = stream.get();
    expect(ruby2 instanceof Nehan.Ruby).toBe(true);
    expect(ruby2.rbs.length).toBe(1); // 字
    expect(ruby2.rbs[0].data).toBe("字");
    expect(ruby2.rt instanceof Nehan.Tag).toBe(true);
    expect(ruby2.rt.content).toBe("じ");
  });
});

