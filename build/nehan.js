/*
 nehan.js
 Copyright (C) 2010-2014 Watanabe Masaki<lambda.watanabe[at]gmail.com>
 http://tb.antiscroll.com/docs/nehan/

 licensed under MIT license.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

;var Nehan;
if(!Nehan){
  Nehan = {};
}

// this function ends at the tail of this source.
Nehan.setup = function(_engine_args){
var __engine_args = _engine_args || {};

var Config = {
  lang:"ja-JP",
  debug:false,
  kerning:true,
  justify:true,
  maxRollbackCount : 10,
  minBlockScaleDownRate : 65,
  useVerticalGlyphIfEnable: true,
  useStrictWordMetrics: true,
  iboxEnable:false,
  maxBase:36,
  lexingBufferLen : 2000
};

var Layout = {
  root:"document", // 'body' or 'html' or 'document'
  direction:"vert",
  hori:"lr-tb", // sorry, rl-tb is not supported yet.
  vert:"tb-rl", // or "tb-lr"
  width: 800,
  height: 580,
  fontSize:16,
  maxFontSize:64,
  rubyRate:0.5, // used when Style.rt["font-size"] not defined.
  boldRate:0.5,
  lineRate: 2.0, // in nehan.js, extent size of line is specified by [lineRate] * [largest font_size of currentline].
  listMarkerSpacingRate:0.4, // spacing size of list item(<LI>) marker.

  // we need to specify these values(color,font-image-root) to display vertical font-images for browsers not supporting vert writing-mode.
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",

  // these font-fmailies are needed to calculate proper text-metrics.
  vertFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
  horiFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
  markerFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
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
  createRootBox : function(size){
    var box = new Box(size, null, {
      type:"body"
    });

    // set root box properties.
    box.font = this.getStdFont();
    box.flow = this.getStdBoxFlow();
    box.lineRate = this.lineRate;
    box.textAlign = "start";
    box.letterSpacing = 0;
    return box;
  },
  createBox : function(size, parent, opt){
    var box = new Box(size, parent, opt);

    // inherit parent box properties.
    box.flow = parent.flow;
    box.lineRate = parent.lineRate;
    box.textAlign = parent.textAlign;
    box.font = new Font(parent.font.size);
    box.color = parent.color;
    box.letterSpacing = parent.letterSpacing;
    return box;
  },
  getStdPageSize : function(){
    return new BoxSize(this.width, this.height);
  },
  getStdMeasure : function(){
    var flow = this.getStdBoxFlow();
    return this[flow.getPropMeasure()];
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
  getStdFont : function(){
    var font = new Font(Layout.fontSize);
    font.family = (this.direction === "vert")? this.vertFontFamily : this.horiFontFamily;
    return font;
  },
  getListMarkerSpacingSize : function(font_size){
    font_size = font_size || this.fontSize;
    return Math.round(font_size * this.listMarkerSpacingRate);
  },
  getVertBlockDir : function(){
    return this.vert.split("-")[1];
  },
  getHoriIndir : function(){
    return this.hori.split("-")[0];
  },
  getRubyRate : function(){
    if(Style.rt && Style.rt["font-size"]){
      return parseFloat(Style.rt["font-size"]);
    }
    return this.rubyRate || 0.5;
  },
  getRubyFontSize : function(base_font_size){
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

var Env = (function(){
  var nav = navigator.appName;
  var ua = navigator.userAgent.toLowerCase();
  var is_pure_trident = ua.indexOf("trident") >= 0 && ua.indexOf("msie") < 0;
  var browser, version, is_transform_enable, tmp_match;
  if(is_pure_trident){
    browser = "msie";
    tmp_match = ua.match(/rv:([\.\d]+)/i);
    version = tmp_match? parseInt(tmp_match[1], 10) : "";
  } else {
    var matched = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/);
    if(matched){
      tmp_match = ua.match(/version\/([\.\d]+)/i);
      if(tmp_match){
	matched[2] = tmp_match[1];
      }
      browser = matched[1].toLowerCase();
      version = parseInt(matched[2], 10);
    } else {
      browser = nav.toLowerCase();
      version = parseInt(navigator.appVersion, 10);
    }
  }

  var is_ie = browser === "msie";
  var is_win = ua.indexOf("windows") >= 0;
  var is_mac = ua.indexOf("macintosh") >= 0;
  var is_chrome = browser.indexOf("chrome") >= 0;
  var is_safari = browser.indexOf("safari") >= 0;
  var is_iphone = ua.indexOf("iphone") != -1;
  var is_ipod = ua.indexOf("ipod") != -1;
  var is_ipad = ua.indexOf("ipad") != -1;
  var is_iphone_family = (is_iphone || is_ipod || is_ipad);
  var is_android_family = ua.indexOf("android") != -1;
  var is_smart_phone = is_iphone_family || is_android_family;
  var is_webkit = ua.indexOf("webkit") != -1;
  var is_transform_enable = is_pure_trident || !(is_ie && version <= 8);
  var is_chrome_vert_glyph_enable = is_chrome && (is_win || is_mac) && version >= 24;
  var is_safari_vert_glyph_enable = is_safari && version >= 5;
  var is_vertical_glyph_enable = is_chrome_vert_glyph_enable || is_safari_vert_glyph_enable;

  return {
    version : version,
    isIE : is_ie,
    isTrident : is_pure_trident,
    isChrome : is_chrome,
    isWebkit : is_webkit,
    isIphone : is_iphone,
    isIpod : is_ipod,
    isIpad : is_ipad,
    isIphoneFamily : is_iphone_family,
    isAndroidFamily : is_android_family,
    isSmartPhone : is_smart_phone,
    isTransformEnable : is_transform_enable,
    isVerticalGlyphEnable : is_vertical_glyph_enable
  };
})();


/*
  About 'line-rate' property in nehan.

  In normal html, size of 'line-height:1.0em' is determined by
  font size of 'parent' block.

  In contrast, property line-rate is determined by max font size of
  'current line'.

  Assume that font-size of parent block is 16px, and max font size of
  current line is 32px, line-height:1.0em is 16px, but line-rate:1.0em is 32px.
 */
var Style = {
  //-------------------------------------------------------
  // tag / a
  //-------------------------------------------------------
  "a":{
    "display":"inline"
  },
  "abbr":{
    "display":"inline"
  },
  "address":{
    "display":"inline",
    "font-style":"italic",
    "section":true
  },
  "area":{
  },
  "article":{
    "display":"block",
    "section":true
  },
  "aside":{
    "display":"block",
    "section":true
  },
  "audio":{
  },
  //-------------------------------------------------------
  // tag / b
  //-------------------------------------------------------
  "b":{
    "display":"inline",
    "font-weight":"bold"
  },
  "base":{
  },
  "bdi":{
    "display":"inline"
  },
  "bdo":{
    "display":"inline"
  },
  "blockquote":{
    "color":"#666666",
    "display":"block",
    "section-root":true,
    "padding":{
      "start":"1em",
      "end":"1em",
      "before":"0.5em",
      "after":"0.5em"
    },
    "margin":{
      "after":"1.5em"
    }
  },
  "body":{
    "display":"block",
    "section-root":true
  },
  "br":{
    "display":"inline",
    "single":true
  },
  "button":{
    "display":"inline",
    "interactive":true
  },
  //-------------------------------------------------------
  // tag / c
  //-------------------------------------------------------
  "canvas":{
    "display":"inline",
    "embeddable":true
  },
  "caption":{
    "display":"block",
    "text-align":"center",
    "margin":{
      "after":"0.5em"
    }
  },
  "cite":{
    "display":"inline"
  },
  "code":{
    "font-family":"'andale mono', 'lucida console', monospace",
    "display":"inline"
  },
  "col":{
  },
  "colgroup":{
  },
  "command":{
  },
  //-------------------------------------------------------
  // tag / d
  //-------------------------------------------------------
  "datalist":{
  },
  "dd":{
    "display":"block",
    "margin":{
      "start":"1em",
      "end":"1em",
      "after":"1.6em"
    }
  },
  "del":{
    "color":"#666666",
    "display":"inline"
  },
  "details":{
    "display":"block",
    "section-root":true
  },
  "dfn":{
    "display":"inline",
    "font-style":"italic"
  },
  "div":{
    "display":"block"
  },
  "dl":{
    "display":"block"
  },
  "dt":{
    "display":"block",
    "font-weight":"bold",
    "margin":{
      "after":"0.2em"
    }
  },
  //-------------------------------------------------------
  // tag / e
  //-------------------------------------------------------
  "em":{
    "display":"inline",
    "font-style":"italic"
  },
  "embed":{
  },
  // nehan original tag
  "end-page":{
    "display":"block",
    "single":true
  },
  //-------------------------------------------------------
  // tag / f
  //-------------------------------------------------------
  "fieldset":{
    "display":"block",
    "section-root":true,
    "padding":{
      "start":"1em",
      "end":"0.2em",
      "before":"0.2em",
      "after":"1em"
    },
    "margin":{
      "after":"1.5em"
    },
    "border-width":"1px"
  },
  "figure":{
    "display":"block",
    "section-root":true
  },
  "figcaption":{
    "display":"block",
    "text-align":"center",
    "font-size": "0.8em"
  },
  "footer":{
    "display":"block",
    "section":true
  },
  // need to define to keep compatibility.
  "font":{
    "display":"inline"
  },
  "form":{
    "display":"block"
  },
  //-------------------------------------------------------
  // tag / h
  //-------------------------------------------------------
  "h1":{
    "display":"block",
    "line-rate":1.4,
    "font-size":"2.4em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"0.5em"
    }
  },
  "h2":{
    "display":"block",
    "line-rate":1.4,
    "font-size":"2.0em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"0.75em"
    }
  },
  "h3":{
    "display":"block",
    "line-rate":1.4,
    "font-size":"1.6em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"1em"
    }
  },
  "h4":{
    "display":"block",
    "line-rate":1.4,
    "font-size":"1.4em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"1.25em"
    }
  },
  "h5":{
    "display":"block",
    "line-rate":1.4,
    "font-size":"1.0em",
    "font-weight":"bold",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"1.5em"
    }
  },
  "h6":{
    "display":"block",
    "line-rate":1.4,
    "font-weight":"bold",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "font-size":"1.0em"
  },
  "head":{
  },
  "header":{
    "display":"block",
    "section":true
  },
  "hr":{
    "display":"block",
    "box-sizing":"content-box",
    "border-color":"#b8b8b8",
    "border-style":"solid",
    "single":true,
    "margin":{
      "after":"1em"
    },
    "border-width":{
      "after":"1px"
    }
  },
  "hr.nehan-space":{
    "border-width":"0px"
  },
  "html":{
    "display":"block"
  },
  //-------------------------------------------------------
  // tag / i
  //-------------------------------------------------------
  "i":{
    "display":"inline"
  },
  "iframe":{
    "display":"block",
    "embeddable":true
  },
  "ins":{
  },
  "img":{
    "display":"inline",
    "box-sizing":"content-box",
    "single":true
  },
  "input":{
    "display":"inline",
    "interactive":true,
    "single":true
  },
  //-------------------------------------------------------
  // tag / k
  //-------------------------------------------------------
  "kbd":{
    "display":"inline"
  },
  "keygen":{
  },
  //-------------------------------------------------------
  // tag / l
  //-------------------------------------------------------
  "label":{
    "display":"inline"
  },
  "legend":{
    "display":"block",
    "font-weight":"bold",
    "line-rate":1.5
  },
  "li":{
    "display":"list-item",
    "margin":{
      "after":"0.6em"
    }
  },
  "li-mark":{
    "display":"block"
  },
  "li-body":{
    "display":"block"
  },
  "link":{
    "meta":true,
    "single":true
  },
  //-------------------------------------------------------
  // tag / m
  //-------------------------------------------------------
  "main":{
    "display":"block"
  },
  "map":{
  },
  "mark":{
    "display":"inline"
  },
  "menu":{
    "display":"block"
  },
  "meta":{
    "meta":true,
    "single":true
  },
  "meter":{
    "display":"inline"
  },
  //-------------------------------------------------------
  // tag / n
  //-------------------------------------------------------
  "nav":{
    "display":"block",
    "section":true
  },
  "noscript":{
    "meta":true
  },
  //-------------------------------------------------------
  // tag / o
  //-------------------------------------------------------
  "object":{
    "display":"inline",
    "embeddable":true
  },
  "ol":{
    "display":"block",
    "list-style-image":"none",
    "list-style-position": "outside",
    "list-style-type": "decimal",
    "margin":{
      "before":"1em"
    }
  },
  "ol ol":{
    "margin":{
      "before":"0em"
    }
  },
  "ol ul":{
    "margin":{
      "before":"0em"
    }
  },
  "optgroup":{
  },
  "option":{
  },
  "output":{
  },
  //-------------------------------------------------------
  // tag / p
  //-------------------------------------------------------
  "p":{
    "display":"block",
    "margin":{
      "after":"1.5em"
    }
  },
  // this is nehan local syntax.
  // as we use <br> to break line,
  // we use <page-break> to break the page.
  "page-break":{
    "display":"block",
    "single":true
  },
  "param":{
  },
  "pre":{
    "display":"block",
    "white-space":"pre"
  },
  "progress":{
    "display":"inline"
  },
  //-------------------------------------------------------
  // tag / q
  //-------------------------------------------------------
  "q":{
    "display":"block"
  },
  //-------------------------------------------------------
  // tag / r
  //-------------------------------------------------------
  "rb":{
    "display":"inline"
  },
  "rp":{
    "display":"inline"
  },
  "ruby":{
    "display":"inline"
  },
  "rt":{
    "font-size":"0.5em",
    "line-rate":1.0,
    "display":"inline"
  },
  //-------------------------------------------------------
  // tag / s
  //-------------------------------------------------------
  "s":{
    "display":"inline"
  },
  "samp":{
    "display":"inline"
  },
  "script":{
    "display":"inline",
    "meta":true
  },
  "section":{
    "display":"block",
    "section":true
  },
  "select":{
  },
  "small":{
    "display":"inline",
    "font-size":"0.8em"
  },
  "source":{
  },
  "span":{
    "display":"inline"
  },
  "strong":{
    "display":"inline",
    "font-weight":"bold"
  },
  "style":{
    "display":"inline",
    "meta":true
  },
  "sub":{
    "display":"inine"
  },
  "summary":{
    "display":"inline"
  },
  "sup":{
    "display":"inine"
  },
  //-------------------------------------------------------
  // tag / t
  //-------------------------------------------------------
  "table":{
    //"display":"table",
    "display":"block",
    "embeddable":true,
    "table-layout":"fixed", // 'auto' not supported yet.
    "background-color":"white",
    "border-collapse":"collapse", // 'separate' not supported yet.
    "border-color":"#a8a8a8",
    "border-style":"solid",
    //"border-spacing":"5px", // TODO: support batch style like "5px 10px".
    "border-width":"1px",
    "margin":{
      "start":"0.5em",
      "end":"0.5em",
      "after":"1.6em"
    }
  },
  "tbody":{
    "display":"block"
  },
  "td":{
    "display":"block",
    "section-root":true,
    "border-width":"1px",
    "border-color":"#a8a8a8",
    "border-style":"solid",
    "padding":{
      "start":"0.8em",
      "end":"0.8em",
      "before":"0.5em",
      "after":"0.5em"
    }
  },
  "textarea":{
    "display":"inline",
    "embeddable":true,
    "interactive":true
  },
  "tfoot":{
    "display":"block",
    "border-color":"#a8a8a8",
    "border-style":"solid",
    "font-style":"italic"
  },
  "th":{
    "display":"block",
    "line-rate":1.4,
    "border-width":"1px",
    "border-color":"#a8a8a8",
    "border-style":"solid",
    "padding":{
      "start":"0.8em",
      "end":"0.8em",
      "before":"0.5em",
      "after":"0.5em"
    }
  },
  "thead":{
    "display":"block",
    "font-weight":"bold",
    "background-color":"#c3d9ff",
    "border-color":"#a8a8a8",
    "border-style":"solid"
  },
  "time":{
    "display":"inline"
  },
  "title":{
    "meta":true
  },
  "tr":{
    "display":"table-row",
    "border-color":"#a8a8a8",
    "border-style":"solid"
  },
  "track":{
  },
  //-------------------------------------------------------
  // tag / u
  //-------------------------------------------------------
  "u":{
    "display":"inline"
  },
  "ul":{
    "display":"block",
    "list-style-image":"none",
    "list-style-type":"disc",
    "list-style-position":"outside",
    "margin":{
      "before":"1em"
    }
  },
  "ul ul":{
    "margin":{
      "before":"0em"
    }
  },
  "ul ol":{
    "margin":{
      "before":"0em"
    }
  },
  //-------------------------------------------------------
  // tag / v
  //-------------------------------------------------------
  "var":{
    "display":"inline"
  },
  "video":{
    "display":"inline",
    "embeddable":true
  },
  //-------------------------------------------------------
  // tag / w
  //-------------------------------------------------------
  "wbr":{
    "display":"inline",
    "single":true
  },
  //-------------------------------------------------------
  // tag / others
  //-------------------------------------------------------
  "?xml":{
    "single":true
  },
  "!doctype":{
    "single":true
  },
  //-------------------------------------------------------
  // rounded corner
  //-------------------------------------------------------
  ".nehan-rounded":{
    "padding":["1.6em", "1.0em", "1.6em", "1.0em"],
    "border-radius":"10px"
  },
  //-------------------------------------------------------
  // font-size classes
  //-------------------------------------------------------
  ".nehan-xx-large":{
    "font-size": Layout.fontSizeAbs["xx-large"]
  },
  ".nehan-x-large":{
    "font-size": Layout.fontSizeAbs["x-large"]
  },
  ".nehan-large":{
    "font-size": Layout.fontSizeAbs.large
  },
  ".nehan-medium":{
    "font-size": Layout.fontSizeAbs.medium
  },
  ".nehan-small":{
    "font-size": Layout.fontSizeAbs.small
  },
  ".nehan-x-small":{
    "font-size": Layout.fontSizeAbs["x-small"]
  },
  ".nehan-xx-small":{
    "font-size": Layout.fontSizeAbs["xx-small"]
  },
  ".nehan-larger":{
    "font-size": Layout.fontSizeAbs.larger
  },
  ".nehan-smaller":{
    "font-size": Layout.fontSizeAbs.smaller
  },
  //-------------------------------------------------------
  // display classes
  //-------------------------------------------------------
  ".nehan-disp-block":{
    "display":"block"
  },
  ".nehan-disp-inline":{
    "display":"inline"
  },
  ".nehan-disp-inline-block":{
    "display":"inline-block"
  },
  //-------------------------------------------------------
  // text-align classes
  //-------------------------------------------------------
  ".nehan-ta-start":{
    "text-align":"start"
  },
  ".nehan-ta-center":{
    "text-align":"center"
  },
  ".nehan-ta-end":{
    "text-align":"end"
  },
  //-------------------------------------------------------
  // float classes
  //-------------------------------------------------------
  ".nehan-float-start":{
    "float":"start"
  },
  ".nehan-float-end":{
    "float":"end"
  },
  //-------------------------------------------------------
  // flow classes
  //-------------------------------------------------------
  ".nehan-flow-lr-tb":{
    "flow":"lr-tb"
  },
  ".nehan-flow-tb-rl":{
    "flow":"tb-rl"
  },
  ".nehan-flow-tb-lr":{
    "flow":"tb-lr"
  },
  ".nehan-flow-rl-tb":{
    "flow":"rl-tb"
  },
  ".nehan-flow-flip":{
    "flow":"flip"
  },
  //-------------------------------------------------------
  // list-style-position classes
  //-------------------------------------------------------
  ".nehan-lsp-inside":{
    "list-style-position":"inside"
  },
  ".nehan-lsp-outside":{
    "list-style-position":"outside"
  },
  //-------------------------------------------------------
  // list-style-type classes
  //-------------------------------------------------------
  ".nehan-lst-none":{
    "list-style-type":"none"
  },
  ".nehan-lst-decimal":{
    "list-style-type":"decimal"
  },
  ".nehan-lst-disc":{
    "list-style-type":"disc"
  },
  ".nehan-lst-circle":{
    "list-style-type":"circle"
  },
  ".nehan-lst-square":{
    "list-style-type":"square"
  },
  ".nehan-lst-decimal-leading-zero":{
    "list-style-type":"decimal-leading-zero"
  },
  ".nehan-lst-lower-alpha":{
    "list-style-type":"lower-alpha"
  },
  ".nehan-lst-upper-alpha":{
    "list-style-type":"upper-alpha"
  },
  ".nehan-lst-lower-latin":{
    "list-style-type":"lower-latin"
  },
  ".nehan-lst-upper-latin":{
    "list-style-type":"upper-latin"
  },
  ".nehan-lst-lower-roman":{
    "list-style-type":"lower-roman"
  },
  ".nehan-lst-upper-roman":{
    "list-style-type":"upper-roman"
  },
  ".nehan-lst-lower-greek":{
    "list-style-type":"lower-greek"
  },
  ".nehan-lst-upper-greek":{
    "list-style-type":"upper-greek"
  },
  ".nehan-lst-cjk-ideographic":{
    "list-style-type":"cjk-ideographic"
  },
  ".nehan-lst-hiragana":{
    "list-style-type":"hiragana"
  },
  ".nehan-lst-hiragana-iroha":{
    "list-style-type":"hiragana-iroha"
  },
  ".nehan-lst-katakana":{
    "list-style-type":"katakana"
  },
  ".nehan-lst-katakana-iroha":{
    "list-style-type":"katakana-iroha"
  },
  //-------------------------------------------------------
  // text-combine
  //-------------------------------------------------------
  ".nehan-tcy":{
    "text-combine":"horizontal"
  },
  ".nehan-text-combine":{
    "text-combine":"horizontal"
  },
  //-------------------------------------------------------
  // text emphasis
  //-------------------------------------------------------
  ".nehan-empha-dot-filled":{
    "text-emphasis-style":"filled dot"
  },
  ".nehan-empha-dot-open":{
    "text-emphasis-style":"open dot"
  },
  ".nehan-empha-circle-filled":{
    "text-emphasis-style":"filled circle"
  },
  ".nehan-empha-circle-open":{
    "text-emphasis-style":"open circle"
  },
  ".nehan-empha-double-circle-filled":{
    "text-emphasis-style":"filled double-circle"
  },
  ".nehan-empha-double-circle-open":{
    "text-emphasis-style":"open double-circle"
  },
  ".nehan-empha-triangle-filled":{
    "text-emphasis-style":"filled triangle"
  },
  ".nehan-empha-triangle-open":{
    "text-emphasis-style":"open triangle"
  },
  ".nehan-empha-sesame-filled":{
    "text-emphasis-style":"filled sesame"
  },
  ".nehan-empha-sesame-open":{
    "text-emphasis-style":"open sesame"
  },
  //-------------------------------------------------------
  // other utility classes
  //-------------------------------------------------------
  ".nehan-drop-caps::first-letter":{
    "display":"block",
    "width":"4em",
    "height":"4em",
    "float":"start",
    "line-rate":1.0,
    "font-size":"4em"
  },
  ".nehan-line-no-ruby":{
    "line-rate":1.0
  },
  ".nehan-gap-start":{
    "margin":{
      "start":"1em"
    }
  },
  ".nehan-gap-end":{
    "margin":{
      "end":"1em"
    }
  },
  ".nehan-gap-after":{
    "margin":{
      "after":"1em"
    }
  },
  ".nehan-gap-before":{
    "margin":{
      "before":"1em"
    }
  }
};

var Class = {};
Class.extend = function(childCtor, parentCtor) {
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};


var List = {
  iter : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      fn(lst[i]);
    }
  },
  iteri : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      fn(i, lst[i]);
    }
  },
  reviter : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      fn(lst[i]);
    }
  },
  reviteri : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      fn(i, lst[i]);
    }
  },
  forall : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(!fn(lst[i])){
	return false;
      }
    }
    return true;
  },
  map : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret[i] = fn(lst[i]);
    }
    return ret;
  },
  mapi : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret[i] = fn(i, lst[i]);
    }
    return ret;
  },
  fold : function(lst, acm, fn){
    var ret = acm;
    for(var i = 0, len = lst.length; i < len; i++){
      ret = fn(ret, lst[i]);
    }
    return ret;
  },
  filter : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	ret.push(lst[i]);
      }
    }
    return ret;
  },
  find : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj)){
	return obj;
      }
    }
    return null;
  },
  revfind : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      var obj = lst[i];
      if(fn(obj)){
	return obj;
      }
    }
    return null;
  },
  indexOf : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj)){
	return i;
      }
    }
    return -1;
  },
  exists : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	return true;
      }
    }
    return false;
  },
  mem : function(lst, val){
    for(var i = 0, len = lst.length; i < len; i++){
      if(lst[i] == val){
	return true;
      }
    }
    return false;
  },
  sum : function(lst){
    return this.fold(lst, 0, function(ret, obj){
      return ret + obj;
    });
  },
  minobj : function(lst, fn){
    var min_obj = null, min_val = null;
    this.iter(lst, function(obj){
      var val = fn(obj);
      if(min_val === null || val < min_val){
	min_obj = obj;
	min_val = val;
      }
    });
    return min_obj;
  },
  maxobj : function(lst, fn){
    var max_obj = null, max_val = null;
    this.iter(lst, function(obj){
      var val = fn(obj);
      if(max_val === null || val > max_val){
	max_obj = obj;
	max_val = val;
      }
    });
    return max_obj;
  },
  refcopy : function(lst){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret[i] = lst[i];
    }
    return ret;
  },
  count : function(lst, fn){
    var ret = 0;
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	ret++;
      }
    }
    return ret;
  },
  create : function(count, init_val){
    var ret = new Array(count);
    if(typeof init_val != "undefined"){
      for(var i = 0; i < count; i++){
	ret[i] = init_val;
      }
    }
    return ret;
  },
  first : function(lst){
    return lst[0] || null;
  },
  last : function(lst){
    var len = lst.length;
    if(len === 0){
      return null;
    }
    return lst[len - 1];
  },
  zip : function(lst1, lst2){
    var ret = [];
    for(var i = 0, len = Math.min(lst1.length, lst2.length); i < len; i++){
      ret[i] = [lst1[i], lst2[i]];
    }
    return ret;
  },
  // props: [a,b,c]
  // values:[1,2,3]
  // => {a:1, b:2, c:3}
  zipObj : function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:List.zipObj";
    }
    for(var i = 0, len = props.length; i < len; i++){
      ret[props[i]] = values[i];
    }
    return ret;
  },
  // non destructive reverse
  reverse : function(lst){
    var ret = [];
    this.reviter(lst, function(obj){
      ret.push(obj);
    });
    return ret;
  }
};


var Obj = {
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
  },
  // fn : obj -> ?
  map : function(obj, fn){
    var ret = {};
    for(var prop in obj){
      ret[prop] = fn(obj[prop]);
    }
    return ret;
  },
  // fn : prop -> value -> ?
  each : function(obj, fn){
    for(var prop in obj){
      fn(prop, obj[prop]);
    }
  },
  // fn : obj -> prop -> value -> ?
  iter : function(obj, fn){
    for(var prop in obj){
      fn(obj, prop, obj[prop]);
    }
  }
};

var UnitSize = {
  getFontSize : function(val, unit_size){
    var str = String(val).replace(/\/.+$/, ""); // remove line-height value like 'large/150%"'
    var size = Layout.fontSizeAbs[str] || str;
    return this.getUnitSize(size, unit_size);
  },
  getUnitSize : function(val, unit_size){
    var str = String(val);
    if(str.indexOf("rem") > 0){
      var rem_scale = parseFloat(str.replace("rem",""));
      return Math.round(Layout.fontSize * rem_scale); // use root font-size
    }
    if(str.indexOf("em") > 0){
      var em_scale = parseFloat(str.replace("em",""));
      return Math.round(unit_size * em_scale);
    }
    if(str.indexOf("pt") > 0){
      return Math.round(parseInt(str, 10) * 4 / 3);
    }
    if(str.indexOf("%") > 0){
      return Math.round(unit_size * parseInt(str, 10) / 100);
    }
    var px = parseInt(str, 10);
    return isNaN(px)? 0 : px;
  },
  getBoxSize : function(val, unit_size, max_size){
    var str = (typeof val === "string")? val : String(val);
    if(str.indexOf("%") > 0){
      var scaled_size = Math.round(max_size * parseInt(str, 10) / 100);
      return Math.min(max_size, scaled_size); // restrict less than maxMeasure
    }
    return this.getUnitSize(val, unit_size);
  },
  getCornerSize : function(val, unit_size){
    var ret = {};
    for(var prop in val){
      ret[prop] = [0, 0];
      ret[prop][0] = this.getUnitSize(val[prop][0], unit_size);
      ret[prop][1] = this.getUnitSize(val[prop][1], unit_size);
    }
    return ret;
  },
  getEdgeSize : function(val, unit_size){
    var ret = {};
    for(var prop in val){
      ret[prop] = this.getUnitSize(val[prop], unit_size);
    }
    return ret;
  }
};

var Utils = {
  trimHeadCRLF : function(str){
    return str.replace(/^\n+/, "");
  },
  trimFootCRLF : function(str){
    return str.replace(/\n+$/, "");
  },
  trimCRLF : function(str){
    return this.trimFootCRLF(this.trimHeadCRLF(str));
  },
  trim : function(str){
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
  },
  cutQuote : function(str){
    return str.replace(/['\"]/g, "");
  },
  capitalize : function(str){
    if(str === ""){
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  log : function(true_num, rad){
    var radix = rad || 10;
    return Math.log(true_num) / Math.log(radix);
  },
  filenameConcat : function(p1, p2){
    p1 = (p1==="")? "" : (p1.slice(-1) === "/")? p1 : p1 + "/";
    p2 = (p2==="")? "" : (p2[0] === "/")? p2.substring(1, p2.length) : p2;
    return p1 + p2;
  },
  getCamelName : function(hyp_name){
    var self = this;
    return List.mapi(hyp_name.split("-"), function(i, part){
      return (i === 0)? part : self.capitalize(part);
    }).join("");
  }
};

var MathUtils = {
  convBase : function(decimal, base){
   if(decimal === 0){
      return [0];
    }
    var ret = [];
    var work = decimal;
    while(work > 0){
      ret.unshift(work % base);
      work = Math.floor(work / base);
    }
    return ret;
  }
};


var reqAnimationFrame = (function(){
  var default_wait = 1000 / 60;
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.msRequestAnimationFrame     ||
    function(callback, wait){
      var _wait = (typeof wait === "undefined")? default_wait : wait;
      window.setTimeout(callback, _wait);
    };
})();


var Const = {
  cssVenderPrefixes:[
    "-moz",
    "-webkit",
    "-o",
    "-ms"
  ],
  cssCorders:[
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ],
  cssBorderRadius:[
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-left-radius",
    "border-bottom-right-radius"
  ],
  cssBoxDirs:[
    "top",
    "right",
    "bottom",
    "left"
  ],
  cssBoxDirsLogical:[
    "before",
    "end",
    "after",
    "start"
  ],
  cssBoxCornersLogical:[
    "start-before",
    "end-before",
    "end-after",
    "start-after"
  ],
  css2dIndex:{
    1:[0, 0],
    2:[0, 1]
  },
  css4dIndex:{
    1:[0, 0, 0, 0],
    2:[0, 1, 0, 1],
    3:[0, 1, 2, 1],
    4:[0, 1, 2, 3]
  },
  space:"&nbsp;",
  clearFix:"<div style='clear:both'></div>"
};

var Css = {
  toString : function(args){
    var tmp = [];
    for(var prop in args){
      tmp.push(prop + ":" + args[prop]);
    }
    return tmp.join(";");
  },
  addNehanPrefix : function(name){
    return "nehan-" + name;
  },
  addNehanHeaderPrefix : function(name){
    return "nehan-header-" + name;
  },
  addNehanTocLinkPrefix : function(name){
    return "nehan-toc-link-" + name;
  }
};

var Html = {
  escape : function(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#039;")
      .replace(/"/g, "&quot;");
  },
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      if(args[prop]){
	tmp.push(prop + "='" + this.escape(args[prop] + "") + "'");
      }
    }
    return (tmp == [])? "" : tmp.join(" ");
  },
  tagWrap : function(name, content, args){
    return [this.tagStart(name, args || {}), content, this.tagEnd(name)].join("");
  },
  tagSingle : function(name, args){
    return "<" + name + " " + this.attr(args) + "/>";
  },
  tagStart : function(name, args){
    return "<" + name + " " + this.attr(args) + ">";
  },
  tagEnd : function(name){
    return "</" + name + ">";
  }
};

var Closure = {
  id : function(){
    return function(x){
      return x;
    };
  },
  eq : function(x){
    return function(y){
      return x == y;
    };
  },
  neq : function(x){
    return function(y){
      return x != y;
    };
  }
};

var Args = {
  copy : function(dst, args){
    for(var prop in args){
      dst[prop] = args[prop];
    }
    return dst;
  },
  merge : function(dst, defaults, args){
    for(var prop in defaults){
      dst[prop] = (typeof args[prop] == "undefined")? defaults[prop] : args[prop];
    }
    return dst;
  },
  activate : function(dst, src, props){
    List.iter(props, function(prop){
      if(src[prop]){
	dst[prop] = src[prop];
      }
    });
    return dst;
  }
};

/*
  supported css properties
  ==============================

  background-color
  background-image
  background-repeat
  background-position
  border
  border-color
  border-radius
  border-style
  border-width
  box-sizing
  color
  display
  font-family
  font-size
  font-style
  font-weight
  float
  flow(nehan sepcial property)
  line-rate(nehan special property)
  list-style
  list-style-image
  list-style-position
  list-style-type
  margin
  padding
  text-align
  text-combine(horizontal only)
  text-emphasis-style
  white-space
 */
var CssParser = (function(){
  var normalize = function(value){
    return Utils.trim(String(value))
      .replace(/;/g, "")
      .replace(/\n/g, "");
  };

  var split_space = function(value){
    return (value.indexOf(" ") < 0)? [value] : value.split(/\s+/);
  };

  var split_slash = function(value){
    return (value.indexOf("/") < 0)? [value] : value.split("/");
  };

  var get_map_2d = function(len){
    return Const.css2dIndex[Math.min(len, 2)] || [];
  };

  var get_map_4d = function(len){
    return Const.css4dIndex[Math.min(len, 4)] || [];
  };

  // values:[a,b]
  // map: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var make_values_by_map = function(values, map){
    return List.map(map, function(index){ return values[index]; });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var make_values_2d = function(values){
    var map = get_map_2d(values.length);
    return make_values_by_map(values, map);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0, 1, 0, 1]
  // values:[0,2,3] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var make_values_4d = function(values){
    var map = get_map_4d(values.length);
    return make_values_by_map(values, map);
  };

  var make_edge_4d = function(values){
    var props = Const.cssBoxDirsLogical; // len = 4
    var values_4d = make_values_4d(values); // len = 4
    return List.zipObj(props, values_4d);
  };

  var make_corner_4d = function(values){
    var props = Const.cssBoxCornersLogical; // len = 4
    var values_4d = make_values_4d(values); // len = 4
    return List.zipObj(props, values_4d);
  };

  var parse_4d = function(value){
    return make_edge_4d(split_space(value));
  };

  var parse_corner_2d = function(value){
    return make_values_2d(split_space(value));
  };

  var parse_corner_4d = function(value){
    var values_2d = make_values_2d(split_slash(value));
    var values_4d_2d = List.map(values_2d, function(val){
      return make_values_4d(split_space(val));
    });
    var values = List.zip(values_4d_2d[0], values_4d_2d[1]);
    return make_corner_4d(values);
  };

  var parse_border_abbr = function(value){
    var ret = [];
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"border-width":parse_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"border-style":parse_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"border-color":parse_4d(values[2])});
    }
    return ret;
  };

  var parse_list_style_abbr = function(value){
    var ret = [];
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"list-style-type":parse_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"list-style-image":parse_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"list-style-position":parse_4d(values[2])});
    }
    return ret;
  };

  var parse_font_abbr = function(value){
    return {}; // TODO
  };

  var parse_background_abbr = function(value){
    return {}; // TODO
  };

  var parse_background_pos = function(value){
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len === 1){ // 1
      return {
	inline:{pos:values[0], offset:0},
	block:{pos:"center", offset:0}
      };
    } else if(2 <= arg_len && arg_len < 4){ // 2, 3
      return {
	inline:{pos:values[0], offset:0},
	block:{pos:values[1], offset:0}
      };
    } else if(arg_len >= 4){ // 4 ...
      return {
	inline:{pos:values[0], offset:values[1]},
	block:{pos:values[2], offset:values[3]}
      };
    }
    return null;
  };

  var parse_background_repeat = function(value){
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len === 1){
      return {inline:values[0], block:values[0]};
    } else if(arg_len >= 2){
      return {inline:values[0], block:values[1]};
    }
    return null;
  };

  var format = function(prop, value){
    switch(typeof value){
    case "function": case "object": case "boolean":
      return value;
    }
    value = normalize(value); // number, string
    switch(prop){
    case "background":
      return parse_background_abbr(value);
    case "background-position":
      return parse_background_pos(value);
    case "background-repeat":
      return parse_background_repeat(value);
    case "border":
      return parse_border_abbr(value);
    case "border-color":
      return parse_4d(value);
    case "border-radius":
      return parse_corner_4d(value);
    case "border-style":
      return parse_4d(value);
    case "border-width":
      return parse_4d(value);
    case "font":
      return parse_font_abbr(value);
    case "list-style":
      return parse_list_style_abbr(value);
    case "margin":
      return parse_4d(value);
    case "padding":
      return parse_4d(value);
    default: return value;
    }
  };

  return {
    format : function(prop, value){
      try {
	return format(prop, value);
      } catch(e){
	return {};
      }
    }
  };
})();


var SelectorAttr = (function(){
  function SelectorAttr(expr){
    this.expr = this._normalize(expr);
    this.left = this.op = this.right = null;
    this._parseExpr(this.expr);
  }

  var rex_symbol = /[^=^~|$*\s]+/;
  var op_symbols = ["|=", "~=", "^=", "$=", "*=", "="];

  SelectorAttr.prototype = {
    _normalize : function(expr){
      return expr.replace(/\[/g, "").replace(/\]/g, "");
    },
    _parseSymbol : function(expr){
      var match = expr.match(rex_symbol);
      if(match){
	return match[0];
      }
      return "";
    },
    _parseOp : function(expr){
      return List.find(op_symbols, function(symbol){
	return expr.indexOf(symbol) >= 0;
      });
    },
    _parseExpr : function(expr){
      this.left = this._parseSymbol(expr);
      if(this.left){
	expr = Utils.trim(expr.slice(this.left.length));
      }
      this.op = this._parseOp(expr);
      if(this.op){
	expr = Utils.trim(expr.slice(this.op.length));
	this.right = Utils.cutQuote(Utils.trim(expr));
      }
    },
    _testHasAttr : function(markup){
      return markup.getTagAttr(this.left) !== null;
    },
    _testEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      return value === this.right;
    },
    _testCaretEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      var rex = new RegExp("^" + this.right);
      return rex.test(value);
    },
    _testDollarEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      var rex = new RegExp(this.right + "$");
      return rex.test(value);
    },
    _testTildeEqual : function(markup){
      var values = markup.getTagAttr(this.left).split(/\s+/);
      return List.exists(values, Closure.eq(this.right));
    },
    _testPipeEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      return value == this.right || value.indexOf(this.right + "-") >= 0;
    },
    _testStarEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      return value.indexOf(this.right) >= 0;
    },
    _testOp : function(markup){
      switch(this.op){
      case "=":  return this._testEqual(markup);
      case "^=": return this._testCaretEqual(markup);
      case "$=": return this._testDollarEqual(markup);
      case "|=": return this._testPipeEqual(markup);
      case "~=": return this._testTildeEqual(markup);
      case "*=": return this._testStarEqual(markup);
      }
      throw "undefined operation:" + this.op;
    },
    test : function(markup){
      if(this.op && this.left && this.right){
	return this._testOp(markup);
      }
      if(this.left){
	return this._testHasAttr(markup);
      }
      return false;
    }
  };

  return SelectorAttr;
})();


var SelectorPseudo = (function(){
  function SelectorPseudo(expr){
    this.name = this._normalize(expr);
  }

  SelectorPseudo.prototype = {
    isPseudoElement : function(){
      return (this.name === "before" ||
	      this.name === "after" ||
	      this.name === "first-letter" ||
	      this.name === "first-line");
    },
    test : function(markup){
      switch(this.name){
      // pseudo-element
      case "before": return true;
      case "after": return true;
      case "first-letter": return !markup.isEmpty();
      case "first-line": return !markup.isEmpty();

      // pseudo-class
      case "first-child": return markup.isFirstChild();
      case "last-child": return markup.isLastChild();
      case "first-of-type": return markup.isFirstOfType();
      case "last-of-type": return markup.isLastOfType();
      case "only-child": return markup.isOnlyChild();
      case "only-of-type": return markup.isOnlyOfType();
      case "empty": return markup.isEmpty();
      case "root": return markup.isRoot();
      }
      return false;
    },
    _normalize : function(expr){
      return expr.replace(/:+/g, "");
    }
  };

  return SelectorPseudo;
})();


var SelectorType = (function(){
  function SelectorType(opt){
    this.name = opt.name;
    this.id = opt.id;
    this.className = opt.className;
    this.attrs = opt.attrs;
    this.pseudo = opt.pseudo;
  }
  
  SelectorType.prototype = {
    test : function(markup){
      if(markup === null){
	return false;
      }
      if(this.name && this.name != "*" && markup.getName() != this.name){
	return false;
      }
      if(this.className && !markup.hasClass(this.className)){
	return false;
      }
      if(this.id && markup.getTagAttr("id") != this.id){
	return false;
      }
      if(this.attrs.length > 0 && !this._testAttrs(markup)){
	return false;
      }
      if(this.pseudo && !this.pseudo.test(markup)){
	return false;
      }
      return true;
    },
    getIdSpec : function(){
      return this.id? 1 : 0;
    },
    getClassSpec : function(){
      return this.className? 1 : 0;
    },
    getTypeSpec : function(){
      return (this.name !== "*" && this.name !== "") ? 1 : 0;
    },
    getPseudoClassSpec : function(){
      if(this.pseudo){
	return this.pseudo.isPseudoElement()? 0 : 1;
      }
      return 0;
    },
    getAttrSpec : function(){
      return this.attrs.length;
    },
    _testAttrs : function(markup){
      return List.forall(this.attrs, function(attr){
	return attr.test(markup);
      });
    }
  };

  return SelectorType;
})();


var SelectorCombinator = {
  findDescendant : function(markup, parent_type){
    markup = markup.getParent();
    while(markup !== null){
      if(parent_type.test(markup)){
	return markup;
      }
      markup = markup.getParent();
    }
    return null;
  },
  findChild : function(markup, parent_type){
    markup = markup.getParent();
    if(markup === null){
      return null;
    }
    return parent_type.test(markup)? markup : null;
  },
  findAdjSibling : function(markup, cur_type, prev_type){
    var childs = markup.getParentChilds();
    return List.find(childs, function(child){
      var next = child.getNext();
      return next && prev_type.test(child) && cur_type.test(next);
    });
  },
  findGenSibling : function(markup, cur_type, prev_type){
    var childs = markup.getParentChilds();
    var sibling = List.find(childs, function(child){
      return prev_type.test(child);
    });
    if(sibling === null){
      return null;
    }
    markup = sibling.getNext();
    while(markup !== null){
      if(cur_type.test(markup)){
	return sibling;
      }
      markup = markup.getNext();
    }
    return null;
  }
};


var SelectorLexer = (function(){
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var rex_type = /^[\w-_\.#\*!\?]+/;
  var rex_attr = /^\[[^\]]+\]/;
  var rex_pseudo = /^:{1,2}[\w-_]+/;
  
  SelectorLexer.prototype = {
    getTokens : function(){
      var tokens = [];
      var push = function(token){ tokens.push(token); };
      while(this.buff !== ""){
	var token = this._getNextToken();
	if(token === null){
	  break;
	}
	push(token);
      }
      return tokens;
    },
    _getNextToken : function(){
      if(this.buff === ""){
	return null;
      }
      var c1 = this.buff.charAt(0);
      switch(c1){
      case "+": case "~": case ">": // combinator
	this._stepBuff(1);
	return c1;
      default: // selector-type
	var type = this._getType();
	if(type){
	  var attrs = this._getAttrs();
	  var pseudo = this._getPseudo();
	  return this._parseType(type, attrs, pseudo);
	}
      }
      throw "invalid selector:" + this.buff;
    },
    _normalize : function(src){
      return Utils.trim(src).replace(/\s+/g, " ");
    },
    _stepBuff : function(count){
      this.buff = Utils.trim(this.buff.slice(count));
    },
    _parseType : function(str, attrs, pseudo){
      return new SelectorType({
	name:this._getName(str),
	id:this._getId(str),
	className:this._getClassName(str),
	attrs:attrs,
	pseudo:(pseudo? (new SelectorPseudo(pseudo)) : null)
      });
    },
    _getByRex : function(rex){
      var ret = null;
      var match = this.buff.match(rex);
      if(match){
	ret = match[0];
	this._stepBuff(ret.length);
      }
      return ret;
    },
    _getName : function(str){
      return str.replace(/[\.#].+$/, "");
    },
    _getId : function(str){
      var parts = str.split("#");
      return (parts.length > 0)? parts[1] : "";
    },
    _getClassName : function(str){
      var parts = str.split(".");
      return (parts.length >= 2)? parts[1] : "";
    },
    _getType : function(){
      return this._getByRex(rex_type);
    },
    _getAttrs : function(){
      var attrs = [];
      var push = function(attr){ attrs.push(attr); };
      while(true){
	var attr = this._getByRex(rex_attr);
	if(attr){
	  push(new SelectorAttr(attr));
	} else {
	  break;
	}
      }
      return attrs;
    },
    _getPseudo : function(){
      return this._getByRex(rex_pseudo);
    }
  };

  return SelectorLexer;
})();


var SelectorStateMachine = {
  accept : function(tokens, markup){
    if(tokens.length === 0){
      throw "selector syntax error:" + src;
    }
    var pos = tokens.length - 1;
    var pop = function(){
      return (pos < 0)? null : tokens[pos--];
    };
    var push_back = function(){
      pos++;
    };
    var cur, next, next2, combinator;
    while(pos >= 0){
      cur = pop();
      if(cur instanceof SelectorType === false){
	throw "selector syntax error:" + src;
      }
      if(!cur.test(markup)){
	return false;
      }
      next = pop();
      if(next === null){
	return true;
      }
      if(next instanceof SelectorType){
	next2 = next;
	combinator = " "; // descendant combinator
      } else if(typeof next === "string"){
	combinator = next;
	next2 = pop();
	if(next2 === null || next2 instanceof SelectorType === false){
	  throw "selector syntax error:" + src;
	}
      }
      switch(combinator){
      case " ": markup = SelectorCombinator.findDescendant(markup, next2); break;
      case ">": markup = SelectorCombinator.findChild(markup, next2); break;
      case "+": markup = SelectorCombinator.findAdjSibling(markup, cur, next2); break;
      case "~": markup = SelectorCombinator.findGenSibling(markup, cur, next2); break;
      default: throw "selector syntax error:invalid combinator(" + combinator + ")";
      }
      if(markup === null){
	return false;
      }
      push_back();
    }
    return true; // all accepted
  }
};

var Selector = (function(){
  function Selector(key, value){
    this.key = this._normalizeKey(key);
    this.value = this._formatValue(value);
    this.tokens = this._getSelectorTokens(this.key);
    this.spec = this._countSpec(this.tokens);
  }

  var set_format_value = function(ret, prop, format_value){
    if(format_value instanceof Array){
      set_format_values(ret, format_value);
    } else {
      ret[prop] = format_value;
    }
  };

  var set_format_values = function(ret, format_values){
    List.iter(format_values, function(fmt_value){
      for(var prop in fmt_value){
	set_format_value(ret, prop, fmt_value[prop]);
      }
    });
  };

  Selector.prototype = {
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.value;
    },
    setValue : function(value){
      this.value = value;
    },
    getSpec : function(){
      return this.spec;
    },
    test : function(markup){
      return SelectorStateMachine.accept(this.tokens, markup);
    },
    isPseudoElement : function(){
      return this.key.indexOf("::") >= 0;
    },
    hasPseudoElement : function(element_name){
      return this.key.indexOf("::" + element_name) >= 0;
    },
    // count selector 'specificity'
    // see http://www.w3.org/TR/css3-selectors/#specificity
    _countSpec : function(tokens){
      var a = 0, b = 0, c = 0;
      List.iter(tokens, function(token){
	if(token instanceof SelectorType){
	  a += token.getIdSpec();
	  b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	  c += token.getTypeSpec();
	}
      });
      return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
    },
    _getSelectorTokens : function(key){
      var lexer = new SelectorLexer(key);
      return lexer.getTokens();
    },
    _normalizeKey : function(key){
      return Utils.trim(key).toLowerCase().replace(/\s+/g, " ");
    },
    _formatValue : function(value){
      var ret = {};
      for(var prop in value){
	set_format_value(ret, prop, CssParser.format(prop, value[prop]));
      }
      return ret;
    }
  };

  return Selector;
})();


var Selectors = (function(){
  var selectors = [];
  var selectors_pe = [];

  var sort_selectors = function(){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var sort_selectors_pe = function(){
    selectors_pe.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var update_value = function(selector_key, value){
    var style_value = Style[selector_key];
    Args.copy(style_value, value);
    var selector = List.find(selectors.concat(selectors_pe), function(selector){
      return selector.getKey() === selector_key;
    });
    if(selector){
      selector.setValue(style_value);
    }
  };

  var insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.isPseudoElement()){
      selectors_pe.push(selector);
    } else {
      selectors.push(selector);
    }
    return selector;
  };
  
  var get_value = function(markup){
    return List.fold(selectors, {}, function(ret, selector){
      if(!selector.isPseudoElement() && selector.test(markup)){
	return Args.copy(ret, selector.getValue());
      }
      return ret;
    });
  };

  var get_value_pe = function(markup, pseudo_element){
    return List.fold(selectors_pe, {}, function(ret, selector){
      if(selector.hasPseudoElement(pseudo_element) && selector.test(markup)){
	return Args.copy(ret, selector.getValue());
      }
      return ret;
    });
  };

  var init_selectors = function(){
    // initialize selector list
    Obj.iter(Style, function(obj, key, value){
      insert_value(key, value);
    });
    sort_selectors();
    sort_selectors_pe();
  };

  init_selectors();

  return {
    setValue : function(selector_key, value){
      if(Style[selector_key]){
	update_value(selector_key, value);
	return;
      }
      var selector = insert_value(selector_key, value);
      Style[selector_key] = selector.getValue();
      if(selector.isPseudoElement()){
	sort_selectors_pe();
	return;
      }
      sort_selectors();
    },
    // pseudo_element: "first-letter", "first-line", "before", "after"
    getValuePe : function(markup, pseudo_element){
      return get_value_pe(markup, pseudo_element);
    },
    getValue : function(markup){
      return get_value(markup);
    }
  };
})();

var TagAttrParser = (function(){
  var parse = function(src, attr){
    var peek = function(){
      return src.charAt(0);
    };

    var step = function(count){
      src = src.substring(count);
    };

    var get_symbol = function(delimiters){
      var delim_pos = -1;
      List.iter(delimiters, function(delim){
	var pos = src.indexOf(delim, 1);
	if(delim_pos < 0 || pos < delim_pos){
	  delim_pos = pos;
	}
      });
      return ((delim_pos >= 0)? src.substring(0, delim_pos) : src).toLowerCase();
    };

    var get_quoted_value = function(quote_str){
      var quote_pos = src.indexOf(quote_str, 1);
      return (quote_pos >= 1)? src.substring(1, quote_pos) : src;
    };

    var get_attr = function(left){
      if(src === ""){
	if(left){
	  attr[left] = true;
	}
	return;
      }
      var s1 = peek();
      var value;
      if(s1 === " "){
	step(1);
	arguments.callee(left);
      } else if(s1 === "="){
	step(1);
	if(src.length > 0){
	  var s2 = peek();
	  if(s2 === "\"" || s2 === "'"){
	    value = get_quoted_value(s2);
	    step(value.length + 2);
	  } else {
	    value = get_symbol([" "]);
	    step(value.length);
	  }
	  attr[left] = value;
	}
      } else if(left){
	attr[left] = true; // value empty attribute
      } else {
	left = get_symbol([" ", "="]);
	step(left.length);
	arguments.callee(left);
      }
    };

    while(src !== ""){
      get_attr();
    }
    return attr;
  };

  // <img src='/path/to/img' title='aaa' />
  // => "src='/path/to/img title='aaa'"
  var normalize = function(src){
    return src
      .replace(/<[\S]+/, "") // cut tag start
      .replace(/^\s+/, "") // cut head space
      .replace("/>", "") // cut tag tail(close tag)
      .replace(">", "") // cut tag tail(open tag)
      .replace(/\s+$/, "") // cut tail space
      .replace(/\n/g, "") // conv from multi line to single line
      .replace(/[　|\s]+/g, " ") // conv from multi space to single space
      .replace(/\s+=/g, "=") // cut multi space before '='
      .replace(/=\s+/g, "="); // cut multi space after '='
  };

  return {
    parse : function(src){
      src = normalize(src);
      return parse(src, {});
    }
  };
})();

var Tag = (function (){
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  var is_inline_style_not_allowed = function(name){
    return List.exists(["padding", "margin", "border"], function(prop){
      return name.indexOf(prop) >= 0;
    });
  };

  function Tag(src, content_raw){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this.src = src;
    this.parent = null;
    this.contentRaw = content_raw || "";
    this.name = this._parseName(this.src);
    this.tagAttr = TagAttrParser.parse(this.src);
    this.id = this.tagAttr.id || "";
    this.classes = this._parseClasses(this.tagAttr["class"] || "");
    this.dataset = {}; // dataset with no "data-" prefixes => {id:"10", name:"taro"} 
    this.datasetRaw = {}; // dataset with "data-" prefixes => {"data-id":"10", "data-name":"taro"}
    this.cssAttrStatic = this._getSelectorValue(); // initialize css-attr, but updated when 'inherit'.
    this.cssAttrDynamic = {}; // added by setCssAttr

    // initialize inline-style value
    if(this.tagAttr.style){
      this._parseInlineStyle(this.tagAttr.style || "");
    }
    this._parseDataset(); // initialize data-set values
  }

  Tag.prototype = {
    inherit : function(parent){
      if(this._inherited || !this.hasLayout()){
	return this; // avoid duplicate initialize
      }
      this.parent = parent;
      this.cssAttrStatic = this._getSelectorValue(); // reget css-attr with parent enabled.
      this._inherited = true;
      return this;
    },
    clone : function(){
      return new Tag(this.src, this.contentRaw);
    },
    setContentRaw : function(content_raw){
      this.contentRaw = content_raw;
    },
    setTagAttr : function(name, value){
      this.tagAttr[name] = value;
    },
    setCssAttr : function(name, value){
      this.cssAttrDynamic[name] = value;
    },
    setCssAttrs : function(obj){
      for(var prop in obj){
	this.setCssAttr(prop, obj[prop]);
      }
    },
    addClass : function(klass){
      this.classes.push(klass);
    },
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
    },
    getParent : function(){
      return this.parent;
    },
    getName : function(){
      return this.name;
    },
    getAttr : function(name, def_value){
      var ret = this.getTagAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      ret = this.getCssAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getTagAttr : function(name, def_value){
      var ret = this.tagAttr[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getCssAttr : function(name, def_value){
      var ret = this.cssAttrDynamic[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      ret = this.cssAttrStatic[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getDataset : function(name, def_value){
      var ret = this.dataset[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    // dataset name and value object => {id:xxx, name:yyy}
    getDatasetAttrs : function(){
      return this.dataset;
    },
    // dataset name(with "data-" prefix) and value object => {"data-id":xxx, "data-name":yyy}
    getDatasetAttrsRaw : function(){
      return this.datasetRaw;
    },
    getContentRaw : function(){
      return this.contentRaw;
    },
    getContent : function(){
      var before = this._getPseudoBefore();
      var after = this._getPseudoAfter();
      return this._setPseudoFirst([before, this.contentRaw, after].join(""));
    },
    getSrc : function(){
      return this.src;
    },
    getWrapSrc : function(){
      if(this.isSingleTag()){
	return this.src;
      }
      return this.src + this.contentRaw + "</" + this.name + ">";
    },
    getHeaderRank : function(){
      if(this.getName().match(/h([1-6])/)){
	return parseInt(RegExp.$1, 10);
      }
      return 0;
    },
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    hasLayout : function(){
      var name = this.getName();
      return (name != "br" && name != "page-break" && name != "end-page");
    },
    isPseudoElement : function(){
      return this.name === "before" || this.name === "after" || this.name === "first-letter" || this.name === "first-line";
    },
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    isSingleTag : function(){
      return this.getCssAttr("single") === true;
    },
    isTcyTag : function(){
      return this.getCssAttr("text-combine", "") === "horizontal";
    },
    isSectionRootTag : function(){
      return this.getCssAttr("section-root") === true;
    },
    isSectionTag : function(){
      return this.getCssAttr("section") === true;
    },
    isBoldTag : function(){
      var name = this.getName();
      return name === "b" || name === "strong";
    },
    isHeaderTag : function(){
      return this.getHeaderRank() > 0;
    },
    isPageBreakTag : function(){
      var name = this.getName();
      return name === "end-page" || name === "page-break";
    },
    isMetaTag : function(){
      return this.getCssAttr("meta") === true;
    },
    isRoot : function(){
      return this.parent === null;
    },
    isEmpty : function(){
      return this.contentRaw === "";
    },
    _getSelectorValue : function(){
      if(this.isPseudoElement()){
	return Selectors.getValuePe(this.parent, this.getName());
      }
      return Selectors.getValue(this);
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
    },
    _parseId : function(){
      var id = this.tagAttr.id || "";
      return (id === "")? id : ((this.tagAttr.id.indexOf("nehan-") === 0)? "nehan-" + id : id);
    },
    // <p class='hi hey'>
    // => ["hi", "hey"]
    _parseClasses : function(class_value){
      class_value = Utils.trim(class_value.replace(/\s+/g, " "));
      var classes = (class_value === "")? [] : class_value.split(/\s+/);
      return List.map(classes, function(klass){
	return (klass.indexOf("nehan-") === 0)? klass : "nehan-" + klass;
      });
    },
    // <p class='hi hey'>
    // => [".hi", ".hey"]
    _parseCssClasses : function(classes){
      return List.map(classes, function(class_name){
	return "." + class_name;
      });
    },
    _setPseudoFirst : function(content){
      var first_letter = Selectors.getValuePe(this, "first-letter");
      content = Obj.isEmpty(first_letter)? content : this._setPseudoFirstLetter(content);
      var first_line = Selectors.getValuePe(this, "first-line");
      return Obj.isEmpty(first_line)? content : this._setPseudoFirstLine(content);
    },
    _setPseudoFirstLetter : function(content){
      return content.replace(rex_first_letter, function(match, p1, p2, p3){
	return p1 + Html.tagWrap("first-letter", p3);
      });
    },
    _setPseudoFirstLine : function(content){
      return Html.tagWrap("first-line", content);
    },
    _getPseudoBefore : function(){
      var attr = Selectors.getValuePe(this, "before");
      return Obj.isEmpty(attr)? "" : Html.tagWrap("before", attr.content || "");
    },
    _getPseudoAfter : function(){
      var attr = Selectors.getValuePe(this, "after");
      return Obj.isEmpty(attr)? "" : Html.tagWrap("after", attr.content || "");
    },
    // "border:0; margin:0"
    // => {border:0, margin:0}
    _parseInlineStyle : function(src){
      var dynamic_attr = this.cssAttrDynamic;
      var stmts = (src.indexOf(";") >= 0)? src.split(";") : [src];
      List.iter(stmts, function(stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]).toLowerCase();
	  if(!is_inline_style_not_allowed(prop)){
	    var value = Utils.trim(nv[1]);
	    dynamic_attr[prop] = value;
	  }
	}
      });
    },
    _parseDataset : function(){
      for(var name in this.tagAttr){
	if(name.indexOf("data-") === 0){
	  var dataset_name = this._parseDatasetName(name);
	  var dataset_value = this.tagAttr[name];
	  this.dataset[dataset_name] = dataset_value;
	  this.datasetRaw[name] = dataset_value;
	}
      }
    },
    // "data-name" => "name"
    // "data-family-name" => "familyName"
    _parseDatasetName : function(prop){
      var hyp_name = prop.slice(5); // 5 is "data-".length
      return Utils.getCamelName(hyp_name);
    }
  };

  return Tag;
})();


var Token = {
  isTag : function(token){
    return token._type === "tag";
  },
  isText : function(token){
    return token._type === "char" || token._type === "word" || token._type === "tcy" || token._type === "ruby";
  },
  isChar : function(token){
    return token._type === "char";
  },
  isWord : function(token){
    return token._type === "word";
  },
  isTcy : function(token){
    return token._type === "tcy";
  }
};


var Char = (function(){
  function Char(c1, is_ref){
    this.data = c1;
    this._type = "char";
    this.isRef = is_ref || false;
    if(!this.isRef){
      this._setup(c1.charCodeAt(0));
    }
  }
  var kuten = ["\u3002","."];
  var touten = ["\u3001", ","];
  var kakko_start = ["\uff62","\u300c","\u300e","\u3010","\uff3b","\uff08","\u300a","\u3008","\u226a","\uff1c","\uff5b","\x7b","\x5b","\x28"];
  var kakko_end = ["\u300d","\uff63","\u300f","\u3011","\uff3d","\uff09","\u300b","\u3009","\u226b","\uff1e","\uff5d","\x7d","\x5d","\x29"];

  var small_kana = ["\u3041","\u3043","\u3045","\u3047","\u3049","\u3063","\u3083","\u3085","\u3087","\u308e","\u30a1","\u30a3","\u30a5","\u30a7","\u30a9","\u30f5","\u30f6","\u30c3","\u30e3","\u30e5","\u30e7","\u30ee"];

  var head_ng = ["\uff09","\x5c","\x29","\u300d","\u3011","\u3015","\uff3d","\x5c","\x5d","\u3002","\u300f","\uff1e","\u3009","\u300b","\u3001","\uff0e","\x5c","\x2e","\x2c","\u201d","\u301f"];

  var tail_ng = ["\uff08","\x5c","\x28","\u300c","\u3010","\uff3b","\u3014","\x5c","\x5b","\u300e","\uff1c","\u3008","\u300a","\u201c","\u301d"];

  Char.prototype = {
    getCssPadding : function(line){
      var padding = new Padding();
      if(this.paddingStart){
	padding.setStart(line.style.flow, this.paddingStart);
      }
      if(this.paddingEnd){
	padding.setEnd(line.style.flow, this.paddingEnd);
      }
      return padding.getCss();
    },
    getCssVertGlyph : function(line){
      var css = {};
      var padding_enable = this.isPaddingEnable();
      css["margin-left"] = "auto";
      css["margin-right"] = "auto";
      if(this.isKakkoStart()){
	if(!padding_enable){
	  css["margin-top"] = "-0.5em";
	}
      } else {
	if(this.getVertScale() < 1){
	  css.height = "0.5em";
	}
	if(padding_enable){
	  css["margin-bottom"] = "0.5em";
	}
      }
      return css;
    },
    getCssVertImgChar : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css.display = "block";
      css.width = font_size + "px";
      css.height = this.getVertHeight(font_size) + "px";
      css["margin-left"] = "auto";
      css["margin-right"] = "auto";
      if(this.isPaddingEnable()){
	Args.copy(css, this.getCssPadding(line));
      }
      return css;
    },
    getCssVertRotateCharIE : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css["float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["padding-left"] = Math.round(font_size / 2) + "px";
      css["line-height"] = font_size + "px";
      return css;
    },
    getCssVertEmphaTarget : function(line){
      var css = {};
      return css;
    },
    getCssVertEmphaText : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css.display = "inline-block";
      css.width = font_size + "px";
      css.height = font_size + "px";
      return css;
    },
    getCssHoriEmphaTarget : function(line){
      var css = {};
      return css;
    },
    getCssHoriEmphaText : function(line){
      var css = {};
      return css;
    },
    getCssVertLetterSpacing : function(line){
      var css = {};
      css["margin-bottom"] = line.letterSpacing + "px";
      return css;
    },
    getCssVertHalfSpaceChar : function(line){
      var css = {}, font_size = line.style.getFontSize();
      var half = Math.round(font_size / 2);
      css.height = half + "px";
      css["line-height"] = half + "px";
      return css;
    },
    getCssVertSmallKana : function(){
      var css = {};
      css.position = "relative";
      css.top = "-0.1em";
      css.right = "-0.12em";
      css.height = this.bodySize + "px";
      css["line-height"] = this.bodySize + "px";
      return css;
    },
    getHoriScale : function(){
      return this.hscale? this.hscale : 1;
    },
    getVertScale : function(){
      return this.vscale? this.vscale : 1;
    },
    getVertHeight : function(font_size){
      var vscale = this.getVertScale();
      return (vscale === 1)? font_size : Math.round(font_size * vscale);
    },
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined");
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + this.getPaddingSize() + (letter_spacing || 0);
    },
    getPaddingSize : function(){
      return (this.paddingStart || 0) + (this.paddingEnd || 0);
    },
    getCharCount : function(){
      if(this.data === " " || this.data === "\t" || this.data === "\u3000"){
	return 0;
      }
      return 1;
    },
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
      this.vscale = vscale || 1;
      this.hscale = hscale || this.vscale;
    },
    _setCnv : function(cnv, vscale, hscale){
      this.cnv = cnv;
      this.vscale = vscale || 1;
      this.hscale = hscale || this.vscale;
    },
    _setRotate : function(angle){
      this.rotate = angle;
    },
    _setup : function(code){
      switch(code){
      case 32: // half scape char
	this._setCnv("&nbsp;", 0.5, 0.5); break;
      case 12300:
	this._setImg("kakko1", 0.5); break;
      case 65378:
	this._setImg("kakko1", 0.5); break;
      case 12301:
	this._setImg("kakko2", 0.5); break;
      case 65379:
	this._setImg("kakko2", 0.5); break;
      case 12302:
	this._setImg("kakko3", 0.5); break;
      case 12303:
	this._setImg("kakko4", 0.5); break;
      case 65288:
	this._setImg("kakko5", 0.5); break;
      case 40:
	this._setImg("kakko5", 0.5); break;
      case 65371:
	this._setImg("kakko5", 0.5); break;
      case 123:
	this._setImg("kakko5", 0.5); break;
      case 65289:
	this._setImg("kakko6", 0.5); break;
      case 41:
	this._setImg("kakko6", 0.5); break;
      case 65373:
	this._setImg("kakko6", 0.5); break;
      case 125:
	this._setImg("kakko6", 0.5); break;
      case 65308:
	this._setImg("kakko7", 0.5); break;
      case 60:
	this._setImg("kakko7", 0.5); break;
      case 12296:
	this._setImg("kakko7", 0.5); break;
      case 65310:
	this._setImg("kakko8", 0.5); break;
      case 62:
	this._setImg("kakko8", 0.5); break;
      case 12297:
	this._setImg("kakko8", 0.5); break;
      case 12298:
	this._setImg("kakko9", 0.5); break;
      case 8810:
	this._setImg("kakko9", 0.5); break;
      case 12299:
	this._setImg("kakko10", 0.5); break;
      case 8811:
	this._setImg("kakko10", 0.5); break;
      case 65339:
	this._setImg("kakko11", 0.5); break;
      case 12308:
	this._setImg("kakko11", 0.5); break;
      case 91:
	this._setImg("kakko11", 0.5); break;
      case 65341:
	this._setImg("kakko12", 0.5); break;
      case 12309:
	this._setImg("kakko12", 0.5); break;
      case 93:
	this._setImg("kakko12", 0.5); break;
      case 12304:
	this._setImg("kakko17", 0.5); break;
      case 12305:
	this._setImg("kakko18", 0.5); break;
      case 65306:
	this._setImg("tenten", 0.5, 1); break;
      case 58:
	this._setImg("tenten", 0.5, 1); break;
      case 12290:
	this._setImg("kuten", 0.5); break;
      case 65377:
	this._setImg("kuten", 0.5); break;
      case 65294:
	this._setImg("period", 1); break;
      case 46:
	this._setImg("period", 1); break;
      case 12289:
	this._setImg("touten", 0.5); break;
      case 65380:
	this._setImg("touten", 0.5); break;
      case 44:
	this._setImg("touten", 0.5); break;
      case 65292:
	this._setImg("touten", 0.5); break;
      case 65374:
	this._setImg("kara", 1); break;
      case 12316:
	this._setImg("kara", 1); break;
      case 8230:
	this._setImg("mmm", 1); break;
      case 8229:
	this._setImg("mm", 1); break;
      case 12317:
	this._setImg("dmn1", 1); break;
      case 12319:
	this._setImg("dmn2", 1); break;
      case 65309:
	this._setImg("equal", 1); break;
      case 61:
	this._setImg("equal", 1); break;
      case 12540:
	this._setImg("onbiki", 1); break;
      case 45:
	this._setCnv("&#65372;"); break;
      case 8213:
	this._setCnv("&#65372;"); break;
      case 65293:
	this._setCnv("&#65372;"); break;
      case 9472:
	this._setCnv("&#65372;"); break;
      case 8593: // up
	this._setCnv("&#8594;"); break;
      case 8594: // right
	this._setCnv("&#8595;"); break;
      case 8658: // right2
	this._setCnv("&#8595;"); break;
      case 8595: // down
	this._setCnv("&#8592;"); break;
      case 8592: // left
	this._setCnv("&#8593;"); break;
      case 8220: // left double quotation mark
	this._setRotate(90); break;
      case 8221: // right double quotateion mark
	this._setRotate(90); break;
      }
    },
    isNewLineChar : function(){
      return this.data === "\n";
    },
    isImgChar : function(){
      return (typeof this.img != "undefined");
    },
    isCnvChar : function(){
      return (typeof this.cnv != "undefined");
    },
    isRotateChar : function(){
      return (typeof this.rotate != "undefined");
    },
    isCharRef : function(){
      return this.isRef;
    },
    isHalfSpaceChar : function(){
      return (this.isCnvChar() && this.cnv === "&nbsp;");
    },
    isKerningChar : function(){
      return this.isKutenTouten() || this.isKakko();
    },
    getImgSrc : function(color){
      return [Layout.fontImgRoot, this.img, color + ".png"].join("/");
    },
    isPaddingEnable : function(){
      return (typeof this.paddingStart != "undefined" || typeof this.paddingEnd != "undefined");
    },
    isVertGlyphEnable : function(){
      return !this.isTenten() && Config.useVerticalGlyphIfEnable && Env.isVerticalGlyphEnable;
    },
    isTenten : function(){
      return this.img && this.img === "tenten";
    },
    isHeadNg : function(){
      return List.mem(head_ng, this.data);
    },
    isTailNg : function(){
      return List.mem(tail_ng, this.data);
    },
    isSmallKana : function(){
      return List.mem(small_kana, this.data);
    },
    isKakkoStart : function(){
      return List.mem(kakko_start, this.data);
    },
    isKakkoEnd : function(){
      return List.mem(kakko_end, this.data);
    },
    isKakko : function(){
      return this.isKakkoStart() || this.isKakkoEnd();
    },
    isKuten : function(){
      return List.mem(kuten, this.data);
    },
    isTouten : function(){
      return List.mem(touten, this.data);
    },
    isKutenTouten : function(){
      return this.isKuten() || this.isTouten();
    },
    isZenkaku : function(){
      return escape(this.data).charAt(1) === "u";
    },
    isHankaku : function(){
      return !this.isZenkaku(this.data);
    }
  };

  return Char;
})();

var Word = (function(){
  function Word(word, devided){
    this.data = word;
    this._type = "word";
    this._devided = devided || false;
  }

  Word.prototype = {
    getCssVertTrans : function(line){
      var css = {};
      css["letter-spacing"] = line.style.letterSpacing + "px";
      css.width = line.style.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["margin-left"] = "auto";
      css["margin-right"] = "auto";
      return css;
    },
    getCssVertTransBody : function(line){
      var css = {};
      css["font-family"] = line.style.getFontFamily();
      return css;
    },
    getCssVertTransBodyTrident : function(line){
      var css = {};
      css["font-family"] = line.style.getFontFamily();
      css.width = line.style.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["transform-origin"] = "50% 50%";

      // force set line-height to measure(this.bodySize) before rotation,
      // and fix offset by translate after rotatation.
      css["line-height"] = this.bodySize + "px";
      var trans = Math.floor((this.bodySize - line.style.getFontSize()) / 2);
      if(trans > 0){
	css["transform"] = "rotate(90deg) translate(-" + trans + "px, 0)";
      }
      return css;
    },
    getCssVertTransIE : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css["float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["letter-spacing"] = (line.style.letterSpacing || 0) + "px";
      css["padding-left"] = Math.round(font_size / 2) + "px";
      css["line-height"] = font_size + "px";
      return css;
    },
    getCharCount : function(){
      return 1; // word is count by 1 character.
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + (letter_spacing || 0) * this.getLetterCount();
    },
    hasMetrics : function(){
      return (typeof this.bodySize !== "undefined");
    },
    countUpper : function(){
      var count = 0;
      for(var i = 0; i < this.data.length; i++){
	if(/[A-Z]/.test(this.data.charAt(i))){
	  count++;
	}
      }
      return count;
    },
    setMetrics : function(flow, font){
      if(Config.useStrictWordMetrics && TextMetrics.isEnable()){
	this.bodySize = TextMetrics.getMeasure(font, this.data);
	return;
      }
      this.bodySize = Math.round(this.data.length * font.size * 0.5);
      if(font.isBold()){
	this.bodySize += Math.round(Layout.boldRate * this.bodySize);
      }
    },
    getLetterCount : function(){
      return this.data.length;
    },
    setDevided : function(enable){
      this._devided = enable;
    },
    isDevided : function(){
      return this._devided;
    },
    // devide word by measure size and return first half of word.
    cutMeasure : function(font_size, measure){
      var half_size = Math.round(font_size / 2);
      var this_half_count = Math.round(this.bodySize / half_size);
      var measure_half_count = Math.round(measure / half_size);
      if(this_half_count <= measure_half_count){
	return this;
      }
      var str_part = this.data.substring(0, measure_half_count);
      var word_part = new Word(str_part, true);
      this.data = this.data.slice(measure_half_count);
      this.setDevided(true);
      return word_part;
    }
  };
  
  return Word;
})();


var Tcy = (function(){
  function Tcy(tcy){
    this.data = tcy;
    this._type = "tcy";
  }

  Tcy.prototype = {
    getCharCount : function(){
      return 1;
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + letter_spacing;
    },
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined");
    },
    setMetrics : function(flow, font){
      this.bodySize = font.size;
    }
  };

  return Tcy;
})();


var Ruby = (function(){
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
  }

  Ruby.prototype = {
    hasMetrics : function(){
      return (typeof this.advanceSize !== "undefined");
    },
    getCharCount : function(){
      return this.rbs? this.rbs.length : 0;
    },
    getAdvance : function(flow){
      return this.advanceSize;
    },
    getExtent : function(font_size){
      return 3 * this.rubyFontSize + font_size;
    },
    getRbs : function(){
      return this.rbs;
    },
    getRtString : function(){
      return this.rt? this.rt.getContent() : "";
    },
    getRtFontSize : function(){
      return this.rubyFontSize;
    },
    getCssHoriRuby : function(line){
      var css = {};
      css.display = "inline-block";
      return css;
    },
    getCssVertRt : function(line){
      var css = {};
      css["float"] = "left";
      return css;
    },
    getCssHoriRt : function(line){
      var css = {};
      css["line-height"] = Math.round(1.5 * this.getRtFontSize()) + "px";
      css["font-size"] = this.getRtFontSize() + "px";
      css["vertical-align"] = "bottom";
      return css;
    },
    getCssVertRb : function(line){
      var css = {};
      css["float"] = "left";
      if(this.padding){
	Args.copy(css, this.padding.getCss());
      }
      return css;
    },
    getCssHoriRb : function(line){
      var css = {};
      if(this.padding){
	Args.copy(css, this.padding.getCss());
      }
      css["text-align"] = "center";
      return css;
    },
    setMetrics : function(flow, font, letter_spacing){
      this.rubyFontSize = Layout.getRubyFontSize(font.size);
      var advance_rbs = List.fold(this.rbs, 0, function(ret, rb){
	rb.setMetrics(flow, font);
	return ret + rb.getAdvance(flow, letter_spacing);
      });
      var advance_rt = this.rubyFontSize * this.getRtString().length;
      this.advanceSize = advance_rbs;
      if(advance_rt > advance_rbs){
	var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
	if(this.rbs.length > 0){
	  this.padding = new Padding();
	  this.padding.setStart(flow, ctx_space);
	  this.padding.setEnd(flow, ctx_space);
	}
	this.advanceSize += ctx_space + ctx_space;
      }
    }
  };

  return Ruby;
})();


var Rgb = (function(){
  function Rgb(value){
    this.value = String(value);
    this.red = parseInt(this.value.substring(0,2), 16);
    this.green = parseInt(this.value.substring(2,4), 16);
    this.blue = parseInt(this.value.substring(4,6), 16);
  }
  
  Rgb.prototype = {
    getRed : function(){
      return this.red;
    },
    getGreen : function(){
      return this.green;
    },
    getBlue : function(){
      return this.blue;
    },
    getColorValue : function(){
      return this.value;
    }
  };

  return Rgb;
})();

var Color = (function(){
  function Color(value){
    this.setValue(value);
  }

  Color.prototype = {
    setValue : function(value){
      this.value = Colors.get(value);
    },
    getValue : function(){
      return this.value;
    },
    getCssValue : function(){
      return (this.value === "transparent")? this.value : "#" + this.value;
    },
    getRgb : function(){
      return new Rgb(this.value);
    },
    getCss : function(){
      var css = {};
      css.color = this.getCssValue();
      return css;
    }
  };

  return Color;
})();

var Colors = (function(){
  var color_names = {
    "aliceblue":"f0f8ff",
    "antiquewhite":"faebd7",
    "aqua":"00ffff",
    "aquamarine":"7fffd4",
    "azure":"f0ffff",
    "beige":"f5f5dc",
    "bisque":"ffe4c4",
    "black":"000000",
    "blanchedalmond":"ffebcd",
    "blue":"0000ff",
    "blueviolet":"8a2be2",
    "brown":"a52a2a",
    "burlywood":"deb887",
    "cadetblue":"5f9ea0",
    "chartreuse":"7fff00",
    "chocolate":"d2691e",
    "coral":"ff7f50",
    "cornflowerblue":"6495ed",
    "cornsilk":"fff8dc",
    "crimson":"dc143c",
    "cyan":"00ffff",
    "darkblue":"00008b",
    "darkcyan":"008b8b",
    "darkgoldenrod":"b8860b",
    "darkgray":"a9a9a9",
    "darkgreen":"006400",
    "darkkhaki":"bdb76b",
    "darkmagenta":"8b008b",
    "darkolivegreen":"556b2f",
    "darkorange":"ff8c00",
    "darkorchid":"9932cc",
    "darkred":"8b0000",
    "darksalmon":"e9967a",
    "darkseagreen":"8fbc8f",
    "darkslateblue":"483d8b",
    "darkslategray":"2f4f4f",
    "darkturquoise":"00ced1",
    "darkviolet":"9400d3",
    "deeppink":"ff1493",
    "deepskyblue":"00bfff",
    "dimgray":"696969",
    "dodgerblue":"1e90ff",
    "firebrick":"b22222",
    "floralwhite":"fffaf0",
    "forestgreen":"228b22",
    "fuchsia":"ff00ff",
    "gainsboro":"dcdcdc",
    "ghostwhite":"f8f8ff",
    "gold":"ffd700",
    "goldenrod":"daa520",
    "gray":"808080",
    "green":"008000",
    "greenyellow":"adff2f",
    "honeydew":"f0fff0",
    "hotpink":"ff69b4",
    "indianred ":"cd5c5c",
    "indigo ":"4b0082",
    "ivory":"fffff0","khaki":"f0e68c",
    "lavender":"e6e6fa",
    "lavenderblush":"fff0f5",
    "lawngreen":"7cfc00",
    "lemonchiffon":"fffacd",
    "lightblue":"add8e6",
    "lightcoral":"f08080",
    "lightcyan":"e0ffff",
    "lightgoldenrodyellow":"fafad2",
    "lightgrey":"d3d3d3",
    "lightgreen":"90ee90",
    "lightpink":"ffb6c1",
    "lightsalmon":"ffa07a",
    "lightseagreen":"20b2aa",
    "lightskyblue":"87cefa",
    "lightslategray":"778899",
    "lightsteelblue":"b0c4de",
    "lightyellow":"ffffe0",
    "lime":"00ff00",
    "limegreen":"32cd32",
    "linen":"faf0e6",
    "magenta":"ff00ff",
    "maroon":"800000",
    "mediumaquamarine":"66cdaa",
    "mediumblue":"0000cd",
    "mediumorchid":"ba55d3",
    "mediumpurple":"9370d8",
    "mediumseagreen":"3cb371",
    "mediumslateblue":"7b68ee",
    "mediumspringgreen":"00fa9a",
    "mediumturquoise":"48d1cc",
    "mediumvioletred":"c71585",
    "midnightblue":"191970",
    "mintcream":"f5fffa",
    "mistyrose":"ffe4e1",
    "moccasin":"ffe4b5",
    "navajowhite":"ffdead",
    "navy":"000080",
    "oldlace":"fdf5e6",
    "olive":"808000",
    "olivedrab":"6b8e23",
    "orange":"ffa500",
    "orangered":"ff4500",
    "orchid":"da70d6",
    "palegoldenrod":"eee8aa",
    "palegreen":"98fb98",
    "paleturquoise":"afeeee",
    "palevioletred":"d87093",
    "papayawhip":"ffefd5",
    "peachpuff":"ffdab9",
    "peru":"cd853f",
    "pink":"ffc0cb",
    "plum":"dda0dd",
    "powderblue":"b0e0e6",
    "purple":"800080",
    "red":"ff0000",
    "rosybrown":"bc8f8f",
    "royalblue":"4169e1",
    "saddlebrown":"8b4513",
    "salmon":"fa8072",
    "sandybrown":"f4a460",
    "seagreen":"2e8b57",
    "seashell":"fff5ee",
    "sienna":"a0522d",
    "silver":"c0c0c0",
    "skyblue":"87ceeb",
    "slateblue":"6a5acd",
    "slategray":"708090",
    "snow":"fffafa",
    "springgreen":"00ff7f",
    "steelblue":"4682b4",
    "tan":"d2b48c",
    "teal":"008080",
    "thistle":"d8bfd8",
    "tomato":"ff6347",
    "turquoise":"40e0d0",
    "violet":"ee82ee",
    "wheat":"f5deb3",
    "white":"ffffff",
    "whitesmoke":"f5f5f5",
    "yellow":"ffff00",
    "yellowgreen":"9acd32",
    "transparent":"transparent"
  };

  var rex_hex_color = /^(?:[0-9a-f]{3}){1,2}$/;

  return {
    get : function(value){
      value = value.replace(/#/g, "").toLowerCase();
      if(!rex_hex_color.test(value)){
	return color_names[value] || value;
      }
      if(value.length === 3){
	return value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
      }
      return value;
    }
  };
})();


var Palette = (function(){
  // 256(8 * 8 * 4) color palette scales.
  var RG_PALETTE = [0, 36, 73, 109, 146, 182, 219, 255];
  var B_PALETTE = [0, 85, 170, 255];

  var make_hex_str = function(ival){
    var str = ival.toString(16);
    if(str.length <= 1){
      return "0" + str;
    }
    return str;
  };

  var find_palette = function(ival, palette){
    if(List.exists(palette, Closure.eq(ival))){
      return ival;
    }
    return List.minobj(palette, function(pval){
      return Math.abs(pval - ival);
    });
  };

  return {
    // search and return color value defined in nehan palette.
    // we use this value for img characters.
    getColor : function(rgb){
      var palette_red = find_palette(rgb.getRed(), RG_PALETTE);
      var palette_green = find_palette(rgb.getGreen(), RG_PALETTE);
      var palette_blue = find_palette(rgb.getBlue(), B_PALETTE);

      return [
	make_hex_str(palette_red),
	make_hex_str(palette_green),
	make_hex_str(palette_blue)
      ].join("");
    }
  };
})();


var Cardinal = (function(){
  var table = {
    "lower-alpha":[
      "a","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
    ],
    "upper-alpha":[
      "A","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
    ],
    "lower-roman":[
      "i","i","ii","iii","iv","v","vi","vii","viii","ix","x","xi","xii","xiii","xiv","xv","xvi","xvii","xviii","xix","xx"
    ],
    "upper-roman":[
      "I","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"
    ],
    "lower-greek":[
      "\u03b1","\u03b1","\u03b2","\u03b3","\u03b4","\u03b5","\u03b6","\u03b7","\u03b8","\u03b9","\u03ba","\u03bb","\u03bc","\u03bd","\u03be","\u03bf","\u03c0","\u03c1","\u03c3","\u03c4","\u03c5","\u03c6","\u03c7","\u03c8","\u03c9"
    ],
    "upper-greek":[
      "\u0391","\u0391","\u0392","\u0393","\u0394","\u0395","\u0396","\u0397","\u0398","\u0399","\u039a","\u039b","\u039c","\u039d","\u039e","\u039f","\u03a0","\u03a1","\u03a3","\u03a4","\u03a5","\u03a6","\u03a7","\u03a8","\u03a9"
    ],
    "cjk-ideographic":[
      "\u3007","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D","\u4E03","\u516B","\u4E5D","\u5341"
    ],
    "hiragana":[
      "\u3042","\u3042","\u3044","\u3046","\u3048","\u304A","\u304B","\u304D","\u304F","\u3051","\u3053","\u3055","\u3057","\u3059","\u305B","\u305D","\u305F","\u3061","\u3064","\u3066","\u3068","\u306A","\u306B","\u306C","\u306D","\u306E","\u306F","\u3072","\u3075","\u3078","\u307B","\u307E","\u307F","\u3080","\u3081","\u3082","\u3084","\u3086","\u3088","\u3089","\u308A","\u308B","\u308C","\u308D","\u308F","\u3090","\u3091","\u3092","\u3093"
    ],
    "hiragana-iroha":[
      "\u3044","\u3044","\u308D","\u306F","\u306B","\u307B","\u3078","\u3068","\u3061","\u308A","\u306C","\u308B","\u3092","\u308F","\u304B","\u3088","\u305F","\u308C","\u305D","\u3064","\u306D","\u306A","\u3089","\u3080","\u3046","\u3090","\u306E","\u304A","\u304F","\u3084","\u307E","\u3051","\u3075","\u3053","\u3048","\u3066","\u3042","\u3055","\u304D","\u3086","\u3081","\u307F","\u3057","\u3091","\u3072","\u3082","\u305B","\u3059"
    ],
    "katakana":[
      "\u30A2","\u30A2","\u30A4","\u30A6","\u30A8","\u30AA","\u30AB","\u30AD","\u30AF","\u30B1","\u30B3","\u30B5","\u30B7","\u30B9","\u30BB","\u30BD","\u30BF","\u30C1","\u30C4","\u30C6","\u30C8","\u30CA","\u30CB","\u30CC","\u30CD","\u30CE","\u30CF","\u30D2","\u30D5","\u30D8","\u30DB","\u30DE","\u30DF","\u30E0","\u30E1","\u30E2","\u30E4","\u30E6","\u30E8","\u30E9","\u30EA","\u30EB","\u30EC","\u30ED","\u30EF","\u30F0","\u30F1","\u30F2","\u30F3"
    ],
    "katakana-iroha":[
      "\u30A4","\u30A4","\u30ED","\u30CF","\u30CB","\u30DB","\u30D8","\u30C8","\u30C1","\u30EA","\u30CC","\u30EB","\u30F2","\u30EF","\u30AB","\u30E8","\u30BF","\u30EC","\u30BD","\u30C4","\u30CD","\u30CA","\u30E9","\u30E0","\u30A6","\u30F0","\u30CE","\u30AA","\u30AF","\u30E4","\u30DE","\u30B1","\u30D5","\u30B3","\u30A8","\u30C6","\u30A2","\u30B5","\u30AD","\u30E6","\u30E1","\u30DF","\u30B7","\u30F1","\u30D2","\u30E2","\u30BB","\u30B9"
    ]
  };

  var aliases = {
    "upper-latin":"upper-alpha",
    "lower-latin":"lower-alpha"
  };

  return {
    getTableByName : function(name){
      return table[aliases[name] || name];
    },
    getBaseByName : function(name){
      var table = this.getTableByName(name);
      return table.length;
    },
    getStringByName : function(name, decimal){
      var table = this.getTableByName(name);
      var base = table.length;
      var digits = MathUtils.convBase(decimal, base);
      var ret = "";
      for(var i = 0; i < digits.length; i++){
	var digit = digits[i];
	var index = (i === 0)? digits[i] : Math.min(digit + 1, base - 1);
	ret += table[index] || "";
      }
      return ret;
    }
  };
})();


// more strict metrics using canvas
var TextMetrics = (function(){
  var canvas = document.createElement("canvas");
  canvas.style.width = Math.max(Layout.width, Layout.height) + "px";
  canvas.style.height = Layout.maxFontSize + "px";

  var context;
  if(canvas.getContext){
    context = canvas.getContext("2d");
    context.textAlign = "left";
  }

  return {
    isEnable : function(){
      return context && (typeof context.measureText !== "undefined");
    },
    getMetrics : function(font, text){
      context.font = font.toString();
      return context.measureText(text);
    },
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      return metrics.width;
    }
  };
})();


var ListStyleType = (function(){
  function ListStyleType(type){
    this.type = type;
  }

  var marker_text = {
    "disc": "&#x2022;",
    "circle":"&#x25CB;",
    "square":"&#x25A0;"
  };

  ListStyleType.prototype = {
    isDecimalList : function(){
      return (this.type === "decimal" || this.type === "decimal-leading-zero");
    },
    isNoneList : function(){
      return this.type === "none";
    },
    isMarkList : function(){
      return (this.type === "disc" ||
	      this.type === "circle" ||
	      this.type === "square");
    },
    isCountableList : function(){
      return (!this.isNoneList() && !this.isMarkList());
    },
    isHankaku : function(){
      return (this.type === "lower-alpha" || this.type === "upper-alpha" ||
	      this.type === "lower-roman" || this.type === "upper-roman" ||
	      this.isDecimalList());
    },
    isZenkaku : function(){
      return !this.isHankaku();
    },
    _getMarkerDigitString : function(decimal){
      if(this.type === "decimal"){
	return decimal.toString(10);
      }
      if(this.type === "decimal-leading-zero"){
	if(decimal < 10){
	  return "0" + decimal.toString(10);
	}
	return decimal.toString(10);
      }
      return Cardinal.getStringByName(this.type, decimal);
    },
    getMarkerHtml : function(count){
      var text = this.getMarkerText(count);
      if(this.isZenkaku()){
	return Html.tagWrap("span", text, {
	  "class":"nehan-tcy"
	});
      }
      return text;
    },
    getMarkerText : function(count){
      if(this.isNoneList()){
	return Const.space;
      }
      if(this.isMarkList()){
	return marker_text[this.type] || "";
      }
      var digit = this._getMarkerDigitString(count);
      return digit + "."; // add period as postfix.
    },
    getMarkerAdvance : function(flow, font_size, item_count){
      var font_size_half = Math.round(font_size / 2);
      var period_size = font_size_half;
      var marker_spacing_size = Layout.getListMarkerSpacingSize(font_size);
      var marker_font_size = this.isZenkaku()? font_size : font_size_half;
      var max_marker_text = this.getMarkerText(item_count);
      if(this.isNoneList()){
	return font_size;
      }
      if(this.isMarkList()){
	return font_size + marker_spacing_size;
      }
      // zenkaku order is displayed as tcy.
      // so advance is 'single' font-size plus spacing-size.
      if(this.isZenkaku() && flow.isTextVertical()){
	return font_size + marker_spacing_size;
      }
      return (max_marker_text.length - 1) * marker_font_size + period_size + marker_spacing_size;
    }
  };

  return ListStyleType;
})();


var ListStylePos = (function(){
  function ListStylePos(pos){
    this.pos = pos;
  }

  ListStylePos.prototype = {
    isOutside : function(){
      return this.pos === "outside";
    },
    isInside : function(){
      return this.pos === "inside";
    }
  };

  return ListStylePos;
})();


var ListStyleImage = (function(){
  function ListStyleImage(image){
    this.image = image;
  }

  ListStyleImage.prototype = {
    getMarkerAdvance : function(flow, font_size){
      var marker_size = this.image[flow.getPropMeasure()] || font_size;
      var spacing_size = Layout.getListMarkerSpacingSize(font_size);
      return marker_size + spacing_size;
    },
    getMarkerHtml : function(count){
      var url = this.image.url;
      var width = this.image.width || Layout.fontSize;
      var height = this.image.height || Layout.fontSize;
      return Html.tagSingle("img", {
	"src":url,
	"class":"nehan-list-image",
	"width":width,
	"height":height
      });
    }
  };

  return ListStyleImage;
})();


var ListStyle = (function(){
  function ListStyle(opt){
    this.type = new ListStyleType(opt.type || "none");
    this.position = new ListStylePos(opt.position || "outside");
    this.image = (opt.image !== "none")? new ListStyleImage(opt.image) : null;
    this.format = opt.format || null;
  }

  ListStyle.prototype = {
    isMultiCol : function(){
      return this.position.isOutside();
    },
    isInside : function(){
      return this.position.isInside();
    },
    isImageList : function(){
      return (this.image !== null);
    },
    getMarkerHtml : function(count){
      if(this.format !== null){
	return (typeof this.format === "function")? this.format(count) : this.format;
      }
      if(this.image !== null){
	return this.image.getMarkerHtml(count);
      }
      return this.type.getMarkerHtml(count);
    },
    getMarkerAdvance : function(flow, font_size, item_count){
      if(this.image){
	return this.image.getMarkerAdvance(flow, font_size);
      }
      return this.type.getMarkerAdvance(flow, font_size, item_count);
    }
  };

  return ListStyle;
})();

var Flow = (function(){
  function Flow(dir){
    this.dir = dir;
  }

  Flow.prototype = {
    init : function(dir){
      this.dir = dir;
    },
    isValid : function(){
      return (this.dir === "lr" || this.dir === "rl" || this.dir === "tb");
    },
    isHorizontal : function(){
      return (this.dir === "lr" || this.dir === "rl");
    },
    isVertical : function(){
      return (this.dir === "tb");
    },
    isLeftToRight : function(){
      return this.dir === "lr";
    },
    isRightToLeft : function(){
      return this.dir === "rl";
    },
    reverse : function(){
      switch(this.dir){
      case "lr": return "rl";
      case "rl": return "lr";
      case "tb": return "tb"; // bottom to top not exits(maybe).
      default: return "";
      }
    }
  };

  return Flow;
})();


var BlockFlow = (function(){
  function BlockFlow(dir, multicol){
    Flow.call(this, dir);
    this.multicol = multicol || false;
  }

  Class.extend(BlockFlow, Flow);

  BlockFlow.prototype.flip = function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Layout.getVertBlockdir();
    default: return "";
    }
  };

  BlockFlow.prototype.getCss = function(){
    var css = {};
    if(this.isHorizontal()){
      css["float"] = (this.dir === "lr")? "left" : "right";
    } else if(this.isVertical() && this.multicol){
      css["float"] = (Layout.getHoriIndir() === "lr")? "left" : "right";
    }
    return css;
  };

  BlockFlow.prototype.getPropBefore = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

  BlockFlow.prototype.getPropAfter = function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  };

  return BlockFlow;
})();


var InlineFlow = (function(){
  function InlineFlow(dir){
    Flow.call(this, dir);
  }
  Class.extend(InlineFlow, Flow);

  InlineFlow.prototype.getPropStart = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

  InlineFlow.prototype.getPropEnd = function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  };

  return InlineFlow;
})();


var BackgroundPos = (function(){
  function BackgroundPos(pos, offset){
    this.pos = pos || "center";
    this.offset = offset || 0;
  }

  BackgroundPos.prototype = {
    getCssValue : function(flow){
      var ret = [flow.getProp(this.pos)];
      if(this.offset){
	ret.push(this.offset);
      }
      return ret.join(" ");
    }
  };

  return BackgroundPos;
})();


var BackgroundPos2d = (function(){
  function BackgroundPos2d(inline, block){
    this.inline = inline;
    this.block = block;
  }

  BackgroundPos2d.prototype = {
    getCssValue : function(flow){
      return [
	this.inline.getCssValue(flow),
	this.block.getCssValue(flow)
      ].join(" ");
    },
    getCss : function(flow){
      var css = {};
      css["background-pos"] = this.getCssValue(flow);
      return css;
    }
  };

  return BackgroundPos2d;
})();


var BackgroundRepeat = (function(){
  function BackgroundRepeat(value){
    this.value = value;
  }

  BackgroundRepeat.prototype = {
    isSingleValue : function(){
      return (this.value === "repeat-x" ||
	      this.value === "repeat-y" ||
	      this.value === "repeat-inline" ||
	      this.value === "repeat-block");
    },
    getCssValue : function(flow){
      var is_vert = flow.isTextVertical();
      switch(this.value){
      case "repeat-inline": case "repeat-x":
	return is_vert? "repeat-y" : "repeat-x";
      case "repeat-block": case "repeat-y":
	return is_vert? "repeat-x" : "repeat-y";
      default:
	return this.value;
      }
    }
  };

  return BackgroundRepeat;
})();


var BackgroundRepeat2d = (function(){
  // inline: BackgroundRepeat
  // block: BackgroundRepeat
  function BackgroundRepeat2d(inline, block){
    this.inline = inline;
    this.block = block;
  }

  BackgroundRepeat2d.prototype = {
    _getRepeatValue : function(flow, value){
      var is_vert = flow.isTextVertical();
      switch(value){
      case "repeat-inline": case "repeat-x":
	return is_vert? "repeat-y" : "repeat-x";
      case "repeat-block": case "repeat-y":
	return is_vert? "repeat-x" : "repeat-y";
      default:
	return value;
      }
    },
    getCssValue : function(flow){
      var values = [this.inline];
      if(!this.inline.isSingleValue()){
	values.push(this.block);
      }
      return List.map(values, function(value){
	return value.getCssValue(flow);
      }).join(" ");
    }
  };

  return BackgroundRepeat2d;
})();


var Background = (function(){
  function Background(){
  }

  Background.prototype = {
    getCss : function(flow){
      var css = {};
      if(this.pos){
	Args.copy(css, this.pos.getCss(flow));
      }
      if(this.repeat){
	css["background-repeat"] = this.repeat.getCssValue(flow);
	//Args.copy(css, this.repeat.getCss(flow));
      }
      if(this.origin){
	css["background-origin"] = this.origin;
      }
      if(this.color){
	css["background-color"] = this.color;
      }
      if(this.image){
	css["background-image"] = this.image;
      }
      if(this.attachment){
	css["background-attachment"] = this.attachment;
      }
      return css;
    }
  };

  return Background;
})();


var BoxFlow = (function(){
  function BoxFlow(indir, blockdir, multicol){
    this.inflow = new InlineFlow(indir);
    this.blockflow = new BlockFlow(blockdir, multicol);
  }

  BoxFlow.prototype = {
    getCss : function(){
      var css = {};
      Args.copy(css, this.blockflow.getCss());
      return css;
    },
    getName : function(){
      return [this.inflow.dir, this.blockflow.dir].join("-");
    },
    isValid : function(){
      return this.inflow.isValid() && this.blockflow.isValid();
    },
    isTextLineFirst : function(){
      if(this.isTextVertical() && this.blockflow.isLeftToRight()){
	return true;
      }
      return false;
    },
    isBlockflowVertical : function(){
      return this.blockflow.isVertical();
    },
    isTextVertical : function(){
      return this.inflow.isVertical();
    },
    isTextHorizontal : function(){
      return this.inflow.isHorizontal();
    },
    getTextHorizontalDir : function(){
      if(this.isTextHorizontal()){
	return this.inflow.dir;
      }
      return "";
    },
    getProp : function(prop){
      switch(prop){
      case "start":
	return this.getPropStart();
      case "end":
	return this.getPropEnd();
      case "before":
	return this.getPropBefore();
      case "after":
	return this.getPropAfter();
      }
    },
    getPropStart : function(){
      return this.inflow.getPropStart();
    },
    getPropEnd : function(){
      return this.inflow.getPropEnd();
    },
    getPropBefore : function(){
      return this.blockflow.getPropBefore();
    },
    getPropAfter : function(){
      return this.blockflow.getPropAfter();
    },
    getPropExtent : function(){
      return this.isTextVertical()? "width" : "height";
    },
    getPropMeasure : function(){
      return this.isTextVertical()? "height" : "width";
    },
    getPropWidth : function(){
      return this.isTextVertical()? "extent" : "measure";
    },
    getPropHeight : function(){
      return this.isTextVertical()? "measure" : "extent";
    },
    getParallelFlipFlow : function(){
      return BoxFlows.get(this.inflow.dir, this.blockflow.dir, false);
    },
    getParallelFlow : function(){
      return BoxFlows.get(this.inflow.dir, this.blockflow.dir, true);
    },
    getFlipFlow : function(){
      return this.isTextVertical()? Layout.getStdHoriFlow() : Layout.getStdVertFlow();
    },
    getFloatedWrapFlow : function(){
      if(this.isTextVertical()){
	return this;
      }
      return this.getParallelFlow();
    },
    getBoxSize : function(measure, extent){
      var size = new BoxSize(0,0);
      size[this.getPropMeasure()] = measure;
      size[this.getPropExtent()] = extent;
      return size;
    }
  };

  return BoxFlow;
})();


var BoxFlows = {
  "tb-rl":(new BoxFlow("tb", "rl")),
  "tb-lr":(new BoxFlow("tb", "lr")),
  "lr-tb":(new BoxFlow("lr", "tb")),
  "rl-tb":(new BoxFlow("rl", "tb")),

  "tb-rl-mc":(new BoxFlow("tb", "rl", true)),
  "tb-lr-mc":(new BoxFlow("tb", "lr", true)),
  "lr-tb-mc":(new BoxFlow("lr", "tb", true)),
  "rl-tb-mc":(new BoxFlow("rl", "tb", true)),

  NORMAL:(new BoxFlow("lr", "tb")),
  get: function(inflow, blockflow, multicol){
    var is_multicol = multicol || false;
    var name = inflow + "-" + blockflow + (is_multicol? "-mc" : "");
    return this.getByName(name);
  },
  getByName : function(name){
    if(typeof this[name] === "undefined"){
      throw "undefined box-flow" + name;
    }
    return this[name];
  }
};

var BoxRect = {
  iter : function(obj, fn){
    List.iter(Const.cssBoxDirs, function(dir){
      if(obj[dir]){
	fn(dir, obj[dir]);
      }
    });
  },
  map : function(obj, fn){
    if(obj instanceof Array){
      return List.map(obj, fn);
    }
    if(typeof obj === "object"){
      return Obj.map(obj, fn);
    }
    return fn(obj);
  },
  setValue : function(dst, flow, value){
    if(typeof value.start != "undefined"){
      this.setStart(dst, flow, value.start);
    }
    if(typeof value.end != "undefined"){
      this.setEnd(dst, flow, value.end);
    }
    if(typeof value.before != "undefined"){
      this.setBefore(dst, flow, value.before);
    }
    if(typeof value.after != "undefined"){
      this.setAfter(dst, flow, value.after);
    }
    return dst;
  },
  setBefore : function(dst, flow, value){
    dst[flow.getPropBefore()] = value;
  },
  setAfter : function(dst, flow, value){
    dst[flow.getPropAfter()] = value;
  },
  setStart : function(dst, flow, value){
    dst[flow.getPropStart()] = value;
  },
  setEnd : function(dst, flow, value){
    dst[flow.getPropEnd()] = value;
  }
};


var BoxCorner = {
  sortCornerDirection : function(dir1, dir2){
    var order = {top:0, bottom:1, left:2, right:3};
    return [dir1, dir2].sort(function (c1, c2){
      return order[c1] - order[c2];
    });
  },
  getCornerName : function(dir1, dir2){
    var dirs = this.sortCornerDirection(dir1, dir2);
    return [dirs[0], Utils.capitalize(dirs[1])].join("");
  }
};

var BoxSizing = (function(){
  function BoxSizing(value){
    // 'margin-box' is original sizing scheme of nehan,
    // even if margin is included in box size.
    this.value = value || "margin-box";
  }

  BoxSizing.prototype = {
    containEdgeSize : function(){
      return this.value !== "margin-box";
    },
    containMarginSize : function(){
      return this.value === "margin-box";
    },
    containBorderSize : function(){
      return this.value === "margin-box" || this.value === "border-box";
    },
    containPaddingSize : function(){
      return this.value === "margin-box" || this.value === "border-box" || this.value === "padding-box";
    },
    getSubEdge : function(edge){
      var ret = new BoxEdge();
      if(this.containMarginSize()){
	ret.margin = edge.margin;
      }
      if(this.containPaddingSize()){
	ret.padding = edge.padding;
      }
      if(this.containBorderSize()){
	ret.border = edge.border;
      }
      return ret;
    },
    getCss : function(){
      var css = {};
      css["box-sizing"] = "content-box";
      return css;
    }
  };

  return BoxSizing;
})();


var BoxSizings = {
  "content-box":(new BoxSizing("content-box")),
  "padding-box":(new BoxSizing("padding-box")),
  "border-box":(new BoxSizing("border-box")),
  "margin-box":(new BoxSizing("margin-box")),
  getByName : function(name){
    if(typeof this[name] === "undefined"){
      throw "undefined box-sizing:" + name;
    }
    return this[name];
  }
};


var Font = (function(){
  function Font(size){
    this.size = size;
  }

  Font.prototype = {
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    toString : function(){
      return [
	this.weight || "normal",
	this.style || "normal",
	this.size + "px",
	this.family || "monospace"
      ].join(" ");
    },
    getCss : function(){
      var css = {};
      if(this.size){
	css["font-size"] = this.size + "px";
      }
      if(this.weight){
	css["font-weight"] = this.weight;
      }
      if(this.style){
	css["font-style"] = this.style;
      }
      if(this.family){
	css["font-family"] = this.family;
      }
      return css;
    }
  };

  return Font;
})();


var Edge = (function(){
  function Edge(type){
    this._type = type;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }

  Edge.prototype = {
    clear : function(){
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.left = 0;
    },
    clone : function(){
      var edge = new Edge(this.type);
      edge.top = this.top;
      edge.right = this.right;
      edge.bottom = this.bottom;
      edge.left = this.left;
      return edge;
    },
    isEnable : function(){
      return this.top !== 0 || this.right !== 0 || this.bottom !== 0 || this.left !== 0;
    },
    getDirProp : function(dir){
      return [this._type, dir].join("-");
    },
    getCss : function(){
      var css = {};
      var self = this;
      List.iter(["top", "right", "bottom", "left"], function(dir){
	var value = self[dir];
	if(value > 0){
	  css[self.getDirProp(dir)] = self[dir] + "px";
	}
      });
      return css;
    },
    getWidth : function(){
      return this.left + this.right;
    },
    getHeight : function(){
      return this.top + this.bottom;
    },
    getMeasureSize : function(flow){
      return flow.isTextVertical()? this.getHeight() : this.getWidth();
    },
    getExtentSize : function(flow){
      return flow.isBlockflowVertical()? this.getHeight() : this.getWidth();
    },
    setSize : function(flow, size){
      BoxRect.setValue(this, flow, size);
    },
    setStart : function(flow, value){
      this[flow.getPropStart()] = value;
    },
    setEnd : function(flow, value){
      this[flow.getPropEnd()] = value;
    },
    setBefore : function(flow, value){
      this[flow.getPropBefore()] = value;
    },
    setAfter : function(flow, value){
      this[flow.getPropAfter()] = value;
    },
    getStart : function(flow){
      return this[flow.getPropStart()];
    },
    getEnd : function(flow){
      return this[flow.getPropEnd()];
    },
    getBefore : function(flow){
      return this[flow.getPropBefore()];
    },
    getAfter : function(flow){
      return this[flow.getPropAfter()];
    }
  };

  return Edge;
})();

var Radius2d = (function(){
  function Radius2d(){
    this.hori = 0;
    this.vert = 0;
  }

  Radius2d.prototype = {
    setSize : function(value){
      this.hori = value[0];
      this.vert = value[1];
    },
    getCssValueHori : function(){
      return this.hori + "px";
    },
    getCssValueVert : function(){
      return this.vert + "px";
    }
  };
  
  return Radius2d;
})();

var BorderRadius = (function(){
  function BorderRadius(){
    this.topLeft = new Radius2d();
    this.topRight = new Radius2d();
    this.bottomRight = new Radius2d();
    this.bottomLeft = new Radius2d();
  }

  BorderRadius.prototype = {
    getArray : function(){
      return [
	this.topLeft,
	this.topRight,
	this.bottomRight,
	this.bottomLeft
      ];
    },
    getCssValueHori : function(){
      return List.map(this.getArray(), function(radius){
	return radius.getCssValueHori();
      }).join(" ");
    },
    getCssValueVert : function(){
      return List.map(this.getArray(), function(radius){
	return radius.getCssValueVert();
      }).join(" ");
    },
    getCssValue : function(){
      return [this.getCssValueHori(), this.getCssValueVert()].join("/");
    },
    getCss : function(){
      var css = {};
      var css_value = this.getCssValue();
      css["border-radius"] = css_value; // without vender prefix
      List.iter(Const.cssVenderPrefixes, function(prefix){
	var prop = [prefix, "border-radius"].join("-"); // with vender prefix
	css[prop] = css_value;
      });
      return css;
    },
    getCorner : function(dir1, dir2){
      var name = BoxCorner.getCornerName(dir1, dir2);
      return this[name];
    },
    setSize : function(flow, size){
      if(typeof size["start-before"] != "undefined"){
	this.setStartBefore(flow, size["start-before"]);
      }
      if(typeof size["start-after"] != "undefined"){
	this.setStartAfter(flow, size["start-after"]);
      }
      if(typeof size["end-before"] != "undefined"){
	this.setEndBefore(flow, size["end-before"]);
      }
      if(typeof size["end-after"] != "undefined"){
	this.setEndAfter(flow, size["end-after"]);
      }
    },
    setStartBefore : function(flow, value){
      var radius = this.getCorner(flow.getPropStart(), flow.getPropBefore());
      radius.setSize(value);
    },
    setStartAfter : function(flow, value){
      var radius = this.getCorner(flow.getPropStart(), flow.getPropAfter());
      radius.setSize(value);
    },
    setEndBefore : function(flow, value){
      var radius = this.getCorner(flow.getPropEnd(), flow.getPropBefore());
      radius.setSize(value);
    },
    setEndAfter :  function(flow, value){
      var radius = this.getCorner(flow.getPropEnd(), flow.getPropAfter());
      radius.setSize(value);
    },
    clearBefore : function(flow){
      this.setStartBefore(flow, [0, 0]);
      this.setEndBefore(flow, [0, 0]);
    },
    clearAfter : function(flow){
      this.setStartAfter(flow, [0, 0]);
      this.setEndAfter(flow, [0, 0]);
    }
  };

  return BorderRadius;
})();

var BorderColor = (function(){
  function BorderColor(){
  }

  BorderColor.prototype = {
    setColor : function(flow, value){
      var self = this;

      // first, set as it is(obj, array, string).
      BoxRect.setValue(this, flow, value);

      // second, map as color class.
      BoxRect.iter(this, function(dir, val){
	self[dir] = new Color(val);
      });
    },
    getCss : function(){
      var css = {};
      BoxRect.iter(this, function(dir, color){
	var prop = ["border", dir, "color"].join("-");
	css[prop] = color.getCssValue();
      });
      return css;
    }
  };

  return BorderColor;
})();

var BorderStyle = (function(){
  function BorderStyle(){
  }

  BorderStyle.prototype = {
    setStyle : function(flow, value){
      BoxRect.setValue(this, flow, value);
    },
    getCss : function(){
      var css = {};
      BoxRect.iter(this, function(dir, style){
	var prop = ["border", dir, "style"].join("-");
	css[prop] = style;
      });
      return css;
    }
  };

  return BorderStyle;
})();

var Padding = (function(){
  function Padding(){
    Edge.call(this, "padding");
  }
  Class.extend(Padding, Edge);

  return Padding;
})();


var Margin = (function(){
  function Margin(){
    Edge.call(this, "margin");
  }
  Class.extend(Margin, Edge);

  return Margin;
})();


var Border = (function(){
  function Border(){
    Edge.call(this, "border");
  }
  Class.extend(Border, Edge);

  Border.prototype.clearBefore = function(flow){
    this.setBefore(flow, 0);
    if(this.radius){
      this.radius.clearBefore(flow);
    }
  };

  Border.prototype.clearAfter = function(flow){
    this.setAfter(flow, 0);
    if(this.radius){
      this.radius.clearAfter(flow);
    }
  };

  Border.prototype.getDirProp = function(dir){
    return ["border", dir, "width"].join("-");
  };

  Border.prototype.setRadius = function(flow, radius){
    this.radius = new BorderRadius();
    this.radius.setSize(flow, radius);
  };

  Border.prototype.setColor = function(flow, color){
    this.color = new BorderColor();
    this.color.setColor(flow, color);
  };

  Border.prototype.setStyle = function(flow, style){
    this.style = new BorderStyle();
    this.style.setStyle(flow, style);
  };

  Border.prototype.getCss = function(){
    var css = Edge.prototype.getCss.call(this);
    if(this.radius){
      Args.copy(css, this.radius.getCss());
    }
    if(this.color){
      Args.copy(css, this.color.getCss());
    }
    if(this.style){
      Args.copy(css, this.style.getCss());
    }
    return css;
  };

  return Border;
})();

var Partition = (function(){
  function Partition(parts, max_size){
    switch(arguments.length){
    case 1:
      this.parts = parts;
      break;
    case 2:
      this.parts = this._mapSize(parts, max_size);
      break;
    }
  }

  Partition.prototype = {
    getLength : function(){
      return this.parts.length;
    },
    getSize : function(index){
      return this.parts[index] || null;
    },
    _mapSize : function(parts, max_size){
      var auto_parts = List.filter(parts, function(size){ return size === 0; });
      var auto_count = auto_parts.length;
      if(auto_count === 0){
	return parts;
      }
      var total_size = List.sum(parts);
      var rest_size = max_size - total_size;
      var auto_size = Math.round(rest_size / auto_count);
      return List.map(parts, function(size){
	return size? size : auto_size;
      });
    }
  };

  return Partition;
})();

var TablePartition = (function(){
  function TablePartition(){
    this.entry = {};
  }

  TablePartition.prototype = {
    add : function(partition){
      var col_count = partition.getLength();
      this.entry[col_count] = partition;
    },
    getPartition : function(col_count){
      return (this.entry[col_count] || null);
    }
  };

  return TablePartition;
})();

var TextEmphaStyle = (function(){
  var default_empha_style = "filled dot";
  var empha_marks = {
    // dot
    "filled dot":"&#x2022;",
    "open dot":"&#x25e6;",

    // circle
    "filled circle":"&#x25cf;",
    "open circle":"&#x25cb;",

    // double-circle
    "filled double-circle":"&#x25c9;",
    "open double-circle":"&#x25ce;",

    // triangle
    "filled triangle":"&#x25b2;",
    "open triangle":"&#x25b3;",

    // sesame
    "filled sesame":"&#xfe45;",
    "open sesame":"&#xfe46;"
  };

  function TextEmphaStyle(value){
    this.value = value || "none";
  }

  TextEmphaStyle.prototype = {
    isEnable : function(){
      return this.value != "none";
    },
    setValue : function(value){
      this.value = value;
    },
    getText : function(){
      return empha_marks[this.value] || this.value || empha_marks[default_empha_style];
    },
    getCss : function(){
      var css = {};
      //return css["text-emphasis-style"] = this.value;
      return css;
    }
  };

  return TextEmphaStyle;
})();


var TextEmphaPos = (function(){
  function TextEmphaPos(value){
    Args.merge(this, {
      hori:"over",
      vert:"right"
    }, value || {});
  }

  TextEmphaPos.prototype = {
    isEmphaFirst : function(){
      return this.hori === "over" || this.vert === "left";
    },
    getCss : function(line){
      var css = {};
      return css;
    }
  };

  return TextEmphaPos;
})();


var TextEmpha = (function(){
  function TextEmpha(opt){
    opt = opt || {};
    this.style = opt.style || new TextEmphaStyle();
    this.pos = opt.pos || new TextEmphaPos();
    this.color = opt.color || new Color(Layout.fontColor);
  }

  TextEmpha.prototype = {
    isEnable : function(){
      return this.style && this.style.isEnable();
    },
    isEmphaStart : function(){
      return this.pos? this.pos.isEmphaStart() : true;
    },
    getText : function(){
      return this.style? this.style.getText() : "";
    },
    getExtent : function(font_size){
      return font_size * 3;
    },
    getCssVertEmphaWrap : function(line, chr){
      var css = {}, font_size = line.style.getFontSize();
      css["text-align"] = "left";
      css.width = this.getExtent(font_size) + "px";
      css.height = chr.getAdvance(line.style.flow, line.style.letterSpacing || 0) + "px";
      return css;
    },
    getCssHoriEmphaWrap : function(line, chr){
      var css = {}, font_size = line.style.getFontSize();
      css.display = "inline-block";
      css.width = chr.getAdvance(line.style.flow, line.style.letterSpacing) + "px";
      css.height = this.getExtent(font_size) + "px";
      return css;
    }
  };

  return TextEmpha;
})();


var BoxEdge = (function (){
  function BoxEdge(){
    this.padding = new Padding();
    this.margin = new Margin();
    this.border = new Border();
  }

  BoxEdge.prototype = {
    isEnable : function(){
      return this.padding.isEnable() || this.margin.isEnable() || this.border.isEnable();
    },
    clone : function(){
      var edge = new BoxEdge();
      edge.padding = this.padding.clone();
      edge.margin = this.margin.clone();
      edge.border = this.border.clone();
      return edge;
    },
    clear : function(){
      this.padding.clear();
      this.margin.clear();
      this.border.clear();
    },
    getCss : function(){
      var css = {};
      Args.copy(css, this.padding.getCss());
      Args.copy(css, this.margin.getCss());
      Args.copy(css, this.border.getCss());
      return css;
    },
    getWidth : function(){
      var ret = 0;
      ret += this.padding.getWidth();
      ret += this.margin.getWidth();
      ret += this.border.getWidth();
      return ret;
    },
    getHeight : function(){
      var ret = 0;
      ret += this.padding.getHeight();
      ret += this.margin.getHeight();
      ret += this.border.getHeight();
      return ret;
    },
    getMeasureSize : function(flow){
      var ret = 0;
      ret += this.padding.getMeasureSize(flow);
      ret += this.margin.getMeasureSize(flow);
      ret += this.border.getMeasureSize(flow);
      return ret;
    },
    getExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtentSize(flow);
      ret += this.margin.getExtentSize(flow);
      ret += this.border.getExtentSize(flow);
      return ret;
    },
    setAll : function(prop, flow, value){
      this[prop].setAll(flow, value);
    },
    setBorderRadius : function(flow, value){
      this.border.setRadius(flow, value);
    },
    setBorderColor : function(flow, value){
      this.border.setColor(flow, value);
    },
    setBorderStyle : function(flow, value){
      this.border.setStyle(flow, value);
    },
    clearBorderStart : function(flow){
      this.border.clearStart(flow);
    },
    clearBorderBefore : function(flow){
      this.border.clearBefore(flow);
    },
    clearBorderAfter : function(flow){
      this.border.clearAfter(flow);
    }
  };

  return BoxEdge;
})();

var BoxSize = (function(){
  function BoxSize(width, height){
    this.width = width;
    this.height = height;
  }

  BoxSize.prototype = {
    clone : function(){
      return new BoxSize(this.width, this.height);
    },
    isValid : function(){
      return this.width > 0 && this.height > 0;
    },
    canInclude : function(size){
      return (size.width <= this.width && size.height <= this.height);
    },
    getCss : function(){
      var css = {};
      css.width = this.width + "px";
      css.height = this.height + "px";
      return css;
    },
    getWhSlope : function(){
      return this.height / this.width;
    },
    getHwSlope : function(){
      return this.width / this.height;
    },
    getMeasure : function(flow){
      return this[flow.getPropMeasure()];
    },
    getExtent : function(flow){
      return this[flow.getPropExtent()];
    },
    setExtent : function(flow, extent){
      this[flow.getPropExtent()] = extent;
    },
    setMeasure : function(flow, measure){
      this[flow.getPropMeasure()] = measure;
    },
    subEdge : function(edge){
      var dw = edge.getWidth();
      var dh = edge.getHeight();
      this.width = Math.max(0, this.width - dw);
      this.height = Math.max(0, this.height - dh);
    },
    subMeasure : function(flow, measure){
      var prop = flow.getPropMeasure();
      this[prop] = Math.max(0, this[prop] - measure);
    },
    addMeasure : function(flow, measure){
      this[flow.getPropMeasure()] += measure;
    },
    addExtent : function(flow, extent){
      this[flow.getPropExtent()] += extent;
    },
    percentFrom : function(target_size){
      return Math.round(100 * this.width / target_size.width);
    },
    resizeWithin : function(flow, rest_size){
      var rest_measure = rest_size.getMeasure(flow);
      var rest_extent = rest_size.getExtent(flow);
      var box_measure = this.getMeasure(flow);
      var box_extent = this.getExtent(flow);
      if(box_extent > rest_extent){
	// box_measure : box_extent = ? : rest_extent
	box_measure = box_measure * rest_extent / box_extent;
	box_extent = rest_extent;
      }
      if(box_measure > rest_measure){
	var slope = box_extent / box_measure; // extent per measure
	var m_over = box_measure - rest_measure;
	box_extent = Math.round(box_extent - slope * m_over);
	box_measure = rest_measure;
      }
      return flow.getBoxSize(box_measure, box_extent);
    }
  };

  return BoxSize;
})();

var BoxPosition = (function(){
  function BoxPosition(position, offset){
    offset = offset || {};
    this.position = position;
    this.top = (typeof offset.top !== "undefined")? offset.top : "auto";
    this.left = (typeof offset.left !== "undefined")? offset.left : "auto";
    this.right = (typeof offset.right !== "undefined")? offset.right : "auto";
    this.bottom = (typeof offset.bottom !== "undefined")? offset.bottom : "auto";
  }

  BoxPosition.prototype = {
    isAbsolute : function(){
      return this.position === "absolute";
    },
    getCss : function(){
      var css = {};
      css.position = this.position;
      css.top = this.top;
      css.left = this.left;
      css.right = this.right;
      css.bottom = this.bottom;
      return css;
    }
  };

  return BoxPosition;
})();


var Box = (function(){
  function Box(size, style){
    this.size = size;
    this.style = style;
    this.css = {};
  }

  Box.prototype = {
    debug : function(title){
      console.log("[%s](m,e) = (%d,%d), (m+,e+) = (%d,%d)", title,
		  this.getContentMeasure(), this.getContentExtent(),
		  this.getBoxMeasure(), this.getBoxExtent());
    },
    getCssBlock : function(){
      var css = {};
      Args.copy(css, this.style.getCssBlock()); // base style
      Args.copy(css, this.size.getCss()); // local size
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    getCssInline : function(){
      var css = {};
      Args.copy(css, this.style.getCssInline()); // base style
      Args.copy(css, this.size.getCss()); // local size
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    getCssVertInlineBox : function(){
      var css = this.getCssBlock();
      css["float"] = "none";
      css["margin-left"] = css["margin-right"] = "auto";
      return css;
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.style.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.style.flow);
    },
    getContentWidth : function(){
      return this.size.width;
    },
    getContentHeight : function(){
      return this.size.height;
    },
    getBoxMeasure : function(flow){
      flow = flow || this.style.flow;
      var ret = this.getContentMeasure(flow);
      if(this.edge){
	ret += this.edge.getMeasureSize(flow);
      }
      return ret;
    },
    getBoxExtent : function(flow){
      flow = flow || this.style.flow;
      var ret = this.getContentExtent(flow);
      if(this.edge){
	ret += this.edge.getExtentSize(flow);
      }
      return ret;
    },
    clearBorderBefore : function(){
      if(this.edge){
	this.edge.clearBorderBefore(this.style.flow);
      }
    },
    clearBorderAfter : function(){
      if(this.edge){
	this.edge.clearBorderAfter(this.style.flow);
      }
    },
    resizeExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
      return this;
    }
  };

  return Box;
})();

var HtmlLexer = (function (){
  var rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var rex_word = /^([\w!\.\?\/\_:#;"',]+)/;
  var rex_tag = /^(<[^>]+>)/;
  var rex_char_ref = /^(&[^;\s]+;)/;

  function HtmlLexer(src){
    this.pos = 0;
    this.buff = this._normalize(src);
    this.src = this.buff;
  }
  HtmlLexer.prototype = {
    _normalize : function(src){
      return src
	.replace(/(<\/[^>]+>)/g, function(p1){
	  return p1.toLowerCase();
	}) // convert close tag to lower case(for innerHTML of IE)
	.replace(/^[ \n]+/, "") // shorten head space
	.replace(/\s+$/, "") // discard tail space
	.replace(/\r/g, ""); // discard CR
    },
    isEmpty : function(){
      return this.src === "";
    },
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    getSrc : function(){
      return this.src;
    },
    getSeekPercent : function(seek_pos){
      return Math.round(100 * seek_pos / this.src.length);
    },
    _stepBuff : function(count){
      this.pos += count;
      this.buff = this.buff.slice(count);
    },
    _getToken : function(){
      if(this.buff === ""){
	return null;
      }
      if(this.buff.match(rex_tag)){
	return this._parseTag(RegExp.$1);
      }
      if(this.buff.match(rex_word)){
	var str = RegExp.$1;
	if(str.length === 1){
	  return this._parseChar(str);
	} else if(str.length === 2 && str.match(rex_tcy)){
	  return this._parseTcy(str);
	}
	return this._parseWord(str);
      }
      if(this.buff.match(rex_char_ref)){
	return this._parseCharRef(RegExp.$1);
      }
      return this._parseChar(this._getChar());
    },
    _getRb : function(){
      var rb = this.buffRb.substring(0, 1);
      this.buffRb = this.buffRb.slice(1);
      return rb;
    },
    _getChar : function(){
      return this.buff.substring(0,1);
    },
    _getTagContentAux : function(tag_name){
      var recur_tag_rex = new RegExp("<" + tag_name + "[\\s|>]");
      var end_tag = "</" + tag_name + ">";
      var get_end_pos = function(buff){
	var end_pos = buff.indexOf(end_tag);
	if(end_pos < 0){
	  return -1;
	}
	var recur_match = buff.match(recur_tag_rex);
	var recur_pos = recur_match? recur_match.index : -1;
	if(recur_pos < 0 || end_pos < recur_pos){
	  return end_pos;
	}
	var restart_pos = recur_pos + tag_name.length + 2;
	var end_pos2 = arguments.callee(buff.substring(restart_pos));
	if(end_pos2 < 0){
	  return -1;
	}
	var restart_pos2 = restart_pos + end_pos2 + tag_name.length + 3;
	return restart_pos2 + arguments.callee(buff.substring(restart_pos2));
      };

      var end_pos = get_end_pos(this.buff);
      if(end_pos < 0){
	return this.buff; // tag not closed, so return whole rest buff.
      }
      return this.buff.substring(0, end_pos);
    },
    _getTagContent : function(tag_name){
      try {
	return this._getTagContentAux(tag_name);
      } catch (e){
	return "";
      }
    },
    _parseTag : function(tagstr){
      var tag = new Tag(tagstr);
      this._stepBuff(tagstr.length);

      if(tag.isTcyTag()){
	return this._parseTcyTag(tag);
      }
      if(!tag.isSingleTag()){
	return this._parseChildContentTag(tag);
      }
      return tag;
    },
    _parseTcyTag : function(tag){
      var content = this._getTagContent(tag.name);
      this._stepBuff(content.length + tag.name.length + 3); // 3 = "</>".length
      return new Tcy(content);
    },
    _parseChildContentTag : function(tag){
      var content = this._getTagContent(tag.name);
      tag.setContentRaw(Utils.trimCRLF(content));
      this._stepBuff(content.length + tag.name.length + 3); // 3 = "</>".length
      return tag;
    },
    _parseWord : function(str){
      this._stepBuff(str.length);
      return new Word(str);
    },
    _parseTcy : function(str){
      this._stepBuff(str.length);
      return new Tcy(str);
    },
    _parseChar : function(str){
      this._stepBuff(str.length);
      return new Char(str, false);
    },
    _parseCharRef : function(str){
      this._stepBuff(str.length);
      return new Char(str, true);
    }
  };
  return HtmlLexer;
})();


var SectionHeader = (function(){
  function SectionHeader(rank, title, id){
    this.rank = rank;
    this.title = title;
    this._id = id || 0;
  }

  SectionHeader.prototype = {
    getId : function(){
      return this._id;
    }
  };

  return SectionHeader;
})();

var Section = (function(){
  function Section(type, parent, page_no){
    this._type = type;
    this._header = null;
    this._auto = false;
    this._next = null;
    this._child = null;
    this._parent = parent || null;
    this._pageNo = page_no || 0;
  }

  Section.prototype = {
    isRoot : function(){
      return this._parent === null;
    },
    isAuto : function(){
      return this._auto;
    },
    hasHeader : function(){
      return this._header !== null;
    },
    hasHeaderId : function(){
      return this.getHeaderId() > 0;
    },
    hasChild : function(){
      return this._child !== null;
    },
    hasNext : function(){
      return this._next !== null;
    },
    getNext : function(){
      return this._next;
    },
    getChild : function(){
      return this._child;
    },
    getParent : function(){
      return this._parent;
    },
    getHeader : function(){
      return this._header;
    },
    getHeaderId : function(){
      if(this._header){
	return this._header.getId();
      }
      return null;
    },
    setHeader : function(header){
      this._header = header;
    },
    setAuto : function(){
      this._auto = true;
    },
    getRank : function(){
      return this._header? this._header.rank : 0;
    },
    getTitle : function(){
      return this._header? this._header.title : ["untitled", this._type].join(" ");
    },
    getType : function(){
      return this._type;
    },
    getPageNo : function(){
      return this._pageNo;
    },
    updatePageNo : function(page_no){
      this._pageNo = page_no;
    },
    addChild : function(section){
      if(this._child === null){
	this._child = section;
      } else {
	this._child.addNext(section);
      }
    },
    addNext : function(section){
      if(this._next === null){
	this._next = section;
      } else {
	this._next.addNext(section);
      }
    }
  };

  return Section;
})();


var TocContext = (function(){
  function TocContext(){
    this.stack = [1];
  }

  TocContext.prototype = {
    toString : function(){
      return this.stack.join(".");
    },
    stepNext : function(){
      if(this.stack.length > 0){
	this.stack[this.stack.length - 1]++;
      }
      return this;
    },
    startRoot : function(){
      this.stack.push(1);
      return this;
    },
    endRoot : function(){
      this.stack.pop();
      return this;
    }
  };

  return TocContext;
})();

var OutlineContext = (function(){
  function OutlineContext(style){
    this.logs = [];
    this.style = style;
    this.pageNo = 0;
  }

  var __header_id__ = 0; // glocal unique header id
  var gen_header_id = function(){
    return __header_id__++;
  };

  OutlineContext.prototype = {
    isEmpty : function(){
      return this.logs.length === 0;
    },
    get : function(index){
      return this.logs[index] || null;
    },
    getTocTree : function(){
      return OutlineParser.getTocTree(this);
    },
    getTocNode : function(){
      var tree = this.outputTocTree();
      return (new OutlineConverter()).convert(tree);
    },
    getPageNo : function(){
      return this.pageNo;
    },
    stepPageNo : function(){
      this.pageNo++;
    },
    getMarkupName : function(){
      return this.style.getMarkupName();
    },
    startSection : function(type){
      this.logs.push({
	name:"start-section",
	type:type,
	pageNo:this.pageNo
      });
      return this;
    },
    endSection : function(type){
      this.logs.push({
	name:"end-section",
	type:type
      });
      return this;
    },
    addHeader : function(opt){
      // header id is used to associate header box object with outline.
      var header_id = gen_header_id();
      this.logs.push({
	name:"set-header",
	type:opt.type,
	rank:opt.rank,
	title:opt.title,
	pageNo:this.pageNo,
	headerId:header_id
      });
      return header_id;
    }
  };

  return OutlineContext;
})();

// parse : context -> section tree
var OutlineContextParser = (function(){
  var __ptr__ = 0;
  var __outline__ = null;
  var __root__ = null;

  var get_next = function(){
    return __outline__.get(__ptr__++);
  };

  var rollback = function(){
    __ptr__ = Math.max(0, __ptr__ - 1);
  };

  var parse = function(parent){
    var log = get_next();
    if(log === null){
      return;
    }
    switch(log.name){
    case "start-section":
      var section = new Section(log.type, parent, log.pageNo);
      if(parent){
	parent.addChild(section);
      }
      arguments.callee(section);
      break;

    case "end-section":
      arguments.callee(parent.getParent());
      break;

    case "set-header":
      var header = new SectionHeader(log.rank, log.title, log.headerId);
      if(parent === null){
	var auto_section = new Section("section", null, log.pageNo);
	auto_section.setHeader(header);
	arguments.callee(auto_section);
      } else if(!parent.hasHeader()){
	parent.setHeader(header);
	arguments.callee(parent);
      } else {
	var rank = log.rank;
	var parent_rank = parent.getRank();
	if(rank < parent_rank){ // higher rank
	  rollback();
	  arguments.callee(parent.getParent());
	} else if(log.rank == parent_rank){ // same rank
	  var next_section = new Section("section", parent, log.pageNo);
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  arguments.callee(next_section);
	} else { // lower rank
	  var child_section = new Section("section", parent, log.pageNo);
	  child_section.setHeader(header);
	  parent.addChild(child_section);
	  arguments.callee(child_section);
	}
      }
      break;
    }
  };

  return {
    parse : function(outline_context){
      __ptr__ = 0;
      __outline__ = outline_context;
      __root__ = new Section("section", null, 0);
      parse(__root__);
      return __root__;
    }
  };
})();

/*
  outline mapping
  ===============

  <ol>
    <li> root.title
      <ol>
        <li> root.child.title  </li>
	<li> root.child.next.title </li>
      </ol>
    </li>

    <li> root.next.title
      <ol>
        <li> root.next.child.title </li>
	<li> root.next.child.next.title </li>
      </ol>
   </li>
  </ol>
*/

var OutlineContextConverter = (function(){
  function OutlineContextConverter(){}

  // outline_context -> dom node
  OutlineContextConverter.prototype.convert = function(outline_context){
    var toc_context = new TocContext();
    var root_node = this.createRoot();
    var outline_tree = OutlineContextParser.parse(outline_context);
    return this._parse(toc_context, root_node, outline_tree);
  };
  
  OutlineContextConverter.prototype._parse = function(toc_ctx, parent, tree){
    if(tree === null){
      return parent;
    }
    var toc = this.createToc(toc_ctx, tree);
    var li = this.createChild(toc);
    var link = this.createLink(toc);
    if(link){
      link.onclick = this.createOnClickLink(toc);
      li.appendChild(link);
    }
    var page_no_item = this.createPageNoItem(toc);
    if(page_no_item){
      li.appendChild(page_no_item);
    }
    parent.appendChild(li);

    var child = tree.getChild();
    if(child){
      toc_ctx = toc_ctx.startRoot();
      var child_toc = this.createToc(toc_ctx, child);
      var ol = this.createRoot(child_toc);
      this._parse(toc_ctx, ol, child);
      li.appendChild(ol);
      toc_ctx = toc_ctx.endRoot();
    }
    var next = tree.getNext();
    if(next){
      this._parse(toc_ctx.stepNext(), parent, next);
    }
    return parent;
  };

  OutlineContextConverter.prototype.createOnClickLink = function(toc){
    return function(){
      return false;
    }
  };

  OutlineContextConverter.prototype.createToc = function(toc_ctx, tree){
    return {
      tocPos:toc_ctx.toString(),
      title:tree.getTitle(),
      pageNo:tree.getPageNo(),
      headerId:tree.getHeaderId()
    };
  };

  OutlineContextConverter.prototype.createRoot = function(toc){
    var root = document.createElement("ol");
    root.className = "nehan-toc-root";
    return root;
  };

  OutlineContextConverter.prototype.createChild = function(toc){
    var li = document.createElement("li");
    li.className = "nehan-toc-item";
    return li;
  };

  OutlineContextConverter.prototype.createLink = function(toc){
    var link = document.createElement("a");
    var title = toc.title.replace(/<a[^>]+>/gi, "").replace(/<\/a>/gi, "");
    link.href = "#" + toc.pageNo;
    link.innerHTML = title;
    link.className = "nehan-toc-link";
    link.id = Css.addNehanTocLinkPrefix(toc.tocId);
    return link;
  };

  OutlineContextConverter.prototype.createPageNoItem = function(toc){
    return null;
  };

  return OutlineContextConverter;
})();

var DocumentHeader = (function(){
  function DocumentHeader(){
    this.title = "";
    this.metas = [];
    this.links = [];
    this.scripts = [];
    this.styles = [];
  }

  DocumentHeader.prototype = {
    setTitle :function(title){
      this.title = title;
    },
    getTitle : function(){
      return this.title;
    },
    addLink : function(markup){
      this.links.push(markup);
    },
    getLinks : function(){
      return this.links;
    },
    addMeta : function(markup){
      this.metas.push(markup);
    },
    getMetas : function(){
      return this.metas;
    },
    getMetaByName : function(name){
      return List.find(this.metas, function(meta){
	return meta.getTagAttr("name") === name;
      });
    },
    getMetaContentByName : function(name){
      var meta = this.getMetaByName(name);
      return meta? meta.getTagAttr("content") : null;
    },
    addScript : function(markup){
      this.scripts.push(markup);
    },
    getScripts : function(){
      return this.scripts;
    },
    addStyle : function(markup){
      this.styles.push(markup);
    },
    getStyles : function(){
      return this.styles;
    }
  };

  return DocumentHeader;
})();


var DocumentContext = (function(){
  var __anchors__ = {};
  var __outlines__ = [];
  var __metas__ = {};

  return {
    getOutlineContext : function(markup_name){
      return List.filter(__outlines__, function(outline_context){
	return outline_context.getMarkupName() === markup_name;
      });
    },
    addOutlineContext : function(outline_context){
      __outlines__.push(outline_context);
    },
    addMetaValue : function(name, value){
      if(typeof __metas__[name] === "undefined"){
	__metas__[name] = [value];
	return;
      }
      __metas__[name].push(value);
    },
    getMetaValue : function(name){
      return __metas__[name] || null;
    },
    addAnchorPageNo : function(name, page_no){
      __anchors__[name] = page_no;
    },
    getAnchorPageNo : function(name){
      return __anchors__[name] || null;
    }
  }
})();


  


var BorderMap = (function(){
  function BorderMap(row_count, max_col){
    this.rowCount = row_count;
    this.maxCol = max_col;
    this.map = this._create(row_count, max_col);
  }

  BorderMap.prototype = {
    _create : function(row_count, max_col){
      var map = [];
      var make_row = function(max_col){
	var row = [];
	for(var i = 0; i < max_col; i++){
	  row.push({start:0, end:0, before:0, after:0});
	}
	return row;
      };
      for(var i = 0; i < row_count; i++){
	map.push(make_row(max_col));
      }
      return map;
    },
    get : function(row, col){
      return this.map[row][col];
    },
    getAsStyle : function(row, col){
      var border = this.get(row, col);
      var ret = {};
      for(var prop in border){
	ret[prop] = border[prop] + "px";
      }
      return ret;
    },
    set : function(row, col, border){
      for(var prop in border){
	this.setBorderProp(row, col, prop, border);
      }
    },
    collapse : function(){
      this._collapseCol();
      this._collapseRow();
    },
    _collapseCol : function(){
      for(var row = 0; row < this.rowCount; row++){
	for(var col = 0; col < this.maxCol - 1; col++){
	  var c1 = this.get(row, col);
	  var c2 = this.get(row, col+1);
	  if(c1.end && c2.start){
	    if(c1.end > c2.start){
	      c2.start = 0;
	    } else {
	      c1.end = 0;
	    }
	  }
	}
      }
    },
    _collapseRow : function(){
      for(var row = 0; row < this.rowCount - 1; row++){
	for(var col = 0; col < this.maxCol; col++){
	  var r1 = this.get(row, col);
	  var r2 = this.get(row+1, col);
	  if(r1.after && r2.before){
	    if(r1.after > r2.before){
	      r2.before = 0;
	    } else {
	      r1.after = 0;
	    }
	  }
	}
      }
    },
    setBorderProp : function(row, col, prop, border){
      var cur = this.get(row, col);
      if(border[prop] > cur[prop]){
	cur[prop] = border[prop];
      }
    },
    setRange : function(start_row, start_col, end_row, end_col, border){
      for(var row = start_row; row < end_row; row++){
	for(var col = start_col; col < end_col; col++){
	  if(row == start_row){
	    this.setBorderProp(row, col, "before", border);
	  }
	  if(row == end_row - 1){
	    this.setBorderProp(row, col, "after", border);
	  }
	  if(col == start_col){
	    this.setBorderProp(row, col, "start", border);
	  }
	  if(col == end_col - 1){
	    this.setBorderProp(row, col, "end", border);
	  }
	}
      }
    }
  };

  return BorderMap;
})();

var Collapse = (function(){
  var getBorder = function(box, markup){
    var border = markup.getCssAttr("border-width");
    if(border === null){
      return null;
    }
    var val = UnitSize.getEdgeSize(border, box.getFontSize(), box.getContentMeasure());
    if(typeof val == "number"){
      return {before:val, after:val, start:val, end:val};
    }
    return val;
  };

  var setBorderMap = function(map, box, markup){
    var border = getBorder(box, markup);
    if(border === null){
      return;
    }
    switch(markup.name){
    case "table":
      map.setRange(0, 0, map.rowCount, map.maxCol, border);
      break;
    case "thead": case "tbody": case "tfoot":
      var start_row = markup.row;
      var end_row = start_row + markup.tableChilds.length;
      map.setRange(start_row, 0, end_row, map.maxCol);
      break;
    case "tr":
      map.setRange(markup.row, 0, markup.row + 1, map.maxCol);
      break;
    case "td": case "th":
      map.set(markup.row, markup.col, border);
      break;
    }
  };

  var createBorderMap = function(map, box, markup){
    var callee = arguments.callee;
    setBorderMap(map, box, markup);
    List.iter(markup.tableChilds || [], function(child){
      callee(map, box, child);
    });
  };

  var updateBorder = function(map, markup){
    var callee = arguments.callee;
    switch(markup.name){
    case "table": case "thead": case "tbody": case "tfoot": case "tr":
      markup.setCssAttr("border-width", "0px");
      break;
    case "td": case "th":
      var border = map.getAsStyle(markup.row, markup.col);
      markup.setCssAttr("border-width", border);
      break;
    }
    List.iter(markup.tableChilds || [], function(child){
      callee(map, child);
    });
  };
  
  return {
    set : function(table_markup, box){
      var map = new BorderMap(table_markup.rowCount, table_markup.maxCol);
      createBorderMap(map, box, table_markup);
      map.collapse();
      updateBorder(map, table_markup);
    }
  };
})();


var TokenStream = (function(){
  function TokenStream(src){
    this.lexer = this._createLexer(src);
    this.tokens = [];
    this.pos = 0;
    this.eof = false;
    this._doBuffer();
  }

  TokenStream.prototype = {
    _createLexer : function(src){
      return new HtmlLexer(src);
    },
    getSrc : function(){
      return this.lexer.getSrc();
    },
    hasNext : function(){
      return (!this.eof || this.pos < this.tokens.length);
    },
    isEmpty : function(){
      return this.lexer.isEmpty();
    },
    isEmptyTokens : function(){
      return this.tokens.length === 0;
    },
    isHead : function(){
      return this.pos === 0;
    },
    look : function(index){
      return this.tokens[index] || null;
    },
    next : function(cnt){
      var count = cnt || 1;
      this.pos = this.pos + count;
    },
    prev : function(){
      this.pos = Math.max(0, this.pos - 1);
    },
    setPos : function(pos){
      this.pos = pos;
    },
    skipIf : function(fn){
      var token = this.peek();
      if(token && fn(token)){
	this.next();
      }
    },
    skipUntil : function(fn){
      while(this.hasNext()){
	var token = this.get();
	if(token === null){
	  break;
	}
	if(!fn(token)){
	  this.prev();
	  break;
	}
      }
    },
    rewind : function(){
      this.pos = 0;
    },
    peek : function(off){
      var offset = off || 0;
      var index = Math.max(0, this.pos + offset);
      if(index >= this.tokens.length){
	if(this.eof){
	  return null;
	}
	this._doBuffer();
      }
      var token = this.tokens[index];
      token.pos = index;
      return token;
    },
    get : function(){
      var token = this.peek();
      this.pos++;
      return token;
    },
    getPos : function(){
      return this.pos;
    },
    getAll : function(){
      while(!this.eof){
	this._doBuffer();
      }
      return this.tokens;
    },
    getAllIf : function(fn){
      return List.filter(this.getAll(), function(token){
	return fn(token);
      });
    },
    getTokenCount : function(){
      return this.tokens.length;
    },
    getSeekPos : function(){
      var token = this.tokens[this.pos];
      return token? token.spos : 0;
    },
    getSeekPercent : function(){
      var seek_pos = this.getSeekPos();
      return this.lexer.getSeekPercent(seek_pos);
    },
    getWhile : function(fn){
      var ret = [], token;
      while(this.hasNext()){
	token = this.get();
	if(token && fn(token)){
	  ret.push(token);
	} else {
	  this.prev();
	  break;
	}
      }
      return ret;
    },
    // iterate while fn(pos, token) returns true.
    // so loop is false break
    iterWhile : function(start_pos, fn){
      var ptr = (arguments.length == 1)? this.pos : start_pos;
      while(ptr >= 0){
	if(ptr >= this.tokens.length){
	  if(this.eof){
	    break;
	  }
	  this._doBuffer();
	  this.iterWhile(ptr, fn);
	  break;
	}
	if(!fn(ptr, this.tokens[ptr])){
	  break;
	}
	ptr++;
      }
    },
    // reverse iterate while fn(pos, token) returns true.
    // so loop is false break
    revIterWhile : function(start_pos, fn){
      var ptr = (arguments.length == 1)? this.pos : start_pos;
      while(ptr >= 0){
	if(!fn(ptr, this.tokens[ptr])){
	  break;
	}
	ptr--;
      }
    },
    findTextPrev : function(start_p){
      var start_pos = (typeof start_p != "undefined")? start_p : this.pos;
      var text = null;
      this.revIterWhile(start_pos - 1, function(pos, token){
	if(token){
	  if(!Token.isText(token)){
            // blocked by recursive inline element.
            // TODO: get tail element of recursive inline element.
            return false;
	  }
	  text = token;
	  return false; // break
	}
	return false; // break
      });
      return text;
    },
    findTextNext : function(start_p){
      var start_pos = (typeof start_p != "undefined")? start_p : this.pos;
      var text = null;
      this.iterWhile(start_pos + 1, function(pos, token){
	if(token){
	  if(!Token.isText(token)){
            // blocked by recursive inline element.
            // TODO: get tail element of recursive inline element.
            return false;
	  }
	  text = token;
	  return false; // break
	}
	return false; // break
      });
      return text;
    },
    _doBuffer : function(){
      var buff_len = Config.lexingBufferLen;
      /*
      var self = this;
      var push = function(token){
	self.tokens.push(token);
      };*/
      for(var i = 0; i < buff_len; i++){
	var token = this.lexer.get();
	if(token === null){
	  this.eof = true;
	  break;
	}
	this.tokens.push(token);
	//push(token);
      }
    }
  };

  return TokenStream;
})();


var FilteredTagStream = (function(){
  function FilteredTagStream(src, fn){
    TokenStream.call(this, src);
    var order = 0;
    this.tokens = this.getAllIf(function(token){
      if(Token.isText(token)){
	return false;
      }
      if(fn(token)){
	token.order = order++;
	return true;
      }
    });
  }
  Class.extend(FilteredTagStream, TokenStream);

  return FilteredTagStream;
})();

var DirectTokenStream = (function(){
  function DirectTokenStream(tokens){
    TokenStream.call(this, "");
    this.tokens = tokens;
  }
  Class.extend(DirectTokenStream, TokenStream);

  DirectTokenStream.prototype.isEmpty = function(){
    return this.tokens.length === 0;
  };

  return DirectTokenStream;
})();

var DocumentTagStream = (function(){
  function DocumentTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "!doctype" || name === "html");
    });
    if(this.isEmptyTokens()){
      this.tokens = [new Tag("html", src)];
    }
  }
  Class.extend(DocumentTagStream, FilteredTagStream);

  return DocumentTagStream;
})();

var HtmlTagStream = (function(){
  function HtmlTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "head" || name === "body");
    });
  }
  Class.extend(HtmlTagStream, FilteredTagStream);

  return HtmlTagStream;
})();


var HeadTagStream = (function(){
  function HeadTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "title" ||
	      name === "meta" ||
	      name === "link" ||
	      name === "style" ||
	      name === "script");
    });
  }
  Class.extend(HeadTagStream, FilteredTagStream);

  return HeadTagStream;
})();


var TableTagStream = (function(){
  function TableTagStream(markup){
    // TODO: caption not supported yet.
    FilteredTagStream.call(this, markup.getContent(), function(tag){
      var name = tag.getName();
      return (name === "thead" ||
	      name === "tbody" ||
	      name === "tfoot" ||
	      name === "tr");
    });
    this.markup = markup;
    this.markup.tableChilds = this.tokens = this._parseTokens(this.markup, this.tokens);
  }
  Class.extend(TableTagStream, FilteredTagStream);

  TableTagStream.prototype.getPartition = function(box){
    var self = this;
    var partition = new TablePartition();
    var measure = box.getContentMeasure();
    List.iter(this.tokens, function(row_group){
      var rows = row_group.tableChilds;
      List.iter(rows, function(row){
	var cols = row.tableChilds;
	var cols_count = cols.length;
	if(partition.getPartition(cols_count) === null){
	  var parts = self._parsePartition(cols, box);
	  partition.add(new Partition(parts, measure));
	}
      });
    });
    return partition;
  };

  TableTagStream.prototype._parseTokens = function(parent_markup, tokens){
    var theads = [], tfoots = [], tbodies = [], self = this;
    var thead = null, tbody = null, tfoot = null;
    var ctx = {row:0, col:0, maxCol:0};
    List.iter(tokens, function(token){
      if(Token.isTag(token)){
	switch(token.name){
	case "tr":
	  token.row = ctx.row;
	  token.tableChilds = self._parseCols(ctx, token);
	  ctx.row++;
	  tbodies.push(token);
	  break;
	case "thead":
	  thead = token;
	  theads = theads.concat(self._parseRows(ctx, token));
	  break;
	case "tbody":
	  tbody = token;
	  tbodies = tbodies.concat(self._parseRows(ctx, token));
	  break;
	case "tfoot":
	  tfoot = token;
	  tfoots = tfoots.concat(self._parseRows(ctx, token));
	  break;
	}
      }
    });

    var ret = [], nrow = 0;

    if(theads.length > 0){
      if(thead === null){
	thead = new Tag("<thead>");
      }
      thead.tableChilds = theads;
      thead.row = nrow;
      nrow += theads.length;
      ret.push(thead);
    }

    if(tbodies.length > 0){
      if(tbody === null){
	tbody = new Tag("<tbody>");
      }
      tbody.tableChilds = tbodies;
      tbody.row = nrow;
      nrow += tbodies.length;
      ret.push(tbody);
    }

    if(tfoots.length > 0){
      if(tfoot === null){
	tfoot = new Tag("<tfoot>");
      }
      tfoot.tableChilds = tfoots;
      tfoot.row = nrow;
      ret.push(tfoot);
    }

    this.markup.tableChilds = ret;
    this.markup.maxCol = ctx.maxCol;
    this.markup.rowCount = ctx.row;

    return ret;
  };

  TableTagStream.prototype._parsePartition = function(childs, box){
    return List.map(childs, function(child){
      var size = child.getTagAttr("measure") || child.getTagAttr("width") || 0;
      if(size){
	return UnitSize.getBoxSize(size, box.getFontSize(), box.getContentMeasure());
      }
      return 0;
    });
  };

  TableTagStream.prototype._parseRows = function(ctx, parent){
    var self = this;
    var rows = (new FilteredTagStream(parent.getContent(), function(tag){
      return tag.getName() === "tr";
    })).getAll();

    return List.map(rows, function(row){
      row.row = ctx.row;
      row.tableChilds = self._parseCols(ctx, row);
      ctx.row++;
      return row;
    });
  };

  TableTagStream.prototype._parseCols = function(ctx, parent){
    var cols = (new FilteredTagStream(parent.getContent(), function(tag){
      var name = tag.getName();
      return (name === "td" || name === "th");
    })).getAll();

    List.iteri(cols, function(i, col){
      col.row = ctx.row;
      col.col = i;
    });

    if(cols.length > ctx.maxCol){
      ctx.maxCol = cols.length;
    }
    return cols;
  };

  return TableTagStream;
})();



var ListTagStream = (function(){
  function ListTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      return tag.getName() === "li";
    });
  }
  Class.extend(ListTagStream, FilteredTagStream);

  return ListTagStream;
})();


var DefListTagStream = (function(){
  function DefListTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "dt" || name === "dd");
    });
  }
  Class.extend(DefListTagStream, FilteredTagStream);

  return DefListTagStream;
})();


var RubyTagStream = (function(){
  function RubyTagStream(markup_ruby){
    TokenStream.call(this, markup_ruby.getContent());
    this.getAll();
    this.tokens = this._parse(markup_ruby);
    this.rewind();
  }
  Class.extend(RubyTagStream, TokenStream);

  RubyTagStream.prototype._parse = function(markup_ruby){
    var ret = [];
    while(this.hasNext()){
      ret.push(this._parseRuby(markup_ruby));
    }
    return ret;
  };

  RubyTagStream.prototype._parseRuby = function(markup_ruby){
    var rbs = [];
    var rt = null;
    while(true){
      var token = this.get();
      if(token === null){
	break;
      }
      if(Token.isTag(token) && token.getName() === "rt"){
	rt = token;
	break;
      }
      if(Token.isText(token)){
	rbs.push(token);
      }
    }
    return new Ruby(rbs, rt);
  };

  return RubyTagStream;
})();


var DocumentGenerator = (function(){
  function DocumentGenerator(context){
    this.context = context;
    this.generator = this._createGenerator();
  }

  DocumentGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    getTitle : function(){
      return this.context.getTitle();
    },
    getMeta : function(name){
      return this.context.getMeta(name);
    },
    hasOutline : function(root_name){
      return this.generator.hasOutline(root_name);
    },
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineTree : function(root_name){
      return this.generator.getOutlineTree(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    getAnchors : function(){
      return this.generator.getAnchors();
    },
    getAnchorPageNo : function(anchor_name){
      return this.generator.getAnchorPageNo(anchor_name);
    },
    _createGenerator : function(){
      while(this.context.hasNextToken()){
	var tag = this.context.getNextToken();
	switch(tag.getName()){
	case "!doctype":
	  this.context.setDocumentType(tag);
	  break;
	case "html":
	  return this._createHtmlGenerator(tag);
	}
      }
      return this._createHtmlGenerator(
	new Tag("<html>", this.context.getStreamSrc())
      );
    },
    _createHtmlGenerator : function(html_tag){
      return new HtmlGenerator(
	this.context.createBlockRoot(
	  html_tag, new HtmlTagStream(html_tag.getContentRaw())
	)
      );
    }
  };

  return DocumentGenerator;
})();


var HtmlGenerator = (function(){
  function HtmlGenerator(context){
    this.context = context;
    this.generator = this._createGenerator();
  }

  HtmlGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    hasOutline : function(root_name){
      return this.generator.hasOutline(root_name);
    },
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineTree : function(root_name){
      return this.generator.getOutlineTree(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    getAnchors : function(){
      return this.generator.getAnchors();
    },
    getAnchorPageNo : function(anchor_name){
      return this.generator.getAnchorPageNo(anchor_name);
    },
    _createGenerator : function(){
      while(this.context.hasNextToken()){
	var tag = this.context.getNextToken();
	switch(tag.getName()){
	case "head":
	  this._parseHead(this.context.getHeader(), tag.getContentRaw());
	  break;
	case "body":
	  return this._createBodyGenerator(tag);
	}
      }
      return this._createBodyGenerator(
	new Tag("<body>", this.context.getStreamSrc())
      );
    },
    _createBodyGenerator : function(body_tag){
      return new BodyBlockTreeGenerator(
	this.context.createBlockRoot(
	  body_tag, new TokenStream(body_tag.getContentRaw())
	)
      );
    },
    _parseHead : function(header, content){
      var stream = new HeadTagStream(content);
      while(stream.hasNext()){
	var tag = stream.get();
	switch(tag.getName()){
	case "title":
	  header.setTitle(tag.getContentRaw());
	  break;
	case "meta":
	  header.addMeta(tag);
	  break;
	case "link":
	  header.addLink(tag);
	  break;
	case "style":
	  header.addStyle(tag);
	  break;
	case "script":
	  header.addScript(tag);
	  break;
	}
      }
    }
  };

  return HtmlGenerator;
})();


var EvalResult = (function(){
  function EvalResult(opts){
    Args.merge(this, {
      html:"",
      groupLength:1,
      seekPos:0,
      pageNo:0,
      charPos:0,
      charCount:0,
      percent:0
    }, opts);
  }

  EvalResult.prototype = {
    isGroup : function(){
      return this.groupLength > 1;
    },
    getPercent : function(){
      return this.percent;
    },
    getPageNo : function(){
      return this.pageNo;
    },
    getGroupCount : function(){
      return this.groupLength;
    },
    getPageCount : function(){
      if(this.isGroup() && this.html instanceof Array){
	return this.html.length;
      }
      return 1;
    },
    getHtml : function(pos){
      if(this.isGroup()){
	return this.html[pos] || "";
      }
      return this.html;
    }
  };

  return EvalResult;
})();

var PageEvaluator = (function(){
  function PageEvaluator(){
    this.blockEvaluator = new BlockTreeEvaluator();
  }

  PageEvaluator.prototype = {
    evaluate : function(box){
      return new EvalResult({
	html:this.blockEvaluator.evaluate(box),
	percent:box.percent,
	seekPos:box.seekPos,
	pageNo:box.pageNo,
	charPos:box.charPos,
	charCount:box.charCount
      });
    }
  };

  return PageEvaluator;
})();


var PageGroupEvaluator = (function(){
  function PageGroupEvaluator(){
    this.evaluator = new PageEvaluator();
  }

  PageGroupEvaluator.prototype = {
    evaluate : function(page_group){
      var self = this;
      var char_count = 0;
      var html = [];
      var results = List.map(page_group.getPages(), function(page){
	var ret = self.evaluator.evaluate(page);
	char_count += ret.charCount;
	html.push(ret.html);
	return ret;
      });
      var first = results[0];
      return new EvalResult({
	html:html,
	groupLength:page_group.getSize(),
	percent:first.percent,
	seekPos:first.seekPos,
	pageNo:first.pageNo,
	charPos:first.charPos,
	charCount:char_count
      });
    }
  };

  return PageGroupEvaluator;
})();

var PageStream = (function(){
  function PageStream(text){
    this.text = this._createSource(text);
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
    this.buffer = [];
    this._timeStart = null;
    this._timeElapsed = null;
    this._seekPageNo = 0;
    this._seekPercent = 0;
    this._seekPos = 0;
  }

  PageStream.prototype = {
    hasPage : function(page_no){
      return (typeof this.buffer[page_no] != "undefined");
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    hasOutline : function(root_name){
      return this.generator.hasOutline(root_name);
    },
    getNext : function(){
      if(!this.hasNext()){
	return null;
      }
      var cur_page_no = this._seekPageNo;
      if(!this.hasPage(cur_page_no)){
	var entry = this._yield();
	this._addBuffer(entry);
	this._seekPageNo++;
	this._seekPercent = entry.percent;
	this._seekPos = entry.seekPos;
      }
      return this.get(cur_page_no);
    },
    // int -> EvalResult
    get : function(page_no){
      var entry = this.buffer[page_no];
      if(entry instanceof EvalResult){ // already evaluated.
	return entry;
      }
      // if still not evaluated, eval and get EvalResult
      var result = this.evaluator.evaluate(entry);
      this.buffer[page_no] = result; // over write buffer entry by result.
      return result;
    },
    getPageCount : function(){
      return this.buffer.length;
    },
    getGroupPageNo : function(cell_page_no){
      return cell_page_no;
    },
    getOutlineTree : function(root_name){
      return this.generator.getOutlineTree(root_name || "body");
    },
    getOutlineNode : function(root_name, opt){
      var tree = this.getOutlineTree(root_name);
      var converter = new OutlineConverter(tree, opt || {});
      return converter.outputNode();
    },
    getAnchors : function(){
      return this.generator.getAnchors();
    },
    getAnchorPageNo : function(anchor_name){
      return this.generator.getAnchorPageNo(anchor_name);
    },
    getSeekPageResult : function(){
      return this.get(this._seekPageNo);
    },
    getSeekPageNo : function(){
      return this._seekPageNo;
    },
    getSeekPercent : function(){
      return this._seekPercent;
    },
    getSeekPos : function(){
      return this._seekPos;
    },
    setAnchor : function(name, page_no){
      this.generator.setAnchor(name, page_no);
    },
    getTimeElapsed : function(){
      return this._timeElapsed;
    },
    syncGet : function(){
      this._setTimeStart();
      while(this.generator.hasNext()){
	this.getNext();
      }
      return this._setTimeElapsed();
    },
    asyncGet : function(opt){
      Args.merge(this, {
	onComplete : function(time){},
	onProgress : function(self){},
	onError : function(self){}
      }, opt || {});
      this._setTimeStart();
      this._asyncGet(opt.wait || 0);
    },
    _yield : function(){
      return this.generator.yield();
    },
    _setTimeStart : function(){
      this._timeStart = (new Date()).getTime();
      return this._timeStart;
    },
    _setTimeElapsed : function(){
      this._timeElapsed = (new Date()).getTime() - this._timeStart;
      return this._timeElapsed;
    },
    _asyncGet : function(wait){
      if(!this.generator.hasNext()){
	var time = this._setTimeElapsed();
	this.onComplete(time);
	return;
      }
      var self = this;
      var entry = this._yield();
      this._addBuffer(entry);
      this.onProgress(this);
      this._seekPageNo++;
      this._seekPercent = entry.percent;
      this._seekPos = entry.seekPos;
      reqAnimationFrame(function(){
	self._asyncGet(wait);
      });
    },
    _addBuffer : function(entry){
      this.buffer.push(entry);
    },
    // common preprocessor
    _createSource : function(text){
      return text
	.replace(/(<\/[a-zA-Z0-9\-]+>)[\s]+</g, "$1<") // discard white-space between close tag and next tag.
	.replace(/\t/g, "") // discard TAB
	.replace(/<!--[\s\S]*?-->/g, "") // discard comment
	.replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
	.replace(/<rb>/gi, "") // discard rb
	.replace(/<\/rb>/gi, "") // discard /rb
	.replace(/<rt><\/rt>/gi, ""); // discard empty rt
    },
    _createGenerator : function(text){
      return new DocumentGenerator(
	new DocumentContext({
	  stream:new DocumentTagStream(text)
	})
      );
    },
    _createEvaluator : function(){
      return new PageEvaluator();
    }
  };

  return PageStream;
})();


var PageGroup = (function(){
  function PageGroup(size){
    this.trees = [];
    this.size = size;
  }

  PageGroup.prototype = {
    add : function(tree){
      if(this.isComplete()){
	throw "overflow";
      }
      this.trees.push(tree);
    },
    commit : function(){
      var first = this.getFirst();
      this.percent = first.percent;
      this.seekPos = first.seekPos;
      this.pageNo = first.pageNo;
    },
    isEmpty : function(){
      return this.trees.length === 0;
    },
    isComplete : function(){
      return this.trees.length >= this.size;
    },
    getFirst : function(){
      return this.trees[0];
    },
    getLast : function(){
      return this.trees[this.trees.length - 1];
    },
    get : function(pos){
      return this.trees[pos];
    },
    getPages : function(){
      return this.trees;
    },
    getSize : function(){
      return this.size;
    },
    getLength : function(){
      return this.trees.length;
    }
  };

  return PageGroup;
})();

var PageGroupStream = (function(){
  function PageGroupStream(text, group_size){
    PageStream.call(this, text);
    this.groupSize = group_size;
  }
  Class.extend(PageGroupStream, PageStream);
  
  PageGroupStream.prototype.getAnchorPageNo = function(anchor_name){
    var page_no = PageStream.prototype.getAnchorPageNo.call(this, anchor_name);
    return this.getGroupPageNo(page_no);
  };
  // anchors and outline positions of nehan are returned as 'cell_page_pos'.
  // for example, first page group(size=4) consists of [0,1,2,3] cell pages.
  // so cell page nums '0..3' are equivalent to group page no '0'.
  PageGroupStream.prototype.getGroupPageNo = function(cell_page_no){
    return Math.round(cell_page_no / this.groupSize);
  };

  PageGroupStream.prototype._yield = function(){
    var group = new PageGroup(this.groupSize);
    var add = function(page){
      group.add(page);
    };
    for(var i = 0; i < this.groupSize; i++){
      if(!this.generator.hasNext()){
	break;
      }
      add(this.generator.yield());
    }
    group.commit();
    return group;
  };

  PageGroupStream.prototype._createEvaluator = function(){
    return new PageGroupEvaluator();
  };

  return PageGroupStream;
})();


var Kerning = {
  set : function(cur_char, prev_text, next_text){
    if(cur_char.isKakkoStart()){
      this._setKerningStart(cur_char, prev_text);
    } else if(cur_char.isKakkoEnd() || cur_char.isKutenTouten()){
      this._setKerningEnd(cur_char, next_text);
    }
  },
  _setKerningStart : function(cur_char, prev_text){
    var space_rate = this._getTextSpaceStart(cur_char, prev_text);
    if(space_rate > 0){
      cur_char.spaceRateStart = space_rate;
    }
  },
  _setKerningEnd : function(cur_char, next_text){
    var space_rate = this._getTextSpaceEnd(cur_char, next_text);
    if(space_rate > 0){
      cur_char.spaceRateEnd = space_rate;
    }
  },
  _getTextSpaceStart : function(cur_char, prev_text){
    if(prev_text === null){
      return 0.5;
    }
    if(Token.isChar(prev_text) && prev_text.isKakkoStart()){
      return 0;
    }
    return 0.5;
  },
  _getTextSpaceEnd : function(cur_char, next_text){
    if(next_text === null){
      return 0.5;
    }
    if(Token.isChar(next_text) && (next_text.isKakkoEnd() || next_text.isKutenTouten())){
      return 0;
    }
    return 0.5;
  }
};

var LogicalFloat = (function(){
  function LogicalFloat(value){
    this.value = value || "none";
  }

  LogicalFloat.prototype = {
    getCss : function(flow){
      var css = {};
      if(flow.isTextHorizontal()){
	if(this.isStart()){
	  css["float"] = "left";
	} else if(this.isEnd()){
	  css["float"] = "right";
	}
      }
      return css;
    },
    isStart : function(){
      return this.value === "start";
    },
    isEnd : function(){
      return this.value === "end";
    },
    isNone : function(){
      return this.value === "none";
    }
  };

  return LogicalFloat;
})();


var LogicalFloats = {
  start:(new LogicalFloat("start")),
  end:(new LogicalFloat("end")),
  none:(new LogicalFloat("none")),
  get : function(name){
    name = name || "none";
    return this[name];
  }
};

var TextAlign = (function(){
  function TextAlign(value){
    this.value = value || "start";
  }

  TextAlign.prototype = {
    isStart : function(){
      return this.value === "start";
    },
    isEnd : function(){
      return this.value === "end";
    },
    isCenter : function(){
      return this.value === "center";
    },
    getCss : function(line){
      var css = {};
      if(this.value === "center"){
      }
      return css;
    }
  };

  return TextAlign;
})();


var StyleContext = (function(){

  // parent : parent style context
  function StyleContext(markup, parent){
    this.markup = this._inheritMarkup(markup, parent);
    this.parent = parent;
    this.display = this._loadDisplay(markup); // required
    this.flow = this._loadFlow(markup, parent); // required
    this.boxSizing = this._loadBoxSizing(markup); // required
    this.childs = []; // children for this style, updated by _appendChild
    var color = this._loadColor(markup, parent);
    if(color){
      this.color = color;
    }
    var font = this._loadFont(markup, parent);
    if(font){
      this.font = font;
    }
    var position = this._loadPosition(markup, parent);
    if(position){
      this.position = position;
    }
    var edge = this._loadEdge(markup, this.flow, this.font);
    if(edge){
      this.edge = edge;
    }
    var line_rate = this._loadLineRate(markup, parent);
    if(line_rate){
      this.lineRate = line_rate;
    }
    var text_align = this._loadTextAlign(markup, parent);
    if(text_align){
      this.textAlign = text_align;
    }
    var text_empha = this._loadTextEmpha(markup, parent);
    if(text_empha){
      this.textEmpha = text_empha;
    }
    var pushed = this._loadPushedAttr(markup);
    if(pushed){
      this.pushed = true;
    }
    var pulled = this._loadPulledAttr(markup);
    if(pulled){
      this.pulled = true;
    }
    var logical_float = this._loadLogicalFloat(markup);
    if(logical_float){
      this.logicalFloat = logical_float;
    }
    var list_style = this._loadListStyle(markup);
    if(list_style){
      this.listStyle = list_style;
    }
    if(this.parent){
      this.parent._appendChild(this);
    }
  }

  StyleContext.prototype = {
    clone : function(css){
      // no one can clone root style.
      if(this.parent === null){
	return this.createChild("div", css);
      }
      var tag = this.markup.clone();
      tag.setCssAttrs(css || {}); // set dynamic styles
      return new StyleContext(tag, this.parent || null);
    },
    // inherit style with tag_name and css(optional).
    createChild : function(tag_name, css){
      var tag = new Tag("<" + tag_name + ">");
      tag.setCssAttrs(css || {}); // set dynamic styles
      var style = new StyleContext(tag, this);

      // save 'original' parent to child-style, because sometimes it is required by 'grand-child'.
      // for example, in following code, <li-body> is anonymous block,
      // and parent style of <li-body> is <li>.style, and parent of <ul2> is <li-body>.style.
      //
      // <ul>
      //   <li>
      //     <li-mark>1.</li-mark>
      //     <li-body><ul2>...</ul2></li-body>
      //   </li>
      // </ul>
      // 
      // <li-body> is created by <li>.style.createChild("div"), so not have original parent style(<ul>.style) as it's parent style.
      // but <ul>.style is required by <ul2> to get it's accurate content-size.
      // so child anonymous style(<li-mark>, <li-body> in this case) needs to save it's 'original' parent(<ul>.style in this case) as 'contextParent'
      // in addition to <li>.style.
      style.contextParent = this.parent; 
      return style;
    },
    createBlock : function(opt){
      var measure = opt.measure || this.getContentMeasure();
      var extent = this.parent? (opt.extent || this.getContentExtent()) : this.getContentExtent();
      var box_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-block", "nehan-" + this.getMarkupName()];
      var box = new Box(box_size, this);
      box.display = "block";
      box.elements = opt.elements || [];
      box.classes = classes;
      if(this.edge){
	box.edge = this.edge.clone();
      }
      if(this.logicalFloat){
	box.logicalFloat = this.logicalFloat;
      }
      return box;
    },
    createLine : function(opt){
      var elements = opt.elements || [];
      var child_lines = this._filterChildLines(elements);
      var max_font_size = this._computeMaxLineFontSize(child_lines);
      var max_extent = this._computeMaxLineExtent(child_lines, max_font_size);
      var measure = opt.measure || this.getContentMeasure();
      var extent = this.isRootLine()? this._computeRootLineExtent(child_lines, max_font_size, max_extent) : this.getAutoLineExtent();
      var box_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()];
      var line = new Box(box_size, this);
      line.style = this;
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = opt.elements || [];
      line.classes = this.isRootLine()? classes : classes.concat("nehan-" + this.markup.getName());

      // backup other line data. mainly required to restore inline-context.
      if(this.isRootLine()){
	line.br = opt.br || false;
	line.inlineMeasure = opt.inlineMeasure || measure;
	line.texts = opt.texts || [];

	// if vertical line, needs some position fix.
	if(this.isTextVertical()){
	  this._centerizeVertRootLine(child_lines, max_font_size, max_extent);
	}
      }
      return line;
    },
    isBlock : function(){
      return this.display === "block";
    },
    isRoot : function(){
      return this.parent === null;
    },
    isChildBlock : function(){
      return this.isBlock() && !this.isRoot();
    },
    isInline : function(){
      return this.display === "inline";
    },
    isRootLine : function(){
      return this.display === "block";
    },
    isHeader : function(){
      return this.markup.isHeaderTag();
    },
    isFloatStart : function(){
      return this.logicalFloat && this.logicalFloat.isStart();
    },
    isFloatEnd : function(){
      return this.logicalFloat && this.logicalFloat.isEnd();
    },
    isFloated : function(){
      return this.isFloatStart() || this.isFloatEnd();
    },
    isParallel : function(){
      return this.display === "list-item";
    },
    isPushed : function(){
      return this.pushed || false;
    },
    isPulled : function(){
      return this.pulled || false;
    },
    isTextEmphaEnable : function(){
      return this.textEmpha && this.textEmpha.isEnable();
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    isFirstChild : function(){
      return this.parent? this.parent.getNthChild(0) === this : false;
    },
    getMarkupName : function(){
      return this.markup.getName();
    },
    getMarkupContent : function(){
      return this.markup.getContent();
    },
    getMarkupPos : function(){
      return this.markup.pos;
    },
    getHeaderRank : function(){
      return this.markup.getHeaderRank();
    },
    getFontSize : function(){
      return this.font.size;
    },
    getFontFamily : function(){
      return this.font.family || this.flow.isTextVertical()? Layout.vertFontFamily : Layout.horiFontFamily;
    },
    getLetterSpacing : function(){
      return this.letterSpacing || 0;
    },
    getColor : function(){
      return this.color || Layout.fontColor;
    },
    getRubyRate : function(){
      return Layout.getRubyRate();
    },
    getLineRate : function(){
      return this.lineRate || Layout.lineRate || 2;
    },
    getEmphaLineExtent : function(){
      return this.getFontSize() * 2;
    },
    getTextLineExtent : function(){
      return this.getFontSize() * this.getLineRate();
    },
    getAutoLineExtent : function(){
      return this.isTextEmphaEnable()? this.getEmphaLineExtent() : this.getTextLineExtent();
    },
    getEdgeMeasure : function(flow){
      return this.edge? this.edge.getMeasureSize(flow || this.flow) : 0;
    },
    getEdgeExtent : function(flow){
      return this.edge? this.edge.getExtentSize(flow || this.flow) : 0;
    },
    // same as getEdgeMeasure, but if contextParent exists, obtain from it.
    getContextEdgeMeasure : function(flow){
      return this.contextParent? this.contextParent.getEdgeMeasure(flow) : this.getEdgeMeasure(flow);
    },
    // same as getEdgeExtent, but if contextParent exists, obtain from it.
    getContextEdgeExtent : function(flow){
      return this.contextParent? this.contextParent.getEdgeExtent(flow) : this.getEdgeExtent(flow);
    },
    getMarkerHtml : function(order){
      return this.listStyle? this.listStyle.getMarkerHtml(order) : "";
    },
    getChildCount : function(){
      return this.childs.length;
    },
    getChildIndex : function(){
      return this.parent? this.parent.findChildIndex(this) : 0;
    },
    getChildIndexOfType : function(){
      return this.parent? this.parent.findChildIndexOfType(this) : 0;
    },
    getNthChild : function(nth){
      return this.childs[nth] || null;
    },
    findChildIndex : function(style){
      return List.indexOf(this.childs, function(child){
	return child === style;
      });
    },
    findChildsOfType : function(style){
      var name = style.getMarkupName();
      return List.filter(this.childs, function(child){
	return child.getMarkupName() === name;
      });
    },
    findChildIndexOfType : function(style){
      return List.indexOf(this.findChildsOfType(style), function(child){
	return child === style;
      });
    },
    getOuterSize : function(){
      var measure = this.getOuterMeasure();
      var extent = this.getOuterExtent();
      return this.flow.getBoxSize(measure, extent);
    },
    getOuterMeasure : function(){
      return this.getStaticMeasure() || this.getLogicalMaxMeasure();
    },
    getOuterExtent : function(){
      return this.getStaticExtent() || this.getLogicalMaxExtent();
    },
    getStaticMeasure : function(){
      var max_size = this.getLogicalMaxMeasure(); // this value is required when static size is set by '%' value.
      var static_size = this.markup.getAttr(this.flow.getPropMeasure()) || this.markup.getCssAttr("measure");
      return static_size? Math.min(UnitSize.getBoxSize(static_size, this.font.size, max_size), max_size) : null;
    },
    getStaticExtent : function(){
      var max_size = this.getLogicalMaxExtent(); // this value is required when static size is set by '%' value.
      var static_size = this.markup.getAttr(this.flow.getPropExtent()) || this.markup.getCssAttr("extent");
      return static_size? Math.min(UnitSize.getBoxSize(static_size, this.font.size, max_size), max_size) : null;
    },
    getLogicalMaxMeasure : function(){
      var max_size = this.parent? this.parent.getContentMeasure(this.flow) : Layout[this.flow.getPropMeasure()];
      return max_size;
    },
    getLogicalMaxExtent : function(){
      var max_size = this.parent? this.parent.getContentExtent(this.flow) : Layout[this.flow.getPropExtent()];
      return (this.display === "block")? max_size : this.font.size;
    },
    // 'after' loading all properties, we can compute boundary box size.
    getContentSize : function(){
      var measure = this.getContentMeasure();
      var extent = this.getContentExtent();
      return this.flow.getBoxSize(measure, extent);
    },
    getContentMeasure : function(){
      return this.getOuterMeasure() - this.getEdgeContentMeasure();
    },
    getContentExtent : function(){
      return this.getOuterExtent() - this.getEdgeContentExtent();
    },
    getEdgeContentMeasure : function(){
      if(typeof this.edge === "undefined"){
	return 0;
      }
      switch(this.boxSizing){
      case "content-box":
	return 0;
      case "border-box":
	return this.edge.padding.getMeasureSize(this.flow) + this.edge.border.getMeasureSize(this.flow);
      case "padding-box":
	return this.edge.padding.getMeasureSize(this.flow);
      case "margin-box": default:
	return this.edge.getMeasureSize(this.flow);
      }
    },
    getEdgeContentExtent : function(){
      if(typeof this.edge === "undefined"){
	return 0;
      }
      switch(this.boxSizing){
      case "content-box":
	return 0;
      case "border-box":
	return this.edge.padding.getExtentSize(this.flow) + this.edge.border.getExtentSize(this.flow);
      case "padding-box":
	return this.edge.padding.getExtentSize(this.flow);
      case "margin-box": default:
	return this.edge.getExtentSize(this.flow);
      }
    },
    getCssInline : function(){
      var css = {};
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.background){
	Args.copy(css, this.background.getCss());
      }
      // top level line need to follow parent blockflow.
      if(this.parent && this.parent.display === "block"){
	Args.copy(css, this.flow.getCss());
      }
      if(this.edge && !this.isRootLine()){
	Args.copy(css, this.edge.getCss());
      }
      if(this.isRootLine()){
	Args.copy(css, this.flow.getCss());
      }
      if(this.flow.isTextVertical()){
	css["line-height"] = "1em";
	if(Env.isIphoneFamily){
	  css["letter-spacing"] = "-0.001em";
	}
	if(this.markup.getName() !== "ruby"){
	  css["margin-left"] = css["margin-right"] = "auto";
	  css["text-align"] = "center";
	}
      }
      return css;
    },
    getCssBlock : function(){
      var css = {};
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.background){
	Args.copy(css, this.background.getCss(this.flow));
      }
      if(this.letterSpacing && !this.flow.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      css.display = "block";
      if(this.logicalFloat){
	Args.copy(css, this.logicalFloat.getCss(this.flow));
      }
      css.overflow = "hidden"; // to avoid margin collapsing
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      return css;
    },
    _inheritMarkup : function(markup, parent){
      var parent_markup = parent? parent.markup : null;
      markup = markup.inherit(parent_markup);
      var onload = markup.getCssAttr("onload");
      if(onload){
	markup.setCssAttrs(onload(markup) || {});
      }
      var nth_child = markup.getCssAttr("nth-child");
      if(nth_child){
	markup.setCssAttrs(nth_child(this.getChildIndex(), markup) || {});
      }
      var nth_of_type = markup.getCssAttr("nth-of-type");
      if(nth_of_type){
	markup.setCssAttrs(nth_of_type(this.getChildIndexOfType(), markup) || {});
      }
      return markup;
    },
    _appendChild : function(child_style){
      this.childs.push(child_style);
    },
    _filterChildLines : function(elements){
      return List.filter(elements, function(element){
	return element.style? true : false;
      });
    },
    _computeRootLineExtent : function(child_lines, max_font_size, max_extent){
      if(child_lines.length === 0){
	return this.getAutoLineExtent();
      }
      return this.isTextVertical()? max_extent : Math.floor(max_font_size * this.getLineRate());
    },
    _computeMaxLineFontSize : function(child_lines){
      return List.fold(child_lines, this.getFontSize(), function(ret, line){
	return Math.max(ret, line.style.getFontSize());
      });
    },
    // get inline max_extent size after centerizing each font.
    _computeMaxLineExtent : function(child_lines, max_font_size){
      var flow = this.flow;
      return List.fold(child_lines, this.getAutoLineExtent(), function(ret, line){
	var font_size = line.style.getFontSize();
	var font_center_offset = Math.floor((max_font_size - font_size) / 2);
	return Math.max(ret, line.size.getExtent(flow) + font_center_offset);
      });
    },
    _centerizeVertRootLine : function(child_lines, max_font_size, max_extent){
      var flow = this.flow;
      var text_center = Math.floor(max_extent / 2);

      List.iter(child_lines, function(line){
	var font_size = line.style.getFontSize();
	var text_center_offset = text_center - Math.floor(font_size / 2);
	if(text_center_offset > 0){
	  line.edge = line.style.edge? line.style.edge.clone() : new BoxEdge(); // set line.edge(not line.style.edge) to overwrite padding temporally.
	  line.edge.padding.setAfter(flow, text_center_offset); // set new edge(use line.edge not line.style.edge)
	  line.size.setExtent(flow, max_extent - text_center_offset); // set new size
	  Args.copy(line.css, line.edge.getCss()); // overwrite edge
	  Args.copy(line.css, line.size.getCss()); // overwrite size
	}
      });
    },
    _loadDisplay : function(markup){
      return markup.getCssAttr("display", "inline");
    },
    _loadFlow : function(markup, parent){
      var value = markup.getCssAttr("flow", "inherit");
      var parent_flow = parent? parent.flow : Layout.getStdBoxFlow();
      if(value === "inherit"){
	return parent_flow;
      }
      if(value === "flip"){
	return parent_flow.getFlipFlow();
      }
      return BoxFlows.getByName(value);
    },
    _loadPosition : function(markup){
      var value = markup.getCssAttr("position", "relative");
      return new BoxPosition(value, {
	top: markup.getCssAttr("top", "auto"),
	left: markup.getCssAttr("left", "auto"),
	right: markup.getCssAttr("right", "auto"),
	bottom: markup.getCssAttr("bottom", "auto")
      });
    },
    _loadColor : function(markup){
      var value = markup.getCssAttr("color", "inherit");
      if(value !== "inherit"){
	return new Color(value);
      }
    },
    _loadFont : function(markup, parent){
      var parent_font_size = parent? parent.font.size : Layout.fontSize;
      var font = new Font(parent_font_size);
      var font_size = markup.getCssAttr("font-size", "inherit");
      if(font_size !== "inherit"){
	font.size = UnitSize.getFontSize(font_size, parent_font_size);
      }
      var font_family = markup.getCssAttr("font-family", "inherit");
      if(font_family !== "inherit"){
	font.family = font_family;
      }
      var font_weight = markup.getCssAttr("font-weight", "inherit");
      if(font_weight !== "inherit"){
	font.weight = font_weight;
      }
      var font_style = markup.getCssAttr("font-style", "inherit");
      if(font_style !== "inherit"){
	font.style = font_style;
      }
      return font;
    },
    _loadBoxSizing : function(markup){
      return markup.getCssAttr("box-sizing", "margin-box");
    },
    _loadEdge : function(markup, flow, font){
      var padding = markup.getCssAttr("padding");
      var margin = markup.getCssAttr("margin");
      var border_width = markup.getCssAttr("border-width");
      if(padding === null && margin === null && border_width === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	edge.padding.setSize(flow, UnitSize.getEdgeSize(padding, font.size));
      }
      if(margin){
	edge.margin.setSize(flow, UnitSize.getEdgeSize(margin, font.size));
      }
      if(border_width){
	edge.border.setSize(flow, UnitSize.getEdgeSize(border_width, font.size));
      }
      var border_radius = markup.getCssAttr("border-radius");
      if(border_radius){
	edge.setBorderRadius(flow, UnitSize.getCornerSize(border_radius, font.size));
      }
      var border_color = markup.getCssAttr("border-color");
      if(border_color){
	edge.setBorderColor(flow, border_color);
      }
      var border_style = markup.getCssAttr("border-style");
      if(border_style){
	edge.setBorderStyle(flow, border_style);
      }
      return edge;
    },
    _loadLineRate : function(markup, parent){
      var value = markup.getCssAttr("line-rate");
      var parent_line_rate = parent? parent.lineRate : Layout.lineRate;
      return (value === "inherit")? parent_line_rate : parseFloat(value);
    },
    _loadTextAlign : function(markup, parent){
      var value = markup.getCssAttr("text-align", "inherit");
      var parent_text_align = parent? parent.textAlign : "start";
      return (value === "inherit")? parent_text_align : new TextAlign(value);
    },
    _loadTextEmpha : function(markup, parent){
      var parent_color = parent? parent.getColor() : Layout.fontColor;
      var empha_style = markup.getCssAttr("text-emphasis-style", "none");
      if(empha_style === "none" || empha_style === "inherit"){
	return null;
      }
      var empha_pos = markup.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = markup.getCssAttr("text-emphasis-color", parent_color);
      return new TextEmpha({
	style:new TextEmphaStyle(empha_style),
	pos:new TextEmphaPos(empha_pos),
	color:new Color(empha_color)
      });
    },
    _loadTextEmphaStyle : function(markup, parent){
      var value = markup.getCssAttr("text-emphasis-style", "inherit");
      return (value !== "inherit")? new TextEmphaStyle(value) : null;
    },
    _loadTextEmphaPos : function(markup, parent){
      return markup.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
    },
    _loadTextEmphaColor : function(markup, parent, color){
      return markup.getCssAttr("text-emphasis-color", color.getValue());
    },
    _loadLogicalFloat : function(markup){
      var name = markup.getCssAttr("float", "none");
      if(name === "none"){
	return null;
      }
      return LogicalFloats.get(name);
    },
    _loadListStyle : function(markup){
      var list_style_type = markup.getCssAttr("list-style-type", "none");
      if(list_style_type === "none"){
	return null;
      }
      return new ListStyle({
	type:list_style_type,
	position:markup.getCssAttr("list-style-position", "outside"),
	image:markup.getCssAttr("list-style-image", "none"),
	format:markup.getCssAttr("list-style-format")
      });
    },
    _loadLetterSpacing : function(markup, parent, font){
      var letter_spacing = markup.getCssAttr("letter-spacing");
      if(letter_spacing){
	return UnitSize.getUnitSize(letter_spacing, font.size);
      }
    },
    _loadBackground : function(markup, parent){
      var background = new Background();
      var bg_color = markup.getCssAttr("background-color");
      if(bg_color){
	background.color = new Color(bg_color);
      }
      var bg_image = markup.getCssAttr("background-image");
      if(bg_image){
	background.image = bg_image;
      }
      var bg_pos = markup.getCssAttr("background-position");
      if(bg_pos){
	background.pos = new BackgroundPos2d(
	  new BackgroundPos(bg_pos.inline, bg_pos.offset),
	  new BackgroundPos(bg_pos.block, bg_pos.offset)
	);
      }
      var bg_repeat = markup.getCssAttr("background-repeat");
      if(bg_repeat){
	background.repeat = new BackgroundRepeat2d(
	  new BackgroundRepeat(bg_repeat.inline),
	  new BackgroundRepeat(bg_repeat.block)
	);
      }
    },
    _loadPushedAttr : function(markup){
      return markup.getCssAttr("pushed") !== null;
    },
    _loadPulledAttr : function(markup){
      return markup.getCssAttr("pulled") !== null;
    }
  };

  return StyleContext;
})();


var LayoutContext = (function(){
  function LayoutContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  // extra document information
  var __header_id__ = 0;
  var __anchors__ = {};

  LayoutContext.prototype = {
    // block-level
    isBlockSpaceLeft : function(){
      return this.block.isSpaceLeft();
    },
    hasBlockSpaceFor : function(extent){
      return this.block.hasSpaceFor(extent);
    },
    addBlockElement : function(element, extent){
      this.block.addElement(element, extent);
    },
    pushBlockElement : function(element, extent){
      this.block.pushElement(element, extent);
    },
    pullBlockElement : function(element, extent){
      this.block.pullElement(element, extent);
    },
    getBlockElements : function(){
      return this.block.getElements();
    },
    getBlockCurExtent : function(){
      return this.block.getCurExtent();
    },
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    // inline-level
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    isInlineSpaceLeft : function(){
      return this.inline.isSpaceLeft();
    },
    hasInlineSpaceFor : function(measure){
      return this.inline.hasSpaceFor(measure);
    },
    hasBr : function(){
      return this.inline.hasBr();
    },
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    addInlineElement : function(element, measure){
      this.inline.addElement(element, measure);
    },
    getInlineLastText : function(){
      return this.inline.getLastText();
    },
    getInlineTexts : function(){
      return this.inline.getTexts();
    },
    getInlineElements : function(){
      return this.inline.getElements();
    },
    getInlineCurMeasure : function(){
      return this.inline.getCurMeasure();
    },
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    justify : function(head_char){
      return this.inline.justify(head_char);
    }
  };

  return LayoutContext;
})();


var BlockContext = (function(){
  function BlockContext(max_extent){
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
  }

  BlockContext.prototype = {
    isSpaceLeft : function(){
      return this.getRestExtent() > 0;
    },
    hasSpaceFor : function(extent){
      return this.getRestExtent() >= extent;
    },
    addElement : function(element, extent){
      this.elements.push(element);
      this.curExtent += extent;
    },
    pushElement : function(element, extent){
      this.pushedElements.push(element);
      this.curExtent += extent;
    },
    pullElement : function(element, extent){
      this.pulledElements.unshift(element);
      this.curExtent += extent;
    },
    getCurExtent : function(){
      return this.curExtent;
    },
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
    },
    getMaxExtent : function(){
      return this.maxExtent;
    },
    getElements : function(){
      return this.pulledElements
	.concat(this.elements)
	.concat(this.pushedElements);
    }
  };

  return BlockContext;
})();


var InlineContext = (function(){
  function InlineContext(max_measure){
    this.charCount = 0;
    this.curMeasure = 0;
    this.maxMeasure = max_measure; // const
    this.elements = [];
    this.texts = [];
    this.br = false;
  }

  InlineContext.prototype = {
    isEmpty : function(){
      return !this.br && this.elements.length === 0;
    },
    isSpaceLeft : function(){
      return this.getRestMeasure() > 0;
    },
    hasSpaceFor : function(measure){
      return this.getRestMeasure() >= measure;
    },
    hasBr : function(){
      return this.br;
    },
    setLineBreak : function(status){
      this.br = status;
    },
    addElement : function(element, measure){
      this.elements.push(element);
      if(Token.isText(element)){
	this.texts.push(element);
	if(element.getCharCount){
	  this.charCount += element.getCharCount();
	}
      }
      this.curMeasure += measure;
    },
    getLastText : function(){
      return List.last(this.texts);
    },
    getTexts : function(){
      return this.texts;
    },
    getElements : function(){
      return this.elements;
    },
    getCurMeasure : function(){
      return this.curMeasure;
    },
    getRestMeasure : function(){
      return this.maxMeasure - this.curMeasure;
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getLastChar : function(){
      return List.last(this.texts);
    },
    justify : function(head){
      var last = this.texts.length - 1;
      var ptr = last;
      while(ptr >= 0){
	var tail = this.texts[ptr];
	if(head && head.isHeadNg && head.isHeadNg() || tail.isTailNg && tail.isTailNg()){
	  head = tail;
	  ptr--;
	} else {
	  break;
	}
      }
      // if ptr moved, justification is executed.
      if(0 <= ptr && ptr < last){
	// disable text after new tail pos.
	this.elements = List.filter(this.elements, function(element){
	  return element.pos? (element.pos <= tail.pos) : true;
	});
	return tail; // return new tail
      }
      return null; // justify failed or not required.
    }
  };

  return InlineContext;
})();


var LayoutGenerator = (function(){
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._childLayout = null;
    this._cachedElements = [];
    this._terminate = false; // used to force terminate generator.
  }

  LayoutGenerator.prototype.yield = function(parent_context){
    var context = parent_context? this._createChildContext(parent_context) : this._createStartContext();
    return this._yield(context);
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  LayoutGenerator.prototype.cloneStyle = function(opt){
    var old_style = this.style;
    var new_style = this.style.clone(opt);
    this.style = new_style;

    // if child layout shared the same style, rewrite it too.
    if(this._childLayout && this._childLayout.style === old_style){
      this._childLayout.style = new_style;
    }
  };

  LayoutGenerator.prototype.setTerminate = function(status){
    this._terminate = status;
  };

  LayoutGenerator.prototype.setChildLayout = function(generator){
    this._childLayout = generator;
  };

  LayoutGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    if(this.hasChildLayout()){
      return true;
    }
    return this.stream? this.stream.hasNext() : false;
  };

  LayoutGenerator.prototype.hasChildLayout = function(){
    if(this._childLayout && this._childLayout.hasNext()){
      return true;
    }
    return false;
  };

  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._childLayout.yield(context);
    return next;
  };

  LayoutGenerator.prototype.peekLastCache = function(){
    return List.last(this._cachedElements);
  };

  LayoutGenerator.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      if(cache_count >= Config.maxRollbackCount){
	console.error("too many cache count(%d), force terminate", cache_count);
	this.setTerminate(true); // this error sometimes causes infinite loop, so force terminate generator.
	return;
      }
    }
    element.cacheCount = cache_count + 1;
    this._cachedElements.push(element);
  };

  LayoutGenerator.prototype.popCache = function(){
    var cache = this._cachedElements.pop();
    return cache;
  };

  LayoutGenerator.prototype.clearCache = function(){
    this._cachedElements = [];
  };

  LayoutGenerator.prototype._createStartContext = function(){
    return new LayoutContext(
      new BlockContext(this.style.getContentExtent()),
      new InlineContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createChildContext = function(context){
    return new LayoutContext(
      new BlockContext(context.getBlockRestExtent() - this.style.getContextEdgeExtent()),
      new InlineContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createStream = function(tag){
    switch(tag.getName()){
    case "ruby": return new RubyTagStream(tag);
    default: return new TokenStream(tag.getContent());
    } 
  };

  return LayoutGenerator;
})();


var BlockGenerator = (function(){
  function BlockGenerator(style, stream, outline_context){
    LayoutGenerator.call(this, style, stream);
    this.outlineContext = outline_context;
  }
  Class.extend(BlockGenerator, LayoutGenerator);

  var get_line_start_pos = function(line){
    var head = line.elements[0];
    return (head instanceof Box)? head.style.getMarkupPos() : head.pos;
  };

  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline, and measure size varies, reget line if need.
    if(this.hasChildLayout() && cache.display === "inline"){
      if(cache.getBoxMeasure(this.style.flow) <= this.style.getContentMeasure() && cache.br){
	return cache;
      }
      this._childLayout.stream.setPos(get_line_start_pos(cache)); // rewind stream to the head of line.
      this._childLayout.clearCache(); // stream rewinded, so cache must be destroyed.
      return this.yieldChildLayout(context);
    }
    return cache;
  };

  BlockGenerator.prototype._yield = function(context){
    if(!context.isBlockSpaceLeft()){
      return null;
    }
    while(true){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var extent = element.getBoxExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, extent);
      if(!context.isBlockSpaceLeft()){
	break;
      }
    }
    return this._createBlock(context);
  };

  BlockGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }
    
    if(this.hasChildLayout()){
      return this.yieldChildLayout(context);
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // if tag token, inherit style
    var child_style = (token instanceof Tag)? new StyleContext(token, this.style) : this.style;

    // inline text or inline tag
    // stream push back, and delegate current style and stream to InlineGenerator
    if(Token.isText(token) || child_style.isInline()){
      this.stream.prev();
      this.setChildLayout(new InlineGenerator(this.style, this.stream));
      return this.yieldChildLayout(context);
    }

    // child block with float
    // stream push back, and delegate current style and stream to InlineGenerator
    if(child_style.isFloated()){
      this.stream.prev();
      this.setChildLayout(new FloatGenerator(this.style, this.stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    var child_stream = this._createStream(token);

    if(child_style.display === "list-item"){
      this.setChildLayout(new ListItemGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    if(child_style.display === "table-row"){
      this.setChildLayout(new TableRowGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    switch(child_style.getMarkupName()){
    case "body":
      this.setChildLayout(new BodyGenerator(child_style, child_stream));
      return this.yieldChildLayout(context);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      this.setChildLayout(new SectionRootGenerator(child_style, child_stream));
      return this.yieldChildLayout(context);

    case "section":
    case "article":
    case "nav":
    case "aside":
      this.setChildLayout(new SectionContentGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      this.setChildLayout(new HeaderGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "ul":
    case "ol":
      this.setChildLayout(new ListGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    default:
      this.setChildLayout(new BlockGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }
  };

  BlockGenerator.prototype._addElement = function(context, element, extent){
    if(this.style.isPushed()){
      context.pushBockElement(element, extent);
    } else if(this.style.isPulled()){
      context.pullBlockElement(element, extent);
    } else {
      context.addBlockElement(element, extent);
    }
    this._onAddElement(element);
  };

  BlockGenerator.prototype._createBlock = function(context){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      return null;
    }
    var block = this.style.createBlock({
      extent:extent,
      elements:elements
    });
    this._onCreate(block);
    if(!this.hasNext()){
      this._onComplete(block);
    }
    return block;
  };

  BlockGenerator.prototype._onAddElement = function(block){
  };

  BlockGenerator.prototype._onCreate = function(block){
  };

  BlockGenerator.prototype._onComplete = function(block){
  };

  return BlockGenerator;
})();


var InlineGenerator = (function(){
  function InlineGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
  }
  Class.extend(InlineGenerator, LayoutGenerator);

  InlineGenerator.prototype._yield = function(context){
    if(!context.isInlineSpaceLeft()){
      return null;
    }
    while(true){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var measure = this._getMeasure(element);
      if(!context.hasInlineSpaceFor(measure)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, measure);
      if(!context.isInlineSpaceLeft()){
	break;
      }
    }
    // no br, no element
    if(context.isInlineEmpty()){
      return null;
    }
    // justify if this line is generated by overflow(not line-break).
    if(!context.hasBr()){
      this._justifyLine(context);
    }
    return this._createLine(context);
  };

  InlineGenerator.prototype._createChildContext = function(context){
    return new LayoutContext(
      context.block, // inline generator inherits block context as it is.
      new InlineContext(context.getInlineRestMeasure())
    );
  };

  InlineGenerator.prototype._createLine = function(context){
    var measure = this.style.isRootLine()? this.style.getContentMeasure() : context.getInlineCurMeasure();
    return this.style.createLine({
      br:context.hasBr(), // is line broken by br?
      measure:measure, // wrapping measure
      inlineMeasure:context.getInlineCurMeasure(), // actual measure
      elements:context.getInlineElements(), // all inline-child, not only text, but recursive child box.
      texts:context.getInlineTexts(), // elements but text element only.
      charCount:context.getInlineCharCount()
    });
  };

  InlineGenerator.prototype._justifyLine = function(context){
    var next_head = this.peekLastCache(); // by stream.getToken(), stream pos has been moved to next pos already, so cur pos is the next head.
    var new_tail = context.justify(next_head); // if justify is occured, new_tail token is gained.
    if(new_tail){
      this.stream.setPos(new_tail.pos + 1); // new stream pos is next pos of new tail.
      this.clearCache(); // stream position changed, so disable cache.
    }
  };

  InlineGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      return this.popCache(context);
    }

    if(this.hasChildLayout()){
      return this.yieldChildLayout();
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // if tag token, inherit style
    var style = this.style;
    if(token instanceof Tag){
      style = new StyleContext(token, this.style);

      // inline -> block, force terminate inline
      if(style.isBlock()){
	this.stream.prev();
	this.setTerminate(true);

	// add line-break to avoid empty-line.
	// because empty-line is returned as null to parent block generator,
	// and it causes page-break of parent block generator.
	context.setLineBreak(true);
	return null;
      }
    }

    // inline text
    if(Token.isText(token)){
      return this._getText(context, token);
    }

    // inline tag(child inline)
    switch(token.getName()){
    case "br":
      context.setLineBreak(true);
      return null;
    default:
      this.setChildLayout(new InlineGenerator(style, this._createStream(token)));
      return this.yieldChildLayout(context);
    }
  };

  InlineGenerator.prototype._getText = function(context, token){
    if(!token.hasMetrics()){
      // if charactor token, set kerning before setting metrics.
      // because some additional space is added to it in some case.
      if(token instanceof Char){
	this._setCharKerning(context, token);
      }
      token.setMetrics(this.style.flow, this.style.font);
    }
    if(token instanceof Ruby){
      return token;
    }
    switch(token._type){
    case "char":
    case "tcy":
      return token;
      case "word":
      return this._getWord(context, token);
    }
  };

  InlineGenerator.prototype._setCharKerning = function(context, char_token){
    var next_token = this.stream.peek();
    var prev_text = context.getInlineLastText();
    var next_text = next_token && Token.isText(next_token)? next_token : null;
    Kerning.set(char_token, prev_text, next_text);
  };

  InlineGenerator.prototype._getWord = function(context, token){
    var rest_measure = context.getInlineRestMeasure();
    var advance = token.getAdvance(this.style.flow, this.style.letterSpacing || 0);
    
    // if advance of this word is less than max-measure, just return.
    if(advance <= rest_measure){
      token.setDevided(false);
      return token;
    }
    // if advance is lager than max_measure,
    // we must cut this word into some parts.
    var part = token.cutMeasure(this.style.font.size, rest_measure); // get sliced word
    part.setMetrics(this.style.flow, this.style.font); // metrics for first half
    token.setMetrics(this.style.flow, this.style.font); // metrics for second half
    this.stream.prev(); // re-parse this token because rest part is still exists.
    return part;
  };

  InlineGenerator.prototype._getMeasure = function(element){
    if(element instanceof Box){
      return element.getBoxMeasure(this.style.flow);
    }
    if(element.getAdvance){
      return element.getAdvance(this.style.flow, this.style.letterSpacing || 0);
    }
    return 0; // TODO
  };

  InlineGenerator.prototype._addElement = function(context, element, measure){
    context.addInlineElement(element, measure);
  };

  return InlineGenerator;
})();


var FloatGroup = (function(){
  function FloatGroup(elements, logical_float){
    this.elements = elements || [];
    this.logicalFloat = logical_float || LogicalFloats.get("start");
  }

  FloatGroup.prototype = {
    add : function(element){
      // [f1,f2], [] => [f1], [f2] => [], [f1, f2]
      this.elements.unshift(element); // keep original stack order
    },
    isFloatStart : function(){
      return this.logicalFloat.isStart();
    },
    isFloatEnd : function(){
      return this.logicalFloat.isEnd();
    },
    getElements : function(){
      return this.isFloatStart()? this.elements : List.reverse(this.elements);
    },
    getMeasure : function(flow){
      return List.fold(this.elements, 0, function(measure, element){
	return measure + element.getBoxMeasure(flow);
      });
    },
    getExtent : function(flow){
      return List.fold(this.elements, 0, function(extent, element){
	return Math.max(extent, element.getBoxExtent(flow));
      });
    }
  };

  return FloatGroup;
})();


// pop floated element both from start and end, but select larger one.
var FloatGroupStack = (function(){

  // [float block] -> FloatGroup
  var pop_float_group = function(flow, logical_float, blocks){
    var head = blocks.pop() || null;
    if(head === null){
      return null;
    }
    var extent = head.getBoxExtent(flow);
    var group = new FloatGroup([head], logical_float);

    // group while previous floated-element has smaller extent than the head
    while(true){
      var next = blocks.pop();
      if(next && next.getBoxExtent(flow) <= extent){
	group.add(next);
      } else {
	blocks.push(next); // push back
	break;
      }
    }
    return group;
  };

  // [float block] -> [FloatGroup]
  var make_float_groups = function(flow, logical_float, blocks){
    var ret = [];
    do{
      var group = pop_float_group(flow, logical_float, blocks);
      if(group){
	ret.push(group);
      }
    } while(group !== null);
    return ret;
  };

  function FloatGroupStack(flow, start_blocks, end_blocks){
    var start_groups = make_float_groups(flow, LogicalFloats.get("start"), start_blocks);
    var end_groups = make_float_groups(flow, LogicalFloats.get("end"), end_blocks);
    this.stack = start_groups.concat(end_groups).sort(function(g1, g2){
      return g1.getExtent(flow) - g2.getExtent(flow);
    });
  }

  FloatGroupStack.prototype = {
    isEmpty : function(){
      return this.stack.length === 0;
    },
    pop : function(){
      return this.stack.pop() || null;
    }
  };

  return FloatGroupStack;
})();


var FloatGenerator = (function(){
  // caution: constructor argument 'style' is the style of parent.
  // so if <body><float1>..</float1><float2>...</float2></body>,
  // style of this contructor is 'body.style'
  function FloatGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.generators = this._getFloatedGenerators();

    // create child generator to yield rest-space of float-elements with logical-float "start".
    // notice that this generator uses 'clone' of original style, because size of space changes by position,
    // but on the other hand, float-elements refer to this original style as their parent style.
    // so we must keep original style immutable.
    this.setChildLayout(new BlockGenerator(style.clone({"float":"start"}), stream, outline_context));
  }
  Class.extend(FloatGenerator, LayoutGenerator);

  FloatGenerator.prototype.hasNext = function(){
    if(this._hasNextFloat()){
      return true;
    }
    return LayoutGenerator.prototype.hasNext.call(this);
  };

  FloatGenerator.prototype._hasNextFloat = function(){
    return List.exists(this.generators, function(gen){
      return gen.hasNext();
    });
  };

  FloatGenerator.prototype._yield = function(context){
    var stack = this._yieldFloatStack(context);
    var rest_measure = context.getInlineRestMeasure();
    var rest_extent = context.getBlockRestExtent();
    return this._yieldFloat(context, stack, rest_measure, rest_extent);
  };

  FloatGenerator.prototype._yieldFloat = function(context, stack, rest_measure, rest_extent){
    if(rest_measure <= 0){
      return null;
    }
    var flow = this.style.flow;

    // no more floated layout, just yield rest area.
    if(stack.isEmpty()){
      return this._yieldFloatSpace(context, rest_measure, rest_extent);
    }
    /*
      <------ rest_measure ---->
      --------------------------
      |       |                |
      | group | rest           | => group_set(wrap_float)
      |       |                |
      --------------------------
    */
    var group = stack.pop(); // pop float group(notice that this stack is ordered by extent asc, so largest one is first obtained).
    var rest = this._yieldFloat(context, stack, rest_measure - group.getMeasure(flow), group.getExtent(flow)); // yield rest area of this group in inline-flow(recursive).
    var group_set = this._wrapFloat(group, rest, rest_measure); // wrap these 2 floated layout as one block.

    /*
      To understand rest_extent_space, remember that this func is called recursivelly,
      and argument 'rest_extent' is generated by 'previous' largest float group(g2).
      
      <--- rest_measure --->
      ----------------------------
      |    |                |    |
      | g1 | rest           | g2 |
      |    |                |    |
      ----------------------|    |
      |  rest_extent_space  |    |
      ----------------------------
    */
    var rest_extent_space = rest_extent - group.getExtent(flow);

    // no more space left in block-flow direction, or no more stream.
    if(rest_extent_space <= 0 || !this.stream.hasNext()){
      return group_set;
    }

    /*
      <------ rest_measure ---->
      --------------------------
      |       |                |
      | group | rest           | => group_set(wrap_float)
      |       |                |
      --------------------------
      |  rest_extent_space     | => rest_extent - group_set.extent
      --------------------------
    */
    // if there is space in block-flow direction, yield rest space and wrap tfloated-set and rest-space as one.
    var space = this._yieldFloatSpace(context, rest_measure, rest_extent_space);
    return this._wrapBlock(group_set, space);
  };
  
  FloatGenerator.prototype._sortFloatRest = function(floated, rest){
    var floated_elements = floated.getElements();
    return floated.isFloatStart()? floated_elements.concat(rest) : [rest].concat(floated_elements);
  };

  FloatGenerator.prototype._wrapBlock = function(block1, block2){
    var flow = this.style.flow;
    var measure = block1.getBoxMeasure(flow); // block2 has same measure
    var extent = block1.getBoxExtent(flow) + (block2? block2.getBoxExtent(flow) : 0);

    // wrapping block always float to start direction
    return this.style.createChild("div", {"float":"start"}).createBlock({
      elements:[block1, block2],
      measure:measure,
      extent:extent
    });
  };

  FloatGenerator.prototype._wrapFloat = function(floated, rest, wrap_measure){
    var flow = this.style.flow;
    var extent = floated.getExtent(flow);
    return this.style.createChild("div", {"float":"start"}).createBlock({
      elements:this._sortFloatRest(floated, rest),
      measure:wrap_measure,
      extent:extent
    });
  };
  
  FloatGenerator.prototype._yieldFloatSpace = function(context, measure, extent){
    this._childLayout.cloneStyle({
      "float":"start",
      measure:measure,
      extent:extent
    });
    return this.yieldChildLayout();
  };
  
  FloatGenerator.prototype._yieldFloatStack = function(context){
    var start_blocks = [], end_blocks = [];
    List.iter(this.generators, function(gen){
      var block = gen.yield(context);
      if(block){
	if(gen.style.isFloatStart()){
	  start_blocks.push(block);
	} else if(gen.style.isFloatEnd()){
	  end_blocks.push(block);
	}
      }
    });
    return new FloatGroupStack(this.style.flow, start_blocks, end_blocks);
  };

  FloatGenerator.prototype._getFloatedTags = function(){
    var parent_style = this.style;
    return this.stream.getWhile(function(token){
      return (token instanceof Tag && (new StyleContext(token, parent_style)).isFloated());
    });
  };

  FloatGenerator.prototype._getFloatedGenerators = function(){
    var self = this;
    return List.map(this._getFloatedTags(), function(tag){
      return new BlockGenerator(
	new StyleContext(tag, self.style),
	new TokenStream(tag.getContent()),
	self.outlineContext
      );
    });
  };

  return FloatGenerator;
})();


var ParallelGenerator = (function(){
  function ParallelGenerator(style, generators){
    LayoutGenerator.call(this, style, null);
    this.generators = generators;
  }
  Class.extend(ParallelGenerator, LayoutGenerator);

  ParallelGenerator.prototype._yield = function(context){
    if(this.hasCache()){
      return this.popCache();
    }
    var blocks = this._yieldParallelBlocks(context);
    if(blocks === null){
      return null;
    }
    var wrap_block = this._wrapBlocks(blocks);
    var wrap_extent = wrap_block.getBoxExtent(this.style.flow);
    if(!context.hasBlockSpaceFor(wrap_extent)){
      this.pushCache(wrap_block);
      return null;
    }
    context.addBlockElement(wrap_block, wrap_extent);
    return wrap_block;
  };

  ParallelGenerator.prototype.hasNext = function(context){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    return List.exists(this.generators, function(gen){
      return gen.hasNext();
    });
  };

  ParallelGenerator.prototype._yieldParallelBlocks = function(context){
    var blocks = List.map(this.generators, function(gen){
      return gen.yield(context);
    });
    return List.forall(blocks, function(block){ return block === null; })? null : blocks;
  };

  ParallelGenerator.prototype._findMaxBlock = function(blocks){
    var flow = this.style.flow;
    return List.maxobj(blocks, function(block){
      return block? block.getBoxExtent(flow) : 0;
    });
  };

  ParallelGenerator.prototype._alignContentExtent = function(blocks, content_extent){
    var flow = this.style.flow;
    var generators = this.generators;
    return List.mapi(blocks, function(i, block){
      if(block === null){
	return generators[i].style.createBlock({elements:[], extent:content_extent});
      }
      return block.resizeExtent(flow, content_extent);
    });
  };

  ParallelGenerator.prototype._wrapBlocks = function(blocks){
    var flow = this.style.flow;
    var generators = this.generators;
    var max_block = this._findMaxBlock(blocks);
    var uniformed_blocks = this._alignContentExtent(blocks, max_block.getContentExtent(flow));
    return this.style.createBlock({
      elements:uniformed_blocks,
      extent:max_block.getBoxExtent(flow)
    });
  };

  return ParallelGenerator;
})();



var ListGenerator = (function(){
  function ListGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.style.markerSize = this._getMarkerSize(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  ListGenerator.prototype._getMarkerSize = function(item_count){
    var max_marker_text = this.style.getMarkerHtml(item_count);
    var gen = new InlineGenerator(this.style, new TokenStream(max_marker_text));
    var line = gen.yield();
    var marker_measure = line.inlineMeasure + Math.floor(this.style.getFontSize() / 2);
    var marker_extent = line.size.getExtent(this.style.flow);
    return this.style.flow.getBoxSize(marker_measure, marker_extent);
  };

  return ListGenerator;
})();


var ListItemGenerator = (function(){
  function ListItemGenerator(style, stream, outline_context){
    ParallelGenerator.call(this, style, [
      this._createListMarkGenerator(style, outline_context),
      this._createListBodyGenerator(style, stream, outline_context)
    ]);
  }
  Class.extend(ListItemGenerator, ParallelGenerator);

  ListItemGenerator.prototype._createListMarkGenerator = function(style, outline_context){
    var marker_size = style.parent.markerSize;
    var item_order = style.getChildIndex();
    var marker_text = style.parent.getMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "class":"nehan-li-mark",
      "measure":measure
    });

    return new BlockGenerator(marker_style, new TokenStream(marker_text), outline_context);
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(style, stream, outline_context){
    var marker_size = style.parent.markerSize;
    var measure = style.getContentMeasure() - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "class":"nehan-li-body",
      "measure":measure
    });

    return new BlockGenerator(body_style, stream, outline_context);
  };

  ListItemGenerator.prototype._alignContentExtent = function(blocks, content_extent){
    if(this.style.isTextVertical()){
      return blocks;
    }
    return ParallelGenerator.prototype._alignContentExtent.call(this, blocks, content_extent);
  };

  return ListItemGenerator;
})();
  

// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
// init : create partition map
var TableGenerator = (function(){
  function TableGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGenerator, BlockGenerator);

  TableGenerator.prototype.yield = function(context){
  };

  TableGenerator.prototype._getTableGroupTags = function(context){
  };

  return TableGenerator;
})();

// parent : table
// tag : thead | tbody | tfoot
// stream : [tr]
// yield : [tr]
var TableGroupLayoutGenerator = (function(){
  function TableGroupLayoutGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGroupLayoutGenerator, BlockGenerator);

  TableGroupLayoutGenerator.prototype.yield = function(context){
  };

  TableGroupLayoutGenerator.prototype._getRowTags = function(context){
    return this.stream.getWhile(function(token){
      return (token instanceof Tag && token.getName() === "tr");
    });
  };

  return TableGroupLayoutGenerator;
})();


// parent : thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
var TableRowGenerator = (function(){
  function TableRowGenerator(style, stream, outline_context){
    var generators = this._getGenerators(style, stream, outline_context);
    ParallelGenerator.call(this, style, generators);
  }
  Class.extend(TableRowGenerator, ParallelGenerator);

  TableRowGenerator.prototype._getGenerators = function(style, stream, outline_context){
    var child_tags = this._getChildTags(stream);
    var child_styles = this._getChildStyles(style, child_tags);
    return List.map(child_styles, function(child_style){
      return new BlockGenerator(child_style, new TokenStream(child_style.getMarkupContent()), outline_context);
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(style, child_tags){
    var child_count = child_tags.length;
    var rest_measure = style.getContentMeasure();
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, style);
      var static_measure = default_style.getStaticMeasure();
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_count - i));
      rest_measure -= measure;
      return default_style.clone({
	"float":"start",
	"measure":measure
      });
    });
  };

  TableRowGenerator.prototype._getChildTags = function(stream){
    return stream.getWhile(function(token){
      return (token instanceof Tag && (token.getName() === "td" || token.getName() === "th"));
    });
  };

  return TableRowGenerator;
})();

var SectionRootGenerator = (function(){
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.outlineContext = new OutlineContext(style); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onCreate = function(block){
    this.outlineContext.stepPageNo();
    console.log("[%s] create page", this.style.getMarkupName());
  };

  SectionRootGenerator.prototype._onComplete = function(block){
    DocumentContext.addOutlineContext(this.outlineContext);
    //var tree = this.outlineContext.outputTree();
    //var dom_tree = this.outlineContext.outputNode();
  };

  return SectionRootGenerator;
})();

var SectionContentGenerator = (function(){
  function SectionContentGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.outlineContext.startSection(this.style.getMarkupName());
  }
  Class.extend(SectionContentGenerator, BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(block){
    this.context.endSection(this.style.getMarkupName());
  };

  return SectionContentGenerator;
})();


var HeaderGenerator = (function(){
  function HeaderGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(HeaderGenerator, BlockGenerator);

  HeaderGenerator.prototype._onComplete = function(block){
    var header_id = this.outlineContext.addHeader({
      type:this.style.getMarkupName(),
      rank:this.style.getHeaderRank(),
      title:this.style.getMarkupContent()
    });
    block.id = Css.addNehanHeaderPrefix(header_id);
  };
  
  return HeaderGenerator;
})();


var BodyGenerator = (function(){
  function BodyGenerator(style, stream){
    SectionRootGenerator.call(this, style, stream);
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  return BodyGenerator;
})();

var LayoutEvaluator = (function(){
  function LayoutEvaluator(){
  }

  LayoutEvaluator.prototype = {
    evaluate : function(box){
      if(box === null || typeof box === "undefined"){
	//console.warn("error box:%o", box);
	return "";
      }
      // caution: not box.style.display but box.display
      switch(box.display){
      case "block": return this.evalBlock(box);
      case "inline": return this.evalInline(box);
      case "inline-block": return this.evalInlineBlock(box);
      default: return "";
      }
    },
    evalBlock : function(block){
      return Html.tagWrap("div", this.evalBlockElements(block, block.elements), {
	"style":Css.toString(block.getCssBlock()),
	"class":block.classes.join(" ")
      });
    },
    evalBlockElements : function(parent, elements){
      var self = this;
      return List.fold(elements, "", function(ret, child){
	return ret + self.evaluate(child);
      });
    },
    evalInline : function(line){
      return Html.tagWrap("div", this.evalInlineElements(line, line.elements), {
	"style":Css.toString(line.getCssInline()),
	"class":line.classes.join(" ")
      });
    },
    evalInlineElements : function(line, elements){
      var self = this;
      return List.fold(elements, "", function(ret, element){
	return ret + self.evalInlineElement(line, element);
      });
    },
    evalInlineElement : function(line, element){
      if(element instanceof Box){
	return this.evalInlineChild(line, element);
      }
      var text = this.evalTextElement(line, element);
      if(line.style.isTextEmphaEnable()){
	return this.evalEmpha(line, element, text);
      }
      return text;
    },
    evalTextElement : function(line, text){
      switch(text._type){
      case "word": return this.evalWord(line, text);
      case "char": return this.evalChar(line, text);
      case "tcy": return this.evalTcy(line, text);
      case "ruby": return this.evalRuby(line, text);
      default: return "";
      }
    }
  };

  return LayoutEvaluator;
})();


var VertEvaluator = (function(){
  function VertEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(VertEvaluator, LayoutEvaluator);

  VertEvaluator.prototype.evalInlineBlock = function(iblock){
    return this.evalBlock(iblock);
  };

  VertEvaluator.prototype.evalInlineChild = function(line, child){
    return this.evalInline(child);
  };

  VertEvaluator.prototype.evalRuby = function(line, ruby){
    var body = this.evalRb(line, ruby) + this.evalRt(line, ruby);
    return Html.tagWrap("div", body, {
      "class":"nehan-ruby-body"
    });
  };

  VertEvaluator.prototype.evalRb = function(line, ruby){
    return Html.tagWrap("div", this.evalInlineElements(line, ruby.getRbs()), {
      "style":Css.toString(ruby.getCssVertRb(line)),
      "class":"nehan-rb"
    });
  };

  VertEvaluator.prototype.evalRt = function(line, ruby){
    var rt = (new InlineGenerator(
      new StyleContext(ruby.rt, line.style),
      new TokenStream(ruby.getRtString())
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
    var body = Html.tagWrap("div", word.data, {
      "class": "nehan-rotate-90",
      "style": Css.toString(word.getCssVertTransBody(line))
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  };

  VertEvaluator.prototype.evalWordTransformTrident = function(line, word){
    var body = Html.tagWrap("div", word.data, {
      // trident rotation needs some hack.
      //"class": "nehan-rotate-90",
      "style": Css.toString(word.getCssVertTransBodyTrident(line))
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  };

  VertEvaluator.prototype.evalWordIE = function(line, word){
    return Html.tagWrap("div", word.data, {
      "class": "nehan-vert-ie",
      "style": Css.toString(word.getCssVertTransIE(line))
    }) + Const.clearFix;
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
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-rotate-90"
    });
  };

  VertEvaluator.prototype.evalRotateCharIE = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertRotateCharIE(line)),
      "class":"nehan-vert-ie"
    }) + Const.clearFix;
  };

  VertEvaluator.prototype.evalTcy = function(line, tcy){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
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

  VertEvaluator.prototype.evalCharWithBr = function(line, chr){
    return chr.data + "<br />";
  };

  VertEvaluator.prototype.evalCharLetterSpacing = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertLetterSpacing(line))
    });
  };

  VertEvaluator.prototype.evalEmpha = function(line, chr, char_body){
    char_body = char_body.replace("<br />", "");
    var char_body2 = Html.tagWrap("span", char_body, {
      "class":"nehan-empha-src",
      "style":Css.toString(chr.getCssVertEmphaTarget(line))
    });
    var empha_body = Html.tagWrap("span", line.style.textEmpha.getText(), {
      "class":"nehan-empha-text",
      "style":Css.toString(chr.getCssVertEmphaText(line))
    });
    return Html.tagWrap("div", char_body2 + empha_body, {
      "class":"nehan-empha-wrap",
      "style":Css.toString(line.style.textEmpha.getCssVertEmphaWrap(line, chr))
    });
  };

  VertEvaluator.prototype.evalPaddingChar = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.toString(chr.getCssPadding(line))
    });
  };

  VertEvaluator.prototype.evalImgChar = function(line, chr){
    var color = line.color || new Color(Layout.fontColor);
    var font_rgb = color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color),
      style:Css.toString(chr.getCssVertImgChar(line))
    }) + Const.clearFix;
  };

  VertEvaluator.prototype.evalVerticalGlyph = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-vert-glyph",
      "style":Css.toString(chr.getCssVertGlyph(line))
    });
  };

  VertEvaluator.prototype.evalCnvChar = function(line, chr){
    return chr.cnv + "<br />";
  };

  VertEvaluator.prototype.evalSmallKana = function(line, chr){
    var tag_name = (line.style.textEmpha && line.style.textEmpha.isEnable())? "span" : "div";
    return Html.tagWrap(tag_name, chr.data, {
      style:Css.toString(chr.getCssVertSmallKana())
    });
  };

  VertEvaluator.prototype.evalHalfSpaceChar = function(line, chr){
    var font_size = line.style.getFontSize();
    var half = Math.round(font_size / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.toString(chr.getCssVertHalfSpaceChar(line))
    });
  };

  VertEvaluator.prototype.evalInlineBox = function(line, box){
    var body = (box._type === "img")? this.parentEvaluator.evalImageContent(box) : box.content;
    return Html.tagWrap("div", body, {
      "style":Css.toString(box.getCssVertInlineBox())
    });
  };

  return VertEvaluator;
})();


var HoriEvaluator = (function(){
  function HoriEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(HoriEvaluator, LayoutEvaluator);

  HoriEvaluator.prototype.evalInlineBlock = function(iblock){
    iblock.css.display = "inline-block";
    return this.evalBlock(iblock);
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



var LayoutTest = (function(){

  var TestText = {
    "long":"日本国民は正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたって自由のもたらす恵沢を確保し、政府の行為によって再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。",
    "middle":"<p>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</p>",
    "short":"<p>余白のテキストです。</p>"
  };

  // various text data
  var TestSnipet = {
    "ruby":[
      "<p>",
      "<ruby>漢字<rt>かんじ</rt></ruby>と<span class='nehan-xx-large'><ruby>日本<rt>にほん</rt></ruby></span>と<span class='nehan-empha-dot-open'>圏点</span>です。",
      "</p>"
    ].join(""),

    "float":[
      "<p class='nehan-float-start' style='measure:100px'>",
      "短い長さの前方コンテンツ",
      "</p>",
      
      "<p class='nehan-float-start' style='measure:80px'>",
      "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
      "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
      "</p>",

      "<p class='nehan-float-end' style='measure:60px'>",
      "一つ目の後方に回り込まれるコンテンツ",
      "</p>",

      "<p class='nehan-float-end' style='measure:50px'>",
      "二つ目の後方コンテンツ",
      "</p>"

    ].join(""),

    "ul":[
      "<ul>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + TestText["middle"] + "</li>",
	"<li>" + TestText["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["middle"] + "</li>",
      "<li>" + TestText["long"] + "</li>",
      "</ul>"
    ].join(""),

    "ol":[
      "<ol>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + TestText["middle"] + "</li>",
	"<li>" + TestText["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["middle"] + "</li>",
      "<li>" + TestText["long"] + "</li>",
      "</ol>"
    ].join(""),

    "dummy":""
  };

  var TestScript = {
    "ruby-test":TestSnipet["ruby"],

    "ul-test":TestSnipet["ul"],

    "ol-test":TestSnipet["ol"],

    "plain-test":[
      TestSnipet["ruby"],
      TestText["long"],
      TestText["middle"],
      TestText["short"]
    ].join(""),

    "float-test":[
      TestSnipet["float"],
      TestSnipet["ruby"],
      TestText["long"],
      TestSnipet["ruby"],
      TestText["middle"],
      TestSnipet["ruby"],
      TestText["long"],
      TestSnipet["float"],
      TestText["long"],
      TestText["middle"],
      TestText["long"],
      ""
    ].join(""),

    "table-test":[
      "<table>",
      "<tbody>",

      "<tr>",
      "<td>" + TestText["long"] + "</td><td>hige</td><td>hage</td>",
      "</tr>",

      "<tr>",
      "<td>ohoho</td><td>ahaha</td><td>hihihi</td>",
      "</tr>",

      "<tr>",
      "<td>123</td><td>456</td><td>789</td>",
      "</tr>",

      "</tbody>",
      "</table>"
    ].join(""),

    "dl-test":[
      "<dl>",
      "<dt>hoge</dt>",
      "<dd>" + TestText["long"] + "</dd>",
      "</dl>"
    ].join(""),

    "header-test":[
      "<h1>h1h1h1</h1>",
      "<h2>h2h2h2</h2>",
      "<h3>h3h3h3</h3>",
      "<h4>h4h4h4</h4>",
      "<h5>h5h5h5</h5>",
      "<h6>h6h6h6</h6>"
    ].join("")
  };

  return {
    getGenerator : function(name){
      var script = TestScript[name] || TestSnipet[name] || TestText[name] || "undefined script";
      //var tag = new Tag("<html>", "<body>" + script + "</body>");
      var tag = new Tag("<body>", script);
      var style = new StyleContext(tag, null);
      var stream = new TokenStream(tag.getContent());
      return new BodyGenerator(style, stream);
    },
    getEvaluator : function(){
      return (Layout.direction === "vert")? new VertEvaluator() : new HoriEvaluator();
    },
    start : function(name, opt){
      opt = opt || {};
      Layout.width = opt.width || 800;
      Layout.height = opt.height || 500;
      Layout.direction = opt.direction || "vert";

      var output = document.getElementById(opt.output || "result");
      var debug = document.getElementById(opt.debug || "debug");
      var generator = this.getGenerator(name);
      var evaluator = this.getEvaluator();
      var make_title = function(name){
	var dom = document.createElement("h2");
	dom.innerHTML = name + " / " + opt.direction;
	return dom;
      };
      var make_div = function(html){
	var dom = document.createElement("div");
	dom.innerHTML = html;
	return dom;
      };
      var make_time = function(t1, t2){
	var sec = t2.getTime() - t1.getTime();
	var dom = document.createElement("p");
	dom.innerHTML = (sec / 1000) + "sec";
	return dom;
      };

      output.appendChild(make_title(name));

      var raws = [];
      var t1 = new Date();
      do {
	var page = generator.yield();
	if(page){
	  var html = evaluator.evaluate(page);
	  output.appendChild(make_div(html));
	  raws.push(html);
	}
      } while(page != null);
      var t2 = new Date();

      output.appendChild(make_time(t1, t2));
      //debug.value = raws.join("\n\n");

      var outline_contexts = DocumentContext.getOutlineContext("body");
      if(outline_contexts.length > 0){
	var cont = outline_contexts[0];
	var toc_node = (new OutlineContextConverter()).convert(cont);
	document.getElementById("toc").appendChild(toc_node);
      }
    }
  };
})();


Nehan.version = "4.0.11";

Args.copy(Env, __engine_args.env || {});
Args.copy(Layout, __engine_args.layout || {});
Args.copy(Config, __engine_args.config || {});

var __exports = {};
__exports.Class = Class;
__exports.Env = Env;
__exports.DocumentContext = DocumentContext;
__exports.OutlineContextConverter = OutlineContextConverter;
__exports.createPageStream = function(text, group_size){
  group_size = Math.max(1, group_size || 1);
  return (group_size === 1)? (new PageStream(text)) : (new PageGroupStream(text, group_size));
};
__exports.getStyle = function(selector_key){
  return Selectors.getValue(selector_key);
};
__exports.setStyle = function(selector_key, value){
  Selectors.setValue(selector_key, value);
  return this;
};
__exports.setStyles = function(values){
  for(var selector_key in values){
    Selectors.setValue(selector_key, values[selector_key]);
  }
  return this;
};

__exports.LayoutTest = LayoutTest;

return __exports;

}; // Nehan.setup
