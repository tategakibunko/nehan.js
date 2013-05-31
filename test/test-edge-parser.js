test("edge-parser", function(){
  var ret;
  ret = EdgeParser.parse({start:0, after:1});
  deepEqual(ret, {start:0, after:1});

  ret = EdgeParser.parse([1]);
  deepEqual(ret, {before:1, end:1, after:1, start:1});

  ret = EdgeParser.parse(1);
  deepEqual(ret, {before:1, end:1, after:1, start:1});

  ret = EdgeParser.parse([1, 2]);
  deepEqual(ret, {before:1, end:2, after:1, start:2});

  ret = EdgeParser.parse([1, 2, 3]);
  deepEqual(ret, {before:1, end:2, after:3, start:2});

  ret = EdgeParser.parse([1, 2, 3, 4]);
  deepEqual(ret, {before:1, end:2, after:3, start:4});

  ret = EdgeParser.parse("1");
  deepEqual(ret, {before:"1", end:"1", after:"1", start:"1"});

  ret = EdgeParser.parse("1 2");
  deepEqual(ret, {before:"1", end:"2", after:"1", start:"2"});

  ret = EdgeParser.parse("1 2 3");
  deepEqual(ret, {before:"1", end:"2", after:"3", start:"2"});

  ret = EdgeParser.parse("1 2 3 4");
  deepEqual(ret, {before:"1", end:"2", after:"3", start:"4"});
});
