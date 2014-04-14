var Layout = {
  // define root where content text starts from.
  // 'body' or 'html' or 'document' are enabled.
  // 
  // 1. 'document'
  //    content text include <!doctype xxx> tag
  // 2. 'html'
  //    content text include <head> and <html>.
  // 3. 'body'
  //    content text include <body> or content of body itself.
  root:"document",
  direction:"vert", // or 'hori'
  hori:"lr-tb", // used when direction is 'hori'. notice that rl-tb is not supported yet.
  vert:"tb-rl", // used when direction is 'vert'. "tb-lr" is also supported.
  width: 800, // layout default width if width prop not set in 'body' style.
  height: 580, // layout default height if height prop not set in 'body' style.
  fontSize:16, // layout default font-size if font-size prop not set in 'body' style.
  maxFontSize:64,
  rubyRate:0.5, // used when Style.rt["font-size"] is not defined.
  boldRate:0.5,
  lineRate: 2.0, // in nehan.js, extent size of line is specified by [lineRate] * [largest font_size of current line].

  // we need to specify these values(color,font-image-root) to display vertical font-images for browsers not supporting vert writing-mode.
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",

  // these font-fmailies are needed to calculate proper text-metrics.
  vertFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
  horiFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
  fontSizeAbs:{
    "xx-large":"33px",
    "x-large":"24px",
    "large":"18px",
    "medium":"16px",
    "small":"13px",
    "x-small":"10px",
    "xx-small":"8px",
    "larger":"1.2em",
    "smaller":"0.8em"
  },
  getStdFontFamily : function(){
    return (this.direction === "vert")? this.vertFontFamily : this.horiFontFamily;
  },
  getStdBoxFlow : function(){
    var flow_name = this[this.direction];
    return BoxFlows.getByName(flow_name);
  },
  getStdVertFlow : function(){
    return BoxFlows.getByName(this.vert);
  },
  getStdHoriFlow : function(){
    return BoxFlows.getByName(this.hori);
  },
  getHoriIndir : function(){
    return this.hori.split("-")[0]; // "lr" or "rl"
  },
  getRtFontSize : function(base_font_size){
    var rt = Style.rt || null;
    var rt_font_size = rt? rt["font-size"] : null;
    if(rt === null || rt_font_size === null){
      return Math.round(this.rubyRate * base_font_size);
    }
    return UnitSize.getUnitSize(rt_font_size, base_font_size);
  },
  getPaletteFontColor : function(color){
    if(color.getValue().toLowerCase() !== this.fontColor.toLowerCase()){
      return color.getPaletteValue();
    }
    return this.fontColor;
  }
};
