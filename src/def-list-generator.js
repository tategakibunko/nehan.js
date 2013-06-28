var DefListGenerator = ChildBlockTreeGenerator.extend({
  _createStream : function(){
    return new DefListTagStream(this.markup.content);
  }
});
