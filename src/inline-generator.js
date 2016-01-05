Nehan.InlineGenerator = (function(){
  /**
   @memberof Nehan
   @class InlineGenerator
   @classdesc inline level generator, output inline level block.
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
   */
  function InlineGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(InlineGenerator, Nehan.LayoutGenerator);

  InlineGenerator.prototype._yield = function(){
    while(this.hasNext()){
      var element = this._getNext();
      var result = this.context.addInlineElement(element);
      if(result === Nehan.Results.OK || result === Nehan.Results.SKIP){
	continue;
      }
      if(result === Nehan.Results.EOF ||
	 result === Nehan.Results.ZERO ||
	 result === Nehan.Results.LINE_BREAK ||
	 result === Nehan.Results.TOO_MANY_ROLLBACK ||
	 result === Nehan.Results.OVERFLOW){
	break;
      }
      console.error(result);
      throw result;
    }
    // skip continuous <br> if element is the last full-filled line.
    if(element && element.lineOver && this.context.child && !this.context.child.hasNext()){
      this.context.stream.skipIf(function(token){
	return (token instanceof Nehan.Tag && token.getName() === "br");
      });
    }
    return this._createOutput();
  };

  InlineGenerator.prototype._createOutput = function(){
    return this.context.createLineBox();
  };

  InlineGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this._popCache();
    }

    if(this.context.hasChildLayout()){
      return this.context.yieldChildLayout();
    }

    // read next token
    var token = this.context.stream.get();
    if(token === null){
      return null;
    }

    //console.log("inline token:%o", token);

    // text block
    if(token instanceof Nehan.Text){
      if(token.getContent() === ""){
	return this._getNext(); // skip
      }
      if(!this.context.isInsidePreBlock() && token.isWhiteSpaceOnly()){
	return this._getNext();
      }
      return this.context.createChildTextGenerator(token).yield();
    }

    // tcy, word
    if(token instanceof Nehan.Tcy || token instanceof Nehan.Word){
      return this.context.createChildTextGeneratorFromStream(
	new Nehan.TokenStream({tokens:[token]})
      ).yield();
    }

    // child inline without stream.
    switch(token.getName()){
    case "br":
      this.context.layoutContext.setLineBreak(true);
      if(!this.context.style.isPre()){
	this.context.stream.iterWhile(function(token){
	  return (token instanceof Nehan.Text && token.isWhiteSpaceOnly());
	});
      }
      return null;

    case "wbr":
      // this.context.layoutContext.setInlineWordBreakable(true); // TODO
      return this._getNext();

    case "page-break": case "end-page":
      this.context.setPageBreak(true);
      return null;

    default:
      break;
    }

    // if not text, it's tag token, inherit style
    var child_style = this.context.createChildStyle(token);

    if(child_style.isDisabled()){
      //console.warn("disabled style:%o(%s)", child_style, child_style.getMarkupName());
      return this._getNext(); // just skip
    }

    // if block element, break inline level, output current inline block,
    // and force terminate generator.
    // this token is parsed again by parent block generator.
    if(child_style.isBlock()){
      this.context.stream.prev();
      this.context.setTerminate(true);
      this.context.layoutContext.setLineBreak(true);
      return null;
    }

    var child_gen = this.context.createChildInlineGenerator(child_style);
    return child_gen.yield();
  };

  return InlineGenerator;
})();

