var FilteredTagStream = TokenStream.extend({
  init : function(src, fn){
    var order = 0;
    this._super(src);
    this.tokens = this.getAllIf(function(token){
      if(Token.isText(token)){
	return false;
      }
      if(fn(token)){
	token.order = order++;
	return true;
      }
    });
  }
});
