Nehan.Margin = (function(){
  /**
   @memberof Nehan
   @class Margin
   @classdesc abstraction of physical margin
   @constructor
   @extends {Nehan.Edge}
   */
  function Margin(){
    Nehan.Edge.call(this);
  }
  Nehan.Class.extend(Margin, Nehan.Edge);

  /**
   @memberof Nehan.Margin
   @return {String}
   */
  Margin.prototype.getType = function(){
    return "margin";
  };

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

