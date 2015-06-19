var LazyGenerator = (function(){
  /**
     @memberof Nehan
     @class LazyGenerator
     @classdesc lazy generator holds pre-yielded output in construction, and yields it once.
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
     @param output {Nehan.Box} - pre yielded output
  */
  function LazyGenerator(style, output){
    LayoutGenerator.call(this, style, null);
    this.output = output; // only output this gen yields.
  }
  Nehan.Class.extend(LazyGenerator, LayoutGenerator);

  /**
     @memberof Nehan.LazyGenerator
     @method hasNext
     @override
     @return {boolean}
  */
  LazyGenerator.prototype.hasNext = function(){
    return !this._terminate;
  };

  /**
     @memberof Nehan.LazyGenerator
     @method yield
     @override
     @return {Nehan.Box}
  */
  LazyGenerator.prototype.yield = function(context){
    if(this._terminate){ // already yielded
      return null;
    }
    this._terminate = true; // yield only once.
    return this.output;
  };

  return LazyGenerator;
})();
