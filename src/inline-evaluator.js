var InlineEvaluator = Class.extend({
  init : function(parent_evaluator){
    this.parentEvaluator = parent_evaluator;
  },
  wrapInlineTag : function(markup, body){
    return [markup.getSrc(), body, markup.getCloseSrc()].join("");
  },
  evaluate : function(line, ctx){
    return Html.tagWrap("div", this.evalTextLineBody(line, line.tokens, ctx), {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalTextLineBody : function(line, tokens, ctx){
    var self = this;
    var body = List.fold(tokens, "", function(ret, element){
      return ret + self.evalInlineElement(line, element, ctx);
    });
    return line.markup? this.wrapInlineTag(line.markup, body) : body;
  },
  evalInlineElement : function(line, element, ctx){
    if(element._type === "text-line"){
      return this.evaluate(element, ctx);
    }
    if(element instanceof Ruby){
      return this.evalRuby(line, element, ctx);
    }
    if(Token.isText(element)){
      return this.evalText(line, element, ctx);
    }
    if(Token.isTag(element)){
      return this.evalTagSingle(line, element, ctx);
    }
    if(element instanceof Box){
      return this.evalInlineBox(element, ctx);
    }
    return "";
  },
  evalText : function(line, text, ctx){
    switch(text._type){
    case "word":
      return this.evalWord(line, text, ctx);
    case "tcy":
      return this.evalTcy(line, text, ctx);
    case "char":
      return this.evalChar(line, text, ctx);
    default:
      return "";
    }
  },
  evalTagSingle : function(line, tag, ctx){
    return tag.getSrc();
  },
  evalInlineBox : function(box, ctx){
    return this.parentEvaluator.evaluate(box, ctx);
  },
  evalWord : function(line, word, ctx){
    throw "not implemented: evalWord";
  },
  evalTcy : function(line, tcy, ctx){
    throw "not implemented: evalTcy";
  },
  evalChar : function(line, tcy, ctx){
    throw "not implemented: evalChar";
  }
});
