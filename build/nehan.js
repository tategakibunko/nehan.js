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

var Exceptions = {
  PAGE_BREAK:1,
  LINE_BREAK:2,
  BUFFER_END:3,
  SINGLE_RETRY:4,
  IGNORE:5,
  FORCE_TERMINATE:6,
  toString : function(num){
    for(var prop in this){
      if(this[prop] === num){
	return prop;
      }
    }
    return "??";
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
  },
  isInline : function(token){
    if(this.isText(token)){
      return true;
    }
    if(token.isBlock()){
      return false;
    }
    return token.isInline() || token.isInlineBlock();
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
    getCssVertEmphaSrc : function(line){
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
    getCssHoriEmphaSrc : function(line){
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
    this.padding = new Padding();
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
      Args.copy(css, this.padding.getCss());
      return css;
    },
    getCssHoriRb : function(line){
      var css = {};
      Args.copy(css, this.padding.getCss());
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
      css["padding-top"] = (-font_size) + "px";
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
    debug : function(title){
      console.log("[%s](m,e) = (%d,%d), (m+,e+) = (%d,%d)", title,
		  this.getContentMeasure(), this.getContentExtent(),
		  this.getBoxMeasure(), this.getBoxExtent());
    }
  };

  return Box;
})();

// style setting from markup to box
var BoxStyle = {
  set : function(markup, box, parent){
    this._setDisplay(markup, box, parent);
    this._setPosition(markup, box, parent);
    this._setZIndex(markup, box, parent);
    this._setColor(markup, box, parent);
    this._setFont(markup, box, parent);
    this._setBoxSizing(markup, box, parent);
    this._setEdge(markup, box, parent);
    this._setLineRate(markup, box, parent);
    this._setTextAlign(markup, box, parent);
    this._setTextIndent(markup, box, parent);
    this._setTextEmphasis(markup, box, parent);
    this._setFlowName(markup, box, parent);
    this._setFloat(markup, box, parent);
    this._setLetterSpacing(markup, box, parent);
    this._setBackground(markup, box, parent);
    this._setClasses(markup, box, parent);
  },
  _setDisplay : function(markup, box, parent){
    box.display = markup.getCssAttr("display", "block");
  },
  _setPosition : function(markup, box, parent){
    var position = markup.getCssAttr("position", "relative");
    box.position = new BoxPosition(position, {
      top: markup.getCssAttr("top", "auto"),
      left: markup.getCssAttr("left", "auto"),
      right: markup.getCssAttr("right", "auto"),
      bottom: markup.getCssAttr("bottom", "auto")
    });
  },
  _setZIndex : function(markup, box, parent){
    var z_index = markup.getCssAttr("z-index");
    if(z_index){
      box.zIndex = z_index;
    }
  },
  _setClasses : function(markup, box, parent){
    List.iter(markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _setColor : function(markup, box, parent){
    var color = markup.getCssAttr("color");
    if(color){
      box.color = new Color(color);
    }
  },
  _setFont : function(markup, box, parent){
    var font_size = markup.getCssAttr("font-size", "inherit");
    if(font_size !== "inherit"){
      box.font.size = UnitSize.getFontSize(font_size, parent.font.size);
    }
    var font_family = markup.getCssAttr("font-family", "inherit");
    if(font_family !== "inherit"){
      box.font.family = font_family;
    }
    var font_weight = markup.getCssAttr("font-weight", "inherit");
    if(font_weight !== "inherit"){
      box.font.weight = font_weight;
    }
    var font_style = markup.getCssAttr("font-style", "inherit");
    if(font_style !== "inherit"){
      box.font.style = font_style;
    }
  },
  _setBoxSizing : function(markup, box, parent){
    var box_sizing = markup.getCssAttr("box-sizing");
    if(box_sizing){
      box.sizing = BoxSizings.getByName(box_sizing);
    }
  },
  _setEdge : function(markup, box, parent){
    var padding = markup.getCssAttr("padding");
    var margin = markup.getCssAttr("margin");
    var border_width = markup.getCssAttr("border-width");
    var border_radius = markup.getCssAttr("border-radius");
    if(padding === null && margin === null && border_width === null && border_radius === null){
      return null;
    }
    var edge = new BoxEdge();
    if(padding){
      edge.padding.setSize(box.flow, UnitSize.getEdgeSize(padding, box.getFontSize()));
    }
    if(margin){
      edge.margin.setSize(box.flow, UnitSize.getEdgeSize(margin, box.getFontSize()));
    }
    if(border_width){
      edge.border.setSize(box.flow, UnitSize.getEdgeSize(border_width, box.getFontSize()));
    }
    if(border_radius){
      edge.setBorderRadius(box.flow, UnitSize.getCornerSize(border_radius, box.getFontSize()));
    }
    var border_color = markup.getCssAttr("border-color");
    if(border_color){
      edge.setBorderColor(box.flow, border_color);
    }
    var border_style = markup.getCssAttr("border-style");
    if(border_style){
      edge.setBorderStyle(box.flow, border_style);
    }
    box.setEdge(edge);
  },
  _setLineRate : function(markup, box, parent){
    var line_rate = markup.getCssAttr("line-rate", "inherit");
    if(line_rate !== "inherit"){
      box.lineRate = line_rate;
    }
  },
  _setTextAlign : function(markup, box, parent){
    var text_align = markup.getCssAttr("text-align");
    if(text_align){
      box.textAlign = text_align;
    }
  },
  _setTextIndent : function(markup, box, parent){
    var text_indent = markup.getCssAttr("text-indent", "inherit");
    if(text_indent !== "inherit"){
      box.textIndent = Math.max(0, UnitSize.getUnitSize(text_indent, box.getFontSize()));
    }
  },
  _setTextEmphasis : function(markup, box, parent){
    var empha_style = markup.getCssAttr("text-emphasis-style", "none");
    if(empha_style !== "none" && empha_style !== "inherit"){
      var empha_pos = markup.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = markup.getCssAttr("text-emphasis-color", Layout.fontColor);
      box.textEmpha = new TextEmpha({
	style:new TextEmphaStyle(empha_style),
	pos:new TextEmphaPos(empha_pos),
	color:new Color(empha_color)
      });
    }
  },
  _setFlowName : function(markup, box, parent){
    var flow_name = markup.getCssAttr("flow", "inherit");
    if(flow_name === "flip"){
      box.setFlow(parent.getFlipFlow());
    } else if(flow_name !== "inherit"){
      box.setFlow(BoxFlows.getByName(flow_name));
    }
  },
  _setFloat : function(markup, box, parent){
    var logical_float = markup.getCssAttr("float", "none");
    if(logical_float != "none"){
      box.logicalFloat = logical_float;
    }
  },
  _setLetterSpacing : function(markup, box, parent){
    var letter_spacing = markup.getCssAttr("letter-spacing");
    if(letter_spacing){
      box.letterSpacing = UnitSize.getUnitSize(letter_spacing, box.getFontSize());
    }
  },
  _setBackground : function(markup, box, parent){
    var color = markup.getCssAttr("background-color");
    var image = markup.getCssAttr("background-image");
    var pos = markup.getCssAttr("background-position");
    var repeat = markup.getCssAttr("background-repeat");
    if(color === null && image === null && pos === null && repeat === null){
      return;
    }
    var background = new Background();
    if(color){
      background.color = color;
    }
    if(image){
      background.image = image;
    }
    if(pos){
      background.pos = new BackgroundPos2d(
	new BackgroundPos(pos.inline, pos.offset),
	new BackgroundPos(pos.block, pos.offset)
      );
    }
    if(repeat){
      background.repeat = new BackgroundRepeat2d(
	new BackgroundRepeat(repeat.inline),
	new BackgroundRepeat(repeat.block)
      );
    }
    box.background = background;
  }
};


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
    getTocStack : function(){
      return this.stack;
    },
    getTocId : function(){
      return this.stack.join(".");
    },
    stepNext : function(){
      var len = this.stack.length;
      if(len > 0){
	this.stack[len-1]++;
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

var OutlineBuffer = (function(){
  function OutlineBuffer(root_name){
    this.rootName = root_name;
    this.logs = [];
  }

  OutlineBuffer.prototype = {
    isEmpty : function(){
      return this.logs.length === 0;
    },
    get : function(pos){
      return this.logs[pos] || null;
    },
    getSectionRootName : function(){
      return this.rootName;
    },
    addSectionLog : function(log){
      this.logs.push(log);
    },
    addHeaderLog : function(log){
      // if section tag can't be included in parent layout,
      // it will be added 'twice' by rollback yielding.
      // in such case, we have to overwrite old one.
      var pos = this._findLog(log);
      if(pos >= 0){
	this.logs[pos] = log; // overwrite log
	return;
      }
      this.logs.push(log);
    },
    _findLog : function(log){
      for(var i = this.logs.length - 1; i >= 0; i--){
	if(log.headerId === this.logs[i].headerId){
	  return i;
	}
      }
      return -1;
    }
  };

  return OutlineBuffer;
})();

var OutlineContext = (function(){
  function OutlineContext(){
    this._buffers = {};
    this._stack = [];
    this._curSection = "body";
  }

  OutlineContext.prototype = {
    _addHeaderLog : function(log){
      var root_log = this.getOutlineBuffer(this._curSection);
      root_log.addHeaderLog(log);
    },
    _addSectionLog : function(log){
      var root_log = this.getOutlineBuffer(this._curSection);
      root_log.addSectionLog(log);
    },
    _getCurSection : function(){
      return (this._stack.length > 0)? this._stack[this._stack.length - 1] : "body";
    },
    getOutlineBuffer : function(root_name){
      var buffer = this._buffers[root_name] || new OutlineBuffer(root_name);
      this._buffers[root_name] = buffer;
      return buffer;
    },
    startSectionRoot : function(root_name){
      this._stack.push(root_name);
      this._curSection = root_name;
    },
    endSectionRoot : function(root_name){
      this._stack.pop();
      this._curSection = this._getCurSection();
      return this._curSection;
    },
    logStartSection : function(type, page_no){
      this._addSectionLog({
	name:"start-section",
	type:type,
	pageNo:page_no
      });
    },
    logEndSection : function(type){
      this._addSectionLog({
	name:"end-section",
	type:type
      });
    },
    logSectionHeader : function(type, rank, title, page_no, header_id){
      this._addHeaderLog({
	name:"set-header",
	type:type,
	rank:rank,
	title:title,
	pageNo:page_no,
	headerId:header_id // header id is used to associate header box object with outline.
      });
    }
  };

  return OutlineContext;
})();

var OutlineParser = (function(){
  function OutlineParser(logs){
    this._ptr = 0;
    this._logs = logs;
    this._root = new Section("section", null, 0);
  }

  OutlineParser.prototype = {
    getTree : function(){
      this._parse(this._root, this);
      return this._root;
    },
    _getNext : function(){
      return this._logs.get(this._ptr++);
    },
    _rollback : function(){
      this._ptr = Math.max(0, this._ptr - 1);
    },
    _parse : function(parent, ctx){
      var log = ctx._getNext();
      if(log === null){
	return;
      }
      switch(log.name){
      case "start-section":
	var section = new Section(log.type, parent, log.pageNo);
	if(parent){
	  parent.addChild(section);
	}
	arguments.callee(section, ctx);
	break;

      case "end-section":
	arguments.callee(parent.getParent(), ctx);
	break;

      case "set-header":
	var header = new SectionHeader(log.rank, log.title, log.headerId);
	if(parent === null){
	  var auto_section = new Section("section", null, log.pageNo);
	  auto_section.setHeader(header);
	  arguments.callee(auto_section, ctx);
	} else if(!parent.hasHeader()){
	  parent.setHeader(header);
	  arguments.callee(parent, ctx);
	} else {
	  var rank = log.rank;
	  var parent_rank = parent.getRank();
	  if(rank < parent_rank){ // higher rank
	    ctx._rollback();
	    arguments.callee(parent.getParent(), ctx);
	  } else if(log.rank == parent_rank){ // same rank
	    var next_section = new Section("section", parent, log.pageNo);
	    next_section.setHeader(header);
	    parent.addNext(next_section);
	    arguments.callee(next_section, ctx);
	  } else { // lower rank
	    var child_section = new Section("section", parent, log.pageNo);
	    child_section.setHeader(header);
	    parent.addChild(child_section);
	    arguments.callee(child_section, ctx);
	  }
	}
	break;
      }
    }
  };

  return OutlineParser;
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
var OutlineConverter = (function(){
  function OutlineConverter(tree, opt){
    this.tree = tree;
    Args.copy(this, opt || {});
  }

  OutlineConverter.prototype = {
    outputNode : function(){
      var ctx = new TocContext();
      return this._parseTree(this, this.createRoot(), this.tree, ctx);
    },
    _createToc : function(tree, ctx){
      return {
	title:tree.getTitle(),
	pageNo:tree.getPageNo(),
	tocId:ctx.getTocId(),
	headerId:tree.getHeaderId()
      };
    },
    _parseTree : function(self, parent, tree, ctx){
      if(tree === null){
	return parent;
      }
      var toc = self._createToc(tree, ctx);
      var li = self.createChild(toc);
      var link = self.createLink(toc);
      if(link){
	link.onclick = function(){
	  return self.onClickLink(toc);
	};
	li.appendChild(link);
      }
      var page_no_item = self.createPageNoItem(toc);
      if(page_no_item){
	li.appendChild(page_no_item);
      }
      parent.appendChild(li);

      var child = tree.getChild();
      if(child){
	ctx = ctx.startRoot();
	var child_toc = self._createToc(child, ctx);
	var ol = self.createRoot(child_toc);
	arguments.callee(self, ol, child, ctx);
	li.appendChild(ol);
	ctx = ctx.endRoot();
      }
      var next = tree.getNext();
      if(next){
	arguments.callee(self, parent, next, ctx.stepNext());
      }
      return parent;
    },
    onClickLink : function(toc){
      return false;
    },
    createRoot: function(toc){
      var root = document.createElement("ol");
      root.className = "nehan-toc-root";
      return root;
    },
    createChild : function(toc){
      var li = document.createElement("li");
      li.className = "nehan-toc-item";
      return li;
    },
    createLink : function(toc){
      var link = document.createElement("a");
      var title = toc.title.replace(/<a[^>]+>/gi, "").replace(/<\/a>/gi, "");
      link.href = "#" + toc.pageNo;
      link.innerHTML = title;
      link.className = "nehan-toc-link";
      link.id = Css.addNehanTocLinkPrefix(toc.tocId);
      return link;
    },
    createPageNoItem : function(toc){
      return null;
    }
  };

  return OutlineConverter;
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

  // header id to associate each header with outline.
  var __global_header_id = 0;
  var __global_page_no = 0;

  // anchors
  var __anchors = {};

  // document header
  var __header = new DocumentHeader();
  
  function DocumentContext(option){
    var opt = option || {};
    this.markup = opt.markup || null;
    this.stream = opt.stream || null;
    this.charPos = opt.charPos || 0;
    this.localPageNo = opt.localPageNo || 0;
    this.localLineNo = opt.localLineNo || 0;
    this.blockContext = opt.blockContext || null;
    this.inlineContext = opt.inlineContext || null;
    this.outlineContext = opt.outlineContext || new OutlineContext();
  }

  DocumentContext.prototype = {
    // docunemt type context
    setDocumentType : function(markup){
      this.documentType = markup;
    },
    // document position context
    isFirstLocalPage : function(){
      return this.localPageNo === 0;
    },
    isFirstLocalLine : function(){
      return this.localLineNo === 0;
    },
    stepLocalPageNo : function(){
      this.localPageNo++;
      return this.localPageNo;
    },
    getLocalPageNo : function(){
      return this.localPageNo;
    },
    // page pos / char pos
    getPageNo : function(){
      return __global_page_no;
    },
    getCharPos : function(){
      return this.charPos;
    },
    stepPageNo : function(){
      __global_page_no++;
    },
    addCharPos : function(char_count){
      this.charPos += char_count;
    },
    // stream context
    getStream : function(){
      return this.stream;
    },
    getStreamSrc : function(){
      return this.stream.getSrc();
    },
    hasNextToken : function(){
      return this.stream.hasNext();
    },
    getNextToken : function(){
      return this.stream.get();
    },
    pushBackToken : function(){
      this.stream.prev();
    },
    getStreamPos : function(){
      return this.stream.getPos();
    },
    getSeekPos : function(){
      return this.stream.getSeekPos();
    },
    getSeekPercent : function(){
      return this.stream.getSeekPercent();
    },
    getStreamTokenCount : function(){
      return this.stream.getTokenCount();
    },
    isStreamHead : function(){
      return this.stream.isHead();
    },
    // markup context
    inheritMarkup : function(markup, parent){
      parent = parent || this.markup;
      return markup.inherit(parent, this);
    },
    getMarkup : function(){
      return this.markup;
    },
    getMarkupStaticSize : function(parent){
      var font_size = parent? parent.getFontSize() : Layout.fontSize;
      var measure = parent? parent.getContentMeasure(parent.flow) : Layout.getStdMeasure();
      return this.markup? this.markup.getStaticSize(font_size, measure) : null;
    },
    getMarkupName : function(){
      return this.markup? this.markup.getName() : "";
    },
    getMarkupClasses : function(){
      return this.markup? this.markup.classes : [];
    },
    // block context
    createBlockRoot : function(markup, stream){
      stream = (stream === null)? null : (stream || new TokenStream(markup.getContent()));
      return new DocumentContext({
	markup:(markup? this.inheritMarkup(markup, this.markup) : null),
	stream:stream,
	charPos:this.charPos,
	outlineContext:this.outlineContext
      });
    },
    createFloatedRoot : function(){
      return new DocumentContext({
	markup:this.markup,
	stream:this.stream,
	charPos:this.charPos,
	blockContext:this.blockContext,
	outlineContext:this.outlineContext
      });
    },
    createInlineBlockRoot : function(markup, stream){
      var ctx = this.createBlockRoot(markup, stream);
      ctx.mode = "inline-block";
      return ctx;
    },
    createBlockContext : function(parent){
      this.blockContext = new BlockContext(parent);
      return this.blockContext;
    },
    addBlockElement : function(element){
      this.blockContext.addElement(element);
      if(element.isTextLine()){
	this.localLineNo++;
      }
    },
    canContainExtent : function(extent){
      if(this.blockContext){
	return this.blockContext.getRestExtent() >= extent;
      }
      return true;
    },
    // inline context
    createInlineRoot : function(markup, stream){
      stream = (stream === null)? null : (stream || new TokenStream(markup.getContent()));
      return new DocumentContext({
	markup:this.inheritMarkup(markup, this.markup),
	stream:stream,
	charPos:this.charPos,
	blockContext:this.blockContext, // inherit block context
	outlineContext:this.outlineContext
      });
    },
    createChildInlineRoot : function(markup, stream){
      var context = this.createInlineRoot(markup, stream);
      context.blockContext = null; // hide block context for child-inline-generator
      return context;
    },
    createInlineStream : function(){
      return this.stream.createRefStream(function(token){
	return token !== null && Token.isInline(token);
      });
    },
    createInlineContext : function(line){
      this.inlineContext = new InlineContext(line, this.stream);
      return this.inlineContext;
    },
    createLine : function(){
      return this.inlineContext.createLine();
    },
    getRestMeasure : function(){
      return this.inlineContext? this.inlineContext.getRestMeasure() : 0;
    },
    getInlineNextToken : function(){
      return this.inlineContext.getNextToken();
    },
    getInlineMaxMeasure : function(){
      return this.inlineContext.getMaxMeasure();
    },
    getInlineMaxExtent : function(){
      return this.inlineContext.getMaxExtent();
    },
    getInlineMaxFontSize : function(){
      return this.inlineContext.getMaxFontSize();
    },
    getInlineFontSize : function(){
      return this.inlineContext? this.inlineContext.getFontSize() : Layout.fontSize;
    },
    setLineBreak : function(){
      this.inlineContext.setLineBreak();
    },
    isJustified : function(){
      return this.inlineContext.isJustified();
    },
    restartInlineContext : function(max_measure){
      this.inlineContext.restart(max_measure);
    },
    addInlineElement : function(element){
      this.inlineContext.addElement(element);
    },
    // header context
    getHeader : function(){
      return __header;
    },
    addScript : function(markup){
      __header.addScript(markup);
    },
    addStyle : function(markup){
      __header.addStyle(markup);
    },
    // anchor context
    setAnchor : function(anchor_name){
      __anchors[anchor_name] = this.getPageNo();
    },
    getAnchors : function(){
      return __anchors;
    },
    getAnchorPageNo : function(anchor_name){
      return __anchors[anchor_name] || -1;
    },
    // outline context
    getOutlineBuffer : function(root_name){
      return this.outlineContext.getOutlineBuffer(root_name);
    },
    startSectionRoot : function(){
      var type = this.markup.getName();
      this.outlineContext.startSectionRoot(type);
    },
    endSectionRoot : function(){
      var type = this.markup.getName();
      return this.outlineContext.endSectionRoot(type);
    },
    logStartSection : function(){
      var type = this.markup.getName();
      this.outlineContext.logStartSection(type, this.getPageNo());
    },
    logEndSection : function(){
      var type = this.markup.getName();
      this.outlineContext.logEndSection(type);
    },
    logSectionHeader : function(){
      var type = this.markup.getName();
      var rank = this.markup.getHeaderRank();
      var title = this.markup.getContentRaw();
      var page_no = this.getPageNo();
      if(typeof this.markup.headerId === "undefined"){
	this.markup.headerId = __global_header_id++;
      }
      this.outlineContext.logSectionHeader(type, rank, title, page_no, this.markup.headerId);
      return this.markup.headerId;
    }
  };

  return DocumentContext;
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


var ElementGenerator = (function(){
  function ElementGenerator(context){
    this.context = context;
  }

  ElementGenerator.prototype = {
    hasNext : function(){
      return false;
    },
    // called when box is created, but no style is not loaded.
    _onReadyBox : function(box, parent){
    },
    // called when box is created, and std style is already loaded.
    _onCreateBox : function(box, parent){
    },
    _isTextLine : function(element){
      return element instanceof Box && element.isTextLine();
    },
    _createStaticGenerator : function(tag){
      switch(tag.getName()){
      case "img":
	return new ImageGenerator(this.context.createBlockRoot(tag, null));
      case "ibox":
	return new InlineBoxGenerator(this.context.createBlockRoot(tag, null));
      case "div":
	if(tag.hasFlow()){
	  return new InlinePageGenerator(this.context.createBlockRoot(tag));
	}
	return new InlineBoxGenerator(this.context.createBlockRoot(tag, null));
      default:
	return new InlinePageGenerator(this.context.createBlockRoot(tag));
      }
    },
    _createChildInlineTreeGenerator : function(tag){
      switch(tag.getName()){
      case "ruby":
	return new RubyGenerator(this.context.createChildInlineRoot(tag, new RubyTagStream(tag)));
      case "a":
	return new LinkGenerator(this.context.createChildInlineRoot(tag));
      case "first-line":
	return new FirstLineGenerator(this.context.createChildInlineRoot(tag));
      default:
	return new ChildInlineTreeGenerator(this.context.createChildInlineRoot(tag));
      }
    },
    _createInlineBlockGenerator : function(tag){
      return new InlineBlockGenerator(this.context.createInlineBlockRoot(tag));
    },
    _createChildBlockTreeGenerator : function(parent, tag){
      switch(tag.getName()){
      case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
	return new HeaderGenerator(this.context.createBlockRoot(tag));
      case "section": case "article": case "nav": case "aside":
	return new SectionContentGenerator(this.context.createBlockRoot(tag));
      case "details": case "blockquote": case "figure": case "fieldset":
	return new SectionRootGenerator(this.context.createBlockRoot(tag));
      case "table":
	return new TableGenerator(this.context.createBlockRoot(tag, new TableTagStream(tag)));
      case "tbody": case "thead": case "tfoot":
	return new TableRowGroupGenerator(this.context.createBlockRoot(tag, new DirectTokenStream(tag.tableChilds)));
      case "dl":
	return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag, new DefListTagStream(tag.getContent())));
      case "ul": case "ol":
	return new ListGenerator(this.context.createBlockRoot(tag, new ListTagStream(tag.getContent())));
      case "hr":
	return new HrGenerator(this.context.createBlockRoot(tag, null));
      case "tr":
	return this._createTableRowGenerator(parent, tag);
      case "li":
	return this._createListItemGenerator(parent, tag);
      default:
	return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag));
      }
    },
    _createTableRowGenerator : function(parent, tag){
      if(tag.tableChilds && parent.partition){
	var child_count = tag.tableChilds.length;
	var partition = parent.partition.getPartition(child_count);
	var context2 = this.context.createBlockRoot(tag); // tr
	return new ParallelGenerator(List.map(tag.tableChilds, function(td){
	  return new ParaChildGenerator(context2.createBlockRoot(td)); // tr -> td
	}), partition, context2);
      }
      return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag));
    },
    _createListItemGenerator : function(parent, tag){
      var list_style = parent.listStyle || null;
      if(list_style === null){
	return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag));
      }
      if(list_style.isInside()){
	return this._createInsideListItemGenerator(parent, tag);
      }
      return this._createOutsideListItemGenerator(parent, tag);
    },
    _createInsideListItemGenerator : function(parent, tag){
      var marker = parent.listStyle.getMarkerHtml(tag.order + 1);
      var content = Html.tagWrap("span", marker, {
	"class":"nehan-li-marker"
      }) + Const.space + tag.getContent();

      return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag, new TokenStream(content)));
    },
    _createOutsideListItemGenerator : function(parent, tag){
      var context2 = this.context.createBlockRoot(tag);
      var marker = parent.listStyle.getMarkerHtml(tag.order + 1);
      var markup_marker = new Tag("<li-marker>", marker);
      var markup_body = new Tag("<li-body>", tag.getContent());
      markup_marker.setCssAttr("font-family", Layout.markerFontFamily);
      return new ParallelGenerator([
	new ParaChildGenerator(context2.createBlockRoot(markup_marker)),
	new ParaChildGenerator(context2.createBlockRoot(markup_body))
      ], parent.partition, context2);
    },
    _getBoxSize : function(parent){
      return this.context.getMarkupStaticSize(parent) || parent.getRestSize();
    },
    _getLineSize : function(parent){
      var measure = parent.getContentMeasure();
      var extent = parent.getContentExtent();
      return parent.flow.getBoxSize(measure, extent);
    },
    _getBoxType : function(){
      return this.context.getMarkupName();
    },
    _setBoxClasses : function(box, parent){
      List.iter(this.context.getMarkupClasses(), function(klass){
	box.addClass(klass);
      });
    },
    _setBoxStyle : function(box, parent){
      if(this.context.markup){
	BoxStyle.set(this.context.markup, box, parent);
      }
    },
    _createLine : function(parent){
      var size = this._getLineSize(parent);
      return Layout.createBox(size, parent, {
	type:"text-line",
	markup:this.context.markup
      });
    },
    _createBox : function(size, parent){
      var box = Layout.createBox(size, parent, {
	type:this._getBoxType(),
	markup:this.context.markup
      });
      this._onReadyBox(box, parent);
      this._setBoxClasses(box, parent);
      this._setBoxStyle(box, parent);
      this._onCreateBox(box, parent);
      return box;
    }
  };

  return ElementGenerator;
})();


var StaticBlockGenerator = (function(){
  function StaticBlockGenerator(context){
    ElementGenerator.call(this, context);
  }
  Class.extend(StaticBlockGenerator, ElementGenerator);

  StaticBlockGenerator.prototype._getBoxSize = function(parent){
    return this.context.getMarkupStaticSize(parent);
  };

  StaticBlockGenerator.prototype._createBox = function(size, parent){
    var box = ElementGenerator.prototype._createBox.call(this, size, parent);
    box.sizing = BoxSizings.getByName("content-box"); // use normal box model
    return box;
  };

  StaticBlockGenerator.prototype._findLineParent = function(line){
    var parent = line.parent;
    while(parent && parent.isTextLine()){
      parent = parent.parent;
    }
    return parent;
  };

  StaticBlockGenerator.prototype.yield = function(parent){
    if(parent.isTextLine()){
      parent = this._findLineParent(parent);
    }
    return this._yield(parent);
  };

  StaticBlockGenerator.prototype._yield = function(parent){
    var size = this._getBoxSize(parent);
    var box = this._createBox(size, parent);
    if(box.isDisplayNone()){
      return Exceptions.IGNORE;
    }
    if(this.context.markup.isPush()){
      box.backward = true;
    }
    if(this.context.markup.isPull()){
      box.forward = true;
    }
    // get rest size without edge of box.
    var rest_size = parent.getRestSize();
    rest_size.width -= box.getEdgeWidth();
    rest_size.height -= box.getEdgeHeight();
    
    // even if edge can't be included, retry.
    if(!rest_size.isValid()){
      return Exceptions.SINGLE_RETRY;
    }
    // if rest size has prenty of space for this box, just return as it it.
    if(rest_size.canInclude(box.size)){
      return box;
    }
    var root_page_size = Layout.getStdPageSize();
    var reduced_size = box.size.resizeWithin(parent.flow, rest_size);

    // use reduced size if
    // 1. even root size of page can't include this box
    // 2. or reduced box size is within Config.minBlockScaleDownRate of original
    if(!root_page_size.canInclude(box.size) ||
       reduced_size.percentFrom(box.size) >= Config.minBlockScaleDownRate){
      box.size = reduced_size;
      return box;
    }
    return Exceptions.SINGLE_RETRY;
  };

  return StaticBlockGenerator;
})();


var InlineBoxGenerator = (function(){
  function InlineBoxGenerator(context){
    StaticBlockGenerator.call(this, context);
  }
  Class.extend(InlineBoxGenerator, StaticBlockGenerator);
  
  InlineBoxGenerator.prototype._getBoxType = function(){
    return "ibox";
  };

  InlineBoxGenerator.prototype._onCreateBox = function(box, parent){
    box.content = this.context.markup.getContentRaw();
    box.css.overflow = "hidden";
  };

  return InlineBoxGenerator;
})();


var ImageGenerator = (function(){
  function ImageGenerator(context){
    StaticBlockGenerator.call(this, context);
  }
  Class.extend(ImageGenerator, StaticBlockGenerator);

  ImageGenerator.prototype._onCreateBox = function(box, parent){
    box.src = this.context.markup.getTagAttr("src");
  };

  return ImageGenerator;
})();


var HrGenerator = (function(){
  function HrGenerator(context){
    ElementGenerator.call(this, context);
  }
  Class.extend(HrGenerator, ElementGenerator);
  
  HrGenerator.prototype._getBoxSize = function(parent){
    var measure = parent? parent.getContentMeasure() : Layout.getStdMeasure();
    return parent.flow.getBoxSize(measure, 1);
  };
  
  HrGenerator.prototype.yield = function(parent){
    var size = this._getBoxSize(parent);
    var box = this._createBox(size, parent);
    return box;
  };

  return HrGenerator;
})();


var InlineContext = (function(){
  function InlineContext(line, stream){
    this.line = line;
    this.stream = stream;
    this.lineStartPos = stream.getPos();
    this.textIndent = stream.isHead()? (line.textIndent || 0) : 0;
    this.maxFontSize = 0;
    this.maxExtent = 0;
    this.maxMeasure = line.getContentMeasure() - this.textIndent;
    this.lineMeasure = line.getContentMeasure();
    this.curMeasure = 0;
    this.charCount = 0;
    this.lineBreak = false;
    this.lastToken = null;
    this.prevText = null;
    this.lastText = null;
    this.tokens = [];
    this._justified = false;
  }

  InlineContext.prototype = {
    restart : function(measure){
      this.maxMeasure = measure - this.textIndent;
      this.lineMeasure = measure;
      this._justified = false;
    },
    isLineStartPos : function(element){
      var ptr = this.line;
      while(ptr.parent !== null){
	if(ptr.childMeasure > 0){
	  return false;
	}
	ptr = ptr.parent;
      }
      return true;
    },
    skipBr : function(){
      this.stream.skipIf(function(token){
	return token && Token.isTag(token) && token.getName() === "br";
      });
    },
    isJustified : function(){
      return this._justified;
    },
    addElement : function(element){
      var advance = this._getElementAdvance(element);
      if(!this._canContain(element, advance)){
	if(advance > 0 && this.isLineStartPos(element)){
	  throw "LayoutError";
	}
	this.skipBr();
	throw "OverflowInline";
      }
      var font_size = this._getElementFontSize(element);
      if(font_size > this.maxFontSize){
	this.maxFontSize = font_size;
      }
      var extent = this._getElementExtent(element);
      if(extent > this.maxExtent){
	this.maxExtent = extent;
      }
      if(element.getCharCount){
	this.charCount += element.getCharCount();
      }
      if(advance > 0 && extent > 0){
	this.curMeasure += advance;
	// update current line measure before 'InlineContext::createLine'
	// to recognize whether current pos is at the start of line or not.
	// this value is used in 'InlineContext::isLineStartPos'.
	this.line.setChildMeasure(this.curMeasure);
	this.tokens.push(element);
      }
      if(this.curMeasure === this.maxMeasure){
	this.skipBr();
	throw "FinishInline";
      }
    },
    setLineBreak : function(){
      this.lastText = null;
      this.lineBreak = true;
    },
    createLine : function(){
      if(this.curMeasure === 0 && this.line.isTextLineRoot()){
	return this._createEmptyLine();
      }

      // if overflow measure without line-break, try to justify.
      if(this._isOverWithoutLineBreak()){
	var old_len = this.tokens.length;
	this._justify(this.lastToken);
	if(this.tokens.length !== old_len){
	  var self = this;
	  this._justified = true;
	  this.curMeasure = List.fold(this.tokens, 0, function(sum, token){
	    return sum + self._getElementAdvance(token);
	  });
	}
      }
      return this._createTextLine();
    },
    getNextToken : function(){
      var token = this.stream.get();

      // TODO:
      // skip head space before head word token.
      // example: &nbsp;&nbsp;aaa -> aaa

      this.lastToken = token;
      if(token && Token.isText(token)){
	this._setKerning(token);
      }
      return token;
    },
    getRestMeasure : function(){
      return this.line.getContentMeasure() - this.curMeasure;
    },
    getFontSize : function(){
      return this.line.getFontSize();
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    getMaxFontSize : function(){
      return this.maxFontSize;
    },
    getMaxExtent : function(){
      return this.maxExtent;
    },
    _getElementExtent : function(element){
      if(Token.isText(element)){
	if((Token.isChar(element) || Token.isTcy(element)) && this.line.textEmpha && this.line.textEmpha.isEnable()){
	  return this.line.textEmpha.getExtent(this.line.getFontSize());
	}
	return this.line.getFontSize();
      }
      if(element instanceof Ruby){
	return element.getExtent(this.line.getFontSize());
      }
      return element.getBoxExtent(this.line.flow);
    },
    _getElementFontSize : function(element){
      return (element instanceof Box)? element.getFontSize() : this.line.getFontSize();
    },
    _getElementAdvance : function(element){
      if(Token.isText(element)){
	return element.getAdvance(this.line.flow, this.line.letterSpacing || 0);
      }
      if(element instanceof Ruby){
	return element.getAdvance(this.line.flow);
      }
      return element.getBoxMeasure(this.line.flow);
    },
    _isJustifyElement : function(element){
      if(element instanceof Char){
	return true;
      }
      if(element instanceof Ruby && this.curMeasure > 0){
	return true;
      }
      return false;
    },
    _canContain : function(element, advance){
      // space for justify is required for justify target.
      if(this.line.isJustifyTarget()){
	return this.curMeasure + advance + this.line.getFontSize() <= this.maxMeasure;
      }
      return this.curMeasure + advance <= this.maxMeasure;
    },
    _isOverWithoutLineBreak : function(){
      return !this.lineBreak && (this.tokens.length > 0);
    },
    _isLineStart : function(){
      return this.stream.getPos() == this.lineStartPos;
    },
    _setKerning : function(token){
      this.prevText = this.lastText;
      this.lastText = token;
      if(Token.isChar(token)){
	if(token.isKakkoStart()){
	  this._setKerningStart(token, this.prevText);
	} else if(token.isKakkoEnd() || token.isKutenTouten()){
	  var next_text = this.stream.findTextNext(token.pos);
	  this._setKerningEnd(token, next_text);
	}
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
    },
    _justify : function(last_token){
      var head_token = last_token;
      var tail_token = last_token? this.stream.findTextPrev(last_token.pos) : null;
      var backup_pos = this.stream.getPos();

      // head text of next line meets head-NG.
      if(head_token &&
	 Token.isChar(head_token) &&
	 head_token.isHeadNg()){
	this._justifyHead(head_token);
	if(this.stream.getPos() != backup_pos){ // some text is moved by head-NG.
	  tail_token = this.stream.findTextPrev(); // search tail_token from new stream position pointing to new head pos.
	  // if new head is single br, this must be included in current line, so skip it.
	  this.skipBr();
	}
      }
      // tail text of this line meets tail-NG.
      if(tail_token &&
	 head_token &&
	 tail_token.pos < head_token.pos &&
	 Token.isText(head_token) &&
	 Token.isChar(tail_token) &&
	 tail_token.isTailNg()){
	this._justifyTail(tail_token);
      }
    },
    // fix line that is started with wrong text.
    _justifyHead : function(head_token){
      var count = 0;
      this.stream.iterWhile(head_token.pos, function(pos, token){
	if(Token.isChar(token) && token.isHeadNg()){
	  count++;
	  return true; // continue
	}
	return false;
      });
      // no head NG, just return texts as they are.
      if(count <= 0){
	return;
      }
      // if one head NG, push it into current line.
      if(count === 1){
	this.tokens.push(head_token);
	this.stream.setPos(head_token.pos + 1);
	return;
      }
      // if more than two head NG, find non NG text from tail, and cut the line at the pos.
      var normal_pos = -1;
      this.stream.revIterWhile(head_token.pos, function(pos, token){
	if(pos <= this.lineStartPos){
	  return false; // break (error)
	}
	if(Token.isChar(token) && !token.isHeadNg()){
	  normal_pos = pos; // non head NG text is found
	  return false; // break (success)
	}
	return true; // continue
      });
      // if no proper pos is found in current line, give up justifying.
      if(normal_pos < 0){
	return;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = head_token.pos;
      while(ptr > normal_pos){
	this.tokens.pop();
	ptr--;
      }
      // set stream position at the normal pos.
      this.stream.setPos(normal_pos);
    },
    // fix line that is ended with wrong text.
    _justifyTail : function(tail_token){
      var count = 0;
      this.stream.revIterWhile(tail_token.pos, function(pos, token){
	if(Token.isChar(token) && token.isTailNg()){
	  count++;
	  return true;
	}
	return false;
      });
      // no tail NG, just return texts as they are.
      if(count <= 0){
	return;
      }
      // if one tail NG, pop it(tail token is displayed in next line).
      if(count === 1){
	this.tokens.pop();
	this.stream.setPos(tail_token.pos);
	return;
      }
      // if more than two tail NG, find non NG text from tail, and cut the line at the pos.
      var normal_pos = -1;
      this.stream.revIterWhile(tail_token.pos, function(pos, token){
	if(pos <= this.lineStartPos){
	  return false; // break (error)
	}
	if(Token.isChar(token) && !token.isTailNg()){
	  normal_pos = pos; // non tail NG text is found.
	  return false; // break (success)
	}
	return true; // continue
      });
      // if no proper pos is found in current line, give up justifying.
      if(normal_pos < 0){
	return;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = tail_token.pos;
      while(ptr > normal_pos){
	this.tokens.pop();
	ptr--;
      }
      // set stream postion at the 'next' of normal pos.
      this.stream.setPos(normal_pos + 1);
    },
    _createEmptyLine : function(){
      this.line.size = this.line.flow.getBoxSize(this.lineMeasure, this.line.getFontSize());
      this.line.setInlineElements([], this.lineMeasure);
      return this.line;
    },
    _createTextLine : function(){
      var ruby_extent = Math.round(this.maxFontSize * (this.line.lineRate - 1));
      var max_text_extent = this.maxFontSize + ruby_extent;
      this.maxExtent = Math.max(this.maxExtent, max_text_extent);
      this.line.size = this.line.flow.getBoxSize(this.lineMeasure, this.maxExtent);
      this.line.charCount = this.charCount;
      this.line.setInlineElements(this.tokens, this.curMeasure);
      this.line.textIndent = this.textIndent;
      return this.line;
    }
  };

  return InlineContext;
})();


var BlockContext = (function(){
  function BlockContext(page){
    this.page = page;
    this.curExtent = 0;
    this.maxExtent = page.getContentExtent();
  }

  BlockContext.prototype = {
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
    },
    addElement : function(element){
      var is_absolute = element.isPositionAbsolute();
      var extent = element.getBoxExtent(this.page.flow);
      if(element instanceof Box && !element.isTextLine() && extent <= 0){
	element.pageBreakAfter = true;
      }
      if(!is_absolute && this.curExtent + extent > this.maxExtent){
	throw "OverflowBlock";
      }
      this.page.addChildBlock(element);
      if(!is_absolute){
	this.curExtent += extent;
      }
      if(!is_absolute && this.curExtent === this.maxExtent){
	throw "FinishBlock";
      }
    }
  };
  
  return BlockContext;
})();


var BlockTreeGenerator = (function(){
  function BlockTreeGenerator(context){
    ElementGenerator.call(this, context);
    this.generator = null;
  }
  Class.extend(BlockTreeGenerator, ElementGenerator);

  BlockTreeGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    if(this.generator && this.generator.hasNext()){
      return true;
    }
    return this.context.hasNextToken();
  };

  BlockTreeGenerator.prototype.getCurGenerator = function(){
    if(this.generator && this.generator.hasNext()){
      return this.generator;
    }
    return null;
  };

  // called when page box is fully filled.
  BlockTreeGenerator.prototype._onCompleteBlock = function(page){
  };

  BlockTreeGenerator.prototype._onLastBlock = function(page){
  };

  // if size is not defined, rest size of parent is used.
  // if parent is null, root page is generated.
  BlockTreeGenerator.prototype.yield = function(parent, size){
    var page_box, page_size;
    page_size = size || this._getBoxSize(parent);
    page_box = this._createBox(page_size, parent);
    if(page_box.isDisplayNone()){
      this._terminate = true;
      return Exceptions.IGNORE;
    }
    return this._yieldBlocksTo(page_box);
  };

  // fill page with child page elements.
  BlockTreeGenerator.prototype._yieldBlocksTo = function(page){
    this.context.createBlockContext(page);
    if(this.generator){
      this.generator.context.blockContext = this.context.blockContext;
    }

    while(true){
      var element = this._yieldBlockElement(page);
      if(typeof element === "number"){ // exception
	if(element == Exceptions.IGNORE){
	  continue;
	} else if(element == Exceptions.SINGLE_RETRY){
	  this.context.pushBackToken();
	  page.breakAfter = true;
	  break;
	} else if(element == Exceptions.PAGE_BREAK){
	  page.breakAfter = true;
	  break;
	} else {
	  break;
	}
      }
      try {
	var break_before = element.breakBefore || false;
	var break_after = element.breakAfter || false;
	if(break_before){
	  page.breakAfter = true;
	  break;
	}
	if(element.logicalFloat){
	  page.logicalFloat = element.logicalFloat;
	  element = this._yieldFloatedBlock(page, element);
	}
	this.context.addBlockElement(element);
	if(break_after){
	  page.breakAfter = true;
	  break;
	}
      } catch(e){
	if(e === "FinishBlock"){
	  page.breakAfter = true;
	}
	break;
      }
    }
    if(!this.context.isFirstLocalPage()){
      page.clearBorderBefore();
    }
    if(!this.hasNext()){
      this._onLastBlock(page);
    } else {
      page.clearBorderAfter();
    }
    this._onCompleteBlock(page);

    // if content is not empty, increment local page no.
    if(page.getBoxExtent() > 0){
      this.context.stepLocalPageNo();
    }
    return page;
  };

  BlockTreeGenerator.prototype._yieldBlockElement = function(parent){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(parent);
    }
    this.generator = null;
    var token = this.context.getNextToken();
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    var is_tag = Token.isTag(token);
    if(Token.isChar(token) && token.isNewLineChar()){
      return Exceptions.IGNORE;
    }
    if(is_tag && token.isPageBreakTag()){
      return Exceptions.PAGE_BREAK;
    }
    if(is_tag && token.isMetaTag()){
      return Exceptions.IGNORE;
    }
    if(is_tag){
      this.context.inheritMarkup(token);
    }
    if(is_tag && token.hasStaticSize() && token.isBlock()){
      this.generator = this._createStaticGenerator(token);
      return this.generator.yield(parent);
    }
    if(Token.isText(token) || Token.isInline(token)){
      this.context.pushBackToken();
      this.generator = new InlineTreeGenerator(
	this.context.createInlineRoot(this.context.markup, this.context.stream)
      );
      return this.generator.yield(parent);
    }
    // now token is not text, it's a tag object.
    if(token.isInline() || token.isInlineBlock()){
      this.generator = this._createChildInlineTreeGenerator(token);
      return this.generator.yield(parent);
    }
    // if different flow is defined in this block tag,
    // yield it as single inline page with rest size of current parent.
    if(token.hasFlow() && token.getCssAttr("flow") != parent.getFlowName()){
      var inline_size = parent.getRestSize();
      var generator = new InlinePageGenerator(this.context.createBlockRoot(token));
      return generator.yield(parent, inline_size);
    }
    this.generator = this._createChildBlockTreeGenerator(parent, token);
    return this.generator.yield(parent);
  };

  BlockTreeGenerator.prototype._yieldFloatedBlock = function(parent, floated_box){
    if(parent.getContentMeasure() <= floated_box.getBoxMeasure()){
      return floated_box;
    }
    var generator = new FloatedBlockTreeGenerator(this.context.createFloatedRoot(), floated_box);
    var block = generator.yield(parent);
    this.generator = generator.getCurGenerator(); // inherit generator of aligned area
    if(this.generator){
      this.generator.context.blockContext = this.context.blockContext; // and inherit parent block context
    }
    return block;
  };

  return BlockTreeGenerator;
})();


var InlineTreeGenerator = (function(){
  function InlineTreeGenerator(context){
    BlockTreeGenerator.call(this, context);
    this.cachedLine = null;
    this._prevStart = 0;
    this._retry = 0;
  }
  Class.extend(InlineTreeGenerator, BlockTreeGenerator);

  InlineTreeGenerator.prototype.getParentPos = function(){
    return this.context.markup.pos;
  };

  InlineTreeGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    if(this.cachedElement || this.cachedLine){
      return true;
    }
    return BlockTreeGenerator.prototype.hasNext.call(this);
  };

  // called when line box is fully filled.
  InlineTreeGenerator.prototype._onCompleteLine = function(line){
    line.setMaxExtent(this.context.getInlineMaxExtent());
  };

  InlineTreeGenerator.prototype._isEnableElement = function(element){
    if(element instanceof Box){
      return element.getContentExtent() > 0 && element.getContentMeasure() > 0;
    }
    return true;
  };

  InlineTreeGenerator.prototype.yield = function(parent){
    if(this.cachedLine){
      return this._yieldCachedLine(parent);
    }
    var line = this._createLine(parent);
    if(line.isDisplayNone()){
      this._terminate = true;
      return Exceptions.IGNORE;
    }
    this.context.createInlineContext(line);
    return this._yieldInlinesTo(line);
  };

  InlineTreeGenerator.prototype._yieldCachedElement = function(parent){
    var ret = this.cachedElement;
    this.cachedElement = null;
    return ret;
  };

  InlineTreeGenerator.prototype._yieldCachedLine = function(parent){
    var line = this.cachedLine;
    var old_measure = line.parent.getContentMeasure();
    var cur_measure = parent.getContentMeasure();
    line.parent = parent;
    this.cachedLine = null;
    if(old_measure == cur_measure){
      return line;
    }
    // restart line context with new max-measure.
    this.context.restartInlineContext(parent.getContentMeasure());
    return this._yieldInlinesTo(line);
  };

  InlineTreeGenerator.prototype._yieldInlinesTo = function(parent){
    var end_after = false;
    var start_pos = this.context.getStreamPos();
    if(start_pos === this._prevStart){
      this._retry++;
      if(this._retry > Config.maxRollbackCount){
	var skip = this.context.getNextToken();
	this._retry = 0;
      }
    } else {
      this._retry = 0;
      this._prevStart = start_pos;
    }
    while(true){
      var element = this._yieldInlineElement(parent);
      if(typeof element === "number"){ // exceptions
	if(element == Exceptions.IGNORE){
	  continue;
	} else {
	  this.context.setLineBreak();
	  if(element === Exceptions.FORCE_TERMINATE){
	    this.context.pushBackToken();
	  } else if(element == Exceptions.SINGLE_RETRY){
	    this.context.pushBackToken();
	    end_after = true;
	  }
	  break;
	}
      }

      try {
	end_after = element.endAfter || false;
	if(element.logicalFloat){
	  return element;
	}
	this.context.addInlineElement(element);
	if(end_after){
	  break;
	}
      } catch(e){
	if(e === "OverflowInline"){
	  end_after = true;
	  this.cachedElement = this._isEnableElement(element)? element : null;
	}
	break;
      }

      // if devided word, line break and parse same token again.
      if(element instanceof Word && element.isDevided()){
	this.context.pushBackToken();
	break;
      }
    } // while(true)

    line = this.context.createLine();
    if(end_after){
      line.endAfter = true;
    }
    this._onCompleteLine(line);
    if(this.context.isJustified()){
      this.cachedElement = null;
    }
    if(!this.context.canContainExtent(line.getBoxExtent(parent.flow))){
      this.cachedLine = line;
      return Exceptions.PAGE_BREAK;
    }
    return line;
  };

  InlineTreeGenerator.prototype._yieldInlineElement = function(line){
    if(this.cachedElement){
      return this._yieldCachedElement(line);
    }
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(line);
    }
    this.generator = null;
    var token = this.context.getInlineNextToken();
    return this._yieldInlineToken(line, token);
  };

  InlineTreeGenerator.prototype._yieldInlineToken = function(line, token){
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    if(token instanceof Ruby){
      return token;
    }
    // CRLF
    if(Token.isChar(token) && token.isNewLineChar()){

      // if pre, treat CRLF as line break
      if(line.isPreLine()){
	return Exceptions.LINE_BREAK;
      }
      // others, just ignore
      return Exceptions.IGNORE;
    }
    if(Token.isText(token)){
      return this._yieldText(line, token);
    }
    if(token.isMetaTag()){
      return Exceptions.IGNORE;
    }
    var tag_name = token.getName();
    if(tag_name === "br"){
      return Exceptions.LINE_BREAK;
    }
    this.context.inheritMarkup(token);

    // if block element occured, force terminate generator
    if(token.isBlock()){
      this._terminate = true;
      return Exceptions.FORCE_TERMINATE;
    }
    // token is static size tag
    if(token.hasStaticSize()){
      this.generator = this._createStaticGenerator(token);
      return this.generator.yield(line);
    }
    // token is inline-block tag
    if(token.isInlineBlock()){
      this.generator = this._createInlineBlockGenerator(token);
      return this.generator.yield(line);
    }
    if(token.isSingleTag()){
      return token;
    }
    this.generator = this._createChildInlineTreeGenerator(token);
    return this.generator.yield(line);
  };

  InlineTreeGenerator.prototype._yieldText = function(line, text){
    // always set metrics for first-line, because style of first-line tag changes whether it is first-line or not.
    if(this.context.getMarkupName() === "first-line" || !text.hasMetrics()){
      text.setMetrics(line.flow, line.font);
    }
    switch(text._type){
    case "char":
    case "tcy":
      return text;
    case "word":
      return this._yieldWord(line, text);
    }
  };

  InlineTreeGenerator.prototype._yieldWord = function(line, word){
    var advance = word.getAdvance(line.flow, line.letterSpacing || 0);
    var max_measure = this.context.getInlineMaxMeasure();

    // if advance of this word is less than max-measure, just return.
    if(advance <= max_measure){
      word.setDevided(false);
      return word;
    }
    // if advance is lager than max_measure,
    // we must cut this word into some parts.
    var part = word.cutMeasure(line.getFontSize(), max_measure); // get sliced word
    part.setMetrics(line.flow, line.font); // metrics for first half
    word.setMetrics(line.flow, line.font); // metrics for second half
    return part;
  };

  return InlineTreeGenerator;
})();


var ChildInlineTreeGenerator = (function(){
  function ChildInlineTreeGenerator(context){
    InlineTreeGenerator.call(this, context);
  }
  Class.extend(ChildInlineTreeGenerator, InlineTreeGenerator);

  ChildInlineTreeGenerator.prototype._createLine = function(parent){
    var line = InlineTreeGenerator.prototype._createLine.call(this, parent);
    this._setBoxStyle(line, parent);
    return line;
  };

  ChildInlineTreeGenerator.prototype._getLineSize = function(parent){
    var measure = parent.getContentMeasure();
    if(this.context.isFirstLocalLine()){
      measure -= parent.childMeasure;
    }
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  };

  ChildInlineTreeGenerator.prototype._onCompleteLine = function(line){
    line.shortenMeasure();
  };

  return ChildInlineTreeGenerator;
})();


var RubyGenerator = (function(){
  function RubyGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
  }
  Class.extend(RubyGenerator, ChildInlineTreeGenerator);

  RubyGenerator.prototype._yieldInlineElement = function(line){
    var ruby = ChildInlineTreeGenerator.prototype._yieldInlineElement.call(this, line);
    if(typeof ruby === "number"){
      return ruby; // exception
    }
    // avoid overwriting metrics.
    if(!ruby.hasMetrics()){
      ruby.setMetrics(line.flow, line.font, line.letterSpacing || 0);
    }
    return ruby;
  };

  return RubyGenerator;
})();


var RtGenerator = (function(){
  function RtGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
  }
  Class.extend(RtGenerator, ChildInlineTreeGenerator);

  RtGenerator.prototype._getLineSize = function(parent){
    var measure = parent.getContentMeasure();
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  };

  return RtGenerator;
})();


var LinkGenerator = (function(){
  function LinkGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
    var anchor_name = this.context.markup.getTagAttr("name");
    if(anchor_name){
      this.context.setAnchor(anchor_name);
    }
  }
  Class.extend(LinkGenerator, ChildInlineTreeGenerator);

  return LinkGenerator;
})();


var FirstLineGenerator = (function(){
  function FirstLineGenerator(context){
    ChildInlineTreeGenerator.call(this, context);
  }
  Class.extend(FirstLineGenerator, ChildInlineTreeGenerator);

  FirstLineGenerator.prototype._createLine = function(parent){
    // first-line already created, so clear static attr for first-line tag.
    if(!this.context.isStreamHead()){
      this.context.markup.cssAttrStatic = {};
    }
    return ChildInlineTreeGenerator.prototype._createLine.call(this, parent);
  };

  return FirstLineGenerator;
})();


var InlineBlockGenerator = (function(){
  function InlineBlockGenerator(context){
    BlockTreeGenerator.call(this, context);
  }
  Class.extend(InlineBlockGenerator, BlockTreeGenerator);
  
  InlineBlockGenerator.prototype._getBoxType = function(){
    return "inline-block";
  };

  return InlineBlockGenerator;
})();


var ChildBlockTreeGenerator = (function(){
  function ChildBlockTreeGenerator(context){
    BlockTreeGenerator.call(this, context);
  }
  Class.extend(ChildBlockTreeGenerator, BlockTreeGenerator);
  
  // resize page to sum of total child size.
  ChildBlockTreeGenerator.prototype._onCompleteBlock = function(page){
    page.shortenExtent(page.getParentFlow());
  };

  return ChildBlockTreeGenerator;
})();

var SectionContentGenerator = (function(){
  function SectionContentGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
    this.context.logStartSection();
  }
  Class.extend(SectionContentGenerator, ChildBlockTreeGenerator);

  SectionContentGenerator.prototype._onLastBlock = function(page){
    this.context.logEndSection();
  };

  return SectionContentGenerator;
})();


var SectionRootGenerator = (function(){
  function SectionRootGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
    this.context.startSectionRoot();
  }
  Class.extend(SectionRootGenerator, ChildBlockTreeGenerator);

  SectionRootGenerator.prototype.hasOutline = function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    return buffer.isEmpty() === false;
  };

  SectionRootGenerator.prototype.getOutlineBuffer = function(root_name){
    var name = root_name || this.context.getMarkupName();
    return this.context.getOutlineBuffer(name);
  };

  SectionRootGenerator.prototype.getOutlineTree = function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    var tree = (new OutlineParser(buffer)).getTree();
    return tree;
  };

  SectionRootGenerator.prototype.getAnchors = function(){
    return this.context.getAnchors();
  };

  SectionRootGenerator.prototype.getAnchorPageNo = function(anchor_name){
    return this.context.getAnchorPageNo(anchor_name);
  };

  SectionRootGenerator.prototype.setAnchor = function(name, page_no){
    this.context.setAnchor(name, page_no);
  };

  SectionRootGenerator.prototype._onLastBlock = function(page){
    this.context.endSectionRoot();
    ChildBlockTreeGenerator.prototype._onLastBlock.call(this, page);
  };

  return SectionRootGenerator;
})();


var HeaderGenerator = (function(){
  function HeaderGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(HeaderGenerator, ChildBlockTreeGenerator);

  HeaderGenerator.prototype._onCompleteBlock = function(page){
    ChildBlockTreeGenerator.prototype._onCompleteBlock.call(this, page);
    var header_id = this.context.logSectionHeader();
    page.id = Css.addNehanHeaderPrefix(header_id);
  };
  
  HeaderGenerator.prototype._onCreateBox = function(box, parent){
    box.addClass("nehan-header");
  };

  return HeaderGenerator;
})();


var BodyBlockTreeGenerator = (function(){
  function BodyBlockTreeGenerator(context){
    SectionRootGenerator.call(this, context);
  }
  Class.extend(BodyBlockTreeGenerator, SectionRootGenerator);

  BodyBlockTreeGenerator.prototype._getBoxSize = function(){
    return Layout.getStdPageSize();
  };

  BodyBlockTreeGenerator.prototype._createBox = function(size, parent){
    var box = Layout.createRootBox(size);
    this._setBoxStyle(box, null);
    box.percent = this.context.getSeekPercent();
    box.seekPos = this.context.getSeekPos();
    box.pageNo = this.context.getPageNo();
    box.charPos = this.context.getCharPos();
    return box;
  };

  BodyBlockTreeGenerator.prototype._onCompleteBlock = function(page){
    // step page no and character count inside this page
    this.context.stepPageNo();
    this.context.addCharPos(page.getCharCount());
  };

  return BodyBlockTreeGenerator;
})();


var FloatedBlockTreeGenerator = (function(){
  function FloatedBlockTreeGenerator(context, floated_box){
    BlockTreeGenerator.call(this, context);
    this.floatedBox = floated_box;
  }
  Class.extend(FloatedBlockTreeGenerator, BlockTreeGenerator);
  
  FloatedBlockTreeGenerator.prototype.yield = function(parent){
    var wrap_box = this._getFloatedWrapBox(parent, this.floatedBox);
    var rest_box = this._getFloatedRestBox(parent, wrap_box, this.floatedBox);
    this._yieldBlocksTo(rest_box);
    if(this.floatedBox.logicalFloat === "start"){
      wrap_box.addChildBlock(this.floatedBox);
      wrap_box.addChildBlock(rest_box);
    } else {
      wrap_box.addChildBlock(rest_box);
      wrap_box.addChildBlock(this.floatedBox);
    }
    return wrap_box;
  };

  FloatedBlockTreeGenerator.prototype._getFloatedRestBox = function(parent, wrap_box, floated_box){
    var rest_measure = parent.getContentMeasure() - floated_box.getBoxMeasure(parent.flow);
    var rest_extent = floated_box.getBoxExtent(parent.flow);
    var rest_size = parent.flow.getBoxSize(rest_measure, rest_extent);
    var rest_box = Layout.createBox(rest_size, wrap_box, {type:"box"});
    rest_box.setFlow(parent.flow);
    return rest_box;
  };

  FloatedBlockTreeGenerator.prototype._getFloatedWrapBox = function(parent, floated_box){
    var wrap_measure = parent.getContentMeasure();
    var wrap_extent = floated_box.getBoxExtent(parent.flow);
    var wrap_box_size = parent.flow.getBoxSize(wrap_measure, wrap_extent);
    var wrap_box = Layout.createBox(wrap_box_size, parent, {type:"box"});
    var wrap_flow = parent.getFloatedWrapFlow();
    wrap_box.setParent(parent, false);
    wrap_box.setFlow(wrap_flow);
    floated_box.setParent(wrap_box, true);
    return wrap_box;
  };

  return FloatedBlockTreeGenerator;
})();


// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = (function(){
  function InlinePageGenerator(context){
    BlockTreeGenerator.call(this, context);
  }
  Class.extend(InlinePageGenerator, BlockTreeGenerator);

  InlinePageGenerator.prototype.hasNext = function(){
    return false;
  };

  InlinePageGenerator.prototype.yield = function(parent){
    var size = this._getBoxSize(parent);
    var wrap = Layout.createBox(size, parent, {type:"div"});
    var page = BlockTreeGenerator.prototype.yield.call(this, wrap);
    if(typeof page === "number"){
      return page; // exception
    }
    wrap.addChildBlock(page);
    wrap.logicalFloat = page.logicalFloat;
    return wrap;
  };

  return InlinePageGenerator;
})();


// parallel generator is proxy of multiple generators.
var ParallelGenerator = (function(){
  function ParallelGenerator(generators, partition, context){
    ChildBlockTreeGenerator.call(this, context);
    this.generators = generators;
    this.partition = partition;
  }
  Class.extend(ParallelGenerator, ChildBlockTreeGenerator);

  ParallelGenerator.prototype.hasNext = function(){
    return List.exists(this.generators, function(generator){
      return generator.hasNext();
    });
  };

  ParallelGenerator.prototype.yield = function(parent){
    var wrap_size = parent.getRestSize();
    var wrap_page = this._createBox(wrap_size, parent);
    var wrap_flow = parent.getParallelFlow();
    var child_flow = parent.flow;
    wrap_page.setFlow(wrap_flow);
    return this._yieldChildsTo(wrap_page, child_flow, this.partition);
  };

  ParallelGenerator.prototype._yieldChildsTo = function(wrap_page, child_flow, partition){
    var child_extent = wrap_page.getRestContentExtent();
    var child_pages = List.mapi(this.generators, function(index, generator){
      var child_measure = partition.getSize(index);
      var child_size = child_flow.getBoxSize(child_measure, child_extent);
      var element = generator.yield(wrap_page, child_size);
      if(element.breakBefore){
	wrap_page.breakAfter = true;
	return null;
      }
      if(element.breakAfter){
	wrap_page.breakAfter = true;
      }
      return element;
    });
    var max_child = List.maxobj(child_pages, function(child_page){
      return (child_page instanceof Box)? child_page.getContentExtent() : 0;
    });
    var max_content_extent = max_child? max_child.getContentExtent() : 0;
    var max_box_extent = max_child? max_child.getBoxExtent() : 0;

    wrap_page.setContentExtent(child_flow, max_box_extent);
    
    // resize each child by uniform extent size.
    List.iter(child_pages, function(child_page){
      if(child_page && child_page instanceof Box){
	child_page.setContentExtent(child_flow, max_content_extent);
	wrap_page.addParaChildBlock(child_page);
      }
    });
    return wrap_page;
  };

  return ParallelGenerator;
})();


var ParaChildGenerator = (function(){
  function ParaChildGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(ParaChildGenerator, ChildBlockTreeGenerator);

  ParaChildGenerator.prototype._setBoxEdge = function(){
    // do nothing
  };

  ParaChildGenerator.prototype._onReadyBox = function(box, parent){
    // wrap box(parent) has parallel flow, so flip it to get original one.
    var flow = parent.getParallelFlipFlow();
    box.setFlow(flow);
  };

  return ParaChildGenerator;
})();


var TableGenerator = (function(){
  function TableGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(TableGenerator, ChildBlockTreeGenerator);

  TableGenerator.prototype._onReadyBox = function(box, parent){
    if(this.context.markup.getCssAttr("border-collapse") === "collapse"){
      if(typeof this.collapse == "undefined"){
	Collapse.set(this.context.markup, box);
	this.collapse = true; // set collapse flag(means collapse already calcurated).
      }
    }
  };

  TableGenerator.prototype._onCreateBox = function(box, parent){
    box.partition = this.context.stream.getPartition(box);
  };

  return TableGenerator;
})();


var TableRowGroupGenerator = (function(){
  function TableRowGroupGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(TableRowGroupGenerator, ChildBlockTreeGenerator);

  TableRowGroupGenerator.prototype._onCreateBox = function(box, parent){
    box.partition = parent.partition;
  };

  return TableRowGroupGenerator;
})();


var ListGenerator = (function(){
  function ListGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
  }
  Class.extend(ListGenerator, ChildBlockTreeGenerator);

  ListGenerator.prototype._onCreateBox = function(box, parent){
    var item_count = this.context.getStreamTokenCount();
    var list_style_type = this.context.markup.getCssAttr("list-style-type", "none");
    var list_style_pos = this.context.markup.getCssAttr("list-style-position", "outside");
    var list_style_image = this.context.markup.getCssAttr("list-style-image", "none");
    var list_style_format = this.context.markup.getCssAttr("list-style-format");
    var list_style = new ListStyle({
      type:list_style_type,
      position:list_style_pos,
      image:list_style_image,
      format:list_style_format
    });
    var marker_advance = list_style.getMarkerAdvance(parent.flow, parent.getFontSize(), item_count);
    box.listStyle = list_style;
    box.partition = new Partition([marker_advance, box.getContentMeasure() - marker_advance]);
  };

  return ListGenerator;
})();


var InsideListItemGenerator = (function(){
  function InsideListItemGenerator(markup, parent, context){
    var marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    var marker_html = Html.tagWrap("span", marker, {
      "class":"nehan-li-marker"
    });
    //markup.content = marker_html + Const.space + markup.getContent();
    markup.contentRaw = marker_html + Const.space + markup.getContentRaw();
    ChildBlockTreeGenerator.call(this, markup, context);
  }
  Class.extend(InsideListItemGenerator, ChildBlockTreeGenerator);

  return InsideListItemGenerator;
})();


var OutsideListItemGenerator = (function(){
  function OutsideListItemGenerator(markup, parent, context){
    var marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    var markup_marker = new Tag("<li-marker>", marker);
    var markup_body = new Tag("<li-body>", markup.getContent());
    ParallelGenerator.call(this, [
      new ParaChildGenerator(markup_marker, context),
      new ParaChildGenerator(markup_body, context)
    ], markup, context, parent.partition);
  }
  Class.extend(OutsideListItemGenerator, ParallelGenerator);

  return OutsideListItemGenerator;
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


var BlockTreeEvaluator = (function(){
  function BlockTreeEvaluator(){
    this.inlineEvaluatorH = new HoriInlineTreeEvaluator(this);
    this.inlineEvaluatorV = new VertInlineTreeEvaluator(this);
  }

  BlockTreeEvaluator.prototype = {
    evaluate : function(box){
      switch(box._type){
      case "br":
	return this.evalBreak(box);
      case "hr":
	return this.evalHr(box);
      case "ibox":
	return this.evalInlineBox(box);
      case "ipage":
	return this.evalInlinePage(box);
      case "img":
	return this.evalImage(box);
      case "table":
	return this.evalTable(box);
      case "text-line":
	return this.evalTextLine(box);
      default:
	return this.evalBox(box);
      }
    },
    evalBox : function(box){
      var markup = box.getMarkup();
      return Html.tagWrap("div", this.evalBoxChilds(box.getChilds()), Args.copy({
	"id":box.id || null,
	"style":Css.toString(box.getCssBlock()),
	"class":box.getCssClasses()
      }, markup? markup.getDatasetAttrsRaw() : {}));
    },
    evalBoxChilds : function(childs){
      var self = this;
      return List.fold(childs, "", function(ret, box){
	return [ret, self.evaluate(box)].join("\n");
      });
    },
    evalTextLine : function(box){
      if(box.isTextVertical()){
	return this.inlineEvaluatorV.evaluate(box);
      }
      return this.inlineEvaluatorH.evaluate(box);
    },
    evalInlineBox : function(box){
      var content = Config.iboxEnable? box.content : "";
      return Html.tagWrap("div", content, {
	"style":Css.toString(box.getCssBlock()),
	"class":box.getCssClasses()
      });
    },
    evalHr : function(box){
      return this.evalInlineBox(box);
    },
    evalBreak : function(box){
      return this.evalInlineBox(box);
    },
    evalImage : function(box){
      var content = this.evalImageContent(box);
      return Html.tagWrap("div", content, {
	"style":Css.toString(box.getCssBlock()),
	"class":box.getCssClasses()
      });
    },
    evalImageContent : function(box){
      var markup = box.getMarkup();
      return Html.tagSingle("img", Args.copy({
	"src": box.src,
	"title":box.getMarkup().getTagAttr("title") || "",
	"width": box.getContentWidth(),
	"height": box.getContentHeight()
      }, markup? markup.getDatasetAttrsRaw() : {}));
    },
    evalInlinePage : function(box){
      return this.evalBox(box);
    },
    evalTable : function(box){
      return this.evalBox(box);
    }
  };

  return BlockTreeEvaluator;
})();


var InlineTreeEvaluator = (function(){
  function InlineTreeEvaluator(parent_evaluator){
    this.parentEvaluator = parent_evaluator;
  }

  InlineTreeEvaluator.prototype = {
    evaluate : function(line){
      throw "InlineTreeEvaluator::evaluate not implemented";
    },
    evalTextLineBody : function(line, tokens){
      var self = this;
      var body = List.fold(tokens, "", function(ret, element){
	return ret + self.evalInlineElement(line, element);
      });
      if(line.isLinkLine()){
	return this.evalLinkLine(line, body);
      }
      return body;
    },
    evalLinkLine : function(line, body){
      var attr = {};
      var markup = line.getMarkup();
      attr.href = markup.getTagAttr("href", "#");
      var name = markup.getTagAttr("name");
      if(name){
	line.addClass("nehan-anchor");
	attr.name = name;
      }
      var title = markup.getTagAttr("title");
      if(title){
	attr.title = title;
      }
      var target = markup.getTagAttr("target");
      if(target){
	attr.target = target;
      }
      if(attr.href.indexOf("#") >= 0){
	line.addClass("nehan-anchor-link");
      }
      attr["class"] = line.getCssClasses();
      return Html.tagWrap("a", body, attr);
    },
    evalInlineElement : function(line, element){
      if(element._type === "text-line"){
	return this.evaluate(element);
      }
      if(element instanceof Ruby){
	return this.evalRuby(line, element);
      }
      if(Token.isText(element)){
	return this.evalText(line, element);
      }
      if(element instanceof Box){
	return this.evalInlineBox(line, element);
      }
      return "";
    },
    evalText : function(line, text){
      switch(text._type){
      case "word":
	return this.evalWord(line, text);
      case "tcy":
	var tcy = this.evalTcy(line, text);
	return (line.textEmpha && line.textEmpha.isEnable())? this.evalEmpha(line, text, tcy) : tcy;
      case "char":
	var chr = this.evalChar(line, text);
	return (line.textEmpha && line.textEmpha.isEnable())? this.evalEmpha(line, text, chr) : chr;
      default:
	return "";
      }
    },
    evalInlineBox : function(line, box){
      throw "not implemented: evalInlineBox";
    },
    evalWord : function(line, word){
      throw "not implemented: evalWord";
    },
    evalTcy : function(line, tcy){
      throw "not implemented: evalTcy";
    },
    evalChar : function(line, tcy){
      throw "not implemented: evalChar";
    }
  };

  return InlineTreeEvaluator;
})();


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


var HoriInlineTreeEvaluator = (function(){
  function HoriInlineTreeEvaluator(parent_evaluator){
    InlineTreeEvaluator.call(this, parent_evaluator);
  }
  Class.extend(HoriInlineTreeEvaluator, InlineTreeEvaluator);

  HoriInlineTreeEvaluator.prototype.evaluate = function(line, ctx){
    var tag_name = line.isInlineOfInline()? "span" : "div";
    var markup = line.getMarkup();
    var attr = Args.copy({
      "style":Css.toString(line.getCssInline()),
      "class":line.getCssClasses()
    }, markup? markup.getDatasetAttrsRaw() : {});
    return Html.tagWrap(tag_name, this.evalTextLineBody(line, line.getChilds(), ctx), attr);
  };

  HoriInlineTreeEvaluator.prototype.evalRuby = function(line, ruby, ctx){
    var body = this.evalRt(line, ruby, ctx) + this.evalRb(line, ruby, ctx);
    return Html.tagWrap("span", body, {
      "style":Css.toString(ruby.getCssHoriRuby(line)),
      "class":"nehan-ruby"
    });
  };

  HoriInlineTreeEvaluator.prototype.evalRb = function(line, ruby, ctx){
    var body = this.evalTextLineBody(line, ruby.getRbs(), ctx);
    return Html.tagWrap("div", body, {
      "style":Css.toString(ruby.getCssHoriRb(line)),
      "class":"nehan-rb"
    });
  };

  HoriInlineTreeEvaluator.prototype.evalRt = function(line, ruby, ctx){
    return Html.tagWrap("div", ruby.getRtString(), {
      "style":Css.toString(ruby.getCssHoriRt(line)),
      "class":"nehan-rt"
    });
  };

  HoriInlineTreeEvaluator.prototype.evalWord = function(line, word, ctx){
    return word.data;
  };

  HoriInlineTreeEvaluator.prototype.evalTcy = function(line, tcy, ctx){
    return tcy.data;
  };

  HoriInlineTreeEvaluator.prototype.evalChar = function(line, chr, ctx){
    if(chr.isHalfSpaceChar()){
      return chr.cnv;
    } else if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr, ctx);
    }
    return chr.data;
  };

  HoriInlineTreeEvaluator.prototype.evalEmpha = function(line, chr, char_body){
    var char_body2 = Html.tagWrap("div", char_body, {
      "style":Css.toString(chr.getCssHoriEmphaSrc(line))
    });
    var empha_body = Html.tagWrap("div", line.textEmpha.getText(), {
      "style":Css.toString(chr.getCssHoriEmphaText(line))
    });
    // TODO: check text-emphasis-position is over or under
    return Html.tagWrap("span", empha_body + char_body2, {
      "style":Css.toString(line.textEmpha.getCssHoriEmphaWrap(line, chr))
    });
  };

  HoriInlineTreeEvaluator.prototype.evalKerningChar = function(line, chr, ctx){
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

  HoriInlineTreeEvaluator.prototype.evalPaddingChar = function(line, chr, ctx){
    return Html.tagWrap("span", chr.data, {
      "style": Css.toString(chr.getCssPadding(line))
    });
  };

  HoriInlineTreeEvaluator.prototype.evalInlineBox = function(line, box){
    box.setDisplay("inline-block");
    return this.parentEvaluator.evaluate(box);
  };

  return HoriInlineTreeEvaluator;
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
  set : function(token, opt){
    if(token.isKakkoStart()){
      this._setKerningStart(token, opt.prev || null);
    } else if(token.isKakkoEnd() || token.isKutenTouten()){
      this._setKerningEnd(token, opt.next || null);
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
    this.contentSize = this._computeContentSize(this.edge || null); // required
    this.cssBlock = this._computeCssBlock(); // required
    this.cssInline = this._computeCssInline(); // required
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
      style.parent2 = this.parent; // set 'real' parent
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
      Args.copy(box.css, box_size.getCss());
      Args.copy(box.css, this.cssBlock);
      return box;
    },
    createLine : function(opt){
      var line_rate = this.getLineRate();
      var measure = opt.measure || this.getContentMeasure();
      var extent = this.isRootLine()? this._computeLineExtent(opt.elements) : this.getAutoLineExtent();
      var box_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()];
      var line = new Box(box_size, this);
      line.style = this;
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = opt.elements || [];
      line.classes = this.isRootLine()? classes : classes.concat("nehan-" + this.markup.getName());
      line.extent = extent;

      // backup other line data. mainly required to restore inline-context in FloatLayoutGenerator.
      if(this.isRootLine()){
	line.hasLineBreak = opt.hasLineBreak || false;
	line.inlineMeasure = opt.inlineMeasure || measure;
	line.texts = opt.texts || [];
      }
      Args.copy(line.css, box_size.getCss());
      Args.copy(line.css, this.cssInline);
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
    getContentMeasure : function(flow){
      return this.contentSize.getMeasure(flow || this.flow);
    },
    getContentExtent : function(flow){
      return this.contentSize.getExtent(flow || this.flow);
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
    resizeMeasure : function(measure){
      if(this.edge){
	measure -= this._computeEdgeContentMeasure(this.edge);
      }
      this.contentSize[this.flow.getPropMeasure()] = measure;
      return this;
    },
    resizeExtent : function(extent){
      if(this.edge){
	extent -= this._computeEdgeContentExtent(this.edge);
      }
      this.contentSize[this.flow.getPropExtent()] = extent;
      return this;
    },
    resize : function(measure, extent){
      this.resizeMeasure(measure);
      this.resizeExtent(extent);
      return this;
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
    _computeOuterSize : function(){
      var measure = this._computeOuterMeasure();
      var extent = this._computeOuterExtent();
      return this.flow.getBoxSize(measure, extent);
    },
    _computeOuterMeasure : function(){
      return this._computeStaticMeasure() || this._computeMaxMeasure();
    },
    _computeOuterExtent : function(){
      return this._computeStaticExtent() || this._computeMaxExtent();
    },
    _computeStaticMeasure : function(){
      var max_size = this._computeMaxMeasure(); // this value is required when static size is set by '%' value.
      var static_size = this.markup.getAttr(this.flow.getPropMeasure()) || this.markup.getCssAttr("measure");
      return static_size? Math.min(UnitSize.getBoxSize(static_size, this.font.size, max_size), max_size) : null;
    },
    _computeStaticExtent : function(){
      var max_size = this._computeMaxExtent(); // this value is required when static size is set by '%' value.
      var static_size = this.markup.getAttr(this.flow.getPropExtent()) || this.markup.getCssAttr("extent");
      return static_size? Math.min(UnitSize.getBoxSize(static_size, this.font.size, max_size), max_size) : null;
    },
    _computeMaxMeasure : function(){
      var max_size = this.parent? this.parent.getContentMeasure(this.flow) : Layout[this.flow.getPropMeasure()];
      return max_size;
    },
    _computeMaxExtent : function(){
      var max_size = this.parent? this.parent.getContentExtent(this.flow) : Layout[this.flow.getPropExtent()];
      return (this.display === "block")? max_size : this.font.size;
    },
    // 'after' loading all properties, we can compute boundary box size.
    _computeContentSize : function(edge){
      var measure = this._computeContentMeasure(edge);
      var extent = this._computeContentExtent(edge);
      return this.flow.getBoxSize(measure, extent);
    },
    _computeContentMeasure : function(edge){
      return this._computeOuterMeasure() - (edge? this._computeEdgeContentMeasure(edge) : 0);
    },
    _computeContentExtent : function(edge){
      return this._computeOuterExtent() - (edge? this._computeEdgeContentExtent(edge) : 0);
    },
    _computeEdgeContentMeasure : function(edge){
      switch(this.boxSizing){
      case "content-box":
	return 0;
      case "border-box":
	return edge.padding.getMeasureSize(this.flow) + edge.border.getMeasureSize(this.flow);
      case "padding-box":
	return edge.padding.getMeasureSize(this.flow);
      case "margin-box": default:
	return edge.getMeasureSize(this.flow);
      }
    },
    _computeEdgeContentExtent : function(edge){
      switch(this.boxSizing){
      case "content-box":
	return 0;
      case "border-box":
	return edge.padding.getExtentSize(this.flow) + edge.border.getExtentSize(this.flow);
      case "padding-box":
	return edge.padding.getExtentSize(this.flow);
      case "margin-box": default:
	return edge.getExtentSize(this.flow);
      }
    },
    _computeLineExtent : function(elements){
      var child_lines = List.filter(elements, function(element){ return element.style? true : false; });
      if(child_lines.length === 0){
	return this.getAutoLineExtent();
      }
      return this.isTextVertical()? this._computeVertLineExtent(child_lines) : this._computeHoriLineExtent(child_lines);
    },
    _computeHoriLineExtent : function(child_lines){
      var max_font_size = List.fold(child_lines, this.getFontSize(), function(ret, line){
	return Math.max(ret, line.style.getFontSize());
      });
      return max_font_size * this.getLineRate();
    },
    _centerizeVertLine : function(child_lines){
      var this_flow = this.flow;
      var this_font_size = this.getFontSize();
      var max_font_size = this_font_size;
      var max_extent = this.getAutoLineExtent();
      List.iter(child_lines, function(line){
	max_font_size = Math.max(max_font_size, line.style.getFontSize());
      });

      //console.log("max_font_size:%o", max_font_size);

      // set font centerized offset from max_font_size.
      List.iter(child_lines, function(line){
	var font_size = line.style.getFontSize();
	var font_center_offset = Math.floor((max_font_size - font_size) / 2);
	max_extent = Math.max(line.size.getExtent(this_flow) + font_center_offset, max_extent);
      });

      //console.log("max_extent:%o", max_extent);

      var text_center = Math.floor(max_extent / 2);

      //console.log("text-center-pos:%o", text_center);

      List.iter(child_lines, function(line){
	var font_size = line.style.getFontSize();
	var text_center_offset = text_center - Math.floor(font_size / 2);
	if(text_center_offset > 0){
	  line.edge = line.style.edge? line.style.edge.clone() : new BoxEdge(); // set line.edge(not line.style.edge) to overwrite padding temporally.
	  line.edge.padding.setAfter(this_flow, text_center_offset); // set new edge(use line.edge not line.style.edge)
	  line.size.setExtent(this_flow, max_extent - text_center_offset); // set new size
	  Args.copy(line.css, line.edge.getCss()); // overwrite edge
	  Args.copy(line.css, line.size.getCss()); // overwrite size
	}
      });

      return max_extent;
    },
    _computeVertLineExtent : function(child_lines){
      var max_extent = this._centerizeVertLine(child_lines);
      return max_extent;
    },
    _computeCssInline : function(){
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
    _computeCssBlock : function(){
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

  LayoutContext.prototype = {
    debug : function(title){
      console.log("[%s]:(rest_m,rest_e) = (%d,%d)", title, this.inline.getRestMeasure(), this.block.getRestExtent());
    },
    // block-level
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
    getBlockExtent : function(){
      return this.block.getExtent();
    },
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    setBlockMaxExtent : function(extent){
      return this.block.setMaxExtent(extent);
    },
    createChildBlockContext : function(){
      return new LayoutContext(
	new BlockLayoutContext(this.block.getRestExtent()),
	new InlineLayoutContext(this.inline.getRestMeasure())
      );
    },
    createStaticBlockContext : function(measure, extent){
      return new LayoutContext(
	new BlockLayoutContext(extent),
	new InlineLayoutContext(measure)
      );
    },
    // inline-level
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    setInlineMaxMeasure : function(measure){
      return this.inline.setMaxMeasure(measure);
    },
    addInlineElement : function(element, measure){
      this.inline.addElement(element, measure);
    },
    getInlinePrevText : function(){
      return this.inline.getPrevText();
    },
    getInlineTexts : function(){
      return this.inline.getTexts();
    },
    getInlineElements : function(){
      return this.inline.getElements();
    },
    getInlineMeasure : function(){
      return this.inline.getMeasure();
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
    createChildInlineContext : function(){
      return new LayoutContext(
	this.block,
	new InlineLayoutContext(this.inline.getRestMeasure())
      );
    },
    justify : function(head_char){
      return this.inline.justify(head_char);
    },
    restoreInlineContext : function(line){
      this.inline.restoreContext(line);
      return this;
    }
  };

  return LayoutContext;
})();


var BlockLayoutContext = (function(){
  function BlockLayoutContext(max_extent){
    this.extent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
  }

  BlockLayoutContext.prototype = {
    addElement : function(element, extent){
      this.elements.push(element);
      this.extent += extent;
    },
    pushElement : function(element, extent){
      this.pushedElements.push(element);
      this.extent += extent;
    },
    pullElement : function(element, extent){
      this.pulledElements.unshift(element);
      this.extent += extent;
    },
    setMaxExtent : function(extent){
      this.maxExtent = extent;
    },
    getExtent : function(){
      return this.extent;
    },
    getRestExtent : function(){
      return this.maxExtent - this.extent;
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

  return BlockLayoutContext;
})();


var InlineLayoutContext = (function(){
  function InlineLayoutContext(max_measure){
    this.charCount = 0;
    this.measure = 0;
    this.maxMeasure = max_measure; // const
    this.elements = [];
    this.texts = [];
    this.br = false;
  }

  InlineLayoutContext.prototype = {
    isEmpty : function(){
      return !this.br && this.elements.length === 0;
    },
    hasLineBreak : function(){
      return this.br;
    },
    setLineBreak : function(status){
      this.br = status;
    },
    setMaxMeasure : function(measure){
      this.maxMeasure = measure;
    },
    addElement : function(element, measure){
      this.elements.push(element);
      if(Token.isText(element)){
	this.texts.push(element);
	if(element.getCharCount){
	  this.charCount += element.getCharCount();
	}
      }
      this.measure += measure;
    },
    getPrevText : function(){
      return List.last(this.texts);
    },
    getTexts : function(){
      return this.texts;
    },
    getElements : function(){
      return this.elements;
    },
    getMeasure : function(){
      return this.measure;
    },
    getRestMeasure : function(){
      return this.maxMeasure - this.measure;
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
    },
    restoreContext : function(line){
      this.texts = line.texts || [];
      this.elements = line.elements || [];
      this.br = line.hasLineBreak || false;
      this.measure = line.inlineMeasure || 0;
      this.charCount = this.texts.length || 0;
    }
  };

  return InlineLayoutContext;
})();


var LayoutGenerator = (function(){
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._childLayout = null;
    this._cachedElements = [];
    this._terminate = false;
  }

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
      //console.log("layout child %s has next", this._childLayout.style.getMarkupName());
      return true;
    }
    return false;
  };

  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._childLayout.yield(context);
    //console.log("child next:%o", next);
    return next;
  };

  LayoutGenerator.prototype.peekLastCache = function(){
    return List.last(this._cachedElements);
  };

  LayoutGenerator.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      //console.info("[%s]:multi cache detected! count = %d, element = %o", this.style.getMarkupName(), cache_count, element);
      if(cache_count >= Config.maxRollbackCount){
	console.error("too many cache count(%d), force terminate", cache_count);
	this.setTerminate(true); // this error sometimes causes infinite loop, so force terminate generator.
	return;
      }
    }
    if(element instanceof Box){
      var flow = this.style.flow;
      var measure = element.getBoxMeasure(flow);
      var extent = element.getBoxExtent(flow);
      //console.log("[%s]:push cache:%o(%d,%d)", this.style.getMarkupName(), element, measure, extent);
    }
    element.cacheCount = cache_count + 1;
    this._cachedElements.push(element);
  };

  LayoutGenerator.prototype.popCache = function(){
    var cache = this._cachedElements.pop();
    //console.log("[%s]:pop cache:%o", this.style.markup.name, cache);
    return cache;
  };

  LayoutGenerator.prototype.clearCache = function(){
    this._cachedElements = [];
  };

  LayoutGenerator.prototype._createStartContext = function(){
    return new LayoutContext(
      new BlockLayoutContext(this.style.getContentExtent()),
      new InlineLayoutContext(this.style.getContentMeasure())
    );
  };

  LayoutGenerator.prototype._createChildBlockContext = function(current_context, child_style){
    return new LayoutContext(
      new BlockLayoutContext(current_context.getBlockRestExtent() - child_style.getEdgeExtent()),
      new InlineLayoutContext(current_context.getInlineMaxMeasure() - child_style.getEdgeMeasure())
    );
  };

  return LayoutGenerator;
})();


var BlockLayoutGenerator = (function(){
  function BlockLayoutGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
  }
  Class.extend(BlockLayoutGenerator, LayoutGenerator);

  BlockLayoutGenerator.prototype.yield = function(context){
    context = context || this._createStartContext();
    //console.log("yield %s, rest_extent = %d", this.style.getMarkupName(), context.getBlockRestExtent());
    if(context.getBlockMaxExtent() < 0){
      //console.log("no more extent rest");
      return null;
    }
    while(true){
      var element = this._getNext(context);
      if(element === null){
	//console.log("[%s] null", this.style.getMarkupName());
	break;
      }
      var extent = element.getBoxExtent(this.style.flow);
      //console.log("[%s] block %o extent:%d", this.style.getMarkupName(), element, extent);
      if(context.getBlockExtent() + extent > context.getBlockMaxExtent()){
	//console.log("[%s] block over(cached, extent=%d) context(cur:%d, max:%d)", this.style.getMarkupName(), extent, context.getBlockExtent(), context.getBlockMaxExtent());
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, extent);
      if(context.getBlockExtent() === context.getBlockMaxExtent()){
	//console.log("block just filled");
	break;
      }
      //console.log("...accepted by %s(rest extent = %d)", this.style.markup.name, context.getBlockRestExtent());
    }
    return this._createBlock(context);
  };

  BlockLayoutGenerator.prototype._addElement = function(context, element, extent){
    if(this.style.isPushed()){
      context.pushBockElement(element, extent);
    } else if(this.style.isPulled()){
      context.pullBlockElement(element, extent);
    } else {
      context.addBlockElement(element, extent);
    }
  };

  BlockLayoutGenerator.prototype._createBlock = function(context){
    var extent = context.getBlockExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      //console.log("[%s] empty block!", this.style.getMarkupName());
      return null;
    }
    return this.style.createBlock({
      extent:extent,
      elements:elements
    });
  };

  BlockLayoutGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache();
      // restart inline if measure changed from when this cache is pushed.
      if(this.hasChildLayout() && cache.display === "inline" && !cache.hasLineBreak /*&& cache.getBoxMeasure(this.style.flow) < context.getInlineMaxMeasure()*/){
	//console.log("restart inline from cache:%o", cache);
	var context2 = this._createChildBlockContext(context, this._childLayout.style).restoreInlineContext(cache);
	return this.yieldChildLayout(context2);
      }
      return cache;
    }
    
    if(this.hasChildLayout()){
      //console.log("[%s]child layout exists", this.style.getMarkupName());
      var context2 = this._createChildBlockContext(context, this._childLayout.style);
      return this.yieldChildLayout(context2);
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // if tag token, inherit style
    var child_style = (token instanceof Tag)? new StyleContext(token, this.style) : this.style;

    // inline text or inline tag
    if(Token.isText(token) || child_style.isInline()){
      //console.log("block -> inline from %s", this.style.getMarkupName());
      this.stream.prev();
      this.setChildLayout(new InlineLayoutGenerator(this.style, this.stream));

      // block context is not required by inline-generator.
      // because it yields single line and block-over is always captured by it's parent block generator.
      return this.yieldChildLayout();
    }

    var child_context = this._createChildBlockContext(context, child_style);

    // child block with float
    if(child_style.isFloated()){
      this.stream.prev();
      this.setChildLayout(new FloatLayoutGenerator(this.style, this.stream));
      return this.yieldChildLayout(context.createChildBlockContext()); // caution: not this._createChildBlockContext but context.createChildBlockContext
    }

    if(child_style.display === "list-item"){
      this.setChildLayout(new ListItemLayoutGenerator(child_style, this._createStream(token), context));
      return this.yieldChildLayout(child_context);
    }

    if(child_style.display === "table-row"){
      this.setChildLayout(new TableRowLayoutGenerator(child_style, this._createStream(token), context));
      return this.yieldChildLayout(child_context);
    }

    switch(child_style.getMarkupName()){
    case "ul": case "ol":
      this.setChildLayout(new ListLayoutGenerator(child_style, new ListTagStream(token.getContent())));
      return this.yieldChildLayout(child_context);
      
    default:
      this.setChildLayout(new BlockLayoutGenerator(child_style, this._createStream(token)));
      return this.yieldChildLayout(child_context);
    }
  };

  BlockLayoutGenerator.prototype._createStream = function(tag){
    return new TokenStream(tag.getContent()); // TODO
  };

  return BlockLayoutGenerator;
})();


var InlineLayoutGenerator = (function(){
  function InlineLayoutGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
  }
  Class.extend(InlineLayoutGenerator, LayoutGenerator);

  InlineLayoutGenerator.prototype.yield = function(context){
    context = context || this._createStartContext();
    while(true){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      if(element instanceof Tag && element.getName() === "br"){
	context.setLineBreak(true);
	break;
      }
      var measure = this._getMeasure(element);
      //console.log("[%s] inline measure:%d", this.style.getMarkupName(), measure);
      if(context.getInlineMeasure() + measure > context.getInlineMaxMeasure()){
	//console.log("[%s] inline over and cached:%o", this.style.getMarkupName(), element);
	this.pushCache(element);
	break;
      }
      context.addInlineElement(element, measure);
    }
    // no br, no element
    if(context.isInlineEmpty()){
      //console.log("empty inline");
      return null;
    }
    // justify line if it's generated by not line-break but measure-overflow.
    if(!context.hasLineBreak()){
      this._justifyLine(context);
    }
    return this._createLine(context);
  };

  InlineLayoutGenerator.prototype._createStream = function(token){
    switch(token.getName()){
    case "ruby": return new RubyTagStream(token);
    default: return new TokenStream(token.getContent());
    }
  };

  InlineLayoutGenerator.prototype._justifyLine = function(context){
    var next_head = this.peekLastCache();
    var new_tail = context.justify(next_head);
    if(new_tail){
      this.stream.setPos(new_tail.pos + 1);
      this.clearCache(); // stream position changed, so disable cache.
    }
  };

  InlineLayoutGenerator.prototype._createLine = function(context){
    return this.style.createLine({
      hasLineBreak:context.hasLineBreak(),
      measure:(this.style.isRootLine()? this.style.getContentMeasure() : context.getInlineMeasure()),
      inlineMeasure:context.getInlineMeasure(),
      elements:context.getInlineElements(),
      texts:context.getInlineTexts(),
      charCount:context.getInlineCharCount()
    });
  };

  InlineLayoutGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      return this.popCache();
    }

    if(this.hasChildLayout()){
      return this.yieldChildLayout(context.createChildInlineContext());
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
      //console.log("inline(%s) - new style(%s):%o, isBlock=%o", this.style.getMarkupName(), style.getMarkupName(), style, style.isBlock());

      // inline -> block, force terminate inline
      if(style.isBlock()){
	//console.log("inline -> block by %s", style.getMarkupName());
	this.stream.prev();
	this.setTerminate(true);
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
      return token;
    default:
      //console.log("start child inline:%s", token.getContent());
      this.setChildLayout(new InlineLayoutGenerator(style, this._createStream(token)));
      return this.yieldChildLayout(context.createChildInlineContext());
    }
  };

  InlineLayoutGenerator.prototype._getText = function(context, token){
    if(!token.hasMetrics()){
      if(token instanceof Char){
	var next_token = this.stream.peek();
	Kerning.set(token, {
	  prev:context.getInlinePrevText(),
	  next:((next_token && Token.isText(next_token))? next_token : null)
	});
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

  InlineLayoutGenerator.prototype._getWord = function(context, token){
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

  InlineLayoutGenerator.prototype._getMeasure = function(element){
    if(element instanceof Box){
      return element.getBoxMeasure(this.style.flow);
    }
    if(element.getAdvance){
      return element.getAdvance(this.style.flow, this.style.letterSpacing || 0);
    }
    return 0; // TODO
  };

  return InlineLayoutGenerator;
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


var FloatLayoutGenerator = (function(){
  // argument 'style' is the style of parent.
  // if <body><float1>..</float1><float2>...</float2></body>,
  // style of this contructor is 'body.style'
  function FloatLayoutGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
    this.generators = this._getFloatedGenerators();

    // create child generator to yield rest-space of float-elements with logical-float "start".
    // notice that this generator uses 'clone' style, because size of space changes by position,
    // but on the other hand, original style is referenced by float-elements as parent style.
    // so we must keep original style immutable.
    this.setChildLayout(new BlockLayoutGenerator(style.clone({"float":"start"}), stream));
  }
  Class.extend(FloatLayoutGenerator, LayoutGenerator);

  FloatLayoutGenerator.prototype.hasNext = function(){
    if(this.hasNextFloat()){
      return true;
    }
    return LayoutGenerator.prototype.hasNext.call(this);
  };

  FloatLayoutGenerator.prototype.hasNextFloat = function(){
    return List.exists(this.generators, function(gen){
      return gen.hasNext();
    });
  };

  FloatLayoutGenerator.prototype.yield = function(context){
    context = context || this._createStartContext();
    var stack = this._yieldFloatStack(context);
    var rest_measure = context.getInlineRestMeasure();
    var rest_extent = context.getBlockRestExtent();
    return this._yieldFloat(context, stack, rest_measure, rest_extent);
  };

  FloatLayoutGenerator.prototype._yieldFloat = function(context, stack, rest_measure, rest_extent){
    //console.log("yieldFloat(%d,%d)", rest_measure, rest_extent);
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
    var group_set = this._wrapFloat(context, group, rest); // wrap these 2 floated layout as one block.

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
    return this._wrapBlock(context, group_set, space);
  };
  
  FloatLayoutGenerator.prototype._sortFloatRest = function(floated, rest){
    var floated_elements = floated.getElements();
    return floated.isFloatStart()? floated_elements.concat(rest) : [rest].concat(floated_elements);
  };

  FloatLayoutGenerator.prototype._wrapBlock = function(context, block1, block2){
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

  FloatLayoutGenerator.prototype._wrapFloat = function(context, floated, rest){
    var flow = this.style.flow;
    var measure = floated.getMeasure(flow) + (rest? rest.getBoxMeasure(flow) : 0);
    var extent = floated.getExtent(flow);
    return this.style.createChild("div").createBlock({
      elements:this._sortFloatRest(floated, rest),
      measure:measure,
      extent:extent
    });
  };
  
  FloatLayoutGenerator.prototype._yieldFloatSpace = function(context, measure, extent){
    var style = this._childLayout.style;
    style.resize(measure, extent);
    return this.yieldChildLayout(context.createStaticBlockContext(
      style.getContentMeasure(),
      style.getContentExtent()
    ));
  };
  
  FloatLayoutGenerator.prototype._yieldFloatStack = function(context){
    var start_blocks = [], end_blocks = [];
    var rest_extent = context.getBlockRestExtent();
    List.iter(this.generators, function(gen){
      gen.style.resizeExtent(rest_extent);
      var block = gen.yield();
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

  FloatLayoutGenerator.prototype._getFloatedTags = function(){
    var parent_style = this.style;
    return this.stream.getWhile(function(token){
      return (token instanceof Tag && (new StyleContext(token, parent_style)).isFloated());
    });
  };

  FloatLayoutGenerator.prototype._getFloatedGenerators = function(){
    var parent_style = this.style;
    return List.map(this._getFloatedTags(), function(tag){
      return new BlockLayoutGenerator(
	new StyleContext(tag, parent_style),
	new TokenStream(tag.getContent())
      );
    });
  };

  return FloatLayoutGenerator;
})();


var ParallelLayoutGenerator = (function(){
  function ParallelLayoutGenerator(style, generators){
    LayoutGenerator.call(this, style, null);
    this.generators = generators;
  }
  Class.extend(ParallelLayoutGenerator, LayoutGenerator);

  ParallelLayoutGenerator.prototype.yield = function(context){
    if(this.hasCache()){
      return this.popCache();
    }
    context = context || this._createStartContext();
    //console.log("[%s]:para yield, rest_extent = %d", this.style.getMarkupName(), context.getBlockRestExtent());
    var blocks = this._yieldParallelBlocks(context);
    if(blocks === null){
      return null;
    }
    var wrap_block = this._wrapBlocks(blocks);
    var wrap_extent = wrap_block.getBoxExtent(this.style.flow);
    //wrap_block.debug("wrap_block");
    if(context.getBlockExtent() + wrap_extent > context.getBlockMaxExtent()){
      //console.log("[%s]:wrap box layout over", this.style.markup.name);
      this.pushCache(wrap_block);
      return null;
    }
    context.addBlockElement(wrap_block, wrap_extent);
    return wrap_block;
  };

  ParallelLayoutGenerator.prototype.hasNext = function(context){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    return List.exists(this.generators, function(gen){
      //console.log("%s gen has next:%o", gen.style.getMarkupName(), gen.hasNext());
      return gen.hasNext();
    });
  };

  ParallelLayoutGenerator.prototype._yieldParallelBlocks = function(context){
    var rest_extent = context.getBlockRestExtent();
    var blocks = List.map(this.generators, function(gen){
      var rest_measure = gen.style.getContentMeasure();
      var edge_extent = gen.style.parent2? gen.style.parent2.getEdgeExtent() : 0;
      return gen.yield(context.createStaticBlockContext(rest_measure, rest_extent - edge_extent));
    });
    return List.forall(blocks, function(block){ return block === null; })? null : blocks;
  };

  ParallelLayoutGenerator.prototype._wrapBlocks = function(blocks){
    var flow = this.style.flow;
    var generators = this.generators;
    var max_block = List.maxobj(blocks, function(block){
      return block? block.getBoxExtent(flow) : 0;
    });
    var max_content_extent = max_block.getContentExtent(flow);
    var uniformed_blocks = List.mapi(blocks, function(i, block){
      return block || generators[i].style.createBlock({elements:[], extent:max_content_extent});
    });
    return this.style.createBlock({
      elements:uniformed_blocks,
      extent:max_block.getBoxExtent(flow)
    });
  };

  return ParallelLayoutGenerator;
})();



var ListLayoutGenerator = (function(){
  function ListLayoutGenerator(style, stream){
    BlockLayoutGenerator.call(this, style, stream);
    this.style.markerSize = this._getMarkerSize(this.stream.getTokenCount());
  }
  Class.extend(ListLayoutGenerator, BlockLayoutGenerator);

  ListLayoutGenerator.prototype._getMarkerSize = function(item_count){
    var max_marker_text = this.style.getMarkerHtml(item_count);
    var gen = new InlineLayoutGenerator(this.style, new TokenStream(max_marker_text));
    var line = gen.yield();
    var marker_measure = line.inlineMeasure + Math.floor(this.style.getFontSize() / 2);
    var marker_extent = line.size.getExtent(this.style.flow);
    return this.style.flow.getBoxSize(marker_measure, marker_extent);
  };

  return ListLayoutGenerator;
})();


var ListItemLayoutGenerator = (function(){
  function ListItemLayoutGenerator(style, stream, context){
    ParallelLayoutGenerator.call(this, style, [
      this._createListMarkGenerator(context, style),
      this._createListBodyGenerator(context, style, stream)
    ]);
  }
  Class.extend(ListItemLayoutGenerator, ParallelLayoutGenerator);

  ListItemLayoutGenerator.prototype._createListMarkGenerator = function(context, style){
    var marker_size = style.parent.markerSize;
    var item_order = style.getChildIndex();
    var marker_text = style.parent.getMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "class":"nehan-li-mark",
      "measure":measure
    });

    return new BlockLayoutGenerator(marker_style, new TokenStream(marker_text));
  };

  ListItemLayoutGenerator.prototype._createListBodyGenerator = function(context, style, stream){
    var marker_size = style.parent.markerSize;
    var measure = style.getContentMeasure() - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "class":"nehan-li-body",
      "measure":measure
    });

    return new BlockLayoutGenerator(body_style, stream);
  };

  return ListItemLayoutGenerator;
})();
  

// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
// init : create partition map
var TableLayoutGenerator = (function(){
  function TableLayoutGenerator(style, stream){
    BlockLayoutGenerator.call(this, style, stream);
  }
  Class.extend(TableLayoutGenerator, BlockLayoutGenerator);

  TableLayoutGenerator.prototype.yield = function(context){
  };

  TableLayoutGenerator.prototype._getTableGroupTags = function(context){
  };

  return TableLayoutGenerator;
})();

// parent : table
// tag : thead | tbody | tfoot
// stream : [tr]
// yield : [tr]
var TableGroupLayoutGenerator = (function(){
  function TableGroupLayoutGenerator(style, stream){
    BlockLayoutGenerator.call(this, style, stream);
  }
  Class.extend(TableGroupLayoutGenerator, BlockLayoutGenerator);

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
var TableRowLayoutGenerator = (function(){
  function TableRowLayoutGenerator(style, stream, context){
    var generators = this._getGenerators(style, stream, context);
    ParallelLayoutGenerator.call(this, style, generators);
  }
  Class.extend(TableRowLayoutGenerator, ParallelLayoutGenerator);

  TableRowLayoutGenerator.prototype._getGenerators = function(style, stream, context){
    var child_tags = this._getChildTags(stream);
    var child_styles = this._getChildStyles(context, style, child_tags);
    return List.map(child_styles, function(style){
      return new BlockLayoutGenerator(style, new TokenStream(style.getMarkupContent()));
    });
  };

  TableRowLayoutGenerator.prototype._getChildStyles = function(context, parent_style, child_tags){
    var child_count = child_tags.length;
    var rest_extent = context.getBlockRestExtent();
    var rest_measure = context.getInlineMaxMeasure();
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, parent_style);
      var static_measure = default_style._computeStaticMeasure();
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_count - i));
      rest_measure -= measure;
      return default_style.clone({
	"float":"start",
	"measure":measure,
	"extent":rest_extent
      });
    });
  };

  TableRowLayoutGenerator.prototype._getChildTags = function(stream){
    return stream.getWhile(function(token){
      return (token instanceof Tag && (token.getName() === "td" || token.getName() === "th"));
    });
  };

  return TableRowLayoutGenerator;
})();

var LayoutEvaluator = (function(){
  function LayoutEvaluator(){
  }

  LayoutEvaluator.prototype = {
    evaluate : function(box){
      //console.log("evaluate:%o", box);
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
	"style":Css.toString(block.css),
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
	"style":Css.toString(line.css),
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
      return line.style.isTextEmphaEnable()? this.evalEmpha(line, element, text) : text;
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


var VertLayoutEvaluator = (function(){
  function VertLayoutEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(VertLayoutEvaluator, LayoutEvaluator);

  VertLayoutEvaluator.prototype.evalInlineBlock = function(iblock){
    return this.evalBlock(iblock);
  };

  VertLayoutEvaluator.prototype.evalInlineChild = function(line, child){
    return this.evalInline(child);
  };

  VertLayoutEvaluator.prototype.evalRuby = function(line, ruby){
    var body = this.evalRb(line, ruby) + this.evalRt(line, ruby);
    return Html.tagWrap("div", body, {
      "stye":Css.toString(ruby.css),
      "class":"nehan-ruby-body"
    });
  };

  VertLayoutEvaluator.prototype.evalRb = function(line, ruby){
    return Html.tagWrap("div", this.evalInlineElements(line, ruby.getRbs()), {
      "style":Css.toString(ruby.getCssVertRb(line)),
      "class":"nehan-rb"
    });
  };

  VertLayoutEvaluator.prototype.evalRt = function(line, ruby){
    var rt = (new InlineLayoutGenerator(
      new StyleContext(ruby.rt, line.style),
      new TokenStream(ruby.getRtString())
    )).yield();
    Args.copy(rt.css, ruby.getCssVertRt(line));
    return this.evaluate(rt);
  };

  VertLayoutEvaluator.prototype.evalWord = function(line, word){
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

  VertLayoutEvaluator.prototype.evalWordTransform = function(line, word){
    var body = Html.tagWrap("div", word.data, {
      "class": "nehan-rotate-90",
      "style": Css.toString(word.getCssVertTransBody(line))
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  };

  VertLayoutEvaluator.prototype.evalWordTransformTrident = function(line, word){
    var body = Html.tagWrap("div", word.data, {
      // trident rotation needs some hack.
      //"class": "nehan-rotate-90",
      "style": Css.toString(word.getCssVertTransBodyTrident(line))
    });
    return Html.tagWrap("div", body, {
      "style": Css.toString(word.getCssVertTrans(line))
    });
  };

  VertLayoutEvaluator.prototype.evalWordIE = function(line, word){
    return Html.tagWrap("div", word.data, {
      "class": "nehan-vert-ie",
      "style": Css.toString(word.getCssVertTransIE(line))
    }) + Const.clearFix;
  };

  VertLayoutEvaluator.prototype.evalRotateChar = function(line, chr){
    if(Env.isTransformEnable){
      return this.evalRotateCharTransform(line, chr);
    } else if(Env.isIE){
      return this.evalRotateCharIE(line, chr);
    } else {
      return this.evalCharWithBr(line, chr);
    }
  };

  VertLayoutEvaluator.prototype.evalRotateCharTransform = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-rotate-90"
    });
  };

  VertLayoutEvaluator.prototype.evalRotateCharIE = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertRotateCharIE(line)),
      "class":"nehan-vert-ie"
    }) + Const.clearFix;
  };

  VertLayoutEvaluator.prototype.evalTcy = function(line, tcy){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
    });
  };

  VertLayoutEvaluator.prototype.evalChar = function(line, chr){
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

  VertLayoutEvaluator.prototype.evalCharWithBr = function(line, chr){
    return chr.data + "<br />";
  };

  VertLayoutEvaluator.prototype.evalCharLetterSpacing = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "style":Css.toString(chr.getCssVertLetterSpacing(line))
    });
  };

  VertLayoutEvaluator.prototype.evalEmpha = function(line, chr, char_body){
    char_body = char_body.replace("<br />", "");
    var char_body2 = Html.tagWrap("span", char_body, {
      "class":"nehan-empha-src",
      "style":Css.toString(chr.getCssVertEmphaSrc(line))
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

  VertLayoutEvaluator.prototype.evalPaddingChar = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      style:Css.toString(chr.getCssPadding(line))
    });
  };

  VertLayoutEvaluator.prototype.evalImgChar = function(line, chr){
    var color = line.color || new Color(Layout.fontColor);
    var font_rgb = color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color),
      style:Css.toString(chr.getCssVertImgChar(line))
    }) + Const.clearFix;
  };

  VertLayoutEvaluator.prototype.evalVerticalGlyph = function(line, chr){
    return Html.tagWrap("div", chr.data, {
      "class":"nehan-vert-glyph",
      "style":Css.toString(chr.getCssVertGlyph(line))
    });
  };

  VertLayoutEvaluator.prototype.evalCnvChar = function(line, chr){
    return chr.cnv + "<br />";
  };

  VertLayoutEvaluator.prototype.evalSmallKana = function(line, chr){
    var tag_name = (line.style.textEmpha && line.style.textEmpha.isEnable())? "span" : "div";
    return Html.tagWrap(tag_name, chr.data, {
      style:Css.toString(chr.getCssVertSmallKana())
    });
  };

  VertLayoutEvaluator.prototype.evalHalfSpaceChar = function(line, chr){
    var font_size = line.style.getFontSize();
    var half = Math.round(font_size / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.toString(chr.getCssVertHalfSpaceChar(line))
    });
  };

  VertLayoutEvaluator.prototype.evalInlineBox = function(line, box){
    var body = (box._type === "img")? this.parentEvaluator.evalImageContent(box) : box.content;
    return Html.tagWrap("div", body, {
      "style":Css.toString(box.getCssVertInlineBox())
    });
  };

  return VertLayoutEvaluator;
})();


var HoriLayoutEvaluator = (function(){
  function HoriLayoutEvaluator(){
    LayoutEvaluator.call(this);
  }
  Class.extend(HoriLayoutEvaluator, LayoutEvaluator);

  HoriLayoutEvaluator.prototype.evalInlineBlock = function(iblock){
    iblock.css.display = "inline-block";
    return this.evalBlock(iblock);
  };

  HoriLayoutEvaluator.prototype.evalInlineChild = function(line, child){
    return Html.tagWrap("span", this.evalInlineElements(child, child.elements), {
      "style":Css.toString(line.css),
      "class":line.classes.join(" ")
    });
  };

  HoriLayoutEvaluator.prototype.evalRuby = function(line, ruby){
    var body = this.evalRt(line, ruby) + this.evalRb(line, ruby);
    return Html.tagWrap("span", body, {
      "style":Css.toString(ruby.getCssHoriRuby(line)),
      "class":"nehan-ruby-body"
    });
  };

  HoriLayoutEvaluator.prototype.evalRb = function(line, ruby){
    return Html.tagWrap("div", this.evalInlineElements(line, ruby.getRbs()), {
      "style":Css.toString(ruby.getCssHoriRb(line)),
      "class":"nehan-rb"
    });
  };

  HoriLayoutEvaluator.prototype.evalRt = function(line, ruby){
    return Html.tagWrap("div", ruby.getRtString(), {
      "style":Css.toString(ruby.getCssHoriRt(line)),
      "class":"nehan-rt"
    });
  };

  HoriLayoutEvaluator.prototype.evalWord = function(line, word){
    return word.data;
  };

  HoriLayoutEvaluator.prototype.evalTcy = function(line, tcy){
    return tcy.data;
  };

  HoriLayoutEvaluator.prototype.evalChar = function(line, chr){
    if(chr.isHalfSpaceChar()){
      return chr.cnv;
    } else if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr);
    }
    return chr.data;
  };

  HoriLayoutEvaluator.prototype.evalEmpha = function(line, chr, char_body){
    var char_body2 = Html.tagWrap("div", char_body, {
      "style":Css.toString(chr.getCssHoriEmphaSrc(line))
    });
    var empha_body = Html.tagWrap("div", line.style.textEmpha.getText(), {
      "style":Css.toString(chr.getCssHoriEmphaText(line))
    });
    // TODO: check text-emphasis-position is over or under
    return Html.tagWrap("span", empha_body + char_body2, {
      "style":Css.toString(line.style.textEmpha.getCssHoriEmphaWrap(line, chr))
    });
  };

  HoriLayoutEvaluator.prototype.evalKerningChar = function(line, chr){
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

  HoriLayoutEvaluator.prototype.evalPaddingChar = function(line, chr){
    return Html.tagWrap("span", chr.data, {
      "style": Css.toString(chr.getCssPadding(line))
    });
  };

  return HoriLayoutEvaluator;
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

/*
    "ul":[
      "<ol>",
      "<li>" +
	TestText["long"] +
	TestText["long"] +
	TestText["long"] +
	"</li>",
      "</ol>"
    ].join(""),
*/

/*
    "ul":[
      "<ol>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "</ol>"
    ].join(""),
*/

    /*
    "ul":[
      "<ol>",
      "<li>あ</li>",
      "<li>か</li>",
      "</ol>"
    ].join(""),
    */

    "ol":[
      "<ol>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + TestText["middle"] + "</li>",
	"<li>" + TestText["short"] + "</li>",
	"<li>" + TestText["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
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
      TestText["long"],
      TestText["middle"],
      TestText["long"],
      TestSnipet["float"],
      TestText["long"],
      TestText["middle"],
      TestText["long"],
      ""
    ].join(""),

    "table-test":[
      "<table>",
      //"<tbody>",

      "<tr>",
      "<td>hoge</td><td>hige</td><td>hage</td>",
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
    ].join("")
  };

  return {
    getGenerator : function(name){
      var script = TestScript[name] || TestSnipet[name] || TestText[name] || "undefined script";
      var tag = new Tag("<body>", script);
      var style = new StyleContext(tag, null);
      var stream = new TokenStream(tag.getContent());
      return new BlockLayoutGenerator(style, stream);
    },
    getEvaluator : function(){
      return (Layout.direction === "vert")? new VertLayoutEvaluator() : new HoriLayoutEvaluator();
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
    }
  };
})();


Nehan.version = "4.0.11";

Args.copy(Env, __engine_args.env || {});
Args.copy(Layout, __engine_args.layout || {});
Args.copy(Config, __engine_args.config || {});

var __exports = {};

// export only for test
if(__engine_args.test){

  // basics
  __exports.Class = Class;
  __exports.Utils = Utils;
  __exports.MathUtils = MathUtils;
  __exports.Obj = Obj;
  __exports.Css = Css;
  __exports.Html = Html;
  __exports.Closure = Closure;
  __exports.Args = Args;
  __exports.List = List;
  __exports.Color = Color;
  __exports.Colors = Colors;
  __exports.Flow = Flow;
  __exports.InlineFlow = InlineFlow;
  __exports.BlockFlow = BlockFlow;
  __exports.BoxFlow = BoxFlow;
  __exports.BoxFlows = BoxFlows;
  __exports.Edge = Edge;
  __exports.CssParser = CssParser;
  __exports.Padding = Padding;
  __exports.Margin = Margin;
  __exports.Border = Border;
  __exports.BorderColor = BorderColor;
  __exports.BorderRadius = BorderRadius;
  __exports.Radius2d = Radius2d;
  __exports.BoxEdge = BoxEdge;
  __exports.BoxSize = BoxSize;
  __exports.BoxSizing = BoxSizing;
  __exports.BoxSizings = BoxSizings;
  __exports.UnitSize = UnitSize;
  __exports.BoxChild = BoxChild;
  __exports.Box = Box;
  __exports.Selector = Selector;
  __exports.SelectorLexer = SelectorLexer;
  __exports.SelectorAttr = SelectorAttr;
  __exports.SelectorPseudo = SelectorPseudo;
  __exports.SelectorType = SelectorType;
  __exports.SelectorCombinator = SelectorCombinator;
  __exports.SelectorStateMachine = SelectorStateMachine;
  __exports.Tag = Tag;
  __exports.Char = Char;
  __exports.Word = Word;
  __exports.Tcy = Tcy;
  __exports.Ruby = Ruby;
  __exports.HtmlLexer = HtmlLexer;
  __exports.Token = Token;
  __exports.DocumentContext = DocumentContext;
  __exports.TocContext = TocContext;
  __exports.EvalResult = EvalResult;
  __exports.PageGroup = PageGroup;
  __exports.Partition = Partition;
  __exports.Cardinal = Cardinal;
  __exports.ListStyle = ListStyle;
  __exports.ListStyleType = ListStyleType;
  __exports.ListStylePos = ListStylePos;
  __exports.ListStyleImage = ListStyleImage;

  // outline
  __exports.OutlineBuffer = OutlineBuffer;
  __exports.OutlineContext = OutlineContext;
  __exports.OutlineParser = OutlineParser;
  __exports.OutlineConverter = OutlineConverter;

  // stream
  __exports.TokenStream = TokenStream;
  __exports.DocumentTagStream = DocumentTagStream;
  __exports.HtmlTagStream = HtmlTagStream;
  __exports.HeadTagStream = HeadTagStream;
  __exports.ListTagStream = ListTagStream;
  __exports.DefListTagStream = DefListTagStream;
  __exports.TableTagStream = TableTagStream;
  __exports.RubyTagStream = RubyTagStream;

  // generator
  __exports.ElementGenerator = ElementGenerator;
  __exports.BlockTreeGenerator = BlockTreeGenerator;
  __exports.InlineTreeGenerator = InlineTreeGenerator;
  __exports.ChildBlockTreeGenerator = ChildBlockTreeGenerator;
  __exports.ChildInlineTreeGenerator = ChildInlineTreeGenerator;
  __exports.BodyBlockTreeGenerator = BodyBlockTreeGenerator;
  __exports.ParallelGenerator = ParallelGenerator;
  __exports.ParaChildGenerator = ParaChildGenerator;
  __exports.HtmlGenerator = HtmlGenerator;
  __exports.DocumentGenerator = DocumentGenerator;

  // evaluator
  __exports.PageEvaluator = PageEvaluator;
  __exports.BlockTreeEvaluator = BlockTreeEvaluator;
  __exports.InlineTreeEvaluator = InlineTreeEvaluator;
  __exports.PageGroupEvaluator = PageGroupEvaluator;

  // page stream
  __exports.PageStream = PageStream;
  __exports.PageGroupStream = PageGroupStream;

  // core layouting components
  __exports.Env = Env;
  __exports.Config = Config;
  __exports.Layout = Layout;
  __exports.Style = Style;
  __exports.Selectors = Selectors;
}

// main interfaces
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
