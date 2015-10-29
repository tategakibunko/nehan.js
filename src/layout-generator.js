Nehan.LayoutGenerator = (function(){
  /**
     @memberof Nehan
     @class LayoutGenerator
     @classdesc root abstract class for all generator
     @constructor
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function LayoutGenerator(context){}

  /**
     @memberof Nehan.LayoutGenerator
     @method yield
     @param parent_context {Nehan.LayoutContext} - cursor context from parent generator
     @return {Nehan.Box}
  */
  LayoutGenerator.prototype.yield = function(context){
    // call _yield implemented in inherited class.
    var result = this._yield(context);

    // increment inner yield count
    if(result !== null){
      context.yieldCount++;
    }
    if(context.yieldCount > Nehan.Config.maxYieldCount){
      console.error("[%s]too many yield! gen:%o, context:%o, stream:%o", this.style.markupName, this, context, this.stream);
      throw "too many yield";
    }
    return result;
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  // called 'after' generated each element of target output is added to each context.
  LayoutGenerator.prototype._onAddElement = function(context, block){
  };

  // called 'after' output element is generated.
  LayoutGenerator.prototype._onCreate = function(context, output){
  };

  // called 'after' final output element is generated.
  LayoutGenerator.prototype._onComplete = function(context, output){
  };

  return LayoutGenerator;
})();

