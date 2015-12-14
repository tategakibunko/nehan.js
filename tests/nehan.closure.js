describe("Nehan::Closure", function(){
  it("Closure.id", function(){
    expect(Nehan.Closure.id()(1)).toBe(1);
  });

  it("Closure.eq", function(){
    var is_one = Nehan.Closure.eq(1);
    expect(is_one(1)).toBe(true);
    expect(is_one(2)).toBe(false);
    expect(is_one(true)).toBe(false);
  });

  it("Closure.neq", function(){
    var is_not_one = Nehan.Closure.neq(1);
    expect(is_not_one(1)).toBe(false);
    expect(is_not_one(2)).toBe(true);
    expect(is_not_one(true)).toBe(true);
  });

  it("Closure.isTagName", function(){
    var is_tr_or_td = Nehan.Closure.isTagName(["tr", "td"]);
    expect(is_tr_or_td(new Nehan.Tag("tr"))).toBe(true);
    expect(is_tr_or_td(new Nehan.Tag("td"))).toBe(true);
    expect(is_tr_or_td(new Nehan.Tag("p"))).toBe(false);
    expect(is_tr_or_td(new Nehan.Text("foo"))).toBe(false);
    expect(is_tr_or_td(new Nehan.Char("a"))).toBe(false);
  });
});
