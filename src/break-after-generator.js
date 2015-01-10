var BreakAfterGenerator = (function(){
  /**
     @memberof Nehan
     @class BreakAfterGenerator
     @classdesc generate layout that breaks page when finished.
     @constructor
     @extends {Nehan.InlineGenerator}
     @param style {Nehan.StyleContext}
  */
  function BreakAfterGenerator(style){
    InlineGenerator.call(this, style, null, null);
  }
  Class.extend(BreakAfterGenerator, InlineGenerator);

  /**
     @memberof Nehan.BreakAfterGenerator
     @return {boolean}
  */
  BreakAfterGenerator.prototype.hasNext = function(){
    return !this._terminate;
  };

  BreakAfterGenerator.prototype._yield = function(context){
    context.setBreakAfter(true);
    this._terminate = true;
    return this.style.createBreakLine();
  };

  return BreakAfterGenerator;
})();

