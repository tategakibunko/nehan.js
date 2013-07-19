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

test("selector-state-machine-first-child", function(){
  var machine = new SelectorStateMachine("li:first-child");
  var ul = new Tag("<ul>");
  var list1 = new Tag("<li>");
  var list2 = new Tag("<li>");
  var list3 = new Tag("<li>");
  list1.inherit(ul);
  list2.inherit(ul);
  list3.inherit(ul);

  equal(machine.accept(list1), true);
  equal(machine.accept(list2), false);
  equal(machine.accept(list3), false);
});

test("selector-state-machine-last-child", function(){
  var machine = new SelectorStateMachine("li:last-child");
  var ul = new Tag("<ul>");
  var list1 = new Tag("<li>");
  var list2 = new Tag("<li>");
  var list3 = new Tag("<li>");
  list1.inherit(ul);
  list2.inherit(ul);
  list3.inherit(ul);

  equal(machine.accept(list1), false);
  equal(machine.accept(list2), false);
  equal(machine.accept(list3), true);
});

test("selector-state-machine-xxx-of-type", function(){
  var machine;
  var div = new Tag("<div>");
  var ul1 = new Tag("<ul>");
  var p1 = new Tag("<p>");
  var p2 = new Tag("<p>");
  var p3 = new Tag("<p>");
  var ul2 = new Tag("<ul>");
  ul1.inherit(div);
  p1.inherit(div);
  p2.inherit(div);
  p3.inherit(div);
  ul2.inherit(div);

  machine = new SelectorStateMachine("p:first-of-type");
  equal(machine.accept(p1), true);
  equal(machine.accept(p2), false);
  equal(machine.accept(p3), false);
  machine = new SelectorStateMachine("ul:first-of-type");
  equal(machine.accept(ul1), true);
  equal(machine.accept(ul2), false);
  machine = new SelectorStateMachine("p:last-of-type");
  equal(machine.accept(p1), false);
  equal(machine.accept(p2), false);
  equal(machine.accept(p3), true);
  machine = new SelectorStateMachine("ul:last-of-type");
  equal(machine.accept(ul1), false);
  equal(machine.accept(ul2), true);
});
