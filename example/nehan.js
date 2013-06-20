/*
 nehan.js
 Copyright (C) 2010 Watanabe Masaki<lambda.watanabe[at]gmail.com>
 http://tategakibunko.mydns.jp/docs/nehan/

 licensed under MIT licence.

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
  debug:true,
  kerning:true,
  justify:true,
  maxRollbackCount : 10,
  minBlockScaleDownRate : 65,
  useVerticalGlyphIfEnable: true,
  lexingBufferLen : 2000
};

var Layout = {
  direction:"vert",
  hori:"lr-tb", // sorry, rl-tb is not supported yet.
  vert:"tb-rl", // or "tb-lr"
  width: 800,
  height: 580,
  fontSize:16,
  rubyRate:0.5,
  boldRate:0.2,
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",
  lineRate: 2.0,
  listMarkerSpacingRate:0.4,

  createBox : function(size, parent, type){
    var box = new Box(size, parent, type);
    box.flow = parent.flow;
    box.lineRate = parent.lineRate;
    box.textAlign = parent.textAlign;
    box.fontSize = parent.fontSize;
    box.color = parent.color;
    return box;
  },
  createStdBox : function(type){
    var flow = this.getStdBoxFlow();
    var size = this.getStdPageSize();
    var box = new Box(size, null, type);
    box.flow = flow;
    box.lineRate = this.lineRate;
    box.textAlign = "start";
    box.fontSize = this.fontSize;
    box.color = new Color(this.fontColor);
    return box;
  },
  getStdPageSize : function(){
    return new BoxSize(this.width, this.height);
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
  getListMarkerSpacingSize : function(font_size){
    font_size = font_size || this.fontSize;
    return Math.floor(font_size * this.listMarkerSpacingRate);
  },
  getVertBlockDir : function(){
    return this.vert.split("-")[1];
  },
  getHoriIndir : function(){
    return this.hori.split("-")[0];
  }
};

var Env = (function(){
  var nav = navigator.appName;
  var ua = navigator.userAgent.toLowerCase();
  var matched = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/);
  var browser, version, is_transform_enable;
  if(matched){
    tmp_match = ua.match(/version\/([\.\d]+)/i);
    if(tmp_match){
      matched[2] = tmp_match[1];
    }
    browser = matched[1].toLowerCase();
    version = parseInt(matched[2], 10);
    if(browser === "msie"){
      is_transform_enable = this.version >= 9;
    } else {
      is_transform_enable = true;
    }
  } else {
    browser = nav.toLowerCase();
    version = parseInt(navigator.appVersion, 10);
    is_transform_enable = false;
  }

  var is_ie = browser === "msie";
  var is_win = ua.indexOf("windows") >= 0;
  var is_mac = ua.indexOf("macintosh") >= 0;
  var is_chrome = browser.indexOf("chrome") >= 0;
  var is_iphone = ua.indexOf("iphone") != -1;
  var is_ipod = ua.indexOf("ipod") != -1;
  var is_ipad = ua.indexOf("ipad") != -1;
  var is_iphone_family = (is_iphone || is_ipod || is_ipad);
  var is_android_family = ua.indexOf("android") != -1;
  var is_smart_phone = is_iphone_family || is_android_family;
  var is_webkit = ua.indexOf("webkit") != -1;
  var is_vertical_glyph_enable = is_chrome && (is_win || is_mac) && version >= 24;

  return {
    version : version,
    isIE : is_ie,
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
    "section":true
  },
  "area":{
  },
  "article":{
    "display":"block",
    "child-content":true,
    "section":true
  },
  "aside":{
    "display":"block",
    "child-content":true,
    "section":true
  },
  "audio":{
  },
  //-------------------------------------------------------
  // tag / b
  //-------------------------------------------------------
  "b":{
    "display":"inline"
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
    "display":"block",
    "child-content":true,
    "section-root":true,
    "margin":{
      "start":"1.5em",
      "end":"1.5em",
      "before":"1.5em",
      "after":"1.5em"
    }
  },
  "body":{
    "display":"block",
    "child-content":true,
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
    "child-content":true,
    "margin":{
      "after":"0.5em"
    }
  },
  "cite":{
    "display":"inline"
  },
  "code":{
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
    "child-content":true,
    "margin":{
      "start":"1em",
      "end":"1em",
      "after":"1.6em"
    }
  },
  "del":{
    "display":"inline"
  },
  "details":{
    "display":"block",
    "child-content":true,
    "section-root":true
  },
  "dfn":{
    "display":"inline"
  },
  "div":{
    "display":"block",

    // using div tag with static size, inline html can be embeded.
    //  <div width="100" height="100">embed html</div>
    "embeddable":true,
    "child-content":true
  },
  "dl":{
    "display":"block",
    "child-content":true
  },
  "dt":{
    "display":"block",
    "child-content":true,
    "margin":{
      "after":"0.2em"
    }
  },
  //-------------------------------------------------------
  // tag / e
  //-------------------------------------------------------
  "em":{
    "display":"inline"
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
    "child-content":true,
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
    "child-content":true,
    "section-root":true
  },
  "figcaption":{
    "display":"block",
    "child-content":true,
    "text-align":"center",
    "font-size": "0.8em"
  },
  "footer":{
    "display":"block",
    "child-content":true,
    "section":true
  },
  "form":{
    "display":"block",
    "child-content":true
  },
  //-------------------------------------------------------
  // tag / h
  //-------------------------------------------------------
  "h1":{
    "display":"block",
    "line-rate":1.4,
    "child-content":true,
    "font-size":"2.4em",
    "margin":{
      "after":"0.5em"
    }
  },
  "h2":{
    "display":"block",
    "line-rate":1.4,
    "child-content":true,
    "font-size":"2.0em",
    "margin":{
      "after":"0.75em"
    }
  },
  "h3":{
    "display":"block",
    "line-rate":1.4,
    "child-content":true,
    "font-size":"1.6em",
    "margin":{
      "after":"1em"
    }
  },
  "h4":{
    "display":"block",
    "line-rate":1.4,
    "child-content":true,
    "font-size":"1.4em",
    "margin":{
      "after":"1.25em"
    }
  },
  "h5":{
    "display":"block",
    "line-rate":1.4,
    "child-content":true,
    "font-size":"1.0em",
    "margin":{
      "after":"1.5em"
    }
  },
  "h6":{
    "display":"block",
    "line-rate":1.4,
    "child-content":true,
    "font-size":"1.0em"
  },
  "head":{
    "child-content":true
  },
  "header":{
    "display":"block",
    "child-content":true,
    "section":true
  },
  "hr":{
    "display":"block",
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
    "display":"block",
    "child-content":true
  },
  //-------------------------------------------------------
  // tag / i
  //-------------------------------------------------------
  "i":{
    "display":"inline"
  },
  "iframe":{
    "display":"block",
    "child-content":true,
    "embeddable":true
  },
  "ins":{
  },
  "img":{
    "display":"inline",
    "single":true,
    "margin":{
      "before":"0.5em",
      "after":"0.5em"
    }
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
    "line-rate":1.5,
    "child-content":true
  },
  "li":{
    "display":"block",
    "child-content":true,
    "margin":{
      "after":"0.6em"
    }
  },
  "link":{
    "meta":true,
    "single":true
  },
  //-------------------------------------------------------
  // tag / m
  //-------------------------------------------------------
  "main":{
    "display":"block",
    "child-content":true
  },
  "map":{
  },
  "mark":{
    "display":"inline"
  },
  "menu":{
    "display":"block",
    "child-content":true
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
    "child-content":true,
    "section":true
  },
  "noscript":{
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
    "child-content":true,
    "list-style-image":"none",
    "list-style-position": "outside",
    "list-style-type": "decimal",
    "margin":{
      "before":"1em"
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
    "child-content":true,
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
    "child-content":true
  },
  "progress":{
    "display":"inline"
  },
  //-------------------------------------------------------
  // tag / q
  //-------------------------------------------------------
  "q":{
    "display":"block",
    "child-content":true
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
    "child-content":true,
    "font-size":"0.5em",
    "display":"inline"
  },
  "rt":{
    "display":"inline",
    "child-content":true
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
    "child-content":true,
    "meta":true
  },
  "section":{
    "display":"block",
    "child-content":true,
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
    "display":"inline"
  },
  "style":{
    "display":"inline",
    "meta":true,
    "child-content":true
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
    "display":"block",
    "child-content":true,
    "embeddable":true,
    "table-layout":"fixed", // 'auto' not supported yet.
    "border-collapse":"collapse", // 'separate' not supported yet.
    "border-spacing":"5px", // TODO: support batch style like "5px 10px".
    "border-width":"1px",
    "margin":{
      "start":"0.5em",
      "end":"0.5em",
      "after":"1.6em"
    }
  },
  "tbody":{
    "display":"block",
    "border-collapse":"inherit",
    "child-content":true
  },
  "td":{
    "display":"block",
    "border-collapse":"inherit",
    "child-content":true,
    "section-root":true,
    "border-width":"1px",
    "padding":{
      "start":"0.8em",
      "end":"0.8em",
      "before":"0.5em",
      "after":"0.5em"
    }
  },
  "textarea":{
    "display":"inline",
    "child-content":true,
    "embeddable":true,
    "interactive":true
  },
  "tfoot":{
    "display":"block",
    "border-collapse":"inherit",
    "child-content":true
  },
  "th":{
    "display":"block",
    "line-rate":1.4,
    "border-collapse":"inherit",
    "child-content":true,
    "border-width":"1px",
    "padding":{
      "start":"0.8em",
      "end":"0.8em",
      "before":"0.5em",
      "after":"0.5em"
    }
  },
  "thead":{
    "display":"block",
    "border-collapse":"inherit",
    "child-content":true
  },
  "time":{
    "display":"inline"
  },
  "title":{
    "meta":true,
    "child-content":true
  },
  "tr":{
    "display":"block",
    "child-content":true
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
    "child-content":true,
    "list-style-image":"none",
    "list-style-type":"disc",
    "list-style-position":"outside",
    "margin":{
      "before":"1em"
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
  // pseudo-elements
  //-------------------------------------------------------
  ":before":{
    "display":"inline-block",
    "child-content":true,
    // content of pseudo elements are all escaped,
    // that is, ruby is also escaped. there are no rubies in pseudo element.
    // so line-rate is set to 1(text-line only).
    "line-rate":1
  },
  ":after":{
    "display":"inline-block",
    "child-content":true,
    "line-rate":1
  },
  ":first-letter":{
    "display":"inline-block",
    "child-content":true
  },
  ":first-line":{
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
    "font-size":"33px"
  },
  ".nehan-x-large":{
    "font-size":"24px"
  },
  ".nehan-large":{
    "font-size":"18px"
  },
  ".nehan-medium":{
    "font-size":"16px"
  },
  ".nehan-small":{
    "font-size":"13px"
  },
  ".nehan-x-small":{
    "font-size":"10px"
  },
  ".nehan-xx-small":{
    "font-size":"10px"
  },
  ".nehan-larger":{
    "font-size":"1.2em"
  },
  ".nehan-smaller":{
    "font-size":"0.8em"
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
  // page-break classes
  //-------------------------------------------------------
  ".nehan-pb-before":{
    "page-break-before":"always"
  },
  ".nehan-pb-after":{
    "page-break-after":"always"
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
  ".nehan-flow-inherit":{
    "float":"inherit"
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
    "empha-mark":"&#x2022;"
  },
  ".nehan-empha-dot-open":{
    "empha-mark":"&#x25e6;"
  },
  ".nehan-empha-circle-filled":{
    "empha-mark":"&#x25cf;"
  },
  ".nehan-empha-circle-open":{
    "empha-mark":"&#x25cb;"
  },
  ".nehan-empha-double-circle-open":{
    "empha-mark":"&#x25ce;"
  },
  ".nehan-empha-double-circle-filled":{
    "empha-mark":"&#x25c9;"
  },
  ".nehan-empha-triangle-filled":{
    "empha-mark":"&#x25b2;"
  },
  ".nehan-empha-triangle-open":{
    "empha-mark":"&#x25b3;"
  },
  ".nehan-empha-sesame-filled":{
    "empha-mark":"&#xfe45;"
  },
  ".nehan-empha-sesame-open":{
    "empha-mark":"&#xfe46;"
  },
  //-------------------------------------------------------
  // nehan tip area
  //-------------------------------------------------------
  ".nehan-tip":{
    "padding":{
      "before":"0.1em",
      "start":"0.8em",
      "end":"0.8em",
      "after":"0.8em"
    },
    "margin":{
      "after":"1em"
    },
    "border-width":"2px"
  },
  //-------------------------------------------------------
  // other utility classes
  //-------------------------------------------------------
  ".nehan-drop-caps:first-letter":{
    "display":"block",
    "flow":"inherit",
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

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
var Class = (function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  var _Class = function(){};
  _Class.extend = function(prop){
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" && 
	typeof _super[name] == "function" && fnTest.test(prop[name]) ?
	(function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          };
	})(name, prop[name]) :
      prop[name];
    }

    function Class() {
      if (!initializing && this.init)
	this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };

  return _Class;
})();

var List = {
  each : function(obj, fn){
    for(var prop in obj){
      fn(prop, obj[prop]);
    }
  },
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
    for(var i = lst.length; i >= 0; i--){
      fn(lst[i]);
    }
  },
  reviteri : function(lst, fn){
    for(var i = lst.length; i >= 0; i--){
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
  zip : function(lst1, lst2){
    var ret = [];
    for(var i = 0, len1=lst1.length, len2=lst2.length; i < len1 && i < len2; i++){
      ret[i] = [lst1[i], lst2[i]];
    }
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
  map : function(obj, fn){
    var ret = {};
    for(var prop in obj){
      ret[prop] = fn(obj[prop]);
    }
    return ret;
  },
  iter : function(obj, fn){
    for(var prop in obj){
      fn(obj, prop, obj[prop]);
    }
  }
};

var UnitSize = {
  getUnitSize : function(val, unit_size){
    var str = (typeof val === "string")? val : String(val);
    if(str.indexOf("rem") > 0){
      var rem_scale = parseFloat(str.replace("rem",""));
      return Math.floor(Layout.fontSize * rem_scale); // use root font-size
    }
    if(str.indexOf("em") > 0){
      var em_scale = parseFloat(str.replace("em",""));
      return Math.floor(unit_size * em_scale);
    }
    if(str.indexOf("pt") > 0){
      return Math.floor(parseInt(str, 10) * 4 / 3);
    }
    if(str.indexOf("%") > 0){
      return Math.floor(unit_size * parseInt(str, 10) / 100);
    }
    var px = parseInt(str, 10);
    return isNaN(px)? 0 : px;
  },
  getBoxSize : function(val, unit_size, max_size){
    var str = (typeof val === "string")? val : String(val);
    if(str.indexOf("%") > 0){
      var scaled_size = Math.floor(max_size * parseInt(str, 10) / 100);
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
  space:"&nbsp;",
  clearFix:"<div style='clear:both'></div>"
};

var Css = {
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      tmp.push(prop + ":" + Html.escape(args[prop] + ""));
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
  }
};

var Exceptions = {
  PAGE_BREAK:2,
  LINE_BREAK:3,
  BUFFER_END:4,
  OVER_FLOW:5,
  RETRY:6,
  SKIP:7,
  BREAK:8
};


  
var Selector = (function(){
  function Selector(key, val){
    this.key = this._createKey(key);
    this.rex = this._createRegExp(this.key);
    this.val = val;
  }

  Selector.prototype = {
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.val;
    },
    test : function(dst_key){
      dst_key = dst_key.toLowerCase();
      if(this.rex === null){
	return this.key === dst_key;
      }
      return this.rex.test(dst_key);
    },
    hasClass : function(){
      return (/\.[^\.\s]+/).test(this.key);
    },
    hasId : function(){
      return (/#[^#\s]+/).test(this.key);
    },
    hasContext : function(){
      return (/[\S]+\s+[\S]+/).test(this.key);
    },
    _createKey : function(key){
      return Utils.trim(key).toLowerCase()
	.replace(/\s+/g, " ") // shorten space
      ;
    },
    _createPattern : function(key){
      return key
	.replace(/([^\s#\^]*)#(\S+)/g, "$1#$2")
	.replace(/([^\s\.\^]*)\.(\S+)/g, "$1\\.$2")
	.replace(/\s/g, "(\\s|[a-z0-9-_=:\\[\\]])*") + "$";
    },
    _createRegExp : function(key){
      if(!this.hasId() && !this.hasClass() && !this.hasContext()){
	return null;
      }
      var pat = this._createPattern(key);
      return new RegExp(pat);
    }
  };

  return Selector;
})();


var Selectors = (function(){
  var selectors = [];

  // initialize default selectors
  for(var selector_key in Style){
    selectors.push(new Selector(selector_key, Style[selector_key]));
  }

  var merge_edge = function(edge1, edge2, prop){
    // conv both edge to standard edge format({before:x, end:x, after:x, start:x}).
    var std_edge1 = EdgeParser.normalize(edge1, prop);
    var std_edge2 = EdgeParser.normalize(edge2, prop);
    return Args.copy(std_edge1, std_edge2);
  };

  var merge_corner = function(corner1, corner2, prop){
    var std_corner1 = CornerParser.normalize(corner1, prop);
    var std_corner2 = CornerParser.normalize(corner2, prop);
    return Args.copy(std_corner1, std_corner2);
  };

  var merge = function(dst, obj){
    for(var prop in obj){
      switch(prop){
      case "margin":
      case "padding":
      case "border-width":
      case "border-color":
      case "border-style":
	dst[prop] = merge_edge(dst[prop] || {}, obj[prop], prop);
	break;
      case "border-radius":
	dst[prop] = merge_corner(dst[prop] || {}, obj[prop], prop);
	break;
      default:
	dst[prop] = obj[prop];
	break;
      }
    }
    return dst;
  };

  return {
    setValue : function(selector_key, value){
      var old_value = Style[selector_key] || null;
      if(old_value){
	merge(old_value, value);
      } else {
	Style[selector_key] = value;
	selectors.push(new Selector(selector_key, value));
      }
    },
    getValue : function(selector_key){
      return List.fold(selectors, {}, function(ret, selector){
	return selector.test(selector_key)? merge(ret, selector.getValue()) : ret;
      });
    },
    getMergedValue : function(selector_keys){
      var self = this;
      return List.fold(selector_keys, {}, function(ret, selector_key){
	return merge(ret, self.getValue(selector_key));
      });
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
      return (delim_pos >= 0)? src.substring(0, delim_pos) : src;
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
  function Tag(src, content){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this.src = src;
    this.name = this._parseName(this.src);
    this.tagAttr = {};
    this.dataset = {};
    this.cssAttrContext = {};

    // this object is updated by Tag::setCssAttr.
    // notice that this must be defined before this._parseTagAttr.
    this.cssAttrDynamic = {};

    this.tagAttr = this._parseTagAttr(this.src);
    this.id = this._parseId();
    this.classes = this._parseClasses();
    this.selectors = this._parseSelectors(this.id, this.classes);
    this.cssAttrStatic = this._parseCssAttr(this.selectors);
    this.parent = null;
    this.content = this._parseContent(content || "");
  }

  // name and value regexp
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // utility functions
  var is_style_enable = function(name, prop){
    var element = Style[name] || null;
    return element? (element[prop] || false) : false;
  };
  var is_single_tag = function(name){
    return is_style_enable(name, "single");
  };
  var is_child_content_tag = function(name){
    return is_style_enable(name, "child-content");
  };
  var is_section_tag = function(name){
    return is_style_enable(name, "section");
  };
  var is_section_root_tag = function(name){
    return is_style_enable(name, "section-root");
  };
  var css_attr_cache = {};
  var add_css_attr_cache = function(key, value){
    css_attr_cache[key] = value;
  };
  var get_css_attr_cache = function(key){
    return css_attr_cache[key] || null;
  };

  Tag.prototype = {
    // copy parent settings in 'markup' level
    inherit : function(parent_tag){
      if(this._inherited){
	return; // avoid duplicate initialize
      }
      var self = this;
      this.parent = parent_tag;
      this.iterCssAttr(function(prop, val){
	if(val === "inherit"){
	  self.setCssAttr(prop, parent_tag.getAttr(prop));
	}
      });
      if(parent_tag.getName() != "body"){
	var parent_selectors = parent_tag.getSelectors();
	var ctx_selectors = this._parseContextSelectors(parent_selectors);
	this.cssAttrContext = this._parseCssAttr(ctx_selectors);
	this.selectors = this.selectors.concat(ctx_selectors);
      }
      this._inherited = true;
    },
    setContent : function(content){
      this.content = this._parseContent(content);
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
    setFontSizeUpdate : function(font_size){
      this.fontSize = font_size;
    },
    setFontColorUpdate : function(font_color){
      this.fontColor = font_color;
    },
    addClass : function(klass){
      this.classes.push(klass);
    },
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
    },
    iterTagAttr : function(fn){
      List.each(this.tagAttr, fn);
    },
    iterCssAttrDynamic : function(fn){
      List.each(this.cssAttrDynamic, fn);
    },
    iterCssAttrStatic : function(fn){
      List.each(this.cssAttrStatic, fn);
    },
    iterCssAttr : function(fn){
      this.iterCssAttrStatic(fn);
      this.iterCssAttrDynamic(fn); // dynamic attrs prior to static ones.
    },
    iterAttr : function(fn){
      this.iterCssAttr(fn);
      this.iterTagAttr(fn); // inline attrs prior to css attrs.
    },
    getName : function(){
      return this.name;
    },
    getAttr : function(name, def_value){
      return this.getTagAttr(name) || this.getCssAttr(name) || ((typeof def_value !== "undefined")? def_value : null);
    },
    getPseudoElementName : function(){
      if(this.isPseudoElementTag()){
	return this.getName().substring(1);
      }
      return "";
    },
    getPseudoCssAttr : function(pseudo_name){
      var pseudo_selectors = this._parsePseudoSelectors(pseudo_name);
      return this._parseCssAttr(pseudo_selectors);
    },
    getSelectors : function(){
      return this.selectors;
    },
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getTagAttr : function(name, def_value){
      return this.tagAttr[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getCssAttr : function(name, def_value){
      return this.cssAttrDynamic[name] || this.cssAttrContext[name] || this.cssAttrStatic[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    // used for property that could be contructed with multiple values such as margin(start/end/before/after).
    // for example, when we get "margin" of some target,
    // we read style from default css, and context selector css, and inline style,
    // and we must 'merge' them to get strict style settings.
    getCssAttrs : function(name, def_value){
      return List.fold([this.cssAttrStatic, this.cssAttrContext, this.cssAttrDynamic], [], function(ret, target){
	if(typeof target[name] !== "undefined"){
	  ret.push(target[name]);
	}
	return ret;
      });
    },
    getDataset : function(name, def_value){
      return this.dataset[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getOpenTagName : function(){
      var name = this.getName();
      return this.isClose()? name.slice(1) : name;
    },
    getContent : function(){
      return this.content;
    },
    getCloseTag : function(){
      return new Tag(this.getCloseSrc());
    },
    getCloseSrc : function(){
      if(this.isClose()){
	return this.src;
      }
      return "</" + this.getName() + ">";
    },
    getSrc : function(){
      return this.src;
    },
    getWrapSrc : function(){
      return this.src + this.content + this.getCloseSrc();
    },
    getLogicalFloat : function(){
      return this.getCssAttr("float", "none");
    },
    getHeaderRank : function(){
      if(this.getName().match(/h([1-6])/)){
	return parseInt(RegExp.$1, 10);
      }
      return 0;
    },
    getStaticSize : function(font_size, max_size){
      var width = this.getAttr("width");
      var height = this.getAttr("height");
      if(width && height){
	width = UnitSize.getBoxSize(width, font_size, max_size);
	height = UnitSize.getBoxSize(height, font_size, max_size);
	return new BoxSize(width, height);
      }
      // if img tag size not defined, treat it as character size icon.
      // so, if basic font size is 16px, you can write <img src='/path/to/icon'>
      // instead of writing <img src='/path/to/icon' width='16' height='16'>
      if(this.name === "img"){
	var icon_size = Layout.fontSize;
	return new BoxSize(icon_size, icon_size);
      }
      return null;
    },
    getBoxEdge : function(flow, font_size, max_measure){
      var padding = this.getCssAttr("padding");
      var margin = this.getCssAttr("margin");
      var border_width = this.getCssAttr("border-width");
      var border_color = this.getCssAttr("border-color");
      var border_style = this.getCssAttr("border-style");
      var border_radius = this.getCssAttr("border-radius");
      if(padding === null &&
	 margin === null &&
	 border_width === null &&
	 border_radius === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	var padding_size = UnitSize.getEdgeSize(padding, font_size);
	edge.setSize("padding", flow, padding_size);
      }
      if(margin){
	var margin_size = UnitSize.getEdgeSize(margin, font_size);
	edge.setSize("margin", flow, margin_size);
      }
      if(border_width){
	var border_width_size = UnitSize.getEdgeSize(border_width, font_size);
	edge.setSize("border", flow, border_width_size);
      }
      if(border_radius){
	var border_radius_size = UnitSize.getCornerSize(border_radius, font_size);
	edge.setBorderRadius(flow, border_radius_size);
      }
      if(border_color){
	edge.setBorderColor(flow, border_color);
      }
      if(border_style){
	edge.setBorderStyle(flow, border_style);
      }
      return edge;
    },
    hasStaticSize : function(){
      return (this.getAttr("width") !== null && this.getAttr("height") !== null);
    },
    hasFlow : function(){
      return this.getCssAttr("flow") !== null;
    },
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    isSameAs : function(name){
      if(this.alias){
	return this.alias == name;
      }
      return this.name == name;
    },
    isClassAttrEnable : function(){
      return (typeof this.tagAttr["class"] != "undefined");
    },
    isFloated : function(){
      return this.getLogicalFloat() != "none";
    },
    isPush : function(){
      return (typeof this.tagAttr.push != "undefined");
    },
    isPull : function(){
      return (typeof this.tagAttr.pull != "undefined");
    },
    isOpen : function(){
      if(is_single_tag()){
	return false;
      }
      return this.name.substring(0,1) !== "/";
    },
    isClose : function(){
      return this.name.substring(0,1) === "/";
    },
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    isPseudoTag : function(){
      return this.getName().charAt(0) === ":";
    },
    isPseudoElementTag : function(){
      var name = this.getName();
      return (name === ":first-letter" || name === ":first-line");
    },
    isEmphaTag : function(){
      return this.getCssAttr("empha-mark") !== null;
    },
    isEmbeddableTag : function(){
      return this.getCssAttr("embeddable") === true;
    },
    isBlock : function(){
      if(this.isFloated() || this.isPush() || this.isPull()){
	return true;
      }
      return this.getCssAttr("display", "inline") === "block";
    },
    isInline : function(){
      return this.getCssAttr("display", "inline") === "inline";
    },
    isInlineBlock : function(){
      return this.getCssAttr("display", "inline") === "inline-block";
    },
    isSingleTag : function(){
      return is_single_tag(this.getName());
    },
    isChildContentTag : function(){
      if(this.isSingleTag()){
	return false;
      }
      return is_child_content_tag(this.getName());
    },
    isTcyTag : function(){
      return this.getCssAttr("text-combine", "") === "horizontal";
    },
    isSectionRootTag : function(){
      return is_section_root_tag(this.getName());
    },
    isSectionTag : function(){
      return is_section_tag(this.getName());
    },
    isBoldTag : function(){
      var name = this.getName();
      return name === "b" || name === "strong";
    },
    isHeaderTag : function(){
      return this.getHeaderRank() > 0;
    },
    // check if 'single' page-break-tag
    // not see page-break-xxx:'always'
    isPageBreakTag : function(){
      var name = this.getName();
      return name === "end-page" || name === "page-break";
    },
    _getCssCacheKey : function(selectors){
      return selectors.join(",");
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
    },
    _parseId : function(){
      return this.tagAttr.id || "";
    },
    // <p class='hi hey'>
    // => ["hi", "hey"]
    _parseClasses : function(){
      var str = this.tagAttr["class"] || "";
      if(str === ""){
	return [];
      }
      return str.split(/\s+/);
    },
    // <p class='hi hey'>
    // => [".hi", ".hey"]
    _parseCssClasses : function(classes){
      return List.map(classes, function(class_name){
	return "." + class_name;
      });
    },
    // <p id='foo' class='hi hey'>
    // => ["p", "p.hi", "p.hey", "p#foo"]
    _parseSelectors : function(id, classes){
      var tag_name = this.getName();
      var basic_selector = [tag_name];
      var class_selectors = List.map(classes, function(class_name){
	return tag_name + "." + class_name;
      });
      var id_selector = id? [tag_name + "#" + id] : [];
      return basic_selector.concat(class_selectors).concat(id_selector);
    },
    // parent_keys: ["div", "div.parent"]
    // child_keys: ["p", "p.child"]
    // =>["div p", "div p.child", "div.parent p", "div.parent p.child"]
    _parseContextSelectors : function(parent_selectors){
      var child_selectors = this.selectors;
      return List.fold(parent_selectors, [], function(ret1, parent_key){
	return ret1.concat(List.fold(child_selectors, [], function(ret2, child_key){
	  return ret2.concat([parent_key + " " + child_key]);
	}));
      });
    },
    _parseCssAttr : function(selectors){
      var cache_key = this._getCssCacheKey(selectors);
      var cache = get_css_attr_cache(cache_key);
      if(cache === null){
	cache = Selectors.getMergedValue(selectors);
	add_css_attr_cache(cache_key, cache);
      }
      return cache;
    },
    // if pseudo_name is "before",
    // and this.selectors is ["p", "p.hoge"]
    // => ["p:before", "p.hoge:before"]
    _parsePseudoSelectors : function(pseudo_name){
      return List.map(this.selectors, function(key){
	return key + ":" + pseudo_name;
      });
    },
    _parsePseudoContent : function(pseudo_name){
      var pseudo_css_attr = this.getPseudoCssAttr(pseudo_name);
      var content = pseudo_css_attr.content || "";
      if(content === ""){
	return "";
      }
      return Html.tagWrap(":" + pseudo_name, Html.escape(content));
    },
    _parsePseudoFirstContent : function(content){
      var first_letter_style = this.getPseudoCssAttr("first-letter");
      var first_line_style = this.getPseudoCssAttr("first-line");
      var first_letter_enable = !Obj.isEmpty(first_letter_style);
      var first_line_enable = !Obj.isEmpty(first_line_style);

      if(!first_letter_enable && !first_line_enable){
	return content;
      }
      var prefix = [], postfix = [];
      if(first_line_enable){
	prefix.push("<:first-line>");
      }
      if(first_letter_enable){
	prefix.push("<:first-letter>");
	postfix.push("</:first-letter>");
      }
      return content.replace(rex_first_letter, function(match, p1, p2, p3){
	return p1 + prefix.join("") + p3 + postfix.join("");
      });
    },
    _parseContent : function(content){
      var before = this._parsePseudoContent("before");
      var after = this._parsePseudoContent("after");
      content = this._parsePseudoFirstContent(content);
      return before + content + after;
    },
    // <img src='/path/to/img' push>
    // => {src:'/path/to/img', push:true}
    _parseTagAttr : function(src){
      var self = this;
      var attr = TagAttrParser.parse(this.src);
      for(var name in attr){
	// inline style
	if(name === "style"){
	  // add to dynamic css
	  var inline_css = this._parseInlineStyle(attr[name]);
	  Args.copy(this.cssAttrDynamic, inline_css);
	} else if(name.indexOf("data-") === 0){
	  // <div data-name="john">
	  // => {name:"john"}
	  var dataset_name = this._parseDatasetName(name);
	  this.dataset[dataset_name] = attr[name];
	}
      }
      return attr;
    },
    // "border:0; margin:0"
    // => {border:0, margin:0}
    _parseInlineStyle : function(src){
      var attr = {};
      var stmts = (src.indexOf(";") >= 0)? src.split(";") : [src];
      List.iter(stmts, function(stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]);
	  var val = Utils.trim(nv[1]);
	  attr[prop] = val;
	}
      });
      return attr;
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
    return token._type === "char" || token._type === "word" || token._type === "tcy";
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
    getCssPadding : function(flow){
      var padding = new Padding();
      if(this.paddingStart){
	padding.setStart(flow, this.paddingStart);
      }
      if(this.paddingEnd){
	padding.setEnd(flow, this.paddingEnd);
      }
      return padding.getCss();
    },
    getHoriScale : function(){
      return this.hscale? this.hscale : 1;
    },
    getVertScale : function(){
      return this.vscale? this.vscale : 1;
    },
    isPaddingEnable : function(){
      return (typeof this.paddingStart != "undefined" || typeof this.paddingEnd != "undefined");
    },
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined") && (typeof this.fontSize != "undefined");
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + this.getPaddingSize() + letter_spacing;
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
    setMetrics : function(flow, font_size, is_bold){
      var is_vert = flow.isTextVertical();
      var step_scale = is_vert? this.getVertScale() : this.getHoriScale();
      this.fontSize = font_size;
      this.bodySize = (step_scale != 1)? Math.floor(font_size * step_scale) : font_size;
      if(this.spaceRateStart){
	this.paddingStart = Math.floor(this.spaceRateStart * font_size);
      }
      if(this.spaceRateEnd){
	this.paddingEnd = Math.floor(this.spaceRateEnd * font_size);
      }
      if(this.img && this.img === "tenten"){
	this.bodySize = font_size;
      }
      if(!is_vert && !this.isRef && this.isHankaku()){
	this.bodySize = Math.floor(font_size / 2);
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
    getCharCount : function(){
      return 1; // word is count by 1 character.
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + letter_spacing * this.getLetterCount();
    },
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined") && (typeof this.fontSize != "undefined");
    },
    setMetrics : function(flow, font_size, is_bold){
      this.fontSize = font_size;
      this.bodySize = this.data.length * Math.floor(font_size / 2);
      if(is_bold){
	var bold_rate = Layout.boldRate;
	this.bodySize += Math.floor(bold_rate * this.bodySize);
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
    cutMeasure : function(measure){
      var half_size = Math.floor(this.fontSize / 2);
      var this_half_count = Math.floor(this.bodySize / half_size);
      var measure_half_count = Math.floor(measure / half_size);
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
      return (typeof this.bodySize != "undefined") && (typeof this.fontSize != "undefined");
    },
    setMetrics : function(flow, font_size, is_bold){
      this.fontSize = font_size;
      this.bodySize = font_size;
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
      return (typeof this.advanceSize != "undefined");
    },
    getAdvance : function(flow){
      return this.advanceSize;
    },
    getExtent : function(){
      return this.baseFontSize;
    },
    getFontSize : function(){
      return this.baseFontSize;
    },
    getRbs : function(){
      return this.rbs;
    },
    getRtFontSize : function(){
      return this.rubyFontSize;
    },
    getRtString : function(){
      return this.rt? this.rt.content : "";
    },
    getCss : function(ruby_line){
      var css = {};
      css.position = "absolute";
      css["font-size"] = this.rubyFontSize + "px";
      css[ruby_line.getPropStart()] = this.startPos + "px";
      css[ruby_line.getTextSide()] = this._getBaseLineOffset(ruby_line) + "px";
      return css;
    },
    setStartPos : function(start_pos){
      this.startPos = start_pos;
    },
    setMetrics : function(flow, font_size, letter_spacing){
      this.baseFontSize = font_size;
      this.rubyFontSize = Math.floor(font_size * Layout.rubyRate);
      var advance_rbs = List.fold(this.rbs, 0, function(ret, rb){
	rb.setMetrics(flow, font_size);
	return ret + rb.getAdvance(flow, letter_spacing);
      });
      var advance_rt = this.rubyFontSize * this.getRtString().length;
      this.advanceSize = advance_rbs;
      if(advance_rt > advance_rbs){
	var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
	if(this.rbs.length > 0){
	  this.rbs[0].paddingStart = ctx_space;
	  this.rbs[this.rbs.length - 1].paddingEnd = ctx_space;
	}
	this.advanceSize += ctx_space + ctx_space;
      }
    },
    // calc baseline offset of this ruby,
    // bacause sometimes size of each ruby are different.
    _getBaseLineOffset : function(ruby_line){
      if(ruby_line.isTextVertical()){
	return this._getBaseLineOffsetVert(ruby_line);
      }
      return this._getBaseLineOffsetHori(ruby_line);
    },
    _getBaseLineOffsetVert : function(ruby_line){
      var line_space = ruby_line.getBodyLineContentExtent() - this.baseFontSize;
      var total_rate = 1.0 + ruby_line.lineRate;
      var offset = Math.floor(total_rate * Layout.rubyRate * line_space / 2);
      if(offset > 0){
	return -offset;
      }
      return 0;
    },
    _getBaseLineOffsetHori : function(ruby_line){
      var line_height = ruby_line.getContentExtent();
      var line_space = line_height - this.rubyFontSize;
      return -Math.floor(line_space / 2);
    }
  };

  return Ruby;
})();


var EmphaChar = (function(){
  function EmphaChar(opt){
    this.data = opt.data || "&#x2022";
    this.startPos = opt.startPos || 0;
    this.parent = opt.parent;
    this.fontSize = this.parent.fontSize;
  }

  EmphaChar.prototype = {
    getCss : function(flow){
      var css = {};
      css.position = "absolute";
      css.width = css.height = this.fontSize + "px";
      css.display = flow.isTextVertical()? "block" : "inline-block";
      css["text-align"] = "center";
      css[flow.getPropStart()] = this.startPos + "px";
      if(Env.isIE && flow.isTextVertical()){
	css.left = "50%";
	css["margin-left"] = (-Math.floor(this.fontSize / 2)) + "px";
      }
      return css;
    },
    getAdvance : function(flow){
      return this.parent.getAdvance(flow);
    }
  };

  return EmphaChar;
})();


var Rgb = (function(){
  // 256(8 * 8 * 4) color palette scales.
  var RG_PALETTE = [0, 36, 73, 109, 146, 182, 219, 255];
  var B_PALETTE = [0, 85, 170, 255];

  function Rgb(value){
    this.value = String(value);
    var red = parseInt(this.value.substring(0,2), 16);
    var green = parseInt(this.value.substring(2,4), 16);
    var blue = parseInt(this.value.substring(4,6), 16);

    // color values defined in nehan palette.
    // we use this value for img characters.
    var palette_red = this._findPalette(red, RG_PALETTE);
    var palette_green = this._findPalette(green, RG_PALETTE);
    var palette_blue = this._findPalette(blue, B_PALETTE);

    this.paletteValue = [
      this._makeHexStr(palette_red),
      this._makeHexStr(palette_green),
      this._makeHexStr(palette_blue)
    ].join("");
  }
  
  Rgb.prototype = {
    getColorValue : function(){
      return this.value;
    },
    getPaletteValue : function(){
      return this.paletteValue;
    },
    _makeHexStr : function(ival){
      var str = ival.toString(16);
      if(str.length <= 1){
	return "0" + str;
      }
      return str;
    },
    _findPalette : function(ival, palette){
      if(List.exists(palette, Closure.eq(ival))){
	return ival;
      }
      return List.minobj(palette, function(pval){
	return Math.abs(pval - ival);
      });
    }
  };

  return Rgb;
})();

var Color = (function(){
  function Color(value){
    this.value = Colors.get(value);
  }

  Color.prototype = {
    getCss : function(){
      var css = {};
      css.color = this.getCssValue();
      return css;
    },
    getValue : function(){
      return this.value;
    },
    getPaletteValue : function(){
      return (new Rgb(this.value)).getPaletteValue();
    },
    getCssValue : function(){
      return (this.value === "transparent")? this.value : "#" + this.value;
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
      //console.log("get %d(%s) -> %s(base %d)", decimal, digits.join("-"), ret, base);
      return ret;
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
      var font_size_half = Math.floor(font_size / 2);
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

var Flow = Class.extend({
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
});

var BlockFlow = Flow.extend({
  init : function(dir, multicol){
    this._super(dir);
    this.multicol = multicol || false;
  },
  flip : function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Layout.getVertBlockdir();
    default: return "";
    }
  },
  getCss : function(){
    var css = {};
    if(this.isHorizontal()){
      css["float"] = (this.dir === "lr")? "left" : "right";
    } else if(this.isVertical() && this.multicol){
      css["float"] = (Layout.getHoriIndir() === "lr")? "left" : "right";
    }
    return css;
  },
  getPropBefore : function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  },
  getPropAfter : function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  }
});

var InlineFlow = Flow.extend({
  init : function(dir){
    this._super(dir);
  },
  getPropStart : function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  },
  getPropEnd : function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  }
});

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
      return !this.isRubyLineFirst();
    },
    isRubyLineFirst : function(){
      // vertical-lr is text-line first.
      if(this.inflow.isVertical() && this.blockflow.isLeftToRight()){
	return false;
      }
      return true;
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
    getTextSide : function(){
      if(this.isTextLineFirst()){
	return this.blockflow.getPropBefore();
      }
      return this.blockflow.getPropAfter();
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

var Edge = Class.extend({
  init : function(type){
    this._type = type;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  },
  clear : function(){
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
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
  },
  getLogicalSize : function(flow, dir){
    return this[flow.getProp(dir)];
  },
  setLogicalSize : function(flow, dir, val){
    this[flow.getProp(dir)] = val;
  }
});

var EdgeParser = (function(){
  var parse_array = function(array){
    switch(array.length){
    case 1:
      return {before:array[0], end:array[0], after:array[0], start:array[0]};
    case 2:
      return {before:array[0], end:array[1], after:array[0], start:array[1]};
    case 3:
      return {before:array[0], end:array[1], after:array[2], start:array[1]};
    case 4:
      return {before:array[0], end:array[1], after:array[2], start:array[3]};
    default:
      return null;
    }
  };

  var parse_object = function(obj, def_value){
    return Args.merge({}, {
      before:def_value,
      end:def_value,
      after:def_value,
      start:def_value
    }, obj);
  };

  var parse_oneliner = function(str){
    str = str.replace(/\s+/g, " ").replace(/\n/g, "").replace(/;/g, "");
    if(str.indexOf(" ") < 0){
      return parse([str]);
    }
    return parse_array(str.split(" "));
  };

  var parse = function(obj, def_value){
    if(obj instanceof Array){
      return parse_array(obj);
    }
    switch(typeof obj){
    case "object": return parse_object(obj, def_value);
    case "string": return parse_oneliner(obj); // one-liner source
    case "number": return parse_array([obj]);
    default: return null;
    }
  };

  var defaults = {
    "border-width":0,
    "margin":0,
    "padding":0,
    "border-radius":0,
    "border-style":"none",
    "border-color":"black"
  };

  return {
    normalize : function(obj, prop){
      return parse(obj, defaults[prop] || 0);
    }
  };
})();

var CornerParser = (function(){
  var parse_array = function(array){
    switch(array.length){
    case 1:
      return {"start-before":array[0], "end-before":array[0], "end-after":array[0], "start-after":array[0]};
    case 2:
      return {"start-before":array[0], "end-before":array[1], "end-after":array[0], "start-after":array[1]};
    case 3:
      return {"start-before":array[0], "end-before":array[1], "end-after":array[2], "start-after":array[1]};
    case 4:
      return {"start-before":array[0], "end-before":array[1], "end-after":array[2], "start-after":array[3]};
    default:
      return null;
    }
  };

  var normalize_oneliner = function(str){
    return Utils.trim(str)
      .replace(/\s+/g, " ")
      .replace(/\n/g, "")
      .replace(/;/g, "");
  };

  var parse_value_2d = function(str){
    str = str.normalize_oneliner(str);
    if(str.indexOf(" ") < 0){
      return [str, str];
    }
    return str.split(" ");
  };

  var parse_object = function(obj, def_value){
    return Args.merge({}, {
      "start-before":def_value,
      "end-before":def_value,
      "end-after":def_value,
      "start-after":def_value
    }, obj);
  };

  var parse_oneliner_dim = function(str){
    str = normalize_oneliner(str);
    if(str.indexOf(" ") < 0){
      return [str];
    }
    return str.split(" ").slice(0, 4);
  };

  var parse_oneliner = function(str){
    if(str.indexOf("/") < 0){
      return arguments.callee([str, str].join("/"));
    }
    var hv = str.split("/");
    var h_values = parse_oneliner_dim(hv[0]);
    var v_values = parse_oneliner_dim(hv[1]);
    return parse_array(List.zip(h_values, v_values));
  };

  var parse = function(obj, def_value){
    if(obj instanceof Array){
      return parse_array(obj);
    }
    switch(typeof obj){
    case "object": return parse_object(obj, def_value);
    case "string": return parse_oneliner(obj); // one-liner source
    case "number": return parse_array([[obj, obj]]);
    default: return null;
    }
  };

  var defaults = {
    "border-radius":[0, 0]
  };

  return {
    normalize : function(obj, prop){
      return parse(obj, defaults[prop] || [0, 0]);
    }
  };
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
      List.iter(Const.cssVenderPrefixes, function(prefix){
	var prop = [prefix, "border-radius"].join("-");
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

var Padding = Edge.extend({
  init : function(){
    this._super("padding");
  }
});

var Margin = Edge.extend({
  init : function(){
    this._super("margin");
  }
});

var Border = Edge.extend({
  init : function(){
    this._super("border");
  },
  clearBefore : function(flow){
    this.setBefore(flow, 0);
    if(this.radius){
      this.radius.clearBefore(flow);
    }
  },
  clearAfter : function(flow){
    this.setAfter(flow, 0);
    if(this.radius){
      this.radius.clearAfter(flow);
    }
  },
  getDirProp : function(dir){
    return ["border", dir, "width"].join("-");
  },
  setRadius : function(flow, radius){
    this.radius = new BorderRadius();
    this.radius.setSize(flow, radius);
  },
  setColor : function(flow, color){
    this.color = new BorderColor();
    this.color.setColor(flow, color);
  },
  setStyle : function(flow, style){
    this.style = new BorderStyle();
    this.style.setStyle(flow, style);
  },
  getCss : function(){
    var css = this._super();
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
  }
});

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
    setSize : function(prop, flow, size){
      this[prop].setSize(flow, size);
    },
    setEdgeSize : function(flow, edge_size){
      for(var prop in edge_size){
	this.setSize(prop, flow, edge_size[prop]);
      }
    },
    setEdgeStart : function(prop, flow, value){
      this[prop].setStart(flow, value);
    },
    setEdgeEnd : function(prop, flow, value){
      this[prop].setEnd(flow, value);
    },
    setEdgeBefore : function(prop, flow, value){
      this[prop].setBefore(flow, value);
    },
    setEdgeAfter : function(prop, flow, value){
      this[prop].setAfter(flow, value);
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
      var auto_size = Math.floor(rest_size / auto_count);
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

var BoxSize = (function(){
  function BoxSize(width, height){
    this.width = width;
    this.height = height;
  }

  BoxSize.prototype = {
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
      return Math.floor(100 * this.width / target_size.width);
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
	box_extent = Math.floor(box_extent - slope * m_over);
	box_measure = rest_measure;
      }
      return flow.getBoxSize(box_measure, box_extent);
    },
    toLogicalSize : function(flow){
      return new LogicalSize(this.getMeasure(flow), this.getExtent(flow));
    }
  };

  return BoxSize;
})();

var LogicalSize = (function(){
  function LogicalSize(measure, extent){
    this.measure = measure;
    this.extent = extent;
  }

  LogicalSize.prototype = {
    canInclude : function(size){
      return (size.measure <= this.measure && size.extent <= this.extent);
    },
    getWidth : function(flow){
      return this[flow.getPropWidth()];
    },
    getHeight : function(flow){
      return this[flow.getPropHeight()];
    },
    toBoxSize : function(flow){
      return new BoxSize(this.getWidth(flow), this.getHeight(flow));
    }
  };

  return LogicalSize;
})();

var BoxChild = (function(){
  function BoxChild(){
    this.forward = [];
    this.normal = [];
    this.backward = [];
  }

  BoxChild.prototype = {
    get : function(){
      return this.forward.concat(this.normal).concat(this.backward);
    },
    getLength : function(){
      return this.forward.length + this.normal.length + this.backward.length;
    },
    getFirst : function(){
      if(this.forward.length > 0){
	return this.forward[0];
      }
      if(this.normal.length > 0){
	return this.normal[0];
      }
      if(this.backward.length > 0){
	return this.backward[this.backward.length - 1];
      }
      return null;
    },
    add : function(child){
      if(child.backward){
	this.backward.unshift(child);
      } else if(child.forward){
	this.forward.push(child);
      } else {
	this.normal.push(child);
      }
    }
  };

  return BoxChild;
})();

var Box = (function(){
  function Box(size, parent, type){
    this._type = type || "div";
    this.childExtent = 0;
    this.size = size;
    this.childs = new BoxChild();
    this.css = {};
    this.parent = parent;
    this.charCount = 0;
  }

  Box.prototype = {
    getCss : function(){
      var css = this.css;
      Args.copy(css, this.size.getCss());
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.fontSize){
	css["font-size"] = this.fontSize + "px";
      }
      if(this.letterSpacing && !this.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      css.display = this.display || "block";
      return css;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getClasses : function(){
      var classes = ["nehan-box"];
      if(this._type != "box"){
	classes.push(Css.addNehanPrefix(this._type));
      }
      return classes.concat(this.extraClasses || []);
    },
    getCssClasses : function(){
      return this.getClasses().join(" ");
    },
    getFirstChild : function(){
      return this.childs.getFirst();
    },
    getChilds : function(){
      return this.childs.get();
    },
    getChildExtent : function(){
      return this.childExtent;
    },
    getFlowName : function(){
      return this.flow.getName();
    },
    getFlipFlow : function(){
      return this.flow.getFlipFlow();
    },
    getRestContentExtent : function(){
      return this.getContentExtent() - this.getChildExtent();
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.flow);
    },
    getMaxChildMeasure : function(flow){
      var _flow = flow || this.flow;
      var max_measure = 0;
      List.iter(this.getChilds(), function(child){
	var measure = child.getTextMeasure? child.getTextMeasure() : child.getContentMeasure(_flow);
	if(measure > max_measure){
	  max_measure = measure;
	}
      });
      return max_measure;
    },
    getContentWidth : function(){
      return this.size.width;
    },
    getContentHeight : function(){
      return this.size.height;
    },
    getBoxMeasure : function(flow){
      var flow2 = flow || this.flow;
      var ret = this.getContentMeasure(flow2);
      if(this.edge){
	ret += this.edge.getMeasureSize(flow2);
      }
      return ret;
    },
    getBoxExtent : function(flow){
      var flow2 = flow || this.flow;
      var ret = this.getContentExtent(flow2);
      if(this.edge){
	ret += this.edge.getExtentSize(flow2);
      }
      return ret;
    },
    getBoxWidth : function(){
      var ret = this.size.width;
      if(this.edge){
	ret += this.edge.getWidth();
      }
      return ret;
    },
    getBoxHeight : function(){
      var ret = this.size.height;
      if(this.edge){
	ret += this.edge.getHeight();
      }
      return ret;
    },
    getBoxSize : function(){
      return new BoxSize(this.getBoxWidth(), this.getBoxHeight());
    },
    getBorder : function(){
      return this.edge? this.edge.border : null;
    },
    getRestSize : function(){
      var rest_measure = this.getContentMeasure();
      var rest_extent = this.getRestContentExtent();
      return this.flow.getBoxSize(rest_measure, rest_extent);
    },
    getFloatedWrapFlow : function(){
      return this.flow.getFloatedWrapFlow();
    },
    getParentFlow : function(){
      return this.parent? this.parent.flow : null;
    },
    getParallelFlow : function(){
      return this.flow.getParallelFlow();
    },
    getParallelFlipFlow : function(){
      return this.flow.getParallelFlipFlow();
    },
    getPropStart : function(){
      return this.flow.getPropStart();
    },
    getPropAfter : function(){
      return this.flow.getPropAfter();
    },
    getInflow : function(){
      return this.flow.inflow;
    },
    getBlockflow : function(){
      return this.flow.blockflow;
    },
    getBoxFlowBoxSize : function(measure, extent){
      return this.flow.getBoxSize(measure, extent);
    },
    getEdgeWidth : function(){
      return this.edge? this.edge.getWidth() : 0;
    },
    getEdgeHeight : function(){
      return this.edge? this.edge.getHeight() : 0;
    },
    addClass : function(klass){
      var classes = this.extraClasses || [];
      classes.push(klass);
      this.extraClasses = classes;
    },
    addChild : function(child){
      this.childs.add(child);
      this.childExtent += child.getBoxExtent(this.flow);
      this.charCount += child.getCharCount();
    },
    addExtent : function(extent){
      this.size.addExtent(this.flow, extent);
    },
    addMeasure : function(measure){
      this.size.addMeasure(this.flow, measure);
    },
    setCss : function(prop, value){
      this.css[prop] = value;
    },
    setType : function(type){
      this._type = type;
    },
    setId : function(id){
      this.id = id;
    },
    setParent : function(parent, inherit){
      var is_inherit = (typeof inherit != "undefined")? inherit : true;
      this.parent = parent;
      if(is_inherit){
	this.setFlow(parent.flow);
      }
    },
    setFlow : function(flow){
      if(flow.isValid()){
	this.flow = flow;
      }
    },
    setContentExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
    },
    setContentMeasure : function(flow, measure){
      this.size.setMeasure(flow, measure);
    },
    setEdgeStart : function(prop, value){
      if(this.edge){
	this.edge.setEdgeStart(prop, this.flow, value);
      }
    },
    setEdgeEnd : function(prop, value){
      if(this.edge){
	this.edge.setEdgeEnd(prop, this.flow, value);
      }
    },
    setEdgeBefore : function(prop, value){
      if(this.edge){
	this.edge.setEdgeBefore(prop, this.flow, value);
      }
    },
    setEdgeAfter : function(prop, value){
      if(this.edge){
	this.edge.setEdgeAfter(prop, this.flow, value);
      }
    },
    setEdge : function(edge){
      if(edge instanceof BoxEdge){
	this.edge = edge;
      } else if(edge._type){
	this.edge[edge._type] = edge;
      }
    },
    setEdgeBySub : function(edge){
      this.size.subEdge(edge);
      if(this.size.isValid()){
	this.setEdge(edge);
      }
    },
    subMeasure : function(measure){
      this.size.subMeasure(this.flow, measure);
    },
    splitMeasure : function(count){
      var measure = this.getContentMeasure();
      var div_size = Math.floor(measure / count);
      var ret = [];
      for(var i = 0; i < count; i++){
	ret.push(div_size);
      }
      return ret;
    },
    isEmptyChild : function(){
      return this.childs.getLength() === 0;
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isValidSize : function(){
      return this.size.isValid();
    },
    canJustify : function(){
      if(this._type === "li-marker" || this._type === ":first-letter"){
	return false;
      }
      return true;
    },
    canInclude : function(size){
      return this.size.canInclude(size);
    },
    clearEdge : function(){
      if(this.edge){
	this.edge.clear();
      }
    },
    clearBorderBefore : function(){
      if(this.edge){
	this.edge.clearBorderBefore(this.flow);
      }
    },
    clearBorderAfter : function(){
      if(this.edge){
	this.edge.clearBorderAfter(this.flow);
      }
    },
    shortenBox : function(flow){
      var _flow = flow || this.flow;
      this.shortenMeasure(_flow);
      this.shortenExtent(_flow);
      return this;
    },
    shortenMeasure : function(flow){
      var _flow = flow || this.flow;
      var max_measure = this.getMaxChildMeasure(_flow);
      this.setContentMeasure(_flow, max_measure);
      return this;
    },
    shortenExtent : function(flow){
      var _flow = flow || this.flow;
      this.setContentExtent(_flow, this.getChildExtent());
      return this;
    }
  };

  return Box;
})();

var LineBox = (function(){
  function LineBox(opt){
    this._type = "line-box";
    this.parent = opt.parent;
    this.extent = opt.extent || 0;
    this.rubyLine = opt.rubyLine || null;
    this.textLine = opt.textLine || null;
  }

  LineBox.prototype = {
    _getLinesRubyLineFirst : function(){
      var ret = [];
      if(this.rubyLine){
	ret.push(this.rubyLine);
      }
      if(this.textLine){
	ret.push(this.textLine);
      }
      return ret;
    },
    _getLinesTextLineFirst : function(){
      var ret = [];
      if(this.textLine){
	ret.push(this.textLine);
      }
      if(this.rubyLine){
	ret.push(this.rubyLine);
      }
      return ret;
    },
    getLines : function(){
      var flow = this.parent.flow;
      if(flow.isRubyLineFirst()){
	return this._getLinesRubyLineFirst();
      }
      return this._getLinesTextLineFirst();
    },
    getCharCount : function(){
      return this.textLine? this.textLine.getCharCount() : 0;
    },
    getTextLine : function(){
      return this.textLine;
    },
    getRubyLine : function(){
      return this.rubyLine;
    },
    getTextMeasure : function(){
      return this.textLine.getTextMeasure();
    },
    getContentMeasure : function(){
      return this.textLine.getContentMeasure();
    },
    getBoxExtent : function(){
      return this.extent;
    }
  };

  return LineBox;
})();

// this class is almost same as 'Box',
// but we isolate this class for performance reason.
var TextLine = (function(){
  function TextLine(opt){
    this.css = {};
    this._type = opt.type || "text-line";
    this.size = opt.size;
    this.fontSize = opt.fontSize;
    this.color = opt.color;
    this.parent = opt.parent;
    this.textMeasure = opt.textMeasure;
    this.textIndent = opt.textIndent;
    this.tokens = opt.tokens;
    this.emphaChars = opt.emphaChars || null;
    this.lineRate = opt.lineRate || 1.0;
    this.bodyLine = opt.bodyLine || null;
    this.charCount = opt.charCount || 0;
    this.letterSpacing = opt.letterSpacing || 0;

    // inherit parent properties
    this.textAlign = this.parent.textAlign;
    this.flow = this.parent.flow;
  }

  TextLine.prototype = {
    // this function is called only from VerticalInlineEvaluator::evalRubyLabelLine,
    // and ruby is not justify target.
    canJustify : function(){
      return false;
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextLine : function(){
      return this._type === "text-line";
    },
    isRubyLine : function(){
      return this._type === "ruby-line";
    },
    setEdge : function(edge){
      this.edge = edge;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getTextMeasure : function(){
      return this.textMeasure;
    },
    getTextRestMeasure : function(){
      return this.getContentMeasure() - this.textMeasure;
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.flow);
    },
    getRestContentExtent : function(flow){
      return this.getContentExtent(flow || this.flow);
    },
    getBodyLineContentExtent : function(){
      return this.bodyLine.getContentExtent();
    },
    getBoxExtent : function(flow){
      var _flow = flow || this.flow;
      var ret = this.size.getExtent(_flow);
      if(this.edge){
	ret += this.edge.getExtentSize(_flow);
      }
      return ret;
    },
    getTextSide : function(){
      return this.flow.getTextSide();
    },
    getPropStart : function(){
      return this.flow.getPropStart();
    },
    getPropAfter : function(){
      return this.flow.getPropAfter();
    },
    getPropBefore : function(){
      return this.flow.getPropBefore();
    },
    getStartOffset : function(){
      switch(this.textAlign){
      case "start": return this.textIndent;
      case "end": return this.textIndent + this.getTextRestMeasure();
      case "center": return this.textIndent + Math.floor(this.getTextRestMeasure() / 2);
      default: return this.textIndent;
      }
    },
    getCss : function(){
      var css = this.css;
      Args.copy(css, this.size.getCss());
      if(this.parent){
	Args.copy(css, this.flow.getCss());
      }
      var start_offset = this.getStartOffset();
      if(start_offset){
	this.edge = new Margin();
	this.edge.setStart(this.flow, start_offset);
      }
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.isTextVertical()){
	if(Env.isIphoneFamily){
	  css["letter-spacing"] = "-0.001em";
	}
      }
      if(this._type === "ruby-line"){
	if(this.flow.isTextHorizontal()){
	  css["line-height"] = this.getContentExtent() + "px";
	}
      }
      return css;
    },
    getCssClasses : function(){
      return this.getClasses().join(" ");
    },
    getClasses : function(){
      return [
	["nehan", this._type].join("-"),
	["nehan", this._type, (this.isTextVertical()? "vert" : "hori")].join("-")
      ];
    },
    getTextHorizontalDir : function(){
      return this.flow.getTextHorizontalDir();
    },
    shortenMeasure : function(){
      this.size.setMeasure(this.flow, this.textMeasure);
    }
  };

  return TextLine;
})();

var Lexer = (function (){

  var rexTcy = /\d\d|!\?|!!|\?!|\?\?/;
  var rexWord = /^([\w!\.\?\/\_:#;"',]+)/;
  var rexTag = /^(<[^>]+>)/;
  var rexCharRef = /^(&[^;\s]+;)/;

  function Lexer(src){
    this.pos = 0;
    this.buff = src;
    // TODO:
    // each time lexer is called 'get', this.buff is reduced.
    // but if we implement searching issue in this system,
    // we will need the buffer copy.
    //this.src = src;
    this.bufferLength = this.buff.length;
    this.empty = (this.buff === "");
  }

  Lexer.prototype = {
    isEmpty : function(){
      return this.empty;
    },
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    getBufferLength : function(){
      return this.bufferLength;
    },
    getSeekPercent : function(seek_pos){
      return Math.floor(100 * seek_pos / this.bufferLength);
    },
    _stepBuff : function(count){
      this.pos += count;
      this.buff = this.buff.slice(count);
    },
    _getToken : function(){
      if(this.buff === ""){
	return null;
      } else if(this.buff.match(rexTag)){
	return this._parseTag(RegExp.$1);
      } else if(this.buff.match(rexWord)){
	var str = RegExp.$1;
	if(str.length === 1){
	  return this._parseChar(str);
	} else if(str.length === 2 && str.match(rexTcy)){
	  return this._parseTcy(str);
	}
	return this._parseWord(str);
      } else if(this.buff.match(rexCharRef)){
	return this._parseCharRef(RegExp.$1);
      } else {
	return this._parseChar(this._getChar());
      }
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
      var start_tag = "<" + tag_name;
      var end_tag = "</" + tag_name;
      var get_end_pos = function(buff, offset){
	var callee = arguments.callee;
	var start_pos = buff.indexOf(start_tag, offset);
	var end_pos = buff.indexOf(end_tag, offset);
	if(start_pos < 0 || end_pos < start_pos){
	  return end_pos;
	}
	var end_pos2 = callee(buff, start_pos + tag_name.length + 2);
	return callee(buff, end_pos2 + tag_name.length + 3);
      };
      var end_pos = get_end_pos(this.buff, 0);
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
      if(tag.isChildContentTag()){
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
      tag.setContent(Utils.trimCRLF(content));
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

  return Lexer;
})();


var TagStack = (function (){
  function TagStack(opt){
    this.tags = [];
    this.head = null;
  }

  TagStack.prototype = {
    isEmpty : function(){
      return this.tags.length <= 0;
    },
    isTagNameEnable : function(name){
      return this.exists(function(tag){
	return tag.getName() == name;
      });
    },
    getDepth : function(){
      return this.tags.length;
    },
    getDepthByName : function(name){
      return List.count(this.tags, function(tag){
	return tag.getName() == name;
      });
    },
    getHead : function(){
      return this.head;
    },
    pop : function(){
      var ret = this.tags.pop();
      this.head = this._getCurHead();
      return ret;
    },
    push : function(tag){
      this.head = tag;
      this.tags.push(tag);
    },
    exists : function(fn){
      return List.exists(this.tags, fn);
    },
    find : function(fn){
      return List.find(this.tags, fn);
    },
    revfind : function(fn){
      return List.revfind(this.tags, fn);
    },
    iter : function(fn){
      List.iter(this.tags, fn);
    },
    reviter : function(fn){
      List.revIter(this.tags, fn);
    },
    filter : function(fn){
      return List.filter(this.tags, fn);
    },
    getByName : function(name){
      for(var i = this.tags.length - 1; i >= 0; i--){
	var tag = this.tags[i];
	if(tag.name == name){
	  return tag;
	}
      }
      return null;
    },
    popByName : function(name){
      for(var i = this.tags.length - 1; i >= 0; i--){
	var tag = this.tags[i];
	if(tag.name == name){
	  var ret = this.tags.splice(i,1)[0];
	  this.head = this._getCurHead();
	  return ret;
	}
      }
      return null;
    },
    _getCurHead : function(){
      if(this.tags.length === 0){
	return null;
      }
      return this.tags[this.tags.length - 1];
    }
  };

  return TagStack;
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
    },
    debug : function(){
      return [
	"title:" + this.title,
	"rank:" + this.rank
      ].join(", ");
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
    },
    debug : function(){
      if(this._header){
	return this._header.debug();
      }
      return "no header";
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
      // it's added twice by rollback yielding.
      // in such case, we have to update old one.
      var pos = this._findLog(log);
      if(pos >= 0){
	this.logs[pos] = log; // update log
	return;
      }
      this.logs.push(log);
    },
    // find same log without page no.
    _isSameLog : function(log1, log2){
      for(var prop in log1){
	if(prop == "pageNo" || prop == "headerId"){
	  continue;
	}
	if(log1[prop] != log2[prop]){
	  return false;
	}
      }
      return true;
    },
    _findLog : function(log){
      for(var i = this.logs.length - 1; i >= 0; i--){
	if(this._isSameLog(log, this.logs[i])){
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
      this._curSection = this._stack.pop() || "body";
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

var DocumentMeta = (function (){
  function DocumentMeta(){
    this.values = {};
  }

  DocumentMeta.prototype = {
    get : function(name){
      var entry = this.values[name] || null;
      if(entry){
	if(entry.length === 1){
	  return entry[0];
	}
	return entry;
      }
      return null;
    },
    add : function(name, value){
      var entry = this.values[name] || null;
      if(entry){
	entry.push(value);
      } else {
	this.values[name] = [value];
      }
    }
  };

  return DocumentMeta;
})();


var BlockContext = (function(){
  function BlockContext(){
    this.tagStack = new TagStack();
  }

  BlockContext.prototype = {
    pushBlock : function(tag){
      var parent_tag = this.getHeadTag();
      if(parent_tag){
	// copy 'inherit' value from parent in 'markup' level.
	tag.inherit(parent_tag);
      }
      this.tagStack.push(tag);
    },
    popBlock : function(){
      return this.tagStack.pop();
    },
    getHeadTag : function(){
      return this.tagStack.getHead();
    },
    getTagStack : function(){
      return this.tagStack;
    },
    getDepth : function(){
      return this.tagStack.getDepth();
    },
    getDepthByName : function(name){
      return this.tagStack.getDepthByName(name);
    },
    findTag : function(fn){
      return this.tagStack.find(fn);
    },
    isEmpty : function(){
      return this.tagStack.isEmpty();
    },
    isTagEnable : function(fn){
      return this.tagStack.exists(fn);
    },
    isHeaderEnable : function(){
      return this.tagStack.exists(function(tag){
	return tag.isHeaderTag();
      });
    },
    isTagNameEnable : function(tag_name){
      return this.tagStack.isTagNameEnable(tag_name);
    }
  };

  return BlockContext;
})();

var InlineContext = (function(){
  function InlineContext(){
    this.tagStack = new TagStack();
    this.fontSizeStack = [];
    this.fontColorStack = [];
    this.linePos = 0;
  }

  InlineContext.prototype = {
    // this func is used when we want temporary context and temporary font size.
    // mainly used from ruby label generator.
    setFixedFontSize : function(font_size){
      this.fixedFontSize = font_size;
    },
    getTagStack : function(){
      return this.tagStack;
    },
    getFontSize : function(parent){
      if(this.fixedFontSize){
	return this.fixedFontSize;
      }
      if(this.fontSizeStack.length > 0){
	return this.fontSizeStack[this.fontSizeStack.length - 1];
      }
      return parent.fontSize;
    },
    getFontColor : function(parent){
      if(this.fontColorStack.length > 0){
	return this.fontColorStack[this.fontColorStack.length - 1];
      }
      return parent.color;
    },
    getTagDepth : function(){
      return this.tagStack.getDepth();
    },
    isTagEnable : function(fn){
      return this.tagStack.exists(fn);
    },
    isTagNameEnable : function(tag_name){
      return this.tagStack.isTagNameEnable(tag_name);
    },
    isBoldEnable : function(){
      return this.tagStack.exists(function(tag){
	return tag.isBoldTag();
      });
    },
    isEmpty : function(){
      return this.tagStack.isEmpty();
    },
    findTag : function(fn){
      return this.tagStack.find(fn);
    },
    findLastTagByName : function(name){
      return this.tagStack.revfind(function(tag){
	return tag.getName() == name;
      });
    },
    pushTag : function(tag, parent){
      var font_size = tag.getCssAttr("font-size");
      if(font_size){
	var cur_font_size = this.getFontSize(parent);
	var new_font_size = UnitSize.getUnitSize(font_size, cur_font_size);
	tag.setFontSizeUpdate(new_font_size);
	this.fontSizeStack.push(new_font_size);
      }
      var font_color = tag.getCssAttr("color", "inherit");
      if(font_color !== "inherit"){
	font_color = new Color(font_color);

	// store inline color update info in markup object.
	tag.setFontColorUpdate(font_color);
	this.fontColorStack.push(font_color);
      }
      this.tagStack.push(tag);
    },
    popTag : function(){
      var tag = this.tagStack.pop();
      if(tag){
	this._updateStatus(tag);
      }
      return tag;
    },
    popTagByName : function(name){
      var tag = this.tagStack.popByName(name);
      if(tag){
	this._updateStatus(tag);
      }
      return tag;
    },
    _updateStatus : function(tag){
      if(tag.fontSize && this.fontSizeStack.length > 0){
	this.fontSizeStack.pop();
      }
      if(tag.color && this.fontColorStack.length > 0){
	this.fontColorStack.pop();
      }
    }
  };

  return InlineContext;
})();

var StyleContext = (function(){
  function StyleContext(){
    this.localStyles = {};
    this.globalStyles = [];
  }

  StyleContext.prototype = {
    addLocalStyle : function(markup, page_no){
      var styles = this.localStyles[page_no] || [];
      var css_content = markup.getContent();
      styles.push(css_content);
      this.localStyles[page_no] = styles;
    },
    addGlobalStyle : function(markup){
      var css_content = markup.getContent();
      this.globalStyles.push(css_content);
    },
    getLocalStyles : function(page_no){
      return this.localStyles[page_no] || [];
    },
    getGlobalStyles : function(){
      return this.globalStyles;
    }
  };

  return StyleContext;
})();

var DocumentContext = (function(){

  // header id to associate each header with outline.
  var __global_header_id = 0;
  
  function DocumentContext(option){
    var opt = option || {};
    this.charPos = opt.charPos || 0;
    this.pageNo = opt.pageNo || 0;
    this.meta = opt.meta || new DocumentMeta();
    this.blockContext = opt.blockContext || new BlockContext();
    this.inlineContext = opt.inlineContext || new InlineContext();
    this.styleContext = opt.styleContext || new StyleContext();
    this.outlineContext = opt.outlineContext || new OutlineContext();
    this.anchors = opt.anchors || {};
  }

  DocumentContext.prototype = {
    setTitle : function(title){
      this.setMeta("title", title);
    },
    getTitle : function(){
      return this.getMeta("title");
    },
    setMeta : function(name, value){
      this.meta.add(name, value);
    },
    getMeta : function(name){
      return this.meta.get(name);
    },
    getPageNo : function(){
      return this.pageNo;
    },
    getCharPos : function(){
      return this.charPos;
    },
    stepPageNo : function(){
      this.pageNo++;
    },
    addCharPos : function(char_count){
      this.charPos += char_count;
    },
    createInlineRoot : function(){
      return new DocumentContext({
	charPos:this.charPos,
	pageNo:this.pageNo,
	meta:this.meta,
	anchors:this.anchors,
	outlineContext:this.outlineContext,
	blockContext:this.blockContext,
	styleContext:this.styleContext
      });
    },
    isEmptyMarkupContext : function(){
      return this.inlineContext.isEmpty();
    },
    // style
    addStyle : function(markup){
      var scope = markup.getDataset("scope", "global");
      if(scope === "local"){
	this.styleContext.addLocalStyle(markup, this.pageNo);
      } else {
	this.styleContext.addGlobalStyle(markup);
      }
    },
    getPageStyles : function(page_no){
      var global_styles = this.getGlobalStyles();
      var local_styles = this.getLocalStyles(page_no);
      return global_styles.concat(local_styles);
    },
    getLocalStyles : function(page_no){
      var _page_no = (typeof page_no != "undefined")? page_no : this.pageNo;
      return this.styleContext.getLocalStyles(_page_no);
    },
    getGlobalStyles : function(){
      return this.styleContext.getGlobalStyles();
    },
    // anchors
    setAnchor : function(anchor_name){
      this.anchors[anchor_name] = this.pageNo;
    },
    getAnchors : function(){
      return this.anchors;
    },
    getAnchorPageNo : function(anchor_name){
      return this.anchors[anchor_name];
    },
    // inline context
    getInlineFontSize : function(parent){
      return this.inlineContext.getFontSize(parent);
    },
    getInlineFontColor : function(parent){
      return this.inlineContext.getFontColor(parent);
    },
    getInlineTagStack : function(){
      return this.inlineContext.getTagStack();
    },
    getInlineTagDepth : function(){
      return this.inlineContext.getTagDepth();
    },
    pushInlineTag : function(tag, parent){
      this.inlineContext.pushTag(tag, parent);
    },
    popInlineTag : function(){
      return this.inlineContext.popTag();
    },
    popInlineTagByName : function(name){
      return this.inlineContext.popTagByName(name);
    },
    findLastInlineTagByName : function(name){
      return this.inlineContext.findLastTagByName(name);
    },
    findInlineTag : function(fn){
      return this.inlineContext.findTag(fn);
    },
    isInlineTagEnable : function(fn){
      return this.inlineContext.isTagEnable(fn);
    },
    isBoldEnable : function(){
      if(this.inlineContext.isBoldEnable()){
	return true;
      }
      return  this.isHeaderEnable();
    },
    setFixedFontSize : function(font_size){
      this.inlineContext.setFixedFontSize(font_size);
    },
    // block context
    isHeaderEnable : function(){
      return this.blockContext.isHeaderEnable();
    },
    pushBlock : function(tag){
      this.blockContext.pushBlock(tag);
    },
    popBlock : function(){
      return this.blockContext.popBlock();
    },
    getBlockTagStack : function(){
      return this.blockContext.getTagStack();
    },
    getCurBlockTag : function(){
      return this.blockContext.getHeadTag();
    },
    getBlockDepth : function(){
      return this.blockContext.getDepth();
    },
    getBlockDepthByName : function(name){
      return this.blockContext.getDepthByName(name);
    },
    getOutlineTitle : function(){
      return this.blockContext.getOutlineTitle();
    },
    findBlockTag : function(fn){
      return this.blockContext.findTag(fn);
    },
    isBlockTagEnable : function(fn){
      return this.blockContext.isTagEnable(fn);
    },
    // outline context
    getOutlineBuffer : function(root_name){
      return this.outlineContext.getOutlineBuffer(root_name);
    },
    startSectionRoot : function(tag){
      var type = tag.getName();
      this.outlineContext.startSectionRoot(type);
    },
    endSectionRoot : function(tag){
      var type = tag.getName();
      return this.outlineContext.endSectionRoot(type);
    },
    logStartSection : function(tag){
      var type = tag.getName();
      this.outlineContext.logStartSection(type, this.pageNo);
    },
    logEndSection : function(tag){
      var type = tag.getName();
      this.outlineContext.logEndSection(type);
    },
    logSectionHeader : function(tag){
      var type = tag.getName();
      var rank = tag.getHeaderRank();
      var title = tag.content;
      var page_no = this.pageNo;
      var header_id = __global_header_id++;
      this.outlineContext.logSectionHeader(type, rank, title, page_no, header_id);
      return header_id;
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
    var val = UnitSize.getEdgeSize(border, box.fontSize, box.getContentMeasure());
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
      var end_row = start_row + markup.childs.length;
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
    List.iter(markup.childs || [], function(child){
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
    List.iter(markup.childs || [], function(child){
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


var TokenStream = Class.extend({
  init : function(src){
    this.lexer = new Lexer(src);
    this.tokens = [];
    this.pos = 0;
    this.backupPos = 0;
    this.eof = false;
    this._doBuffer();
  },
  hasNext : function(){
    return !this.isEnd();
  },
  isEmpty : function(){
    return this.lexer.isEmpty();
  },
  isHead : function(){
    return this.pos === 0;
  },
  isEnd : function(){
    return (this.eof && this.pos >= this.tokens.length);
  },
  backup : function(){
    this.backupPos = this.pos;
  },
  rollback : function(){
    this.pos = this.backupPos;
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
    var start_pos = (typeof start_pos != "undefined")? start_p : this.pos;
    var text = null;
    this.revIterWhile(start_pos - 1, function(pos, token){
      if(Token.isText(token)){
	text = token;
	return false; // break
      }
      return true; // continue
    });
    return text;
  },
  findTextNext : function(start_p){
    var start_pos = (typeof start_p != "undefined")? start_p : this.pos;
    var text = null;
    this.iterWhile(start_pos + 1, function(pos, token){
      if(Token.isText(token)){
	text = token;
	return false; // break
      }
      return true; // continue
    });
    return text;
  },
  _doBuffer : function(){
    var self = this;
    var buff_len = Config.lexingBufferLen;
    var push = function(token){
      self.tokens.push(token);
    };
    for(var i = 0; i < buff_len; i++){
      var token = this.lexer.get();
      if(token === null){
	this.eof = true;
	break;
      }
      push(token);
    }
  }
});

var FilteredTagStream = TokenStream.extend({
  init : function(src, fn){
    var order = 0;
    this._super(src);
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
});

var DirectTokenStream = TokenStream.extend({
  init : function(tokens){
    this._super("");
    this.tokens = tokens;
  },
  isEmpty : function(){
    return this.tokens.length === 0;
  }
});

var PhrasingTokenStream = TokenStream.extend({
  init : function(src){
    this._super(src);
    this.tokens = this.getAllIf(function(token){
      if(Token.isText(token)){
	return true;
      }
      return (token.isInline() || token.isInlineBlock());
    });
  }
});

var DocumentTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return (tag.isSameAs("!doctype") || tag.isSameAs("html"));
    });
  }
});


var HtmlTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return (tag.isSameAs("head") || tag.isSameAs("body"));
    });
  }
});


var HeadTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return (tag.isSameAs("title") ||
	      tag.isSameAs("meta") ||
	      tag.isSameAs("link") ||
	      tag.isSameAs("style") ||
	      tag.isSameAs("script"));
    });
  }
});


var TableTagStream = FilteredTagStream.extend({
  init : function(markup){
    // TODO: caption not supported yet.
    this._super(markup.content, function(tag){
      return (tag.isSameAs("thead") ||
	      tag.isSameAs("tbody") ||
	      tag.isSameAs("tfoot") ||
	      tag.isSameAs("tr"));
    });
    this.markup = markup;
    this.markup.childs = this.tokens = this._parseTokens(this.tokens);
  },
  getPartition : function(box){
    var self = this;
    var partition = new TablePartition();
    var measure = box.getContentMeasure();
    List.iter(this.tokens, function(row_group){
      var rows = row_group.childs;
      List.iter(rows, function(row){
	var cols = row.childs;
	var cols_count = cols.length;
	if(partition.getPartition(cols_count) === null){
	  var parts = self._parsePartition(cols, box);
	  partition.add(new Partition(parts, measure));
	}
      });
    });
    return partition;
  },
  _setChildTokens : function(target, childs){
    target.childs = childs;
    var len = childs.length;
    if(len > 0){
      target.firstChild = childs[0];
      target.lastChild = childs[len - 1];
    }
    return target;
  },
  _parseTokens : function(tokens){
    var theads = [], tfoots = [], tbodies = [], self = this;
    var thead = null, tbody = null, tfoot = null;
    var ctx = {row:0, col:0, maxCol:0};
    List.iter(tokens, function(token){
      if(Token.isTag(token)){
	switch(token.name){
	case "tr":
	  token.row = ctx.row;
	  self._setChildTokens(token, self._parseCols(ctx, token.content));
	  ctx.row++;
	  tbodies.push(token);
	  break;
	case "thead":
	  thead = token;
	  theads = theads.concat(self._parseRows(ctx, token.content));
	  break;
	case "tbody":
	  tbody = token;
	  tbodies = tbodies.concat(self._parseRows(ctx, token.content));
	  break;
	case "tfoot":
	  tfoot = token;
	  tfoots = tfoots.concat(self._parseRows(ctx, token.content));
	  break;
	}
      }
    });

    var ret = [], nrow = 0;

    if(theads.length > 0){
      if(thead === null){
	thead = new Tag("<thead>");
      }
      this._setChildTokens(thead, theads);
      thead.row = nrow;
      nrow += thead.childs.length;
      ret.push(thead);
    }

    if(tbodies.length > 0){
      if(tbody === null){
	tbody = new Tag("<tbody>");
      }
      this._setChildTokens(tbody, tbodies);
      tbody.row = nrow;
      nrow += tbody.childs.length;
      ret.push(tbody);
    }

    if(tfoots.length > 0){
      if(tfoot === null){
	tfoot = new Tag("<tfoot>");
      }
      this._setChildTokens(tfoot, tfoots);
      tfoot.row = nrow;
      ret.push(tfoot);
    }

    this._setChildTokens(this.markup, ret);
    this.markup.maxCol = ctx.maxCol;
    this.markup.rowCount = ctx.row;

    return ret;
  },
  _parsePartition : function(childs, box){
    return List.map(childs, function(child){
      var size = child.getTagAttr("measure") || child.getTagAttr("width") || 0;
      if(size){
	return UnitSize.getBoxSize(size, box.fontSize, box.getContentMeasure());
      }
      return 0;
    });
  },
  _parseRows : function(ctx, content){
    var self = this;
    var rows = (new FilteredTagStream(content, function(tag){
      return tag.isSameAs("tr");
    })).getAll();

    return List.map(rows, function(row){
      row.row = ctx.row;
      row = self._setChildTokens(row, self._parseCols(ctx, row.content));
      ctx.row++;
      return row;
    });
  },
  _parseCols : function(ctx, content){
    var cols = (new FilteredTagStream(content, function(tag){
      return tag.isSameAs("td") || tag.isSameAs("th");
    })).getAll();

    List.iteri(cols, function(i, col){
      col.row = ctx.row;
      col.col = i;
    });

    if(cols.length > ctx.maxCol){
      ctx.maxCol = cols.length;
    }
    return cols;
  }
});



var ListTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return tag.isSameAs("li");
    });
  }
});

var DefListTagStream = FilteredTagStream.extend({
  init : function(src, font_size, max_size){
    this._super(src, function(tag){
      return tag.isSameAs("dt") || tag.isSameAs("dd");
    });
  }
});


var RubyStream = (function(){
  function RubyStream(content){
    this.rubies = this._parseAll(new TokenStream(content));
    this.pos = 0;
  }

  RubyStream.prototype = {
    backup : function(){
      this.backupPos = this.pos;
    },
    rollback : function(){
      if(typeof this.backupPos != "undefined"){
	this.pos = this.backupPos;
      }
    },
    hasNext : function(){
      return this.pos < this.rubies.length;
    },
    peek : function(){
      if(!this.hasNext()){
	return null;
      }
      return this.rubies[this.pos];
    },
    get : function(){
      var ruby = this.peek();
      ruby.index = this.pos;
      this.pos++;
      return ruby;
    },
    _parseAll : function(stream){
      var ret = [];
      while(stream.hasNext()){
	ret.push(this._parseRuby(stream));
      }
      return ret;
    },
    _parseRuby : function(stream){
      var rbs = [];
      var rt = null;
      while(true){
	var token = stream.get();
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
    }
  };

  return RubyStream;
})();

var DocumentGenerator = (function(){
  function DocumentGenerator(src){
    this.context = new DocumentContext();
    this.stream = new DocumentTagStream(src);
    this.generator = this._createGenerator();
    if(this.generator === null){
      throw "DocumentGenerator::invalid document";
    }
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
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    _parseDocType : function(tag){
    },
    _createGenerator : function(){
      var generator = null;
      while(true){
	var tag = this.stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "!doctype":
	  this._parseDocType(tag);
	  break;
	case "html":
	  generator = new HtmlGenerator(tag, this.context);
	  break;
	}
      }
      return generator;
    }
  };

  return DocumentGenerator;
})();


var HtmlGenerator = (function(){
  function HtmlGenerator(markup, context){
    this.markup = markup;
    this.context = context || new DocumentContext();
    this.stream = this._createStream();
    this.generator = this._getGenerator();
    if(this.generator === null){
      throw "HtmlGenerator::invalid html";
    }
  }

  HtmlGenerator.prototype = {
    yield : function(){
      return this.generator.yield();
    },
    hasNext : function(){
      return this.generator.hasNext();
    },
    getOutline : function(root_name){
      return this.generator.getOutline(root_name);
    },
    getOutlineHtml : function(root_name){
      return this.generator.getOutlineHtml(root_name);
    },
    _createStream : function(){
      return new HtmlTagStream(this.markup.content);
    },
    _getGenerator : function(){
      var generator = null;
      while(true){
	var tag = this.stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "head":
	  this._parseHead(tag.content);
	  break;
	case "body":
	  generator = new BodyPageGenerator(tag, this.context);
	  break;
	}
      }
      return generator;
    },
    _parseHead : function(content){
      var stream = new HeadTagStream(content);
      while(true){
	var tag = stream.get();
	if(tag === null){
	  break;
	}
	switch(tag.getName()){
	case "title":
	  this._parseTitle(tag);
	  break;
	case "meta":
	  this._parseMeta(tag);
	  break;
	case "link":
	  this._parseLink(tag);
	  break;
	case "style":
	  this._parseStyle(tag);
	  break;
	case "script":
	  this._parseScript(tag);
	  break;
	}
      }
    },
    _parseTitle : function(tag){
      this.context.setTitle(tag.content);
    },
    _parseMeta : function(tag){
      var context = this.context;
      tag.iterTagAttr(function(prop, value){
	context.setMeta(prop, value);
      });
    },
    _parseLink : function(tag){
    },
    _parseStyle : function(tag){
    },
    _parseScript : function(tag){
    }
  };

  return HtmlGenerator;
})();


var BlockGenerator = Class.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
  },
  hasNext : function(){
    return false;
  },
  backup : function(){
  },
  rollback : function(){
  },
  yield : function(parent){
    throw "BlockGenerator::yield not impletented";
  },
  getCurGenerator : function(){
    if(this.generator && this.generator.hasNext()){
      return this.generator;
    }
    return null;
  },
  // called when box is created, but no style is not loaded.
  _onReadyBox : function(box, parent){
  },
  // called when box is created, and std style is already loaded.
  _onCreateBox : function(box, parent){
  },
  _getBoxType : function(){
    return this.markup.getName();
  },
  _setEdge : function(box, edge){
    // this makes difference to basic css box model.
    // as paged media has fixed size boundary,
    // we reduce 'inside' of box to embody margin/padding/border,
    // while basic box model add them to 'outside' of box.
    box.setEdgeBySub(edge);
  },
  _isFirstChild : function(box, parent){
    // li-marker and li-body are always first childs of 'li', so ignore them.
    if(box._type == "li-marker" || box._type == "li-body"){
      return false;
    }
    return parent.isEmptyChild();
  },
  _setBoxStyle : function(box, parent){
    // if box is first child of parent,
    // copy style of <this.markup.name>:first-child.
    if(parent && this._isFirstChild(box, parent)){
      var pseudo_css_attr = this.markup.getPseudoCssAttr("first-child");
      this.markup.setCssAttrs(pseudo_css_attr);
    }
    // set font size
    var base_font_size = parent? parent.fontSize : Layout.fontSize;
    var font_size = this.markup.getCssAttr("font-size", "inherit");
    if(font_size != "inherit"){
      box.fontSize = UnitSize.getUnitSize(font_size, base_font_size);
    }

    // set font color
    var font_color = this.markup.getCssAttr("color", "inherit");
    if(font_color != "inherit"){
      box.color = new Color(font_color);
    }

    // set box edge
    var edge = this.markup.getBoxEdge(box.flow, box.fontSize, box.getContentMeasure());
    if(edge){
      this._setEdge(box, edge);
    }

    // set other variables
    var line_rate = this.markup.getCssAttr("line-rate");
    if(line_rate){
      box.lineRate = line_rate;
    }
    var text_align = this.markup.getCssAttr("text-align");
    if(text_align){
      box.textAlign = text_align;
    }
    var flow_name = this.markup.getCssAttr("flow");
    if(flow_name){
      switch(flow_name){
      case "flip":
	box.setFlow(parent.getFlipFlow());
	break;
      case "inherit":
	box.setFlow(parent.flow);
	break;
      default:
	box.setFlow(BoxFlows.getByName(flow_name));
	break;
      }
    }
    var logical_float = this.markup.getCssAttr("float", "none");
    if(logical_float != "none"){
      box.logicalFloat = logical_float;
    }
    var text_indent = this.markup.getCssAttr("text-indent", 0);
    if(text_indent){
      box.textIndent = box.fontSize;
    }
    var page_break_after = this.markup.getCssAttr("page-break-after", false);
    if(page_break_after){
      box.pageBreakAfter = true;
    }
    var letter_spacing = this.markup.getCssAttr("letter-spacing");
    if(letter_spacing){
      box.letterSpacing = UnitSize.getUnitSize(letter_spacing, base_font_size);
    }

    // read other optional styles not affect layouting issue.
    var markup = this.markup;
    List.iter([
      "background",
      "background-color",
      "background-image",
      "background-repeat",
      "background-position",
      "cursor",
      "font",
      "font-family",
      "font-style",
      "font-weight",
      "opacity",
      "z-index"
    ], function(prop){
      var value = markup.getCssAttr(prop);
      if(value){
	box.setCss(prop, value);
      }
    });

    // copy classes from markup to box object.
    List.iter(this.markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _createBox : function(size, parent){
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    this._onReadyBox(box, parent);
    this._setBoxStyle(box, parent);
    this._onCreateBox(box, parent);
    return box;
  }
});


var StaticBlockGenerator = BlockGenerator.extend({
  yield : function(parent, size){
    var box = this._createBox(size, parent);
    if(this.markup.isPush()){
      box.backward = true;
    }
    if(this.markup.isPull()){
      box.forward = true;
    }
    // get rest size without edge of box.
    var rest_size = parent.getRestSize();
    rest_size.width -= box.getEdgeWidth();
    rest_size.height -= box.getEdgeHeight();
    
    // even if edge can't be included, retry.
    if(!rest_size.isValid()){
      return Exceptions.RETRY;
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
    return Exceptions.RETRY;
  },
  _setEdge : function(box, edge){
    box.setEdge(edge); // set edge as normal box model.
    return box;
  }
});


var InlineBoxGenerator = StaticBlockGenerator.extend({
  _getBoxType : function(){
    return "ibox";
  },
  _getBoxContent : function(){
    return this.markup.isChildContentTag()? this.markup.getWrapSrc() : this.markup.getSrc();
  },
  _onCreateBox : function(box, parent){
    box.content = this._getBoxContent();
    box.css.overflow = "hidden";
  }
});

var ImageGenerator = StaticBlockGenerator.extend({
  _onCreateBox : function(box, parent){
    box.src = this.markup.getTagAttr("src");
  }
});

var HorizontalRuleGenerator = StaticBlockGenerator.extend({
  yield : function(parent){
    var measure = parent.getContentMeasure();
    var size = parent.flow.getBoxSize(measure, 1);
    return this._super(parent, size);
  }
});

var RubyGenerator = (function(){
  function RubyGenerator(markup){
    this.markup = markup;
    this.stream = new RubyStream(markup.content);
  }

  RubyGenerator.prototype = {
    backup : function(){
      this.stream.backup();
    },
    rollback : function(){
      this.stream.rollback();
    },
    hasNext : function(){
      return this.stream.hasNext();
    },
    // ctx : LineContext
    yield : function(ctx){
      this.backup();
      var ruby = this.stream.get();
      if(ruby === null){
	return null;
      }
      ruby.setStartPos(ctx.curMeasure);

      // avoid overwriting metrics.
      if(!ruby.hasMetrics()){
	ruby.setMetrics(ctx.getParentFlow(), this.markup.fontSize, this.markup.letterSpacing);
      }
      return ruby;
    }
  };

  return RubyGenerator;
})();

var LineContext = (function(){
  function LineContext(parent, stream, context){
    this.parent = parent;
    this.stream = stream;
    this.context = context;
    this.isRubyLine = parent._type === "ruby-line";
    this.lineStartPos = this.stream.getPos();
    this.lineRate = parent.lineRate;
    this.letterSpacing = parent.letterSpacing || 0;
    this.textIndent = stream.isHead()? (parent.textIndent || 0) : 0;
    this.maxFontSize = parent.fontSize;
    this.maxExtent = 0;
    this.maxMeasure = parent.getContentMeasure() - this.textIndent;
    this.curMeasure = 0;
    this.restMeasure = this.maxMeasure;
    this.restExtent = parent.getRestContentExtent();
    this.lineMeasure = parent.getContentMeasure() - this.textIndent;
    this.rubyLineRate = Math.max(0, this.lineRate - 1);
    this.rubyLineExtent = this.isRubyLine? 0 : Math.floor(parent.fontSize * this.rubyLineRate);
    this.bodyTokens = [];
    this.rubyTokens = [];
    this.emphaChars = [];
    this.lineBreak = false;
    this.charCount = 0;
    this.lastToken = null;
    this.prevText = null;
    this.lastText = null;
  }

  LineContext.prototype = {
    canContainBasicLine : function(){
      return this.restExtent >= Math.floor(this.parent.fontSize * this.lineRate);
    },
    canContainExtent : function(extent){
      return this.restExtent >= extent;
    },
    canContainAdvance : function(element, advance){
      if(element instanceof Box || !this.parent.canJustify()){
	return this.restMeasure >= advance;
      }
      if(element instanceof Word || element instanceof Tcy){
	return this.restMeasure >= advance;
      }
      // justify target need space for tail fix.
      return this.restMeasure - this.parent.fontSize >= advance;
    },
    canContain : function(element, advance, extent){
      return this.canContainAdvance(element, advance) && this.canContainExtent(extent);
    },
    isPreLine : function(){
      return this.parent._type === "pre";
    },
    isEmptySpace : function(){
      return this.restMeasure <= 0;
    },
    isBoldEnable : function(){
      return this.context.isBoldEnable();
    },
    isEmptyText : function(){
      return this.bodyTokens.length === 0;
    },
    isInlineTagEmpty : function(){
      return this.context.getInlineTagDepth() <= 0;
    },
    isOverWithoutLineBreak : function(){
      return !this.lineBreak && (this.bodyTokens.length > 0);
    },
    isLineStart : function(){
      return this.stream.pos == this.lineStartPos;
    },
    isFirstLine : function(){
      return this.lineStartPos === 0;
    },
    inheritParentTag : function(tag){
      var parent_tag = this.context.getCurBlockTag();
      if(parent_tag){
	tag.inherit(parent_tag);
      }
    },
    pushTag : function(tag){
      this.context.pushInlineTag(tag, this.parent);
    },
    pushBackToken : function(){
      this.stream.prev();
    },
    popFirstLine : function(){
      var tag = this.context.popInlineTagByName(":first-line");
      if(tag){
	this.addElement(tag.getCloseTag(), {
	  advance:0,
	  extent:0,
	  fontSize:0
	});
      }
    },
    popTagByName : function(name){
      this.context.popInlineTagByName(name);
    },
    findFirstText : function(){
      return this.stream.findTextNext(this.lineStartPos);
    },
    skipToken : function(){
      this.stream.next();
    },
    getNextToken : function(){
      var is_line_start = this.isLineStart();
      var token = this.stream.get();

      // skip head half space if 1 and 2.
      // 1. first token of line is a half space.
      // 2. next text token is a word.
      if(token && is_line_start && Token.isChar(token) && token.isHalfSpaceChar()){
	var next = this.findFirstText();
	if(next && Token.isWord(next)){
	  token = this.stream.get();
	}
      }
      this.lastToken = token;

      if(token && Token.isText(token)){
	this._setKerning(token);
      }

      return token;
    },
    getTextTokenLength : function(){
      return this.bodyTokens.length;
    },
    getInlineFontSize : function(){
      return this.context.getInlineFontSize(this.parent);
    },
    getRestMeasure : function(){
      return this.parent.getContentMeasure() - this.curMeasure;
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    getParentFlow : function(){
      return this.parent.flow;
    },
    addStyle : function(tag){
      this.context.addStyle(tag);
    },
    addElement : function(element, opt){
      if(opt.fontSize > this.maxFontSize){
	this._setMaxFontSize(opt.fontSize);
      }
      if(opt.extent > this.maxExtent){
	this._setMaxExtent(opt.extent);
      }
      if(element instanceof Ruby){
	this._addRuby(element);
      } else if(Token.isTag(element)){
	this._addTag(element);
      } else if (element._type === "inline-block"){
	this._addInlineBlock(element);
      } else {
	this._addText(element);
      }
      if(opt.advance > 0){
	this._addAdvance(opt.advance);
      }
    },
    setAnchor : function(anchor_name){
      this.context.setAnchor(anchor_name);
    },
    setLineBreak : function(){
      this.lastText = null;
      this.lineBreak = true;
    },
    createInlineRoot : function(){
      return this.context.createInlineRoot();
    },
    createLine : function(){
      // if first-line, deactivate first line tag.
      if(this.isFirstLine()){
	this.popFirstLine();
      }
      // if overflow measure without line-break, try to justify.
      if(this.isOverWithoutLineBreak() && this.parent.canJustify()){
	this.justify(this.lastToken);
      }
      var text_line = this._createTextLine();
      if(this.isRubyLine || this.lineRate <= 1.0){
	return text_line;
      }
      var ruby_line = this._createRubyLine(text_line);
      return this._createLineBox(text_line, ruby_line);
    },
    justify : function(last_token){
      var head_token = last_token;
      var tail_token = this.stream.findTextPrev();
      var backup_pos = this.stream.getPos();
      
      // head text of next line meets head-NG.
      if(head_token && Token.isChar(head_token) && head_token.isHeadNg()){
	this.bodyTokens = this._justifyHead(head_token);
	if(this.stream.getPos() != backup_pos){ // some text is moved by head-NG.
	  tail_token = this.stream.findTextPrev(); // search tail_token from new stream position pointing to new head pos.
	  // if new head is single br, this must be included in current line, so skip it.
	  this.stream.skipIf(function(token){
	    return token && Token.isTag(token) && token.getName() === "br";
	  });
	}
      }
      // tail text of this line meets tail-NG.
      if(tail_token && Token.isChar(tail_token) && tail_token.isTailNg()){
	this.bodyTokens = this._justifyTail(tail_token);
      }
    },
    _addAdvance : function(advance){
      this.curMeasure += advance;
      this.restMeasure -= advance;
    },
    _setMaxExtent : function(extent){
      this.maxExtent = extent;
    },
    _setMaxFontSize : function(max_font_size){
      this.maxFontSize = max_font_size;
      if(!this.isRubyLine){
	this.rubyLineExtent = Math.floor(max_font_size * this.rubyLineRate);
      }
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
    _addRuby : function(element){
      this.bodyTokens = this.bodyTokens.concat(element.getRbs());
      this.rubyTokens.push(element);
    },
    _addTag : function(element){
      this.bodyTokens.push(element);
    },
    _addInlineBlock : function(element){
      this.bodyTokens.push(element);
    },
    _addEmpha : function(empha, element){
      var mark = empha.getCssAttr("empha-mark") || "&#x2022;";
      this.emphaChars.push(new EmphaChar({
	data:mark,
	parent:element,
	startPos:this.curMeasure
      }));
    },
    _addText : function(element){
      // text element
      this.bodyTokens.push(element);

      // count up char count of line
      this.charCount += element.getCharCount();

      // check empha tag is open.
      var empha = this.context.findInlineTag(function(tag){ return tag.isEmphaTag(); });

      // if emphasis tag is open, add emphasis-char to ruby line.
      if(empha){
	this._addEmpha(empha, element);
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
	return this.bodyTokens;
      }
      // if one head NG, push it into current line.
      if(count === 1){
	this.bodyTokens.push(head_token);
	this.stream.setPos(head_token.pos + 1);
	return this.bodyTokens;
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
	return this.bodyTokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = head_token.pos;
      while(ptr > normal_pos){
	this.bodyTokens.pop();
	ptr--;
      }
      // set stream position at the normal pos.
      this.stream.setPos(normal_pos);
      return this.bodyTokens;
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
	return this.bodyTokens;
      }
      // if one tail NG, pop it(tail token is displayed in next line).
      if(count === 1){
	this.bodyTokens.pop();
	this.stream.setPos(tail_token.pos);
	return this.bodyTokens;
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
	return this.bodyTokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = tail_token.pos;
      while(ptr > normal_pos){
	this.bodyTokens.pop();
	ptr--;
      }
      // set stream postion at the 'next' of normal pos.
      this.stream.setPos(normal_pos + 1);
      return this.bodyTokens;
    },
    _createTextLine : function(){
      var size = this.parent.flow.getBoxSize(this.lineMeasure, this.maxExtent);
      return new TextLine({
	type:"text-line",
	parent:this.parent,
	size:size,
	charCount:this.charCount,
	fontSize:this.parent.fontSize,
	color:this.parent.color,
	tokens:this.bodyTokens,
	textMeasure:this.curMeasure,
	textIndent:this.textIndent,
	letterSpacing:this.letterSpacing,
	lineRate:1.0
      });
    },
    _createRubyLine : function(text_line){
      var size = this.parent.flow.getBoxSize(this.lineMeasure, this.rubyLineExtent);
      return new TextLine({
	type:"ruby-line",
	parent:this.parent,
	size:size,
	charCount:0,
	fontSize:this.parent.fontSize,
	color:this.parent.color,
	tokens:this.rubyTokens,
	emphaChars:this.emphaChars,
	textMeasure:this.curMeasure,
	textIndent:this.textIndent,
	letterSpacing:this.letterSpacing,
	lineRate:this.rubyLineRate,
	bodyLine:text_line
      });
    },
    _createLineBox : function(text_line, ruby_line){
      return new LineBox({
	extent:(this.maxExtent + this.rubyLineExtent),
	parent:this.parent,
	rubyLine:ruby_line,
	textLine:text_line
      });
    }
  };

  return LineContext;
})();


// TODO:
// although it is quite rare situation, ruby disappears when
// 1. line overflow by tail ruby and
// 2. it is placed at the head of next line but
// 3. parent page can't contain the line because of block level overflow.
// then after rollback and 2nd-yielding by parent generator,
// ruby disappears because stream already steps to the next pos of ruby.
// any good idea to solve this problem?
var InlineGenerator = (function(){
  function InlineGenerator(markup, stream, context){
    this.markup = markup;
    this.stream = stream;
    this.context = context;
    this._hasNext = this.stream.hasNext();
  }

  // shortcut exception code
  var BUFFER_END = Exceptions.BUFFER_END;
  var SKIP = Exceptions.SKIP;
  var LINE_BREAK = Exceptions.LINE_BREAK;
  var RETRY = Exceptions.RETRY;
  var IGNORE = Exceptions.IGNORE;
  var BREAK = Exceptions.BREAK;

  InlineGenerator.prototype = {
    hasNext : function(){
      if(!this._hasNext){
	return false;
      }
      if(this.generator && this.generator.hasNext()){
	return true;
      }
      return this.stream.hasNext();
    },
    backup : function(debug){
      this.stream.backup();
    },
    // caution! : this rollback function is to be ALWAYS called from parent generator.
    // so do not call this from this generator.
    rollback : function(){
      this.stream.rollback();
      this.generator = null;
    },
    yield : function(parent){
      var ctx = new LineContext(parent, this.stream, this.context);

      // even if extent for basic line is not left,
      // just break and let parent generator break page.
      if(!ctx.canContainBasicLine()){
	return BREAK;
      }

      // backup inline head position.
      this.backup();

      while(true){
	var element = this._yieldElement(ctx);

	if(element == BUFFER_END){
	  ctx.setLineBreak();
	  break;
	} else if(element == SKIP){
	  return IGNORE;
	} else if(element == LINE_BREAK){
	  ctx.setLineBreak();
	  break;
	} else if(element == RETRY){
	  ctx.setLineBreak();
	  break;
	} else if(element == IGNORE){
	  continue;
	}
	var advance = this._getAdvance(ctx, element); // size of inline flow.
	var extent = this._getExtent(ctx, element); // size of block flow.
	var font_size = this._getFontSize(ctx, element); // font size of element.

	// if overflow inline max, line break.
	if(!ctx.canContain(element, advance, extent)){
	  if(this.generator){
	    this.generator.rollback();
	  } else {
	    ctx.pushBackToken();
	  }
	  break;
	}
	ctx.addElement(element, {
	  advance:advance,
	  extent:extent,
	  fontSize:font_size
	});

	// if devided word, line break and parse same token again.
	if(element instanceof Word && element.isDevided()){
	  ctx.pushBackToken();
	  break;
	}
      }
      return ctx.createLine();
    },
    _getExtent : function(ctx, element){
      if(Token.isText(element)){
	return element.fontSize;
      }
      if(Token.isTag(element)){
	if(element.edge){
	  var font_size = ctx.getInlineFontSize();
	  var edge_size = element.edge.getExtentSize(ctx.getParentFlow());
	  return font_size + edge_size;
	}
	return 0;
      }
      if(element instanceof Ruby){
	return element.getExtent();
      }
      if(element instanceof Box){
	return element.getBoxExtent(ctx.getParentFlow());
      }
      return 0;
    },
    _getFontSize : function(ctx, element){
      if(Token.isText(element)){
	return element.fontSize;
      }
      if(element instanceof Ruby){
	return element.getFontSize();
      }
      return 0;
    },
    _getAdvance : function(ctx, element){
      if(Token.isText(element)){
	return element.getAdvance(ctx.getParentFlow(), ctx.letterSpacing);
      }
      if(Token.isTag(element)){
	if(element.edge){
	  return element.edge.getMeasureSize(ctx.getParentFlow());
	}
	return 0;
      }
      if(element instanceof Ruby){
	return element.getAdvance(ctx.getParentFlow());
      }
      return element.getBoxMeasure(ctx.getParentFlow());
    },
    _yieldElement : function(ctx){
      if(this.generator && this.generator.hasNext()){
	return this.generator.yield(ctx);
      }
      this.generator = null;
      var token = ctx.getNextToken();
      return this._yieldToken(ctx, token);
    },
    _yieldToken : function(ctx, token){
      if(token === null){
	return BUFFER_END;
      }
      // CRLF
      if(Token.isChar(token) && token.isNewLineChar()){

	// if pre, treat CRLF as line break
	if(ctx.isPreLine()){
	  return LINE_BREAK;
	}
	// others, just ignore
	return IGNORE;
      }
      if(Token.isText(token)){
	return this._yieldText(ctx, token);
      }
      if(Token.isTag(token) && token.getName() === "br"){
	return LINE_BREAK;
      }
      // if pseudo-element tag,
      // copy style of <this.markup.name>:<pseudo-name> dynamically.
      if(this.markup && token.isPseudoElementTag()){
	var pseudo_name = token.getPseudoElementName();
	var pseudo_css_attr = this.markup.getPseudoCssAttr(pseudo_name);
	for(var prop in pseudo_css_attr){
	  if(prop !== "content"){
	    token.setCssAttr(prop, pseudo_css_attr[prop]);
	  }
	}
      }
      // if block element, break line and force terminate generator
      if(token.isBlock()){
	ctx.pushBackToken(); // push back this token(this block is handled by parent generator).
	this._hasNext = false; // force terminate
	return ctx.isEmptyText()? SKIP : LINE_BREAK;
      }
      // token is static size tag
      if(token.hasStaticSize()){
	return this._yieldStaticElement(ctx, token);
      }
      // token is inline-block tag
      if(token.isInlineBlock()){
	this.generator = new InlineBlockGenerator(token, ctx.createInlineRoot());
	return this.generator.yield(ctx);
      }
      // token is other inline tag
      return this._yieldInlineTag(ctx, token);
    },
    _yieldStaticElement : function(ctx, tag){
      ctx.inheritParentTag(tag);
      var element = PageGenerator.prototype._yieldStaticElement.call(this, ctx.parent, tag, this.context);
      if(element instanceof Box){
	element.display = "inline-block";
      }
      return element;
    },
    _yieldText : function(ctx, text){
      if(!text.hasMetrics()){
	text.setMetrics(ctx.getParentFlow(), ctx.getInlineFontSize(), ctx.isBoldEnable());
      }
      switch(text._type){
      case "char":
      case "tcy":
	return text;
      case "word":
	return this._yieldWord(ctx, text);
      }
    },
    _yieldInlineTag : function(ctx, tag){
      switch(tag.getName()){
      case "script":
	return IGNORE;

      case "style":
	ctx.addStyle(tag);
	return IGNORE;

      case "ruby":
	// assert metrics only once to avoid dup update by rollback
	if(typeof tag.fontSize === "undefined"){
	  tag.fontSize = ctx.getInlineFontSize();
	  tag.letterSpacing = ctx.letterSpacing;
	}
	this.generator = new RubyGenerator(tag);
	return this.generator.yield(ctx);

      case "a":
	var anchor_name = tag.getTagAttr("name");
	if(anchor_name){
	  ctx.setAnchor(anchor_name);
	}
	break;

      default:
	break;
      }
      // single tag does not update tag stack of inline, so just return it.
      // or if tag is already parsed, just return too.
      if(tag.isSingleTag() || tag.parsed){
	ctx.inheritParentTag(tag);
	return tag;
      }
      // if inline level edge is defined,
      // get edge and set it to markup data because inline level does not create box.
      // this edge(in markup data) is evaluated at InlineEvaluator::evalTagCss.
      var edge = tag.getBoxEdge(ctx.getParentFlow(), ctx.getInlineFontSize(), ctx.getMaxMeasure());
      if(edge){
	tag.edge = edge;
      }
      if(tag.isOpen()){
	ctx.pushTag(tag);
      } else {
	ctx.popTagByName(tag.getOpenTagName());
      }
      // to avoid duplicate parsing by parent rollback,
      // we set parsed flag to this tag object.
      tag.parsed = true;
      return tag;
    },
    _yieldWord : function(ctx, word){
      var advance = word.getAdvance(ctx.getParentFlow(), ctx.letterSpacing);

      // if advance of this word is less than ctx.maxMeasure, just return.
      if(advance <= ctx.maxMeasure){
	word.setDevided(false);
	return word;
      }
      // if advance is lager than max_measure,
      // we must cut this word into some parts.
      var font_size = ctx.getInlineFontSize();
      var is_bold = ctx.isBoldEnable();
      var flow = ctx.getParentFlow();
      var part = word.cutMeasure(ctx.maxMeasure); // get sliced word
      part.setMetrics(flow, font_size, is_bold); // metrics for first half
      word.setMetrics(flow, font_size, is_bold); // metrics for second half
      return part;
    }
  };

  return InlineGenerator;
})();


var PageGenerator = BlockGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.generator = null;
    this.rollbackCount = 0;
    this.stream = this._createStream();
    this.localPageNo = 0;
    this.pageBreakBefore = this._isPageBreakBefore();
  },
  hasNext : function(){
    if(this.generator && this.generator.hasNext()){
      return true;
    }
    return this.stream.hasNext();
  },
  backup : function(){
    if(this.generator){
      this.generator.backup();
    }
  },
  rollback : function(){
    this.rollbackCount++;
    if(this.rollbackCount > Config.maxRollbackCount){
      throw "too many rollbacks";
    }
    if(this.generator){
      this.generator.rollback();
    }
  },
  // if size is not defined, rest size of parent is used.
  // if parent is null, root page is generated.
  yield : function(parent, size){
    if(this.stream.isEmpty()){
      return Exceptions.SKIP;
    }
    // let this generator yield PAGE_BREAK exception(only once).
    if(this.pageBreakBefore){
      this.pageBreakBefore = false;
      return Exceptions.PAGE_BREAK;
    }
    this.context.pushBlock(this.markup);

    var page_box, page_size;
    page_size = size || (parent? parent.getRestSize() : null);
    page_box = this._createBox(page_size, parent);
    var ret = this._yieldPageTo(page_box);
    this.context.popBlock();
    return ret;
  },
  // fill page with child page elements.
  _yieldPageTo : function(page){
    var cur_extent = 0;
    var max_extent = page.getContentExtent();
    var page_flow = page.flow;

    while(true){
      this.backup();
      var element = this._yieldPageElement(page);
      if(element == Exceptions.PAGE_BREAK){
	break;
      } else if(element == Exceptions.BUFFER_END){
	break;
      } else if(element == Exceptions.SKIP){
	break;
      } else if(element == Exceptions.RETRY){
	this.rollback();
	break;
      } else if(element == Exceptions.BREAK){
	break;
      } else if(element == Exceptions.IGNORE){
	continue;
      }
      var extent = element.getBoxExtent(page_flow);
      cur_extent += extent;
      if(cur_extent > max_extent || this._isEmptyElement(page_flow, element)){
	this.rollback();
	break;
      }
      page.addChild(element);

      if(cur_extent == max_extent){
	break;
      }
      if(element.pageBreakAfter){
	page.pageBreakAfter = true; // propagate pageBreakAfter to parent box
	break;
      }
    }
    if(this.localPageNo > 0){
      page.clearBorderBefore();
    }
    if(!this.hasNext()){
      this._onLastPage(page);
    } else {
      page.clearBorderAfter();
    }
    this.rollbackCount = 0;
    this._onCompletePage(page);

    // if content is not empty, increment localPageNo.
    if(cur_extent > 0){
      this.localPageNo++;
    }
    return page;
  },
  _isPageBreakBefore : function(){
    return this.markup.getCssAttr("page-break-before", "") === "always";
  },
  _isEmptyElement : function(flow, element){
    return (element instanceof Box) && (element.getContentExtent(flow) <= 0);
  },
  _createStream : function(){
    var source = this._createSource(this.markup.content);
    return new TokenStream(source);
  },
  // caution:
  // this is not first preprocess.
  // first conversion is in PageStream::_createSource, which discards comment, invalid tags .. etc.
  // so this time we convert other things according to this generator locally.
  _createSource : function(text){
    return text
      .replace(/^[ \n]+/, "") // shorten head space
      .replace(/\s+$/, "") // discard tail space
      .replace(/\r/g, ""); // discard CR
  },
  _onLastPage : function(page){
  },
  // called when page box is fully filled by blocks.
  _onCompletePage : function(page){
  },
  _yieldPageElement : function(parent){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(parent);
    }
    var token = this.stream.get();
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    // in block level, new-line character makes no sense, just ignored.
    if(Token.isChar(token) && token.isNewLineChar()){
      return Exceptions.IGNORE;
    }
    if(Token.isTag(token) && token.isPageBreakTag()){
      return Exceptions.PAGE_BREAK;
    }
    if(Token.isInline(token)){
      // this is not block level element, so we push back this token,
      // and delegate this stream to InlineGenerator from the head of this inline element.
      this.stream.prev();
      this.generator = new InlineGenerator(this.markup, this.stream, this.context);
      return this.generator.yield(parent);
    }
    return this._yieldBlockElement(parent, token);
  },
  _yieldBlockElement : function(parent, tag){
    if(tag.hasStaticSize()){
      return this._yieldStaticTag(parent, tag);
    }

    // if different flow is defined in this block tag,
    // yield it as single inline page with rest size of current parent.
    if(tag.hasFlow() && tag.getCssAttr("flow") != parent.getFlowName()){
      var inline_size = parent.getRestSize();
      var generator = new InlinePageGenerator(tag, this.context.createInlineRoot());
      return generator.yield(parent, inline_size);
    }
    this.generator = this._createChildPageGenerator(parent, tag);
    return this.generator.yield(parent);
  },
  _yieldStaticTag : function(parent, tag){
    var box = this._yieldStaticElement(parent, tag, this.context);
    if(!(box instanceof Box)){
      return box; // exception
    }

    // pushed box is treated as a single block element.
    if(tag.isPush()){
      return box;
    }

    // floated box is treated as a single block element(with rest spaces filled by other elements).
    if(box instanceof Box && box.logicalFloat){
      return this._yieldFloatedBlock(parent, box, tag);
    }

    return box; // return as single block.
  },
  // this function is also called from InlineGenerator via 'call' to yield an inline block element.
  // so to give a clear scope, we accept 'context' as last argument,
  // although it is same as 'this.context' in this generator.
  _yieldStaticElement : function(parent, tag, context){
    var generator;
    var static_size = tag.getStaticSize(parent.fontSize || Layout.fontSize, parent.getContentMeasure());
    if(tag.getName() === "img"){
      generator = new ImageGenerator(tag, context);
    } else if(tag.hasFlow()){
      // if original flow defined, yield as inline page
      generator = new InlinePageGenerator(tag, context.createInlineRoot());
    } else {
      // if static size is simply defined, treat as just an embed html with static size.
      generator = new InlineBoxGenerator(tag, context);
    }
    return generator.yield(parent, static_size);
  },
  _yieldFloatedBlock : function(parent, aligned_box, tag){
    var generator = new FloatedBlockGenerator(this.stream, this.context, aligned_box);
    var block = generator.yield(parent);
    this.generator = generator.getCurGenerator(); // inherit generator of aligned area
    return block;
  },
  _createChildPageGenerator : function(parent, tag){
    switch(tag.getName()){
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
      return this._getHeaderLineGenerator(parent, tag);
    case "section": case "article": case "nav": case "aside":
      return this._getSectionContentGenerator(parent, tag);
    case "details": case "blockquote": case "figure": case "fieldset":
      return this._getSectionRootGenerator(parent, tag);
    case "table":
      return this._getTableGenerator(parent, tag);
    case "tbody": case "thead": case "tfoot":
      return this._getTableRowGroupGenerator(parent, tag);
    case "tr":
      return this._getTableRowGenerator(parent, tag);
    case "dl":
      return this._getDefListGenerator(parent, tag);
    case "ul": case "ol":
      return this._getListGenerator(parent, tag);
    case "li":
      return this._getListItemGenerator(parent, tag);
    case "hr":
      return this._getHorizontalRuleGenerator(parent, tag);
    default:
      return new ChildPageGenerator(tag, this.context);
    }
  },
  _getSectionContentGenerator : function(parent, tag){
    return new SectionContentGenerator(tag, this.context);
  },
  _getSectionRootGenerator : function(parent, tag){
    return new SectionRootGenerator(tag, this.context);
  },
  _getHorizontalRuleGenerator : function(parent, tag){
    return new HorizontalRuleGenerator(tag, this.context);
  },
  _getHeaderLineGenerator : function(parent, tag){
    return new HeaderGenerator(tag, this.context);
  },
  _getListGenerator : function(parent, tag){
    return new ListGenerator(tag, this.context);
  },
  _getListItemGenerator : function(parent, tag){
    var list_style = parent.listStyle || null;
    if(list_style === null){
      return new ChildPageGenerator(tag, this.context);
    }
    if(list_style.isInside()){
      return new InsideListItemGenerator(tag, parent, this.context);
    }
    return new OutsideListItemGenerator(tag, parent, this.context);
  },
  _getDefListGenerator : function(parent, tag){
    return new DefListGenerator(tag, this.context);
  },
  _getTableGenerator : function(parent, tag){
    return new TableGenerator(tag, this.context);
  },
  _getTableRowGroupGenerator : function(parent, tag){
    return new TableRowGroupGenerator(tag, this.context);
  },
  _getTableRowGenerator : function(parent, tag){
    return new TableRowGenerator(tag, parent, this.context.createInlineRoot());
  }
});

var InlineBlockGenerator = PageGenerator.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
    this.stream = this._createStream();
  },
  _getBoxType : function(){
    return "inline-block";
  },
  // ctx : LineContext
  yield : function(ctx){
    var rest_measure = ctx.restMeasure;
    var rest_extent = ctx.restExtent;
    var parent_flow = ctx.getParentFlow();
    var size = parent_flow.getBoxSize(rest_measure, rest_extent);
    var box = this._createBox(size, ctx.parent);
    box = this._yieldPageTo(box);
    if(typeof box === "number"){
      return box; // exception
    }
    box.shortenBox();
    if(!box.isTextVertical()){
      box.display = "inline-block";
    }
    return box;
  }
});

var ChildPageGenerator = PageGenerator.extend({
  // resize page to sum of total child size.
  _onCompletePage : function(page){
    page.shortenExtent(page.getParentFlow());
  }
});

var SectionContentGenerator = ChildPageGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.context.logStartSection(markup);
  },
  _onLastPage : function(page){
    this.context.logEndSection(this.markup);
  }
});

var SectionRootGenerator = ChildPageGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.context.startSectionRoot(markup);
  },
  hasOutline : function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    return buffer.isEmpty() === false;
  },
  getOutlineBuffer : function(root_name){
    var name = root_name || this.markup.getName();
    return this.context.getOutlineBuffer(name);
  },
  getOutlineTree : function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    var tree = (new OutlineParser(buffer)).getTree();
    return tree;
  },
  getAnchors : function(){
    return this.context.getAnchors();
  },
  getAnchorPageNo : function(name){
    return this.context.getAnchorPageNo(name);
  },
  setAnchor : function(name, page_no){
    this.context.setAnchor(name, page_no);
  },
  _onLastPage : function(page){
    this.context.endSectionRoot(this.markup);
  }
});

var HeaderGenerator = ChildPageGenerator.extend({
  _onCompletePage : function(page){
    this._super(page);
    page.id = Css.addNehanHeaderPrefix(this.context.logSectionHeader(this.markup));
  },
  _onCreateBox : function(box, parent){
    box.addClass("nehan-header");
  }
});

var BodyPageGenerator = SectionRootGenerator.extend({
  init : function(data, ctx){
    var context = ctx || new DocumentContext();
    var markup = data;
    if(typeof data === "string"){
      markup = new Tag("<body>", data);
    }
    this._super(markup, context);
  },
  // create root page, __size and __parent are ignored.
  _createBox : function(__size, __parent){
    var box = Layout.createStdBox("body");
    this._setBoxStyle(box);
    box.percent = this.stream.getSeekPercent();
    box.seekPos = this.stream.getSeekPos();
    box.pageNo = this.context.getPageNo();
    box.charPos = this.context.getCharPos();

    // caution:
    // box.lazy is a flag to see whether this box can be evaluated later.
    // when lazy is enabled, we can evaluate the box at any time, it always yields same html.
    // but this lazy flag at this time is not confirmed, it's temporary.
    // this flag is confirmed when _onCompletePage.
    // if context is 'also' empty when page is completed, lazy flag is confirmed.
    box.lazy = this.context.isEmptyMarkupContext();
    box.css["font-size"] = Layout.fontSize + "px";
    return box;
  },
  _onCompletePage : function(page){
    page.styles = this.context.getPageStyles(page.pageNo);

    // lazy is confirmed when
    // 1. inline level of context is empty when _createBox.
    // 2. inline level of context is 'also' empty when _onCompletePage.
    // in short, if both head and tail are context free, lazy evaluation is enabled.
    page.lazy = page.lazy && this.context.isEmptyMarkupContext();

    // step page no and character count inside this page
    this.context.stepPageNo();
    this.context.addCharPos(page.getCharCount());
  }
});

var FloatedBlockGenerator = PageGenerator.extend({
  init : function(stream, context, floated_box){
    this.context = context;
    this.stream = stream;
    this.floatedBox = floated_box;
  },
  yield: function(parent){
    var backupPos2 = this.stream.backupPos; // backup the 'backup pos'
    var wrap_box = this._getFloatedWrapBox(parent, this.floatedBox);
    var rest_box = this._getFloatedRestBox(parent, wrap_box, this.floatedBox);
    this._yieldPageTo(rest_box);
    if(this.floatedBox.logicalFloat === "start"){
      wrap_box.addChild(this.floatedBox);
      wrap_box.addChild(rest_box);
    } else {
      wrap_box.addChild(rest_box);
      wrap_box.addChild(this.floatedBox);
    }
    this.stream.backupPos = backupPos2; // restore backup pos
    return wrap_box;
  },
  _getFloatedRestBox : function(parent, wrap_box, floated_box){
    var rest_measure = parent.getContentMeasure() - floated_box.getBoxMeasure(parent.flow);
    var rest_extent = floated_box.getBoxExtent(parent.flow);
    var rest_size = parent.flow.getBoxSize(rest_measure, rest_extent);
    var rest_box = Layout.createBox(rest_size, wrap_box, "box");
    rest_box.setFlow(parent.flow);
    return rest_box;
  },
  _getFloatedWrapBox : function(parent, floated_box){
    var wrap_measure = parent.getContentMeasure();
    var wrap_extent = floated_box.getBoxExtent(parent.flow);
    var wrap_box_size = parent.flow.getBoxSize(wrap_measure, wrap_extent);
    var wrap_box = Layout.createBox(wrap_box_size, parent, "box");
    var wrap_flow = parent.getFloatedWrapFlow();
    wrap_box.setParent(parent, false);
    wrap_box.setFlow(wrap_flow);
    floated_box.setParent(wrap_box, true);
    return wrap_box;
  }
});

// InlinePageGenerator yield the first page only,
// because size of first page can be defined, but continuous pages are not.
var InlinePageGenerator = PageGenerator.extend({
  hasNext : function(){
    return false;
  },
  yield : function(parent, size){
    var wrap = Layout.createBox(size, parent, "div");
    var page = this._super(wrap); // yield page to wrap.
    wrap.addChild(page);
    wrap.logicalFloat = page.logicalFloat;
    return wrap;
  }
});

var ParallelPageGenerator = ChildPageGenerator.extend({
  init : function(generators, markup, context, partition){
    this.generators = generators;
    this.markup = markup;
    this.context = context;
    this.partition = partition;
  },
  hasNext : function(){
    return List.exists(this.generators, function(generator){
      return generator.hasNext();
    });
  },
  backup : function(){
    List.iter(this.generators, function(generator){
      generator.backup();
    });
  },
  rollback : function(){
    List.iter(this.generators, function(generator){
      generator.rollback();
    });
  },
  yield : function(parent){
    this.backup();
    var wrap_size = parent.getRestSize();
    var wrap_page = this._createBox(wrap_size, parent);
    var wrap_flow = parent.getParallelFlow();
    wrap_page.setFlow(wrap_flow);
    return this._yieldChilds(wrap_page, parent);
  },
  _setEdge : function(box, edge){
    // ignore edge
    // because each edge of child layout are set by child-generators.
  },
  _getChildMeasure : function(index){
    return this.partition.getSize(index);
  },
  _getChildExtent : function(parent){
    return parent.getRestContentExtent();
  },
  _yieldChilds : function(wrap_page, parent){
    var self = this, valid = false;
    var child_flow = parent.flow;
    var is_valid = function(page){
      return page && page.getContentExtent;
    };
    var child_pages = List.mapi(this.generators, function(index, generator){
      var child_measure = self._getChildMeasure(index);
      var child_extent = self._getChildExtent(parent);
      var child_size = child_flow.getBoxSize(child_measure, child_extent);
      return generator.yield(wrap_page, child_size);
    });

    if(!List.exists(child_pages, is_valid)){
      return Exceptions.RETRY;
    }
      
    var max_child = List.maxobj(child_pages, function(child_page){
      if(child_page && child_page.getContentExtent){
	return child_page.getContentExtent();
      }
      return 0;
    });
    var max_content_extent = max_child.getContentExtent();
    var max_box_extent = max_child.getBoxExtent();

    wrap_page.setContentExtent(parent.flow, max_box_extent);
    
    // resize each child by uniform extent size.
    List.iter(child_pages, function(child_page){
      if(child_page){
	child_page.setContentExtent(child_flow, max_content_extent);
	wrap_page.addChild(child_page);
      }
    });
    return wrap_page;
  }
});

var ParaChildPageGenerator = ChildPageGenerator.extend({
  _onReadyBox : function(box, parent){
    // wrap box(parent) has parallel flow, so flip it to get original one.
    var flow = parent.getParallelFlipFlow();
    box.setFlow(flow);
  }
});

var TableGenerator = ChildPageGenerator.extend({
  _createStream : function(){
    return new TableTagStream(this.markup);
  },
  _onReadyBox : function(box, parent){
    if(this.markup.getCssAttr("border-collapse") === "collapse"){
      if(typeof this.collapse == "undefined"){
	Collapse.set(this.markup, box);
	this.collapse = true; // set collapse flag(means collapse already calcurated).
      }
    }
  },
  _onCreateBox : function(box, parent){
    box.partition = this.stream.getPartition(box);
  }
});

var TableRowGroupGenerator = ChildPageGenerator.extend({
  _onCreateBox : function(box, parent){
    box.partition = parent.partition;
  },
  _createStream : function(){
    return new DirectTokenStream(this.markup.childs);
  }
});

var TableRowGenerator = ParallelPageGenerator.extend({
  init : function(markup, parent, context){
    var partition = parent.partition.getPartition(markup.childs.length);
    var generators = List.map(markup.childs, function(td){
      return new ParaChildPageGenerator(td, context.createInlineRoot());
    });
    this._super(generators, markup, context, partition);
  }
});

var ListGenerator = ChildPageGenerator.extend({
  _onCreateBox : function(box, parent){
    var item_count = this.stream.getTokenCount();
    var list_style_type = this.markup.getCssAttr("list-style-type", "none");
    var list_style_pos = this.markup.getCssAttr("list-style-position", "outside");
    var list_style_image = this.markup.getCssAttr("list-style-image", "none");
    var list_style = new ListStyle({
      type:list_style_type,
      position:list_style_pos,
      image:list_style_image
    });
    var marker_advance = list_style.getMarkerAdvance(parent.flow, parent.fontSize, item_count);
    box.listStyle = list_style;
    box.partition = new Partition([marker_advance, box.getContentMeasure() - marker_advance]);
  },
  _createStream : function(){
    return new ListTagStream(this.markup.content);
  }
});

var InsideListItemGenerator = ChildPageGenerator.extend({
  init : function(markup, parent, context){
    var marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    var marker_html = Html.tagWrap("span", marker, {
      "class":"nehan-li-marker"
    });
    markup.content = marker_html + Const.space + markup.content;
    this._super(markup, context);
  }
});

var OutsideListItemGenerator = ParallelPageGenerator.extend({
  init : function(markup, parent, context){
    markup.marker = parent.listStyle.getMarkerHtml(markup.order + 1);
    this._super([
      new ListItemMarkGenerator(markup, context),
      new ListItemBodyGenerator(markup, context)
    ], markup, context, parent.partition);
  }
});

var ListItemMarkGenerator = ParaChildPageGenerator.extend({
  _getBoxType : function(){
    return "li-marker";
  },
  _createStream : function(){
    return new TokenStream(this.markup.marker);
  }
});

var ListItemBodyGenerator = ParaChildPageGenerator.extend({
  _getBoxType : function(){
    return "li-body";
  }
});

var DefListGenerator = ChildPageGenerator.extend({
  _createStream : function(){
    return new DefListTagStream(this.markup.content);
  }
});

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
  function PageEvaluator(ctx){
    this.ctx = ctx || new DocumentContext();
    this.blockEvaluator = new BlockEvaluator(this.ctx);
  }

  PageEvaluator.prototype = {
    evaluate : function(box){
      var html = this.blockEvaluator.evaluate(box, this.ctx);
      var css_content = box.styles.join("\n");
      var style = Html.tagWrap("style", css_content, {"type":"text/css"});
      return new EvalResult({
	html:[style, html].join("\n"),
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


var BlockEvaluator = (function(){
  function BlockEvaluator(){
    this.inlineEvaluatorH = new HorizontalInlineEvaluator(this);
    this.inlineEvaluatorV = new VerticalInlineEvaluator(this);
  }

  BlockEvaluator.prototype = {
    evaluate : function(box, ctx){
      switch(box._type){
      case "br":
	return this.evalBreak(box, ctx);
      case "hr":
	return this.evalHorizontalRule(box, ctx);
      case "ibox":
	return this.evalInlineBox(box, ctx);
      case "ipage":
	return this.evalInlinePage(box, ctx);
      case "img":
	return this.evalImage(box, ctx);
      case "table":
	return this.evalTable(box, ctx);
      case "line-box":
	return this.evalLineBox(box, ctx);
      case "text-line": case "ruby-line":
	return this.evalLine(box, ctx);
      default:
	return this.evalBox(box, ctx);
      }
    },
    evalBox : function(box, ctx){
      var attr = {
	"style":Css.attr(box.getCss()),
	"class":box.getCssClasses()
      };
      if(box.id){
	attr.id = box.id;
      }
      return Html.tagWrap("div", this.evalBoxChilds(box.getChilds(), ctx), attr);
    },
    evalBoxChilds : function(childs, ctx){
      var self = this;
      return List.fold(childs, "", function(ret, box){
	return [ret, self.evaluate(box, ctx)].join("\n");
      });
    },
    evalLineBox : function(box, ctx){
      var self = this;
      return List.fold(box.getLines(), "", function(ret, line){
	return ret + self.evalLine(line, ctx);
      });
    },
    evalLine : function(box, ctx){
      if(box.isTextVertical()){
	return this.inlineEvaluatorV.evaluate(box, ctx);
      }
      return this.inlineEvaluatorH.evaluate(box, ctx);
    },
    evalInlineBox : function(box, ctx){
      return Html.tagWrap("div", box.content, {
	"style":Css.attr(box.getCss()),
	"class":box.getCssClasses()
      });
    },
    evalHorizontalRule : function(box, ctx){
      return this.evalInlineBox(box, ctx);
    },
    evalBreak : function(box, ctx){
      return this.evalInlineBox(box, ctx);
    },
    evalImage : function(box, ctx){
      var content = this.evalImageContent(box, ctx);
      return Html.tagWrap("div", content, {
	"style":Css.attr(box.getCss()),
	"class":box.getCssClasses()
      });
    },
    evalImageContent : function(box, ctx){
      return Html.tagSingle("img", {
	"src": box.src,
	"width": box.getContentWidth(),
	"height": box.getContentHeight()
      });
    },
    evalInlinePage : function(box, ctx){
      var ctx2 = ctx.createInlineRoot();
      return this.evalBox(box, ctx2);
    },
    evalTable : function(box, ctx){
      var ctx2 = ctx.createInlineRoot();
      return this.evalBox(box, ctx2);
    }
  };

  return BlockEvaluator;
})();


var InlineEvaluator = Class.extend({
  init : function(parent_evaluator){
    this.parentEvaluator = parent_evaluator;
  },
  evaluate : function(line, ctx){
    switch(line._type){
    case "text-line":
      return this.evalTextLine(line, ctx);
    case "ruby-line":
      return this.evalRubyLine(line, ctx);
    }
  },
  evalTextLine : function(line, ctx){
    return Html.tagWrap("div", this.evalTextLineBody(line, ctx), {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalTextLineBody : function(line, ctx){
    var self = this;
    return [
      this.evalOpenTagStack(line, ctx),
      List.fold(line.tokens, "", function(ret, element){
	return ret + self.evalInlineElement(line, element, ctx);
      }),
      this.evalCloseTagStack(line, ctx)
    ].join("");
  },
  evalRubyLine : function(line, ctx){
    var ruby_line_body = this.evalRubyLineBody(line, ctx);
    var empha_chars = this.evalEmphaChars(line, ctx);
    return Html.tagWrap("div", ruby_line_body + empha_chars, {
      "style":Css.attr(line.getCss()),
      "class":line.getCssClasses()
    });
  },
  evalEmphaChars : function(line, ctx){
    var self = this;
    return List.fold(line.emphaChars, "", function(ret, text){
      return ret + self.evalEmphaChar(line, text, ctx);
    });
  },
  evalRubyLineBody : function(line, ctx){
    var self = this;
    return List.fold(line.tokens, "", function(ret, label){
      return ret + self.evalRubyLabel(line, label, ctx);
    });
  },
  evalRubyLabel : function(line, label, ctx){
    throw "not implemented:evalRubyLabel";
  },
  evalEmphaChar : function(line, text, ctx){
    throw "not implemented:evalEmphaChar";
  },
  evalOpenTagStack : function(line, ctx){
    var self = this;
    var stack = ctx.getInlineTagStack();
    return List.fold(stack.tags, "", function(ret, tag){
      return ret + self.evalTagOpen(line, tag, ctx, false);
    });
  },
  evalCloseTagStack : function(line, ctx){
    var self = this;
    var stack = ctx.getInlineTagStack();
    return List.fold(stack.tags, "", function(ret, tag){
      return ret + self.evalTagClose(line, tag.getCloseTag(), ctx, false);
    });
  },
  evalInlineElement : function(line, element, ctx){
    if(Token.isText(element)){
      return this.evalText(line, element, ctx);
    }
    if(Token.isTag(element)){
      return this.evalTag(line, element, ctx);
    }
    if(element instanceof Box){
      return this.evalInlineBox(element, ctx);
    }
    return "";
  },
  evalText : function(line, text, ctx){
    switch(text._type){
    case "word":
      return this.evalWord(line, text, ctx);
    case "tcy":
      return this.evalTcy(line, text, ctx);
    case "char":
      return this.evalChar(line, text, ctx);
    default:
      return "";
    }
  },
  evalTag : function(line, tag, ctx){
    if(tag.isSingleTag()){
      return this.evalTagSingle(line, tag, ctx);
    }
    if(tag.isOpen()){
      return this.evalTagOpen(line, tag, ctx, true);
    }
    return this.evalTagClose(line, tag, ctx, true);
  },
  evalTagOpen : function(line, tag, ctx, update){
    if(update){
      ctx.pushInlineTag(tag, line);
    }
    return this.evalTagOpenBody(line, tag, ctx);
  },
  evalTagCss : function(line, tag, ctx){
    var css = {};
    if(tag.fontSize){
      css["font-size"] = tag.fontSize + "px";
      css["line-height"] = "1em";
    }
    if(tag.fontColor){
      Args.copy(css, tag.fontColor.getCss());
    }
    if(tag.edge){
      Args.copy(css, tag.edge.getCss());
    }
    return css;
  },
  evalTagStart : function(line, tag, ctx, alias){
    var attr = {};
    var css = this.evalTagCss(line, tag, ctx);
    var tag_name = tag.getName();
    tag.addClass(Css.addNehanPrefix(tag_name));
    attr["class"] = tag.getCssClasses();
    if(!Obj.isEmpty(css)){
      attr.style = Css.attr(css);
    }
    return Html.tagStart(alias || tag_name, attr);
  },
  evalTagEnd : function(line, tag, ctx){
    throw "not implemented:evalTagEnd";
  },
  evalTagOpenBody : function(line, tag, ctx){
    switch(tag.getName()){
    case "a":
      return this.evalLinkStart(line, tag, ctx);
    default:
      return this.evalTagStart(line, tag, ctx);
    }
  },
  evalTagClose : function(line, tag, ctx, update){
    var open_name = tag.getOpenTagName();
    var open_tag = update? ctx.popInlineTagByName(open_name) : ctx.findLastInlineTagByName(open_name);
    if(open_tag === null){
      return "";
    }
    return this.evalTagCloseBody(line, tag, ctx);
  },
  evalTagCloseBody : function(line, tag, ctx){
    switch(tag.getName()){
    case "/a":
      return "</a>";
    default:
      return this.evalTagEnd(tag, ctx);
    }
  },
  evalTagSingle : function(line, tag, ctx){
    return tag.getSrc();
  },
  evalInlineBox : function(box, ctx){
    return this.parentEvaluator.evaluate(box, ctx);
  },
  evalLinkStart : function(line, tag, ctx){
    var attr = {};
    attr.href = tag.getTagAttr("href", "#");
    var name = tag.getTagAttr("name");
    if(name){
      tag.addClass("nehan-anchor");
      attr.name = name;
    }
    var target = tag.getTagAttr("target");
    if(target){
      attr.target = target;
    }
    if(attr.href.indexOf("#") >= 0){
      tag.addClass("nehan-anchor-link");
    }
    attr["class"] = tag.getCssClasses();
    return Html.tagStart(tag.getName(), attr);
  },
  evalWord : function(line, word, ctx){
    throw "not implemented: evalWord";
  },
  evalTcy : function(line, tcy, ctx){
    throw "not implemented: evalTcy";
  },
  evalChar : function(line, tcy, ctx){
    throw "not implemented: evalChar";
  }
});

var VerticalInlineEvaluator = InlineEvaluator.extend({
  evalTextLine : function(line, ctx){
    var css = line.getCss();
    if(line.parent && line.parent._type === "ruby-line"){
      css["float"] = "none";
    }
    return Html.tagWrap("div", this.evalTextLineBody(line, ctx), {
      "style":Css.attr(css),
      "class":line.getCssClasses()
    });
  },
  evalRubyLabel : function(line, label, ctx){
    var label_line = this._yieldRubyLabelLine(line, label, ctx);
    return Html.tagWrap("div", this.evalTextLine(label_line, ctx.createInlineRoot()), {
      "style": Css.attr(label.getCss(line)),
      "class": Css.addNehanPrefix(label._type)
    });
  },
  evalEmphaChar : function(line, text, ctx){
    return Html.tagWrap("div", text.data, {
      "class": "nehan-empha-char",
      "style": Css.attr(text.getCss(line.flow))
    });
  },
  _yieldRubyLabelLine : function(line, label, ctx){
    var text = label.getRtString();
    var font_size = label.getRtFontSize();
    var stream = new TokenStream(text);
    var ctx2 = ctx.createInlineRoot();
    ctx2.setFixedFontSize(font_size);
    var generator = new InlineGenerator(null, stream, ctx2);
    return generator.yield(line);
  },
  evalTagStart : function(line, tag, ctx){
    return this._super(line, tag, ctx, "div");
  },
  evalTagEnd : function(line, tag, ctx){
    return "</div>";
  },
  evalWord : function(line, word, ctx){
    if(Env.isTransformEnable){
      return this.evalWordTransform(line, word, ctx);
    } else if(Env.isIE){
      return this.evalWordIE(line, word, ctx);
    } else {
      return "";
    }
  },
  evalWordTransform : function(line, word, ctx){
    var body = Html.tagWrap("div", word.data, {
      "class": "nehan-vert-alpha"
    });
    return Html.tagWrap("div", body, {
      "style": Css.attr({
	"letter-spacing":line.letterSpacing + "px",
	"width": word.fontSize + "px",
	"height": word.bodySize + "px",
	"word-break":"keep-all",
	"overflow": "visible"
      })
    });
  },
  evalWordIE : function(line, word, ctx){
    var css = {
      "writing-mode": "tb-rl",
      "letter-spacing":line.letterSpacing + "px",
      "line-height": word.fontSize + "px",
      "float": "left"
    };
    return Html.tagWrap("div", word.data, {
      "style": Css.attr(css)
    });
  },
  evalTcy : function(line, tcy, ctx){
    return Html.tagWrap("div", tcy.data, {
      "class": "nehan-tcy"
    });
  },
  evalChar : function(line, chr, ctx){
    if(chr.isImgChar()){
      if(Config.useVerticalGlyphIfEnable &&
	 Env.isVerticalGlyphEnable &&
	 !chr.isTenten()){
	return this.evalVerticalGlyph(line, chr, ctx);
      } else {
	return this.evalImgChar(line, chr, ctx);
      }
    } else if(chr.isHalfSpaceChar(chr, ctx)){
      return this.evalHalfSpaceChar(line, chr, ctx);
    } else if(chr.isCnvChar()){
      return this.evalCnvChar(line, chr, ctx);
    } else if(chr.isSmallKana()){
      return this.evalSmallKana(line, chr, ctx);
    } else if(chr.isPaddingEnable()){
      return this.evalPaddingChar(line, chr, ctx);
    }
    return this.evalCharBr(line, chr, ctx);
  },
  evalCharBr : function(line, chr, ctx){
    if(line.letterSpacing){
      return Html.tagWrap("div", chr.data, {
	"style":Css.attr({
	  "margin-bottom":line.letterSpacing + "px"
	})
      });
    }
    return chr.data + "<br />";
  },
  evalPaddingChar : function(line, chr, ctx){
    return Html.tagWrap("div", chr.data, {
      style:Css.attr(chr.getCssPadding(line.flow))
    });
  },
  evalImgChar : function(line, chr, ctx){
    var width = chr.fontSize;
    var vscale = chr.getVertScale();
    var height = (vscale === 1)? width : Math.floor(width * vscale);
    var css = {};
    if(chr.isPaddingEnable()){
      Args.copy(css, chr.getCssPadding(line.flow));
    }
    var palette_color_value = Layout.fontColor.toUpperCase();
    var font_color = ctx.getInlineFontColor(line);
    if(font_color.getValue().toLowerCase() != Layout.fontColor.toLowerCase()){
      palette_color_value = font_color.getPaletteValue().toUpperCase();
    }
    return Html.tagSingle("img", {
      "class":"nehan-img-char",
      src:chr.getImgSrc(palette_color_value),
      style:Css.attr(css),
      width:width,
      height:height
    }) + Const.clearFix;
  },
  evalVerticalGlyph : function(line, chr, ctx){
    var classes = ["nehan-vert-rl"];
    if(chr.isKakkoStart()){
      if(!chr.isPaddingEnable()){
	classes.push("nehan-vert-kern-start");
      }
    } else {
      if(chr.getVertScale() < 1){
	classes.push("nehan-vert-half");
      }
      if(chr.isPaddingEnable()){
	classes.push("nehan-vert-space-end");
      }
    }
    return Html.tagWrap("div", chr.data, {
      "class":classes.join(" ")
    });
  },
  evalCnvChar: function(line, chr, ctx){
    return chr.cnv + "<br />";
  },
  evalSmallKana : function(line, chr, ctx){
    return Html.tagWrap("div", chr.data, {
      style:Css.attr({
	"position": "relative",
	"top": "-0.1em",
	"right":"-0.12em",
	"height": chr.bodySize + "px",
	"line-height": chr.bodySize + "px"
      })
    });
  },
  evalHalfSpaceChar : function(line, chr, ctx){
    var half = Math.floor(chr.fontSize / 2);
    return Html.tagWrap("div", "&nbsp;", {
      style:Css.attr({
	"height": half + "px",
	"line-height": half + "px"
      })
    });
  },
  evalInlineBox : function(box, ctx){
    return this._super(box, ctx) + Const.clearFix;
  }
});

var HorizontalInlineEvaluator = InlineEvaluator.extend({
  evalRubyLabel : function(line, label, ctx){
    return Html.tagWrap("span", label.getRtString(), {
      "style": Css.attr(label.getCss(line)),
      "class": Css.addNehanPrefix(label._type)
    });
  },
  evalEmphaChar : function(line, text, ctx){
    return Html.tagWrap("span", text.data, {
      "class": "nehan-empha-char",
      "style": Css.attr(text.getCss(line.flow))
    });
  },
  evalTagStart : function(line, tag, ctx, alias){
    return this._super(line, tag, ctx, "span");
  },
  evalTagEnd : function(line, tag, ctx){
    return "</span>";
  },
  evalWord : function(line, word, ctx){
    return word.data;
  },
  evalTcy : function(line, tcy, ctx){
    return tcy.data;
  },
  evalChar : function(line, chr, ctx){
    if(chr.isHalfSpaceChar()){
      return chr.cnv;
    } else if(chr.isKerningChar()){
      return this.evalKerningChar(line, chr, ctx);
    }
    return chr.data;
  },
  evalKerningChar : function(line, chr, ctx){
    var css = chr.getCssPadding(line.flow);
    if(chr.isKakkoStart()){
      return Html.tagWrap("span", chr.data, {
	"style": Css.attr(css),
	"class":"nehan-char-kakko-start"
      });
    }
    if(chr.isKakkoEnd()){
      return Html.tagWrap("span", chr.data, {
	"style": Css.attr(css),
	"class":"nehan-char-kakko-end"
      });
    }
    if(chr.isKutenTouten()){
      return Html.tagWrap("span", chr.data, {
	"style": Css.attr(css),
	"class":"nehan-char-kuto"
      });
    }
    return chr.data;
  },
  evalPaddingChar : function(line, chr, ctx){
    return Html.tagWrap("span", chr.data, {
      "style": Css.attr(chr.getCssPadding(line.flow))
    });
  }
});

var PageGroupEvaluator = (function(){
  function PageGroupEvaluator(){
    this.evaluator = new PageEvaluator();
  }

  PageGroupEvaluator.prototype = {
    evaluate : function(page_group){
      var self = this;
      var char_count = 0;
      var html = [];
      var lazy = true;
      var results = List.map(page_group.getPages(), function(page){
	var ret = self.evaluator.evaluate(page);
	if(!ret.lazy){
	  lazy = false;
	}
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

var PageStream = Class.extend({
  init : function(text){
    this.text = this._createSource(text);
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
    this.buffer = [];
    this._timeStart = null;
    this._timeElapsed = null;
    this._seekPageNo = 0;
    this._seekPercent = 0;
    this._seekPos = 0;
  },
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
      onProgress : function(self){}
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
    // if entry can't be lazy, eval immediately.
    if(!entry.lazy){
      entry = this.evaluator.evaluate(entry);
    }
    this.buffer.push(entry);
  },
  // common preprocessor
  _createSource : function(text){
    return text
      .replace(/(\/[a-zA-Z0-9\-]+>)[\s\n]+(<[^\/])/g, "$1$2") // discard space between close tag and open tag.
      .replace(/\t/g, "") // discard TAB
      .replace(/<!--[\s\S]*?-->/g, "") // discard comment
      .replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
      .replace(/<rb>/gi, "") // discard rb
      .replace(/<\/rb>/gi, "") // discard /rb
      .replace(/<rt><\/rt>/gi, ""); // discard empty rt
  },
  _createGenerator : function(text){
    return new BodyPageGenerator(text);
  },
  _createEvaluator : function(){
    return new PageEvaluator();
  }
});

var DocumentPageStream = PageStream.extend({
  _createGenerator : function(text){
    return new DocumentGenerator(text);
  }
});

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
      var last = this.getLast();
      // page group of evaluation can be lazy when both head and tail are context free.
      this.lazy = first.lazy && last.lazy;
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

var PageGroupStream = PageStream.extend({
  init : function(text, group_size){
    this._super(text);
    this.groupSize = group_size;
  },
  getAnchorPageNo : function(anchor_name){
    var page_no = this._super(anchor_name);
    return this.getGroupPageNo(page_no);
  },
  // anchors and outline positions of nehan are returned as 'cell_page_pos'.
  // for example, first page group(size=4) consists of [0,1,2,3] cell pages.
  // so cell page nums '0..3' are equivalent to group page no '0'.
  getGroupPageNo : function(cell_page_no){
    return Math.floor(cell_page_no / this.groupSize);
  },
  _yield : function(){
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
  },
  _createEvaluator : function(){
    return new PageGroupEvaluator();
  }
});

Nehan.version = "4.0.2";

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
  __exports.EdgeParser = EdgeParser;
  __exports.CornerParser = CornerParser;
  __exports.Padding = Padding;
  __exports.Margin = Margin;
  __exports.Border = Border;
  __exports.BorderColor = BorderColor;
  __exports.BorderRadius = BorderRadius;
  __exports.Radius2d = Radius2d;
  __exports.BoxEdge = BoxEdge;
  __exports.BoxSize = BoxSize;
  __exports.LogicalSize = LogicalSize;
  __exports.UnitSize = UnitSize;
  __exports.BoxChild = BoxChild;
  __exports.Box = Box;
  __exports.Selector = Selector;
  __exports.Tag = Tag;
  __exports.Char = Char;
  __exports.Word = Word;
  __exports.Tcy = Tcy;
  __exports.Ruby = Ruby;
  __exports.Lexer = Lexer;
  __exports.Token = Token;
  __exports.TagStack = TagStack;
  __exports.InlineContext = InlineContext;
  __exports.BlockContext = BlockContext;
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
  __exports.RubyStream = RubyStream;

  // generator
  __exports.BlockGenerator = BlockGenerator;
  __exports.InlineGenerator = InlineGenerator;
  __exports.PageGenerator = PageGenerator;
  __exports.BodyPageGenerator = BodyPageGenerator;
  __exports.ParallelPageGenerator = ParallelPageGenerator;
  __exports.ParaChildPageGenerator = ParaChildPageGenerator;
  __exports.HtmlGenerator = HtmlGenerator;
  __exports.DocumentGenerator = DocumentGenerator;

  // evaluator
  __exports.PageEvaluator = PageEvaluator;
  __exports.BlockEvaluator = BlockEvaluator;
  __exports.InlineEvaluator = InlineEvaluator;
  __exports.PageGroupEvaluator = PageGroupEvaluator;

  // page stream
  __exports.PageStream = PageStream;
  __exports.PageGroupStream = PageGroupStream;
  __exports.DocumentPageStream = DocumentPageStream;

  // core layouting components
  __exports.Env = Env;
  __exports.Config = Config;
  __exports.Layout = Layout;
  __exports.Style = Style;
  __exports.Selectors = Selectors;
}

__exports.createPageStream = function(text){
  return new PageStream(text);
};
__exports.createDocumentPageStream = function(text){
  return new DocumentPageStream(text);
};
__exports.createPageGroupStream = function(text, group_size){
  return new PageGroupStream(text, group_size);
};
__exports.getStyle = function(selector_key){
  return Selectors.getValue(selector_key);
};
__exports.setStyle = function(selector_key, obj) {
  Selectors.setValue(selector_key, obj);
};

return __exports;

}; // Nehan.setup
