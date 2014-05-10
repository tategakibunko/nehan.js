// lazy generator holds pre-yielded output in construction, and yields it once.
var LazyGenerator = (function(){
  function LazyGenerator(style, output){
    LayoutGenerator.call(this, style, null);
    this.output = output; // only output this gen yields.
  }
  Class.extend(LazyGenerator, LayoutGenerator);

  LazyGenerator.prototype.hasNext = function(){
    return !this._terminate;
  };

  LazyGenerator.prototype.yield = function(context){
    if(this._terminate){ // already yielded
      return null;
    }
    this._terminate = true; // yield only once.
    return this.output;
  };

  return LazyGenerator;
})();
