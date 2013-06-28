var VerticalInlineEvaluator = InlineEvaluator.extend({
  evalTextLine : function(line, ctx){
    var css = line.getCss();
    if(line.parent && line.parent._type === "ruby-line"){
      css["float"] = "none";
    }
    return Html.tagWrap("div", this.evalTextLineBody(line, ctx), {
      "style":Css.attr(css),
      "class":line.getCssClasses()
    });
  },
  evalRubyLabel : function(line, label, ctx){
    var label_line = this._yieldRubyLabelLine(line, label, ctx);
    return Html.tagWrap("div", this.evalTextLine(label_line, ctx.createInlineRoot()), {
      "style": Css.attr(label.getCss(line)),
      "class": Css.addNehanPrefix(label._type)
    });
  },
  evalEmphaChar : function(line, text, ctx){
    return Html.tagWrap("div", text.data, {
      "class": "nehan-empha-char",
      "style": Css.attr(text.getCss(line.flow))
    });
  },
  _yieldRubyLabelLine : function(line, label, ctx){
    var text = label.getRtString();
    var font_size = label.getRtFontSize();
    var stream = new TokenStream(text);
    var ctx2 = ctx.createInlineRoot();
    ctx2.setFixedFontSize(font_size);
    var generator = new InlineTreeGenerator(stream, ctx2);
    return generator.yield(line);
  },
  evalTagStart : function(line, tag, ctx){
    return this._super(line, tag, ctx, "div");
  },
  evalTagEnd : function(line, tag, ctx){
    return "</div>";
  },
  evalWord : function(line, word, ctx){
    if(Env.isTransformEnable){
      return this.evalWordTransform(line, word, ctx);
    } else if(Env.isIE){
      return this.evalWordIE(line, word, ctx);
    } else {
      return "";
    }
  },
  evalWordTransform : function(line, word, ctx){
    var body = Html.tagWrap("div", word.data, {
      "class": "nehan-vert-alpha"
    });
    return Html.tagWrap("div", body, {
      "style": Css.attr({
	"letter-spacing":line.letterSpacing + "px",
	"width": word.fontSize + "px",
	"height": word.bodySize + "px",
	"word-break":"keep-all",
	"overflow": "visible"
      })
    });
  },
  evalWordIE : function(line, word, ctx){
    var css = {
      "writing-mode": "tb-rl",
      "letter-spacing":line.letterSpacing + "px",
      "line-height": word.fontSize + "px",
      "float": "left"
    };
    return Html.tagWrap("div", word.data, {
      "style": Css.attr(css)
    });
  },
  evalTcy : function(line, tcy, ctx){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
    });
  },
  evalChar : function(line, chr, ctx){
    if(chr.isImgChar()){
      if(Config.useVerticalGlyphIfEnable &&
	 Env.isVerticalGlyphEnable &&
	 !chr.isTenten()){
	return this.evalVerticalGlyph(line, chr, ctx);
      } else {
	return this.evalImgChar(line, chr, ctx);
      }
    } else if(chr.isHalfSpaceChar(chr, ctx)){
      return this.evalHalfSpaceChar(line, chr, ctx);
    } else if(chr.isCnvChar()){
      return this.evalCnvChar(line, chr, ctx);
    } else if(chr.isSmallKana()){
      return this.evalSmallKana(line, chr, ctx);
    } else if(chr.isPaddingEnable()){
      return this.evalPaddingChar(line, chr, ctx);
    }
    return this.evalCharBr(line, chr, ctx);
  },
  evalCharBr : function(line, chr, ctx){
    if(line.letterSpacing){
      return Html.tagWrap("div", chr.data, {
	"style":Css.attr({
	  "margin-bottom":line.letterSpacing + "px"
	})
      });
    }
    return chr.data + "<br />";
  },
  evalPaddingChar : function(line, chr, ctx){
    return Html.tagWrap("div", chr.data, {
      style:Css.attr(chr.getCssPadding(line.flow))
    });
  },
  evalImgChar : function(line, chr, ctx){
    var width = chr.fontSize;
    var vscale = chr.getVertScale();
    var height = (vscale === 1)? width : Math.floor(width * vscale);
    var css = {};
    if(chr.isPaddingEnable()){
      Args.copy(css, chr.getCssPadding(line.flow));
    }
    var palette_color_value = Layout.fontColor.toUpperCase();
    var font_color = ctx.getInlineFontColor(line);
    if(font_color.getValue().toLowerCase() != Layout.fontColor.toLowerCase()){
      palette_color_value = font_color.getPaletteValue().toUpperCase();
    }
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color_value),
      style:Css.attr(css),
      width:width,
      height:height
    }) + Const.clearFix;
  },
  evalVerticalGlyph : function(line, chr, ctx){
    var classes = ["nehan-vert-rl"];
    if(chr.isKakkoStart()){
      if(!chr.isPaddingEnable()){
	classes.push("nehan-vert-kern-start");
      }
    } else {
      if(chr.getVertScale() < 1){
	classes.push("nehan-vert-half");
      }
      if(chr.isPaddingEnable()){
	classes.push("nehan-vert-space-end");
      }
    }
    return Html.tagWrap("div", chr.data, {
      "class":classes.join(" ")
    });
  },
  evalCnvChar: function(line, chr, ctx){
    return chr.cnv + "<br />";
  },
  evalSmallKana : function(line, chr, ctx){
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
  evalHalfSpaceChar : function(line, chr, ctx){
    var half = Math.floor(chr.fontSize / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.attr({
	"height": half + "px",
	"line-height": half + "px"
      })
    });
  },
  evalInlineBox : function(box, ctx){
    return this._super(box, ctx) + Const.clearFix;
  }
});
