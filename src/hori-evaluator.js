var HoriEvaluator = (function(){
  function HoriEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(HoriEvaluator, LayoutEvaluator);

  HoriEvaluator.prototype.isFlipTree = function(tree){
    return tree.style.isTextVertical();
  };

  HoriEvaluator.prototype.evalFlip = function(tree){
    return (new VertEvaluator()).evaluate(tree);
  };

  HoriEvaluator.prototype.evalChildInlineTreeWrap = function(tree, css){
    return this.evalTreeWrap(tree, css, "span");
  };

  HoriEvaluator.prototype.evalBlockImage = function(image){
    return this.evalImageBody(image, image.getCssBlock());
  };

  HoriEvaluator.prototype.evalInlineImage = function(line, image){
    return this.evalImageBody(image, image.getCssHoriInlineImage());
  };

  // notice that horizontal inline-child uses <span> wrapping(except for <a>).
  HoriEvaluator.prototype.evalInlineChild = function(line, child){
    return Html.tagWrap("span", this.evalInlineElements(child, child.elements), Args.copy({
      "style":Css.toString(child.getCssInline()),
      "class":line.classes.join(" ")
    }, child.getDatasetAttr()));
  };

  HoriEvaluator.prototype.evalRuby = function(line, ruby){
    var span = this._createElement("span", {
      className:"nehan-ruby-body",
      css:ruby.getCssHoriRuby(line)
    });
    span.appendChild(this.evalRt(line, ruby));
    span.appendChild(this.evalRb(line, ruby));
    return span;
  };

  HoriEvaluator.prototype.evalRb = function(line, ruby){
    var dom = this._createElement("div", {
      css:ruby.getCssHoriRb(line),
      className:"nehan-rb"
    });
    return this.evalTree(dom, line, ruby.getRbs());
  };

  HoriEvaluator.prototype.evalRt = function(line, ruby){
    return this._createElement("div", {
      content:ruby.getRtString(),
      className:"nehan-rt",
      css:ruby.getCssHoriRt(line)
    });
  };

  HoriEvaluator.prototype.evalWord = function(line, word){
    return document.createTextNode(word.data);
  };

  HoriEvaluator.prototype.evalTcy = function(line, tcy){
    return document.createTextNode(tcy.data);
  };

  HoriEvaluator.prototype.evalChar = function(line, chr){
    if(chr.isHalfSpaceChar()){
      document.createTextNode(chr.data);
    } else if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr);
    }
    return document.createTextNode(chr.data);
  };

  HoriEvaluator.prototype.evalEmpha = function(line, chr, char_body){
    var char_part = this._createElement("div", {
      content:char_body.textContent,
      css:chr.getCssHoriEmphaTarget(line)
    });
    var empha_part = this._createElement("div", {
      content:line.style.textEmpha.getText(),
      css:chr.getCssHoriEmphaText(line)
    });
    var wrap = this._createElement("span", {
      css:line.style.textEmpha.getCssHoriEmphaWrap(line, chr)
    });
    wrap.appendChild(empha_part);
    wrap.appendChild(char_part);
    return wrap;
  };

  HoriEvaluator.prototype.evalKerningChar = function(line, chr){
    var css = chr.getCssPadding(line);
    if(chr.isKakkoStart()){
      css["margin-left"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kakko-start",
	css:css
      });
    }
    if(chr.isKakkoEnd()){
      css["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kakko-end",
	css:css
      });
    }
    if(chr.isKutenTouten()){
      css["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kuto",
	css:css
      });
    }
    return document.createTextNode(chr.data);
  };

  HoriEvaluator.prototype.evalPaddingChar = function(line, chr){
    return this._createElement("span", {
      content:chr.data,
      css:chr.getCssPadding(line)
    });
  };

  return HoriEvaluator;
})();

