var RubyGenerator = (function(){
  function RubyGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
  }
  Class.extend(RubyGenerator, ChildInlineTreeGenerator);

  RubyGenerator.prototype._yieldInlineElement = function(line){
    var ruby = ChildInlineTreeGenerator.prototype._yieldInlineElement.call(this, line);
    if(typeof ruby === "number"){
      return ruby; // exception
    }
    // avoid overwriting metrics.
    if(!ruby.hasMetrics()){
      ruby.setMetrics(line.flow, line.font, line.letterSpacing || 0);
    }
    return ruby;
  };

  return RubyGenerator;
})();

