describe("List", function(){
  it("List.iter should break if callback returns false", function(){
    var i = 0;
    // 1, 2, false
    Nehan.List.iter([1,2,3], function(x){
      i = x; 
      return x < 2;
    });
    expect(i).toBe(2);
  });

  it("List.reviter should break if callback returns false", function(){
    var i = 0;
    // 3, 2, false
    Nehan.List.reviter([1,2,3], function(x){
      i = x;
      return x > 2;
    });
    expect(i).toBe(2);
  });

  it("List.forall", function(){
    expect(Nehan.List.forall([1,2,3], function(x){ return x < 4; })).toBe(true);
    expect(Nehan.List.forall([1,2,3], function(x){ return x < 2; })).toBe(false);
  });

  it("List.map", function(){
    expect(Nehan.List.map([1,2,3], function(x){ return x * 2; })).toEqual([2,4,6]);
  });

  it("List.fold", function(){
    expect(Nehan.List.fold([1,2,3], 0, function(acm, x){ return acm + x; })).toBe(6);
  });

  it("List.filter", function(){
    expect(Nehan.List.filter([1,2,3], function(x){ return x % 2 === 0; })).toEqual([2]);
  });

  it("List.find", function(){
    expect(Nehan.List.find([1,2,3], function(x){ return x % 2 === 0; })).toEqual(2);
    expect(Nehan.List.find([1,2,3], function(x){ return x === 0; })).toEqual(null);
  });

  it("List.revfind", function(){
    expect(Nehan.List.revfind([1,2,3,4], function(x){ return x % 2 === 0; })).toEqual(4);
    expect(Nehan.List.revfind([1,2,3], function(x){ return x === 0; })).toEqual(null);
  });

  it("List.indexOf", function(){
    expect(Nehan.List.indexOf([1,2,3,4], Nehan.Closure.eq(2))).toBe(1);
    expect(Nehan.List.indexOf([1,2,3,4], Nehan.Closure.eq(0))).toBe(-1);
  });

  it("List.exists", function(){
    expect(Nehan.List.exists([1,2,3], Nehan.Closure.eq(2))).toBe(true);
    expect(Nehan.List.exists([1,2,3], Nehan.Closure.eq(0))).toBe(false);
  });

  it("List.mem", function(){
    expect(Nehan.List.mem([1,2,3], 2)).toBe(true);
    expect(Nehan.List.mem([1,2,3], 0)).toBe(false);
  });

  it("List.sum", function(){
    expect(Nehan.List.sum([1,2,3], 0, Nehan.Closure.id)).toBe(6);
  });

  it("List.minobj", function(){
    expect(Nehan.List.minobj([{val:2}, {val:3}, {val:0}, {val:4}], function(x){ return x.val; })).toEqual({val:0});
  });

  it("List.maxobj", function(){
    expect(Nehan.List.maxobj([{val:2}, {val:3}, {val:0}, {val:4}], function(x){ return x.val; })).toEqual({val:4});
  });

  it("List.last", function(){
    expect(Nehan.List.last([1])).toBe(1);
    expect(Nehan.List.last([1,2,3])).toBe(3);
    expect(Nehan.List.last([])).toBe(null);
  });

  it("List.zipArray", function(){
    expect(Nehan.List.zipArray([1,2,3], [4,5,6])).toEqual([[1,4],[2,5],[3,6]]);
  });

  it("should throw if length of each list is no same when List.zipArray", function(){
    var to_fail = function(){
      return Nehan.List.zipArray([1,2,3], [4,5]);
    };
    expect(to_fail).toThrow();
  });

  it("List.zipObject", function(){
    expect(Nehan.List.zipObject(["a","b","c"], [1,2,3])).toEqual({a:1, b:2, c:3});
  });

  it("should throw if length of each list is not same when List.zipObject", function(){
    var to_fail = function(){
      return Nehan.List.zipObject(["a","b","c"], [1,2]);
    };
    expect(to_fail).toThrow();
  });

  it("List.reverse", function(){
    expect(Nehan.List.reverse([1,2,3])).toEqual([3,2,1]);
  });

  it("List.reverse is immutable", function(){
    var orig = [1,2,3];
    var rev = Nehan.List.reverse(orig);
    expect(orig === rev).toBe(false);
  });

  it("List.create", function(){
    expect(Nehan.List.create(5, 0)).toEqual([0,0,0,0,0]);
    expect(Nehan.List.create(5, 1)).toEqual([1,1,1,1,1]);
  });
});

