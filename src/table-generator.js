var TableGenerator = ChildBlockTreeGenerator.extend({
  _onReadyBox : function(box, parent){
    if(this.context.markup.getCssAttr("border-collapse") === "collapse"){
      if(typeof this.collapse == "undefined"){
	Collapse.set(this.context.markup, box);
	this.collapse = true; // set collapse flag(means collapse already calcurated).
      }
    }
  },
  _onCreateBox : function(box, parent){
    box.partition = this.context.stream.getPartition(box);
  }
});
