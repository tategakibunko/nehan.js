var InlineEvaluator = Class.extend({
  init : function(parent_evaluator){
    this.parentEvaluator = parent_evaluator;
  },
  evaluate : function(line, ctx){
    switch(line._type){
    case "text-line":
      return this.evalTextLine(line, ctx);
    case "ruby-line":
      return this.evalRubyLine(line, ctx);
    }
  },
  evalTextLine : function(line, ctx){
    return Html.tagWrap("div", this.evalTextLineBody(line, ctx), {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalTextLineBody : function(line, ctx){
    var self = this;
    return [
      this.evalOpenTagStack(line, ctx),
      List.fold(line.tokens, "", function(ret, element){
	return ret + self.evalInlineElement(line, element, ctx);
      }),
      this.evalCloseTagStack(line, ctx)
    ].join("");
  },
  evalRubyLine : function(line, ctx){
    var ruby_line_body = this.evalRubyLineBody(line, ctx);
    var empha_chars = this.evalEmphaChars(line, ctx);
    return Html.tagWrap("div", ruby_line_body + empha_chars, {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalEmphaChars : function(line, ctx){
    var self = this;
    return List.fold(line.emphaChars, "", function(ret, text){
      return ret + self.evalEmphaChar(line, text, ctx);
    });
  },
  evalRubyLineBody : function(line, ctx){
    var self = this;
    return List.fold(line.tokens, "", function(ret, label){
      return ret + self.evalRubyLabel(line, label, ctx);
    });
  },
  evalRubyLabel : function(line, label, ctx){
    throw "not implemented:evalRubyLabel";
  },
  evalEmphaChar : function(line, text, ctx){
    throw "not implemented:evalEmphaChar";
  },
  evalOpenTagStack : function(line, ctx){
    var self = this;
    var stack = ctx.getInlineTagStack();
    return List.fold(stack.tags, "", function(ret, tag){
      return ret + self.evalTagOpen(line, tag, ctx, false);
    });
  },
  evalCloseTagStack : function(line, ctx){
    var self = this;
    var stack = ctx.getInlineTagStack();
    return List.fold(stack.tags, "", function(ret, tag){
      return ret + self.evalTagClose(line, tag.getCloseTag(), ctx, false);
    });
  },
  evalInlineElement : function(line, element, ctx){
    if(Token.isText(element)){
      return this.evalText(line, element, ctx);
    }
    if(Token.isTag(element)){
      return this.evalTag(line, element, ctx);
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
  evalTag : function(line, tag, ctx){
    if(tag.isSingleTag()){
      return this.evalTagSingle(line, tag, ctx);
    }
    if(tag.isOpen()){
      return this.evalTagOpen(line, tag, ctx, true);
    }
    return this.evalTagClose(line, tag, ctx, true);
  },
  evalTagOpen : function(line, tag, ctx, update){
    if(update){
      ctx.pushInlineTag(tag, line);
    }
    return this.evalTagOpenBody(line, tag, ctx);
  },
  evalTagCss : function(line, tag, ctx){
    var css = {};
    if(tag.fontSize){
      css["font-size"] = tag.fontSize + "px";
      css["line-height"] = "1em";
    }
    if(tag.fontColor){
      css.color = tag.fontColor;
    }
    return css;
  },
  evalTagStart : function(line, tag, ctx, alias){
    var attr = {};
    var css = this.evalTagCss(line, tag, ctx);
    var tag_name = tag.getName();
    tag.addClass(Css.addNehanPrefix(tag_name));
    attr["class"] = tag.getCssClasses();
    if(!Obj.isEmpty(css)){
      attr.style = Css.attr(css);
    }
    return Html.tagStart(alias || tag_name, attr);
  },
  evalTagEnd : function(line, tag, ctx){
    throw "not implemented:evalTagEnd";
  },
  evalTagOpenBody : function(line, tag, ctx){
    switch(tag.getName()){
    case "a":
      return this.evalLinkStart(line, tag, ctx);
    default:
      return this.evalTagStart(line, tag, ctx);
    }
  },
  evalTagClose : function(line, tag, ctx, update){
    var open_name = tag.getOpenTagName();
    var open_tag = update? ctx.popInlineTagByName(open_name) : ctx.findLastInlineTagByName(open_name);
    if(open_tag === null){
      return "";
    }
    return this.evalTagCloseBody(line, tag, ctx);
  },
  evalTagCloseBody : function(line, tag, ctx){
    switch(tag.getName()){
    case "/a":
      return "</a>";
    default:
      return this.evalTagEnd(tag, ctx);
    }
  },
  evalTagSingle : function(line, tag, ctx){
    return tag.getSrc();
  },
  evalInlineBox : function(box, ctx){
    return this.parentEvaluator.evaluate(box, ctx);
  },
  evalLinkStart : function(line, tag, ctx){
    var attr = {};
    attr.href = tag.getTagAttr("href", "#");
    var name = tag.getTagAttr("name");
    if(name){
      tag.addClass("nehan-anchor");
      attr.name = name;
    }
    var target = tag.getTagAttr("target");
    if(target){
      attr.target = target;
    }
    if(attr.href.indexOf("#") >= 0){
      tag.addClass("nehan-anchor-link");
    }
    attr["class"] = tag.getCssClasses();
    return Html.tagStart(tag.getName(), attr);
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
