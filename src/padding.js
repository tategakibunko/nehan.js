var Padding = (function(){
  /**
     @memberof Nehan
     @class Padding
     @classdesc abstraction of padding.
     @extends {Nehan.Edge}
  */
  function Padding(){
    Edge.call(this, "padding");
  }
  Class.extend(Padding, Edge);

  /**
     @memberof Nehan.Padding
     @override
     @return {Nehan.Padding}
  */
  Padding.prototype.clone = function(){
    return this.copyTo(new Padding());
  };

  return Padding;
})();

