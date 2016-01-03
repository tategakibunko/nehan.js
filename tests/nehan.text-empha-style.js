describe("TextEmphaStyle", function(){
  it("TextEmphaStyle.isEnable(none)", function(){
    expect(new Nehan.TextEmphaStyle().isEnable()).toBe(false);
    expect(new Nehan.TextEmphaStyle("none").isEnable()).toBe(false);
  });

  it("TextEmphaStyle.isEnable(enabled)", function(){
    expect(new Nehan.TextEmphaStyle("filled dot").isEnable()).toBe(true);
  });

  it("TextEmphaStyle.getText(none)", function(){
    expect(new Nehan.TextEmphaStyle().getText()).toBe("");
    expect(new Nehan.TextEmphaStyle("none").getText()).toBe("");
  });

  it("TextEmphaStyle.getText(filled dot)", function(){
    expect(new Nehan.TextEmphaStyle("filled dot").getText()).toBe("&#x2022;");
  });

  it("TextEmphaStyle.getText(open dot)", function(){
    expect(new Nehan.TextEmphaStyle("open dot").getText()).toBe("&#x25E6;");
  });

  it("TextEmphaStyle.getText(filled circle)", function(){
    expect(new Nehan.TextEmphaStyle("filled circle").getText()).toBe("&#x25CF;");
  });

  it("TextEmphaStyle.getText(open circle)", function(){
    expect(new Nehan.TextEmphaStyle("open circle").getText()).toBe("&#x25CB;");
  });

  it("TextEmphaStyle.getText(filled double-circle)", function(){
    expect(new Nehan.TextEmphaStyle("filled double-circle").getText()).toBe("&#x25C9;");
  });

  it("TextEmphaStyle.getText(open double-circle)", function(){
    expect(new Nehan.TextEmphaStyle("open double-circle").getText()).toBe("&#x25CE;");
  });

  it("TextEmphaStyle.getText(filled triangle)", function(){
    expect(new Nehan.TextEmphaStyle("filled triangle").getText()).toBe("&#x25B2;");
  });

  it("TextEmphaStyle.getText(open triangle)", function(){
    expect(new Nehan.TextEmphaStyle("open triangle").getText()).toBe("&#x25B3;");
  });

  it("TextEmphaStyle.getText(filled sesame)", function(){
    expect(new Nehan.TextEmphaStyle("filled sesame").getText()).toBe("&#xFE45;");
  });

  it("TextEmphaStyle.getText(open sesame)", function(){
    expect(new Nehan.TextEmphaStyle("open sesame").getText()).toBe("&#xFE46;");
  });
});
