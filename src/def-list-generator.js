var DefListGenerator = ChildPageGenerator.extend({
  _createStream : function(){
    return new DefListTagStream(this.markup.content);
  }
});
