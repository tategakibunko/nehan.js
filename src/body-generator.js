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
    this._initContext(context);
    Nehan.SectionRootGenerator.call(this, context);
  }
  Nehan.Class.extend(BodyGenerator, Nehan.SectionRootGenerator);

  BodyGenerator.prototype._initContext = function(context){
    var markup = new Nehan.Tag("body", context.text);
    if(!context.style){
      context.style = context.createStyle(markup, null);
    }
    if(!context.stream){
      context.stream = new Nehan.TokenStream(context.text);
    }
  };

  BodyGenerator.prototype._createOutput = function(){
    var block = Nehan.BlockGenerator.prototype._createOutput.call(this);
    if(!block || block.isInvalidSize()){
      return null; // skip invalid block
    }
    block.seekPos = this.context.stream.getSeekPos();
    block.charPos = this.context.documentContext.getCharPos();
    block.percent = this.context.stream.getSeekPercent();
    block.pageNo = this.context.documentContext.getPageNo();

    this.context.documentContext.stepCharPos(block.charCount || 0);
    //this.context.documentContext.stepPageNo();

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(this.context.documentContext.getPageNo() >= Nehan.Config.maxPageCount){
      this.context.setTerminate(true);
    }

    // body output is treated as page box.
    this.context.addPage(block);
    return block;
  };

  return BodyGenerator;
})();
