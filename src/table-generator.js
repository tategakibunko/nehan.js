var TableGenerator = ChildPageGenerator.extend({
  _createStream : function(){
    return new TableTagStream(this.markup);
  },
  _onReadyBox : function(box, parent){
    if(this.markup.getCssAttr("border-collapse") === "collapse"){
      if(typeof this.collapse == "undefined"){
	Collapse.set(this.markup, box);
	this.collapse = true; // set collapse flag(means collapse already calcurated).
      }
    }
  },
  _onCompleteBox : function(box, parent){
    box.partition = this.stream.getPartition(box);
  }
});
