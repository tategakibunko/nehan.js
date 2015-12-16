describe("Set", function(){
  it("Set.add", function(){
    var set = new Nehan.Set();
    set.add(1);
    expect(set.length()).toBe(1);
    set.add(1);
    expect(set.length()).toBe(1);
    set.add(2);
    expect(set.length()).toBe(2);
  });

  it("Set.exists", function(){
    var set = new Nehan.Set();
    set.add(1);
    expect(set.exists(1)).toBe(true);
    set.add(2);
    expect(set.exists(2)).toBe(true);
    expect(set.exists(0)).toBe(false);
  });

  it("Set.length", function(){
    var set = new Nehan.Set();
    expect(set.length()).toBe(0);
    set.add(1);
    expect(set.length()).toBe(1);
    set.add(1);
    expect(set.length()).toBe(1);
    set.add(2);
    expect(set.length()).toBe(2);
  });

  it("Set.isEmpty", function(){
    var set = new Nehan.Set();
    expect(set.isEmpty()).toBe(true);
    set.add(1);
    expect(set.isEmpty()).toBe(false);
    set.remove(1);
    expect(set.isEmpty()).toBe(true);
  });

  it("Set.remove", function(){
    var set = new Nehan.Set();
    set.add(1);
    set.add(2);
    expect(set.length()).toBe(2);
    set.remove(1);
    expect(set.length()).toBe(1);
    set.remove(10); // not found
    expect(set.length()).toBe(1);
    set.remove(2);
    expect(set.length()).toBe(0);
  });

  it("Set.union", function(){
    var set1 = new Nehan.Set();
    var set2 = new Nehan.Set();
    set1.add(1);
    set1.add(2);
    set1.add(3);
    set2.add(2);
    set2.add(3);
    set2.add(4);

    var set3 = set1.union(set2);
    expect(set1.length()).toBe(3); // 1,2,3
    expect(set2.length()).toBe(3); // 2,3,4
    expect(set3.length()).toBe(4); // 1,2,3,4
    expect(set1 === set2).toBe(false);
    expect(set2 === set3).toBe(false);
    expect(set1 === set3).toBe(false);
  });
});
