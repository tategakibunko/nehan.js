var ListItemMarkGenerator = ParaChildGenerator.extend({
  _getBoxType : function(){
    return "li-marker";
  },
  _createStream : function(){
    return new TokenStream(this.markup.marker);
  }
});
