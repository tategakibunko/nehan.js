Nehan.BodyGenerator = (function(){
  /**
     @memberof Nehan
     @class BodyGenerator
     @classdesc generator of &lt;body&gt; element
     @extends Nehan.SectionRootGenerator
     @constructor
     @param text {string} - content source of html
  */
  function BodyGenerator(context){
    Nehan.SectionRootGenerator.call(this, context);
  }
  Nehan.Class.extend(BodyGenerator, Nehan.SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(context, block){
    block.seekPos = context.stream.getSeekPos();
    block.charPos = context.documentContext.getCharPos();
    block.percent = context.stream.getSeekPercent();
    block.pageNo = context.documentContext.getPageNo();

    context.documentContext.stepCharPos(block.charCount || 0);
    context.documentContext.stepPageNo();

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(context.documentContext.getPageNo() >= Nehan.Config.maxPageCount){
      this.setTerminate(true);
    }
  };

  return BodyGenerator;
})();
