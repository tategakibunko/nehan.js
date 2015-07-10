Nehan.Char = (function(){
  /**
     @memberof Nehan
     @class Char
     @classdesc character object
     @param c1 {String}
     @param is_ref {boolean} - is character reference?
  */
  function Char(c1, is_ref){
    this.data = c1;
    this._type = "char";
    this.isRef = is_ref || false;
    if(this.isRef){
      this._setupRef(c1);
    } else {
      this._setupNormal(c1.charCodeAt(0));
    }
  }
  var __kuten = ["\u3002","."];
  var __touten = ["\u3001", ","];
  var __kakko_start = ["\uff62","\u300c","\u300e","\u3010","\uff3b","\uff08","\u300a","\u3008","\u226a","\uff1c","\uff5b","\x7b","\x5b","\x28", "\u2772", "\u3014"];
  var __kakko_end = ["\u300d","\uff63","\u300f","\u3011","\uff3d","\uff09","\u300b","\u3009","\u226b","\uff1e","\uff5d","\x7d","\x5d","\x29", "\u2773", "\u3015"];
  var __small_kana = ["\u3041","\u3043","\u3045","\u3047","\u3049","\u3063","\u3083","\u3085","\u3087","\u308e","\u30a1","\u30a3","\u30a5","\u30a7","\u30a9","\u30f5","\u30f6","\u30c3","\u30e3","\u30e5","\u30e7","\u30ee"];
  var __head_ng = ["\uff09","\x5c","\x29","\u300d","\u3011","\u3015","\uff3d","\x5c","\x5d","\u3002","\u300f","\uff1e","\u3009","\u300b","\u3001","\uff0e","\x5c","\x2e","\x2c","\u201d","\u301f"];
  var __tail_ng = ["\uff08","\x5c","\x28","\u300c","\u3010","\uff3b","\u3014","\x5c","\x5b","\u300e","\uff1c","\u3008","\u300a","\u201c","\u301d"];
  var __voiced_mark = ["\u3099", "\u309a", "\u309b", "\u309c", "\uff9e", "\uff9f"];
  var __rex_half_char = /[\w!\.\?\/:#;"',]/;
  var __rex_half_kana = /[\uff65-\uff9f]/;
  var __rex_half_kana_small = /[\uff67-\uff6f]/;

  Char.prototype = {
    /**
       @memberof Nehan.Char
       @return {string}
    */
    getData : function(){
      var data = this.cnv || this.data;
      return data + (this.ligature || "");
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssPadding : function(line){
      var padding = new Nehan.Padding();
      if(this.paddingStart){
	padding.setStart(line.style.flow, this.paddingStart);
      }
      if(this.paddingEnd){
	padding.setEnd(line.style.flow, this.paddingEnd);
      }
      return padding.getCss();
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertGlyph : function(line){
      var css = {};
      var is_zenkaku = this.isZenkaku();
      var is_kakko_start = this.isKakkoStart();
      var is_kakko_end = this.isKakkoEnd();
      var padding_enable = this.isPaddingEnable();
      if(Nehan.Env.client.isIE()){
	css.height = "1em";
      }
      if(is_zenkaku && is_kakko_start && !padding_enable){
	css.height = "1em";
	css["margin-top"] = "-0.5em";
      } else if(is_zenkaku && is_kakko_end && !padding_enable){
	css.height = "1em";
	css["margin-bottom"] = "-0.5em";
      } else if(!is_kakko_start && !is_kakko_end && this.vscale < 1){
	css.height = "0.5em";
	Nehan.Args.copy(css, this.getCssPadding(line));
      }
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertImgChar : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css.display = "block";
      css.width = font_size + "px";
      css.height = this.getVertHeight(font_size) + "px";
      if(this.isPaddingEnable()){
	Nehan.Args.copy(css, this.getCssPadding(line));
      }
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertSingleHalfChar : function(line){
      var css = {};
      if(line.edge){
	css["padding-left"] = "0.25em"; // base aligned line
      } else {
	css["text-align"] = "center"; // normal text line(all text with same font-size)
      }
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertHalfKana : function(line){
      var css = {};
      css["text-align"] = "center";
      if(this.hasLigature()){
	css["padding-left"] = "0.25em";
      } else if(this.isHalfKanaSmall()){
	css["padding-left"] = "0.25em";
	css["margin-top"] = "-0.25em";
      }
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertRotateCharIE : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css["css-float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["padding-left"] = Math.round(font_size / 2) + "px";
      css["line-height"] = font_size + "px";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertDashIE : function(line){
      var css = {};
      css["height"] = "0.84em"; // eliminate space between dash for IE.
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertEmphaText : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css["font-size"] = "0.5em";
      css.display = "inline-block";
      css.width = font_size + "px";
      css.height = font_size + "px";
      css["position"] = "absolute";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssHoriEmphaSrc : function(line){
      var css = {};
      css["line-height"] = "1em";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssHoriEmphaText : function(line){
      var css = {};
      css.display = "inline-block";
      css.width = "1em";
      css.height = "1em";
      css["padding-left"] = "0.5em";
      css["line-height"] = "1em";
      css["font-size"] = "0.5em";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertLetterSpacing : function(line){
      var css = {};
      css["margin-bottom"] = line.letterSpacing + "px";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssHoriSpaceChar : function(line){
      var css = {};
      css.display = "inline-block";
      css.width = this.bodySize + "px";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssHoriTabChar : function(line){
      var css = {};
      css.display = "inline-block";
      css.width = this.bodySize + "px";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertSpaceChar : function(line){
      var css = {};
      css.height = this.bodySize + "px";
      css["line-height"] = this.bodySize + "px";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertTabChar : function(line){
      var css = {};
      css.height = this.bodySize + "px";
      css["line-height"] = this.bodySize + "px";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertSmallKana : function(){
      var css = {};
      css.position = "relative";
      css.top = "-0.1em";
      css.right = "-0.12em";
      css.height = this.bodySize + "px";
      css["line-height"] = this.bodySize + "px";
      css.clear = "both";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Float | Int}
    */
    getHoriScale : function(){
      return this.hscale || 1;
    },
    /**
       @memberof Nehan.Char
       @return {Float | Int}
    */
    getVertScale : function(){
      return this.vscale || 1;
    },
    /**
       @memberof Nehan.Char
       @return {Float | Int}
    */
    getVertHeight : function(font_size){
      var vscale = this.getVertScale();
      return (vscale === 1)? font_size : Math.round(font_size * vscale);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
    */
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined");
    },
    /**
       @memberof Nehan.Char
       @return {Int}
    */
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + this.getPaddingSize() + (letter_spacing || 0);
    },
    /**
       @memberof Nehan.Char
       @return {Int}
    */
    getPaddingSize : function(){
      return (this.paddingStart || 0) + (this.paddingEnd || 0);
    },
    /**
       @memberof Nehan.Char
       @return {Int}
    */
    getCharCount : function(){
      if(this.data === " " || this.data === "\t" || this.data === "\u3000"){
	return 0;
      }
      return 1;
    },
    /**
       @memberof Nehan.Char
       @param flow {Nehan.BoxFlow}
       @param font {Nehan.Font}
    */
    setMetrics : function(flow, font){
      var is_vert = flow.isTextVertical();
      var step_scale = is_vert? this.getVertScale() : this.getHoriScale();
      this.bodySize = (step_scale != 1)? Math.round(font.size * step_scale) : font.size;
      if(this.spaceRateStart){
	this.paddingStart = Math.round(this.spaceRateStart * font.size);
      }
      if(this.spaceRateEnd){
	this.paddingEnd = Math.round(this.spaceRateEnd * font.size);
      }
      if(this.img && this.img === "tenten"){
	this.bodySize = font.size;
      }
      if(!is_vert && !this.isRef && this.isHankaku()){
	this.bodySize = Math.round(font.size / 2);
      }
    },
    _setImg : function(img, vscale, hscale){
      this.img = img;
      this.vscale = vscale;
      this.hscale = hscale;
    },
    _setCnv : function(cnv, vscale, hscale){
      this.cnv = cnv;
      this.isRef = true;
      this.vscale = vscale;
      this.hscale = hscale;
    },
    _setRotate : function(angle){
      this.rotate = angle;
    },
    _setRotateOrImg : function(angle, img, vscale, hscale){
      if(Nehan.Env.isTransformEnable){
	this._setRotate(angle);
	this.vscale = vscale;
	this.hscale = hscale;
	return;
      }
      this._setImg(img, vscale, hscale);
    },
    _setupRef : function(c1){
      this.cnv = c1;
      switch(c1){
      case "&nbsp;":
	this._setupNbsp();
	break;
      case "&thinsp;":
	this.vscale = this.hscale = Nehan.Display.spaceSizeRate.thinsp;
	break;
      case "&ensp;":
	this.vscale = this.hscale = Nehan.Display.spaceSizeRate.ensp;
	break;
      case "&emsp;":
	this.vscale = this.hscale = Nehan.Display.spaceSizeRate.emsp;
	break;
      case "&#09;":
	this._setupTabSpace();
	break;
      case "&lt;":
	this._setRotateOrImg(90, "kakko7", 0.5, 0.5);
	break;
      case "&gt;":
	this._setRotateOrImg(90, "kakko8", 0.5, 0.5);
	break;
      }
    },
    _setupNbsp : function(){
      this.vscale = this.hscale = Nehan.Display.spaceSizeRate.nbsp;
    },
    _setupTabSpace : function(){
      this.vscale = this.hscale = Math.floor(Nehan.Display.tabCount / 2);
    },
    _setupNormal : function(code){
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
	this._setImg("kakko1", 0.5, 0.5); break;
      case 65378:
	this._setImg("kakko1", 0.5, 0.5); break;
      case 12301:
	this._setImg("kakko2", 0.5, 0.5); break;
      case 65379:
	this._setImg("kakko2", 0.5, 0.5); break;
      case 12302:
	this._setImg("kakko3", 0.5, 0.5); break;
      case 12303:
	this._setImg("kakko4", 0.5, 0.5); break;
      case 65288:
	this._setImg("kakko5", 0.5, 0.5); break;
      case 40:
	this._setImg("kakko5", 0.5, 0.5); break;
      case 65371:
	this._setImg("kakko5", 0.5, 0.5); break;
      case 123:
	this._setImg("kakko5", 0.5, 0.5); break;
      case 65289:
	this._setImg("kakko6", 0.5, 0.5); break;
      case 41:
	this._setImg("kakko6", 0.5, 0.5); break;
      case 65373:
	this._setImg("kakko6", 0.5, 0.5); break;
      case 125:
	this._setImg("kakko6", 0.5, 0.5); break;
      case 65308:
	this._setImg("kakko7", 0.5, 0.5); break;
      case 12296:
	this._setImg("kakko7", 0.5, 0.5); break;
      case 65310:
	this._setImg("kakko8", 0.5, 0.5); break;
      case 12297:
	this._setImg("kakko8", 0.5, 0.5); break;
      case 12298:
	this._setImg("kakko9", 0.5, 0.5); break;
      case 8810:
	this._setImg("kakko9", 0.5, 0.5); break;
      case 12299:
	this._setImg("kakko10", 0.5, 0.5); break;
      case 8811:
	this._setImg("kakko10", 0.5, 0.5); break;
      case 65339:
	this._setImg("kakko11", 0.5, 0.5); break;
      case 12308:
	this._setImg("kakko11", 0.5, 0.5); break;
      case 91:
	this._setImg("kakko11", 0.5, 0.5); break;
      case 65341:
	this._setImg("kakko12", 0.5, 0.5); break;
      case 12309:
	this._setImg("kakko12", 0.5, 0.5); break;
      case 93:
	this._setImg("kakko12", 0.5, 0.5); break;
      case 12304:
	this._setImg("kakko17", 0.5, 0.5); break;
      case 12305:
	this._setImg("kakko18", 0.5, 0.5); break;
      case 65306:
	this._setImg("tenten", 1, 1); break;
      case 58:
	this._setImg("tenten", 1, 1); break;
      case 12290:
	this._setImg("kuten", 0.5, 0.5); break;
      case 65377:
	this._setImg("kuten", 0.5, 0.5); break;
      case 65294:
	this._setImg("period", 1, 1); break;
      case 46:
	this._setImg("period", 1, 1); break;
      case 12289:
	this._setImg("touten", 0.5, 0.5); break;
      case 65380:
	this._setImg("touten", 0.5, 0.5); break;
      case 44:
	this._setImg("touten", 0.5, 0.5); break;
      case 65292:
	this._setImg("touten", 0.5, 0.5); break;
      case 65374:
	this._setImg("kara", 1, 1); break;
      case 12316:
	this._setImg("kara", 1, 1); break;
      case 8230:
	this._setImg("mmm", 1, 1); break;
      case 8229:
	this._setImg("mm", 1, 1); break;
      case 12317:
	this._setImg("dmn1", 1, 1); break;
      case 12319:
	this._setImg("dmn2", 1, 1); break;
      case 65309:
	this._setImg("equal", 1, 1); break;
      case 61:
	this._setImg("equal", 1, 1); break;
      case 8212: // Em dash
      case 8221: // Right Double Quotation Mark
	this._setRotate(90); break;
      case 12540:
	this._setImg("onbiki", 1, 1); break;
      case 8213: // Horizontal bar(General Punctuation)
      case 65293: // Halfwidth and Fullwidth Forms
      case 9472: // Box drawings light horizontal(Box Drawing)
	this._setCnv("&#8212;", 1, 1);
	this._setRotate(90);
	break;
      case 8593: // up
	this._setCnv("&#8594;", 1, 1); break;
      case 8594: // right
	this._setCnv("&#8595;", 1, 1); break;
      case 8658: // right2
	this._setCnv("&#8595;", 1, 1); break;
      case 8595: // down
	this._setCnv("&#8592;", 1, 1); break;
      case 8592: // left
	this._setCnv("&#8593;", 1, 1); break;
      }
    },
    /**
       @memberof Nehan.Char
       @param ligature {String}
    */
    setLigature : function(ligature){
      this.ligature = ligature;
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isNewLine : function(){
      return this.data === "\n";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
    */
    isNbsp : function(){
      return (this.data === " " || this.cnv === "&nbsp;");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
    */
    isThinsp : function(){
      return this.cnv === "&thinsp;";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
    */
    isEnsp : function(){
      return this.cnv === "&ensp;";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
    */
    isEmsp : function(){
      return this.cnv === "&emsp;";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isTabSpace : function(){
      return (this.data === "\t" || this.cnv === "&#09;");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isSpace : function(){
      return this.isNbsp() || this.isTabSpace() || this.isThinsp() || this.isEnsp() || this.isEmsp();
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isIdeographicSpace: function(){
      return this.data === "\u3000";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isWhiteSpace : function(){
      return this.isNewLine() || this.isSpace();
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isImgChar : function(){
      return (typeof this.img != "undefined");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isCnvChar : function(){
      return (typeof this.cnv != "undefined");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isRotateChar : function(){
      return (typeof this.rotate != "undefined");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isCharRef : function(){
      return this.isRef;
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKerningChar : function(){
      return this.isZenkaku() && (this.isKutenTouten() || this.isKakko());
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
    */
    isDash : function(){
      return this.cnv === "&#8212;";
    },
    /**
       @memberof Nehan.Char
       @param color {Nehan.Color}
       @return {string}
     */
    getImgSrc : function(color){
      return [Nehan.Display.fontImgRoot, this.img, color + ".png"].join("/");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isPaddingEnable : function(){
      return (typeof this.paddingStart != "undefined" || typeof this.paddingEnd != "undefined");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isTenten : function(){
      return this.img && this.img === "tenten";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isHeadNg : function(){
      return Nehan.List.mem(__head_ng, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isTailNg : function(){
      return Nehan.List.mem(__tail_ng, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isSmallKana : function(){
      return Nehan.List.mem(__small_kana, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isSingleHalfChar : function(){
      return this.data.length === 1 && __rex_half_char.test(this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKakkoStart : function(){
      return Nehan.List.mem(__kakko_start, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKakkoEnd : function(){
      return Nehan.List.mem(__kakko_end, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKakko : function(){
      return this.isKakkoStart() || this.isKakkoEnd();
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKuten : function(){
      return Nehan.List.mem(__kuten, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isTouten : function(){
      return Nehan.List.mem(__touten, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKutenTouten : function(){
      return this.isKuten() || this.isTouten();
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isZenkaku : function(){
      return escape(this.data).charAt(1) === "u";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isHankaku : function(){
      return !this.isZenkaku(this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isHalfKana : function(){
      return __rex_half_kana.test(this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isHalfKanaSmall : function(){
      return __rex_half_kana_small.test(this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isLigature : function(){
      return Nehan.List.mem(__voiced_mark, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    hasLigature : function(){
      return (typeof this.ligature !== "undefined");
    }
  };

  return Char;
})();
