var VerticalInlineEvaluator = InlineEvaluator.extend({
  evaluate : function(line){
    return Html.tagWrap("div", this.evalTextLineBody(line, line.getChilds()), {
      "style":Css.toString(line.getCssInline()),
      "class":line.getCssClasses()
    });
  },
  evalRuby : function(line, ruby){
    var body = this.evalRb(line, ruby) + this.evalRt(line, ruby);
    return Html.tagWrap("div", body, {
      "style":Css.toString(ruby.getCssVertRuby(line)),
      "class":"nehan-ruby-body"
    });
  },
  evalRb : function(line, ruby){
    var body = this.evalTextLineBody(line, ruby.getRbs());
    return Html.tagWrap("div", body, {
      "style":Css.toString(ruby.getCssVertRb(line)),
      "class":"nehan-rb"
    });
  },
  evalRt : function(line, ruby){
    var generator = new RtGenerator(ruby.rt, new DocumentContext());
    var rt_line = generator.yield(line);
    var css = ruby.getCssVertRt(line);
    for(var prop in css){
      rt_line.setCss(prop, css[prop]);
    }
    return this.evaluate(rt_line);
  },
  evalWord : function(line, word){
    if(Env.isTransformEnable){
      return this.evalWordTransform(line, word);
    } else if(Env.isIE){
      return this.evalWordIE(line, word);
    } else {
      return "";
    }
  },
  evalWordTransform : function(line, word){
    var body = Html.tagWrap("div", word.data, {
      "class": "nehan-vert-alpha"
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  },
  evalWordIE : function(line, word){
    return Html.tagWrap("div", word.data, {
      "class": "nehan-vert-alpha-ie",
      "style": Css.toString(word.getCssVertTransIE(line))
    });
  },
  evalTcy : function(line, tcy){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
    });
  },
  evalChar : function(line, chr){
    if(chr.isImgChar()){
      if(chr.isVertGlyphEnable()){
	return this.evalVerticalGlyph(line, chr);
      }
      return this.evalImgChar(line, chr);
    } else if(chr.isHalfSpaceChar(chr)){
      return this.evalHalfSpaceChar(line, chr);
    } else if(chr.isCnvChar()){
      return this.evalCnvChar(line, chr);
    } else if(chr.isSmallKana()){
      return this.evalSmallKana(line, chr);
    } else if(chr.isPaddingEnable()){
      return this.evalPaddingChar(line, chr);
    } else if(line.letterSpacing){
      return this.evalCharLetterSpacing(line, chr);
    }
    return chr.data + "<br />";
  },
  evalCharLetterSpacing : function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertLetterSpacing(line))
    });
  },
  evalEmpha : function(line, chr, char_body){
    char_body = char_body.replace("<br />", "");
    var char_body2 = Html.tagWrap("span", char_body, {
      "class":"nehan-empha-src",
      "style":Css.toString(chr.getCssVertEmphaSrc(line))
    });
    var empha_body = Html.tagWrap("span", line.textEmpha.getText(), {
      "class":"nehan-empha-text",
      "style":Css.toString(chr.getCssVertEmphaText(line))
    });
    // TODO: check text-emphasis-position is over or under
    return Html.tagWrap("div", char_body2 + empha_body, {
      "class":"nehan-empha-wrap",
      "style":Css.toString(line.textEmpha.getCssVertEmphaWrap(line, chr))
    });
  },
  evalPaddingChar : function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.toString(chr.getCssPadding(line))
    });
  },
  evalImgChar : function(line, chr){
    var font_rgb = line.color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color),
      style:Css.toString(chr.getCssVertImgChar(line))
    }) + Const.clearFix;
  },
  evalVerticalGlyph : function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-vert-rl",
      "style":Css.toString(chr.getCssVertGlyph(line))
    });
  },
  evalCnvChar: function(line, chr){
    return chr.cnv + "<br />";
  },
  evalSmallKana : function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.toString(chr.getCssVertSmallKana())
    });
  },
  evalHalfSpaceChar : function(line, chr){
    var half = Math.floor(line.fontSize / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.toString(chr.getCssVertHalfSpaceChar(line))
    });
  },
  evalInlineBox : function(line, box){
    var body = (box._type === "img")? this.parentEvaluator.evalImageContent(box) : box.content;
    return Html.tagWrap("div", body, {
      "style":Css.toString(box.getCssVertInlineBox())
    });
  }
});
