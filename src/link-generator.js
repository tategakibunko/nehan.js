Nehan.LinkGenerator = (function(){
  var __add_anchor = function(style){
    var anchor_name = style.getMarkupAttr("name");
    if(anchor_name){
      DocumentContext.addAnchor(anchor_name);
    }
  };

  /**
     @memberof Nehan
     @class LinkGenerator
     @classdesc generator of &lt;a&gt; tag, set anchor context to {@link Nehan.DocumentContext} if exists.
     @constructor
     @extends {Nehan.InlineGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function LinkGenerator(style, stream){
    Nehan.InlineGenerator.call(this, style, stream);
    __add_anchor(style); // set anchor at this point
  }
  Nehan.Class.extend(LinkGenerator, Nehan.InlineGenerator);

  LinkGenerator.prototype._onComplete = function(context, output){
    __add_anchor(this.style); // overwrite anchor on complete
  };

  return LinkGenerator;
})();

