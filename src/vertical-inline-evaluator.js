var VerticalInlineEvaluator = InlineEvaluator.extend({
  evaluate : function(line){
    return Html.tagWrap("div", this.evalTextLineBody(line, line.getChilds()), {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalRuby : function(line, ruby){
    var body = this.evalRb(line, ruby) + this.evalRt(line, ruby);
    return Html.tagWrap("div", body, {
      "style":Css.attr(ruby.getCssRuby(line)),
      "class":"nehan-ruby-body"
    });
  },
  evalRb : function(line, ruby){
    var body = this.evalTextLineBody(line, ruby.getRbs());
    return Html.tagWrap("div", body, {
      "style":Css.attr(ruby.getCssRb(line)),
      "class":"nehan-rb"
    });
  },
  evalRt : function(line, ruby){
    var generator = new RtGenerator(ruby.rt, new DocumentContext());
    var rt_line = generator.yield(line);
    var css = ruby.getCssRt(line);
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
      "style": Css.attr(word.getCssVertTrans(line))
    });
  },
  evalWordIE : function(line, word){
    return Html.tagWrap("div", word.data, {
      "class": "nehan-vert-alpha-ie",
      "style": Css.attr(word.getCssVertTransIE(line))
    });
  },
  evalTcy : function(line, tcy){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
    });
  },
  evalChar : function(line, chr){
    if(chr.isImgChar()){
      if(Config.useVerticalGlyphIfEnable &&
	 Env.isVerticalGlyphEnable &&
	 !chr.isTenten()){
	return this.evalVerticalGlyph(line, chr);
      } else {
	return this.evalImgChar(line, chr);
      }
    } else if(chr.isHalfSpaceChar(chr)){
      return this.evalHalfSpaceChar(line, chr);
    } else if(chr.isCnvChar()){
      return this.evalCnvChar(line, chr);
    } else if(chr.isSmallKana()){
      return this.evalSmallKana(line, chr);
    } else if(chr.isPaddingEnable()){
      return this.evalPaddingChar(line, chr);
    }
    return this.evalCharBr(line, chr);
  },
  evalCharBr : function(line, chr){
    if(line.letterSpacing){
      return Html.tagWrap("div", chr.data, {
	"style":Css.attr({
	  "margin-bottom":line.letterSpacing + "px"
	})
      });
    }
    return chr.data + "<br />";
  },
  evalPaddingChar : function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.attr(chr.getCssPadding(line.flow))
    });
  },
  evalImgChar : function(line, chr){
    var vscale = chr.getVertScale();
    var width = chr.fontSize;
    var height = (vscale === 1)? width : Math.floor(width * vscale);
    var css = {};
    if(chr.isPaddingEnable()){
      Args.copy(css, chr.getCssPadding(line.flow));
    }
    Args.copy(css, chr.getCssVertImgChar());
    var palette_color_value = Layout.getPaletteFontColor(line.color).toUpperCase();
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color_value),
      style:Css.attr(css),
      width:width,
      height:height
    }) + Const.clearFix;
  },
  evalVerticalGlyph : function(line, chr){
    var css = {};
    Args.copy(css, chr.getCssVertGlyph(line));
    return Html.tagWrap("div", chr.data, {
      "style":Css.attr(css),
      "class":"nehan-vert-rl"
    });
  },
  evalCnvChar: function(line, chr){
    return chr.cnv + "<br />";
  },
  evalSmallKana : function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.attr({
	"position": "relative",
	"top": "-0.1em",
	"right":"-0.12em",
	"height": chr.bodySize + "px",
	"line-height": chr.bodySize + "px"
      })
    });
  },
  evalHalfSpaceChar : function(line, chr){
    var half = Math.floor(chr.fontSize / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.attr({
	"height": half + "px",
	"line-height": half + "px"
      })
    });
  },
  evalInlineBox : function(box){
    return this._super(box) + Const.clearFix;
  }
});
