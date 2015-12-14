describe("Clear", function(){
  it("Clear.hasDirection", function(){
    expect(new Nehan.Clear("start").hasDirection("start")).toBe(true);
    expect(new Nehan.Clear("start").hasDirection("end")).toBe(false);
    expect(new Nehan.Clear("end").hasDirection("end")).toBe(true);
    expect(new Nehan.Clear("end").hasDirection("start")).toBe(false);
    expect(new Nehan.Clear("both").hasDirection("start")).toBe(true);
    expect(new Nehan.Clear("both").hasDirection("end")).toBe(true);
  });

  it("Clear.setDone, Clear.isDoneAll", function(){
    var start = new Nehan.Clear("start");
    var end = new Nehan.Clear("end");
    var both = new Nehan.Clear("both");

    // start
    expect(start.isDoneAll()).toBe(false);
    start.setDone("start");
    expect(start.isDoneAll()).toBe(true);

    // end
    expect(end.isDoneAll()).toBe(false);
    end.setDone("end");
    expect(end.isDoneAll()).toBe(true);

    // both
    expect(both.isDoneAll()).toBe(false);
    both.setDone("start");
    expect(both.isDoneAll()).toBe(false);
    both.setDone("end");
    expect(both.isDoneAll()).toBe(true);
  });
});

