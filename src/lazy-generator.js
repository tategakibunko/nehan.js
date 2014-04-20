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
