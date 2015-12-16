Nehan.Char = (function(){
  /**
   @memberof Nehan
   @class Char
   @classdesc character object
   @param opt {Object}
   @param opt.data {string} - character string
   @param opt.ref {string} - character reference string(like &nbsp;)
   */
  function Char(opt){
    this._initialize(opt || {});
  }
  var __kuten = ["\u3002","."];
  var __touten = ["\u3001", ","];
  var __kakko_start = ["\uff62","\u300c","\u300e","\u3010","\uff3b","\uff08","\u300a","\u3008","\u226a","\uff1c","\uff5b","\x7b","\x5b","\x28", "\u2772", "\u3014"];
  var __kakko_end = ["\u300d","\uff63","\u300f","\u3011","\uff3d","\uff09","\u300b","\u3009","\u226b","\uff1e","\uff5d","\x7d","\x5d","\x29", "\u2773", "\u3015"];
  var __small_kana = ["\u3041","\u3043","\u3045","\u3047","\u3049","\u3063","\u3083","\u3085","\u3087","\u308e","\u30a1","\u30a3","\u30a5","\u30a7","\u30a9","\u30f5","\u30f6","\u30c3","\u30e3","\u30e5","\u30e7","\u30ee"];
  var __head_ng = ["\uff09","\x5c","\x29","\u300d","\u3011","\u3015","\uff3d","\x5c","\x5d","\u3002","\u300f","\uff1e","\u3009","\u300b","\u3001","\uff0e","\x5c","\x2e","\x2c","\u201d","\u301f"];
  var __tail_ng = ["\uff08","\x5c","\x28","\u300c","\u3010","\uff3b","\u3014","\x5c","\x5b","\u300e","\uff1c","\u3008","\u300a","\u201c","\u301d"];
  var __voiced_mark = ["\u3099", "\u309a", "\u309b", "\u309c", "\uff9e", "\uff9f"];
  var __no_break_space = ["\u00a0", "\u202f", "\ufeff"];
  var __rex_half_char = /[\w!\.\?\/:#;"',]/;
  var __rex_half_kana = /[\uff65-\uff9f]/;
  var __rex_half_kana_small = /[\uff67-\uff6f]/;
  var __is_ie = Nehan.Env.client.isIE();

  Char.prototype._initialize = function(opt){
    this.data = opt.data || "";
    this.ref = opt.ref || "";
    if(this.ref){
      this._setupRef(this.ref);
    } else {
      this._setupNormal(this.data.charCodeAt(0));
    }
  };

  /**
   @memberof Nehan.Char
   @param is_vert {bool}
   @return {string}
   */
  Char.prototype.getData = function(flow){
    var data = flow.isTextVertical()? (this.vertCnv || this.data) : this.data;
    return data + (this.ligature || "");
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssPadding = function(line){
    var padding = new Nehan.Padding();
    if(this.paddingStart){
      padding.setStart(line.context.style.flow, this.paddingStart);
    }
    if(this.paddingEnd){
      padding.setEnd(line.context.style.flow, this.paddingEnd);
    }
    return padding.getCss();
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertGlyph = function(line){
    var css = {};
    var is_zenkaku = this.isZenkaku();
    var is_kakko_start = this.isKakkoStart();
    var is_kakko_end = this.isKakkoEnd();
    var is_tenten = this.isTenten();
    var padding_enable = this.isPaddingEnable();
    if(__is_ie){
      css.height = "1em";
    }
    if(is_zenkaku && is_kakko_start && !padding_enable){
      css.height = "1em";
      css["margin-top"] = "-0.5em";
    } else if(is_zenkaku && is_kakko_end && !padding_enable){
      css.height = "1em";
      css["margin-bottom"] = "-0.5em";
    } else if(!is_kakko_start && !is_kakko_end && !is_tenten && this.vscale < 1){
      css.height = "0.5em";
      Nehan.Obj.copy(css, this.getCssPadding(line));
    }
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertImgChar = function(line){
    var css = {}, font_size = line.context.style.getFontSize();
    css.display = "block";
    css.width = font_size + "px";
    css.height = this.getVertHeight(font_size) + "px";
    if(this.isPaddingEnable()){
      Nehan.Obj.copy(css, this.getCssPadding(line));
    }
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertSingleHalfChar = function(line){
    var css = {};
    if(line.edge){
      css["padding-left"] = "0.25em"; // base aligned line
    } else {
      css["text-align"] = "center"; // normal text line(all text with same font-size)
    }
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertHalfKana = function(line){
    var css = {};
    css["text-align"] = "center";
    if(this.hasLigature()){
      css["padding-left"] = "0.25em";
    } else if(this.isHalfKanaSmall()){
      css["padding-left"] = "0.25em";
      css["margin-top"] = "-0.25em";
    }
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertRotateCharIE = function(line){
    var css = {}, font_size = line.context.style.getFontSize();
    css["css-float"] = "left";
    css["writing-mode"] = "tb-rl";
    css["padding-left"] = Math.round(font_size / 2) + "px";
    css["line-height"] = font_size + "px";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertDashIE = function(line){
    var css = {};
    css["height"] = "0.84em"; // eliminate space between dash for IE.
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertEmphaText = function(line){
    var css = {}, font_size = line.context.style.getFontSize();
    css["font-size"] = "0.5em";
    css.display = "inline-block";
    css.width = font_size + "px";
    css.height = font_size + "px";
    css["position"] = "absolute";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssHoriEmphaSrc = function(line){
    var css = {};
    css["line-height"] = "1em";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssHoriEmphaText = function(line){
    var css = {};
    css.display = "inline-block";
    css.width = "1em";
    css.height = "1em";
    css["padding-left"] = "0.5em";
    css["line-height"] = "1em";
    css["font-size"] = "0.5em";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertLetterSpacing = function(line){
    var css = {};
    css["margin-bottom"] = line.letterSpacing + "px";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssHoriSpaceChar = function(line){
    var css = {};
    css.display = "inline-block";
    css.width = this.bodySize + "px";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssHoriTabChar = function(line){
    var css = {};
    css.display = "inline-block";
    css.width = this.bodySize + "px";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertSpaceChar = function(line){
    var css = {};
    css.height = this.bodySize + "px";
    css["line-height"] = this.bodySize + "px";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertTabChar = function(line){
    var css = {};
    css.height = this.bodySize + "px";
    css["line-height"] = this.bodySize + "px";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssVertSmallKana = function(){
    var css = {};
    css.position = "relative";
    css.top = "-0.1em";
    css.right = "-0.12em";
    css.height = this.bodySize + "px";
    css["line-height"] = this.bodySize + "px";
    css.clear = "both";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Float | Int}
   */
  Char.prototype.getHoriScale = function(){
    return this.hscale || 1;
  };

  /**
   @memberof Nehan.Char
   @return {Float | Int}
   */
  Char.prototype.getVertScale = function(){
    return this.vscale || 1;
  };

  /**
   @memberof Nehan.Char
   @return {Float | Int}
   */
  Char.prototype.getVertHeight = function(font_size){
    var vscale = this.getVertScale();
    return (vscale === 1)? font_size : Math.round(font_size * vscale);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.hasMetrics = function(){
    return (typeof this.bodySize != "undefined");
  };

  /**
   @memberof Nehan.Char
   @return {Int}
   */
  Char.prototype.getAdvance = function(flow, letter_spacing){
    return this.bodySize + this.getPaddingSize() + (letter_spacing || 0);
  };

  /**
   @memberof Nehan.Char
   @return {Int}
   */
  Char.prototype.getPaddingSize = function(){
    return (this.paddingStart || 0) + (this.paddingEnd || 0);
  };

  /**
   @memberof Nehan.Char
   @return {Int}
   */
  Char.prototype.getCharCount = function(){
    if(this.isSpaceGroup() || this.isIdeographicSpace()){
      return 0;
    }
    return 1;
  };

  /**
   @memberof Nehan.Char
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   */
  Char.prototype.setMetrics = function(flow, font){
    var is_vert = flow.isTextVertical();
    var step_scale = is_vert? this.getVertScale() : this.getHoriScale();
    this.bodySize = (step_scale != 1)? Math.round(font.size * step_scale) : font.size;
    if(this.spaceRateStart){
      this.paddingStart = Math.round(this.spaceRateStart * font.size);
    }
    if(this.spaceRateEnd){
      this.paddingEnd = Math.round(this.spaceRateEnd * font.size);
    }
    if(!is_vert && !this.isCharRef() && this.isHankaku() && !this.isWhiteSpace()){
      this.bodySize = Math.round(font.size / 2);
    }
    if(!is_vert && this.isHalfKana()){
      this.bodySize = Math.round(font.size / 2);
    }
    if(this.isSmallKana()){
      this.bodySize -= Math.floor(font.size * 0.1);
    }
  };

  Char.prototype._setVertImg = function(vert_img, vscale, hscale){
    this.vertImg = vert_img;
    this.vscale = vscale;
    this.hscale = hscale;
  };

  Char.prototype._setVertCnv = function(cnv, vscale, hscale){
    this.vertCnv = cnv;
    this.isRef = true;
    this.vscale = vscale;
    this.hscale = hscale;
  };

  Char.prototype._setRotate = function(angle){
    this.rotate = angle;
  };

  Char.prototype._setRotateOrVertImg = function(angle, img, vscale, hscale){
    if(Nehan.Env.isTransformEnable){
      this._setRotate(angle);
      this.vscale = vscale;
      this.hscale = hscale;
      return;
    }
    this._setVertImg(img, vscale, hscale);
  };

  Char.prototype._setupRef = function(str){
    switch(str){
    case "&nbsp;":
      this._setupNbsp();
      break;
    case "&thinsp;":
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.thinsp;
      break;
    case "&ensp;":
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.ensp;
      break;
    case "&emsp;":
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.emsp;
      break;
    case "&#09;":
      this._setupTabSpace();
      break;
    case "&lt;":
      this._setRotateOrVertImg(90, "kakko7", 0.5, 0.5);
      break;
    case "&gt;":
      this._setRotateOrVertImg(90, "kakko8", 0.5, 0.5);
      break;
    }
  };

  Char.prototype._setupNbsp = function(){
    this.vscale = this.hscale = Nehan.Config.spacingSizeRate.nbsp;
  };

  Char.prototype._setupTabSpace = function(){
    this.vscale = this.hscale = Math.floor(Nehan.Config.tabCount / 2);
  };

  Char.prototype._setupNormal = function(code){
    // for half-size char, rotate 90 and half-scale in horizontal by default.
    if(this.isHankaku()){
      this.hscale = 0.5;
      this._setRotate(90);
    }
    switch(code){
    case 9: // tab space char
      this._setupTabSpace(); break;
      break;
    case 32: // half scape char
      this._setupNbsp(); break;
    case 12300:
      this._setVertImg("kakko1", 0.5, 0.5); break;
    case 65378:
      this._setVertImg("kakko1", 0.5, 0.5); break;
    case 12301:
      this._setVertImg("kakko2", 0.5, 0.5); break;
    case 65379:
      this._setVertImg("kakko2", 0.5, 0.5); break;
    case 12302:
      this._setVertImg("kakko3", 0.5, 0.5); break;
    case 12303:
      this._setVertImg("kakko4", 0.5, 0.5); break;
    case 65288:
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 40:
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 65371:
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 123:
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 65289:
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 41:
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 65373:
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 125:
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 65308:
      this._setVertImg("kakko7", 0.5, 0.5); break;
    case 12296:
      this._setVertImg("kakko7", 0.5, 0.5); break;
    case 65310:
      this._setVertImg("kakko8", 0.5, 0.5); break;
    case 12297:
      this._setVertImg("kakko8", 0.5, 0.5); break;
    case 12298:
      this._setVertImg("kakko9", 0.5, 0.5); break;
    case 8810:
      this._setVertImg("kakko9", 0.5, 0.5); break;
    case 12299:
      this._setVertImg("kakko10", 0.5, 0.5); break;
    case 8811:
      this._setVertImg("kakko10", 0.5, 0.5); break;
    case 65339:
      this._setVertImg("kakko11", 0.5, 0.5); break;
    case 12308:
      this._setVertImg("kakko11", 0.5, 0.5); break;
    case 91:
      this._setVertImg("kakko11", 0.5, 0.5); break;
    case 65341:
      this._setVertImg("kakko12", 0.5, 0.5); break;
    case 12309:
      this._setVertImg("kakko12", 0.5, 0.5); break;
    case 93:
      this._setVertImg("kakko12", 0.5, 0.5); break;
    case 12304:
      this._setVertImg("kakko17", 0.5, 0.5); break;
    case 12305:
      this._setVertImg("kakko18", 0.5, 0.5); break;
    case 65306:
      this._setVertImg("tenten", 1, 1); break;
    case 58:
      this._setVertImg("tenten", 0.5, 0.5); break;
    case 12290:
      this._setVertImg("kuten", 0.5, 0.5); break;
    case 65377:
      this._setVertImg("kuten", 0.5, 0.5); break;
    case 65294:
      this._setVertImg("period", 1, 1); break;
    case 46:
      this._setVertImg("period", 1, 1); break;
    case 12289:
      this._setVertImg("touten", 0.5, 0.5); break;
    case 65380:
      this._setVertImg("touten", 0.5, 0.5); break;
    case 44:
      this._setVertImg("touten", 0.5, 0.5); break;
    case 65292:
      this._setVertImg("touten", 0.5, 0.5); break;
    case 65374:
      this._setVertImg("kara", 1, 1); break;
    case 12316:
      this._setVertImg("kara", 1, 1); break;
    case 8230:
      this._setVertImg("mmm", 1, 1); break;
    case 8229:
      this._setVertImg("mm", 1, 1); break;
    case 12317: // REVERSED DOUBLE PRIME QUOTATION MARK
      this._setVertImg("dmn1", 1, 1); break;
    case 12318: // DOUBLE PRIME QUOTATION MARK
      this._setRotate(90); break;
    case 12319: // LOW DOUBLE PRIME QUOTATION MARK
      this._setVertImg("dmn2", 1, 1); break;
    case 61: // EQUALS SIGN
    case 8786: // APPROXIMATELY EQUAL TO OR THE IMAGE OF
    case 65309: // FULLWIDTH EQUALS SIGN
      this._setVertImg("equal", 1, 1); break;
    case 8212: // Em dash
      if(__is_ie){
	this._setVertCnv("&#65372", 1, 1); // FULLWIDTH VERTICAL LINE
      } else {
	this._setRotate(90);
      }
      break;
    case 8213: // Horizontal bar(General Punctuation)
      this._setRotate(90);
      if(!__is_ie){
	this._setVertCnv("&#8212;", 1, 1); // Hbar -> Em dash
      }
      break;
    case 8220: // Left Double Quotation Mark
      this._setRotate(90);
      this.hscale = this.vscale = 0.5;
      break;
    case 8221: // Right Double Quotation Mark
      this._setRotate(90);
      this.hscale = this.vscale = 0.5;
      break;
    case 12540:
      this._setVertImg("onbiki", 1, 1); break;
    case 65293: // Halfwidth and Fullwidth Forms
    case 9472: // Box drawings light horizontal(Box Drawing)
      this._setVertCnv("&#8212;", 1, 1);
      this._setRotate(90);
      break;
    case 8593: // up
      this._setVertCnv("&#8594;", 1, 1); break;
    case 8594: // right
      this._setVertCnv("&#8595;", 1, 1); break;
    case 8658: // right2
      this._setVertCnv("&#8595;", 1, 1); break;
    case 8595: // down
      this._setVertCnv("&#8592;", 1, 1); break;
    case 8592: // left
      this._setVertCnv("&#8593;", 1, 1); break;
    }
  };

  /**
   @memberof Nehan.Char
   @param ligature {String}
   */
  Char.prototype.setLigature = function(ligature){
    this.ligature = ligature;
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isNewLine = function(){
    return this.data === "\n";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isNbsp = function(){
    return this.data === "\u00a0" || this.ref === "&nbsp;";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isThinsp = function(){
    return this.data === "\u2009" || this.ref === "&thinsp;";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isEnsp = function(){
    return this.data === "\u2002" || this.ref === "&ensp;";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isEmsp = function(){
    return this.data === "\u2003" || this.ref === "&emsp;";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isTabSpace = function(){
    return (this.data === "\t" || this.ref === "&#09;");
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isSpace = function(){
    return this.data === "\u0020"; // normal space
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isNoBreakSpace = function(){
    return this.isNbsp() || Nehan.List.exists(__no_break_space, Nehan.Closure.eq(this.data));
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isSpaceGroup = function(){
    return this.isSpace() || this.isNbsp() || this.isTabSpace() || this.isThinsp() || this.isEnsp() || this.isEmsp();
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isIdeographicSpace= function(){
    return this.data === "\u3000"; // zenkaku space
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isWhiteSpace = function(){
    return this.isNewLine() || this.isSpaceGroup();
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isVertChar = function(){
    return (typeof this.vertImg != "undefined");
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isRotateChar = function(){
    return (typeof this.rotate != "undefined");
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isCharRef = function(){
    return this.ref !== "";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isKerningChar = function(){
    return this.isZenkaku() && (this.isKutenTouten() || this.isKakko());
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isDash = function(){
    var data = this.data.charCodeAt(0);
    return (data === 8212 || // em dash
	    data === 8213);  // horizontal bar
  };

  /**
   @memberof Nehan.Char
   @param color {Nehan.Color}
   @return {string}
   */
  Char.prototype.getImgSrc = function(color){
    return [Nehan.Config.fontImgRoot, this.vertImg, color + ".png"].join("/");
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isPaddingEnable = function(){
    return (typeof this.paddingStart != "undefined" || typeof this.paddingEnd != "undefined");
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isTenten = function(){
    return this.vertImg && this.vertImg === "tenten";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isHeadNg = function(){
    return Nehan.List.mem(__head_ng, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isTailNg = function(){
    return Nehan.List.mem(__tail_ng, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isSmallKana = function(){
    return Nehan.List.mem(__small_kana, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isSingleHalfChar = function(){
    return this.data.length === 1 && __rex_half_char.test(this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isKakkoStart = function(){
    return Nehan.List.mem(__kakko_start, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isKakkoEnd = function(){
    return Nehan.List.mem(__kakko_end, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isKakko = function(){
    return this.isKakkoStart() || this.isKakkoEnd();
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isKuten = function(){
    return Nehan.List.mem(__kuten, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isTouten = function(){
    return Nehan.List.mem(__touten, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isKutenTouten = function(){
    return this.isKuten() || this.isTouten();
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isZenkaku = function(){
    return escape(this.data).charAt(1) === "u";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isHankaku = function(){
    return !this.isZenkaku(this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isHalfKana = function(){
    return __rex_half_kana.test(this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isHalfKanaSmall = function(){
    return __rex_half_kana_small.test(this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isLigature = function(){
    return Nehan.List.mem(__voiced_mark, this.data);
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.hasLigature = function(){
    return (typeof this.ligature !== "undefined");
  };

  return Char;
})();
