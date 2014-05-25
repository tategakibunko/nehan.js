var BreakAfterGenerator = (function(){
  function BreakAfterGenerator(style){
    InlineGenerator.call(this, style, null, null);
  }
  Class.extend(BreakAfterGenerator, InlineGenerator);

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

