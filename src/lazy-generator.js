// lazy generator holds pre-yielded block in construction,
// and output it once when yielded later.
var LazyGenerator = (function(){
  function LazyGenerator(style, block){
    LayoutGenerator.call(this, style, null);
    this.block = block;
  }
  Class.extend(LazyGenerator, LayoutGenerator);

  LazyGenerator.prototype.hasNext = function(){
    return this._terminate === false;
  };

  LazyGenerator.prototype.yield = function(context){
    if(this._terminate){
      return null;
    }
    this._terminate = true; // yield only once.
    return this.block;
  };

  return LazyGenerator;
})();
