var Margin = (function(){
  function Margin(){
    Edge.call(this, "margin");
  }
  Class.extend(Margin, Edge);

  Margin.prototype.clone = function(){
    return this.copyTo(new Margin());
  };

  return Margin;
})();

