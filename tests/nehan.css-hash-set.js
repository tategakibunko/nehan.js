describe("CssHashSet", function(){
  it("CssHashSet.add(atom)", function(){
    var set = new Nehan.CssHashSet();
    set.add("foo", 10);
    expect(set.get("foo")).toBe(10);
    set.add("foo", 20);
    expect(set.get("foo")).toBe(20);
  });

  it("CssHashSet.add(object)", function(){
    var set = new Nehan.CssHashSet();
    set.add("foo", {a:1});
    expect(set.get("foo")).toEqual({a:1});
    set.add("foo", {a:10});
    expect(set.get("foo")).toEqual({a:10});
    set.add("foo", {a:10, b:20});
    expect(set.get("foo")).toEqual({a:10, b:20});

    set.add("foo", {b:{c:1, d:2}});
    expect(set.get("foo")).toEqual({a:10, b:{c:1, d:2}});
  });
});
