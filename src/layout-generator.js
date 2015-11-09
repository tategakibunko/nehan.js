Nehan.LayoutGenerator = (function(){
  /**
   @memberof Nehan
   @class LayoutGenerator
   @classdesc root abstract class for all generator
   @constructor
   @param context {Nehan.RenderingContext}
   */
  function LayoutGenerator(context){
    this.context = context;
    this.context.setOwnerGenerator(this);
  }

  /**
   @memberof Nehan.LayoutGenerator
   @method hasNext
   @return {bool}
   */
  LayoutGenerator.prototype.hasNext = function(){
    return this.context.hasNext();
  };

  /**
   @memberof Nehan.LayoutGenerator
   @method yield
   @param parent_context {Nehan.LayoutContext} - cursor context from parent generator
   @return {Nehan.Box}
   */
  LayoutGenerator.prototype.yield = function(){
    this.context.initLayoutContext();
    
    // call _yield implemented in inherited class.
    console.group("%s _yield", this.context.getGeneratorName());
    var box = this._yield();
    console.groupEnd();

    // increment yield count
    this.context.yieldCount++;

    // to avoid infinite loop, raise error if too many yielding.
    if(this.context.yieldCount > Nehan.Config.maxYieldCount){
      console.error("[%s]too many yield!:%o", this.context.getGeneratorName(), this);
      throw "too many yield";
    }
    return box;
  };

  LayoutGenerator.prototype._yield = function(){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  // called 'after' generated each element of target output is added to each context.
  LayoutGenerator.prototype._onAddElement = function(block){
  };

  // called 'after' output element is generated.
  LayoutGenerator.prototype._onCreate = function(output){
  };

  // called 'after' final output element is generated.
  LayoutGenerator.prototype._onComplete = function(output){
  };

  return LayoutGenerator;
})();

