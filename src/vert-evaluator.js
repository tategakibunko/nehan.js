var VertEvaluator = (function(){
  function VertEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(VertEvaluator, LayoutEvaluator);

  VertEvaluator.prototype.isFlipTree = function(tree){
    return tree.style.isTextHorizontal();
  };

  VertEvaluator.prototype.evalFlip = function(tree){
    return (new HoriEvaluator()).evaluate(tree);
  };

  VertEvaluator.prototype.evalBlockImage = function(image){
    return this.evalImageBody(image, image.getCssBlock());
  };

  VertEvaluator.prototype.evalInlineChildTree = function(tree){
    return this.evalTree(tree);
  };

  VertEvaluator.prototype.evalInlineImage = function(line, image){
    var wrap = this._createElement("div");
    var body = this.evalImageBody(image, image.getCssInline());
    wrap.appendChild(body);
    return wrap;
  };

  VertEvaluator.prototype.evalRuby = function(line, ruby){
    var div = this._createElement("div", {
      className:"nehan-ruby-body"
    });
    div.appendChild(this.evalRb(line, ruby));
    div.appendChild(this.evalRt(line, ruby));
    return div;
  };

  VertEvaluator.prototype.evalRb = function(line, ruby){
    return this.evalTree(line, {
      elements:ruby.getRbs(),
      root:this._createElement("div", {
	styles:ruby.getCssVertRb(line),
	className:"nehan-rb"
      })
    });
  };

  VertEvaluator.prototype.evalRt = function(line, ruby){
    var rt = (new InlineGenerator(
      new StyleContext(ruby.rt, line.style),
      new TokenStream(ruby.getRtString()),
      null // outline context
    )).yield();
    Args.copy(rt.css, ruby.getCssVertRt(line));
    return this.evaluate(rt);
  };

  VertEvaluator.prototype.evalWord = function(line, word){
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

  VertEvaluator.prototype.evalWordTransform = function(line, word){
    var div_wrap = this._createElement("div", {
      styles:word.getCssVertTrans(line)
    });
    var div_word = this._createElement("div", {
      content:word.data,
      className:"nehan-rotate-90",
      styles:word.getCssVertTransBody(line)
    });
    div_wrap.appendChild(div_word);
    return div_wrap;
  };

  VertEvaluator.prototype.evalWordTransformTrident = function(line, word){
    var div_wrap = this._createElement("div", {
      styles:word.getCssVertTrans(line)
    });
    var div_word = this._createElement("div", {
      content:word.data,
      //className:"nehan-rotate-90",
      styles:word.getCssVertTransBodyTrident(line)
    });
    div_wrap.appendChild(div_word);
    return div_wrap;
  };

  VertEvaluator.prototype.evalWordIE = function(line, word){
    return this._createElement("div", {
      content:word.data,
      className:"nehan-vert-ie",
      styles:word.getCssVertTransIE(line)
    }); // NOTE(or TODO):clearfix in older version after this code
  };

  VertEvaluator.prototype.evalRotateChar = function(line, chr){
    if(Env.isTransformEnable){
      return this.evalRotateCharTransform(line, chr);
    } else if(Env.isIE){
      return this.evalRotateCharIE(line, chr);
    } else {
      return this.evalCharWithBr(line, chr);
    }
  };

  VertEvaluator.prototype.evalRotateCharTransform = function(line, chr){
    return this._createElement("div", {
      content:chr.data,
      className:"nehan-rotate-90"
    });
  };

  VertEvaluator.prototype.evalRotateCharIE = function(line, chr){
    return this._createElement("div", {
      content:chr.data,
      className:"nehan-vert-ie",
      styles:chr.getCssVertRotateCharIE(line)
    }); // NOTE(or TODO):clearfix in older version after this code
  };

  VertEvaluator.prototype.evalTcy = function(line, tcy){
    return this._createElement("div", {
      content:tcy.data,
      className:"nehan-tcy"
    });
  };

  VertEvaluator.prototype.evalChar = function(line, chr){
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

  // to inherit style of parent wrap, we text with <br> to keep elements in 'inline-level'.
  // for example, if we use <div>, parent bg-color is not inherited.
  VertEvaluator.prototype.evalCharWithBr = function(line, chr){
    chr.withBr = true;
    return document.createTextNode(Html.unescape(chr.data));
  };

  VertEvaluator.prototype.evalCharLetterSpacing = function(line, chr){
    return this._createElement("div", {
      content:chr.data,
      styles:chr.getCssVertLetterSpacing(line)
    });
  };

  VertEvaluator.prototype.evalEmpha = function(line, chr){
    var char_body = this._createElement("span", {
      content:chr.data,
      className:"nehan-empha-src",
      styles:chr.getCssVertEmphaTarget(line)
    });
    var empha_body = this._createElement("span", {
      content:line.style.textEmpha.getText(),
      className:"nehan-empha-text",
      styles:chr.getCssVertEmphaText(line)
    });
    var wrap = this._createElement("div", {
      className:"nehan-empha-wrap",
      styles:line.style.textEmpha.getCssVertEmphaWrap(line, chr)
    });
    wrap.appendChild(char_body);
    wrap.appendChild(empha_body);
    return wrap;
  };

  VertEvaluator.prototype.evalPaddingChar = function(line, chr){
    return this._createElement("div", {
      content:chr.data,
      styles:chr.getCssPadding(line)
    });
  };

  VertEvaluator.prototype.evalImgChar = function(line, chr){
    var color = line.color || new Color(Layout.fontColor);
    var font_rgb = color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return this._createElement("img", {
      className:"nehan-img-char",
      attr:{
	src:chr.getImgSrc(palette_color)
      },
      styles:chr.getCssVertImgChar(line)
    });
  };

  VertEvaluator.prototype.evalVerticalGlyph = function(line, chr){
    return this._createElement("div", {
      content:chr.data,
      className:"nehan-vert-glyph",
      styles:chr.getCssVertGlyph(line)
    });
  };

  VertEvaluator.prototype.evalCnvChar = function(line, chr){
    return this._createElement("div", {
      content:chr.cnv
    });
  };

  VertEvaluator.prototype.evalSmallKana = function(line, chr){
    var tag_name = (line.style.textEmpha && line.style.textEmpha.isEnable())? "span" : "div";
    return this._createElement(tag_name, {
      content:chr.data,
      styles:chr.getCssVertSmallKana()
    });
  };

  VertEvaluator.prototype.evalHalfSpaceChar = function(line, chr){
    return this._createElement("div", {
      content:"&nbsp;",
      styles:chr.getCssVertHalfSpaceChar(line)
    });
  };

  return VertEvaluator;
})();

