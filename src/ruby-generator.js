var RubyGenerator = ChildInlineTreeGenerator.extend({
  _createStream : function(){
    return new RubyTagStream(this.markup.getContent());
  },
  _yieldElement : function(ctx){
    var ruby = this._super(ctx);
    if(typeof ruby === "number"){
      return ruby; // exception
    }
    // avoid overwriting metrics.
    if(!ruby.hasMetrics()){
      ruby.setMetrics(ctx.getLineFlow(), ctx.getFontSize(), ctx.getLetterSpacing());
    }
    return ruby;
  }
});

