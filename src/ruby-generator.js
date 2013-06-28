var RubyGenerator = ChildInlineTreeGenerator.extend({
  _createStream : function(){
    return new RubyStream(this.markup.getContent());
  },
  _yieldElement : function(ctx){
    var ruby = this._super(ctx);
    ruby.setStartPos(ctx.curMeasure);

    // avoid overwriting metrics.
    if(!ruby.hasMetrics()){
      ruby.setMetrics(ctx.getParentFlow(), this.markup.fontSize, this.markup.letterSpacing);
    }
    console.log("yielded ruby! : %o", ruby);
    return ruby;
  }
});

