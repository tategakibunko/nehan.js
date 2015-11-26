Nehan.LazyGenerator = (function(){
  /**
   @memberof Nehan
   @class LazyGenerator
   @classdesc lazy generator holds pre-yielded output in construction, and yields it once.
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
   */
  function LazyGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(LazyGenerator, Nehan.LayoutGenerator);

  /**
     @memberof Nehan.LazyGenerator
     @method hasNext
     @override
     @return {boolean}
  */
  LazyGenerator.prototype.hasNext = function(){
    return this.context.terminate !== true;
  };

  /**
     @memberof Nehan.LazyGenerator
     @method yield
     @override
     @return {Nehan.Box}
  */
  LazyGenerator.prototype._yield = function(){
    if(this.context.terminate){
      return null;
    }
    if(this.context.isBreakBefore()){
      return null;
    }
    this.context.setTerminate(true);
    if(this.context.isBreakAfter()){
      this.context.lazyOutput.breakAfter = true;
    }
    return this.context.lazyOutput;
  };

  return LazyGenerator;
})();
