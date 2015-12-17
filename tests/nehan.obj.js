describe("Obj", function(){
  it("Obj.copy", function(){
    expect(Nehan.Obj.copy({}, {name:"taro", age:10})).toEqual({name:"taro", age:10});
    expect(Nehan.Obj.copy({name:"jiro"}, {name:"taro", age:10})).toEqual({name:"taro", age:10});
  });

  it("Obj.merge", function(){
    expect(Nehan.Obj.merge({}, {name:"taro", age:10}, {name:"jiro"}))
      .toEqual({name:"jiro", age:10});
    expect(Nehan.Obj.merge({extra:"info"}, {name:"taro", age:10}, {age:20}))
      .toEqual({name:"taro", age:20, extra:"info"});
  });

  it("Obj.map", function(){
    var original = {a:10, b:20};
    expect(Nehan.Obj.map(original, function(prop, value){
      return value.toString();
    })).toEqual({
      a:"10",
      b:"20"
    });

    expect(original).toBe(original); // original is not modified
  });

  it("Obj.createOne", function(){
    expect(Nehan.Obj.createOne("foo", 10)).toEqual({foo:10});
  });

  it("Obj.forall", function(){
    expect(Nehan.Obj.forall({a:10, b:20, c:11}, function(prop, val){
      return val % 2 === 0;
    })).toBe(false);

    expect(Nehan.Obj.forall({a:10, b:20, c:11}, function(prop, val){
      return val > 0;
    })).toBe(true);
  });
});
