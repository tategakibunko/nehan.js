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
      try {
	this.context.addInlineElement(element);
      } catch(e){
	break;
      }	
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
    var line = this.context.createLine();

    // call _onCreate callback for 'each' output
    this._onCreate(line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(line);
    }
    //console.log(">> line:%o, context = %o", line, context);
    return line;
  };

  InlineGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      var cache = this.context.popCache();
      return cache;
    }

    if(this.context.hasChildLayout()){
      // block context is delegated, but inline context is always re-constructed.
      // see LayoutGenerator::_createChildContext
      return this.context.yieldChildLayout();
    }

    // read next token
    var token = this.context.stream.get();
    if(token === null){
      return null;
    }

    //console.log("inline token:%o", token);

    // text block
    if(token instanceof Nehan.Text || token instanceof Nehan.Tcy || token instanceof Nehan.Word){
      return this.context.createChildTextGenerator(token).yield();
    }

    // child inline without stream.
    switch(token.getName()){
    case "br":
      this.context.layoutContext.setLineBreak(true);
      if(!this.context.style.isPre()){
	this.context.stream.skipUntil(function(token){
	  return (token instanceof Nehan.Text && token.isWhiteSpaceOnly());
	});
      }
      return null;

    case "wbr":
      // this.context.layoutContext.setInlineWordBreakable(true); // TODO
      return this._getNext();

    case "page-break": case "pbr": case "end-page":
      this.context.setBreakAfter(true);
      return null;

    default:
      break;
    }

    // if not text, it's tag token, inherit style
    var child_style = this.context.createChildStyle(token);

    if(child_style.isDisabled()){
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

