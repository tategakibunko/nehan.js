var RubyGenerator = ChildInlineTreeGenerator.extend({
  _yieldInlineElement : function(line){
    var ruby = this._super(line);
    if(typeof ruby === "number"){
      return ruby; // exception
    }
    // avoid overwriting metrics.
    if(!ruby.hasMetrics()){
      ruby.setMetrics(line.flow, line.font, line.letterSpacing || 0);
    }
    return ruby;
  }
});

