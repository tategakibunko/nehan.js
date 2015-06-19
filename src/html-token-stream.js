var HtmlTokenStream = (function(){
  /**
     @memberof Nehan
     @class HtmlTokenStream
     @classdesc token stream for &lt;html&gt; tag(head, body).
     @extends {Nehan.TokenStream}
     @param src {String} - content text of &lt;html&gt; tag.
  */
  function HtmlTokenStream(src){
    TokenStream.call(this, src, {
      filter:function(tag){
	if(token instanceof Nehan.Tag === false){
	  return false;
	}
	var name = tag.getName();
	return (name === "head" || name === "body");
      }
    });
  }
  Class.extend(HtmlTokenStream, TokenStream);

  return HtmlTokenStream;
})();

