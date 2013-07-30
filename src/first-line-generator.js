var FirstLineGenerator = ChildInlineTreeGenerator.extend({
  _createLine : function(parent){
    // first-line already created, so clear static attr for first-line tag.
    if(!this.context.isStreamHead()){
      this.context.markup.cssAttrStatic = {};
    }
    return this._super(parent);
  }
});

