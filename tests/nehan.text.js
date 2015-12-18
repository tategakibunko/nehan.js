describe("Text", function(){
  it("Text.isWhiteSpaceOnly", function(){
    expect(new Nehan.Text(" \t\n").isWhiteSpaceOnly()).toBe(true);
    expect(new Nehan.Text("a \t\n").isWhiteSpaceOnly()).toBe(false);
  });

  it("Text.getContent", function(){
    expect(new Nehan.Text("あいう").getContent()).toBe("あいう");
  });

  it("Text.getHeadChar", function(){
    expect(new Nehan.Text("あいう").getHeadChar().data).toBe("あ");
  });

  it("Text.cutHeadChar", function(){
    expect(new Nehan.Text("あいう").cutHeadChar().getContent()).toBe("いう");
  });
});
