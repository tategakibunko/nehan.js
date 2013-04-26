var HorizontalInlineEvaluator = InlineEvaluator.extend({
  evalRubyLabel : function(line, label, ctx){
    return Html.tagWrap("span", label.getRtString(), {
      "style": Css.attr(label.getCss(line)),
      "class": Css.addNehanPrefix(label._type)
    });
  },
  evalEmphaChar : function(line, text, ctx){
    return Html.tagWrap("span", text.data, {
      "class": "nehan-empha-char",
      "style": Css.attr(text.getCss(line.flow))
    });
  },
  evalTagStart : function(line, tag, ctx, alias){
    return this._super(line, tag, ctx, "span");
  },
  evalTagEnd : function(line, tag, ctx){
    return "</span>";
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
