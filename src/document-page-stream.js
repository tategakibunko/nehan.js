var DocumentPageStream = PageStream.extend({
  _createGenerator : function(text){
    return new DocumentGenerator(text);
  }
});
