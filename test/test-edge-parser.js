test("edge-parser", function(){
  var ret;

  // declared as object
  ret = EdgeParser.normalize({start:0, after:1});
  deepEqual(ret, {before:0, end:0, after:1, start:0});

  // declared as array
  ret = EdgeParser.normalize([1]);
  deepEqual(ret, {before:1, end:1, after:1, start:1});

  ret = EdgeParser.normalize([1, 2]);
  deepEqual(ret, {before:1, end:2, after:1, start:2});

  ret = EdgeParser.normalize([1, 2, 3]);
  deepEqual(ret, {before:1, end:2, after:3, start:2});

  ret = EdgeParser.normalize([1, 2, 3, 4]);
  deepEqual(ret, {before:1, end:2, after:3, start:4});
  
  // declared as one-liner
  ret = EdgeParser.normalize("1");
  deepEqual(ret, {before:"1", end:"1", after:"1", start:"1"});

  ret = EdgeParser.normalize("1 2");
  deepEqual(ret, {before:"1", end:"2", after:"1", start:"2"});

  ret = EdgeParser.normalize("1 2 3");
  deepEqual(ret, {before:"1", end:"2", after:"3", start:"2"});

  ret = EdgeParser.normalize("1 2 3 4");
  deepEqual(ret, {before:"1", end:"2", after:"3", start:"4"});
});
