var RubyGenerator = (function(){
  function RubyGenerator(markup){
    this.markup = markup;
    this.stream = new RubyStream(markup.content);
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
	ruby.setMetrics(ctx.getParentFlow(), this.markup.fontSize, this.markup.letterSpacing);
      }
      return ruby;
    }
  };

  return RubyGenerator;
})();
