var HoriEvaluator = (function(){
  function HoriEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(HoriEvaluator, LayoutEvaluator);

  HoriEvaluator.prototype.evalInlineBlock = function(iblock){
    iblock.css.display = "inline-block";
    return this.evalBlock(iblock);
  };

  HoriEvaluator.prototype.evalBlockImage = function(image){
    return Html.tagSingle("img", {
      "src":image.style.markup.getAttr("src"),
      "style":Css.toString(image.getCssBlock()),
      "class":image.classes.join(" ")
    });
  };

  HoriEvaluator.prototype.evalInlineImage = function(line, image){
    return Html.tagSingle("img", {
      "src":image.style.markup.getAttr("src"),
      "style":Css.toString(image.getCssHoriInlineImage()),
      "class":image.classes.join(" ")
    });
  };

  HoriEvaluator.prototype.evalInlineChild = function(line, child){
    return Html.tagWrap("span", this.evalInlineElements(child, child.elements), {
      "style":Css.toString(line.getCssInline()),
      "class":line.classes.join(" ")
    });
  };

  HoriEvaluator.prototype.evalRuby = function(line, ruby){
    var body = this.evalRt(line, ruby) + this.evalRb(line, ruby);
    return Html.tagWrap("span", body, {
      "style":Css.toString(ruby.getCssHoriRuby(line)),
      "class":"nehan-ruby-body"
    });
  };

  HoriEvaluator.prototype.evalRb = function(line, ruby){
    return Html.tagWrap("div", this.evalInlineElements(line, ruby.getRbs()), {
      "style":Css.toString(ruby.getCssHoriRb(line)),
      "class":"nehan-rb"
    });
  };

  HoriEvaluator.prototype.evalRt = function(line, ruby){
    return Html.tagWrap("div", ruby.getRtString(), {
      "style":Css.toString(ruby.getCssHoriRt(line)),
      "class":"nehan-rt"
    });
  };

  HoriEvaluator.prototype.evalWord = function(line, word){
    return word.data;
  };

  HoriEvaluator.prototype.evalTcy = function(line, tcy){
    return tcy.data;
  };

  HoriEvaluator.prototype.evalChar = function(line, chr){
    if(chr.isHalfSpaceChar()){
      return chr.cnv;
    } else if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr);
    }
    return chr.data;
  };

  HoriEvaluator.prototype.evalEmpha = function(line, chr, char_body){
    var char_part = Html.tagWrap("div", char_body, {
      "style":Css.toString(chr.getCssHoriEmphaTarget(line))
    });
    var empha_part = Html.tagWrap("div", line.style.textEmpha.getText(), {
      "style":Css.toString(chr.getCssHoriEmphaText(line))
    });
    // TODO: check text-emphasis-position is over or under
    return Html.tagWrap("span", empha_part + char_part, {
      "style":Css.toString(line.style.textEmpha.getCssHoriEmphaWrap(line, chr))
    });
  };

  HoriEvaluator.prototype.evalKerningChar = function(line, chr){
    var css = chr.getCssPadding(line);
    if(chr.isKakkoStart()){
      css["margin-left"] = "-0.5em";
      return Html.tagWrap("span", chr.data, {
	"style": Css.toString(css),
	"class":"nehan-char-kakko-start"
      });
    }
    if(chr.isKakkoEnd()){
      css["margin-right"] = "-0.5em";
      return Html.tagWrap("span", chr.data, {
	"style": Css.toString(css),
	"class":"nehan-char-kakko-end"
      });
    }
    if(chr.isKutenTouten()){
      css["margin-right"] = "-0.5em";
      return Html.tagWrap("span", chr.data, {
	"style": Css.toString(css),
	"class":"nehan-char-kuto"
      });
    }
    return chr.data;
  };

  HoriEvaluator.prototype.evalPaddingChar = function(line, chr){
    return Html.tagWrap("span", chr.data, {
      "style": Css.toString(chr.getCssPadding(line))
    });
  };

  return HoriEvaluator;
})();


