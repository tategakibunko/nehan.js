var PhrasingTokenStream = TokenStream.extend({
  init : function(src){
    this._super(src);
    this.tokens = this.getAllIf(function(token){
      if(Token.isText(token)){
	return true;
      }
      return (token.isInline() || token.isInlineBlock());
    });
  }
});
