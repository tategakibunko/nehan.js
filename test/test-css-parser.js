test("css-parser-4d-edge", function(){
  deepEqual(CssParser.format("margin", ""), {before:"", end:"", after:"", start:""});
  deepEqual(CssParser.format("margin", "1"), {before:"1", end:"1", after:"1", start:"1"});
  deepEqual(CssParser.format("margin", "1 2"), {before:"1", end:"2", after:"1", start:"2"});
  deepEqual(CssParser.format("margin", "1 2 3"), {before:"1", end:"2", after:"3", start:"2"});
  deepEqual(CssParser.format("margin", "1 2 3 4"), {before:"1", end:"2", after:"3", start:"4"});
  deepEqual(CssParser.format("margin", "1 2 3 4 5"), {before:"1", end:"2", after:"3", start:"4"});
  deepEqual(CssParser.format("margin", {before:"1", end:"2", after:"3", start:"4"}), {before:"1", end:"2", after:"3", start:"4"});
});

test("css-parser-4d-corner", function(){
  deepEqual(
    CssParser.format("border-radius", "1"), {
      "start-before":["1", "1"],
      "end-before":["1", "1"],
      "end-after":["1", "1"],
      "start-after":["1", "1"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2"), {
      "start-before":["1", "1"],
      "end-before":["2", "2"],
      "end-after":["1", "1"],
      "start-after":["2", "2"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2 3"), {
      "start-before":["1", "1"],
      "end-before":["2", "2"],
      "end-after":["3", "3"],
      "start-after":["2", "2"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2 3 4"), {
      "start-before":["1", "1"],
      "end-before":["2", "2"],
      "end-after":["3", "3"],
      "start-after":["4", "4"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2 3 4 5"), {
      "start-before":["1", "1"],
      "end-before":["2", "2"],
      "end-after":["3", "3"],
      "start-after":["4", "4"]
    });

  deepEqual(
    CssParser.format("border-radius", "1/5"), {
      "start-before":["1", "5"],
      "end-before":["1", "5"],
      "end-after":["1", "5"],
      "start-after":["1", "5"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2/5 6"), {
      "start-before":["1", "5"],
      "end-before":["2", "6"],
      "end-after":["1", "5"],
      "start-after":["2", "6"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2 3/5 6 7"), {
      "start-before":["1", "5"],
      "end-before":["2", "6"],
      "end-after":["3", "7"],
      "start-after":["2", "6"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2 3 4/5 6 7 8"), {
      "start-before":["1", "5"],
      "end-before":["2", "6"],
      "end-after":["3", "7"],
      "start-after":["4", "8"]
    });

  deepEqual(
    CssParser.format("border-radius", "1 2 3 4 5/5 6 7 8 9"), {
      "start-before":["1", "5"],
      "end-before":["2", "6"],
      "end-after":["3", "7"],
      "start-after":["4", "8"]
    });

  deepEqual(
    CssParser.format("border-radius", "1/5 6 7 8 9"), {
      "start-before":["1", "5"],
      "end-before":["1", "6"],
      "end-after":["1", "7"],
      "start-after":["1", "8"]
    });
});