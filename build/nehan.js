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

// glocal style
Nehan.style = {};

Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.style[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.style[selector_key] = entry;
};

Nehan.setStyles = function(values){
  for(var selector_key in values){
    Nehan.setStyle(selector_key, values[selector_key]);
  }
};

// this function ends at the tail of this source.
Nehan.setup = function(engine_args){
var __engine_args = engine_args || {};

var Config = {
  lang:"ja-JP",
  debug:false,
  kerning:true,
  justify:true,
  maxRollbackCount:40,
  maxPageCount:10000,
  useVerticalGlyphIfEnable:true,
  useStrictWordMetrics:true,
  enableAutoCloseTag:false,
  lexingBufferLen:2000
};


var Layout = {
  // define root where content text starts from.
  // 'body' or 'html' or 'document' are enabled.
  // 
  // 1. 'document'
  //    <!doctype xxx> tag is included in content text.
  // 2. 'html'
  //    <head> and <html> are included in content text.
  // 3. 'body'
  //    <body> or content of body itself is included in content text.
  root:"document",
  direction:"vert", // or 'hori'
  boxFlow:{
    hori:"lr-tb", // used when direction is 'hori'. notice that rl-tb is not supported yet.
    vert:"tb-rl", // used when direction is 'vert'. "tb-lr" is also supported.
  },
  pagingDirection:{
    hori:"lr", // paging direction 'left to right'
    vert:"rl"  // paging direction 'right to left'
  },
  width: 800, // root width
  height: 580, // root height
  fontSize:16, // root fontSize
  maxFontSize:64,
  rubyRate:0.5, // used when Style.rt["font-size"] is not defined.
  boldRate:0.5, // used to calculate sketchy bold metrics in the environment with no canvas element.
  lineRate: 2.0, // in nehan.js, extent size of line is specified by [lineRate] * [max-font-size of current-line].
  vertWordSpaceRate: 0.25, // extra space rate for vertical word in vertical mode.

  // we need to specify these values(color,font-image-root) to display vertical font-images for browsers not supporting vert writing-mode.
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",

  // font name is required to be managed to calculate proper text-metrics.
  fontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
  //fontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",

  // font sizes defined by name
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
  getMeasure : function(flow){
    return this[flow.getPropMeasure()];
  },
  getExtent : function(flow){
    return this[flow.getPropExtent()];
  },
  getPagingDirection : function(){
    return this.pagingDirection[this.direction];
  },
  getStdBoxFlow : function(){
    var flow_name = this.boxFlow[this.direction];
    return BoxFlows.getByName(flow_name);
  },
  getStdVertFlow : function(){
    return BoxFlows.getByName(this.boxFlow.vert);
  },
  getStdHoriFlow : function(){
    return BoxFlows.getByName(this.boxFlow.hori);
  },
  getRtFontSize : function(base_font_size){
    var rt = Style.rt || null;
    var rt_font_size = rt? rt["font-size"] : null;
    if(rt === null || rt_font_size === null){
      return Math.round(this.rubyRate * base_font_size);
    }
    return StyleContext.prototype._computeUnitSize.call(this, rt_font_size, base_font_size);
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
  Important notices about style.js
  ================================

  1. camel case property is not allowed
  -------------------------------------

    OK: {font-size:"16px"}
    NG: {fontSize:"16px"}

  2. some properties uses 'logical' properties
  --------------------------------------------

    [examples]
    Assume that Layout.direction is "hori" and Layout["hori"] is "lr-tb".

    ex1. {margin:{before:"10px"}} // => {margin:{top:"10px"}}
    ex2. {float:"start"} // => {float:"left"}.
    ex3. {measure:"100px", extent:"50px"} // => {width:"100px", height:"50px"}

  3. all class names must start with "nehan-" prefix
  --------------------------------------------------

     to avoid css collision that is not layouted by nehan.js,
     our css names must be prefixed by "nehan-".

  4. about functional css value
  ------------------------------

  you can use functional css value in each css property.

  (4.1) callback argument 'context' in functional css value is 'SelectorPropContext'

  // [example]
  // change backgroiund-color by child index.
  ".stripe-list li":{
    "background-color":function(context){
      return (context.getChildIndex() % 2 === 0)? "pink" : "white";
    }
  }

  (4.2) callback argument 'context' in 'onload' is 'SelectorContext'

  this context is 'extended class' of 'SelectorPropContext', with some extra interfaces
  that can touch css object, because 'onload' is called after all css of matched elements are loaded.

  // [example]
  // force image metrics to square sizing if width and height is not same.
  ".nehan-must-be-squares img":{
    "onload":function(context){
      var width = context.getCssAttr("width", 100);
      var height = context.getCssAttr("height", 100);
      if(width !== height){
	var larger = Math.max(width, height);
	return {width:larger, height:larger};
      }
    }
  }

 5. special properties in nehan.js
  ----------------------------------

  (5.1) line-rate:(float)

  In normal html, size of 'line-height:1.0em' is determined by
  font size of 'parent' block.

  In contrast, property line-rate is determined by max font size of
  'current line'.

  Assume that font-size of parent block is 16px, and max font size of
  current line is 32px, line-height:1.0em is 16px, but line-rate:1.0em is 32px.

  (5.2) box-sizing:[content-box | border-box | margin-box(default)]

  In box-sizing, 'margin-box' is special value in nehan.js, and is box-sizing default value.
  In margin-box, even if margin is included in box-size.

  Why? In normal html, outer size of box can be expanded,
  but in paged layout, outer size is strictly fixed.
  So if you represent margin/border/padding(called in edge in nehan.js),
  the only way is 'eliminating content space'.

  (5.3) flow:[lr-tb | rl-tb | tb-rl | tb-lr | flip]

  This property represent document-mode in nehan.js.

  'lr-tb' means inline flows 'left to right', block flows 'top to bottom'.

  'tb-rl' means inline flows 'top to bottom', block flows 'right to left', and so on.

  'flip' means toggle Layout["hori"] and Layout["vert"].
  for example, assume that Layout["hori"] is "lr-tb", and Layout["vert"] is "tb-rl",
  and current document direction(Layout.direction) is "hori",
  flow:"flip" means Layout["vert"], "tb-rl".
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
    //"box-sizing":"content-box",
    "section-root":true
  },
  "br":{
    "single":true,
    "display":"inline"
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
    "display":"table-caption",
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
    "display":"table-column"
  },
  "colgroup":{
    "display":"table-column-group"
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
    // in html4, page-break-before is 'always' by default.
    //"break-before":"always",
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
    "display":"none"
  },
  "header":{
    "display":"block",
    "section":true
  },
  "hr":{
    "display":"block",
    "single":true,
    "box-sizing":"content-box",
    "border-color":"#b8b8b8",
    "border-style":"solid",
    "margin":{
      "after":"1em"
    },
    "extent":"1px",
    "border-width":{
      "before":"1px"
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
    "single":true,
    "box-sizing":"content-box"
  },
  "input":{
    "display":"inline",
    "single":true,
    "interactive":true
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
  "li-marker":{
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
    "display":"table",
    "embeddable":true,
    "table-layout":"fixed", // 'auto' not supported yet.
    "background-color":"white",
    "border-collapse":"collapse", // 'separate' is not supported yet.
    "border-color":"#a8a8a8",
    "border-style":"solid",
    //"border-spacing":"5px", // TODO: support batch style like "5px 10px".
    "border-width":{
      "start":"1px",
      "before":"1px"
    },
    "margin":{
      "start":"0.5em",
      "end":"0.5em",
      "after":"1.6em"
    }
  },
  "tbody":{
    "display":"table-row-group",
    "border-collapse":"inherit"
  },
  "td":{
    "display":"table-cell",
    "section-root":true,
    "border-width":{
      "end":"1px"
    },
    "border-color":"#a8a8a8",
    "border-collapse":"inherit",
    "border-style":"solid",
    "padding":{
      "start":"0.5em",
      "end":"0.5em",
      "before":"0.4em",
      "after":"0.4em"
    }
  },
  "textarea":{
    "display":"inline",
    "embeddable":true,
    "interactive":true
  },
  "tfoot":{
    "display":"table-footer-group",
    "border-color":"#a8a8a8",
    "border-collapse":"inherit",
    "border-style":"solid",
    "font-style":"italic"
  },
  "th":{
    "display":"table-cell",
    "line-rate":1.4,
    "border-width":{
      "end":"1px"
    },
    "border-color":"#a8a8a8",
    "border-collapse":"inherit",
    "border-style":"solid",
    "padding":{
      "start":"0.5em",
      "end":"0.5em",
      "before":"0.4em",
      "after":"0.4em"
    }
  },
  "thead":{
    "display":"table-header-group",
    "font-weight":"bold",
    "background-color":"#c3d9ff",
    "border-color":"#a8a8a8",
    "border-collapse":"inherit",
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
    "border-collapse":"inherit",
    "border-color":"#a8a8a8",
    "border-style":"solid",
    "border-width":{
      "after":"1px"
    }
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
  "first-line":{
    //"display":"block !important" // TODO
    "display":"block"
  },
  // <page-break>, <pbr>, <end-page> are all same and nehan.js original tag,
  // defined to keep compatibility of older nehan.js document,
  // and must be defined as logical-break-before, logical-break-after props in the future.
  "page-break":{
    "single":true,
    "display":"inline"
  },
  "pbr":{
    "single":true,
    "display":"inline"
  },
  "end-page":{
    "single":true,
    "display":"inline"
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
    "font-size": Layout.fontSizeNames["xx-large"]
  },
  ".nehan-x-large":{
    "font-size": Layout.fontSizeNames["x-large"]
  },
  ".nehan-large":{
    "font-size": Layout.fontSizeNames.large
  },
  ".nehan-medium":{
    "font-size": Layout.fontSizeNames.medium
  },
  ".nehan-small":{
    "font-size": Layout.fontSizeNames.small
  },
  ".nehan-x-small":{
    "font-size": Layout.fontSizeNames["x-small"]
  },
  ".nehan-xx-small":{
    "font-size": Layout.fontSizeNames["xx-small"]
  },
  ".nehan-larger":{
    "font-size": Layout.fontSizeNames.larger
  },
  ".nehan-smaller":{
    "font-size": Layout.fontSizeNames.smaller
  },
  //-------------------------------------------------------
  // box-sizing classes
  //-------------------------------------------------------
  ".nehan-content-box":{
    "box-sizing":"content-box"
  },
  ".nehan-border-box":{
    "box-sizing":"border-box"
  },
  ".nehan-margin-box":{
    "box-sizing":"margin-box"
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
  ".nehan-disp-iblock":{
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
  // break
  //-------------------------------------------------------
  ".nehan-break-before":{
    "break-before":"always"
  },
  ".nehan-break-after":{
    "break-after":"always"
  },
  //-------------------------------------------------------
  // other utility classes
  //-------------------------------------------------------
  ".nehan-drop-caps::first-letter":{
    "display":"inline-block",
    "box-sizing":"content-box",
    "measure":"1em",
    "extent":"1em",
    "float":"start",
    "line-rate":1.0,
    "font-size":"4em"
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
      fn(prop, obj[prop]);
    }
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
  camelize : function(name){
    var self = this;
    return (name.indexOf("-") < 0)? name : List.mapi(name.split("-"), function(i, part){
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
  unescape : function(str) {
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/ /g, "&nbsp;")
      .replace(/\r/g, "&#13;")
      .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
  },
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      if(typeof args[prop] !== "undefined" && args[prop] !== ""){
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
    dst = dst || {};
    for(var prop in args){
      dst[prop] = args[prop];
    }
    return dst;
  },
  copy2 : function(dst, args){
    for(var prop in args){
      if(typeof dst[prop] === "object"){
	this.copy2(dst[prop], args[prop]);
      } else {
	dst[prop] = args[prop];
      }
    }
  },
  merge : function(dst, defaults, args){
    for(var prop in defaults){
      dst[prop] = (typeof args[prop] == "undefined")? defaults[prop] : args[prop];
    }
    return dst;
  }
};

/*
  there are css properties that are required to calculate accurate paged-layout,
  and we call them 'managed css properties'.

  managed css properties
  ======================
  after(nehan.js local property, same as 'bottom' if lr-tb)
  before(nehan.js local property, same as 'top' if lr-tb)
  border
  border-width
  border-radius(rounded corner after/before is cleared if page is devided into multiple pages)
  box-sizing
  break-after
  break-before
  color(required to switch charactor image src for some client)
  display
  end(nehan.js local property, same as 'right' if lr-tb)
  extent(nehan.js local property)
  float
  flow(nehan.js local property)
  font
  font-size
  font-family(required to get accurate text-metrics especially latin words)
  height
  letter-spacing
  line-rate(nehan.js local property)
  list-style
  list-style-image
  list-style-position
  list-style-type
  margin
  measure(nehan.js local property)
  padding
  position
  start(nehan.js local property, same as 'left' if lr-tb)
  text-align
  text-combine
  text-emphasis-style
  white-space
  width
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

  // props: [a,b,c]
  // values:[1,2,3]
  // => {a:1, b:2, c:3}
  var zip_obj = function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:zip_obj";
    }
    List.iteri(props, function(i, prop){ ret[prop] = values[i]; });
    return ret;
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
    return zip_obj(props, values_4d);
  };

  var parse_4d = function(value){
    return make_edge_4d(split_space(value));
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

  var format = function(prop, value){
    switch(typeof value){
    case "function": case "object": case "boolean":
      return value;
    }
    value = normalize(value); // number, string
    switch(prop){
    case "border":
      return parse_border_abbr(value);
    case "border-width":
      return parse_4d(value);
    case "border-radius":
      return parse_corner_4d(value);
    case "border-color":
      return parse_4d(value);
    case "border-style":
      return parse_4d(value);
    case "font":
      return parse_font_abbr(value);
    case "list-style":
      return parse_list_style_abbr(value);
    case "margin":
      return parse_4d(value);
    case "padding":
      return parse_4d(value);
    default: return value; // unmanaged properties is treated as it is.
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


var AttrSelector = (function(){
  function AttrSelector(expr){
    this.expr = this._normalize(expr);
    this.left = this.op = this.right = null;
    this._parseExpr(this.expr);
  }

  var rex_symbol = /[^=^~|$*\s]+/;
  var op_symbols = ["|=", "~=", "^=", "$=", "*=", "="];

  AttrSelector.prototype = {
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
    _testHasAttr : function(style){
      return style.getMarkupAttr(this.left) !== null;
    },
    _testEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      return value === this.right;
    },
    _testCaretEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      var rex = new RegExp("^" + this.right);
      return rex.test(value);
    },
    _testDollarEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      var rex = new RegExp(this.right + "$");
      return rex.test(value);
    },
    _testTildeEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      var values = value? value.split(/\s+/) : [];
      return List.exists(values, Closure.eq(this.right));
    },
    _testPipeEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      return value? (value == this.right || value.indexOf(this.right + "-") >= 0) : false;
    },
    _testStarEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      return value.indexOf(this.right) >= 0;
    },
    _testOp : function(style){
      switch(this.op){
      case "=":  return this._testEqual(style);
      case "^=": return this._testCaretEqual(style);
      case "$=": return this._testDollarEqual(style);
      case "|=": return this._testPipeEqual(style);
      case "~=": return this._testTildeEqual(style);
      case "*=": return this._testStarEqual(style);
      }
      throw "undefined operation:" + this.op;
    },
    test : function(style){
      if(this.op && this.left && this.right){
	return this._testOp(style);
      }
      if(this.left){
	return this._testHasAttr(style);
      }
      return false;
    }
  };

  return AttrSelector;
})();


var PseudoSelector = (function(){
  function PseudoSelector(expr){
    this.name = this._normalize(expr);
  }

  PseudoSelector.prototype = {
    hasPseudoElement : function(){
      return (this.name === "before" ||
	      this.name === "after" ||
	      this.name === "first-letter" ||
	      this.name === "first-line");
    },
    test : function(style){
      switch(this.name){
      // pseudo-element
      case "before": return true;
      case "after": return true;
      case "first-letter": return !style.isMarkupEmpty();
      case "first-line": return !style.isMarkupEmpty();

      // pseudo-class
      case "first-child": return style.isFirstChild();
      case "last-child": return style.isLastChild();
      case "first-of-type": return style.isFirstOfType();
      case "last-of-type": return style.isLastOfType();
      case "only-child": return style.isOnlyChild();
      case "only-of-type": return style.isOnlyOfType();
      case "empty": return style.isMarkupEmpty();
      case "root": return style.isRoot();
      }
      return false;
    },
    _normalize : function(expr){
      return expr.replace(/:+/g, "");
    }
  };

  return PseudoSelector;
})();


/* 
   single element type selector

   example:

   1. name selector
     div {font-size:xxx}

   2. class selector
     div.class{font-size:xxx}

   3. id selector
     div#id{font-size:xxx}

   4. attribute selector
     div[name=value]{font-size:xxx}

   5. pseudo-class selector
     li:first-child{font-weight:bold}

   6. pseudo-element selector
     div::first-line{font-size:xxx}
*/
var TypeSelector = (function(){
  function TypeSelector(opt){
    this.name = opt.name || null;
    this.id = opt.id || null;
    this.className = opt.className || null;
    this.attrs = opt.attrs || [];
    this.pseudo = opt.pseudo || null;
  }
  
  TypeSelector.prototype = {
    test : function(style){
      if(style === null){
	return false;
      }
      // name selector
      if(this.name && this.name != "*" && style.getMarkupName() != this.name){
	return false;
      }
      // class selector
      if(this.className && !style.hasMarkupClassName(this.className)){
	return false;
      }
      // id selector
      if(this.id && style.getMarkupId() != this.id){
	return false;
      }
      // attribute selectgor
      if(this.attrs.length > 0 && !this._testAttrs(style)){
	return false;
      }
      // pseudo-element, pseudo-class selector
      if(this.pseudo && !this.pseudo.test(style)){
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
	return this.pseudo.hasPseudoElement()? 0 : 1;
      }
      return 0;
    },
    getAttrSpec : function(){
      return this.attrs.length;
    },
    _testAttrs : function(style){
      return List.forall(this.attrs, function(attr){
	return attr.test(style);
      });
    }
  };

  return TypeSelector;
})();


var SelectorLexer = (function(){
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var rex_name = /^[\w-_\*!\?]+/;
  var rex_rexed_name = /^\/[^\/]+\//;
  var rex_id = /^#[\w-_]+/;
  var rex_class = /^\.[\w-_]+/;
  var rex_attr = /^\[[^\]]+\]/;
  var rex_pseudo = /^:{1,2}[\w-_]+/;

  SelectorLexer.prototype = {
    getTokens : function(){
      var tokens = [];
      while(this.buff !== ""){
	var token = this._getNextToken();
	if(token === null){
	  break;
	}
	tokens.push(token);
      }
      return tokens;
    },
    _getNextToken : function(){
      this.buff = Utils.trim(this.buff);
      if(this.buff === ""){
	return null;
      }
      var c1 = this.buff.charAt(0);
      switch(c1){
      case "+": case "~": case ">": // combinator
	this._stepBuff(1);
	return c1;
      default: // type-selecor
	return this._getTypeSelector();
      }
      throw "invalid selector:[" + this.buff + "]";
    },
    _normalize : function(src){
      return Utils.trim(src).replace(/\s+/g, " ");
    },
    _stepBuff : function(count){
      this.buff = Utils.trim(this.buff.slice(count));
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
    _getTypeSelector : function(){
      var name = this._getName() || this._getRexedName();
      var id = this._getId();
      var klass = this._getClass();
      var attrs = this._getAttrs();
      var pseudo = this._getPseudo();
      return new TypeSelector({
	name:((name && typeof name === "string")? name : null),
	rexedName:((name && name instanceof RegExp)? name : null),
	id:id,
	className:klass,
	attrs:attrs,
	pseudo:pseudo
      });
    },
    _getName : function(){
      return this._getByRex(rex_type_name);
    },
    // type name defined by regexp
    // "/h[1-6]/.nehan-some-class span"
    // => /h[16]/
    _getRexedName : function(){
      var rexed_name = this._getByRex(rex_rexed_name);
      if(rexed_name === null){
	return null;
      }
      return new RegExp(rexed_name.replace(/[\/]/g, ""));
    },
    _getName : function(){
      return this._getByRex(rex_name);
    },
    _getId : function(){
      var id = this._getByRex(rex_id);
      return id? id.substring(1) : null;
    },
    _getClass : function(){
      var klass = this._getByRex(rex_class);
      return klass? klass.substring(1) : null;
    },
    _getAttrs : function(){
      var attrs = [];
      while(true){
	var attr = this._getByRex(rex_attr);
	if(attr){
	  attrs.push(new AttrSelector(attr));
	} else {
	  break;
	}
      }
      return attrs;
    },
    _getPseudo : function(){
      var pseudo = this._getByRex(rex_pseudo);
      return pseudo? new PseudoSelector(pseudo) : null;
    }
  };

  return SelectorLexer;
})();


var SelectorStateMachine = (function(){
  var find_parent = function(style, parent_type){
    var ptr = style.parent;
    while(ptr !== null){
      if(parent_type.test(ptr)){
	return ptr;
      }
      ptr = ptr.parent;
    }
    return null;
  };

  var find_direct_parent = function(style, parent_type){
    var ptr = style.parent;
    if(ptr === null){
      return null;
    }
    return parent_type.test(ptr)? ptr : null;
  };

  // search adjacent sibling forom 'style' that matches f1 selector.
  var find_adj_sibling = function(style, f1){
    var sibling_index = style.getChildIndex();
    var prev_sibling = style.getParentNthChild(sibling_index - 1) || null;
    return (prev_sibling && f1.test(prev_sibling))? prev_sibling : null;
  };

  // search style context that matches f1 selector from all preceding siblings of 'style'.
  var find_prev_sibling = function(style, f1){
    var sibling_index = style.getChildIndex();
    for(var i = 0; i < sibling_index; i++){
      var prev_sibling = style.getParentNthChild(i);
      if(prev_sibling && f1.test(prev_sibling)){
	return prev_sibling;
      }
    }
    return null;
  }

  return {
    // return true if all the selector-tokens(TypeSelector or combinator) matches the style-context.
    accept : function(style, tokens){
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
      var f2, tmp, f1, combinator;
      while(pos >= 0){
	f2 = pop();
	if(f2 instanceof TypeSelector === false){
	  throw "selector syntax error:" + src;
	}
	if(!f2.test(style)){
	  return false;
	}
	tmp = pop();
	if(tmp === null){
	  return true;
	}
	if(tmp instanceof TypeSelector){
	  f1 = tmp;
	  combinator = " "; // descendant combinator
	} else if(typeof tmp === "string"){
	  combinator = tmp;
	  f1 = pop();
	  if(f1 === null || f1 instanceof TypeSelector === false){
	    throw "selector syntax error:" + src;
	  }
	}
	// test [f1 combinator f2]
	// notice that f2 is already accepted at this point, so next we check [f1 combinator] parts.
	// if style-context that matches [f1 combinator] is found, update 'style' to it, and next loop.
	switch(combinator){
	case " ": style = find_parent(style, f1); break; // search parent context that matches f1.
	case ">": style = find_direct_parent(style, f1); break; // search direct parent context that matches f1.
	case "+": style = find_adj_sibling(style, f1); break; // find adjacent sibling context that matches f1.
	case "~": style = find_prev_sibling(style, f1); break; // find previous sibling context that matches f1.
	default: throw "selector syntax error:invalid combinator(" + combinator + ")";
	}
	// can't find style-context that matches [f1 combinator f2]
	if(style === null){
	  return false;
	}
	// to start next loop from f1, push bach f1 token.
	push_back();
      }
      return true; // all accepted
    }
  }
})();


// Selector = [TypeSelector | TypeSelector + combinator + Selector]
var Selector = (function(){
  function Selector(key, value){
    this.key = this._normalizeKey(key); // selector source like 'h1 > p'
    this.value = this._formatValue(value); // associated css value object like {font-size:16px}
    this.parts = this._getSelectorParts(this.key); // [type-selector | combinator]
    this.spec = this._countSpec(this.parts); // specificity
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
    test : function(style, pseudo_element_name){
      if(pseudo_element_name && !this.hasPseudoElementName(pseudo_element_name)){
	return false;
      }
      return SelectorStateMachine.accept(style, this.parts);
    },
    updateValue : function(value){
      for(var prop in value){
	var fmt_value = CssParser.format(prop, value[prop]);
	if(typeof this.value[prop] === "object" && typeof fmt_value === "object"){
	  Args.copy(this.value[prop], fmt_value);
	} else {
	  this.value[prop] = fmt_value;
	}
      }
    },
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.value;
    },
    getSpec : function(){
      return this.spec;
    },
    hasPseudoElement : function(){
      return this.key.indexOf("::") >= 0;
    },
    hasPseudoElementName : function(element_name){
      return this.key.indexOf("::" + element_name) >= 0;
    },
    // count selector 'specificity'
    // see http://www.w3.org/TR/css3-selectors/#specificity
    _countSpec : function(parts){
      var a = 0, b = 0, c = 0;
      List.iter(parts, function(token){
	if(token instanceof TypeSelector){
	  a += token.getIdSpec();
	  b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	  c += token.getTypeSpec();
	}
      });
      return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
    },
    _getSelectorParts : function(key){
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
  var selectors = []; // selector list ordered by specificity desc.
  var selectors_pe = []; // selector (with pseudo-element) list, ordered by specificity desc.

  // sort selectors by specificity asc.
  // so higher specificity overwrites lower one.
  var sort_selectors = function(){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var sort_selectors_pe = function(){
    selectors_pe.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var is_pe_key = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  var find_selector = function(selector_key){
    var dst_selectors = is_pe_key(selector_key)? selectors_pe : selectors;
    return List.find(dst_selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  var update_value = function(selector_key, value){
    var style_value = Style[selector_key]; // old style value, must be found
    Args.copy(style_value, value); // overwrite new value to old
    var selector = find_selector(selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value);
  };

  var insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.hasPseudoElement()){
      selectors_pe.push(selector);
    } else {
      selectors.push(selector);
    }
    // to speed up 'init_selectors' function, we did not sort immediatelly after inserting value.
    // we sort entries after all selector_key and value are registered.
    return selector;
  };

  // apply Selector::test to style.
  // if matches, copy selector value to result object.
  // offcource, higher specificity overwrite lower one.
  var get_value = function(style){
    return List.fold(selectors, {}, function(ret, selector){
      return selector.test(style)? Args.copy(ret, selector.getValue()) : ret;
    });
  };

  // 'p::first-letter'
  // => style = 'p', pseudo_element_name = 'first-letter'
  var get_value_pe = function(style, pseudo_element_name){
    return List.fold(selectors_pe, {}, function(ret, selector){
      return selector.test(style, pseudo_element_name)? Args.copy(ret, selector.getValue()) : ret;
    });
  };

  var set_value = function(selector_key, value){
    // if selector_key already defined, just overwrite it.
    if(Style[selector_key]){
      update_value(selector_key, value);
      return;
    }
    insert_value(selector_key, value);

    var selector = insert_value(selector_key, value);

    // notice that 'sort_selectors'(or 'sort_selectors_pe') is not called in 'insert_value'.
    Style[selector_key] = selector.getValue();
    if(selector.hasPseudoElement()){
      sort_selectors_pe();
    } else {
      sort_selectors();
    }
  };

  var init_selectors = function(){
    // initialize selector list
    Obj.iter(Style, function(key, value){
      insert_value(key, value);
    });
    sort_selectors();
    sort_selectors_pe();
  };

  init_selectors();

  return {
    // selector_key: selector string
    // [example] => 'p.some', 'li.foo'
    //
    // value: associated selector value object.
    // [example] => {'color':'black', 'font-size':'16px'}
    setValue : function(selector_key, value){
      set_value(selector_key, value);
    },
    setValues : function(values){
      for(var selector_key in values){
	set_value(selector_key, values[selector_key]);
      }
    },
    // get selector css that matches to the style context.
    //
    // style: style context
    getValue : function(style){
      return get_value(style);
    },
    // get selector css that matches to the pseudo element of some style context.
    // notice that if selector_key is "p::first-letter",
    // pseudo-element is "first-letter" and style-context is "p".
    //
    // style: 'parent' style of pseudo-element
    // pseudo_element_name: "first-letter", "first-line", "before", "after" are available
    getValuePe : function(style, pseudo_element_name){
      return get_value_pe(style, pseudo_element_name);
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

var TagAttrs = (function(){
  function TagAttrs(src){
    var attrs_raw = TagAttrParser.parse(src);
    this.classes = this._parseClasses(attrs_raw);
    this.attrs = this._parseAttrs(attrs_raw, this.classes);
    this.dataset = this._parseDataset(attrs_raw);
  }

  var __data_name_of = function(name){
    return Utils.camelize(name.slice(5));
  };

  TagAttrs.prototype = {
    hasAttr : function(name){
      return (typeof this.attrs.name !== "undefined");
    },
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    addClass : function(klass){
      klass = (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      if(!this.hasClass(klass)){
	this.classes.push(klass);
	this.setAttr("class", [this.getAttr("class"), klass].join(" "));
      }
      return this.classes;
    },
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
      this.setAttr("class", this.classes.join(" "));
      return this.classes;
    },
    getAttr : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
    },
    getData : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.dataset[name] === "undefined")? def_value : this.dataset[name];
    },
    setAttr : function(name, value){
      if(name.indexOf("data-") === 0){
	this.setData(__data_name_of(name), value);
      } else {
	this.attrs[name] = value;
      }
    },
    setData : function(name, value){
      this.dataset[name] = value;
    },
    // <p class='hi hey'>
    // => ["nehan-hi", "nehan-hey"]
    _parseClasses : function(attrs_raw){
      var class_name = attrs_raw["class"] || "";
      class_name = Utils.trim(class_name.replace(/\s+/g, " "));
      var classes = (class_name === "")? [] : class_name.split(/\s+/);
      return List.map(classes, function(klass){
	return (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      });
    },
    _parseAttrs : function(attrs_raw, classes){
      var attrs = {};
      Obj.iter(attrs_raw, function(name, value){
	if(name === "id"){ // force add prefix "nehan-".
	  attrs[name] = (value.indexOf("nehan-") === 0)? value : "nehan-" + value;
	} else if(name === "class"){
	  attrs[name] = classes.join(" ");
	} else if(name.indexOf("data-") < 0){
	  attrs[name] = value;
	}
      });
      return attrs;
    },
    _parseDataset : function(attrs_raw){
      var dataset = {};
      for(var name in attrs_raw){
	if(name.indexOf("data-") === 0){
	  dataset[__data_name_of(name)] = attrs_raw[name];
	}
      }
      return dataset;
    }
  };

  return TagAttrs;
})();


// Important Notice:
// to avoid name-conflicts about existing name space of stylesheet,
// all class names and id in nehan.js are forced to be prefixed by "nehan-".
var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attrs = new TagAttrs(this.src);
  }

  Tag.prototype = {
    clone : function(){
      return new Tag(this.src, this.content);
    },
    setContent : function(content){
      if(this._fixed){
	return;
      }
      this.content = content;
    },
    setContentImmutable : function(status){
      this._fixed = status;
    },
    setAlias : function(name){
      this.alias = name;
    },
    setAttr : function(name, value){
      this.attrs.setAttr(name, value);
    },
    setData : function(name, value){
      this.attrs.setData(name, value);
    },
    addClass : function(klass){
      this.attrs.addClass(klass);
    },
    removeClass : function(klass){
      this.attrs.removeClass(klass);
    },
    getId : function(){
      return this.attrs.id;
    },
    getClasses : function(){
      return this.attrs.classes;
    },
    getName : function(){
      return this.alias || this.name;
    },
    getAttr : function(name, def_value){
      return this.attrs.getAttr(name, def_value);
    },
    getData : function(name, def_value){
      return this.attrs.getData(name, def_value);
    },
    getContent : function(){
      return this.content;
    },
    getSrc : function(){
      return this.src;
    },
    getWrapSrc : function(){
      if(this.content === ""){
	return this.src;
      }
      return this.src + this.content + "</" + this.name + ">";
    },
    hasClass : function(klass){
      return this.attrs.hasClass(klass);
    },
    hasAttr : function(name){
      return this.attrs.hasAttr(name);
    },
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    isCloseTag : function(){
      return this.name.charAt(0) === "/";
    },
    isSingleTag : function(){
      return this._single || false;
    },
    isEmpty : function(){
      return this.content === "";
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
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
  isNewLine : function(token){
    return token instanceof Char && token.isNewLineChar();
  },
  isWhiteSpace : function(token){
    return token instanceof Char && token.isWhiteSpaceChar();
  }
};


var Char = (function(){
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
  var kuten = ["\u3002","."];
  var touten = ["\u3001", ","];
  var kakko_start = ["\uff62","\u300c","\u300e","\u3010","\uff3b","\uff08","\u300a","\u3008","\u226a","\uff1c","\uff5b","\x7b","\x5b","\x28"];
  var kakko_end = ["\u300d","\uff63","\u300f","\u3011","\uff3d","\uff09","\u300b","\u3009","\u226b","\uff1e","\uff5d","\x7d","\x5d","\x29"];

  var small_kana = ["\u3041","\u3043","\u3045","\u3047","\u3049","\u3063","\u3083","\u3085","\u3087","\u308e","\u30a1","\u30a3","\u30a5","\u30a7","\u30a9","\u30f5","\u30f6","\u30c3","\u30e3","\u30e5","\u30e7","\u30ee"];

  var head_ng = ["\uff09","\x5c","\x29","\u300d","\u3011","\u3015","\uff3d","\x5c","\x5d","\u3002","\u300f","\uff1e","\u3009","\u300b","\u3001","\uff0e","\x5c","\x2e","\x2c","\u201d","\u301f"];

  var tail_ng = ["\uff08","\x5c","\x28","\u300c","\u3010","\uff3b","\u3014","\x5c","\x5b","\u300e","\uff1c","\u3008","\u300a","\u201c","\u301d"];

  Char.prototype = {
    getData : function(){
      return this.cnv || this.data;
    },
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
      css.clear = "both";
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
    _setupRef : function(c1){
      switch(c1){
      case "&lt;":
	Env.isTransformEnable? this._setRotate(90) : this._setImg("kakko7", 0.5); break;
      case "&gt;":
	Env.isTransformEnable? this._setRotate(90) : this._setImg("kakko8", 0.5); break;
      }
    },
    _setupNormal : function(code){
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
      case 12296:
	this._setImg("kakko7", 0.5); break;
      case 65310:
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
	this._setImg("tenten", 1, 1); break;
      case 58:
	this._setImg("tenten", 1, 1); break;
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
      case 8212: // Em dash(Generao Punctuation)
	this._setRotate(90); break;
      case 12540:
	this._setImg("onbiki", 1); break;
      case 45: // Hyphen-minus(Basic Latin)
	this._setCnv("&#65372;"); break;
      case 8213: // Horizontal bar(General Punctuation)
      case 65293: // Halfwidth and Fullwidth Forms
      case 9472: // Box drawings light horizontal(Box Drawing)
	this._setCnv("&#8212;");
	this._setRotate(90);
	break;
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
    isSpaceChar : function(){
      return this.data === " " || this.data === "&nbsp;" || this.data === "\u3000" || this.data === "\t";
    },
    isWhiteSpaceChar : function(){
      return this.isNewLineChar() || this.isSpaceChar();
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
      return Config.useVerticalGlyphIfEnable && Env.isVerticalGlyphEnable;
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
      if(line.style.letterSpacing){
	css["letter-spacing"] = line.style.letterSpacing + "px";
      }
      css.width = line.style.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["margin-left"] = "auto";
      css["margin-right"] = "auto";
      css["font-family"] = "monospace";
      return css;
    },
    getCssVertTransBody : function(line){
      var css = {};
      //css["font-family"] = line.style.getFontFamily();
      css["font-family"] = "monospace";
      return css;
    },
    getCssVertTransBodyTrident : function(line){
      var css = {};
      css["font-family"] = "monospace";
      //css["font-family"] = line.style.getFontFamily();
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
      css["font-family"] = "monospace";
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
      if(this_half_count < measure_half_count){
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
    getRbs : function(){
      return this.rbs;
    },
    getRtString : function(){
      return this.rt? this.rt.getContent() : "";
    },
    getRtFontSize : function(){
      return this.rtFontSize;
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
      var offset = Math.floor((line.style.getFontSize() - this.getRtFontSize()) / 3);
      css["font-size"] = this.getRtFontSize() + "px";
      css["line-height"] = "1em";
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
      this.rtFontSize = Layout.getRtFontSize(font.size);
      var advance_rbs = List.fold(this.rbs, 0, function(ret, rb){
	rb.setMetrics(flow, font);
	return ret + rb.getAdvance(flow, letter_spacing);
      });
      var advance_rt = this.rtFontSize * this.getRtString().length;
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
      context.font = font.toString(); // to get accurate metrics, font info is required.
      return context.measureText(text);
    },
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      var space = Math.floor(Layout.vertWordSpaceRate * font.size);
      return metrics.width + space;
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
      if(this.image !== null){
	return this.image.getMarkerHtml(count);
      }
      return this.type.getMarkerHtml(count);
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
    }
  };

  return Flow;
})();


var BlockFlow = (function(){
  function BlockFlow(dir){
    Flow.call(this, dir);
  }

  Class.extend(BlockFlow, Flow);

  BlockFlow.prototype.flip = function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Layout.getVertBlockdir();
    default: return "";
    }
  };

  // notice that "float" property is converted into "cssFloat" in evaluation time.
  BlockFlow.prototype.getCss = function(){
    var css = {};
    if(this.isHorizontal()){
      css["float"] = (this.dir === "lr")? "left" : "right";
    } else if(this.isVertical()){
      css["float"] = (this.dir === "lr")? "left" : "right";
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


var BoxFlow = (function(){
  function BoxFlow(indir, blockdir, multicol){
    this.inflow = new InlineFlow(indir);
    this.blockflow = new BlockFlow(blockdir, multicol);
  }

  BoxFlow.prototype = {
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
    getCss : function(){
      var css = {};
      Args.copy(css, this.blockflow.getCss());
      return css;
    },
    getName : function(){
      return [this.inflow.dir, this.blockflow.dir].join("-");
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
    getFlipFlow : function(){
      return this.isTextVertical()? Layout.getStdHoriFlow() : Layout.getStdVertFlow();
    },
    getBoxSize : function(measure, extent){
      var size = new BoxSize(0, 0);
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
  get: function(inflow, blockflow){
    return this.getByName([inflow, blockflow].join("-"));
  },
  getByName : function(name){
    return this[name] || null;
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
      var edge = new Edge(this._type);
      edge.top = this.top;
      edge.right = this.right;
      edge.bottom = this.bottom;
      edge.left = this.left;
      return edge;
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


var Uri = (function(){
  function Uri(address){
    this.address = this._normalize(address || "");
  }

  Uri.prototype = {
    _normalize : function(address){
      return address.replace(/\s/g, "");
    },
    getAddress : function(){
      return this.address;
    },
    getAnchorName : function(){
      var sharp_pos = this.address.indexOf("#");
      if(sharp_pos < 0){
	return "";
      }
      var anchor_name = this.address.substring(sharp_pos + 1);
      return (anchor_name.length > 0)? anchor_name : "";
    }
  };

  return Uri;
})();


var BoxEdge = (function (){
  function BoxEdge(){
    this.padding = new Padding();
    this.border = new Border();
    this.margin = new Margin();
  }

  BoxEdge.prototype = {
    clone : function(){
      var edge = new BoxEdge();
      edge.padding = this.padding.clone();
      edge.border = this.border.clone();
      edge.margin = this.margin.clone();
      return edge;
    },
    clear : function(){
      this.padding.clear();
      this.border.clear();
      this.margin.clear();
    },
    getCss : function(){
      var css = {};
      Args.copy(css, this.padding.getCss());
      Args.copy(css, this.border.getCss());
      Args.copy(css, this.margin.getCss());
      return css;
    },
    getWidth : function(){
      var ret = 0;
      ret += this.padding.getWidth();
      ret += this.border.getWidth();
      ret += this.margin.getWidth();
      return ret;
    },
    getHeight : function(){
      var ret = 0;
      ret += this.padding.getHeight();
      ret += this.border.getHeight();
      ret += this.margin.getHeight();
      return ret;
    },
    getMeasureSize : function(flow){
      var ret = 0;
      ret += this.padding.getMeasureSize(flow);
      ret += this.border.getMeasureSize(flow);
      ret += this.margin.getMeasureSize(flow);
      return ret;
    },
    getExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtentSize(flow);
      ret += this.margin.getExtentSize(flow);
      ret += this.border.getExtentSize(flow);
      return ret;
    },
    getInnerMeasureSize : function(flow){
      var ret = 0;
      ret += this.padding.getMeasureSize(flow);
      ret += this.border.getMeasureSize(flow);
      return ret;
    },
    getInnerExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtentSize(flow);
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
    this.width = width; // content width
    this.height = height; // content height
  }

  BoxSize.prototype = {
    clone : function(){
      return new BoxSize(this.width, this.height);
    },
    setExtent : function(flow, extent){
      this[flow.getPropExtent()] = extent;
    },
    setMeasure : function(flow, measure){
      this[flow.getPropMeasure()] = measure;
    },
    getCss : function(flow){
      var css = {};
      css.width = this.width + "px";
      css.height = this.height + "px";
      return css;
    },
    // get content size of measure
    getMeasure : function(flow){
      return this[flow.getPropMeasure()];
    },
    // get content size of extent
    getExtent : function(flow){
      return this[flow.getPropExtent()];
    }
  };

  return BoxSize;
})();

var BoxPosition = (function(){
  function BoxPosition(position){
    this.position = position;
  }

  BoxPosition.prototype = {
    isAbsolute : function(){
      return this.position === "absolute";
    },
    getCss : function(flow){
      var css = {};
      css.position = this.position;
      if(this.start){
	css[flow.getPropStart()] = this.start + "px";
      }
      if(this.end){
	css[flow.getPropEnd()] = this.end + "px";
      }
      if(this.before){
	css[flow.getPropBefore()] = this.before + "px";
      }
      if(this.after){
	css[flow.getPropAfter()] = this.after + "px";
      }
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

  var __filter_text = function(elements){
    return List.fold(elements, [], function(ret, element){
      if(element instanceof Box){
	return ret.concat(__filter_text(element.elements || []));
      }
      return ret.concat(element);
    });
  };

  Box.prototype = {
    isAnonymousLine : function(){
      return this.display === "inline" && this.style.isRootLine();
    },
    toLineString : function(){
      var texts = __filter_text(this.elements || []);
      return List.fold(texts, "", function(ret, text){
	return ret + (text? (text.data || "") : "");
      });
    },
    getClassName : function(){
      return this.classes? this.classes.join(" ") : "";
    },
    getContent : function(){
      return this.content || null;
    },
    getOnCreate : function(){
      // on create of anonymous line is already captured by parent element.
      if(this.isAnonymousLine()){
	return null;
      }
      return this.style.getCssAttr("oncreate");
    },
    getAttrs : function(){
      // attributes of anonymous line is already captured by parent element.
      if(this.isAnonymousLine()){
	return null;
      }
      return this.style.markup.attrs;
    },
    getCssRoot : function(){
      switch(this.display){
      case "block": return this.getCssBlock();
      case "inline": return this.getCssInline();
      case "inline-block": return this.getCssInlineBlock();
      }
    },
    getCssBlock : function(){
      var css = {};
      Args.copy(css, this.style.getCssBlock()); // base style
      Args.copy(css, this.size.getCss(this.style.flow)); // content size
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    getCssInline : function(){
      var css = {};
      Args.copy(css, this.style.getCssInline()); // base style
      Args.copy(css, this.size.getCss(this.style.flow)); // layout size
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    getCssInlineBlock : function(){
      var css = this.getCssBlock();
      if(!this.style.isFloated()){
	delete css["float"];
      }
      css.display = "inline-block";
      return css;
    },
    getContentMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.size.getMeasure(flow);
    },
    getContentExtent : function(flow){
      flow = flow || this.style.flow;
      return this.size.getExtent(flow);
    },
    getContentWidth : function(){
      return this.size.width;
    },
    getContentHeight : function(){
      return this.size.height;
    },
    getEdgeMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getMeasureSize(flow) : 0;
    },
    getEdgeExtent : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getExtentSize(flow) : 0;
    },
    getLayoutMeasure : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentMeasure(flow) + this.getEdgeMeasure(flow);
    },
    getLayoutExtent : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentExtent(flow) + this.getEdgeExtent(flow);
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
  var __rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var __rex_word = /^([\w!\.\?\/\_:#;"',]+)/;
  var __rex_tag = /^(<[^>]+>)/;
  var __rex_char_ref = /^(&[^;\s]+;)/;

  /*
  var __close_abbr_tags = [
    "li",
    "dt",
    "dd",
    "p",
    "tr",
    "td",
    "th",
    "rt",
    "rp",
    "optgroup",
    "option",
    "thread",
    "tfoot"
  ];*/

  var __find_close_pos = function(buff, tag_name, open_tag_rex, close_tag){
    var close_pos = buff.indexOf(close_tag);
    if(close_pos < 0){
      return -1;
    }
    var recur_match = buff.match(open_tag_rex);
    var recur_pos = recur_match? recur_match.index : -1;
    if(recur_pos < 0 || close_pos < recur_pos){
      return close_pos;
    }
    var restart_pos = recur_pos + tag_name.length + 2; // 2 = "<>".length
    var close_pos2 = arguments.callee(buff.substring(restart_pos), tag_name, open_tag_rex, close_tag);
    if(close_pos2 < 0){
      return -1;
    }
    var restart_pos2 = restart_pos + close_pos2 + tag_name.length + 3; // 3 = "</>".length
    return restart_pos2 + arguments.callee(buff.substring(restart_pos2), tag_name, open_tag_rex, close_tag);
  };

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
      if(this.buff.match(__rex_tag)){
	return this._parseTag(RegExp.$1);
      }
      if(this.buff.match(__rex_word)){
	var str = RegExp.$1;
	if(str.length === 1){
	  return this._parseChar(str);
	} else if(str.length === 2 && str.match(__rex_tcy)){
	  return this._parseTcy(str);
	}
	return this._parseWord(str);
      }
      if(this.buff.match(__rex_char_ref)){
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
      // why we added [\\s|>] for open_tag_rex?
      // because if we choose pattern only "<" + tag_name,
      // "<p" matches both "<p" and "<pre".
      var open_tag_rex = new RegExp("<" + tag_name + "[\\s|>]");
      var close_tag = "</" + tag_name + ">"; // tag name is already lower-cased by preprocessor.
      var close_pos = __find_close_pos(this.buff, tag_name, open_tag_rex, close_tag);

      if(close_pos >= 0){
	return {closed:true, content:this.buff.substring(0, close_pos)};
      }

      // if close pos not found and Config.enableAutoClose is true,
      // 1. return the text until next same start tag.
      // 2. or else, return whole rest buff.
      // (TODO): this is not strict lexing, especially when dt, dd, td, etc.
      if(Config.enableAutoCloseTag){
	var next_open_match = this.buff.match(open_tag_rex);
	if(next_open_match){
	  return {closed:false, content:this.buff.substring(0, nexd_open_match.index)};
	}
      }

      // all other case, return whole rest buffer.
      return {closed:false, content:this.buff};
    },
    _getTagContent : function(tag_name){
      try {
	return this._getTagContentAux(tag_name);
      } catch (e){
	return {closed:false, content:""};
      }
    },
    _parseTag : function(tagstr){
      var tag = new Tag(tagstr);
      this._stepBuff(tagstr.length);
      var tag_name = tag.getName();
      if(Style[tag_name] && Style[tag_name].single){
	tag._single = true;
	return tag;
      }
      return this._parseChildContentTag(tag);
    },
    _parseTcyTag : function(tag){
      var content = this._getTagContent(tag.name);
      this._stepBuff(content.length + tag.name.length + 3); // 3 = "</>".length
      return new Tcy(content);
    },
    _parseChildContentTag : function(tag){
      var result = this._getTagContent(tag.name);
      tag.setContent(Utils.trimCRLF(result.content));
      if(result.closed){
	this._stepBuff(result.content.length + tag.name.length + 3); // 3 = "</>".length
      } else {
	this._stepBuff(result.content.length);
      }
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
    getMarkupName : function(){
      return this.style.getMarkupName();
    },
    startSection : function(type){
      this.logs.push({
	name:"start-section",
	type:type,
	pageNo:DocumentContext.pageNo
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
	pageNo:DocumentContext.pageNo,
	headerId:header_id
      });
      return header_id;
    }
  };

  return OutlineContext;
})();

// parse : context -> section tree
var OutlineContextParser = (function(){
  var _parse = function(context, parent, ptr){
    var log = context.get(ptr++);
    if(log === null){
      return;
    }
    switch(log.name){
    case "start-section":
      var section = new Section(log.type, parent, log.pageNo);
      if(parent){
	parent.addChild(section);
      }
      arguments.callee(context, section, ptr);
      break;

    case "end-section":
      arguments.callee(context, parent.getParent(), ptr);
      break;

    case "set-header":
      var header = new SectionHeader(log.rank, log.title, log.headerId);
      if(parent === null){
	var auto_section = new Section("section", null, log.pageNo);
	auto_section.setHeader(header);
	arguments.callee(context, auto_section, ptr);
      } else if(!parent.hasHeader()){
	parent.setHeader(header);
	arguments.callee(context, parent, ptr);
      } else {
	var rank = log.rank;
	var parent_rank = parent.getRank();
	if(rank < parent_rank){ // higher rank
	  ptr = Math.max(0, ptr - 1);
	  arguments.callee(context, parent.getParent(), ptr);
	} else if(log.rank == parent_rank){ // same rank
	  var next_section = new Section("section", parent, log.pageNo);
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  arguments.callee(context, next_section, ptr);
	} else { // lower rank
	  var child_section = new Section("section", parent, log.pageNo);
	  child_section.setHeader(header);
	  parent.addChild(child_section);
	  arguments.callee(context, child_section, ptr);
	}
      }
      break;
    }
    return parent;
  };

  return {
    parse : function(context){
      var ptr = 0;
      var root = new Section("section", null, 0);
      return _parse(context, root, ptr);
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
//
// SectionTreeConverter::convert(outline_tree, callbacks)
//
// desc:
//   create dom node from section tree object.
//
// arguments:
// 1. section_tree
//   outlie tree object generated by OutlineContextParser(outline context -> section tree)
//
// 2. callbacks
//   callback objects that is hooked at each generation of node.
//
//   [supported hook-keys in callbacks object]
//
//   (1) onClickLink:
//       called when link object is clicked. do nothing by default.
//
//   (2) createRoot:
//       called when create dom root node, create <ul> by default.
//
//   (3) creatChild:
//       called when create dom child, create <li> by default.
//
//   (4) createLink:
//       called when create link node in dom child, create <a> by default.
//
//   (5) createToc:
//       called when create toc object from toc and tree context.
//       it is used in other callbacks as a callback argument.
//       create {tocPos:xxx, title:xxx, pageNo:xxx, headerId:xxx} by default.
//
//   (6) createPageNoItem:
//       called when create page no item node in link object, create nothing by default.
//
var SectionTreeConverter = (function(){
  var default_callbacks = {
    onClickLink : function(toc){
      return false;
    },
    createToc : function(toc_ctx, tree){
      return {
	tocPos:toc_ctx.toString(),
	title:tree.getTitle(),
	pageNo:tree.getPageNo(),
	headerId:tree.getHeaderId()
      };
    },
    createRoot : function(toc){
      var root = document.createElement("ul");
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

  var parse = function(toc_ctx, parent, tree, callbacks){
    if(tree === null){
      return parent;
    }
    var toc = callbacks.createToc(toc_ctx, tree);
    var li = callbacks.createChild(toc);
    var link = callbacks.createLink(toc);
    if(link){
      link.onclick = function(){
	return callbacks.onClickLink(toc);
      };
      li.appendChild(link);
    }
    var page_no_item = callbacks.createPageNoItem(toc);
    if(page_no_item){
      li.appendChild(page_no_item);
    }
    parent.appendChild(li);

    var child = tree.getChild();
    if(child){
      toc_ctx = toc_ctx.startRoot();
      var child_toc = callbacks.createToc(toc_ctx, child);
      var ol = callbacks.createRoot(child_toc);
      arguments.callee(toc_ctx, ol, child, callbacks);
      li.appendChild(ol);
      toc_ctx = toc_ctx.endRoot();
    }
    var next = tree.getNext();
    if(next){
      arguments.callee(toc_ctx.stepNext(), parent, next, callbacks);
    }
    return parent;
  };

  return {
    // section tree -> dom node
    convert : function(outline_tree, callbacks){
      callbacks = Args.merge({}, default_callbacks, callbacks || {});
      var toc_context = new TocContext();
      var root_node = callbacks.createRoot();
      return parse(toc_context, root_node, outline_tree, callbacks);
    }
  };
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


var DocumentContext = {
  documentType:"html",
  documentHeader:null,
  pageNo:0,
  charPos:0,
  anchors:{},
  outlineContexts:[],
  // this is shortcut function for getOutlineContextsByName
  // in many case, outline-context is only under "body" context,
  // and this function returns only one outline element just under the "body".
  createBodyOutlineElement : function(callbacks){
    var elements = this.createOutlineElementsByName("body", callbacks);
    if(elements.length > 0){
      return elements[0];
    }
    return null;
  },
  getOutlineContextsByName : function(section_root_name){
    return List.filter(this.outlineContexts, function(context){
      return context.getMarkupName() === section_root_name;
    });
  },
  createOutlineElementsByName : function(section_root_name, callbacks){
    var contexts = this.getOutlineContextsByName(section_root_name);
    return List.fold(contexts, [], function(ret, context){
      var tree = OutlineContextParser.parse(context);
      return tree? ret.concat(SectionTreeConverter.convert(tree, callbacks)) : ret;
    });
  },
  addOutlineContext : function(outline_context){
    this.outlineContexts.push(outline_context);
  },
  addAnchor : function(name){
    this.anchors[name] = this.pageNo;
  },
  getAnchorPageNo : function(name){
    return (typeof this.anchors[name] === "undefined")? null : this.anchors[name];
  }
};


var TokenStream = (function(){
  function TokenStream(src){
    this.lexer = this._createLexer(src);
    this.tokens = [];
    this.pos = 0;
    this.eof = false;
    this._doBuffer();
  }

  TokenStream.prototype = {
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
    prev : function(){
      this.pos = Math.max(0, this.pos - 1);
    },
    setPos : function(pos){
      this.pos = pos;
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
      if(token){
	token.pos = index;
	return token;
      }
      return null;
    },
    get : function(){
      var token = this.peek();
      this.pos++;
      return token;
    },
    getSrc : function(){
      return this.lexer.getSrc();
    },
    getPos : function(){
      return this.pos;
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
    // break if fn(x) return null.
    mapWhile : function(fn){
      var ret = [], token, output;
      while(this.hasNext()){
	token = this.get();
	output = fn(token);
	if(token && output){
	  ret.push(output);
	} else {
	  this.prev();
	  break;
	}
      }
      return ret;
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
    _createLexer : function(src){
      return new HtmlLexer(src);
    },
    _doBuffer : function(){
      var buff_len = Config.lexingBufferLen;
      for(var i = 0; i < buff_len; i++){
	var token = this.lexer.get();
	if(token === null){
	  this.eof = true;
	  break;
	}
	this.tokens.push(token);
      }
    }
  };

  return TokenStream;
})();


var FilteredTokenStream = (function(){
  function FilteredTokenStream(src, fn){
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
  Class.extend(FilteredTokenStream, TokenStream);

  return FilteredTokenStream;
})();

var DocumentTokenStream = (function(){
  function DocumentTokenStream(src){
    FilteredTokenStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "!doctype" || name === "html");
    });
    if(this.isEmptyTokens()){
      this.tokens = [new Tag("html", src)];
    }
  }
  Class.extend(DocumentTokenStream, FilteredTokenStream);

  return DocumentTokenStream;
})();

var HtmlTokenStream = (function(){
  function HtmlTokenStream(src){
    FilteredTokenStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "head" || name === "body");
    });
  }
  Class.extend(HtmlTokenStream, FilteredTokenStream);

  return HtmlTokenStream;
})();


var HeadTokenStream = (function(){
  function HeadTokenStream(src){
    FilteredTokenStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "title" ||
	      name === "meta" ||
	      name === "link" ||
	      name === "style" ||
	      name === "script");
    });
  }
  Class.extend(HeadTokenStream, FilteredTokenStream);

  return HeadTokenStream;
})();


var RubyTokenStream = (function(){
  function RubyTokenStream(markup_ruby){
    TokenStream.call(this, markup_ruby.getContent());
    this.getAll();
    this.tokens = this._parse(markup_ruby);
    this.rewind();
  }
  Class.extend(RubyTokenStream, TokenStream);

  RubyTokenStream.prototype._parse = function(markup_ruby){
    var ret = [];
    while(this.hasNext()){
      ret.push(this._parseRuby(markup_ruby));
    }
    return ret;
  };

  RubyTokenStream.prototype._parseRuby = function(markup_ruby){
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

  return RubyTokenStream;
})();


var Page = (function(){
  function Page(opt){
    Args.merge(this, {
      element:null,
      seekPos:0,
      pageNo:0,
      charPos:0,
      charCount:0,
      percent:0
    }, opt);
  }

  return Page;
})();


var PageEvaluator = (function(){
  function PageEvaluator(){
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype = {
    _getEvaluator : function(){
      return (Layout.direction === "vert")? new VertEvaluator() : new HoriEvaluator();
    },
    evaluate : function(tree){
      return tree? new Page({
	element:this.evaluator.evaluate(tree),
	percent:tree.percent,
	seekPos:tree.seekPos,
	pageNo:tree.pageNo,
	charPos:tree.charPos,
	charCount:tree.charCount
      }) : null;
    }
  };

  return PageEvaluator;
})();


var PageStream = (function(){
  function PageStream(text){
    this.text = this._createSource(text);
    this._trees = [];
    this._pages = [];
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
  }

  PageStream.prototype = {
    hasPage : function(page_no){
      return (typeof this._trees[page_no] != "undefined");
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    syncGet : function(){
      var page_no = 0;
      this._setTimeStart();
      while(this.hasNext()){
	if(!this.hasPage(page_no)){
	  var tree = this._yield();
	  if(tree){
	    this._addTree(tree);
	    page_no++;
	  }
	}
      }
      return this._getTimeElapsed();
    },
    asyncGet : function(opt){
      Args.merge(this, {
	onComplete : function(self, time){},
	onProgress : function(self, tree){},
	onError : function(self){}
      }, opt || {});
      this._setTimeStart();
      this._asyncGet(opt.wait || 0);
    },
    getPageCount : function(){
      return this._trees.length;
    },
    // same as getPage, defined to keep compatibility of older version of nehan.js
    get : function(page_no){
      return this.getPage(page_no);
    },
    // int -> Page
    getPage : function(page_no){
      if(this._pages[page_no]){
	return this._pages[page_no];
      }
      var tree = this._trees[page_no] || null;
      if(tree === null){
	return null;
      }
      var page = this.evaluator.evaluate(tree);
      this._pages[page_no] = page;
      return page;
    },
    getTree : function(page_no){
      return this._trees[page_no] || null;
    },
    // () -> tree
    _yield : function(){
      return this.generator.yield();
    },
    _setTimeStart : function(){
      this._timeStart = (new Date()).getTime();
      return this._timeStart;
    },
    _getTimeElapsed : function(){
      return (new Date()).getTime() - this._timeStart;
    },
    _asyncGet : function(wait){
      if(!this.generator.hasNext()){
	this.onComplete(this, this._getTimeElapsed());
	return;
      }
      // notice that result of yield is not a page object, it's abstruct layout tree,
      // so you need to call 'getPage' to get actual page object.
      var tree = this._yield();
      if(tree){
	this._addTree(tree);
	this.onProgress(this, tree);
      }
      var self = this;
      reqAnimationFrame(function(){
	self._asyncGet(wait);
      });
    },
    _addTree : function(tree){
      this._trees.push(tree);
    },
    _createSource : function(text){
      return text
	.replace(/\t/g, "") // discard TAB
	.replace(/<!--[\s\S]*?-->/g, "") // discard comment
	.replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
	.replace(/<rb>/gi, "") // discard rb
	.replace(/<\/rb>/gi, "") // discard /rb
	.replace(/<rt><\/rt>/gi, ""); // discard empty rt
    },
    _createGenerator : function(text){
      switch(Layout.root){
      case "document":
	return new DocumentGenerator(text);
      case "html":
	return new HtmlGenerator(text);
      default:
	return new BodyGenerator(text);
      }
    },
    _createEvaluator : function(){
      return new PageEvaluator();
    }
  };

  return PageStream;
})();


// notice charactors that can be shurinked is already shurinked in it's body size calculation in nehan.js.
// so this module only 'add' the space to start/end direction, that are not requiered to be shurinked.
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

var FloatDirection = (function(){
  function FloatDirection(value){
    this.value = value || "none";
  }

  FloatDirection.prototype = {
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

  return FloatDirection;
})();


var FloatDirections = {
  start:(new FloatDirection("start")),
  end:(new FloatDirection("end")),
  none:(new FloatDirection("none")),
  get : function(name){
    return this[name] || null;
  }
};

var Break = (function(){
  function Break(value){
    this.value = value;
  }

  Break.prototype = {
    isAlways : function(){
      return this.value === "always";
    },
    isAvoid : function(){
      return this.value === "avoid";
    },
    isFirst : function(){
      return (Layout.getPagingDirection() === "lr")? (this.value === "left") : (this.value === "right");
    },
    isSecond : function(){
      return (Layout.getPagingDirection() === "lr")? (this.value === "right") : (this.value === "left");
    },
    isNth : function(order){
    }
  };

  return Break;
})();


var Breaks = {
  before:{
    always:(new Break("always")),
    avoid:(new Break("avoid")),
    left:(new Break("left")),
    right:(new Break("right")),
    first:(new Break("first")), // correspond to break-before:"left"
    second:(new Break("second")) // correspond to break-before:"right"
  },
  after:{
    always:(new Break("always")),
    avoid:(new Break("avoid")),
    left:(new Break("left")),
    right:(new Break("right")),
    first:(new Break("first")), // correspond to break-before:"left"
    second:(new Break("second")) // correspond to break-before:"right"
  },
  getBefore : function(value){
    return this.before[value] || null;
  },
  getAfter : function(value){
    return this.after[value] || null;
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


var TextAligns = {
  start:(new TextAlign("start")),
  end:(new TextAlign("end")),
  center:(new TextAlign("center")),
  get : function(value){
    return this[value] || null;
  }
};

var SelectorPropContext = (function(){
  function SelectorPropContext(style, layout_context){
    this._style = style;
    this._layoutContext = layout_context || null;
  }

  SelectorPropContext.prototype = {
    getParentStyle : function(){
      return this._style.parent;
    },
    getMarkup : function(){
      return this._style.markup;
    },
    getRestMeasure : function(){
      return this._layoutContext? this._layoutContext.getInlineRestMeasure() : null;
    },
    getRestExtent : function(){
      return this._layoutContext? this._layoutContext.getBlockRestExtent() : null;
    },
    getChildIndex : function(){
      return this._style.getChildIndex();
    },
    getChildIndexOfType : function(){
      return this._style.getChildIndexOfType;
    }
  };

  return SelectorPropContext;
})();


// this context object is passed to "onload" callback.
// unlike SelectorPropContext, this context has reference to all css values associated with the selector key.
var SelectorContext = (function(){
  function SelectorContext(style, layout_context){
    SelectorPropContext.call(this, style, layout_context);
  }
  Class.extend(SelectorContext, SelectorPropContext);

  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this._style.getCssAttr(name, def_value);
  };

  SelectorContext.prototype.setCssAttr = function(name, value){
    this._style.inlineCss[name] = value;
  };

  return SelectorContext;
})();


var StyleContext = (function(){

  // to fetch first text part from content html.
  var __rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // these markups are not parsed, just ignored.
  var __disabled_markups = [
    "script",
    "noscript",
    "style",
    "input",
    "iframe",
    "form"
  ];

  // these properties must be under control of layout engine.
  var __managed_css_properties = [
    "border-color",
    "border-radius",
    "border-style",
    "border-width",
    "box-sizing",
    "break-after",
    "break-before",
    "color",
    "display",
    "extent",
    "embeddable", // flag
    "float",
    "flow",
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "height",
    "interactive", // flag
    "letter-spacing",
    "line-rate",
    "list-style-type",
    "list-style-position",
    "list-style-image",
    "margin",
    "measure",
    "meta", // flag
    "onload",
    "oncreate",
    "padding",
    "position",
    "section", // flag
    "section-root", // flag
    "text-align",
    "text-emphasis-style",
    "text-emphasis-position",
    "text-emphasis-color",
    "text-combine",
    "width"
  ];

  // properties that is not enabled even if it' unmanaged property.
  var __ignored_css_properties = [
    "line-height" // trouble with vertical-mode
  ];

  var __is_ignored_css_prop = function(prop){
    return List.exists(__ignored_css_properties, Closure.eq(prop));
  };

  var __is_managed_css_prop = function(prop){
    return List.exists(__managed_css_properties, Closure.eq(prop));
  };

  var __filter_unmanaged_css = function(selector_css){
    var css = {};
    Obj.iter(selector_css, function(prop, value){
      if(!__is_managed_css_prop(prop) && !__is_ignored_css_prop(prop)){
	css[prop] = value;
      }
    });
    return css;
  };

  var __filter_decorated_inline_elements = function(elements){
    var ret = [];
    List.iter(elements, function(element){
      if(element instanceof Box === false){
	return;
      }
      if(element.style.isTextEmphaEnable() || element.style.getMarkupName() === "ruby"){
	ret.push(element);
      } else if(element.elements){
	ret = ret.concat(__filter_decorated_inline_elements(element.elements));
      }
    });
    return ret;
  };

  // parent : parent style context
  // args :
  //   1. forceCss
  //     system css that must be applied.
  //   2. layoutContext
  //     layout-context at the point of this style-context created.
  function StyleContext(markup, parent, args){
    this._initialize(markup, parent, args);
  }

  StyleContext.prototype = {
    _initialize : function(markup, parent, args){
      args = args || {};
      this.markup = markup;
      this.markupName = markup.getName();
      this.parent = parent || null;
      this.childs = [];
      this.next = null;

      // initialize tree
      if(parent){
	parent.appendChild(this);
      }

      // create context for each functional css property.
      this.selectorContext = new SelectorPropContext(this, args.layoutContext || null);

      // create selector callback context,
      // this context is passed to "onload" callback.
      // unlike selector-context, this context has reference to all css values associated with this style.
      // because 'onload' callback is called after loading selector css.
      // notice that at this phase, css values are not converted into internal style object.
      // so by updating css value, you can update calculation of internal style object.
      this.callbackContext = new SelectorContext(this, args.layoutContext || null);

      // initialize css values
      this.selectorCss = {};
      this.inlineCss = {};
      this.unmanagedCss = {};

      // load selector css values
      // 1. load selector css
      // 2. load dynamic callback selector 'onload'
      Args.copy(this.selectorCss, this._loadSelectorCss(markup, parent));
      Args.copy(this.selectorCss, this._loadCallbackCss("onload"));

      // load inline css values
      // 1. load normal markup attribute 'style'
      // 2. load constructor argument 'args.forceCss' if exists.
      //    notice that 'args.forceCss' is given highest priority because it is system required style.
      Args.copy(this.inlineCss, this._loadInlineCss(markup));
      Args.copy(this.inlineCss, args.forceCss || {});

      // load unmanaged css values
      // unmanaged css is css properties that are directlly passed to dom.style object.
      // 1. filter all unmanaged css values from selector css
      // 2. filter all unmanaged css values from inline css
      Args.copy(this.unmanagedCss, __filter_unmanaged_css(this.selectorCss));
      Args.copy(this.unmanagedCss, __filter_unmanaged_css(this.inlineCss));
      Args.copy(this.unmanagedCss, this._loadUnmanagedCss(this.unmanagedCss));

      // always required properties
      this.display = this._loadDisplay(); // required
      this.flow = this._loadFlow(); // required
      this.boxSizing = this._loadBoxSizing(); // required

      // optional properties
      var color = this._loadColor();
      if(color){
	this.color = color;
      }
      var font = this._loadFont();
      if(font){
	this.font = font;
      }
      var position = this._loadPosition();
      if(position){
	this.position = position;
      }
      var edge = this._loadEdge(this.flow, this.getFontSize());
      if(edge){
	this.edge = edge;
      }
      var line_rate = this._loadLineRate();
      if(line_rate){
	this.lineRate = line_rate;
      }
      var text_align = this._loadTextAlign();
      if(text_align){
	this.textAlign = text_align;
      }
      var text_empha = this._loadTextEmpha();
      if(text_empha){
	this.textEmpha = text_empha;
      }
      var text_combine = this._loadTextCombine();
      if(text_combine){
	this.textCombine = text_combine;
      }
      var list_style = this._loadListStyle();
      if(list_style){
	this.listStyle = list_style;
      }
      // keyword 'float' is reserved in js, so we name this prop 'float direction' instead.
      var float_direction = this._loadFloatDirection();
      if(float_direction){
	this.floatDirection = float_direction;
      }
      var break_before = this._loadBreakBefore();
      if(break_before){
	this.breakBefore = break_before;
      }
      var break_after = this._loadBreakAfter();
      if(break_after){
	this.breakAfter = break_after;
      }

      // static size is defined in selector or tag attr, hightest priority
      this.staticMeasure = this._loadStaticMeasure();
      this.staticExtent = this._loadStaticExtent();

      // context size(outer size and content size) is defined by
      // 1. current static size
      // 2. parent size
      // 3. current edge size.
      this.initContextSize(this.staticMeasure, this.staticExtent);
    },
    // [context_size] = (outer_size, content_size)
    //
    // (a) outer_size
    //   1. if direct size is given, use it as outer_size.
    //   2. else if parent exists, current outer_size is the content_size of parent.
    //   3. else if parent not exists(root), use template layout size defined in layout.js.
    //
    // (b) content_size
    //   1. if edge(margin/padding/border) is defined, content_size = [outer_size] - [edge_size]
    //   2. else(no edge),  content_size = [outer_size]
    initContextSize : function(measure, extent){
      this.outerMeasure = measure  || (this.parent? this.parent.contentMeasure : Layout.getMeasure(this.flow));
      this.outerExtent = extent || (this.parent? this.parent.contentExtent : Layout.getExtent(this.flow));
      this.contentMeasure = this._computeContentMeasure(this.outerMeasure);
      this.contentExtent = this._computeContentExtent(this.outerExtent);
    },
    // if update static size, update context size too.
    updateStaticSize : function(measure, extent){
      this.staticMeasure = measure;
      this.staticExtent = extent;
      this.updateContextSize(measure, extent);
    },
    // if update context size, update all context size of children too.
    updateContextSize : function(measure, extent){
      this.initContextSize(measure, extent);
      List.iter(this.childs, function(child){
	child.updateContextSize(null, null);
      });
    },
    // clone style-context with temporary css
    clone : function(css){
      // no one can clone root style.
      if(this.parent === null){
	return this.createChild("div", css);
      }
      return new StyleContext(this.markup, this.parent, {forceCss:(css || {})});
    },
    // append child style context
    appendChild : function(child_style){
      if(this.childs.length > 0){
	List.last(this.childs).next = child_style;
      }
      this.childs.push(child_style);
    },
    removeChild : function(child_style){
      var index = List.indexOf(this.childs, Closure.eq(child_style));
      if(index >= 0){
	var removed_child = this.childs.splice(index, 1);
	return removed_child;
      }
      return null;
    },
    // inherit style with tag_name and css(optional).
    createChild : function(tag_name, css){
      var tag = new Tag("<" + tag_name + ">");
      var style = new StyleContext(tag, this, {forceCss:(css || {})});

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
      opt = opt || {};
      var elements = opt.elements || [];
      var measure = this.contentMeasure;
      var extent = (this.parent && opt.extent && this.staticExtent === null)? opt.extent : this.contentExtent;
      var box_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-block", "nehan-" + this.getMarkupName()].concat(this.markup.getClasses());
      var box = new Box(box_size, this);
      box.display = (this.display === "inline-block")? this.display : "block";
      box.edge = this.edge || null; // for Box::getLayoutExtent, Box::getLayoutMeasure
      box.elements = elements;
      box.classes = classes;
      box.charCount = List.fold(elements, 0, function(total, element){
	return total + (element? (element.charCount || 0) : 0);
      });
      box.breakAfter = this.isBreakAfter() || opt.breakAfter || false;
      box.content = opt.content || null;
      return box;
    },
    createImage : function(opt){
      opt = opt || {};
      // image size always considered as horizontal mode.
      var width = this.getMarkupAttr("width")? parseInt(this.getMarkupAttr("width"), 10) : (this.staticMeasure || this.font.size);
      var height = this.getMarkupAttr("height")? parseInt(this.getMarkupAttr("height"), 10) : (this.staticExtent || this.font.size);
      var classes = ["nehan-block", "nehan-image"].concat(this.markup.getClasses());
      var image_size = new BoxSize(width, height);
      var image = new Box(image_size, this);
      image.display = this.display; // inline, block, inline-block
      image.edge = this.edge || null;
      image.classes = classes;
      image.charCount = 0;
      if(this.isPushed()){
	image.pushed = true;
      } else if(this.isPulled()){
	image.pulled = true;
      }
      image.breakAfter = this.isBreakAfter() || opt.breakAfter || false;
      return image;
    },
    createLine : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var max_font_size = opt.maxFontSize || this.getFontSize();
      var max_extent = opt.maxExtent || 0;
      if(this.isTextEmphaEnable()){
	max_extent = Math.max(max_extent, this.getEmphaLineExtent());
      } else if(this.markup.name === "ruby"){
	max_extent = Math.max(max_extent, this.getRubyLineExtent());
      } else {
	max_extent = Math.max(max_extent, this.getAutoLineExtent());
      }
      var measure = (this.parent && opt.measure && this.staticMeasure === null && !this.isRootLine())? opt.measure : this.contentMeasure;
      if(this.display === "inline-block"){
	measure = this.staticMeasure || opt.measure;
      }
      var line_size = this.flow.getBoxSize(measure, max_extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()].concat(this.markup.getClasses());
      var line = new Box(line_size, this);
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = opt.elements || [];
      line.classes = this.isRootLine()? classes : classes.concat("nehan-" + this.getMarkupName());
      line.charCount = opt.charCount || 0;
      line.maxFontSize = max_font_size;
      line.maxExtent = max_extent;

      // edge of top level line is disabled.
      // for example, consider '<p>aaa<span>bbb</span>ccc</p>'.
      // anonymous line block('aaa' and 'ccc') is already edged by <p> in block level.
      // so if line is anonymous, edge must be ignored.
      line.edge = (this.edge && !this.isRootLine())? this.edge : null;

      // backup other line data. mainly required to restore inline-context.
      if(this.isRootLine()){
	line.lineBreak = opt.lineBreak || false;
	line.breakAfter = opt.breakAfter || false;
	line.inlineMeasure = opt.measure || this.contentMeasure;
	line.texts = opt.texts || [];

	// if vertical line, needs some position fix for decorated element(ruby, empha) to align baseline.
	if(this.isTextVertical()){
	  this._setVertBaseline(elements, max_font_size, max_extent);
	}
	if(this.textAlign && !this.textAlign.isStart()){
	  this._setTextAlign(line, this.textAlign);
	}
      }
      return line;
    },
    createBreakLine : function(){
      var line = new Box(this.flow.getBoxSize(this.contentMeasure, 0), this);
      line.breakAfter = true;
      line.elements = [];
      return line;
    },
    isDisabled : function(){
      if(List.exists(__disabled_markups, Closure.eq(this.getMarkupName()))){
	return true;
      }
      if(this.contentMeasure <= 0 || this.contentExtent <= 0){
	return true;
      }
      if(this.markup.isCloseTag()){
	return true;
      }
      if(!this.markup.isSingleTag() && this.isBlock() && this.isMarkupEmpty() && this.getContent() === ""){
	return true;
      }
      return false;
    },
    isBlock : function(){
      switch(this.display){
      case "block":
      case "table":
      case "table-caption":
      case "table-header-group": // <thead>
      case "table-row-group": // <tbody>
      case "table-footer-group": // <tfoot>
      case "table-row":
      case "table-cell":
      case "list-item":
	return true;
      }
      return false;
    },
    isRoot : function(){
      return this.parent === null;
    },
    isChildBlock : function(){
      return this.isBlock() && !this.isRoot();
    },
    isInlineBlock : function(){
      return this.display === "inline-block";
    },
    isInline : function(){
      return this.display === "inline";
    },
    // check if current inline is anonymous line block.
    // 1. line-object is just under the block element.
    //  <body>this text is included in anonymous line block</body>
    //
    // 2. line-object is just under the inline-block element.
    //  <div style='display:inline-block'>this text is included in anonymous line block</div>
    isRootLine : function(){
      return this.isBlock() || this.isInlineBlock();
    },
    isFloatStart : function(){
      return this.floatDirection && this.floatDirection.isStart();
    },
    isFloatEnd : function(){
      return this.floatDirection && this.floatDirection.isEnd();
    },
    isFloated : function(){
      return this.isFloatStart() || this.isFloatEnd();
    },
    isParallel : function(){
      return this.display === "list-item";
    },
    isPushed : function(){
      return this.getMarkupAttr("pushed") !== null;
    },
    isPulled : function(){
      return this.getMarkupAttr("pulled") !== null;
    },
    isPasted : function(){
      return this.getMarkupAttr("pasted") !== null;
    },
    isTextEmphaEnable : function(){
      return (this.textEmpha && this.textEmpha.isEnable())? true : false;
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    isPositionAbsolute : function(){
      return this.position.isAbsolute();
    },
    isPre : function(){
      var white_space = this.getCssAttr("white-space", "normal");
      return white_space === "pre";
    },
    isPageBreak : function(){
      switch(this.getMarkupName()){
      case "page-break": case "end-page": case "pbr":
	return true;
      default:
	return false;
      }
    },
    isBreakBefore : function(){
      return this.breakBefore? !this.breakBefore.isAvoid() : false;
    },
    isBreakAfter : function(){
      return this.breakAfter? !this.breakAfter.isAvoid() : false;
    },
    isFirstChild : function(){
      var childs = this.getParentChilds();
      return (childs.length > 0 && childs[0] === this);
    },
    isFirstOfType : function(){
      var childs = this.getParentChildsOfType(this.getMarkupName());
      return (childs.length > 0 && childs[0] === this);
    },
    // for descent parsing, last child can't be gained,
    // this pseudo-class is maybe enabled in future release.
    isLastChild : function(){
      //return List.last(this.getParentChilds()) === this;
      return false; // TODO
    },
    isLastOfType : function(){
      //return List.last(this.getParentChildsOfType(this.getMarkupName())) === this;
      return false; // TODO
    },
    isOnlyChild : function(){
      var childs = this.getParentChilds();
      return (childs.length === 1 && childs[0] === this);
    },
    isOnlyOfType : function(){
      var childs = this.getParentChildsOfType(this.getMarkupName());
      return (childs.length === 1 && childs[0] === this);
    },
    isMarkupEmpty : function(){
      return this.markup.isEmpty();
    },
    hasFlipFlow : function(){
      return this.parent? (this.flow !== this.parent.flow) : false;
    },
    hasMarkupClassName : function(class_name){
      return this.markup.hasClass(class_name);
    },
    // search property from markup attribute -> css
    getAttr : function(name, def_value){
      var ret = this.getMarkupAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      ret = this.getCssAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    // if markup is "<img src='aaa.jpg'>"
    // getMarkupAttr("src") => 'aaa.jpg'
    getMarkupAttr : function(name, def_value){
      if(name === "id"){
	return this.markup.id;
      }
      return this.markup.getAttr(name, def_value);
    },
    _evalCssAttr : function(name, value){
      // "oncreate" not return style, it's a hook called after this style is converted into dom element.
      // so leave it as it is.
      if(name === "oncreate"){
	return value; 
      }
      // if value is function, call with selector context, and format the returned value.
      if(typeof value === "function"){
	return CssParser.format(name, value(this.selectorContext));
      }
      return value; // already formatted
    },
    // priority: inline css > selector css
    getCssAttr : function(name, def_value){
      var ret;
      ret = this.getInlineCssAttr(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      ret = this.getSelectorCssAttr(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getInlineCssAttr : function(name){
      return this.inlineCss[name] || null;
    },
    getSelectorCssAttr : function(name){
      return this.selectorCss[name] || null;
    },
    getMarkupName : function(){
      return this.markup.getName();
    },
    // if markup is <p id="foo">, markup.id is "nehan-foo".
    getMarkupId : function(){
      return this.markup.getId();
    },
    getMarkupContent : function(){
      return this.markup.getContent();
    },
    getMarkupPos : function(){
      return this.markup.pos;
    },
    getContent : function(){
      var content = this.markup.getContent();
      if(this.isBreakBefore()){
	content = "<page-break>" + content;
      }
      var before = Selectors.getValuePe(this, "before");
      if(!Obj.isEmpty(before)){
	content = Html.tagWrap("before", before.content || "") + content;
      }
      var after = Selectors.getValuePe(this, "after");
      if(!Obj.isEmpty(after)){
	content = content + Html.tagWrap("after", after.content || "");
      }
      var first_letter = Selectors.getValuePe(this, "first-letter");
      if(!Obj.isEmpty(first_letter)){
	content = content.replace(__rex_first_letter, function(match, p1, p2, p3){
	  return p1 + Html.tagWrap("first-letter", p3);
	});
      }
      var first_line = Selectors.getValuePe(this, "first-line");
      if(!Obj.isEmpty(first_line)){
	content = Html.tagWrap("first-line", content);
      }
      return content;
    },
    getHeaderRank : function(){
      return this.markup.getHeaderRank();
    },
    getFontSize : function(){
      return this.font.size;
    },
    getFontFamily : function(){
      return this.font.family || Layout.fontFamily;
    },
    getTextAlign : function(){
      return this.textAlign || TextAligns.get("start");
    },
    getTextCombine : function(){
      return this.textCombine || null;
    },
    getLetterSpacing : function(){
      return this.letterSpacing || 0;
    },
    getMarkerHtml : function(order){
      return this.listStyle? this.listStyle.getMarkerHtml(order) : "";
    },
    getColor : function(){
      return this.color || (this.parent? this.parent.getColor() : new Color(Layout.fontColor));
    },
    getChildCount : function(){
      return this.childs.length;
    },
    getChildIndex : function(){
      var self = this;
      return List.indexOf(this.getParentChilds(), function(child){
	return child === self;
      });
    },
    getChildIndexOfType : function(){
      var self = this;
      return List.indexOf(this.getParentChildsOfType(this.getMarkupName()), function(child){
	return child === self;
      });
    },
    getNthChild : function(nth){
      return this.childs[nth] || null;
    },
    getParentChilds : function(){
      return this.parent? this.parent.childs : [];
    },
    getParentNthChild : function(nth){
      return this.parent? this.parent.getNthChild(nth) : null;
    },
    getParentChildsOfType : function(markup_name){
      return List.filter(this.getParentChilds(), function(child){
	return child.getMarkupName() === markup_name;
      });
    },
    getParentFlow : function(){
      return this.parent? this.parent.flow : this.flow;
    },
    getParentContentMeasure : function(){
      return this.parent? this.parent.contentMeasure : this.contentMeasure;
    },
    getNextSibling : function(){
      return this.next;
    },
    getLineRate : function(){
      return this.lineRate || Layout.lineRate || 2;
    },
    getEmphaLineExtent : function(){
      return this.getFontSize() * 3;
    },
    getRubyLineExtent : function(){
      var base_font_size = this.getFontSize();
      var base_extent = Math.floor(base_font_size * this.getLineRate());
      var rt_extent = Layout.getRtFontSize(base_font_size);
      return base_extent + rt_extent;
    },
    getAutoLineExtent : function(){
      return Math.floor(this.getFontSize() * this.getLineRate());
    },
    getEdge : function(){
      return this.contextParent? this.contextParent.getEdge() : (this.edge || null);
    },
    getEdgeMeasure : function(flow){
      var edge = this.getEdge();
      return edge? edge.getMeasureSize(flow || this.flow) : 0;
    },
    getEdgeExtent : function(flow){
      var edge = this.getEdge();
      return edge? edge.getExtentSize(flow || this.flow) : 0;
    },
    getInnerEdgeMeasure : function(){
      var edge = this.getEdge();
      return edge? edge.getInnerMeasureSize() : 0;
    },
    getInnerEdgeExtent : function(){
      var edge = this.getEdge();
      return edge? edge.getInnerExtentSize() : 0;
    },
    // notice that box-size, box-edge is box local variable,
    // so style of box-size(content-size) and edge-size are generated at Box::getCssBlock
    getCssBlock : function(){
      var css = {};
      css.display = "block";
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.letterSpacing && !this.flow.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      if(this.floatDirection){
	Args.copy(css, this.floatDirection.getCss(this.flow));
      }
      if(this.position){
	Args.copy(css, this.position.getCss());
      }
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      Args.copy(css, this.unmanagedCss);
      css.overflow = "hidden"; // to avoid margin collapsing
      return css;
    },
    // notice that line-size, line-edge is box local variable,
    // so style of line-size(content-size) and edge-size are generated at Box::getCssInline
    getCssInline : function(){
      var css = {};
      css["line-height"] = "1em";
      if(this.parent && this.isRootLine()){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      // top level line need to follow parent blockflow.
      if(this.isRootLine()){
	Args.copy(css, this.flow.getCss());
      }
      if(this.flow.isTextVertical()){
	if(Env.isIphoneFamily){
	  css["letter-spacing"] = "-0.001em";
	}
	if(this.markup.getName() !== "ruby"){
	  css["margin-left"] = css["margin-right"] = "auto";
	  css["text-align"] = "center";
	}
      }
      Args.copy(css, this.unmanagedCss);
      return css;
    },
    _computeContentMeasure : function(outer_measure){
      switch(this.boxSizing){
      case "margin-box": return outer_measure - this.getEdgeMeasure();
      case "border-box": return outer_measure - this.getInnerEdgeMeasure();
      case "content-box": default: return outer_measure;
      }
    },
    _computeContentExtent : function(outer_extent){
      switch(this.boxSizing){
      case "margin-box": return outer_extent - this.getEdgeExtent();
      case "border-box": return outer_extent - this.getInnerEdgeExtent();
      case "content-box": default: return outer_extent;
      }
    },
    _computeFontSize : function(val, unit_size){
      var str = String(val).replace(/\/.+$/, ""); // remove line-height value like 'large/150%"'
      var size = Layout.fontSizeNames[str] || str;
      var font_size = this._computeUnitSize(size, unit_size);
      return Math.min(font_size, Layout.maxFontSize);
    },
    _computeUnitSize : function(val, unit_size){
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
	var max_size = this.getParentContentMeasure();
	return Math.round(max_size * parseInt(str, 10) / 100);
      }
      var px = parseInt(str, 10);
      return isNaN(px)? 0 : px;
    },
    _computeCornerSize : function(val, unit_size){
      var ret = {};
      for(var prop in val){
	ret[prop] = [0, 0];
	ret[prop][0] = this._computeUnitSize(val[prop][0], unit_size);
	ret[prop][1] = this._computeUnitSize(val[prop][1], unit_size);
      }
      return ret;
    },
    _computeEdgeSize : function(val, unit_size){
      var ret = {};
      for(var prop in val){
	ret[prop] = this._computeUnitSize(val[prop], unit_size);
      }
      return ret;
    },
    _setTextAlign : function(line, text_align){
      var content_measure  = line.getContentMeasure(this.flow);
      var space_measure = content_measure - line.inlineMeasure;
      if(space_measure <= 0){
	return;
      }
      var padding = new Padding();
      if(text_align.isCenter()){
	var start_offset = Math.floor(space_measure / 2);
	line.size.setMeasure(this.flow, content_measure - start_offset);
	padding.setStart(this.flow, start_offset);
	Args.copy(line.css, padding.getCss());
      } else if(text_align.isEnd()){
	line.size.setMeasure(this.flow, line.inlineMeasure);
	padding.setStart(this.flow, space_measure);
	Args.copy(line.css, padding.getCss());
      }
    },
    _setVertBaseline : function(elements, max_font_size, max_extent){
      var flow = this.flow;
      var base_font_size = this.getFontSize();
      var text_center = Math.floor(max_extent / 2); // center line offset

      // before align baseline, align all extents of children to max_extent.
      List.iter(elements, function(element){
	if(element instanceof Box && element.style.getMarkupName() !== "img" && element.style.display !== "inline-block"){
	  element.size.setExtent(flow, max_extent);
	}
      });

      // pickup decorated elements that has different baseline(ruby or empha)
      var decorated_elements = __filter_decorated_inline_elements(elements);
      List.iter(decorated_elements, function(element){
	var font_size = element.style.getFontSize();
	var text_center_offset = text_center - Math.floor(font_size / 2); // text displayed at half font-size minus from center line.
	if(text_center_offset > 0){
	  var edge = element.style.edge? element.style.edge.clone() : new BoxEdge();
	  edge.padding.setAfter(flow, text_center_offset); // set offset to padding

	  // set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	  Args.copy(element.css, edge.getCss(flow));
	}
      });
    },
    _loadSelectorCss : function(markup, parent){
      switch(markup.getName()){
      case "before":
      case "after":
      case "first-letter":
      case "first-line":
	// notice that parent style is the style base of pseudo-element.
	return Selectors.getValuePe(parent, markup.getName());

      default:
	return Selectors.getValue(this);
      }
    },
    _loadInlineCss : function(markup){
      var style = markup.getAttr("style");
      if(style === null){
	return {};
      }
      var stmts = (style.indexOf(";") >= 0)? style.split(";") : [style];
      return List.fold(stmts, {}, function(ret, stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]).toLowerCase();
	  var value = Utils.trim(nv[1]);
	  ret[prop] = CssParser.format(prop, value);
	}
	return ret;
      });
    },
    // nehan.js can change style dynamically by layout-context.
    //
    // [example]
    // engine.setStyle("p", {
    //   "onload" : function(context){
    //      var min_extent = parseInt(context.getMarkup().getData("minExtent"), 10);
    //	    if(context.getRestExtent() < min_extent){
    //        return {"page-break-before":"always"};
    //      }
    //   }
    // });
    //
    // then markup "<p data-min-extent='100'>text</p>" will be broken before
    // if rest extent is less than 100.
    _loadCallbackCss : function(name){
      var callback = this.getSelectorCssAttr(name);
      if(callback === null || typeof callback !== "function"){
	return {};
      }
      var ret = callback(this.callbackContext) || {};
      for(var prop in ret){
	ret[prop] = this._evalCssAttr(prop, ret[prop]);
      }
      return ret;
    },
    _loadUnmanagedCss : function(unmanaged_css){
      var ret = {};
      for(var prop in unmanaged_css){
	ret[prop] = this._evalCssAttr(prop, unmanaged_css[prop]);
      }
      return ret;
    },
    _loadDisplay : function(){
      return this.getCssAttr("display", "inline");
    },
    _loadFlow : function(){
      var value = this.getCssAttr("flow", "inherit");
      var parent_flow = this.parent? this.parent.flow : Layout.getStdBoxFlow();
      if(value === "inherit"){
	return parent_flow;
      }
      if(value === "flip"){
	return parent_flow.getFlipFlow();
      }
      return BoxFlows.getByName(value);
    },
    _loadPosition : function(){
      var value = this.getCssAttr("position", "static");
      if(value === "start"){
	return null;
      }
      var position = new BoxPosition(value);
      var self = this;
      List.iter(Const.cssBoxDirsLogical, function(dir){
	var value = self.getCssAttr(dir, "auto");
	if(value !== "auto"){
	  position[value] = self._computeUnitSize(start, self.font.size);
	}
      });
      return position;
    },
    _loadColor : function(){
      var value = this.getCssAttr("color", "inherit");
      if(value !== "inherit"){
	return new Color(value);
      }
    },
    _loadFont : function(){
      var parent_font_size = this.parent? this.parent.font.size : Layout.fontSize;
      var font = new Font(parent_font_size);
      var font_size = this.getCssAttr("font-size", "inherit");
      if(font_size !== "inherit"){
	font.size = this._computeFontSize(font_size, parent_font_size);
      }
      var font_family = this.getCssAttr("font-family", "inherit");
      if(font_family !== "inherit"){
	font.family = font_family;
      } else if(this.parent === null){
	font.family = Layout.fontFamily;
      }
      var font_weight = this.getCssAttr("font-weight", "inherit");
      if(font_weight !== "inherit"){
	font.weight = font_weight;
      }
      var font_style = this.getCssAttr("font-style", "inherit");
      if(font_style !== "inherit"){
	font.style = font_style;
      }
      return font;
    },
    _loadBoxSizing : function(){
      return this.getCssAttr("box-sizing", "margin-box");
    },
    _loadEdge : function(flow, font_size){
      var padding = this.getCssAttr("padding");
      var margin = this.getCssAttr("margin");
      var border_width = this.getCssAttr("border-width");
      if(padding === null && margin === null && border_width === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	edge.padding.setSize(flow, this._computeEdgeSize(padding, font_size));
      }
      if(margin){
	edge.margin.setSize(flow, this._computeEdgeSize(margin, font_size));
      }
      if(border_width){
	edge.border.setSize(flow, this._computeEdgeSize(border_width, font_size));
      }
      var border_radius = this.getCssAttr("border-radius");
      if(border_radius){
	edge.setBorderRadius(flow, this._computeCornerSize(border_radius, font_size));
      }
      var border_color = this.getCssAttr("border-color");
      if(border_color){
	edge.setBorderColor(flow, border_color);
      }
      var border_style = this.getCssAttr("border-style");
      if(border_style){
	edge.setBorderStyle(flow, border_style);
      }
      return edge;
    },
    _loadLineRate : function(){
      var value = this.getCssAttr("line-rate", "inherit");
      if(value === "inherit" && this.parent && this.parent.lineRate){
	return this.parent.lineRate;
      }
      return parseFloat(value || Layout.lineRate);
    },
    _loadTextAlign : function(){
      var value = this.getCssAttr("text-align", "inherit");
      if(value === "inherit" && this.parent && this.parent.textAlign){
	return this.parent.textAlign;
      }
      return TextAligns.get(value || "start");
    },
    _loadTextEmpha : function(){
      var empha_style = this.getCssAttr("text-emphasis-style", "none");
      if(empha_style === "none" || empha_style === "inherit"){
	return null;
      }
      var empha_pos = this.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = this.getCssAttr("text-emphasis-color");
      return new TextEmpha({
	style:new TextEmphaStyle(empha_style),
	pos:new TextEmphaPos(empha_pos),
	color:(empha_color? new Color(empha_color) : this.getColor())
      });
    },
    _loadTextEmphaStyle : function(){
      var value = this.getCssAttr("text-emphasis-style", "inherit");
      return (value !== "inherit")? new TextEmphaStyle(value) : null;
    },
    _loadTextEmphaPos : function(){
      return this.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
    },
    _loadTextEmphaColor : function(color){
      return this.getCssAttr("text-emphasis-color", color.getValue());
    },
    _loadTextCombine : function(){
      return this.getCssAttr("text-combine");
    },
    _loadFloatDirection : function(){
      var name = this.getCssAttr("float", "none");
      if(name === "none"){
	return null;
      }
      return FloatDirections.get(name);
    },
    _loadBreakBefore : function(){
      var value = this.getCssAttr("break-before");
      return value? Breaks.getBefore(value) : null;
    },
    _loadBreakAfter : function(){
      var value = this.getCssAttr("break-after");
      return value? Breaks.getAfter(value) : null;
    },
    _loadListStyle : function(){
      var list_style_type = this.getCssAttr("list-style-type", "none");
      if(list_style_type === "none"){
	return null;
      }
      return new ListStyle({
	type:list_style_type,
	position:this.getCssAttr("list-style-position", "outside"),
	image:this.getCssAttr("list-style-image", "none")
      });
    },
    _loadLetterSpacing : function(font_size){
      var letter_spacing = this.getCssAttr("letter-spacing");
      if(letter_spacing){
	return this._computeUnitSize(letter_spacing, font_size);
      }
    },
    _loadStaticMeasure : function(){
      var prop = this.flow.getPropMeasure();
      var static_size = this.getAttr(prop) || this.getAttr("measure") || this.getCssAttr(prop) || this.getCssAttr("measure");
      return static_size? this._computeUnitSize(static_size, this.font.size) : null;
    },
    _loadStaticExtent : function(){
      var prop = this.flow.getPropExtent();
      var static_size = this.getAttr(prop) || this.getAttr("extent") || this.getCssAttr(prop) || this.getCssAttr("extent");
      return static_size? this._computeUnitSize(static_size, this.font.size) : null;
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
    hasBreakAfter : function(){
      return this.block.hasBreakAfter() || this.inline.hasBreakAfter() || false;
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
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    setBreakAfter : function(status){
      this.inline.setBreakAfter(status);
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
    getInlineMaxExtent : function(){
      return this.inline.getMaxExtent();
    },
    getInlineMaxFontSize : function(){
      return this.inline.getMaxFontSize();
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
    this.breakAfter = false;
  }

  BlockContext.prototype = {
    isSpaceLeft : function(){
      return this.getRestExtent() > 0;
    },
    hasSpaceFor : function(extent){
      return this.getRestExtent() >= extent;
    },
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    _onAddElement : function(element, extent){
      this.curExtent += extent;
      if(element.breakAfter){
	this.breakAfter = true;
      }
    },
    addElement : function(element, extent){
      this.elements.push(element);
      this._onAddElement(element, extent);
    },
    pushElement : function(element, extent){
      this.pushedElements.push(element);
      this._onAddElement(element, extent);
    },
    pullElement : function(element, extent){
      this.pulledElements.unshift(element);
      this._onAddElement(element, extent);
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
    this.maxExtent = 0;
    this.maxFontSize = 0;
    this.elements = [];
    this.texts = [];
    this.lineBreak = false; // is line-break included in line?
    this.breakAfter = false; // is break-after incuded in line?
  }

  InlineContext.prototype = {
    isEmpty : function(){
      return !this.lineBreak && !this.breakAfter && this.elements.length === 0;
    },
    isSpaceLeft : function(){
      return this.getRestMeasure() > 0;
    },
    hasSpaceFor : function(measure){
      return this.getRestMeasure() >= measure;
    },
    hasLineBreak : function(){
      return this.lineBreak;
    },
    setLineBreak : function(status){
      this.lineBreak = status;
    },
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    setBreakAfter : function(status){
      this.breakAfter = status;
    },
    addElement : function(element, measure){
      this.elements.push(element);
      if(Token.isText(element)){
	this.texts.push(element);
	if(element.getCharCount){
	  this.charCount += element.getCharCount();
	}
      } else if(element instanceof Box){
	if(element.maxExtent){
	  this.maxExtent = Math.max(this.maxExtent, element.maxExtent);
	} else {
	  this.maxExtent = Math.max(this.maxExtent, element.getLayoutExtent());
	}
	if(element.maxFontSize){
	  this.maxFontSize = Math.max(this.maxFontSize, element.maxFontSize);
	}
	if(element.breakAfter){
	  this.breakAfter = true;
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
    getMaxExtent : function(){
      return this.maxExtent;
    },
    getMaxFontSize : function(){
      return this.maxFontSize;
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
    this._parentLayout = null;
    this._childLayout = null;
    this._cachedElements = [];
    this._terminate = false; // used to force terminate generator.
  }

  // 1. create child layout context from parent layout context.
  // 2. call _yield implemented in inherited class.
  LayoutGenerator.prototype.yield = function(parent_context){
    var context = parent_context? this._createChildContext(parent_context) : this._createStartContext();
    return this._yield(context);
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  LayoutGenerator.prototype.setTerminate = function(status){
    this._terminate = status;
  };

  LayoutGenerator.prototype.setChildLayout = function(generator){
    this._childLayout = generator;
    generator._parentLayout = this;
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
	console.error("[%s] too many cache count(%d), force terminate:%o", this.style.getMarkupName(), cache_count, this.style);
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

  // called when each time generator yields element of output, and added it.
  LayoutGenerator.prototype._onAddElement = function(block){
  };

  // called when each time generator yields output.
  LayoutGenerator.prototype._onCreate = function(context, output){
  };

  // called when generator yields final output.
  LayoutGenerator.prototype._onComplete = function(context, output){
  };

  LayoutGenerator.prototype._createStartContext = function(){
    return new LayoutContext(
      new BlockContext(this.style.contentExtent),
      new InlineContext(this.style.contentMeasure)
    );
  };

  LayoutGenerator.prototype._createChildContext = function(parent_context){
    return new LayoutContext(
      new BlockContext(parent_context.getBlockRestExtent() - this.style.getEdgeExtent()),
      new InlineContext(this.style.contentMeasure)
    );
  };

  LayoutGenerator.prototype._createStream = function(style){
    switch(style.getMarkupName()){
    case "ruby": return new RubyTokenStream(style.markup);
    default: return new TokenStream(style.getContent());
    } 
  };

  LayoutGenerator.prototype._createFloatGenerator = function(context, outline_context, first_float_gen){
    var self = this, parent_style = this.style;
    var rest_float_gens = this.stream.mapWhile(function(token){
      if(!Token.isTag(token)){
	return null;
      }
      var child_style = new StyleContext(token, parent_style, {layoutContext:context});
      if(!child_style.isFloated()){
	parent_style.removeChild(child_style);
	return null;
      }
      var child_stream = self._createStream(child_style);
      return self._createChildBlockGenerator(child_style, child_stream, context, outline_context);
    });
    var floated_generators = [first_float_gen].concat(rest_float_gens);
    return new FloatGenerator(this.style, this.stream, outline_context, floated_generators);
  };

  LayoutGenerator.prototype._createChildBlockGenerator = function(style, stream, context, outline_context){
    if(style.hasFlipFlow()){
      return new FlipGenerator(style, stream, outline_context, context);
    }

    // if child style with 'pasted' attribute, yield block with direct content by LazyGenerator.
    // notice that this is nehan.js original attribute,
    // is required to show some html(like form, input etc) that can't be handled by nehan.js.
    if(style.isPasted()){
      return new LazyGenerator(style, style.createBlock({content:style.getContent()}));
    }

    // switch generator by display
    switch(style.display){
    case "list-item":
      return new ListItemGenerator(style, stream, outline_context);

    case "table":
      return new TableGenerator(style, stream, outline_context);

    case "table-header-group":
    case "table-row-group":
    case "table-footer-group":
      return new TableRowGroupGenerator(style, stream, outline_context);

    case "table-row":
      return new TableRowGenerator(style, stream, outline_context);

    case "table-cell":
      return new TableCellGenerator(style, stream);
    }

    // switch generator by markup name
    switch(style.getMarkupName()){
    case "img":
      return new LazyGenerator(style, style.createImage());

    case "hr":
      // create block with no elements, but with edge(border).
      return new LazyGenerator(style, style.createBlock());

    case "first-line":
      return new FirstLineGenerator(style, stream, outline_context);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      return new SectionRootGenerator(style, stream);

    case "section":
    case "article":
    case "nav":
    case "aside":
      return new SectionContentGenerator(style, stream, outline_context);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return new HeaderGenerator(style, stream, outline_context);

    case "ul":
    case "ol":
      return new ListGenerator(style, stream, outline_context);

    default:
      return new BlockGenerator(style, stream, outline_context);
    }
  };

  LayoutGenerator.prototype._createChildInlineGenerator = function(style, stream, context, outline_context){
    if(style.isInlineBlock()){
      return new InlineBlockGenerator(style, stream, outline_context);
    }
    switch(style.getMarkupName()){
    case "img":
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      return new LazyGenerator(style, style.createImage());
    case "a":
      return new LinkGenerator(style, stream, outline_context);
    case "page-break": case "end-page": case "pbr":
      return new BreakAfterGenerator(style);
    default:
      return new InlineGenerator(style, stream, outline_context);
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

  BlockGenerator.prototype._yield = function(context){
    if(!context.isBlockSpaceLeft()){
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var extent = element.getLayoutExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, extent);
      if(!context.isBlockSpaceLeft() || context.hasBreakAfter()){
	break;
      }
    }
    return this._createOutput(context);
  };

  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline, and measure size varies, reget line if need.
    if(cache && cache.display === "inline" && cache.getLayoutMeasure(this.style.flow) < this.style.contentMeasure && !cache.br){
      this._childLayout.rollback(cache);
      return this.yieldChildLayout(context);
    }
    return cache;
  };

  BlockGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    if(this.hasChildLayout()){
      var child = this.yieldChildLayout(context);
      return child;
    }

    // read next token
    var token = this.stream? this.stream.get() : null;
    if(token === null){
      return null;
    }

    // if text, push back stream and restart current style and stream as child inline generator.
    if(Token.isText(token)){
      // skip while-space token in block level.
      if(Token.isWhiteSpace(token)){
	this.stream.skipUntil(Token.isWhiteSpace);
	return this._getNext(context);
      }
      this.stream.prev();
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    // if tag token, inherit style
    var child_style = new StyleContext(token, this.style, {layoutContext:context});

    // if disabled style, just skip
    if(child_style.isDisabled()){
      this.style.removeChild(child_style);
      return this._getNext(context);
    }

    var child_stream = this._createStream(child_style);

    if(child_style.isFloated()){
      var first_float_gen = this._createChildBlockGenerator(child_style, child_stream, context, this.outlineContext);
      this.setChildLayout(this._createFloatGenerator(context, this.outlineContext, first_float_gen));
      return this.yieldChildLayout(context);
    }

    // if child inline or child inline-block,
    // delegate current style and stream to child inline-generator with first child inline generator.
    if(child_style.isInlineBlock() || child_style.isInline()){
      var first_inline_gen = this._createChildInlineGenerator(child_style, child_stream, context, this.outlineContext);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext, first_inline_gen));
      return this.yieldChildLayout(context);
    }

    // other case, start child block generator
    this.setChildLayout(this._createChildBlockGenerator(child_style, child_stream, context, this.outlineContext));
    return this.yieldChildLayout(context);
  };

  BlockGenerator.prototype._addElement = function(context, element, extent){
    if(element === null){
      return;
    }
    if(this.style.isPushed() || element.pushed){
      context.pushBlockElement(element, extent);
    } else if(this.style.isPulled() || element.pulled){
      context.pullBlockElement(element, extent);
    } else {
      context.addBlockElement(element, extent);
    }

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(element);
  };

  BlockGenerator.prototype._createOutput = function(context){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      return null;
    }
    var block = this.style.createBlock({
      extent:extent,
      elements:elements,
      breakAfter:context.hasBreakAfter()
    });

    // call _onCreate callback for 'each' output
    this._onCreate(context, block);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, block);
    }
    return block;
  };

  return BlockGenerator;
})();


var InlineGenerator = (function(){
  function InlineGenerator(style, stream, outline_context, child_generator){
    LayoutGenerator.call(this, style, stream);
    this.outlineContext = outline_context || null;
    if(child_generator){
      this.setChildLayout(child_generator);
    }
  }
  Class.extend(InlineGenerator, LayoutGenerator);

  var __get_line_start_pos = function(line){
    var head = line.elements[0];
    return (head instanceof Box)? head.style.getMarkupPos() : head.pos;
  };

  InlineGenerator.prototype._yield = function(context){
    if(!context.isInlineSpaceLeft()){
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var measure = this._getMeasure(element);
      if(measure === 0){
	break;
      }
      if(!context.hasInlineSpaceFor(measure)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, measure);
      if(!context.isInlineSpaceLeft()){
	break;
      }
    }
    return this._createOutput(context);
  };

  LayoutGenerator.prototype.rollback = function(parent_cache){
    if(this.stream === null){
      return;
    }
    var start_pos = (parent_cache instanceof Box)? __get_line_start_pos(parent_cache) : parent_cache.pos;
    this.stream.setPos(start_pos); // rewind stream to the head of line.

    var cache = this.popCache();

    // inline child is always inline, so repeat this rollback while cache exists.
    if(this._childLayout && cache){
      this._childLayout.rollback(cache);
    }
  };

  InlineGenerator.prototype._createChildContext = function(context){
    return new LayoutContext(
      context.block, // inline generator inherits block context as it is.
      new InlineContext(context.getInlineRestMeasure())
    );
  };

  InlineGenerator.prototype._createOutput = function(context){
    // no like-break, no page-break, no element
    if(context.isInlineEmpty()){
      return null;
    }
    // justify if this line is generated by overflow(not line-break).
    if(!context.hasLineBreak() && Config.justify){
      this._justifyLine(context);
    }
    var line = this.style.createLine({
      lineBreak:context.hasLineBreak(), // is line break included in?
      breakAfter:context.hasBreakAfter(), // is break after included in?
      measure:context.getInlineCurMeasure(), // actual measure
      elements:context.getInlineElements(), // all inline-child, not only text, but recursive child box.
      texts:context.getInlineTexts(), // elements but text element only.
      charCount:context.getInlineCharCount(),
      maxExtent:context.getInlineMaxExtent(),
      maxFontSize:context.getInlineMaxFontSize()
    });

    // call _onCreate callback for 'each' output
    this._onCreate(context, line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, line);
    }
    return line;
  };

  InlineGenerator.prototype._justifyLine = function(context){
    // by stream.getToken(), stream pos has been moved to next pos already, so cur pos is the next head.
    var next_head = this.peekLastCache() || this.stream.peek();
    var new_tail = context.justify(next_head); // if justify is occured, new_tail token is gained.
    if(new_tail){
      this.stream.setPos(new_tail.pos + 1); // new stream pos is next pos of new tail.
      this.clearCache(); // stream position changed, so disable cache.
    }
  };

  InlineGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    if(this.hasChildLayout()){
      return this.yieldChildLayout();
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // inline text
    if(Token.isText(token)){
      // if tcy, wrap all content and return Tcy object and force generator terminate.
      if(this.style.getTextCombine() === "horizontal"){
	return this._getTcy(context, token);
      }
      // if white-space
      if(Token.isWhiteSpace(token)){
	return this._getWhiteSpace(context, token);
      }
      return this._getText(context, token);
    }

    // if tag token, inherit style
    var child_style = this.style;
    if(token instanceof Tag){
      child_style = new StyleContext(token, this.style, {layoutContext:context});
    }

    if(child_style.isDisabled()){
      return this._getNext(context); // just skip
    }

    var child_stream = this._createStream(child_style);

    // if inline -> block(or floated layout), force terminate inline
    if(child_style.isBlock() || child_style.isFloated()){
      var child_gen = this._createChildBlockGenerator(child_style, child_stream, context, this.outlineContext);
      if(child_style.isFloated()){
	child_gen = this._createFloatGenerator(context, this.outlineContext, child_gen);
      }
      this._breakInline(child_gen);

      // add line-break to avoid empty-line.
      // because empty-line is returned as null to parent block generator,
      // and it causes page-break of parent block generator.
      context.setLineBreak(true);
      return null;
    }

    // if inline-block, yield immediately, and return as child inline element.
    if(child_style.isInlineBlock()){
      return (new InlineBlockGenerator(child_style, child_stream, this.outlineContext)).yield(context);
    }

    // inline child
    switch(child_style.getMarkupName()){
    case "img":
      return child_style.createImage();

    case "br":
      context.setLineBreak(true);
      return null;

    default:
      var child_generator = this._createChildInlineGenerator(child_style, child_stream, context, this.outlineContext);
      this.setChildLayout(child_generator);
      return this.yieldChildLayout(context);
    }
  };

  InlineGenerator.prototype._breakInline = function(block_gen){
    this.setTerminate(true);
    if(this._parentLayout === null){
      return;
    }
    if(this._parentLayout instanceof InlineGenerator){
      this._parentLayout._breakInline(block_gen);
    } else {
      this._parentLayout.setChildLayout(block_gen);
    }
  };

  InlineGenerator.prototype._getTcy = function(context, token){
    this.setTerminate(true);
    var tcy = new Tcy(this.style.getMarkupContent());
    return this._getText(context, tcy);
  };

  InlineGenerator.prototype._getWhiteSpace = function(context, token){
    if(this.style.isPre()){
      if(Token.isNewLine(token)){
	return null; // break line at new-line char.
      }
      return this._getText(context, token); // read as normal text
    }

    // if not pre, skip continuous white-spaces.
    this.stream.skipUntil(Token.isNewLine);

    // if white-space is new-line, ignore it.
    if(Token.isNewLine(token)){
      return this._getNext(context);
    }
    // if white-space is not new-line, use first one.
    return this._getText(context, token);
  };

  InlineGenerator.prototype._getText = function(context, token){
    if(!token.hasMetrics()){
      this._setTextMetrics(context, token);
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

  InlineGenerator.prototype._setTextMetrics = function(context, token){
    // if charactor token, set kerning before setting metrics.
    // because some additional space is added if kerning is enabled or not.
    if(token instanceof Char && Config.kerning){
      this._setCharKerning(context, token);
    }
    token.setMetrics(this.style.flow, this.style.font);
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
    var part = token.cutMeasure(this.style.getFontSize(), rest_measure); // get sliced word
    part.setMetrics(this.style.flow, this.style.font); // metrics for first half
    token.setMetrics(this.style.flow, this.style.font); // metrics for second half
    if(token.data !== "" && token.bodySize > 0){
      this.stream.prev(); // re-parse this token because rest part is still exists.
    }
    part.bodySize = Math.min(rest_measure, part.bodySize); // sometimes overflows. more accurate logic is required in the future.
    return part;
  };

  InlineGenerator.prototype._getMeasure = function(element){
    if(element instanceof Box){
      return element.getLayoutMeasure(this.style.flow);
    }
    if(element.getAdvance){
      return element.getAdvance(this.style.flow, this.style.letterSpacing || 0);
    }
    return 0; // TODO
  };

  InlineGenerator.prototype._addElement = function(context, element, measure){
    context.addInlineElement(element, measure);

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(element);
  };

  return InlineGenerator;
})();


var InlineBlockGenerator = (function (){
  function InlineBlockGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(InlineBlockGenerator, BlockGenerator);

  InlineBlockGenerator.prototype._onCreate = function(context, block){
    var max_inline = List.maxobj(block.elements, function(element){
      return element.getContentMeasure();
    });
    if(max_inline){
      block.size.setMeasure(this.style.flow, max_inline.getContentMeasure());
    }
    return block;
  };

  InlineBlockGenerator.prototype._createChildContext = function(parent_context){
    return new LayoutContext(
      new BlockContext(parent_context.getBlockRestExtent() - this.style.getEdgeExtent()),
      new InlineContext(parent_context.getInlineRestMeasure() - this.style.getEdgeMeasure())
    );
  };

  return InlineBlockGenerator;
})();

var LinkGenerator = (function(){
  var __add_anchor = function(style){
    var anchor_name = style.getMarkupAttr("name");
    if(anchor_name){
      DocumentContext.addAnchor(anchor_name);
    }
  };

  function LinkGenerator(style, stream, outline_context){
    InlineGenerator.call(this, style, stream, outline_context);
    __add_anchor(style); // set anchor at this point
  }
  Class.extend(LinkGenerator, InlineGenerator);

  LinkGenerator.prototype._onComplete = function(context, output){
    __add_anchor(this.style); // overwrite anchor on complete
  };

  return LinkGenerator;
})();


// style of first line generator is enabled until first line is yielded.
// after yielding first line, parent style is inherited.
var FirstLineGenerator = (function(){
  function FirstLineGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(FirstLineGenerator, BlockGenerator);

  FirstLineGenerator.prototype._onAddElement = function(element){
    if(element.display === "inline" && typeof this._first === "undefined"){
      this._first = true; // flag that first line is already generated.
      this.style = this.style.parent; // first-line yieled, so switch style to parent one.
      if(this._childLayout){
	this._childLayout.style = this.style;
      }
    }
  };

  return FirstLineGenerator;
})();


// lazy generator holds pre-yielded output in construction, and yields it once.
var LazyGenerator = (function(){
  function LazyGenerator(style, output){
    LayoutGenerator.call(this, style, null);
    this.output = output; // only output this gen yields.
  }
  Class.extend(LazyGenerator, LayoutGenerator);

  LazyGenerator.prototype.hasNext = function(){
    return !this._terminate;
  };

  LazyGenerator.prototype.yield = function(context){
    if(this._terminate){ // already yielded
      return null;
    }
    this._terminate = true; // yield only once.
    return this.output;
  };

  return LazyGenerator;
})();

var BreakAfterGenerator = (function(){
  function BreakAfterGenerator(style){
    InlineGenerator.call(this, style, null, null);
  }
  Class.extend(BreakAfterGenerator, InlineGenerator);

  BreakAfterGenerator.prototype.hasNext = function(){
    return !this._terminate;
  };

  BreakAfterGenerator.prototype._yield = function(context){
    context.setBreakAfter(true);
    this._terminate = true;
    return this.style.createBreakLine();
  }

  return BreakAfterGenerator;
})();


var FlipGenerator = (function(){
  function FlipGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(FlipGenerator, BlockGenerator);

  FlipGenerator.prototype.yield = function(context){
    // [measure of this.style] -> [extent of this.style.parent]
    // [extent of this.style]  -> [measure of this.style.parent]
    this.style.updateContextSize(context.getBlockRestExtent(), context.getInlineMaxMeasure());
    return BlockGenerator.prototype.yield.call(this);
  };

  return FlipGenerator;
})();


var FloatGroup = (function(){
  function FloatGroup(elements, float_direction){
    this.elements = elements || [];
    this.floatDirection = float_direction || FloatDirections.get("start");
  }

  FloatGroup.prototype = {
    add : function(element){
      // [f1,f2], [] => [f1], [f2] => [], [f1, f2]
      this.elements.unshift(element); // keep original stack order
    },
    isFloatStart : function(){
      return this.floatDirection.isStart();
    },
    isFloatEnd : function(){
      return this.floatDirection.isEnd();
    },
    getElements : function(){
      return this.isFloatStart()? this.elements : List.reverse(this.elements);
    },
    getMeasure : function(flow){
      return List.fold(this.elements, 0, function(measure, element){
	return measure + element.getLayoutMeasure(flow);
      });
    },
    getExtent : function(flow){
      return List.fold(this.elements, 0, function(extent, element){
	return Math.max(extent, element.getLayoutExtent(flow));
      });
    }
  };

  return FloatGroup;
})();


// pop floated element both from start and end, but select larger one.
var FloatGroupStack = (function(){

  // [float block] -> FloatGroup
  var pop_float_group = function(flow, float_direction, blocks){
    var head = blocks.pop() || null;
    if(head === null){
      return null;
    }
    var extent = head.getLayoutExtent(flow);
    var group = new FloatGroup([head], float_direction);

    // group while previous floated-element has smaller extent than the head
    while(true){
      var next = blocks.pop();
      if(next && next.getLayoutExtent(flow) <= extent){
	group.add(next);
      } else {
	blocks.push(next); // push back
	break;
      }
    }
    return group;
  };

  // [float block] -> [FloatGroup]
  var make_float_groups = function(flow, float_direction, blocks){
    var ret = [];
    do{
      var group = pop_float_group(flow, float_direction, blocks);
      if(group){
	ret.push(group);
      }
    } while(group !== null);
    return ret;
  };

  function FloatGroupStack(flow, start_blocks, end_blocks){
    var start_groups = make_float_groups(flow, FloatDirections.get("start"), start_blocks);
    var end_groups = make_float_groups(flow, FloatDirections.get("end"), end_blocks);
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
  function FloatGenerator(style, stream, outline_context, floated_generators){
    BlockGenerator.call(this, style, stream, outline_context);
    this.generators = floated_generators;

    // create child generator to yield rest-space of float-elements with logical-float "start".
    // notice that this generator uses 'clone' of original style, because content size changes by position,
    // but on the other hand, original style is referenced by float-elements as their parent style.
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
    var measure = block1.getLayoutMeasure(flow); // block2 has same measure
    var extent = block1.getLayoutExtent(flow) + (block2? block2.getLayoutExtent(flow) : 0);
    var elements = block2? [block1, block2] : [block1];
    var break_after = List.exists(elements, function(element){
      return (element && element.breakAfter)? true : false;
    });

    // wrapping block always float to start direction
    return this.style.createChild("div", {"float":"start", measure:measure}).createBlock({
      elements:elements,
      breakAfter:break_after,
      extent:extent
    });
  };

  FloatGenerator.prototype._wrapFloat = function(floated, rest, measure){
    var flow = this.style.flow;
    var extent = floated.getExtent(flow);
    var elements = this._sortFloatRest(floated, rest);
    var break_after = List.exists(elements, function(element){
      return (element && element.breakAfter)? true : false;
    });
    return this.style.createChild("div", {"float":"start", measure:measure}).createBlock({
      elements:elements,
      breakAfter:break_after,
      extent:extent
    });
  };
  
  FloatGenerator.prototype._yieldFloatSpace = function(context, measure, extent){
    this._childLayout.style.updateContextSize(measure, extent);
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
    var wrap_extent = wrap_block.getLayoutExtent(this.style.flow);
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
      return block? block.getLayoutExtent(flow) : 0;
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
      extent:max_block.getLayoutExtent(flow)
    });
  };

  return ParallelGenerator;
})();



var SectionRootGenerator = (function(){
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.outlineContext = new OutlineContext(style); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onComplete = function(context, block){
    DocumentContext.addOutlineContext(this.outlineContext);
  };

  return SectionRootGenerator;
})();

var SectionContentGenerator = (function(){
  function SectionContentGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.outlineContext.startSection(this.style.getMarkupName());
  }
  Class.extend(SectionContentGenerator, BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(context, block){
    this.outlineContext.endSection(this.style.getMarkupName());
  };

  return SectionContentGenerator;
})();


var ListGenerator = (function(){
  function ListGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.style.markerSize = this._getMarkerSize(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  // before yield list layout, we have to calclate max marker size by total child_count(item_count).
  ListGenerator.prototype._getMarkerSize = function(item_count){
    var max_marker_html = this.style.getMarkerHtml(item_count);
    // create temporary inilne-generator but using clone style, this is because sometimes marker html includes "<span>" element,
    // and we have to avoid 'appendChild' from child-generator of this tmp generator.
    var tmp_gen = new InlineGenerator(this.style.clone(), new TokenStream(max_marker_html));
    var line = tmp_gen.yield();
    var marker_measure = line? line.inlineMeasure + Math.floor(this.style.getFontSize() / 2) : this.style.getFontSize();
    var marker_extent = line? line.size.getExtent(this.style.flow) : this.style.getFontSize();
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
    var marker_size = style.parent.markerSize || style.flow.getBoxSize(Layout.fontSize * 2, Layout.fontSize);
    var item_order = style.getChildIndex();
    var marker_text = style.parent.getMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "class":"nehan-li-marker",
      "measure":measure
    });

    return new BlockGenerator(marker_style, new TokenStream(marker_text), outline_context);
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(style, stream, outline_context){
    var marker_size = style.parent.markerSize || style.flow.getBoxSize(Layout.fontSize * 2, Layout.fontSize);
    var measure = style.contentMeasure - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "class":"nehan-li-body",
      "measure":measure
    });

    return new BlockGenerator(body_style, stream, outline_context);
  };

  ListItemGenerator.prototype._alignContentExtent = function(blocks, content_extent){
    return ParallelGenerator.prototype._alignContentExtent.call(this, blocks, content_extent);
  };

  return ListItemGenerator;
})();
  

// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
var TableGenerator = (function(){
  function TableGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGenerator, BlockGenerator);
  return TableGenerator;
})();


// parent : table
// tag : tbody, thead, tfoot
// stream : [tr]
// yield : [tr]
var TableRowGroupGenerator = (function(){
  function TableRowGroupGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(TableRowGroupGenerator, BlockGenerator);

  return TableRowGroupGenerator;
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
      return new TableCellGenerator(child_style, new TokenStream(child_style.getMarkupContent()), outline_context);
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(style, child_tags){
    var self = this;
    var child_count = child_tags.length;
    var rest_measure = style.contentMeasure;
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, style);
      var static_measure = default_style.staticMeasure;
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_count - i));
      rest_measure -= measure;
      return default_style.clone({
	"float":"start",
	"measure":measure
      });
    });
  };

  TableRowGenerator.prototype._getChildTags = function(stream){
    return stream.getAllIf(function(token){
      return (token instanceof Tag && (token.getName() === "td" || token.getName() === "th"));
    });
  };

  return TableRowGenerator;
})();

var TableCellGenerator = (function(){
  function TableCellGenerator(style, stream){
    SectionRootGenerator.call(this, style, stream);
    this.outlineContext = new OutlineContext(style);
  }
  // notice that table-cell is sectioning root, so extends SectionRootGenerator.
  Class.extend(TableCellGenerator, SectionRootGenerator);

  return TableCellGenerator;
})();


var HeaderGenerator = (function(){
  function HeaderGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(HeaderGenerator, BlockGenerator);

  HeaderGenerator.prototype._getHeaderRank = function(block){
    if(this.style.getMarkupName().match(/h([1-6])/)){
      return parseInt(RegExp.$1, 10);
    }
    return 0;
  };

  HeaderGenerator.prototype._onComplete = function(context, block){
    var header_id = this.outlineContext.addHeader({
      type:this.style.getMarkupName(),
      rank:this._getHeaderRank(),
      title:this.style.getMarkupContent()
    });
    block.id = Css.addNehanHeaderPrefix(header_id);
  };
  
  return HeaderGenerator;
})();


var BodyGenerator = (function(){
  function BodyGenerator(text){
    var tag = new Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(context, block){
    block.seekPos = this.stream.getSeekPos();
    block.charPos = DocumentContext.charPos;
    block.percent = this.stream.getSeekPercent();
    block.pageNo = DocumentContext.pageNo++;

    DocumentContext.charPos += block.charCount || 0;

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(DocumentContext.pageNo > Config.maxPageCount){
      this.setTerminate(true);
    }
  };

  return BodyGenerator;
})();

var HtmlGenerator = (function(){
  function HtmlGenerator(text){
    this.stream = new HtmlTokenStream(text);
    this.generator = this._createGenerator();
  }

  HtmlGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    _createGenerator : function(){
      while(this.stream.hasNext()){
	var tag = this.stream.get();
	switch(tag.getName()){
	case "head":
	  this._parseDocumentHeader(new HeadTokenStream(tag.getContent()));
	  break;
	case "body":
	  return this._createBodyGenerator(tag.getContent());
	}
      }
      return this._createBodyGenerator(this.stream.getSrc());
    },
    _createBodyGenerator : function(text){
      return new BodyGenerator(text);
    },
    _parseDocumentHeader : function(stream){
      var document_header = new DocumentHeader();
      while(stream.hasNext()){
	var tag = stream.get();
	switch(tag.getName()){
	case "title":
	  document_header.setTitle(tag.getContent());
	  break;
	case "meta":
	  document_header.addMeta(tag);
	  break;
	case "link":
	  document_header.addLink(tag);
	  break;
	case "style":
	  document_header.addStyle(tag);
	  break;
	case "script":
	  document_header.addScript(tag);
	  break;
	}
      }
      DocumentContext.documentHeader = document_header;
    }
  };

  return HtmlGenerator;
})();


var DocumentGenerator = (function(){
  function DocumentGenerator(text){
    this.stream = new DocumentTokenStream(text);
    this.generator = this._createGenerator();
  }

  DocumentGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    _createGenerator : function(){
      while(this.stream.hasNext()){
	var tag = this.stream.get();
	switch(tag.getName()){
	case "!doctype":
	  DocumentContext.documentType = "html"; // TODO
	  break;
	case "html":
	  return this._createHtmlGenerator(tag);
	}
      }
      var html_tag = new Tag("<html>", this.stream.getSrc());
      return this._createHtmlGenerator(html_tag);
    },
    _createHtmlGenerator : function(html_tag){
      return new HtmlGenerator(html_tag.getContent());
    }
  };

  return DocumentGenerator;
})();


var LayoutEvaluator = (function(){
  function LayoutEvaluator(){}

  LayoutEvaluator.prototype = {
    _createElement : function(name, opt){
      var opt = opt || {};
      var styles = opt.styles || {};
      var attrs = opt.attrs? ((opt.attrs instanceof TagAttrs)? opt.attrs.attrs : opt.attrs) : {};
      var dataset = opt.attrs? opt.attrs.dataset : {};
      var dom = document.createElement(name);
      if(opt.id){
	dom.id = opt.id;
      }
      if(opt.className){
	dom.className = opt.className;
      }
      if(opt.content){
	dom.innerHTML = opt.content;
      }

      // font-family -> fontFamily(use camel case by default)
      // float -> cssFloat(special case)
      Obj.iter(styles, function(style_name, value){
	if(style_name === "float"){
	  dom.style.cssFloat = value;
	} else {
	  dom.style[Utils.camelize(style_name)] = value;
	}
      });

      // notice that class(className in style object) is given by variable "Box::classes".
      // why? because
      // 1. markup of anonymous line is shared by parent block, but both are given different class names.
      // 2. sometimes we add some special class name like "nehan-div", "nehan-body", "nehan-p"... etc.
      Obj.iter(attrs, function(attr_name, value){ // pure attributes(without dataset defined in TagAttrs::attrs)
	if(attr_name !== "class"){ // "class" attribute is already set by opt.className
	  dom[attr_name] = value;
	}
      });

      // dataset attributes(defined in TagAttrs::dataset)
      Args.copy(dom.dataset, dataset);

      // call oncreate callback if exists.
      if(opt.oncreate){
	opt.oncreate(dom);
      }
      return dom;
    },
    _createClearFix : function(clear){
      var div = document.createElement("div");
      div.style.clear = clear || "both";
      return div;
    },
    evaluate : function(tree){
      if(this.isFlipTree(tree)){
	return this.evalFlip(tree);
      }
      return this.evalTree(tree);
    },
    evalTree : function(tree, opt){
      opt = opt || {};
      var self = this;
      var elements = List.filter(opt.elements || tree.elements, function(element){ return element !== null; });
      var root = opt.root || this.evalTreeRoot(tree, opt);
      return root.innerHTML? root : List.fold(elements, root, function(ret, child){
	root.appendChild(self.evalTreeChild(tree, child));
	if(child.withBr){ // annotated to add extra br element
	  root.appendChild(document.createElement("br"));
	}
	if(child.withClearFix){ // annotated to add extra clear fix element
	  root.appendChild(self._createClearFix());
	}
	return root;
      });
    },
    evalTreeRoot : function(tree, opt){
      opt = opt || {};
      return this._createElement(opt.name || "div", {
	className:tree.getClassName(),
	attrs:tree.getAttrs(),
	oncreate:tree.getOnCreate(),
	content:(opt.content || tree.getContent()),
	styles:(opt.css || tree.getCssRoot())
      });
    },
    evalTreeChild : function(parent, child){
      switch(parent.display){
      case "inline":
	if(child instanceof Box){
	  return this.evalInlineChildElement(parent, child);
	}
	return this.evalInlineChildText(parent, child);
      default:
	return this.evalBlockChildElement(parent, child);
      }
    },
    evalBlockChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this.evalImage(element);
      case "a":
	return this.evalLink(element);
      default:
	return this.evaluate(element);
      }
    },
    evalInlineChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this.evalInlineImage(parent, element);
      case "a":
	return this.evalLink(element);
      default:
	return this.evalInlineChildTree(element);
      }
    },
    evalInlineChildText : function(parent, element){
      if(parent.style.isTextEmphaEnable()){
	return this.evalEmpha(parent, element);
      }
      return this.evalTextElement(parent, element);
    },
    evalImage : function(image){
      return this.evalTreeRoot(image, {name:"img"});
    },
    evalInlineImage : function(line, image){
      return this.evalImage(image);
    },
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    evalLink : function(link){
      var uri = new Uri(link.style.getMarkupAttr("href"));
      var anchor_name = uri.getAnchorName();
      if(anchor_name){
	var page_no = DocumentContext.getAnchorPageNo(anchor_name);
	link.classes.push("nehan-anchor-link");
	link.style.markup.setAttr("data-page", page_no);
      }
      return this.evalTree(link, {name:"a"});
    },
    evalTextElement : function(line, text){
      switch(text._type){
      case "word":
	return this.evalWord(line, text);
      case "char":
	return this.evalChar(line, text);
      case "tcy":
	return this.evalTcy(line, text);
      case "ruby":
	return this.evalRuby(line, text);
      default:
	console.error("invalid text element:%o", text);
	throw "invalid text element"; 
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

  VertEvaluator.prototype.isFlipTree = function(tree){
    return tree.style.isTextHorizontal();
  };

  VertEvaluator.prototype.evalFlip = function(tree){
    return (new HoriEvaluator()).evaluate(tree);
  };

  VertEvaluator.prototype.evalInlineChildTree = function(tree){
    return this.evalTree(tree);
  };

  VertEvaluator.prototype.evalInlineImage = function(line, image){
    image.withBr = true;
    return this.evalTreeRoot(image, {name:"img", styles:image.getCssInline()});
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
      content:chr.getData(),
      className:"nehan-rotate-90"
    });
  };

  VertEvaluator.prototype.evalRotateCharIE = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
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
    return document.createTextNode(Html.unescape(chr.getData()));
  };

  VertEvaluator.prototype.evalCharLetterSpacing = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      styles:chr.getCssVertLetterSpacing(line)
    });
  };

  VertEvaluator.prototype.evalEmpha = function(line, chr){
    var char_body = this._createElement("span", {
      content:chr.getData(),
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
      content:chr.getData(),
      styles:chr.getCssPadding(line)
    });
  };

  VertEvaluator.prototype.evalImgChar = function(line, chr){
    var color = line.color || new Color(Layout.fontColor);
    var font_rgb = color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return this._createElement("img", {
      className:"nehan-img-char",
      attrs:{
	src:chr.getImgSrc(palette_color)
      },
      styles:chr.getCssVertImgChar(line)
    });
  };

  VertEvaluator.prototype.evalVerticalGlyph = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      className:"nehan-vert-glyph",
      styles:chr.getCssVertGlyph(line)
    });
  };

  VertEvaluator.prototype.evalSmallKana = function(line, chr){
    var tag_name = (line.style.textEmpha && line.style.textEmpha.isEnable())? "span" : "div";
    return this._createElement(tag_name, {
      content:chr.getData(),
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

  HoriEvaluator.prototype.evalInlineChildTree = function(tree){
    return this.evalTree(tree, {name:"span"});
  };

  HoriEvaluator.prototype.evalRuby = function(line, ruby){
    var span = this._createElement("span", {
      className:"nehan-ruby-body",
      styles:ruby.getCssHoriRuby(line)
    });
    span.appendChild(this.evalRt(line, ruby));
    span.appendChild(this.evalRb(line, ruby));
    return span;
  };

  HoriEvaluator.prototype.evalRb = function(line, ruby){
    return this.evalTree(line, {
      elements:ruby.getRbs(),
      root:this._createElement("div", {
	styles:ruby.getCssHoriRb(line),
	className:"nehan-rb"
      })
    });
  };

  HoriEvaluator.prototype.evalRt = function(line, ruby){
    return this._createElement("div", {
      content:ruby.getRtString(),
      className:"nehan-rt",
      styles:ruby.getCssHoriRt(line)
    });
  };

  HoriEvaluator.prototype.evalWord = function(line, word){
    return document.createTextNode(word.data);
  };

  HoriEvaluator.prototype.evalTcy = function(line, tcy){
    return document.createTextNode(Html.unescape(tcy.data));
  };

  HoriEvaluator.prototype.evalChar = function(line, chr){
    if(chr.isHalfSpaceChar()){
      return document.createTextNode(chr.data);
    }
    if(chr.isCharRef()){
      return document.createTextNode(Html.unescape(chr.data));
    }
    if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr);
    }
    return document.createTextNode(chr.data);
  };

  HoriEvaluator.prototype.evalEmpha = function(line, chr){
    var char_part = this._createElement("div", {
      content:chr.data,
      styles:chr.getCssHoriEmphaTarget(line)
    });
    var empha_part = this._createElement("div", {
      content:line.style.textEmpha.getText(),
      styles:chr.getCssHoriEmphaText(line)
    });
    var wrap = this._createElement("span", {
      styles:line.style.textEmpha.getCssHoriEmphaWrap(line, chr)
    });
    wrap.appendChild(empha_part);
    wrap.appendChild(char_part);
    return wrap;
  };

  HoriEvaluator.prototype.evalKerningChar = function(line, chr){
    var styles = chr.getCssPadding(line);
    if(chr.isKakkoStart()){
      styles["margin-left"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kakko-start",
	styles:styles
      });
    }
    if(chr.isKakkoEnd()){
      styles["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kakko-end",
	styles:styles
      });
    }
    if(chr.isKutenTouten()){
      styles["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.data,
	className:"nehan-char-kuto",
	styles:styles
      });
    }
    return document.createTextNode(chr.data);
  };

  HoriEvaluator.prototype.evalPaddingChar = function(line, chr){
    return this._createElement("span", {
      content:chr.data,
      styles:chr.getCssPadding(line)
    });
  };

  return HoriEvaluator;
})();


// export global interfaces
Nehan.version = "5.0.2";
Nehan.Class = Class;
Nehan.Env = Env;

// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Layout, __engine_args.layout || {});
Selectors.setValues(Nehan.style || {});
Selectors.setValues(__engine_args.style || {});

// export engine local interfaces
return {
  documentContext: DocumentContext,
  createPageStream : function(text){
    return new PageStream(text);
  },
  // set engine local style
  setStyle : function(selector_key, value){
    Selectors.setValue(selector_key, value);
    return this;
  },
  // set engine local styles
  setStyles : function(values){
    Selectors.setValues(values);
    return this;
  }
};

}; // Nehan.setup
