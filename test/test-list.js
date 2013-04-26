test("list", function(){
  var list = [1,2,3];
  var tmp = 0;

  // iter
  List.iter([1,2,3], function(x){ tmp = x; });
  equal(tmp, 3);
  List.iteri([1,2,3], function(i, x){ tmp = i; });
  equal(tmp, 2);

  // map
  deepEqual(List.map([1,2,3], function(x){ return x + 1; }), [2,3,4]);

  // mapi
  deepEqual(List.mapi([1,2,3], function(i, x){ return x + i; }), [1,3,5]);

  // filter
  deepEqual(List.filter([1,2,3], function(x){ return x % 2 == 0; }), [2]);

  // exists
  equal(List.exists([1,2,3], function(x){ return x == 4; }), false);
  ok(List.exists([1,2,3], function(x){ return x == 2; }), true);

  // fold
  equal(List.fold([1,2,3], 0, function(ret, x){ return ret + x; }), 6);

  // find
  equal(List.find([1,2,3], function(x){ return x == 4 }), null);
  equal(List.find([1,2,3], function(x){ return x == 1 }), 1);

  // sum
  equal(List.sum([1,2,3]), 6);

  // max obj
  equal(List.maxobj([3,1,2], Closure.id()), 3);

  deepEqual(List.maxobj([{age:10}, {age:20}, {age:30}], function(obj){
    return obj.age;
  }), {age:30});

  // min obj
  equal(List.minobj([3,1,2], Closure.id()), 1);

  // refcopy
  deepEqual(List.refcopy([{hoge:100}]), [{hoge:100}]);
});

