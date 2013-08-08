var BodyBlockTreeGenerator = SectionRootGenerator.extend({
  _getBoxSize : function(){
    return Layout.getStdPageSize();
  },
  _createBox : function(size, parent){
    console.log(">>> body create box");
    var box = Layout.createRootBox(size, "body");
    this._setBoxStyle(box, null);
    box.percent = this.context.getSeekPercent();
    box.seekPos = this.context.getSeekPos();
    box.pageNo = this.context.getPageNo();
    box.charPos = this.context.getCharPos();
    box.css["font-size"] = Layout.fontSize + "px";
    return box;
  },
  _onCompleteBlock : function(page){
    console.log("<<< body complete block");
    // step page no and character count inside this page
    this.context.stepPageNo();
    this.context.addCharPos(page.getCharCount());
  }
});
