/*
test("class", function(){
  var Person = Class.extend({
    init: function(isDancing){
      this.dancing = isDancing;
    }
  });
  var Ninja = Person.extend({
    init: function(){
      this._super(false);
    }
  });
  var p = new Person(true);
  equal(p.dancing, true);
  equal(p instanceof Person, true);
  equal(p instanceof Ninja, false);

  var n = new Ninja();
  equal(n.dancing, false);
  equal(n instanceof Person, true);
  equal(n instanceof Ninja, true);
});
*/