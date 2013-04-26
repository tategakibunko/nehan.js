var DirectTokenStream = TokenStream.extend({
  init : function(tokens){
    this._super("");
    this.tokens = tokens;
  },
  isEmpty : function(){
    return this.tokens.length === 0;
  }
});
