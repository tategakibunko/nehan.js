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
      "style":Css.attr(ruby.getCssHoriRuby(line)),
      "class":"nehan-ruby"
    });
  },
  evalRb : function(line, ruby, ctx){
    var body = this.evalTextLineBody(line, ruby.getRbs(), ctx);
    return Html.tagWrap("div", body, {
      "style":Css.attr(ruby.getCssHoriRb(line)),
      "class":"nehan-rb"
    });
  },
  evalRt : function(line, ruby, ctx){
    return Html.tagWrap("div", ruby.getRtString(), {
      "style":Css.attr(ruby.getCssHoriRt(line)),
      "class":"nehan-rt"
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
  evalEmpha : function(line, chr, char_body){
    var char_body2 = Html.tagWrap("div", char_body);
    var empha_body = Html.tagWrap("div", line.textEmpha.getText(), {
      "style":Css.attr(line.textEmpha.getCssHoriEmphaText())
    });
    // TODO: check text-emphasis-position is over or under
    return Html.tagWrap("span", empha_body + char_body2, {
      "style":Css.attr(line.textEmpha.getCssHoriEmphaWrap(line, chr))
    });
  },
  evalKerningChar : function(line, chr, ctx){
    var css = chr.getCssPadding(line);
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
      "style": Css.attr(chr.getCssPadding(line))
    });
  }
});
