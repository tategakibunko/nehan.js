var Padding = (function(){
  function Padding(){
    Edge.call(this, "padding");
  }
  Class.extend(Padding, Edge);

  Padding.prototype.clone = function(){
    return this.copyTo(new Padding());
  };

  return Padding;
})();

