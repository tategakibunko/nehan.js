describe("Nehan.Args", function(){
  it("Args::copy", function(){
    expect(Nehan.Args.copy({}, {name:"taro", age:10})).toEqual({name:"taro", age:10});
    expect(Nehan.Args.copy({name:"jiro"}, {name:"taro", age:10})).toEqual({name:"taro", age:10});
  });

  it("Args::merge", function(){
    expect(Nehan.Args.merge({}, {name:"taro", age:10}, {name:"jiro"}))
      .toEqual({name:"jiro", age:10});
    expect(Nehan.Args.merge({extra:"info"}, {name:"taro", age:10}, {age:20}))
      .toEqual({name:"taro", age:20, extra:"info"});
  });
});
