test("corner-parser-simple", function(){
  var ret = CornerParser.normalize({
    "start-before":[10, 10],
    "start-after":[20, 20]
  }, "border-radius");

  deepEqual(ret, {
    "start-before":[10, 10],
    "end-before":[0, 0],
    "end-after":[0, 0],
    "start-after":[20, 20]
  });
});

test("corner-parser-single", function(){
  var ret = CornerParser.normalize(10, "border-radius");

  deepEqual(ret, {
    "start-before":[10,10],
    "end-before":[10,10],
    "end-after":[10,10],
    "start-after":[10,10]
  });
});
test("corner-parser-oneliner-full", function(){
  var ret = CornerParser.normalize("1 2 3 4/5 6 7 8", "border-radius");

  deepEqual(ret, {
    "start-before":["1", "5"],
    "end-before":["2", "6"],
    "end-after":["3", "7"],
    "start-after":["4", "8"]
  });
});

test("corner-parser-oneliner-half-2value", function(){
  var ret = CornerParser.normalize("1 2", "border-radius");

  deepEqual(ret, {
    "start-before":["1", "1"],
    "end-before":["2", "2"],
    "end-after":["1", "1"],
    "start-after":["2", "2"]
  });
});

test("corner-parser-oneliner-half-3value", function(){
  var ret = CornerParser.normalize("1 2 3", "border-radius");

  deepEqual(ret, {
    "start-before":["1", "1"],
    "end-before":["2", "2"],
    "end-after":["3", "3"],
    "start-after":["2", "2"]
  });
});

test("corner-parser-oneliner-half-4value", function(){
  var ret = CornerParser.normalize("1 2 3 4", "border-radius");

  deepEqual(ret, {
    "start-before":["1", "1"],
    "end-before":["2", "2"],
    "end-after":["3", "3"],
    "start-after":["4", "4"]
  });
});

