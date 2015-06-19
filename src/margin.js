var Margin = (function(){
  /**
     @memberof Nehan
     @class Margin
     @classdesc abstraction of physical margin
     @constructor
     @extends {Nehan.Edge}
  */
  function Margin(){
    Nehan.Edge.call(this, "margin");
  }
  Nehan.Class.extend(Margin, Nehan.Edge);

  /**
     @memberof Nehan.Margin
     @method clone
     @override
     @return {Nehan.Margin}
  */
  Margin.prototype.clone = function(){
    return this.copyTo(new Margin());
  };

  return Margin;
})();

