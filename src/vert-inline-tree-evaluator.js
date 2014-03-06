var VertInlineTreeEvaluator = (function(){
  function VertInlineTreeEvaluator(parent_evaluator){
    InlineTreeEvaluator.call(this, parent_evaluator);
  }
  Class.extend(VertInlineTreeEvaluator, InlineTreeEvaluator);

  VertInlineTreeEvaluator.prototype.evaluate = function(line){
    var markup = line.getMarkup();
    return Html.tagWrap("div", this.evalTextLineBody(line, line.getChilds()), Args.copy({
      "style":Css.toString(line.getCssInline()),
      "class":line.getCssClasses()
    }, markup? markup.getDatasetAttrsRaw() : {}));
  };

  VertInlineTreeEvaluator.prototype.evalRuby = function(line, ruby){
    var body = this.evalRb(line, ruby) + this.evalRt(line, ruby);
    return Html.tagWrap("div", body, {
      "style":Css.toString(ruby.getCssVertRuby(line)),
      "class":"nehan-ruby-body"
    });
  };

  VertInlineTreeEvaluator.prototype.evalRb = function(line, ruby){
    var body = this.evalTextLineBody(line, ruby.getRbs());
    return Html.tagWrap("div", body, {
      "style":Css.toString(ruby.getCssVertRb(line)),
      "class":"nehan-rb"
    });
  };

  VertInlineTreeEvaluator.prototype.evalRt = function(line, ruby){
    var generator = new RtGenerator(new DocumentContext({
      markup:ruby.rt,
      stream:(new TokenStream(ruby.rt.getContentRaw()))
    }));
    var rt_line = generator.yield(line);
    var css = ruby.getCssVertRt(line);
    for(var prop in css){
      rt_line.setCss(prop, css[prop]);
    }
    return this.evaluate(rt_line);
  };

  VertInlineTreeEvaluator.prototype.evalWord = function(line, word){
    if(Env.isTransformEnable){
      if(Env.isTrident){
	return this.evalWordTransformTrident(line, word);
      }
      return this.evalWordTransform(line, word);
    } else if(Env.isIE){
      return this.evalWordIE(line, word);
    } else {
      return "";
    }
  };

  VertInlineTreeEvaluator.prototype.evalWordTransform = function(line, word){
    var body = Html.tagWrap("div", word.data, {
      "class": "nehan-rotate-90",
      "style": Css.toString(word.getCssVertTransBody(line))
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  };

  VertInlineTreeEvaluator.prototype.evalWordTransformTrident = function(line, word){
    var body = Html.tagWrap("div", word.data, {
      // trident rotation needs some hack.
      //"class": "nehan-rotate-90",
      "style": Css.toString(word.getCssVertTransBodyTrident(line))
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  };

  VertInlineTreeEvaluator.prototype.evalWordIE = function(line, word){
    return Html.tagWrap("div", word.data, {
      "class": "nehan-vert-ie",
      "style": Css.toString(word.getCssVertTransIE(line))
    }) + Const.clearFix;
  };

  VertInlineTreeEvaluator.prototype.evalRotateChar = function(line, chr){
    if(Env.isTransformEnable){
      return this.evalRotateCharTransform(line, chr);
    } else if(Env.isIE){
      return this.evalRotateCharIE(line, chr);
    } else {
      return this.evalCharWithBr(line, chr);
    }
  };

  VertInlineTreeEvaluator.prototype.evalRotateCharTransform = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-rotate-90"
    });
  };

  VertInlineTreeEvaluator.prototype.evalRotateCharIE = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertRotateCharIE(line)),
      "class":"nehan-vert-ie"
    }) + Const.clearFix;
  };

  VertInlineTreeEvaluator.prototype.evalTcy = function(line, tcy){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
    });
  };

  VertInlineTreeEvaluator.prototype.evalChar = function(line, chr){
    if(chr.isImgChar()){
      if(chr.isVertGlyphEnable()){
	return this.evalVerticalGlyph(line, chr);
      }
      return this.evalImgChar(line, chr);
    } else if(chr.isHalfSpaceChar(chr)){
      return this.evalHalfSpaceChar(line, chr);
    } else if(chr.isCnvChar()){
      return this.evalCnvChar(line, chr);
    } else if(chr.isRotateChar()){
      return this.evalRotateChar(line, chr);
    } else if(chr.isSmallKana()){
      return this.evalSmallKana(line, chr);
    } else if(chr.isPaddingEnable()){
      return this.evalPaddingChar(line, chr);
    } else if(line.letterSpacing){
      return this.evalCharLetterSpacing(line, chr);
    }
    return this.evalCharWithBr(line, chr);
  };

  VertInlineTreeEvaluator.prototype.evalCharWithBr = function(line, chr){
    return chr.data + "<br />";
  };

  VertInlineTreeEvaluator.prototype.evalCharLetterSpacing = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertLetterSpacing(line))
    });
  };

  VertInlineTreeEvaluator.prototype.evalEmpha = function(line, chr, char_body){
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
  };

  VertInlineTreeEvaluator.prototype.evalPaddingChar = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.toString(chr.getCssPadding(line))
    });
  };

  VertInlineTreeEvaluator.prototype.evalImgChar = function(line, chr){
    var color = line.color || new Color(Layout.fontColor);
    var font_rgb = color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color),
      style:Css.toString(chr.getCssVertImgChar(line))
    }) + Const.clearFix;
  };

  VertInlineTreeEvaluator.prototype.evalVerticalGlyph = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-vert-glyph",
      "style":Css.toString(chr.getCssVertGlyph(line))
    });
  };

  VertInlineTreeEvaluator.prototype.evalCnvChar = function(line, chr){
    return chr.cnv + "<br />";
  };

  VertInlineTreeEvaluator.prototype.evalSmallKana = function(line, chr){
    var tag_name = (line.textEmpha && line.textEmpha.isEnable())? "span" : "div";
    return Html.tagWrap(tag_name, chr.data, {
      style:Css.toString(chr.getCssVertSmallKana())
    });
  };

  VertInlineTreeEvaluator.prototype.evalHalfSpaceChar = function(line, chr){
    var font_size = line.getFontSize();
    var half = Math.round(font_size / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.toString(chr.getCssVertHalfSpaceChar(line))
    });
  };

  VertInlineTreeEvaluator.prototype.evalInlineBox = function(line, box){
    var body = (box._type === "img")? this.parentEvaluator.evalImageContent(box) : box.content;
    return Html.tagWrap("div", body, {
      "style":Css.toString(box.getCssVertInlineBox())
    });
  };

  return VertInlineTreeEvaluator;
})();

