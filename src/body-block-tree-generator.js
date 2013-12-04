var BodyBlockTreeGenerator = (function(){
  function BodyBlockTreeGenerator(context){
    SectionRootGenerator.call(this, context);
  }
  Class.extend(BodyBlockTreeGenerator, SectionRootGenerator);

  BodyBlockTreeGenerator.prototype._getBoxSize = function(){
    return Layout.getStdPageSize();
  };

  BodyBlockTreeGenerator.prototype._createBox = function(size, parent){
    var box = Layout.createRootBox(size, "body");
    this._setBoxStyle(box, null);
    box.percent = this.context.getSeekPercent();
    box.seekPos = this.context.getSeekPos();
    box.pageNo = this.context.getPageNo();
    box.charPos = this.context.getCharPos();
    return box;
  };

  BodyBlockTreeGenerator.prototype._onCompleteBlock = function(page){
    // step page no and character count inside this page
    this.context.stepPageNo();
    this.context.addCharPos(page.getCharCount());
  };

  return BodyBlockTreeGenerator;
})();

