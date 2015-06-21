var BodyGenerator = (function(){
  /**
     @memberof Nehan
     @class BodyGenerator
     @classdesc generator of &lt;body&gt; element
     @extends Nehan.SectionRootGenerator
     @constructor
     @param text {string} - content source of html
  */
  function BodyGenerator(text){
    var tag = new Nehan.Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Nehan.Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(context, block){
    block.seekPos = this.stream.getSeekPos();
    block.charPos = DocumentContext.getCharPos();
    block.percent = this.stream.getSeekPercent();
    block.pageNo = DocumentContext.getPageNo();
    if(Config.capturePageText){
      block.text = block.toString();
    }

    DocumentContext.stepCharPos(block.charCount || 0);
    DocumentContext.stepPageNo();

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(DocumentContext.getPageNo() >= Config.maxPageCount){
      this.setTerminate(true);
    }
  };

  return BodyGenerator;
})();
