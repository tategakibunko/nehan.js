var RubyGenerator = (function(){
  function RubyGenerator(content, font_size){
    this.fontSize = font_size;
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
    yield : function(parent, start_pos, letter_spacing){
      this.backup();
      var ruby = this.stream.get();
      if(ruby === null){
	return null;
      }
      ruby.setStartPos(start_pos);

      // avoid overwriting metrics.
      if(!ruby.hasMetrics()){
	ruby.setMetrics(parent.flow, this.fontSize, letter_spacing);
      }
      return ruby;
    }
  };

  return RubyGenerator;
})();
