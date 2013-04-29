var RubyGenerator = (function(){
  function RubyGenerator(content){
    this.stream = new RubyStream(content);
  }

  RubyGenerator.prototype = {
    backup : function(){
      this.stream.backup();
    },
    rollback : function(){
      this.stream.rollback();
    },
    hasNext : function(){
      return this.stream.hasNext();
    },
    // ctx : LineContext
    yield : function(ctx){
      this.backup();
      var ruby = this.stream.get();
      if(ruby === null){
	return null;
      }
      ruby.setStartPos(ctx.curMeasure);

      // avoid overwriting metrics.
      if(!ruby.hasMetrics()){
	ruby.setMetrics(ctx.getParentFlow(), ctx.getInlineFontSize(), ctx.letterSpacing);
      }
      return ruby;
    }
  };

  return RubyGenerator;
})();
