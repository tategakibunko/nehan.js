var HoriEvaluator = (function(){
  function HoriEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(HoriEvaluator, LayoutEvaluator);

  HoriEvaluator.prototype._isFlipTree = function(tree){
    return tree.style.isTextVertical();
  };

  HoriEvaluator.prototype._evalFlip = function(tree){
    return (new VertEvaluator()).evaluate(tree);
  };

  HoriEvaluator.prototype._evalInlineChildTree = function(tree){
    return this._evaluate(tree, {name:"span"});
  };

  HoriEvaluator.prototype._evalRuby = function(line, ruby){
    var span = this._createElement("span", {
      className:"nehan-ruby-body",
      css:ruby.getCssHoriRuby(line),
      styleContext:line.style
    });
    span.appendChild(this._evalRt(line, ruby));
    span.appendChild(this._evalRb(line, ruby));
    return span;
  };

  HoriEvaluator.prototype._evalRb = function(line, ruby){
    var rb_style = new StyleContext(new Tag("<rb>"), line.style);
    var rb_line = rb_style.createLine({
      elements:ruby.getRbs()
    });
    return this._evaluate(rb_line, {
      css:ruby.getCssHoriRb(line)
    });
  };

  HoriEvaluator.prototype._evalRt = function(line, ruby){
    return this._createElement("div", {
      content:ruby.getRtString(),
      className:"nehan-rt",
      css:ruby.getCssHoriRt(line),
      styleContext:line.style
    });
  };

  HoriEvaluator.prototype._evalWord = function(line, word){
    return document.createTextNode(word.data);
  };

  HoriEvaluator.prototype._evalTcy = function(line, tcy){
    return document.createTextNode(Html.unescape(tcy.data));
  };

  HoriEvaluator.prototype._evalChar = function(line, chr){
    if(chr.isHalfSpaceChar()){
      return document.createTextNode(chr.data);
    }
    if(chr.isCharRef()){
      return document.createTextNode(Html.unescape(chr.data));
    }
    if(chr.isKerningChar()){
      return this._evalKerningChar(line, chr);
    }
    return document.createTextNode(chr.data);
  };

  HoriEvaluator.prototype._evalEmpha = function(line, chr){
    var char_part = this._createElement("div", {
      content:chr.data,
      css:chr.getCssHoriEmphaTarget(line),
      styleContext:line.style
    });
    var empha_part = this._createElement("div", {
      content:line.style.textEmpha.getText(),
      css:chr.getCssHoriEmphaText(line),
      styleContext:line.style
    });
    var wrap = this._createElement("span", {
      css:line.style.textEmpha.getCssHoriEmphaWrap(line, chr),
      styleContext:line.style
    });
    wrap.appendChild(empha_part);
    wrap.appendChild(char_part);
    return wrap;
  };

  HoriEvaluator.prototype._evalKerningChar = function(line, chr){
    var css = chr.getCssPadding(line);
    if(chr.isKakkoStart()){
      css["margin-left"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kakko-start",
	css:css,
	styleContext:line.style
      });
    }
    if(chr.isKakkoEnd()){
      css["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kakko-end",
	css:css,
	styleContext:line.style
      });
    }
    if(chr.isKutenTouten()){
      css["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kuto",
	css:css,
	styleContext:line.style
      });
    }
    return document.createTextNode(chr.data);
  };

  HoriEvaluator.prototype._evalPaddingChar = function(line, chr){
    return this._createElement("span", {
      content:chr.data,
      css:chr.getCssPadding(line),
      styleContext:line.style
    });
  };

  return HoriEvaluator;
})();

