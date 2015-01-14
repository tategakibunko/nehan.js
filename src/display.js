/**
   standard page settings.
   @namespace Nehan.Display
*/
var Display = {
  /**
     <pre>
      define root where content text starts from.
      'body' or 'html' or 'document' are enabled.
      
      1. 'document'
         &lt;!doctype xxx&gt; tag is included in content text.
      2. 'html'
         &lt;head&gt; and &lt;html&gt; are included in content text.
      3. 'body'
         &lt;body&gt; or content of body itself is included in content text.
     </pre>
     @memberof Nehan.Display
     @type {String}
     @default "document"
  */
  root:"document",

  /**
     standard inline direction, "vert" or "hori".

     @memberof Nehan.Display
     @type {String}
     @default "vert"
  */
  direction:"vert",
  /**
     standard box flow for "vert" and "hori".

     @memberof Nehan.Display
     @type {Object}
     @default {hori:"lr-tb", vert:"tb-rl"}
  */
  boxFlow:{
    hori:"lr-tb", // used when direction is 'hori'. notice that rl-tb is not supported yet.
    vert:"tb-rl", // used when direction is 'vert'. "tb-lr" is also supported.
  },
  /**
     standard paging direction for "vert" and "hori". "lr" means left to right, "rl" means right to left.
     
     @memberof Nehan.Display
     @type {Object}
     @default {hori:"lr", vert:"rl"}
  */
  pagingDirection:{
    hori:"lr", // paging direction 'left to right'
    vert:"rl"  // paging direction 'right to left'
  },
  /**
     standard page width, used when Style["body"].width is not defined.

     @memberof Nehan.Display
     @type {int}
     @default screen.width
  */
  width: screen.width,
  /**
     standard page height, used when Style["body"].height is not defined.

     @memberof Nehan.Display
     @type {int}
     @default screen.height
  */
  height: screen.height,
  /**
     standard font size, used when Style["body"]["font-size"] is not defined.

     @memberof Nehan.Display
     @type {int}
     @default 16
  */
  fontSize:16,
  /**
     standard minimum font size.

     @memberof Nehan.Display
     @type {int}
     @default 12
  */
  minFontSize:12,
  /**
     standard maximum font size.

     @memberof Nehan.Display
     @type {int}
     @default 90
  */
  maxFontSize:90,
  /**
     standard minimum table cell size. if table-layout is set to 'auto', all sizes of cell are larger than this value.

     @memberof Nehan.Display
     @type {int}
     @default 48
  */
  minTableCellSize:48,
  /**
     standard rate of ruby font size. used when Style.rt["font-size"] is not defined.

     @memberof Nehan.Display
     @type {Float}
     @default 0.5
  */
  rubyRate:0.5,
  /**
     standard bold plus size rate, it's used to calculate sketchy bold metrics in the environment with no canvas element.

     @memberof Nehan.Display
  */
  boldRate:0.5,
  /**
    * standard line rate. note that extent size of line is specified by<br>
    * [lineRate] * [max-font-size of current-line] in nehan.js.

     @memberof Nehan.Display
     @type {Float}
     @default 2.0
  */
  lineRate: 2.0,
  /**
     extra space rate for vertical word in vertical mode.

     @memberof Nehan.Display
     @type {Float}
     @default 0.25
  */
  vertWordSpaceRate: 0.25,
  /**
     standard font color. this is required for browsers not supporting writing-mode to display vertical font-images.

     @memberof Nehan.Display
     @type {String}
     @default "000000"
  */
  fontColor:"000000",
  /**
     standard link color. this is required for browsers not supporting writing-mode to display vertical font-images.

     @memberof Nehan.Display
     @type {String}
     @default "0000FF"
  */
  linkColor:"0000FF",
  /**
     font image url. this is required for browsers not supporting writing-mode to display vertical font-images.

     @memberof Nehan.Display
     @type {String}
     @default "http://nehan.googlecode.com/hg/char-img"
  */
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",

  /**
     standard font family. this is required to calculate proper text-metrics of alphabetical word.

     @memberof Nehan.Display
     @type {String}
     @default "'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace"
  */
  fontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
  //fontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",

  /**
     font sizes defined by name

     @memberof Nehan.Display
     @type {Object}
     @default <pre>
     {
      "xx-large":"33px",
      "x-large":"24px",
      "large":"18px",
      "medium":"16px",
      "small":"13px",
      "x-small":"10px",
      "xx-small":"8px",
      "larger":"1.2em",
      "smaller":"0.8em"
    }
     </pre>
  */
  fontSizeNames:{
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
  /**
     @memberof Nehan.Display
     @param flow {Nehan.BoxFlow}
     @return {int}
  */
  getMeasure : function(flow){
    return this[flow.getPropMeasure()];
  },
  /**
     @memberof Nehan.Display
     @param flow {Nehan.BoxFlow}
     @return {int}
  */
  getExtent : function(flow){
    return this[flow.getPropExtent()];
  },
  /**
     @memberof Nehan.Display
     @return {String} "lr" or "rl"
  */
  getPagingDirection : function(){
    return this.pagingDirection[this.direction];
  },
  /**
     @memberof Nehan.Display
     @return {Nehan.BoxFlow}
  */
  getStdBoxFlow : function(){
    var flow_name = this.boxFlow[this.direction];
    return BoxFlows.getByName(flow_name);
  },
  /**
     @memberof Nehan.Display
     @return {Nehan.BoxFlow}
  */
  getStdVertFlow : function(){
    return BoxFlows.getByName(this.boxFlow.vert);
  },
  /**
     @memberof Nehan.Display
     @return {Nehan.BoxFlow}
  */
  getStdHoriFlow : function(){
    return BoxFlows.getByName(this.boxFlow.hori);
  },
  /**
     @memberof Nehan.Display
     @return {Float}
  */
  getRtFontSize : function(base_font_size){
    var rt = Style.rt || null;
    var rt_font_size = rt? rt["font-size"] : null;
    if(rt === null || rt_font_size === null){
      return Math.round(this.rubyRate * base_font_size);
    }
    return StyleContext.prototype._computeUnitSize.call(this, rt_font_size, base_font_size);
  },
  /**
     @memberof Nehan.Display
     @return {String}
  */
  getPaletteFontColor : function(color){
    if(color.getValue().toLowerCase() !== this.fontColor.toLowerCase()){
      return color.getPaletteValue();
    }
    return this.fontColor;
  }
};

