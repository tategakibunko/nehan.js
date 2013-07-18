test("selector-state-machine-single", function(){
  var machine = new SelectorStateMachine("h1");
  var h1 = new Tag("<h1>");
  equal(machine.accept(h1), true);
});

test("selector-state-machine-descend-1", function(){
  var machine = new SelectorStateMachine("h1 h2");
  var h2 = new Tag("<h2>");
  equal(machine.accept(h2), false);

  var h1 = new Tag("<h1>");
  h2.inherit(h1);
  equal(machine.accept(h2), true);
});

test("selector-state-machine-descend-2", function(){
  var machine = new SelectorStateMachine("h1 h2");
  var h2 = new Tag("<h2>");
  equal(machine.accept(h2), false);

  var div = new Tag("<div>");
  h2.inherit(div);
  equal(machine.accept(h2), false);

  var h1 = new Tag("<h1>");
  div.inherit(h1);
  equal(machine.accept(h2), true);
});

test("selector-state-machine-child-1", function(){
  var machine = new SelectorStateMachine("h1>h2");
  var h2 = new Tag("<h2>");
  equal(machine.accept(h2), false);

  var h1 = new Tag("<h1>");
  h2.inherit(h1);
  equal(machine.accept(h2), true);
});

test("selector-state-machine-child-2", function(){
  var machine = new SelectorStateMachine("h1>h2");
  var h2 = new Tag("<h2>");
  equal(machine.accept(h2), false);

  var div = new Tag("<div>");
  h2.inherit(div);
  equal(machine.accept(h2), false);

  var h1 = new Tag("<h1>");
  div.inherit(h1);
  equal(machine.accept(h2), false);
});

test("selector-state-machine-child-3", function(){
  var machine = new SelectorStateMachine("h1>h2>h3");
  var h3 = new Tag("<h3>");
  equal(machine.accept(h3), false);

  var h2 = new Tag("<h2>");
  h3.inherit(h2);
  equal(machine.accept(h3), false);

  var h1 = new Tag("<h1>");
  h2.inherit(h1);
  equal(machine.accept(h3), true);
});

test("selector-state-machine-adj-sibling-1", function(){
  var machine = new SelectorStateMachine("ul+p");
  var div = new Tag("<div>");
  var ul = new Tag("<ul>");
  var p = new Tag("<p>");

  ul.inherit(div);
  equal(machine.accept(p), false);

  p.inherit(div);
  equal(machine.accept(p), true);
});

test("selector-state-machine-gen-sibling-1", function(){
  var machine = new SelectorStateMachine("ul~p");
  var div = new Tag("<div>");
  var ul = new Tag("<ul>");
  var p = new Tag("<p>");
  var p2 = new Tag("<p>");

  ul.inherit(div);
  p.inherit(div);
  p2.inherit(div);

  equal(machine.accept(p), true);
  equal(machine.accept(p2), true);
});

