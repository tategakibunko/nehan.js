var HorizontalInlineEvaluator = InlineEvaluator.extend({
  evaluate : function(line, ctx){
    var tag_name = line.isInlineText()? "span" : "div";
    return Html.tagWrap(tag_name, this.evalTextLineBody(line, line.getChilds(), ctx), {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalRuby : function(line, ruby, ctx){
    var body = this.evalRt(line, ruby, ctx) + this.evalRb(line, ruby, ctx);
    return Html.tagWrap("span", body, {
      "style":Css.attr(ruby.getCssRuby(line)),
      "class":"nehan-ruby"
    });
  },
  evalRb : function(line, ruby, ctx){
    var body = this.evalTextLineBody(line, ruby.getRbs(), ctx);
    return Html.tagWrap("div", body, {
      "style":Css.attr(ruby.getCssRb(line)),
      "class":"nehan-rb"
    });
  },
  evalRt : function(line, ruby, ctx){
    return Html.tagWrap("div", ruby.getRtString(), {
      "style":Css.attr(ruby.getCssRt(line)),
      "class":"nehan-rb"
    });
  },
  evalWord : function(line, word, ctx){
    return word.data;
  },
  evalTcy : function(line, tcy, ctx){
    return tcy.data;
  },
  evalChar : function(line, chr, ctx){
    if(chr.isHalfSpaceChar()){
      return chr.cnv;
    } else if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr, ctx);
    }
    return chr.data;
  },
  evalKerningChar : function(line, chr, ctx){
    var css = chr.getCssPadding(line.flow);
    if(chr.isKakkoStart()){
      return Html.tagWrap("span", chr.data, {
	"style": Css.attr(css),
	"class":"nehan-char-kakko-start"
      });
    }
    if(chr.isKakkoEnd()){
      return Html.tagWrap("span", chr.data, {
	"style": Css.attr(css),
	"class":"nehan-char-kakko-end"
      });
    }
    if(chr.isKutenTouten()){
      return Html.tagWrap("span", chr.data, {
	"style": Css.attr(css),
	"class":"nehan-char-kuto"
      });
    }
    return chr.data;
  },
  evalPaddingChar : function(line, chr, ctx){
    return Html.tagWrap("span", chr.data, {
      "style": Css.attr(chr.getCssPadding(line.flow))
    });
  }
});
