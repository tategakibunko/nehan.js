var InlineTreeEvaluator = (function(){
  function InlineTreeEvaluator(parent_evaluator){
    this.parentEvaluator = parent_evaluator;
  }

  InlineTreeEvaluator.prototype = {
    evaluate : function(line){
      throw "InlineTreeEvaluator::evaluate not implemented";
    },
    evalTextLineBody : function(line, tokens){
      var self = this;
      var body = List.fold(tokens, "", function(ret, element){
	return ret + self.evalInlineElement(line, element);
      });
      if(line.isLinkLine()){
	return this.evalLinkLine(line, body);
      }
      return body;
    },
    evalLinkLine : function(line, body){
      var attr = {}, markup = line.markup;
      attr.href = markup.getTagAttr("href", "#");
      var name = markup.getTagAttr("name");
      if(name){
	markup.addClass("nehan-anchor");
	attr.name = name;
      }
      var title = markup.getTagAttr("title");
      if(title){
	attr.title = title;
      }
      var target = markup.getTagAttr("target");
      if(target){
	attr.target = target;
      }
      if(attr.href.indexOf("#") >= 0){
	markup.addClass("nehan-anchor-link");
      }
      attr["class"] = markup.getCssClasses();
      return Html.tagWrap("a", body, attr);
    },
    evalInlineElement : function(line, element){
      if(element._type === "text-line"){
	return this.evaluate(element);
      }
      if(element instanceof Ruby){
	return this.evalRuby(line, element);
      }
      if(Token.isText(element)){
	return this.evalText(line, element);
      }
      if(element instanceof Box){
	return this.evalInlineBox(line, element);
      }
      return "";
    },
    evalText : function(line, text){
      switch(text._type){
      case "word":
	return this.evalWord(line, text);
      case "tcy":
	var tcy = this.evalTcy(line, text);
	return line.textEmpha? this.evalEmpha(line, text, tcy) : tcy;
      case "char":
	var chr = this.evalChar(line, text);
	return line.textEmpha? this.evalEmpha(line, text, chr) : chr;
      default:
	return "";
      }
    },
    evalInlineBox : function(line, box){
      throw "not implemented: evalInlineBox";
    },
    evalWord : function(line, word){
      throw "not implemented: evalWord";
    },
    evalTcy : function(line, tcy){
      throw "not implemented: evalTcy";
    },
    evalChar : function(line, tcy){
      throw "not implemented: evalChar";
    }
  };

  return InlineTreeEvaluator;
})();

