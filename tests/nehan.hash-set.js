describe("HashSet", function(){
  it("HashSet.add", function(){
    var hash = new Nehan.HashSet();
    hash.add("a", 10);
    expect(hash.get("a")).toBe(10);
    hash.add("a", 20);
    expect(hash.get("a")).toBe(20);
  });

  it("HashSet.addValues", function(){
    var hash = new Nehan.HashSet();
    hash.addValues({a:1, b:2});
    expect(hash.get("a")).toBe(1);
    expect(hash.get("b")).toBe(2);
  });

  it("HashSet.union", function(){
    var hash1 = new Nehan.HashSet({a:10});
    var hash2 = new Nehan.HashSet({b:20});
    var hash3 = new Nehan.HashSet({b:30, c:40});
    hash1 = hash1.union(hash2).union(hash3);
    expect(hash1.get("a")).toBe(10);
    expect(hash1.get("b")).toBe(30);
    expect(hash1.get("c")).toBe(40);
  });

  it("HashSet.merge", function(){
    // base class of hashset simply overwrites new-value to old-value.
    expect(new Nehan.HashSet().merge(1, 2)).toBe(2);
  });

  it("HashSet.remove", function(){
    expect(new Nehan.HashSet({a:10}).remove("a").get("a")).toBe(null);
  });
});
