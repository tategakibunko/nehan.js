Nehan.BodyGenerator = (function(){
  /**
   @memberof Nehan
   @class BodyGenerator
   @classdesc generator of &lt;body&gt; element
   @extends Nehan.SectionRootGenerator
   @constructor
   @param context {Nehan.RenderingContext}
   */
  function BodyGenerator(context){
    Nehan.SectionRootGenerator.call(this, context);
  }
  Nehan.Class.extend(BodyGenerator, Nehan.SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(block){
    if(!block){
      return;
    }
    block.seekPos = this.context.stream.getSeekPos();
    block.charPos = this.context.documentContext.getCharPos();
    block.percent = this.context.stream.getSeekPercent();
    block.pageNo = this.context.documentContext.getPageNo();

    this.context.documentContext.stepCharPos(block.charCount || 0);
    this.context.documentContext.stepPageNo();

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(this.context.documentContext.getPageNo() >= Nehan.Config.maxPageCount){
      this.context.setTerminate(true);
    }
  };

  return BodyGenerator;
})();
