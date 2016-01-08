/*!
 nehan.js
 Copyright (C) 2010 - 2015 Watanabe Masaki<lambda.watanabe[at]gmail.com>
 repository: https://github.com/tategakibunko/nehan.js
 url: http://tb.antiscroll.com/

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

/**
 @namespace Nehan
 */
var Nehan = Nehan || {};
Nehan.version = "5.4.1";

/**
 system configuration
 @namespace Nehan.Config
 */
Nehan.Config = {
  /**
   language setting

   @memberof Nehan.Config
   @type {string}
   @default ""
   */
  defaultLang:"",

  /**
   define default root markup where rendering context starts from.
   'body' or 'html' or 'document' are enabled.

   @memberof Nehan.Config
   @type {String}
   @default "document"
   */
  defaultRoot:"document",

  /**
   is kerning enabled?

   @memberof Nehan.Config
   @type {boolean}
   @default true
   */
  kerning:true,

  /**
   max rety yield count

   @memberof Nehan.Config
   @type {int}
   @default 5
   */
  maxRollbackCount:5,

  /**
   max yield count to block infinite loop.

   @memberof Nehan.Config
   @type {int}
   @default 20000
   */
  maxYieldCount:20000,

  /**
   max available page count for each engine.

   @memberof Nehan.Config
   @type {int}
   @default 5000
   */
  maxPageCount:5000,

  /**
   use vertical glyph if browser support 'writing-mode'.

   @memberof Nehan.Config
   @type {boolean}
   @default true
   */
  useVerticalGlyphIfEnable:true,

  /**
   enable ommiting element by start tag.

   @memberof Nehan.Config
   @type {boolean}
   @default true
   */
  enableAutoCloseTag:true,

  /**
   allowed inline style properties.
   allow all properties if not defined or list is empty.

   @memberof Nehan.Config
   @type {Array.<string>}
   @default []
   */
  allowedInlineStyleProps:[],

  /**
   markups just ignored.

   @memberof Nehan.Config
   @type {Array.<string>}
   */
  disabledMarkups:[
    "script",
    "noscript",
    "style",
    "iframe",
    "form",
    "input",
    "select",
    "button",
    "textarea",
    "canvas"
  ],

  /**
   all properties under control of layout engine.

   @memberof Nehan.Config
   @type {Array.<string>}
   */
  managedCssProps:[
    "border-color",
    "border-radius",
    "border-style",
    "border-width",
    "box-sizing",
    "break-after",
    "break-before",
    "clear",
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
    "line-height",
    "list-style-type",
    "list-style-position",
    "list-style-image",
    "margin",
    "measure",
    "meta", // flag
    //"overflow-wrap", // draft
    "padding",
    "position",
    "section", // flag
    "section-root", // flag
    "text-align",
    "text-emphasis-style",
    "text-emphasis-position",
    "text-emphasis-color",
    "text-orientation",
    "text-combine-upright",
    "width",
    "word-break"
  ],

  /**
   properties used for special functional callbacks in selector definitions.

   @memberof Nehan.Config
   @type {Array.<string>}
   */
  callbackCssProps:[
    "onload",
    "oncreate",
    "onblock",
    "online",
    "ontext"
  ],

  /**
   count of tab space

   @memberof Nehan.Config
   @type {int}
   @default 4
   */
  tabCount: 4,

  /**
   minimum table cell size. if table-layout is set to 'auto', all sizes of cell are larger than this value.

   @memberof Nehan.Config
   @type {int}
   @default 48
   */
  minTableCellSize:48,

  /**
   default rate of ruby text(rt) font size. used when no font-size for rt is specified.

   @memberof Nehan.Config
   @type {Float}
   @default 0.5
   */
  defaultRtRate:0.5,

  /**
   default rate of text-emphasis font size.

   @memberof Nehan.Config
   @type {Float}
   @default 0.5
   */
  defaultEmphaTextRate:0.5,
  
  /**
   box-flow set for "vert" and "hori".

   @memberof Nehan.Config
   @type {Object}
   @default {hori:"lr-tb", vert:"tb-rl"}
   */
  boxFlowSet:{
    vert:"tb-rl", // or "lr-tb"
    hori:"lr-tb"
  },

  /**
   default box-flow, "tb-rl" or "tb-lr" or "lr-tb".

   @memberof Nehan.Config
   @type {String}
   @default "tb-rl"
   */
  defaultBoxFlow: "lr-tb",

  /**
   default line-height

   @memberof Nehan.Config
   @type {Float}
   @default 2.0
   */
  defaultLineHeight: 2.0,

  /**
   default maximum font size

   @memberof Nehan.Config
   @type {int}
   @default 90
   */
  maxFontSize:90,

  /**
   default font size, used when no font-size is specified for body.

   @memberof Nehan.Config
   @type {int}
   @default 16
   */
  defaultFontSize:16,

  /**
   default font color, used when no color is specified for body.
   @memberof Nehan.Config
   @type {String}
   @default "000000"
   */
  defaultFontColor: "000000",

  /**
   default font size, used when no font-size is specified for body.
   @memberof Nehan.Config
   @type {Int}
   @default 16
   */
  defaultFontSize: 16,

  /**
   default font family, required to calculate proper text-metrics of alphabetical word.

   @memberof Nehan.Config
   @type {String}
   @default "'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','Meiryo','メイリオ','IPA明朝','IPA Mincho','ＭＳ 明朝','MS Mincho', monospace"
   */
  defaultFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','Meiryo','メイリオ','IPA明朝','IPA Mincho','ＭＳ 明朝','MS Mincho',monospace",

  /**
   default single tag(like img, br, hr etc) list.

   @memberof Nehan.Config
   @type {Array.<String>}
   */
  defaultSingleTagNames:[
    "br",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "wbr",
    "?xml",
    "!doctype",

    // nehan special tag for page-break
    "page-break"
  ],

  /**
   font image url, required for legacy browsers not supporting vertical writing-mode.

   @memberof Nehan.Config
   @type {String}
   @default "https://raw.githubusercontent.com/tategakibunko/nehan.js/master/char-img"
   */
  fontImgRoot:"https://raw.githubusercontent.com/tategakibunko/nehan.js/master/char-img",

  /**
   pre defined font-size keywords

   @memberof Nehan.Config
   @type {Object}
   */
  absFontSizes:{
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
   various kind of spacing rate

   @memberof Nehan.Config
   @type {Array.<Float>}
   */
  spacingSizeRate:{
    space:0.25, // U+0020
    thinsp:0.2, // &thinsp;
    nbsp:0.38,  // &nbsp;
    ensp:0.5,   // &ensp;
    emsp:1.0    // &emsp;
  },
  /**
   format tag content(vertical only)

   @memberof Nehan.Config
   @param flow {Nehan.BoxFlow}
   @param content {String}
   @return {String}
   */
  formatTagContent : function(flow, content){
    if(!flow.isTextVertical()){
      return content;
    }
    return content
      .replace(/’/g, "'")   // convert unicode 'RIGHT SINGLE' to APOSTROPHE.
      .replace(/｢/g, "「")  // half size left corner bracket -> full size left corner bracket
      .replace(/｣/g, "」")  // half size right corner bracket -> full size right corner bracket
      .replace(/､/g, "、")  // half size ideographic comma -> full size ideographic comma
      .replace(/，/g, "、") // full width comma -> full size ideographic comma
      .replace(/｡/g, "。")  // half size ideographic full stop -> full size
    ;
  }
};

/**
 standard page settings.
 @namespace Nehan.Display
 */
Nehan.Display = {
  /**
   @memberof Nehan.Display
   @return {string}
   */
  getVertBlockDir: function(){
    return Nehan.Config.boxFlowSet.vert.split("-")[1];
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdFont : function(){
    return new Nehan.Font({
      size:Nehan.Config.defaultFontSize,
      family:Nehan.Config.defaultFontFamily,
      lineHeight:Nehan.Config.defaultLineHeight,
      weight:"normal",
      style:"normal"
    });
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdBoxFlow : function(){
    return Nehan.BoxFlows.getByName(Nehan.Config.defaultBoxFlow);
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdVertFlow : function(){
    return Nehan.BoxFlows.getByName(Nehan.Config.boxFlowSet.vert);
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdHoriFlow : function(){
    return Nehan.BoxFlows.getByName(Nehan.Config.boxFlowSet.hori);
  },
  /**
   @memberof Nehan.Display
   @return {int}
   */
  getRtFontSize : function(base_font_size){
    return Math.round(Nehan.Config.defaultRtRate * base_font_size);
  }
};

Nehan.Client = (function(){
  /**
     @memberof Nehan
     @class Client
     @classdesc wrapper class for user browser agent
     @constructor
  */
  function Client(){
    this.platform = navigator.platform.toLowerCase();
    this.userAgent = navigator.userAgent.toLowerCase();
    this.name = navigator.appName.toLowerCase();
    this.version = parseInt(navigator.appVersion, 10);
    this._parseUserAgent(this.userAgent);
  }

  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isWindows = function(){
    return this.userAgent.indexOf("windows") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isMacintosh = function(){
    return this.userAgent.indexOf("macintosh") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIphone = function(){
    return this.userAgent.indexOf("iphone") >= 0 && this.platform.indexOf("nintendo") < 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIpod = function(){
    return this.userAgent.indexOf("ipod") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIpad = function(){
    return this.userAgent.indexOf("ipad") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isNintendoBrowser = function(){
    return this.platform.indexOf("nintendo") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isAppleMobileFamily = function(){
    return this.isIphone() || this.isIpod() || this.isIpad();
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isAndroid = function(){
    return this.userAgent.indexOf("android") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isSmartPhone = function(){
    return this.isAppleMobileFamily() || this.isAndroid();
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isWebkit = function(){
    return this.userAgent.indexOf("webkit") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIE = function(){
    return this.name === "msie";
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isTrident = function(){
    return this.isIE() && this.version >= 11;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isChrome = function(){
    return this.name === "chrome";
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isSafari = function(){
    return this.name === "safari";
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isFirefox = function(){
    return this.name === "firefox";
  };

  Client.prototype._parseUserAgent = function(user_agent){
    // in latest agent style of MSIE, 'Trident' is specified but 'MSIE' is not.
    if(user_agent.indexOf("trident") >= 0 && user_agent.indexOf("msie") < 0){
      this.name = "msie";
      this.version = this._parseVersionPureTrident(user_agent);
      return;
    }
    // normal desktop agent styles
    if(user_agent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(?:\.\d+)*)/)){
      this.name = RegExp.$1.toLowerCase();
      this.version = this._parseVersionNormalClient(user_agent, parseInt(RegExp.$2, 10));
      return;
    }
    // if iphone/ipad/ipod, and user agent is not normal desktop style
    if(this.isAppleMobileFamily()){
      this.name = "safari";
      this.version = this._parseVersionAppleMobileFamily(user_agent);
      return;
    }
  };

  Client.prototype._parseVersionPureTrident = function(user_agent){
    if(user_agent.match(/rv:([\.\d]+)/)){
      return parseInt(RegExp.$1, 10);
    }
    return this.version;
  };

  Client.prototype._parseVersionNormalClient = function(user_agent, tmp_version){
    if(user_agent.match(/version\/([\.\d]+)/)){
      return parseInt(RegExp.$1, 10);
    }
    return tmp_version;
  };

  Client.prototype._parseVersionAppleMobileFamily = function(user_agent){
    if(user_agent.match(/os ([\d_]+) like/)){
      return parseInt(RegExp.$1, 10); // [iOS major version] = [safari major version]
    }
    return this.version;
  };

  return Client;
})();

/**
 browser environment object

 @namespace Nehan.Env
 */
Nehan.Env = (function(){
  var __client = new Nehan.Client();
  var __version = __client.version;
  var __is_transform_enable = !(__client.isIE() && __version <= 8);
  var __is_ie_vert_glyph_enable = __client.isIE() && __version >= 10;
  var __is_chrome_vert_glyph_enable = __client.isChrome() && __version >= 24 && !__client.isNintendoBrowser();
  var __is_safari_vert_glyph_enable = __client.isSafari() && __version >= 5;
  var __is_firefox_vert_glyph_enable = __client.isFirefox() && __version >= 41;
  var __is_vertical_glyph_enable = (
    __is_chrome_vert_glyph_enable ||
    __is_safari_vert_glyph_enable ||
    __is_ie_vert_glyph_enable ||
    __is_firefox_vert_glyph_enable
  );
  var __is_text_combine_enable = (
    (__client.isChrome() && __version >= 47) ||
    //(__client.isIE() && __version >= 11) ||
    (__client.isSafari() && __version >= 9)
  );

  return {
    /**
     @memberof Nehan.Env
     @type {Nehan.Client}
     */
    client:__client,

    /**
     true if client browser supports css transform.

     @memberof Nehan.Env
     @type {boolean}
     */
    isTransformEnable : __is_transform_enable,

    /**
     true if client browser supports vertical glyph.

     @memberof Nehan.Env
     @type {boolean}
     */
    isVerticalGlyphEnable : __is_vertical_glyph_enable,

    /**
     true if client browser supports text-combine-upright

     @memberof Nehan.Env
     @type {boolean}
     */
    isTextCombineEnable : __is_text_combine_enable
  };
})();

/**
   @namespace Nehan.Class
*/
Nehan.Class = {};

/**
   @memberof Nehan.Class
   @param childCtor {Object}
   @param parentCtor {Object}
   @return {Object}
*/
Nehan.Class.extend = function(childCtor, parentCtor) {
  function TempCtor() {}
  TempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new TempCtor();
  childCtor.prototype.constructor = childCtor;
};


/**
 list utility module

 @namespace Nehan.List
 */
Nehan.List = {
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> ()
   */
  iter : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i], i) === false){
	break;
      }
    }
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> ()
   */
  reviter : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      if(fn(lst[i], i) === false){
	break;
      }
    }
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {boolean}
   */
  forall : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i], i) === false){
	return false;
      }
    }
    return true;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> obj
   @return {Array}
   */
  map : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret.push(fn(lst[i], i));
    }
    return ret;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param acm {foldable_value} - accumulator
   @param fn {Function} - fun acm -> obj -> acm
   @return {folded_value}
   */
  fold : function(lst, acm, fn){
    var ret = acm;
    for(var i = 0, len = lst.length; i < len; i++){
      ret = fn(ret, lst[i], i);
    }
    return ret;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {Array}
   */
  filter : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i], i)){
	ret.push(lst[i]);
      }
    }
    return ret;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {first_founded_object}
   */
  find : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj, i)){
	return obj;
      }
    }
    return null;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {first_founded_object}
   */
  revfind : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      var obj = lst[i];
      if(fn(obj, i)){
	return obj;
      }
    }
    return null;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {int}
   */
  indexOf : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj, i)){
	return i;
      }
    }
    return -1;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {boolean}
   */
  exists : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i], i)){
	return true;
      }
    }
    return false;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {boolean}
   @return {boolean}
   */
  mem : function(lst, val){
    for(var i = 0, len = lst.length; i < len; i++){
      if(lst[i] == val){
	return true;
      }
    }
    return false;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param start {Number}
   @param fn {Function}
   @return {Number}
   */
  sum : function(lst, start, fn){
    return this.fold(lst, start, function(ret, obj){
      return ret + fn(obj);
    });
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {Number}
   @return {min_obj}
   */
  minobj : function(lst, fn){
    var min_obj = null, min_val = null;
    this.iter(lst, function(obj, i){
      var val = fn(obj, i);
      if(min_val === null || val < min_val){
	min_obj = obj;
	min_val = val;
      }
    });
    return min_obj;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @param fn {Function} - fun obj -> {Number}
   @return {max_obj}
   */
  maxobj : function(lst, fn){
    var max_obj = null, max_val = null;
    this.iter(lst, function(obj, i){
      var val = fn(obj, i);
      if(max_val === null || val > max_val){
	max_obj = obj;
	max_val = val;
      }
    });
    return max_obj;
  },
  /**
   @memberof Nehan.List
   @param lst {Array}
   @return {last_object | null}
   */
  last : function(lst){
    var len = lst.length;
    if(len === 0){
      return null;
    }
    return lst[len - 1];
  },
  /**
   @memberof Nehan.List
   @param count {int} - array length
   @param init_val - initialized value filled in new array
   @return {Array}
   */
  create : function(count, init_val){
    var ret = [];
    for(var i = 0; i < count; i++){
      ret.push((typeof init_val !== "undefined")? init_val : i);
    }
    return ret;
  },
  /**
   @memberof Nehan.List
   @param lst1 {Array}
   @param lst2 {Array}
   @return {Array.<Array>}
   */
  zipArray : function(lst1, lst2){
    var ret = [];
    if(lst1.length !== lst2.length){
      throw "length not same:List.zipArray";
    }
    for(var i = 0; i < lst1.length; i++){
      ret[i] = [lst1[i], lst2[i]];
    }
    return ret;
  },
  /**
   @memberof Nehan.List
   @param props {Array}
   @param values {Array}
   @return {Object}
   @example
   * Nehan.List.zipObj(["a", "b", "c"], [1, 2, 3]); // {a:1, b:2, c:3}
   */
  zipObject : function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "length not same:List.zipObject";
    }
    for(var i = 0; i < props.length; i++){
      ret[props[i]] = values[i];
    }
    return ret;
  },
  /**
   non destructive reverse

   @memberof Nehan.List
   @param lst {Array}
   @return {Array}
   */
  reverse : function(lst){
    var ret = [];
    this.reviter(lst, function(obj){
      ret.push(obj);
    });
    return ret;
  }
};


/**
 object utility module

 @namespace Nehan.Obj
 */
Nehan.Obj = (function(){
  var __clone = function(obj){
    var copy;
    if(obj === null || typeof obj !== "object"){
      return obj;
    }
    if(obj instanceof Array) {
      copy = [];
      for(var i = 0; i < obj.length; i++){
        copy[i] = __clone(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Object) {
      copy = {};
      for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
	  copy[prop] = __clone(obj[prop]);
	}
      }
      return copy;
    }
    throw "Obj::clone(unsupported type)";
  };
  return {
    /**
     copy all value in [args] to [dst]
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} args
     @return {Object} copied dst
     */
    copy : function(dst, args){
      dst = dst || {};
      for(var prop in args){
	dst[prop] = args[prop];
      }
      return dst;
    },
    /**
     merge all value in [args] to [dst] with default value by [defaults]
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} defaults
     @param {Object} args
     @return {Object} merged dst
     */
    merge : function(dst, defaults, args){
      dst = dst || {};
      for(var prop in defaults){
	dst[prop] = (typeof args[prop] === "undefined")? defaults[prop] : args[prop];
      }
      return dst;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @return {bool}
     */
    isEmpty: function(obj){
      for(var name in obj){
	return false;
      }
      return true;
    },
    /**
     @memberof Nehan.Obj
     @param prop {String}
     @param value {Any}
     @return {Object}
     */
    createOne : function(prop, value){
      var obj = {};
      obj[prop] = value;
      return obj;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @return {Object}
     */
    clone: function(obj){
      return __clone(obj);
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> obj
     */
    map : function(obj, fn){
      var ret = {};
      this.iter(obj, function(prop, value){
	ret[prop] = fn(prop, value);
      });
      return ret;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> {bool}
     @return {bool}
     */
    exists : function(obj, fn){
      for(var prop in obj){
	if(fn(prop, obj[prop])){
	  return true;
	}
      }
      return false;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> {bool}
     */
    filter : function(obj, fn){
      var ret = {};
      this.iter(obj, function(prop, value){
	if(fn(prop, value)){
	  ret[prop] = value;
	}
      });
      return ret;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> ()
     */
    iter : function(obj, fn){
      for(var prop in obj){
	fn(prop, obj[prop]);
      }
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> {bool}
     */
    forall : function(obj, fn){
      for(var prop in obj){
	if(!fn(prop, obj[prop])){
	  return false;
	}
      }
      return true;
    }
  };
})();

/**
 misc utility module.

 @namespace Nehan.Utils
 */
Nehan.Utils = {
  /**
   convert [decial] number by [base]

   @memberof Nehan.Utils
   @param deciaml {int}
   @param base {int}
   @return {Array.<int>}
   */
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
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimHeadCRLF : function(str){
    return str.replace(/^[\r|\n]+/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimTailCRLF : function(str){
    return str.replace(/[\r|\n]+$/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimCRLF : function(str){
    return this.trimTailCRLF(this.trimHeadCRLF(str));
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trim : function(str){
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  cutQuote : function(str){
    return str.replace(/['\"]/g, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   @example
   * Nehan.Utils.capitalize("japan"); // "Japan"
   */
  capitalize : function(str){
    if(str === ""){
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  /**
   @memberof Nehan.Utils
   @param p1 {String}
   @param p2 {String}
   @example
   * Nehan.Utils.filenameConcat("/path/to", "foo"); // "/path/to/foo"
   * Nehan.Utils.filenameConcat("/path/to/", "foo"); // "/path/to/foo"
   */
  filenameConcat : function(p1, p2){
    p1 = (p1==="")? "" : (p1.slice(-1) === "/")? p1 : p1 + "/";
    p2 = (p2==="")? "" : (p2[0] === "/")? p2.substring(1, p2.length) : p2;
    return p1 + p2;
  },
  /**
   @memberof Nehan.Utils
   @param name {String}
   @example
   * Nehan.Utils.camelToChain("fontSize"); // "font-size"
   */
  camelToChain : function(name){
    return name.replace(/([A-Z])/g, function(match, p1){
      return "-" + p1.toLowerCase();
    });
  },
  /**
   @memberof Nehan.Utils
   @param name {String}
   @example
   * Nehan.Utils.camelize("font-size"); // "fontSize"
   */
  camelize : function(name){
    return (name.indexOf("-") < 0)? name : name.split("-").map(function(part, i){
      return (i === 0)? part : this.capitalize(part);
    }.bind(this)).join("");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   @param splitter {String}
   @return {Array<String>}
   */
  splitBy : function(str, splitter){
    if(str.indexOf(splitter) < 0){
      return [str];
    }
    return str.split(splitter);
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   @return {Array<String>}
   */
  splitBySpace : function(str){
    if(str.indexOf(" ") < 0){
      return [str];
    }
    return str.split(/\s+/);
  },
  /**
   @memberof Nehan.Utils
   @param value {Any}
   @return {bool}
   */
  isNumber : function(value){
    if(value === Infinity){
      return true;
    }
    if(typeof(value) != "number" && typeof(value) != "string"){
      return false;
    }
    return (value == parseFloat(value) && isFinite(value));
  },
  /**
   @memberof Nehan.Utils
   @param em {float}
   @return {int}
   */
  getEmSize: function(em, base_size){
    return Math.round(base_size * em);
  },
  /**
   @memberof Nehan.Utils
   @param pt {float}
   @return {int}
   */
  getPxFromPt: function(pt){
    return Math.round(pt * 4 / 3);
  },
  /**
   @memberof Nehan.Utils
   @param pt {float}
   @parma max_value {int}
   @return {int}
   */
  getPercentValue : function(percent, max_value){
    return Math.round(max_value * percent / 100);
  },
  /**
   @memberof Nehan.Utils
   @param text {String}
   @param letter_modifier {Function} first_letter:string -> string
   @return {String}
   */
  replaceFirstLetter : function(text, letter_modifier){
    return text.replace(/(^(<[^>]+>|[\s\n])*)(\S)/mi, function(match, p1, p2, p3){
      return p1 + letter_modifier(p3);
    });
  },
  /**
   @memberof Nehan.Utils
   @param char_ref {String}
   @return {int}
   @example
   * Nehan.Utils.charCodeOfCharRef("&#xFB00;"); // => 64256
   * Nehan.Utils.charCodeOfCharRef("&#64256;"); // => 64256
   */
  charCodeOfCharRef : function(char_ref){
    if(char_ref.indexOf("&#x") === 0){
      return parseInt(char_ref.replace("&#x", "").replace(";", ""), 16);
    }
    return parseInt(char_ref.replace("&#", "").replace(";", ""), 10);
  },
  /**
   @memberof Nehan.Utils
   @param char_ref {String}
   @return {bool}
   */
  isNumCharRef : function(char_ref){
    return /&#x?[0-9a-f]{4,};/i.test(char_ref);
  },
  /**
   @memberof Nehan.Utils
   @param char_ref {String}
   @return {String}
   */
  charRefToUni : function(char_ref){
    if(!this.isNumCharRef(char_ref)){
      return char_ref;
    }
    return String.fromCharCode(this.charCodeOfCharRef(char_ref));
  }
};

/**
   some set of usefull constant variables.
   @namespace Nehan.Const
*/
Nehan.Const = {
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssVenderPrefixes:[
    "-moz",
    "-webkit",
    "-o",
    "-ms"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssPhysicalBoxDirs:[
    "top",
    "right",
    "bottom",
    "left"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssLogicalBoxDirs:[
    "before",
    "end",
    "after",
    "start"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssPhysicalBoxCorders:[
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssLogicalBoxCorners:[
    "before-start",
    "before-end",
    "after-end",
    "after-start"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<int>}
  */
  css2dIndex:{
    1:[0, 0],
    2:[0, 1]
  },
  /**
     @memberof Nehan.Const
     @type {Array.<int>}
  */
  css4dIndex:{
    1:[0, 0, 0, 0],
    2:[0, 1, 0, 1],
    3:[0, 1, 2, 1],
    4:[0, 1, 2, 3]
  },
  /**
     @memberof Nehan.Const
     @type {string}
  */
  space:"&nbsp;",
  /**
     @memberof Nehan.Const
     @type {string}
  */
  clearFix:"<div style='clear:both'></div>"
};

/**
   css utility module
   @namespace Nehan.Css
*/
Nehan.Css = {
  normalizeKey : function(key){
    return Nehan.Utils.trim(key)
      .toLowerCase()
      .replace(/\s+/g, " ") // many space -> single space
      .replace(/\s+,/g, ",") // cut space around comma before
      .replace(/,\s+/g, ",") // cut space around comma after
      .replace(/\s+\(/g, "(") // cut space around left paren before
      .replace(/\(\s+/g, "(") // cut space around left paren after
    ;
  },
  /**
   @memberof Nehan.Css
   @param str {String}
   @return {String}
   */
  normalizeValue : function(str){
    return str
      .replace(/;/g, "") // disable terminater
      .replace(/^\s+/, "") // cut head space
      .replace(/\s+$/, "") // cut tail space
      .replace(/\s+/g, " ") // many space -> single space
      .replace(/\s+,/g, ",") // cut space around comma before
      .replace(/,\s+/g, ",") // cut space around comma after
      .replace(/\s+\//g, "/") // cut space around slash before
      .replace(/\/\s+/g, "/") // cut space around slash after
      .replace(/\s+\(/g, "(") // cut space around left paren before
      .replace(/\(\s+/g, "(") // cut space around left paren after
      .replace(/\s+\)/g, ")") // cut space around right paren before
      .replace(/\)\s+/g, ")") // cut space around right paren after
    ;
  },
  /**
   @memberof Nehan.Css
   @param css_image_url{String}
   @return {String}
   @example
   * Nehan.Css.getImageURL("url('foo.png')"); // => 'foo.png'
   */
  getImageURL : function(css_image_url){
    return css_image_url
      .replace(/url/gi, "")
      .replace(/'/g, "")
      .replace(/"/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/\s/g, "")
    ;
  },
  /**
   @memberof Nehan.Css
   @param name {String}
   @return {String}
   @example
   * Nehan.Css.addNehanPrefix("foo"); // "nehan-foo"
   */
  addNehanPrefix : function(name){
    return (name.indexOf("nehan-") === 0)? name : "nehan-" + name;
  },
  /**
   @memberof Nehan.Css
   @param name {String}
   @return {String}
   @example
   * Nehan.Css.addNehanHeaderPrefix("foo"); // "nehan-header-foo"
   */
  addNehanHeaderPrefix : function(name){
    return "nehan-header-" + name;
  },
  /**
   @memberof Nehan.Css
   @param name {String}
   @return {String}
   @example
   * Nehan.Css.addNehanTocLinkPrefix("foo"); // "nehan-toc-link-foo"
   */
  addNehanTocLinkPrefix : function(name){
    return "nehan-toc-link-" + name;
  }
};

/**
 html utility module

 @namespace Nehan.Html
 */
Nehan.Html = {
  /**
   escape special text like &lt;, &gt;, etc.

   @memberof Nehan.Html
   @method escape
   @param str {String}
   @return {String}
   */
  escape : function(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
  },
  /**
   unescape special text.

   @memberof Nehan.Html
   @method unescape
   @param str {String}
   @return {String}
   */
  unescape : function(str) {
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/ /g, "&nbsp;")
      .replace(/\r/g, "&#13;")
      .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
  },
  /*
   generate html attribute string

   @memberof Nehan.Html
   @method attr
   @param args {Object}
   @return {String}
   @example
   * Nehan.Html.attr({width:"100", height:"200"}); // width='100' height = '200'
   */
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      if(typeof args[prop] !== "undefined" && args[prop] !== ""){
	tmp.push(prop + "='" + this.escape(args[prop] + "") + "'");
      }
    }
    return (tmp == [])? "" : tmp.join(" ");
  },
  /**
   generate html tag string

   @memberof Nehan.Html
   @method tagWrap
   @param name {String} - tag name
   @param content {String} - tag content text
   @param args {Object} - tag attributes
   @return {String}
   @example
   * Nehan.Html.tagWrap("a", "homepage", {href:"#"}); // "<a href='#'>homepage</a>"
   */
  tagWrap : function(name, content, args){
    return [this.tagStart(name, args || {}), content, this.tagEnd(name)].join("");
  },
  /**
   generate unwrapped single html tag string

   @memberof Nehan.Html
   @method tagSingle
   @param name {String} - tag name
   @param args {Object} - tag attributes
   @return {String}
   @example
   * Nehan.Html.tagSingle("img", {src:"/path/to/img"}); // "<img src='/path/to/img' />"
   */
  tagSingle : function(name, args){
    return "<" + name + " " + this.attr(args) + "/>";
  },
  /**
   generate open tag string

   @memberof Nehan.Html
   @method tagStart
   @return {String}
   @param name {String} - tag name
   @param args {Object} - tag attributes
   @example
   * Nehan.Html.tagStart("div"); // "<div>"
   */
  tagStart : function(name, args){
    return "<" + name + " " + this.attr(args) + ">";
  },
  /**
   generate enclose tag string

   @memberof Nehan.Html
   @method tagEnd
   @return {String}
   @param name {String} - tag name
   @example
   * Nehan.Html.tagEnd("div"); // "</div>"
   */
  tagEnd : function(name){
    return "</" + name + ">";
  },
  /**
   normalize html text
   @memberof Nehan.Html
   @method normalize
   @return {String}
   @param name {String} - html text
   */
  normalize : function(text){
    return text
      .replace(/\r/g, "") // discard CR
      .replace(/<!--[\s\S]*?-->/g, "") // discard comment
      .replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
      .replace(/<rb>/gi, "") // discard rb
      .replace(/<\/rb>/gi, "") // discard /rb
      .replace(/<rt><\/rt>/gi, ""); // discard empty rt
  }
};

Nehan.Uri = (function(){
  /**
   @memberof Nehan
   @class Uri
   @classdesc abstraction of URI. 
   @constructor
   @param address {String}
   */
  function Uri(address){
    this.address = this._normalize(address || "");
  }

  Uri.prototype._normalize = function(address){
    return address.replace(/\s/g, "");
  };
  /**
   @memberof Nehan.Uri
   @return {String}
   @example
   * new Uri("http://example.com/top#foo").getAddress(); // "http://example.com/top#foo"
   */
  Uri.prototype.getAddress = function(){
    return this.address;
  };
  /**
   @memberof Nehan.Uri
   @return {String}
   @example
   * new Uri("http://example.com/top#foo").getAnchorName(); // "foo"
   */
  Uri.prototype.getAnchorName = function(){
    var sharp_pos = this.address.indexOf("#");
    if(sharp_pos < 0){
      return "";
    }
    var anchor_name = this.address.substring(sharp_pos + 1);
    return (anchor_name.length > 0)? anchor_name : "";
  };

  return Uri;
})();


Nehan.TagAttrLexer = (function(){
  var __rex_symbol = /[^=\s]+/;

  /**
     @memberof Nehan
     @class TagAttrLexer
     @classdesc tag attribute string lexer
     @constructor
     @param src {String}
     @description <pre>
     * [src] is attribute string of original tag source.
     * so if tag source is "<div class='nehan-float-start'>",
     * then [src] is "class='nehan-float-start'".
     </pre>
  */
  function TagAttrLexer(src){
    this.buff = src;
    this._error = false;
  }

  /**
   @memberof Nehan.TagAttrLexer
   @return {boolean}
   */
  TagAttrLexer.prototype.isEnd = function(){
    return this._error || (this.buff === "");
  };
  /**
   @memberof Nehan.TagAttrLexer
   @return {symbol}
   */
  TagAttrLexer.prototype.get = function(){
    var c1 = this._peek();
    if(c1 === null){
      return null;
    }
    switch(c1){
    case "=":
      this._step(1);
      return c1;
    case "'": case "\"":
      return this._getLiteral(c1);
    case " ":
      this._step(1);
      return this.get(); // skip space
    default:
      return this._getSymbol();
    }
  };

  TagAttrLexer.prototype._peek = function(){
    return this.buff? this.buff.charAt(0) : null;
  };

  TagAttrLexer.prototype._step = function(length){
    this.buff = this.buff.substring(length);
  };

  TagAttrLexer.prototype._getSymbol = function(){
    var match = this.buff.match(__rex_symbol);
    var symbol = match? match[0] : null;
    if(symbol){
      this._step(symbol.length);
    }
    return symbol;
  };

  TagAttrLexer.prototype._getLiteral = function(quote_char){
    var quote_end_pos = this.buff.indexOf(quote_char, 1);
    if(quote_end_pos < 0){
      console.error("TagAttrLexer::syntax error:literal not closed(%s)", this.buff);
      this._error = true;
      return null;
    }
    var literal = this.buff.substring(1, quote_end_pos);
    this._step(quote_end_pos + 1);
    return literal;
  };

  return TagAttrLexer;
})();


/**
   @memberof Nehan
   @namespace Nehan.TagAttrParser
*/
Nehan.TagAttrParser = {
  /**
     @memberof Nehan.TagAttrParser
     @param src {string}
     @return {Object}
  */
  parse : function(src){
    var lexer = new Nehan.TagAttrLexer(src);
    var token = null, prop = null, attrs = {};
    var assign = function(prop, value){
      attrs[prop] = String(value); // right value is always string
    };
    while(prop !== null || !lexer.isEnd()){
      token = lexer.get();
      if(token === null){
	if(prop){
	  assign(prop, true);
	  prop = null;
	}
      } else if(token === "=" && prop){
	assign(prop, lexer.get() || true);
	prop = null;
      } else if(prop){
	// value without right value like 'checked', 'selected' etc.
	assign(prop, true);
	prop = token;
      } else if(token && token !== "="){
	prop = token;
      }
    }
    return attrs;
  }
};

Nehan.TagAttrs = (function(){
  /**
   @memberof Nehan
   @class TagAttrs
   @classdesc tag attribute set wrapper
   @constructor
   @param src {String}
   */
  function TagAttrs(src){
    var attrs_raw = src? Nehan.TagAttrParser.parse(src) : {};
    this.classes = this._parseClasses(attrs_raw);
    this.attrs = this._parseAttrs(attrs_raw);
    this.dataset = this._parseDataset(attrs_raw);
  }

  /**
   @memberof Nehan.TagAttrs
   @param name {String} - attribute name
   @return {boolean}
   */
  TagAttrs.prototype.hasAttr = function(name){
    if(name === "class"){
      return this.classes.length > 0;
    }
    return (typeof this.attrs[name] !== "undefined");
  };
  /**
   @memberof Nehan.TagAttrs
   @param klass {String} - css class name
   @return {boolean}
   */
  TagAttrs.prototype.hasClass = function(klass){
    return Nehan.List.exists(this.classes, Nehan.Closure.eq(klass));
  };
  /**
   @memberof Nehan.TagAttrs
   @param klass {String} - css class name
   @return {Array.<String>} current css classes
   */
  TagAttrs.prototype.addClass = function(klass){
    if(!this.hasClass(klass)){
      this.classes.push(klass);
      this.setAttr("class", [this.getAttr("class"), klass].join(" "));
    }
    return this.classes;
  };
  /**
   @memberof Nehan.TagAttrs
   @param klass {String} - css class name(prefiex by "nehan-")
   */
  TagAttrs.prototype.removeClass = function(klass){
    this.classes = this.classes.filter(function(cls){
      return cls != klass;
    });
    this.setAttr("class", this.classes.join(" "));
    return this.classes;
  };
  /**
   @memberof Nehan.TagAttrs
   @param name {String}
   @param def_value {default_value}
   @return {attribute_value}
   */
  TagAttrs.prototype.getAttr = function(name, def_value){
    if(name === "class"){
      return this.classes;
    }
    def_value = (typeof def_value === "undefined")? null : def_value;
    return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
  };
  /**
   get dataset value

   @memberof Nehan.TagAttrs
   @param name {String}
   @param def_value {default_value}
   @return {dataset_value}
   */
  TagAttrs.prototype.getData = function(name, def_value){
    def_value = (typeof def_value === "undefined")? null : def_value;
    return (typeof this.dataset[name] === "undefined")? def_value : this.dataset[name];
  };
  /**
   get cache key

   @memberof Nehan.TagAttrs
   @param name {String}
   @return {string}
   */
  TagAttrs.prototype.getKey = function(){
    var props = Object.keys(this.attrs).sort();
    return props.map(function(prop){
      return prop + "=" + this.attrs[prop];
    }.bind(this)).join("&");
  };
  /**
   @memberof Nehan.TagAttrs
   @param name {String}
   @param value {Any}
   */
  TagAttrs.prototype.setAttr = function(name, value){
    value = (typeof value === "string")? value : String(value);
    if(name.indexOf("data-") === 0){
      this.dataset[this._parseDatasetName(name)] = value;
    } else {
      this.attrs[name] = value;
    }
  };

  // <p class='hi hey'>
  // => ["nehan-hi", "nehan-hey"]
  TagAttrs.prototype._parseClasses = function(attrs_raw){
    var class_name = attrs_raw["class"] || "";
    class_name = Nehan.Utils.trim(class_name.replace(/\s+/g, " "));
    var classes = (class_name === "")? [] : class_name.split(/\s+/);

    // replace 'nehan-' prefix for backword compatibility(version <= 5.1.0).
    return classes.map(function(klass){
      return (klass.indexOf("nehan-") === 0)? klass.replace("nehan-", "") : klass;
    }); 
  };

  TagAttrs.prototype._parseAttrs = function(attrs_raw){
    var attrs = {};
    Nehan.Obj.iter(attrs_raw, function(name, value){
      if(name.indexOf("data-") < 0){
	attrs[name] = value;
      }
    });
    return attrs;
  };

  TagAttrs.prototype._parseDataset = function(attrs_raw){
    var dataset = {};
    for(var name in attrs_raw){
      if(name.indexOf("data-") === 0){
	dataset[this._parseDatasetName(name)] = attrs_raw[name];
      }
    }
    return dataset;
  };

  TagAttrs.prototype._parseDatasetName = function(name_raw){
    return Nehan.Utils.camelize(name_raw.slice(5));
  };

  return TagAttrs;
})();


// Important Notice:
// to avoid name-conflicts about existing name space of stylesheet,
// all class names and id in nehan.js are forced to be prefixed by "nehan-" when evaluated.
Nehan.Tag = (function (){
  /**
   @memberof Nehan
   @class Tag
   @classdesc abstraction of html tag markup.
   @constructor
   @param src {String} - string of markup part like "&lt;div class='foo'&gt;"
   @param content {String} - content text of markup
   @param pseudo_class {Object} - use this to force setting pseudo class
  */
  function Tag(src, content, pseudo_class){
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attrs = this._parseTagAttrs(this.name, this.src);
    this._key = this._createKey();
    Nehan.Obj.merge(this, {
      firstChild:false,
      firstOfType:false,
      lastChild:false,
      lastOfType:false,
      onlyChild:false,
      onlyOfType:false
    }, pseudo_class || {});
  }

  /**
   @memberof Nehan.Tag
   @return {Nehan.Tag}
   */
  Tag.prototype.clone = function(){
    return new Tag(this.src, this.content);
  };
  /**
   @memberof Nehan.Tag
   @param content {String}
   */
  Tag.prototype.setContent = function(content){
    if(this._fixed){
      return;
    }
    this.content = content;
  };
  /**
   @memberof Nehan.Tag
   @param status {boolean}
   */
  Tag.prototype.setContentImmutable = function(status){
    this._fixed = status;
  };
  /**
   @memberof Nehan.Tag
   @param name {String} - alias markup name
   */
  Tag.prototype.setAlias = function(name){
    this.alias = name;
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param value {attribute_value}
   */
  Tag.prototype.setAttr = function(name, value){
    this.attrs.setAttr(name, value);
  };
  /**
   @memberof Nehan.Tag
   @param attrs {Object}
   */
  Tag.prototype.setAttrs = function(attrs){
    for(var name in attrs){
      this.setAttr(name, attrs[name]);
    }
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setFirstChild = function(status){
    this.firstChild = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setOnlyChild = function(status){
    this.onlyChild = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setOnlyOfType = function(status){
    this.onlyOfType = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setFirstOfType = function(status){
    this.firstOfType = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setLastChild = function(status){
    this.lastChild = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setLastOfType = function(status){
    this.lastOfType = status;
  };
  /**
   @memberof Nehan.Tag
   @param klass {String}
   */
  Tag.prototype.addClass = function(klass){
    this.attrs.addClass(klass);
  };
  /**
   @memberof Nehan.Tag
   @param klass {String}
   */
  Tag.prototype.removeClass = function(klass){
    this.attrs.removeClass(klass);
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getId = function(){
    return this.attrs.getAttr("id");
  };
  /**
   @memberof Nehan.Tag
   @return {Array.<String>}
   */
  Tag.prototype.getClasses = function(){
    return this.attrs.classes;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getName = function(){
    return this.alias || this.name;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getPseudoElementName = function(){
    var name = this.getName();
    if(name.indexOf("::") < 0){
      return "";
    }
    return name.replace("::", "");
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getPath = function(){
    var path = this.getName();
    var id = this.getId();
    if(id){
      path += "#" + id;
    }
    var classes = this.getClasses();
    if(classes.length > 0){
      path += "." + classes.join(".");
    }
    return path;
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param def_value {default_value}
   @return {attribute_value}
   */
  Tag.prototype.getAttr = function(name, def_value){
    return this.attrs.getAttr(name, def_value);
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param def_value {default_value}
   @return {dataset_value}
   */
  Tag.prototype.getData = function(name, def_value){
    return this.attrs.getData(name, def_value);
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getContent = function(){
    return this.content;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getSrc = function(){
    return this.src;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getWrapSrc = function(){
    if(this.content === ""){
      return this.src;
    }
    return this.src + this.content + "</" + this.name + ">";
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getKey = function(){
    return this._key;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.hasClass = function(klass){
    return this.attrs.hasClass(klass);
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @return {boolean}
   */
  Tag.prototype.hasAttr = function(name){
    return this.attrs.hasAttr(name);
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isHeaderTag = function(){
    return Nehan.List.exists(["h1", "h2", "h3", "h4", "h5", "h6"], Nehan.Closure.eq(this.name));
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isAnchorTag = function(){
    return this.name === "a" && this.getTagAttr("name") !== null;
  };
  /**
   @memberof Nehan.Tag
   */
  Tag.prototype.isAnchorLinkTag = function(){
    var href = this.getTagAttr("href");
    return this.name === "a" && href && href.indexOf("#") >= 0;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isPageBreakTag = function(){
    return this.name === "page-break";
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isCloseTag = function(){
    return this.name.charAt(0) === "/";
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isSingleTag = function(){
    return this._single || false;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isEmpty = function(){
    return this.content === "";
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isFirstChild = function(){
    return this.firstChild;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isOnlyChild = function(){
    return this.onlyChild;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isOnlyOfType = function(){
    return this.onlyOfType;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isFirstOfType = function(){
    return this.firstOfType;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isLastChild = function(){
    return this.lastChild;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isLastOfType = function(){
    return this.lastOfType;
  };

  Tag.prototype._getTagAttrSrc = function(src){
    return src
      .replace(/<[\S]+/, "") // cut tag start
      .replace(/^\s+/, "") // cut head space
      .replace("/>", "") // cut tag tail(single tag)
      .replace(">", "") // cut tag tail(normal tag)
      .replace(/\s+$/, "") // cut tail space
      .replace(/\n/g, " ") // conv from multi line to single space
      .replace(/[　|\s]+/g, " ") // conv from multi space to single space
      .replace(/\s+=/g, "=") // cut multi space before '='
      .replace(/=\s+/g, "="); // cut multi space after '='
  };

  Tag.prototype._createKey = function(){
    return this.getName() + "[" + this.attrs.getKey() + "]";
  };

  Tag.prototype._parseName = function(src){
    return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
  };

  Tag.prototype._parseTagAttrs = function(tag_name, tag_src){
    var attr_src = this._getTagAttrSrc(tag_src);
    if(tag_name.length === attr_src.length){
      return new Nehan.TagAttrs("");
    }
    return new Nehan.TagAttrs(attr_src);
  };

  return Tag;
})();


/**
 closure factory
 @namespace Nehan.Closure
 */
Nehan.Closure = {
  /**
   @memberof Nehan.Closure
   @return {Function}
   @example
   * var echo = Nehan.Closure.id;
   * echo(1); // 1
   * echo("yo"); // "yo"
   */
  id : function(x){
    return x;
  },
  /**
   @memberof Nehan.Closure
   @return {Function}
   @example
   * var is_one = Nehan.Closure.eq(1);
   * is_one(1); // true
   * is_one(2); // false
   */
  eq : function(x){
    return function(y){
      return x === y;
    };
  },
  /**
   @memberof Nehan.Closure
   @return {Function}
   @example
   * var is_not_one = Nehan.Closure.neq(1);
   * is_not_one(1); // false
   * is_not_one(2); // true
   */
  neq : function(x){
    return function(y){
      return x !== y;
    };
  },
  isTagName : function(names){
    return function(token){
      if(token instanceof Nehan.Tag === false){
	return false;
      }
      var tag_name = token.getName();
      return Nehan.List.exists(names, function(name){
	return name === tag_name;
      });
    };
  }
};

Nehan.Set = (function(){
  /**
   @memberof Nehan
   @class Set
   @constructor
   */
  function Set(){
    this.values = [];
  }

  /**
   @memberof Nehan.Set
   @param {Function} value -> index -> ()
   */
  Set.prototype.iter = function(fn){
    this.values.forEach(fn);
  };

  /**
   @memberof Nehan.Set
   @return {int}
   */
  Set.prototype.length = function(){
    return this.values.length;
  };

  /**
   @memberof Nehan.Set
   @return {bool}
   */
  Set.prototype.isEmpty = function(value){
    return this.length() === 0;
  };

  /**
   @memberof Nehan.Set
   @param value {Any}
   @return {bool}
   */
  Set.prototype.exists = function(value){
    return Nehan.List.exists(this.values, Nehan.Closure.eq(value));
  };

  /**
   @memberof Nehan.Set
   @param value {Any}
   @return {Nehan.Set}
   */
  Set.prototype.remove = function(value){
    var index = Nehan.List.indexOf(this.values, Nehan.Closure.eq(value));
    if(index >= 0){
      this.values.splice(index, 1);
    }
    return this;
  };

  /**
   @memberof Nehan.Set
   @param value {Any}
   @return {Nehan.Set}
   */
  Set.prototype.add = function(value){
    if(!this.exists(value)){
      this.values.push(value);
    }
    return this;
  };

  /**
   @memberof Nehan.Set
   @param values {Array}
   @return {Nehan.Set}
   */
  Set.prototype.addValues = function(values){
    values.forEach(function(value){
      this.add(value);
    }.bind(this));
    return this;
  };

  /**
   @memberof Nehan.Set
   @param set {Nehan.Set}
   @return {Nehan.Set}
   */
  Set.prototype.union = function(set){
    var union_values = this.values.concat(); // create cloned array
    set.iter(function(value){
      if(!this.exists(value)){
	union_values.push(value);
      }
    }.bind(this));
    var union_set = new Set();
    union_set.values = union_values;
    return union_set;
  };

  /**
   @memberof Nehan.Set
   @return {Array}
   */
  Set.prototype.getValues = function(){
    return this.values;
  };

  return Set;
})();


Nehan.LowerNameSet = (function(){
  /**
   @memberof Nehan
   @class LowerNameSet
   @constructor
   */
  function LowerNameSet(){
    Nehan.Set.call(this);
  }
  Nehan.Class.extend(LowerNameSet, Nehan.Set);

  /**
   @memberof Nehan.LowerNameSet
   @param value {String}
   @return {Nehan.LowerNameSet}
   */
  LowerNameSet.prototype.add = function(name){
    return Nehan.Set.prototype.add.call(this, name.toLowerCase());
  };

  return LowerNameSet;
})();

Nehan.HashSet = (function(){
  /**
   @memberof Nehan
   @class HashSet
   @classdesc abstraction of (key, value) set.
   @constructor
   */
  function HashSet(values){
    this._values = Nehan.Obj.clone(values || {});
  }

  /**
   @memberof Nehan.HashSet
   @param fn {Function}
   */
  HashSet.prototype.iter = function(fn){
    Nehan.Obj.iter(this._values, fn);
  };
  /**
   merge new value to old value with same key. simply overwrite by default.

   @memberof Nehan.HashSet
   @param old_value
   @param new_value
   */
  HashSet.prototype.merge = function(old_value, new_value){
    return new_value;
  };
  /**
   return union set between this and [set].

   @memberof Nehan.HashSet
   @param set {Nehan.HashSet}
   */
  HashSet.prototype.union = function(set){
    set.iter(function(key, value){
      this.add(key, value);
    }.bind(this));
    return this;
  };
  /**
   get value by name(key).

   @memberof Nehan.HashSet
   @name {String}
   @return {value}
   */
  HashSet.prototype.get = function(name){
    return this._values[name] || null;
  };
  /**
   get all value by name(key).

   @memberof Nehan.HashSet
   @name {String}
   @return {Object}
   */
  HashSet.prototype.getValues = function(){
    return this._values;
  };
  /**
   add [value] by [name]. HashSet::merge is called if [name] is already registered.

   @memberof Nehan.HashSet
   @param name {String}
   @param value
   @return {Nehan.HashSet}
   */
  HashSet.prototype.add = function(name, value){
    var old_value = this._values[name] || null;
    var new_value = old_value? this.merge(old_value, value) : value;
    this._values[name] = new_value;
    return this;
  };
  /**
   * this function is used when performance matters,<br>
   * instead of using this.union(new HashSet(values))

   @memberof Nehan.HashSet
   @param values {Array}
   @return {Nehan.HashSet}
   */
  HashSet.prototype.addValues = function(values){
    for(var prop in values){
      this.add(prop, values[prop]);
    }
    return this;
  };
  /**
   remove value associated with [name].

   @memberof Nehan.HashSet
   @param name {String}
   @return {Nehan.HashSet}
   */
  HashSet.prototype.remove = function(name){
    this._values[name] = null;
    delete this._values[name];
    return this;
  };

  return HashSet;
})();




Nehan.CssHashSet = (function(){
  /**
     @memberof Nehan
     @class CssHashSet
     @classdesc hash set for css
     @extends {Nehan.HashSet}
  */
  function CssHashSet(values){
    Nehan.HashSet.call(this, values);
  }
  Nehan.Class.extend(CssHashSet, Nehan.HashSet);

  /**
     add [value] by [name]. CssHashSet::merge is called if [name] is already registered.

     @memberof Nehan.CssHashSet
     @param name {String} - css property name(camel-cased, or chain-cased)
     @param value
  */
  CssHashSet.prototype.add = function(name, value){
    Nehan.HashSet.prototype.add.call(this, name, value);
  };

  /**
   * merge css value<br>
   * 1. if old_value is object, merge each properties.<br>
   * 2. other case, simplly overwrite new_value to old_value(even if new_value is function).<br>

   @memberof Nehan.CssHashSet
   @method merge
   @param old_value
   @param new_value
  */
  CssHashSet.prototype.merge = function(old_value, new_value){
    if(typeof old_value === "object" && typeof new_value === "object"){
      return Nehan.Obj.copy(old_value, new_value);
    }
    return new_value;
  };

  return CssHashSet;
})();

/**
 @namespace Nehan.CssEdgeParser
 */
Nehan.CssEdgeParser = (function(){
  var __parse_edge_array = function(ary){
    switch(ary.length){
    case 0:  return {};
    case 1:  return {before:ary[0], end:ary[0], after:ary[0], start:ary[0]};
    case 2:  return {before:ary[0], end:ary[1], after:ary[0], start:ary[1]};
    case 3:  return {before:ary[0], end:ary[1], after:ary[2], start:ary[1]};
    default: return {before:ary[0], end:ary[1], after:ary[2], start:ary[3]};
    }
  };

  var __parse_unit = function(value){
    if(typeof value === "number"){
      return String(value);
    }
    if(typeof value === "string"){
      return value;
    }
    if(typeof value === "function"){
      return value;
    }
    console.error("invalid edge value unit:%o", value);
    throw "invalid edge format";
  };

  var __parse_set = function(value){
    if(value instanceof Array){
      return __parse_edge_array(value);
    }
    if(typeof value === "object"){
      return value;
    }
    if(typeof value === "function"){
      return value;
    }
    if(typeof value === "number"){
      return __parse_set(value.toString());
    }
    if(typeof value === "string"){
      if(value === "" || value === " "){
	return {};
      }
      return __parse_edge_array(Nehan.Utils.splitBySpace(value));
    }
    console.error("invalid edge value shorthand:%o", value);
    throw "invalid edge format";
  };

  return {
    /**
     @memberof Nehan.CssEdgeParser
     @param css_prop {Nehan.CssProp}
     @param css_value {Object} - normalized but unformatted css value
     @return {Object} - css value
     */
    formatValue : function(css_prop, value){
      // ("margin-start", "1em") => {start:"1em"}
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(value));
      }
      return __parse_set(value);
    }
  };
})();

/**
 @namespace Nehan.CssBorderRadiusParser
 */
Nehan.CssBorderRadiusParser = (function(){
  // values:[a,b]
  // indecies: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var __map_index = function(values, indecies){
    return indecies.map(function(index){
      return values[index];
    });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var __extend2 = function(values){
    var indecies = Nehan.Const.css2dIndex[Math.min(values.length, 2)] || [];
    return __map_index(values, indecies);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0,1,0,1]
  // values:[0,1,2] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var __extend4 = function(values){
    var indecies = Nehan.Const.css4dIndex[Math.min(values.length, 4)] || [];
    return __map_index(values, indecies);
  };

  var __obj_of_array = function(ary){
    return Nehan.List.zipObject(Nehan.Const.cssLogicalBoxCorners, ary);
  };

  var __parse_shorthand = function(str){
    if(str === ""){
      return {};
    }
    var xy = Nehan.Utils.splitBy(str, "/");
    var values_2d = __extend2(xy);
    var values_2x4d = values_2d.map(function(x_or_y_str){
      var x_or_y = Nehan.Utils.splitBySpace(x_or_y_str);
      return __extend4(x_or_y);
    });
    var values = Nehan.List.zipArray(values_2x4d[0], values_2x4d[1]);
    return __obj_of_array(values);
  };

  // [1]           -> [[1,1], [1,1], [1,1], [1,1]]
  // [1,2]         -> [[1,1], [2,2], [1,1], [2,2]]
  // [[1],[2]]     -> [[1,2], [1,2], [1,2], [1,2]]
  // [[1,2],[3,4]] -> [[1,3], [2,4], [1,3], [2,4]]
  var __parse_array = function(ary){
    if(ary.length === 0){
      return {};
    }
    // array of array
    if(ary[0] instanceof Array){
      var v2x4d = __extend2(ary.map(__extend4));
      return __obj_of_array(Nehan.List.zipArray(v2x4d[0], v2x4d[1]));
    }
    return __obj_of_array(__extend4(ary.map(__extend2)));
  };

  var __parse_unit = function(value){
    return __extend2(Nehan.Utils.splitBy(value, "/"));
  };

  var __parse_set = function(value){
    if(value instanceof Array){
      return __parse_array(value);
    }
    if(typeof value === "object"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_shorthand(value);
    }
    console.error("invalid border-radius:%o", value);
    return {};
  };

  return {
    /**
     @memberof Nehan.CssBorderRadiusParser
     @param css_prop {Nehan.CssProp}
     @param value {Object} - unformatted css value object
     @return {Object} - formatted css value object
     */
    formatValue : function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(value));
      }
      return __parse_set(value);
    }
  };
})();

Nehan.CssFontParser = (function(){
  var __parse_size_and_height = function(value){
    var css = {};
    var parts = Nehan.Utils.splitBy(value, "/");
    switch(parts.length){
    case 1:
      css["size"] = parts[0];
      break;
    case 2:
      css["size"] = parts[0];
      css["line-height"] = parts[1];
      break;
    }
    return css;
  };

  // [font-style] [font-variant] [font-weight] [font-size]/[line-height] [font-family];
  /*
   font: 14px Georgia, serif;
   font: 14px/1.4 Georgia, serif;
   font: italic lighter 14px/1.4 Georgia, serif;
   font: italic small-caps lighter 14px/1.4 Georgia, serif;
  */
  var __parse_shorthand = function(str){
    var font = {};
    Nehan.Utils.splitBySpace(str).forEach(function(value, index){
      if(value.indexOf("/") >= 0){
	Nehan.Obj.copy(font, __parse_size_and_height(value));
	return;
      }
      switch(value){
      case "normal": break; // (style, variant, weight)
      case "inherit": break; // (style, variant, weight)
      case "initial": break; // (style, variant, weight)
      case "italic":
      case "oblique":
	font.style = value;
	break;
      case "small-caps":
	font.variant = value;
	break;
      case "bold":
      case "bolder":
      case "lighter":
	font.weight = value;
	break;
      case "caption":
      case "icon":
      case "menu":
      case "message-box":
      case "small-caption":
      case "status-bar":
	break; // ignore
      default: // <font-family> or <number:font-weight>
	// weight is already define, or [px, pt, em, rem, %] are included.
	if(!font.size && (value.indexOf("px") >= 0 || value.indexOf("pt") >= 0 || value.indexOf("em") >= 0 || value.indexOf("%") >= 0)){
	  font.size = value;
	} else if(Nehan.Utils.isNumber(value)){
	  font.weight = value;
	} else {
	  font.family = value;
	}
	break;
      }
    });
    return font;
  };

  var __parse_unit = function(value){
    return value;
  };

  var __parse_set = function(value){
    if(typeof value === "object" || typeof value === "function"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_shorthand(value);
    }
    console.error("invalid font value:%o", value);
    throw "invalid font value";
  };

  return {
    /**
     @memberof Nehan.CssFontParser
     @param css_prop {Nehan.CssProp}
     @return {Object} - css value
     */
    formatValue: function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(value));
      }
      return __parse_set(value);
    }
  };
})();

/**
 @namespace Nehan.CssTextEmphaParser
 */
Nehan.CssTextEmphaParser = (function(){
  // <'text-emphasis-style'> || <'text-emphasis-color'>
  var __parse_shorthand = function(value){
    if(value === "none"){
      return {};
    }
    var css = {}, styles = [];
    Nehan.Utils.splitBySpace(value).forEach(function(ident){
      switch(ident){
      case "filled":
      case "open":
	styles.unshift(ident);
	break;
      case "dot":
      case "circle":
      case "double-circle":
      case "triangle":
      case "sesame":
	styles.push(ident);
	break;
      default:
	if(/'.*'/.test(ident)){
	  styles = [ident]; // overwrite
	} else {
	  css.color = ident;
	}
      }
    });
    css.style = styles.join(" ");
    return css;
  };

  var __parse_position = function(value){
    var parts = Nehan.Utils.splitBySpace(value);
    switch(parts.length){
    case 0: return {hori:"over", vert:"right"};
    case 1: return {hori:parts[0], vert:"right"};
    default: return {hori:parts[0], vert:parts[1]};
    }
  };

  var __parse_unit = function(css_prop, value){
    switch(css_prop.getAttr()){
    case "position": return __parse_position(value);
    default: return value; // style, color
    }
  };

  var __parse_set = function(value){
    if(typeof value === "object"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_shorthand(value);
    }
    console.error("invalid format(text-emphasis):", value);
    throw "invalid format(text-emphasis)";
  };

  return {
    /**
     @memberof Nehan.CssTextEmphaParser
     @param css_prop {Nehan.CssProp}
     @param css_value {Object} - normalized but unformatted css value
     @return {Object} - css value
     */
    formatValue : function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(css_prop, value));
      }
      return __parse_set(value);
    }
  };
})();

Nehan.CssListStyleParser = (function(){
  var __parse_shorthand = function(str){
    str = Nehan.Utils.trim(str).replace(/\s+/g, " ").replace(/;/g, "");
    var list_style = {};
    var values = Nehan.Utils.splitBySpace(str);
    var arg_len = values.length;
    if(arg_len >= 1){
      list_style.type = values[0];
    }
    if(arg_len >= 2){
      list_style.image = values[1];
    }
    if(arg_len >= 3){
      list_style.position = values[2];
    }
    return list_style;
  };

  var __parse_unit = function(value){
    return value;
  };

  var __parse_set = function(value){
    if(typeof value === "object" || typeof value === "function"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_shorthand(value);
    }
    console.error("invalid list-style value:%o", value);
    throw "invalid list-style value";
  };

  return {
    /**
     @memberof Nehan.CssListStyleParser
     @param css_prop {Nehan.CssProp}
     @return {Object} - css value
     */
    formatValue: function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(value));
      }
      return __parse_set(value);
    }
  };
})();

Nehan.CssProp = (function(){
  var __attr_props = {
    // margin
    "margin-before":{name:"margin", attr:"before"},
    "margin-end":{name:"margin", attr:"end"},
    "margin-after":{name:"margin", attr:"after"},
    "margin-start":{name:"margin", attr:"start"},

    // padding
    "padding-before":{name:"padding", attr:"before"},
    "padding-end":{name:"padding", attr:"end"},
    "padding-after":{name:"padding", attr:"after"},
    "padding-start":{name:"padding", attr:"start"},

    // border-width
    "border-width-before":{name:"border-width", attr:"before"},
    "border-width-end":{name:"border-width", attr:"end"},
    "border-width-after":{name:"border-width", attr:"after"},
    "border-width-start":{name:"border-width", attr:"start"},

    // border-style
    "border-style-before":{name:"border-style", attr:"before"},
    "border-style-end":{name:"border-style", attr:"end"},
    "border-style-after":{name:"border-style", attr:"after"},
    "border-style-start":{name:"border-style", attr:"start"},

    // border-color
    "border-color-before":{name:"border-color", attr:"before"},
    "border-color-end":{name:"border-color", attr:"end"},
    "border-color-after":{name:"border-color", attr:"after"},
    "border-color-start":{name:"border-color", attr:"start"},

    // border-radius
    "border-before-start-radius":{name:"border-radius", attr:"before-start"},
    "border-before-end-radius":{name:"border-radius", attr:"before-end"},
    "border-after-end-radius":{name:"border-radius", attr:"after-end"},
    "border-after-start-radius":{name:"border-radius", attr:"after-start"},

    // list-style
    "list-style-position":{name:"list-style", attr:"position"},
    "list-style-type":{name:"list-style", attr:"type"},
    "list-style-image":{name:"list-style", attr:"image"},

    // text-emphasis
    "text-emphasis-position":{name:"text-emphasis", attr:"position"},
    "text-emphasis-style":{name:"text-emphasis", attr:"style"},
    "text-emphasis-color":{name:"text-emphasis", attr:"color"},

    // font
    "font-size":{name:"font", attr:"size"},
    "font-family":{name:"font", attr:"family"},
    "font-style":{name:"font", attr:"style"},
    "font-weight":{name:"font", attr:"weight"},
    "font-variant":{name:"font", attr:"variant"}
  };

  /**
   @memberof Nehan
   @class CssProp
   @constructor
   @param raw_name {string} - unformatted raw property name
   @example
   * var prop = new Nehan.CssProp("margin-start");
   * prop.getName(); // => "margin"
   * prop.getAttr(); // => "start"
   */
  function CssProp(raw_name){
    var chain_name = Nehan.Utils.camelToChain(raw_name);
    var attr_prop = __attr_props[chain_name];
    this.name = attr_prop? attr_prop.name : chain_name;
    this.attr = attr_prop? attr_prop.attr : null;
  }

  /**
   @memberof Nehan.CssProp
   @return {String}
   */
  CssProp.prototype.getName = function(){
    return this.name;
  };

  /**
   @memberof Nehan.CssProp
   @return {String}
   */
  CssProp.prototype.getAttr = function(){
    return this.attr;
  };

  /**
   @memberof Nehan.CssProp
   @return {bool}
   */
  CssProp.prototype.hasAttr = function(){
    return this.attr !== null;
  };

  return CssProp;
})();


Nehan.CssEntry = (function(){
  /**
   @memberof Nehan
   @class CssEntry
   @constructor
   @param prop {Nehan.CssProp} - formatted css property
   @param value {Object} - formatted css value
   */
  function CssEntry(prop, value){
    this.prop = prop;
    this.value = value;
  }

  /**
   @memberof Nehan.CssEntry
   @return {string} - formatted property name
   */
  CssEntry.prototype.getPropName = function(){
    return this.prop.getName();
  };

  /**
   @memberof Nehan.CssEntry
   @return {string} - formatted property attribute. return null if not exists.
   */
  CssEntry.prototype.getPropAttr = function(){
    return this.prop.getAttr();
  };

  /**
   @memberof Nehan.CssEntry
   @return {Object|Number|String} - formatted css value.
   */
  CssEntry.prototype.getValue = function(){
    return this.value;
  };

  return CssEntry;
})();

/**
  @namespace Nehan.CssParser
*/
Nehan.CssParser = (function(){
  var __normalize_value = function(value){
    if(value instanceof Array){
      return value.map(__normalize_value);
    }
    if(typeof value === "function" || typeof value === "object"){
      return value;
    }
    if(typeof value === "number"){
      return value.toString();
    }
    return Nehan.Css.normalizeValue(value);
  };

  var __format_value = function(fmt_prop, value){
    var norm_value = __normalize_value(value);
    switch(fmt_prop.getName()){
    case "margin":
    case "padding":
    case "border-width":
    case "border-style":
    case "border-color":
      return Nehan.CssEdgeParser.formatValue(fmt_prop, norm_value);
    case "border-radius":
      return Nehan.CssBorderRadiusParser.formatValue(fmt_prop, norm_value);
    case "list-style":
      return Nehan.CssListStyleParser.formatValue(fmt_prop, norm_value);
    case "font":
      return Nehan.CssFontParser.formatValue(fmt_prop, norm_value);
    case "text-emphasis":
      return Nehan.CssTextEmphaParser.formatValue(fmt_prop, norm_value);
    default:
      return norm_value;
    }
  };

  return {
    /**
     @memberof Nehan.CssParser
     @param prop {String} - unformatted raw css property name
     @param value {Object|String|Number|Array} - unformatted raw css value
     @return {Nehan.CssEntry} - formatted css entry
     @example
     * var entry = CssParser.formatEntry("margin-start", "1em");
     * entry.getPropName(); => "margin"
     * entry.getPropAttr(); => "start"
     * entry.getValue(); => {start:"1em"}
    */
    formatEntry : function(prop, value){
      var fmt_prop = new Nehan.CssProp(prop);
      var fmt_value = __format_value(fmt_prop, value);
      return new Nehan.CssEntry(fmt_prop, fmt_value);
    }
  };
})();


Nehan.AttrSelector = (function(){
  /**
     @memberof Nehan
     @class AttrSelector
     @classdesc css single attribute selector
     @constructor
     @param {string} expr - single attribute selector string
     @example
     * var as = new AttrSelector("[name='taro']");
  */
  function AttrSelector(expr){
    this.expr = this._normalize(expr);
    this.left = this.op = this.right = null;
    this._parseExpr(this.expr);
  }

  var __rex_symbol = /[^=^~|$*\s]+/;
  var __op_symbols = ["|=", "~=", "^=", "$=", "*=", "="];

  /**
   @memberof Nehan.AttrSelector
   @method test
   @param style {Nehan.Style}
   @return {boolean} true if style is matched to this attribute selector.
   */
  AttrSelector.prototype.test = function(style){
    if(this.op && this.left && this.right){
      return this._testOp(style);
    }
    if(this.left){
      return this._testHasAttr(style);
    }
    return false;
  };

  AttrSelector.prototype._normalize = function(expr){
    return expr.replace(/\[/g, "").replace(/\]/g, "");
  };

  AttrSelector.prototype._parseSymbol = function(expr){
    var match = expr.match(__rex_symbol);
    if(match){
      return match[0];
    }
    return "";
  };

  AttrSelector.prototype._parseOp = function(expr){
    return Nehan.List.find(__op_symbols, function(symbol){
      return expr.indexOf(symbol) >= 0;
    });
  };

  AttrSelector.prototype._parseExpr = function(expr){
    this.left = this._parseSymbol(expr);
    if(this.left){
      expr = Nehan.Utils.trim(expr.slice(this.left.length));
    }
    this.op = this._parseOp(expr);
    if(this.op){
      expr = Nehan.Utils.trim(expr.slice(this.op.length));
      this.right = Nehan.Utils.cutQuote(Nehan.Utils.trim(expr));
    }
  };

  AttrSelector.prototype._testHasAttr = function(style){
    return style.getMarkupAttr(this.left) !== null;
  };

  AttrSelector.prototype._testEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    return value === this.right;
  };

  AttrSelector.prototype._testCaretEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    var rex = new RegExp("^" + this.right);
    return rex.test(value);
  };

  AttrSelector.prototype._testDollarEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    var rex = new RegExp(this.right + "$");
    return rex.test(value);
  };

  AttrSelector.prototype._testTildeEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    var values = value? value.split(/\s+/) : [];
    return Nehan.List.exists(values, Nehan.Closure.eq(this.right));
  };

  AttrSelector.prototype._testPipeEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    return value? (value == this.right || value.indexOf(this.right + "-") >= 0) : false;
  };

  AttrSelector.prototype._testStarEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    return value.indexOf(this.right) >= 0;
  };

  AttrSelector.prototype._testOp = function(style){
    switch(this.op){
    case "=":  return this._testEqual(style);
    case "^=": return this._testCaretEqual(style);
    case "$=": return this._testDollarEqual(style);
    case "|=": return this._testPipeEqual(style);
    case "~=": return this._testTildeEqual(style);
    case "*=": return this._testStarEqual(style);
    }
    throw "undefined operation:" + this.op;
  };

  return AttrSelector;
})();


Nehan.PseudoSelector = (function(){
  /**
   @memberof Nehan
   @class PseudoSelector
   @classdesc abstraction of css pseudo element or pseudo class selector
   @constructor
   @param expr {String}
   @param args {Array.<Nehan.CompoundSelector>}
   @example
   * var ps = new PseudoSelector("::first-letter").hasPseudoElement(); // true
   */
  function PseudoSelector(expr, args){
    this.name = expr;
    this.args = args || [];
  }

  /**
   @memberof Nehan.PseudoSelector
   @return {boolean}
   */
  PseudoSelector.prototype.hasPseudoElement = function(){
    return (this.name === "::before" ||
	    this.name === "::after" ||
	    this.name === "::first-letter" ||
	    this.name === "::first-line" ||
	    this.name === "::marker");
  };
  /**
   @memberof Nehan.PseudoSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  PseudoSelector.prototype.test = function(style){
    switch(this.name){
      // pseudo-element
    case "::before": return true;
    case "::after": return true;
    case "::first-letter": return !style.isMarkupEmpty();
    case "::first-line": return !style.isMarkupEmpty();
    case "::marker": return !style.isMarkupEmpty();

      // pseudo-class
    case ":first-child": return style.isFirstChild();
    case ":last-child": return style.isLastChild();
    case ":first-of-type": return style.isFirstOfType();
    case ":last-of-type": return style.isLastOfType();
    case ":only-child": return style.isOnlyChild();
    case ":only-of-type": return style.isOnlyOfType();
    case ":empty": return style.isMarkupEmpty();
    case ":root": return style.isRoot();
    case ":not": return style.not(this.args);
    case ":matches": return style.matches(this.args);
    case ":lang": return style.lang(this.args.map(function(arg){ return arg.name; }));
    }
    return false;
  };

  return PseudoSelector;
})();


/* 
 single element type selector

 example:

   1. type selector
     div {font-size:xxx}
     /h[1-6]/ {font-weight:xxx}

   2. class selector
     div.class{font-size:xxx}
     div.class1.class2{color:yyy}

   3. id selector
     div#id{font-size:xxx}

   4. attribute selector
     div[name=value]{font-size:xxx}
     div[name1=value1][name1^=xxx]{color:yyy}

   5. pseudo-class selector
     li:first-child{font-weight:bold}

   6. pseudo-element selector
     div::first-line{font-size:xxx}
*/
Nehan.CompoundSelector = (function(){
  /**
     @memberof Nehan
     @class CompoundSelector
     @classdesc selector abstraction(name, class, id, attribute, pseudo).
     @constructor
     @param opt {Object}
     @param opt.name {String}
     @param opt.nameRex {RegExp}
     @param opt.id {String}
     @param opt.classes {Array<String>}
     @param opt.attrs {Array<Nehan.AttrSelector>}
     @param opt.pseudo {Nehan.PseudoSelector}
     @description <pre>

     1. name selector
       div {font-size:xxx}
       /h[1-6]/ {font-weight:xxx}

     2. class selector
       div.class{font-size:xxx}
       div.class1.class2{color:yyy}

     3. id selector
       div#id{font-size:xxx}

     4. attribute selector
       div[name=value]{font-size:xxx}
       div[name1=value1][name1^=xxx]{color:yyy}

     5. pseudo-class selector
       li:first-child{font-weight:bold}

     6. pseudo-element selector
       div::first-line{font-size:xxx}
     </pre>
  */
  function CompoundSelector(opt){
    this.name = opt.name || null;
    this.nameRex = opt.nameRex || null;
    this.id = opt.id || null;
    this.classes = opt.classes || [];
    this.attrs = opt.attrs || [];
    this.pseudo = opt.pseudo || null;
    this.classes.sort();
  }
  
  /**
   check if [style] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  CompoundSelector.prototype.test = function(style){
    if(style === null){
      return false;
    }
    // name selector
    if(this.name && !this.testName(style.getMarkupName())){
      return false;
    }
    // name selector(by rex)
    if(this.nameRex && !this.testNameRex(style.getMarkupName())){
      return false;
    }
    // class selector
    if(this.classes.length > 0 && !this.testClassNames(style.getMarkupClasses())){
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
  };
  /**
   check if [markup_name] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param markup_name {String}
   @return {boolean}
   */
  CompoundSelector.prototype.testName = function(markup_name){
    if(this.name === null){
      return false;
    }
    if(this.name === "*"){
      return true;
    }
    return markup_name === this.name;
  };
  /**
   check if [markup_name] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param markup_name {String}
   @return {boolean}
   */
  CompoundSelector.prototype.testNameRex = function(markup_name){
    if(this.nameRex === null){
      return false;
    }
    return this.nameRex.test(markup_name);
  };
  /**
   check if [markup_classes] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param markup_classes {Array.<String>}
   @return {boolean}
   */
  CompoundSelector.prototype.testClassNames = function(markup_classes){
    return this.classes.every(function(klass){
      return Nehan.List.exists(markup_classes, Nehan.Closure.eq(klass));
    });
  };
  /**
   get name specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getNameSpec = function(){
    if(this.nameRex){
      return 1;
    }
    if(this.name === null || this.name === "*"){
      return 0;
    }
    return 1;
  };
  /**
   get id specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getIdSpec = function(){
    return this.id? 1 : 0;
  };
  /**
   get class specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getClassSpec = function(){
    return this.classes.length;
  };
  /**
   get attribute specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getAttrSpec = function(){
    return this.attrs.length;
  };
  /**
   get pseudo-class specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getPseudoClassSpec = function(){
    if(this.pseudo){
      return this.pseudo.hasPseudoElement()? 0 : 1;
    }
    return 0;
  };

  CompoundSelector.prototype._testAttrs = function(style){
    return this.attrs.every(function(attr){
      return attr.test(style);
    });
  };

  return CompoundSelector;
})();


Nehan.SelectorLexer = (function(){
  /**
     @memberof Nehan
     @class SelectorLexer
     @classdesc lexer of css selector
     @constructor
  */
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var __rex_name = /^[\w-_\*!\?]+/;
  var __rex_name_by_rex = /^\/[^\/]+\//;
  var __rex_id = /^#[\w-_]+/;
  var __rex_class = /^\.[\w-_]+/;
  var __rex_attr = /^\[[^\]]+\]/;
  var __rex_pseudo_ident = /^:{1,2}[\w-_]+/;
  var __rex_pseudo_args = /\(.*?\)/;

  /**
   @memberof Nehan.SelectorLexer
   @return {Array.<Nehan.CompoundSelector>}
   */
  SelectorLexer.prototype.getTokens = function(){
    var tokens = [];
    while(this.buff !== ""){
      var token = this._getNextToken();
      if(token === null){
	break;
      }
      tokens.push(token);
    }
    return tokens;
  };

  SelectorLexer.prototype._getNextToken = function(){
    this.buff = Nehan.Utils.trim(this.buff);
    if(this.buff === ""){
      return null;
    }
    var c1 = this.buff.charAt(0);
    switch(c1){
    case "+": case "~": case ">": // combinator
      this._stepBuff(1);
      return c1;
    default: // type-selecor
      return this._getCompoundSelector();
    }
    throw "invalid selector:[" + this.buff + "]";
  };

  SelectorLexer.prototype._normalize = function(src){
    return Nehan.Utils.trim(src).replace(/\s+/g, " ");
  };

  SelectorLexer.prototype._stepBuff = function(count){
    this.buff = Nehan.Utils.trim(this.buff.slice(count));
  };

  SelectorLexer.prototype._getByRex = function(rex){
    var ret = null;
    var match = this.buff.match(rex);
    if(match){
      ret = match[0];
      this._stepBuff(ret.length);
    }
    return ret;
  };

  SelectorLexer.prototype._getCompoundSelector = function(){
    var buff_len_before = this.buff.length;
    var name = this._getName();
    var name_rex = (name === null)? this._getNameRex() : null;
    var id = this._getId();
    var classes = this._getClasses();
    var attrs = this._getAttrs();
    var pseudo = this._getPseudo();

    // if size of this.buff is not changed, there is no selector element.
    if(this.buff.length === buff_len_before){
      throw "invalid selector:[" + this.buff + "]";
    }
    return new Nehan.CompoundSelector({
      name:name,
      nameRex:name_rex,
      id:id,
      classes:classes,
      attrs:attrs,
      pseudo:pseudo
    });
  };

  SelectorLexer.prototype._getName = function(){
    return this._getByRex(__rex_name);
  };

  // type name defined by regexp
  // "/h[1-6]/.nehan-some-class span"
  // => /h[1-6]/
  SelectorLexer.prototype._getNameRex = function(){
    var name_rex = this._getByRex(__rex_name_by_rex);
    if(name_rex === null){
      return null;
    }
    return new RegExp(name_rex.replace(/[\/]/g, ""));
  };

  SelectorLexer.prototype._getId = function(){
    var id = this._getByRex(__rex_id);
    return id? id.substring(1) : null;
  };

  SelectorLexer.prototype._getClasses = function(){
    var classes = [];
    while(true){
      var klass = this._getClass();
      if(klass === null){
	break;
      }
      classes.push(klass);
    }
    return classes;
  };

  SelectorLexer.prototype._getClass = function(){
    var klass = this._getByRex(__rex_class);
    return klass? klass.substring(1) : null;
  };

  SelectorLexer.prototype._getAttrs = function(){
    var attrs = [];
    while(true){
      var attr = this._getByRex(__rex_attr);
      if(attr === null){
	break;
      }
      attrs.push(new Nehan.AttrSelector(attr));
    }
    return attrs;
  };

  SelectorLexer.prototype._getPseudo = function(){
    var pseudo_ident = this._getByRex(__rex_pseudo_ident);
    if(!pseudo_ident){
      return null;
    }
    var pseudo_args_str = this._getByRex(__rex_pseudo_args);
    if(!pseudo_args_str){
      return new Nehan.PseudoSelector(pseudo_ident);
    }
    var pseudo_args = this._getPseudoArgs(pseudo_args_str);
    return new Nehan.PseudoSelector(pseudo_ident, pseudo_args);
  };

  SelectorLexer.prototype._getPseudoArgs = function(args_str){
    args_str = args_str.replace(/\s/g, "").replace("(", "").replace(")", "");
    var pseudo_args = Nehan.Utils.splitBy(args_str, ",");
    return pseudo_args.map(function(str){
      var tokens = new SelectorLexer(str).getTokens();
      return tokens[0];
    });
  };

  return SelectorLexer;
})();


/**
 state machine module to check if some selector is matched to destination style context.

 @namespace Nehan.SelectorStateMachine
 */
Nehan.SelectorStateMachine = (function(){
  var __find_parent = function(style, parent_type){
    var ptr = style.parent;
    while(ptr !== null){
      if(parent_type.test(ptr)){
	return ptr;
      }
      ptr = ptr.parent;
    }
    return null;
  };

  var __find_direct_parent = function(style, parent_type){
    var ptr = style.parent;
    if(ptr === null){
      return null;
    }
    return parent_type.test(ptr)? ptr : null;
  };

  // search adjacent sibling forom 'style' that matches f1 selector.
  var __find_adj_sibling = function(style, f1){
    var sibling_index = style.getChildIndex();
    var prev_sibling = style.getParentNthChild(sibling_index - 1) || null;
    return (prev_sibling && f1.test(prev_sibling))? prev_sibling : null;
  };

  // search style context that matches f1 selector from all preceding siblings of 'style'.
  var __find_prev_sibling = function(style, f1){
    var sibling_index = style.getChildIndex();
    for(var i = 0; i < sibling_index; i++){
      var prev_sibling = style.getParentNthChild(i);
      if(prev_sibling && f1.test(prev_sibling)){
	return prev_sibling;
      }
    }
    return null;
  };

  return {
    /**
     return true if all the selector-tokens({@link Nehan.CompoundSelector} or combinator) matches the style-context.

     @memberof Nehan.SelectorStateMachine
     @param style {Nehan.Style}
     @param tokens {Array.<Nehan.CompoundSelector> | combinator_string}
     @return {boolean}
     */
    accept : function(style, tokens){
      if(tokens.length === 0){
	console.error("syntax error:%o", tokens);
	throw "selector syntax error";
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
	if(f2 instanceof Nehan.CompoundSelector === false){
	  console.error("syntax error:%o", tokens);
	  throw "selector syntax error";
	}
	if(!f2.test(style)){
	  return false;
	}
	tmp = pop();
	if(tmp === null){
	  return true;
	}
	if(tmp instanceof Nehan.CompoundSelector){
	  f1 = tmp;
	  combinator = " "; // descendant combinator
	} else if(typeof tmp === "string"){
	  combinator = tmp;
	  f1 = pop();
	  if(f1 === null || f1 instanceof Nehan.CompoundSelector === false){
	    console.error("syntax error:%o", tokens);
	    throw "selector syntax error";
	  }
	}
	// test [f1 combinator f2]
	// notice that f2 is already accepted at this point, so next we check [f1 combinator] parts.
	// if style-context that matches [f1 combinator] is found, update 'style' to it, and next loop.
	switch(combinator){
	case " ": style = __find_parent(style, f1); break; // search parent context that matches f1.
	case ">": style = __find_direct_parent(style, f1); break; // search direct parent context that matches f1.
	case "+": style = __find_adj_sibling(style, f1); break; // find adjacent sibling context that matches f1.
	case "~": style = __find_prev_sibling(style, f1); break; // find previous sibling context that matches f1.
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
  };
})();


Nehan.SelectorValue = (function(){
  /**
   @memberof Nehan
   @class Nehan.SelectorValue
   @param raw_entries {Object} - unformatted css entries
   @constructor
   */
  function SelectorValue(raw_entries){
    this.entries = this._initialize(raw_entries);
  }

  SelectorValue.prototype._initialize = function(entries){
    var fmt_entries = {};
    for(var prop in entries){
      var entry = Nehan.CssParser.formatEntry(prop, entries[prop]);
      var fmt_prop = entry.getPropName();
      var fmt_value = entry.getValue();
      var old_value = fmt_entries[fmt_prop];
      if(old_value && typeof old_value === "object" && typeof fmt_value === "object"){
	Nehan.Obj.copy(old_value, fmt_value);
      } else {
	fmt_entries[fmt_prop] = fmt_value;
      }
    }
    return fmt_entries;
  };

  /**
   @memberof Nehan.SelectorValue
   @param dst_value {Nehan.SelectorValue}
   @return {Nehan.Selector} - merged selector
   */
  SelectorValue.prototype.merge = function(dst_value){
    var fmt_values = dst_value.getEntries();
    for(var fmt_prop in fmt_values){
      var fmt_value = fmt_values[fmt_prop];
      var old_value = this.entries[fmt_prop] || null;
      if(old_value && typeof old_value === "object" && typeof fmt_value === "object"){
	Nehan.Obj.copy(old_value, fmt_value);
      } else {
	this.entries[fmt_prop] = fmt_value;
      }
    }
    return this;
  };

  /**
   @memberof Nehan.SelectorValue
   @return {Object}
   */
  SelectorValue.prototype.getEntries = function(){
    return this.entries;
  };

  return SelectorValue;
})();

// ComplexSelector = [CompoundSelector | combinator]
Nehan.ComplexSelector = (function(){
  /**
   @memberof Nehan
   @class ComplexSelector
   @classdesc abstraction of css complex selector.
   @constructor
   @param key {String}
  */
  function ComplexSelector(key){
    this.key = this._normalizeKey(key);
    this.elements = this._getSelectorElements(this.key); // [compound-selector | combinator]
    this.spec = this._countSpec(this.elements); // count specificity
  }

  /**
   @memberof Nehan.ComplexSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  ComplexSelector.prototype.test = function(style){
    return Nehan.SelectorStateMachine.accept(style, this.elements);
  };
  /**
   @memberof Nehan.ComplexSelector
   @param style {Nehan.Style}
   @param element_name {String} - "before", "after", "first-line", "first-letter"
   @return {boolean}
   */
  ComplexSelector.prototype.testPseudoElement = function(style, element_name){
    var has_pseudo_name = this.hasPseudoElementName(element_name);
    var test_result = this.test(style);
    return has_pseudo_name && test_result;
  };
  /**
   @memberof Nehan.ComplexSelector
   @return {String}
   */
  ComplexSelector.prototype.getKey = function(){
    return this.key;
  };
  /**
   @memberof Nehan.ComplexSelector
   @return {int} selector specificity
   */
  ComplexSelector.prototype.getSpec = function(){
    return this.spec;
  };
  /**
   @memberof Nehan.ComplexSelector
   @return {boolean}
   */
  ComplexSelector.prototype.hasPseudoElement = function(){
    return this.key.indexOf("::") >= 0;
  };
  /**
   @memberof Nehan.ComplexSelector
   @param element_name {String} - "first-letter", "first-line"
   @return {boolean}
   */
  ComplexSelector.prototype.hasPseudoElementName = function(element_name){
    return this.key.indexOf("::" + element_name) >= 0;
  };

  // count selector 'specificity'
  // see http://www.w3.org/TR/css3-selectors/#specificity
  ComplexSelector.prototype._countSpec = function(elements){
    var a = 0, b = 0, c = 0;
    Nehan.List.iter(elements, function(token){
      if(token instanceof Nehan.CompoundSelector){
	a += token.getIdSpec();
	b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	c += token.getNameSpec();
      }
    });
    return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
  };

  ComplexSelector.prototype._getSelectorElements = function(key){
    var lexer = new Nehan.SelectorLexer(key);
    return lexer.getTokens();
  };

  ComplexSelector.prototype._normalizeKey = function(key){
    key = (key instanceof RegExp)? "/" + key.source + "/" : key;
    return Nehan.Utils.trim(key).toLowerCase().replace(/\s+/g, " ");
  };

  return ComplexSelector;
})();


/**
 @memberof Nehan
 @class SelectorEntry
 @param key {String}
 @param raw_value {Object|Function} - unformatted css entry value
 */
Nehan.SelectorEntry = (function(){
  function SelectorEntry(key, raw_value){
    this.complexSelector = new Nehan.ComplexSelector(key);
    this.value = new Nehan.SelectorValue(raw_value);
  }

  /**
   @memberof Nehan.SelectorEntry
   @return {String}
   */
  SelectorEntry.prototype.getKey = function(){
    return this.complexSelector.getKey();
  };

  /**
   @memberof Nehan.SelectorEntry
   @return {int}
   */
  SelectorEntry.prototype.getSpec = function(){
    return this.complexSelector.getSpec();
  };

  /**
   @memberof Nehan.SelectorEntry
   @return {Object} - formatted css value entries
   */
  SelectorEntry.prototype.getEntries = function(){
    return this.value.getEntries();
  };

  /**
   @memberof Nehan.SelectorEntry
   @param style {Nehan.Style}
   @return {boolean}
   */
  SelectorEntry.prototype.test = function(style){
    return this.complexSelector.test(style);
  };
  
  /**
   @memberof Nehan.SelectorEntry
   @param style {Nehan.Style}
   @param element_name {String} - "before", "after", "first-line", "first-letter"
   @return {boolean}
   */
  SelectorEntry.prototype.testPseudoElement = function(style, element_name){
    return this.complexSelector.testPseudoElement(style, element_name);
  };

  /**
   @memberof Nehan.ComplexSelector
   @return {boolean}
   */
  SelectorEntry.prototype.hasPseudoElement = function(){
    return this.complexSelector.hasPseudoElement();
  };

  /**
   @memberof Nehan.SelectorEntry
   @param element_name {String} - "first-letter", "first-line"
   @return {boolean}
   */
  SelectorEntry.prototype.hasPseudoElementName = function(element_name){
    return this.complexSelector.hasPseudoElementName(element_name);
  };

  /**
   @memberof Nehan.SelectorEntry
   @return {Nehan.SelectorEntry}
   */
  SelectorEntry.prototype.updateValue = function(raw_entries){
    var fmt_value = new Nehan.SelectorValue(raw_entries);
    this.value.merge(fmt_value);
    return this;
  };

  return SelectorEntry;
})();


Nehan.Selectors = (function(){
  /**
   @memberof Nehan
   @class Nehan.Selectors
   @classdesc  all selector values managed by layout engine.
   @constructor
  */
  function Selectors(stylesheet){
    this.stylesheet = stylesheet || {};
    this.selectors = []; // static selectors without pseudo-element or pseudo-class.
    this.selectorsPe = []; // selectors with pseudo-element.
    this.selectorsPc = []; // selectors with pseudo-class.
    this.selectorsCache = {}; // cache for static selectors
    this._initialize(this.stylesheet);
  }

  Selectors.prototype._initialize = function(stylesheet){
    Nehan.Obj.iter(stylesheet, function(key, value){
      this._insertValue(key, value);
    }.bind(this));
  };

  // sort __selectors by specificity asc.
  Selectors.prototype._sortSelectors = function(selectors){
    selectors.sort(function(s1,s2){ return s1.getSpec() - s2.getSpec(); });
    return selectors;
  };

  Selectors.prototype._isPcKey = function(selector_key){
    return selector_key.indexOf("::") < 0 && selector_key.indexOf(":") >= 0;
  };

  Selectors.prototype._isPeKey = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  Selectors.prototype._findSelector = function(selector_key){
    var selectors = this._getTargetSelectors(selector_key);
    return Nehan.List.find(selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  Selectors.prototype._getTargetSelectors = function(selector_key){
    if(this._isPeKey(selector_key)){
      return this.selectorsPe;
    }
    if(this._isPcKey(selector_key)){
      return this.selectorsPc;
    }
    return this.selectors;
  };

  Selectors.prototype._updateValue = function(selector_key, raw_entries){
    var selector = this._findSelector(selector_key); // selector object for selector_key, must be found
    selector.updateValue(raw_entries);
  };

  Selectors.prototype._insertValue = function(selector_key, raw_entries){
    var selector = new Nehan.SelectorEntry(selector_key, raw_entries);
    var target_selectors = this._getTargetSelectors(selector_key);
    target_selectors.push(selector);
    return selector;
  };

  /**
   @memberof Nehan.Selectors
   @param selector_key {String}
   @return {Nehan.Selector}
   */
  Selectors.prototype.get = function(selector_key){
    return this._findSelector(selector_key);
  };

  /**
   @memberof Nehan.Selectors
   @param selector_key {String}
   @param raw_entries {Object} - unformatted css entries
   @example
   * Selectors.setValue("li.foo", {"font-size":19});
   */
  Selectors.prototype.setValue = function(selector_key, raw_entries){
    if(this.stylesheet[selector_key]){
      this._updateValue(selector_key, raw_entries);
    } else {
      this._insertValue(selector_key, raw_entries);
    }
  };

  /**
   @memberof Nehan.Selectors
   @param values {Object}
   @example
   * Selectors.setValues({
   *   "body":{"color":"red", "background-color":"white"},
   *   "h1":{"font-size":24}
   * });
   */
  Selectors.prototype.setValues = function(values){
    for(var selector_key in values){
      this.setValue(selector_key, values[selector_key]);
    }
  };

  /**
   @memberof Nehan.Selectors
   @param key {string}
   @param raw_entries {Object} - unformatted css entries
   @return {Nehan.Selector}
   */
  Selectors.prototype.create = function(key, raw_entries){
    return new Nehan.SelectorEntry(key, raw_entries);
  };

  /**
   get selector css that matches to the style context.

   @memberof Nehan.Selectors
   @param style {Nehan.Style}
   @return {css_value}
   */
  Selectors.prototype.getValue = function(style){
    var cache_key = style.getSelectorCacheKey();
    var cache = this.selectorsCache[cache_key] || null;
    var matched_static_selectors = cache || this.selectors.filter(function(selector){
      return selector.test(style);
    });
    if(cache === null){
      this.selectorsCache[cache_key] = matched_static_selectors;
    }
    var matched_pc_selectors = this.selectorsPc.filter(function(selector){
      return selector.test(style);
    });
    var matched_selectors = matched_static_selectors.concat(matched_pc_selectors);
    return (matched_selectors.length === 0)? {} : this._sortSelectors(matched_selectors).reduce(function(ret, selector){
      return ret.union(new Nehan.CssHashSet(selector.getEntries()));
    }, new Nehan.CssHashSet()).getValues();
  };

  /**<pre>
   * get selector css that matches to the pseudo element of some style.
   * if selector_key is "p::first-letter",
   * [pseudo_element_name] is "first-letter" and [style] is the style of "p".
   *</pre>
   @memberof Nehan.Selectors
   @param style {Nehan.Style} - 'parent' style of pseudo-element
   @param pseudo_element_name {String} - "first-letter", "first-line", "before", "after"
   @return {Object} - formatted css values
   */
  Selectors.prototype.getValuePe = function(style, pseudo_element_name){
    var cache_key = style.getSelectorCacheKeyPe(pseudo_element_name);
    var cache = this.selectorsCache[cache_key] || null;
    var matched_selectors = cache || this.selectorsPe.filter(function(selector){
      return selector.testPseudoElement(style, pseudo_element_name);
    });
    if(cache === null){
      this.selectorsCache[cache_key] = matched_selectors;
    }
    return (matched_selectors.length === 0)? {} : this._sortSelectors(matched_selectors).reduce(function(ret, selector){
      return ret.union(new Nehan.CssHashSet(selector.getEntries()));
    }, new Nehan.CssHashSet()).getValues();
  };

  return Selectors;
})();

Nehan.Rgb = (function(){
  /**
     @memberof Nehan
     @class Rgb
     @classdesc abstraction of RGB color value.
     @constructor
     @param value {String}
  */
  function Rgb(value){
    this.value = String(value);
    this._setup(this.value);
  }

  Rgb.prototype._setup = function(value){
    switch(value.length){
    case 3:
      var r = this.value.substring(0,1);
      var g = this.value.substring(1,2);
      var b = this.value.substring(2,3);
      this.red = parseInt(r + r, 16);
      this.green = parseInt(g + g, 16);
      this.blue = parseInt(b + b, 16);
      this.value = r + r + g + g + b + b;
      break;
    case 6:
      this.red = parseInt(this.value.substring(0,2), 16);
      this.green = parseInt(this.value.substring(2,4), 16);
      this.blue = parseInt(this.value.substring(4,6), 16);
      break;
    default:
      console.error("Nehan.Rgb invalid color value:%o", value);
      throw "Nehan.Rgb: inlivad color value";
    }
  };
  
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getRed = function(){
    return this.red;
  };
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getGreen = function(){
    return this.green;
  };
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getBlue = function(){
    return this.blue;
  };
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getColorValue = function(){
    return this.value;
  };

  return Rgb;
})();

/**
   color collection manager
   @namespace Nehan.Colors
*/
Nehan.Colors = (function(){
  var __color_names = {
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
    /**
       @memberof Nehan.Colors
       @param value {String}
       @return {String}
       @example
       * Colors.get("white"); // "ffffff" (pre defined color)
       * Colors.get("f00"); // "ff0000" (always length 6)
       * Colors.get("0000FF"); // "0000ff" (always lowercased)
    */
    get : function(value){
      value = value.replace(/#/g, "").toLowerCase();
      if(!rex_hex_color.test(value)){
	return __color_names[value] || value;
      }
      if(value.length === 3){
	return value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
      }
      return value;
    }
  };
})();


Nehan.Color = (function(){
  /**
     @memberof Nehan
     @class Color
     @classdesc abstraction for css 'color'.
     @param value {String}
  */
  function Color(value){
    this.setValue(value);
  }

  /**
   @memberof Nehan.Color
   @param value {String}
   */
  Color.prototype.setValue = function(value){
    this.value = Nehan.Colors.get(value);
  };
  /**
   @memberof Nehan.Color
   @return {String}
   */
  Color.prototype.getValue = function(){
    return this.value;
  };
  /**
   @memberof Nehan.Color
   @return {String}
   @example
   * new Color("transparent").getCssValue(); // "transparent"
   * new Color("ff0022").getCssValue(); // "#ff0022"
   * new Color("red").getCssValue(); // "#ff0000"
   */
  Color.prototype.getCssValue = function(){
    return (this.value === "transparent")? this.value : "#" + this.value;
  };
  /**
   @memberof Nehan.Color
   @return {Nehan.Rgb}
   */
  Color.prototype.getRgb = function(){
    return new Nehan.Rgb(this.value);
  };
  /**
   @memberof Nehan.Color
   @return {Object}
   */
  Color.prototype.getCss = function(){
    var css = {};
    css.color = this.getCssValue();
    return css;
  };

  return Color;
})();

/**
   palette color utility module

   @namespace Nehan.Palette
*/
Nehan.Palette = (function(){
  // 256(8 * 8 * 4) color palette scales.
  var __rg_palette = [0, 36, 73, 109, 146, 182, 219, 255];
  var __b_palette = [0, 85, 170, 255];

  var __make_hex_str = function(ival){
    var str = ival.toString(16);
    if(str.length <= 1){
      return "0" + str;
    }
    return str;
  };

  var __find_palette = function(ival, palette){
    if(Nehan.List.exists(palette, Nehan.Closure.eq(ival))){
      return ival;
    }
    return Nehan.List.minobj(palette, function(pval){
      return Math.abs(pval - ival);
    });
  };

  return {
    /**
     * search nearest color value defined in nehan palette.<br>
     * we use this value for img characters.

       @memberof Nehan.Palette
       @param rgb {Nehan.Rbg}
       @return {String}
    */
    getColor : function(rgb){
      var palette_red = __find_palette(rgb.getRed(), __rg_palette);
      var palette_green = __find_palette(rgb.getGreen(), __rg_palette);
      var palette_blue = __find_palette(rgb.getBlue(), __b_palette);

      return [
	__make_hex_str(palette_red),
	__make_hex_str(palette_green),
	__make_hex_str(palette_blue)
      ].join("");
    }
  };
})();


/**
   @namespace Nehan.Cardinal
*/
Nehan.Cardinal = (function(){
  var __table = {
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

  var __aliases = {
    "upper-latin":"upper-alpha",
    "lower-latin":"lower-alpha"
  };

  return {
    /**
       get cardinal string array

       @memberof Nehan.Cardinal
       @param name {string}
       @return {Array.<string>}
    */
    getTableByName : function(name){
      return __table[__aliases[name] || name];
    },
    /**
       get cardical basis

       @memberof Nehan.Cardinal
       @param name {string}
       @return {int}
    */
    getBaseByName : function(name){
      var table = this.getTableByName(name);
      return table.length;
    },
    /**
       @memberof Nehan.Cardinal
       @param name {string}
       @param decimal {int}
       @return {string}
       @example
       * Cardinal.getStringByName("lower-alpha", 2); // "c"
       * Cardinal.getStringByName("hiragana", 0); // "あ"
       * Cardinal.getStringByName("hiragana-iroha", 0); // "い"
    */
    getStringByName : function(name, decimal){
      var table = this.getTableByName(name);
      var base = table.length;
      var digits = Nehan.Utils.convBase(decimal, base);
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


/**
   utility module for abstract box model.

   @namespace Nehan.BoxRect
*/
Nehan.BoxRect = {
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param values {Object}
   @param values.before - before value
   @param values.end - end value
   @param values.after - after value
   @param values.start - start value
   */
  setLogicalValues : function(dst, flow, values){
    // set before, end, after, start value
    for(var prop in values){
      dst[flow.getProp(prop)] = values[prop];
    }
    return dst;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setBefore : function(dst, flow, value){
    dst[flow.getPropBefore()] = value;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setAfter : function(dst, flow, value){
    dst[flow.getPropAfter()] = value;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setStart : function(dst, flow, value){
    dst[flow.getPropStart()] = value;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setEnd : function(dst, flow, value){
    dst[flow.getPropEnd()] = value;
  }
};


/**
   @namespace Nehan.BoxCorner
*/
Nehan.BoxCorner = (function(){
  var __sort = function(dir1, dir2){
    var order = {top:0, bottom:1, left:2, right:3};
    return [dir1, dir2].sort(function (c1, c2){
      return order[c1] - order[c2];
    });
  };
  return {
    /**
     @memberof Nehan.BoxCorner
     @param flow {Nehan.BoxFlow}
     @param corner_name {String} logical corner name ['before-start' | 'before-end' | 'after-end' | 'after-start']
     */
    getPhysicalCornerName : function(flow, corner_name){
      var dirs = corner_name.split("-");
      var dir1 = flow.getProp(dirs[0]);
      var dir2 = flow.getProp(dirs[1]);
      return __sort(dir1, dir2).join("-");
    }
  };
})();

Nehan.Font = (function(){
  /**
   @memberof Nehan
   @class Font
   @classdesc css 'font' abstraction
   @constructor
   @param opt {Object}
  */
  function Font(opt){
    opt = opt || {};
    this.size = opt.size || "inherit";
    this.family = opt.family || "inherit";
    this.weight = opt.weight || "inherit";
    this.style = opt.style || "inherit";
    this.variant = opt.variant || "inherit";
    this.lineHeight = opt.lineHeight || "inherit";
  }

  /**
   @memberof Nehan.Font
   @return {boolean}
   */
  Font.prototype.isBold = function(){
    return this.weight && this.weight !== "normal" && this.weight !== "lighter";
  };
  /**
   @memberof Nehan.Font
   @return {boolean}
   */
  Font.prototype.isItalic = function(){
    return this.style === "italic";
  };
  /**
   @memberof Nehan.Font
   @param parent {Nehan.Font} - parent font
   */
  Font.prototype.inherit = function(parent){
    if(this.size === "inherit" && parent.size){
      this.size = parent.size;
    }
    if(this.family === "inherit" && parent.family){
      this.family = parent.family;
    }
    if(this.weight === "inherit" && parent.weight){
      this.weight = parent.weight;
    }
    if(this.style === "inherit" && parent.style){
      this.style = parent.style;
    }
    if(this.variant === "inherit" && parent.variant){
      this.variant = parent.variant;
    }
    if(this.lineHeight === "inherit" && parent.lineHeight){
      this.lineHeight = parent.lineHeight;
    }
  };
  /**
   @memberof Nehan.Font
   @param {Nehan.Font}
   @return {boolean}
   */
  Font.prototype.isEqual = function(font){
    return (this.size === font.size &&
	    this.family === font.family &&
	    this.weight === font.weight &&
	    this.variant === font.variant &&
	    this.lineHeight === font.lineHeight &&
	    this.style === font.style);
  };
  /**
   @memberof Nehan.Font
   @return {string}
   */
  Font.prototype.getCssShorthand = function(){
    var size = this.size + "px";
    var variant = (this.variant === "inherit")? "" : this.variant;
    if(this.lineHeight !== "inherit"){
      size = [size, this.lineHeight].join("/");
    }
    return [
      this.weight || "normal",
      this.style || "normal",
      variant,
      size,
      this.family || Nehan.Config.defaultFontFamily
    ].filter(Nehan.Closure.neq("")).join(" ");
  };
  /**
   @memberof Nehan.Font
   @return {Object}
   */
  Font.prototype.getCss = function(){
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
    if(this.variant){
      css["font-variant"] = this.variant;
    }
    return css;
  };

  return Font;
})();


Nehan.Edge = (function(){
  /**
   @memberof Nehan
   @class Edge
   @classdesc abstraction of physical edge size for each css directions(top, right, bottom, left).
   @constructor
   */
  function Edge(){
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }

  /**
   @memberof Nehan.Edge
   @return {String}
   */
  Edge.prototype.getType = function(){
    throw "Edge::getType must be implemented in subclass";
  };

  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clear = function(){
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  };
  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clearStart = function(flow){
    this[flow.getPropStart()] = 0;
  };
  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clearEnd = function(flow){
    this[flow.getPropEnd()] = 0;
  };
  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clearBefore = function(flow){
    this[flow.getPropBefore()] = 0;
  };
  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clearAfter = function(flow){
    this[flow.getPropAfter()] = 0;
  };
  /**
   @memberof Nehan.Edge
   @param size {int}
   */
  Edge.prototype.subtractAfter = function(flow, size){
    var prop = flow.getPropAfter();
    this[prop] = Math.max(0, this[prop] - size);
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param required_size {int}
   @return {int} - canceled size
   */
  Edge.prototype.cancelAfter = function(flow, required_size){
    var after_size = this.getAfter(flow);
    if(after_size <= 0){
      return 0;
    }
    var cancel_size = (after_size >= required_size)? required_size : after_size;
    this.subtractAfter(flow, cancel_size);
    //console.warn("cancel after(%s):(after size = %d, required = %d, cancel = %d)", this.getType(), after_size, required_size, cancel_size);
    return cancel_size;
  };
  /**
   @memberof Nehan.Edge
   @param dst {Nehan.Edge}
   @return {Nehan.Edge}
   */
  Edge.prototype.copyTo = function(dst){
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      dst[dir] = this[dir];
    }.bind(this));
    return dst;
  };
  /**
   @memberof Nehan.Edge
   @param dir {String} - "top", "right", "bottom", "left"
   @return {String}
   */
  Edge.prototype.getDirProp = function(dir){
    return [this.getType(), dir].join("-");
  };
  /**
   @memberof Nehan.Edge
   @return {Object}
   */
  Edge.prototype.getCss = function(){
    return Nehan.Const.cssPhysicalBoxDirs.reduce(function(css, dir){
      var value = this[dir];
      if(value > 0){
	css[this.getDirProp(dir)] = value + "px";
      }
      return css;
    }.bind(this), {});
  };
  /**
   @memberof Nehan.Edge
   @return {int}
   */
  Edge.prototype.getWidth = function(){
    return this.left + this.right;
  };
  /**
   @memberof Nehan.Edge
   @return {int}
   */
  Edge.prototype.getHeight = function(){
    return this.top + this.bottom;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getMeasure = function(flow){
    return flow.isTextVertical()? this.getHeight() : this.getWidth();
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getExtent = function(flow){
    return flow.isBlockflowVertical()? this.getHeight() : this.getWidth();
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param values {Object}
   @param values.before {int}
   @param values.end {int}
   @param values.after {int}
   @param values.start {int}
   */
  Edge.prototype.setSize = function(flow, values){
    Nehan.BoxRect.setLogicalValues(this, flow, values);
    return this;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setStart = function(flow, value){
    this[flow.getPropStart()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setEnd = function(flow, value){
    this[flow.getPropEnd()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setBefore = function(flow, value){
    this[flow.getPropBefore()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setAfter = function(flow, value){
    this[flow.getPropAfter()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getStart = function(flow){
    return this[flow.getPropStart()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getEnd = function(flow){
    return this[flow.getPropEnd()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getBefore = function(flow){
    return this[flow.getPropBefore()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getAfter = function(flow){
    return this[flow.getPropAfter()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param name {String} - before, end, after, start
   */
  Edge.prototype.setByName = function(flow, name, value){
    this[flow.getProp(name)] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param name {String} - before, end, after, start
   @return {int}
   */
  Edge.prototype.getByName = function(flow, name){
    return this[flow.getProp(name)] || 0;
  };

  return Edge;
})();

Nehan.Radius2d = (function(){
  /**
     @memberof Nehan
     @class Radius2d
     @classdesc abstraction of radius with 2 direction vert and hori.
     @constructor
  */
  function Radius2d(opt){
    opt = opt || {};
    this.hori = (typeof opt.hori !== "undefined")? opt.hori : 0;
    this.vert = (typeof opt.vert !== "undefined")? opt.vert : 0;
  }

  Radius2d.prototype.clone = function(){
    var radius2d = new Nehan.Radius2d();
    radius2d.hori = this.hori;
    radius2d.vert = this.vert;
    return radius2d;
  };
  /**
   @memberof Nehan.Radius2d
   @param value {Array<int>} - 2 length array, value[0] as horizontal radius, value[1] as vertical radius.
   @param value.0 {int} - horizontal radius
   @param value.1 {int} - vertical radius
   @return {Nehan.Radius2d}
   */
  Radius2d.prototype.setSize = function(value){
    this.hori = value[0];
    this.vert = value[1];
    return this;
  };
  /**
   @memberof Nehan.Radius2d
   @return {String}
   */
  Radius2d.prototype.getCssValueHori = function(){
    return this.hori + "px";
  };
  /**
   @memberof Nehan.Radius2d
   @return {String}
   */
  Radius2d.prototype.getCssValueVert = function(){
    return this.vert + "px";
  };
  
  return Radius2d;
})();

Nehan.BorderRadius = (function(){
  /**
     @memberof Nehan
     @class BorderRadius
     @classdesc logical border radius object
     @constructor
  */
  function BorderRadius(){
    this.topLeft = new Nehan.Radius2d();
    this.topRight = new Nehan.Radius2d();
    this.bottomRight = new Nehan.Radius2d();
    this.bottomLeft = new Nehan.Radius2d();
  }

  /**
   @memberof Nehan.BorderRadius
   @method clone
   @return {Nehan.BorderRadius}
   */
  BorderRadius.prototype.clone = function(){
    var radius = new BorderRadius();
    radius.topLeft = this.topLeft.clone();
    radius.topRight = this.topRight.clone();
    radius.bottomRight = this.bottomRight.clone();
    radius.bottomLeft = this.bottomLeft.clone();
    return radius;
  };
  /**
   @memberof Nehan.BorderRadius
   @method getArray
   @return {Array.<Nehan.Radius2d>}
   */
  BorderRadius.prototype.getArray = function(){
    return [
      this.topLeft,
      this.topRight,
      this.bottomRight,
      this.bottomLeft
    ];
  };
  /**
   get css value of border-radius for horizontal direction
   @memberof Nehan.BorderRadius
   @method getCssValueHroi
   @return {Object}
   */
  BorderRadius.prototype.getCssValueHori = function(){
    return this.getArray().map(function(radius){
      return radius.getCssValueHori();
    }).join(" ");
  };
  /**
   get css value of border-radius for vertical direction
   @memberof Nehan.BorderRadius
   @method getCssValueVert
   @return {Object}
   */
  BorderRadius.prototype.getCssValueVert = function(){
    return this.getArray().map(function(radius){
      return radius.getCssValueVert();
    }).join(" ");
  };
  /**
   get css value of border-radius for both vert and horizontal direction
   @memberof Nehan.BorderRadius
   @method getCssValue
   @return {Object}
   */
  BorderRadius.prototype.getCssValue = function(){
    return [this.getCssValueHori(), this.getCssValueVert()].join("/");
  };
  /**
   get css object of border-radius
   @memberof Nehan.BorderRadius
   @method getCss
   @return {Object}
   */
  BorderRadius.prototype.getCss = function(){
    var css = {};
    var css_value = this.getCssValue();
    css["border-radius"] = css_value; // without vender prefix
    Nehan.List.iter(Nehan.Const.cssVenderPrefixes, function(prefix){
      var prop = [prefix, "border-radius"].join("-"); // with vender prefix
      css[prop] = css_value;
    });
    return css;
  };
  /**
   get corner value
   @memberof Nehan.BorderRadius
   @method getCorner
   @param flow {Nehan.BoxFlow}
   @param corner_name {String} - logical corner name ['before-start' | 'before-end' | 'after-end' | 'after-start']
   @return {Nehan.Radius2d}
   */
  BorderRadius.prototype.getCorner = function(flow, corner_name){
    var physical_corner_name = Nehan.BoxCorner.getPhysicalCornerName(flow, corner_name);
    return this[Nehan.Utils.camelize(physical_corner_name)];
  };
  /**
   set corner size
   @memberof Nehan.BorderRadius
   @method setSize
   @param flow {Nehan.BoxFlow} - base layout flow
   @param size {Object} - size values for each logical corner
   @param size.start-before {int}
   @param size.start-after {int}
   @param size.end-before {int}
   @param size.end-after {int}
   */
  BorderRadius.prototype.setSize = function(flow, size){
    Nehan.Const.cssLogicalBoxCorners.forEach(function(corner){
      if(typeof size[corner] !== "undefined"){
	this.getCorner(flow, corner).setSize(size[corner]);
      }
    }.bind(this));
  };
  /**
   set corner of logical "start-before"
   @memberof Nehan.BorderRadius
   @method setBeforeStart
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   @example
   * new BorderRadius().setBeforeStart(BoxFlows.getByName("lr-tb"), [5, 10]); // horizontal 5px, vertical 10px
   */
  BorderRadius.prototype.setBeforeStart = function(flow, value){
    var radius = this.getCorner(flow, "before-start");
    radius.setSize(value);
  };
  /**
   set corner of logical "start-after"
   @memberof Nehan.BorderRadius
   @method setAfterStart
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   */
  BorderRadius.prototype.setAfterStart = function(flow, value){
    var radius = this.getCorner(flow, "after-start");
    radius.setSize(value);
  };
  /**
   set corner of logical "end-before"
   @memberof Nehan.BorderRadius
   @method setBeforeEnd
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   */
  BorderRadius.prototype.setBeforeEnd = function(flow, value){
    var radius = this.getCorner(flow, "before-end");
    radius.setSize(value);
  };
  /**
   set corner of logical "end-after"
   @memberof Nehan.BorderRadius
   @method setAfterEnd
   @param flow {Nehan.BoxFlow} - base layout flow
   @param value {Array<int>} - 2d radius value
   */
  BorderRadius.prototype.setAfterEnd = function(flow, value){
    var radius = this.getCorner(flow, "after-end");
    radius.setSize(value);
  };
  /**
   clear corner values of logical before direction("start-before" and "end-before")
   @memberof Nehan.BorderRadius
   @method clearBefore
   @param flow {Nehan.BoxFlow} - base layout flow
   */
  BorderRadius.prototype.clearBefore = function(flow){
    this.setBeforeStart(flow, [0, 0]);
    this.setBeforeEnd(flow, [0, 0]);
  };
  /**
   clear corner values of logical before direction("start-after" and "end-after")
   @memberof Nehan.BorderRadius
   @method clearAfter
   @param flow {Nehan.BoxFlow} - base layout flow
   */
  BorderRadius.prototype.clearAfter = function(flow){
    this.setAfterStart(flow, [0, 0]);
    this.setAfterEnd(flow, [0, 0]);
  };

  return BorderRadius;
})();

Nehan.BorderColor = (function(){
  /**
     @memberof Nehan
     @class BorderColor
     @classdesc logical border color object
     @constructor
  */
  function BorderColor(){
  }

  /**
   @memberof Nehan.BorderColor
   @method clone
   @return {Nehan.BorderColor}
   */
  BorderColor.prototype.clone = function(){
    var border_color = new BorderColor();
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	border_color[dir] = this[dir];
      }
    }.bind(this));
    return border_color;
  };
  /**
   @memberof Nehan.BorderColor
   @param flow {Nehan.BoxFlow}
   @param values {Object} - color values, object or array or string available.
   @param values.before {Nehan.Color}
   @param values.end {Nehan.Color}
   @param values.after {Nehan.Color}
   @param values.start {Nehan.Color}
   */
  BorderColor.prototype.setColor = function(flow, values){
    Nehan.BoxRect.setLogicalValues(this, flow, Nehan.Obj.map(values, function(prop, value){
      return new Nehan.Color(value);
    }));
  };
  /**
   get css object of border color

   @memberof Nehan.BorderColor
   @method getCss
   */
  BorderColor.prototype.getCss = function(){
    var css = {};
    // set border-[top|right|bottom|left]-color
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	var prop = ["border", dir, "color"].join("-");
	var color = this[dir];
	css[prop] = color.getCssValue();
      }
    }.bind(this));
    return css;
  };

  return BorderColor;
})();

Nehan.BorderStyle = (function(){
  /**
     @memberof Nehan
     @class BorderStyle
     @classdesc logical border style object
     @constructor
  */
  function BorderStyle(){
  }

  /**
   @memberof Nehan.BorderStyle
   @method clone
   @return {Nehan.BorderStyle}
   */
  BorderStyle.prototype.clone = function(){
    var style = new BorderStyle();
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	style[dir] = this[dir];
      }
    }.bind(this));
    return style;
  };
  /**
   @memberof Nehan.BorderStyle
   @method setStyle
   @param flow {Nehan.BoxFlow}
   @param values {Object} - logical style values for each logical direction
   @param values.before {string}
   @param values.end {string}
   @param values.after {string}
   @param values.start {string}
   */
  BorderStyle.prototype.setStyle = function(flow, values){
    Nehan.BoxRect.setLogicalValues(this, flow, values);
  };
  /**
   get css object of logical border style
   @memberof Nehan.BorderStyle
   @return {Object}
   */
  BorderStyle.prototype.getCss = function(){
    var css = {};
    // set border-[top|right|bottom|left]-style
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	var prop = ["border", dir, "style"].join("-");
	var style = this[dir];
	css[prop] = style;
      }
    }.bind(this));
    return css;
  };

  return BorderStyle;
})();

Nehan.Padding = (function(){
  /**
   @memberof Nehan
   @class Padding
   @classdesc abstraction of padding.
   @extends {Nehan.Edge}
   */
  function Padding(){
    Nehan.Edge.call(this);
  }
  Nehan.Class.extend(Padding, Nehan.Edge);

  /**
   @memberof Nehan.Padding
   @return {String}
   */
  Padding.prototype.getType = function(){
    return "padding";
  };

  /**
   @memberof Nehan.Padding
   @override
   @return {Nehan.Padding}
   */
  Padding.prototype.clone = function(){
    return this.copyTo(new Padding());
  };

  return Padding;
})();


Nehan.Margin = (function(){
  /**
   @memberof Nehan
   @class Margin
   @classdesc abstraction of physical margin
   @constructor
   @extends {Nehan.Edge}
   */
  function Margin(){
    Nehan.Edge.call(this);
  }
  Nehan.Class.extend(Margin, Nehan.Edge);

  /**
   @memberof Nehan.Margin
   @return {String}
   */
  Margin.prototype.getType = function(){
    return "margin";
  };

  /**
   @memberof Nehan.Margin
   @method clone
   @override
   @return {Nehan.Margin}
   */
  Margin.prototype.clone = function(){
    return this.copyTo(new Margin());
  };

  return Margin;
})();


Nehan.Border = (function(){
  /**
   @memberof Nehan
   @class Border
   @classdesc logical border object that contains border-width, border-radius, border-style, border-color for each logical directions.
   @constructor
   @extends {Nehan.Edge}
   */
  function Border(){
    Nehan.Edge.call(this);
  }
  Nehan.Class.extend(Border, Nehan.Edge);

  /**
   @memberof Nehan.Border
   @return {String}
   */
  Border.prototype.getType = function(){
    return "border";
  };

  /**
   return cloned border object
   @memberof Nehan.Border
   @method clone
   @return {Nehan.Border}
   */
  Border.prototype.clone = function(){
    var border = this.copyTo(new Border());
    if(this.radius){
      border.radius = this.radius.clone();
    }
    if(this.style){
      border.style = this.style.clone();
    }
    if(this.color){
      border.color = this.color.clone();
    }
    return border;
  };

  /**
   clear border values of logical before
   @memberof Nehan.Border
   @method clearBefore
   @param flow {Nehan.BoxFlow}
   */
  Border.prototype.clearBefore = function(flow){
    this.setBefore(flow, 0);
    if(this.radius){
      this.radius.clearBefore(flow);
    }
  };

  /**
   clear border values of logical after
   @memberof Nehan.Border
   @method clearAfter
   @param flow {Nehan.BoxFlow}
   */
  Border.prototype.clearAfter = function(flow){
    this.setAfter(flow, 0);
    if(this.radius){
      this.radius.clearAfter(flow);
    }
  };

  /**
   @memberof Nehan.Border
   @method getDirProp
   @param dir {string} - "top", "right", "bottom", "left"
   @example
   * new Border().getDirProp("top"); // => "border-top-width"
   */
  Border.prototype.getDirProp = function(dir){
    return ["border", dir, "width"].join("-");
  };

  /**
   set border radius
   @memberof Nehan.Border
   @method setRadius
   @param flow {Nehan.BoxFlow}
   @param radius {Nehan.BorderRadius}
   */
  Border.prototype.setRadius = function(flow, radius){
    this.radius = new Nehan.BorderRadius();
    this.radius.setSize(flow, radius);
  };

  /**
   set border color
   @memberof Nehan.Border
   @method setColor
   @param flow {Nehan.BoxFlow}
   @param color {Nehan.Color}
   */
  Border.prototype.setColor = function(flow, color){
    this.color = new Nehan.BorderColor();
    this.color.setColor(flow, color);
  };

  /**
   set border style
   @memberof Nehan.Border
   @method setStyle
   @param flow {Nehan.BoxFlow}
   @param style {Nehan.BorderStyle}
   */
  Border.prototype.setStyle = function(flow, style){
    this.style = new Nehan.BorderStyle();
    this.style.setStyle(flow, style);
  };

  /**
   get css object
   @memberof Nehan.Border
   @method getCss
   @return {Object}
   */
  Border.prototype.getCss = function(){
    var css = Nehan.Edge.prototype.getCss.call(this);
    if(this.radius){
      Nehan.Obj.copy(css, this.radius.getCss());
    }
    if(this.color){
      Nehan.Obj.copy(css, this.color.getCss());
    }
    if(this.style){
      Nehan.Obj.copy(css, this.style.getCss());
    }
    return css;
  };

  return Border;
})();

/**
 @namespace Nehan.MarginCancel
*/
Nehan.MarginCancel = (function(){
  // prerequisite: style.edge.margin is available
  var __cancel_margin = function(style){
    if(style.parent && style.parent.edge && style.parent.edge.margin){
      __cancel_margin_parent(style);
    }
    if(style.prev && style.prev.isBlock() && style.prev.edge){
      // cancel margin between previous sibling and cur element.
      if(style.prev.edge.margin && style.edge.margin){
	__cancel_margin_sibling(style);
      }
    }
  };

  // cancel margin between parent and current element
  var __cancel_margin_parent = function(style){
    if(style.isFirstChild()){
      __cancel_margin_first_child(style);
    }
    if(style.isLastChild()){
      __cancel_margin_last_child(style);
    }
  };

  // cancel margin between parent and first-child(current element)
  var __cancel_margin_first_child = function(style){
    if(style.flow === style.parent.flow){
      __cancel_margin_between(
	style,
	{edge:style.parent.edge, target:"before"},
	{edge:style.edge, target:"before"}
      );
    }
  };

  // cancel margin between parent and first-child(current element)
  var __cancel_margin_last_child = function(style){
    if(style.flow === style.parent.flow){
      __cancel_margin_between(
	style,
	{edge:style.parent.edge, target:"after"},
	{edge:style.edge, target:"after"}
      );
    }
  };

  // cancel margin prev sibling and current element
  var __cancel_margin_sibling = function(style){
    if(style.flow === style.prev.flow){
      // both prev and cur are floated to same direction
      if(style.isFloated() && style.prev.isFloated()){
	if(style.isFloatStart() && style.prev.isFloatStart()){
	  // [start] x [start]
	  __cancel_margin_between(
	    style,
	    {edge:style.prev.edge, target:"end"},
	    {edge:style.edge, target:"start"}
	  );
	} else if(style.isFloatEnd() && style.prev.isFloatEnd()){
	  // [end] x [end]
	  __cancel_margin_between(
	    style,
	    {edge:style.prev.edge, target:"start"},
	    {edge:style.edge, target:"end"}
	  );
	}
      } else if(!style.isFloated() && !style.prev.isFloated()){
	// [block] x [block]
	__cancel_margin_between(
	    style,
	  {edge:style.prev.edge, target:"after"},
	  {edge:style.edge, target:"before"}
	);
      }
    } else if(style.prev.isTextHorizontal() && style.isTextVertical()){
      // [hori] x [vert]
      __cancel_margin_between(
	style,
	{edge:style.prev.edge, target:"after"},
	{edge:style.edge, target:"before"}
      );
    } else if(style.prev.isTextVertical() && style.isTextHorizontal()){
      if(style.prev.flow.isBlockRightToLeft()){
	// [vert:tb-rl] x [hori]
	__cancel_margin_between(
	  style,
	  {edge:style.prev.edge, target:"after"},
	  {edge:style.edge, target:"end"}
	);
      } else {
	// [vert:tb-lr] x [hori]
	__cancel_margin_between(
	  style,
	  {edge:style.prev.edge, target:"after"},
	  {edge:style.edge, target:"start"}
	);
      }
    }
  };

  // if prev_margin > cur_margin, just clear cur_margin.
  var __cancel_margin_between = function(style, prev, cur){
    // margin collapsing is ignored if there is a border between two edge.
    if(prev.edge.border && prev.edge.border.getByName(style.flow, prev.target) ||
       cur.edge.border && cur.edge.border.getByName(style.flow, cur.target)){
      return;
    }
    var prev_size = prev.edge.margin.getByName(style.flow, prev.target);
    var cur_size = cur.edge.margin.getByName(style.flow, cur.target);

    // we use float for layouting each block element in evaluation phase,
    // so standard margin collapsing doesn't work.
    // that is because we use 'differene' of margin for collapsed size.
    var new_size = (prev_size > cur_size)? 0 : cur_size - prev_size;

    cur.edge.margin.setByName(style.flow, cur.target, new_size);

    var rm_size = cur_size - new_size;

    // update content size
    style.contentExtent += rm_size;
  };

  return {
    /**
     @memberof Nehan.MarginCancel
     @param style {Nehan.Style}
     */
    cancel : function(style){
      __cancel_margin(style);
    }
  };
})();

/**
   @namespace Nehan.BorderCollapse
*/
Nehan.BorderCollapse = (function(){
  var __find_parent_enable_border = function(style, target){
    var parent_style = style.parent;
    if(parent_style.edge && parent_style.edge.border && parent_style.edge.border.getByName(style.flow, target) > 0){
      return parent_style.edge.border;
    }
    return parent_style.parent? __find_parent_enable_border(parent_style, target) : null;
  };

  var __collapse_border = function(style, border){
    //console.log("__collapse_border(%o, %o)", style, border);
    switch(style.display){
    case "table-header-group":
    case "table-row-group":
    case "table-footer-group":
    case "table-row":
      __collapse_border_table_row(style, border);
      break;
    case "table-cell":
      __collapse_border_table_cell(style, border);
      break;
    }
  };

  var __collapse_border_table_row = function(style, border){
    //console.log("__collapse_border_table_row(%o, %o)", style, border);
    var parent_start_border = __find_parent_enable_border(style, "start");
    if(parent_start_border){
      __collapse_border_between(
	style,
	{border:parent_start_border, target:"start"},
	{border:border, target:"start"}
      );
    }
    var parent_end_border = __find_parent_enable_border(style, "end");
    if(parent_end_border){
      __collapse_border_between(
	style,
	{border:parent_end_border, target:"end"},
	{border:border, target:"end"}
      );
    }
    if(style.prev && style.prev.edge && style.prev.edge.border){
      __collapse_border_between(
	style,
	{border:style.prev.edge.border, target:"after"},
	{border:border, target:"before"}
      );
    }
    if(style.isFirstChild()){
      var parent_before_border = __find_parent_enable_border(style, "before");
      if(parent_before_border){
	__collapse_border_between(
	  style,
	  {border:parent_before_border, target:"before"},
	  {border:border, target:"before"}
	);
      }
    }
    if(style.isLastChild()){
      var parent_after_border = __find_parent_enable_border(style, "after");
      if(parent_after_border){
	__collapse_border_between(
	  style,
	  {border:parent_after_border, target:"after"},
	  {border:border, target:"after"}
	);
      }
    }
  };

  var __collapse_border_table_cell = function(style, border){
    if(style.prev && style.prev.edge && style.prev.edge.border){
      __collapse_border_between(
	style,
	{border:style.prev.edge.border, target:"end"},
	{border:border, target:"start"}
      );
    }
    var parent_before_border = __find_parent_enable_border(style, "before");
    if(parent_before_border){
      __collapse_border_between(
	style,
	{border:parent_before_border, target:"before"},
	{border:border, target:"before"}
      );
    }
    var parent_after_border = __find_parent_enable_border(style, "after");
    if(parent_after_border){
      __collapse_border_between(
	style,
	{border:parent_after_border, target:"after"},
	{border:border, target:"after"}
      );
    }
    if(style.isFirstChild()){
      var parent_start_border = __find_parent_enable_border(style, "start");
      if(parent_start_border){
	__collapse_border_between(
	  style,
	  {border:parent_start_border, target:"start"},
	  {border:border, target:"start"}
	);
      }
    }
    if(style.isLastChild()){
      var parent_end_border = __find_parent_enable_border(style, "end");
      if(parent_end_border){
	__collapse_border_between(
	  style,
	  {border:parent_end_border, target:"end"},
	  {border:border, target:"end"}
	);
      }
    }
  };

  var __collapse_border_between = function(style, prev, cur){
    //console.log("__collapse_border_between(%o, %o, %o)", style, prev, cur);
    var prev_size = prev.border.getByName(style.flow, prev.target);
    var cur_size = cur.border.getByName(style.flow, cur.target);
    var new_size = Math.max(0, cur_size - prev_size);
    var rm_size = cur_size - new_size;
    switch(cur.target){
    case "before": case "after":
      style.contentExtent += rm_size;
      break;
    case "start": case "end":
      style.contentMeasure += rm_size;
      break;
    }
    cur.border.setByName(style.flow, cur.target, new_size);
  };

  return {
    /**
     @memberof Nehan.BorderCollapse
     @param style {Nehan.Style}
     */
    collapse : function(style){
      //console.log("collapse(%o)", style);
      __collapse_border(style, style.edge.border);
    }
  };
})();

Nehan.BoxEdge = (function (){
  /**
     @memberof Nehan
     @class BoxEdge
     @classdesc edges object set(padding, border, margin)
     @constructor
     @param opt {Object} - optional argument
     @param opt.padding {Nehan.Padding} - initial padding
     @param opt.border {Nehan.Border} - initial border
     @param opt.margin {Nehan.Margin} - initial margin
  */
  function BoxEdge(opt){
    opt = opt || {};
    this.padding = opt.padding || new Nehan.Padding();
    this.border = opt.border || new Nehan.Border();
    this.margin = opt.margin || new Nehan.Margin();
  }

  /**
   @memberof Nehan.BoxEdge
   @return {Nehan.BoxEdge}
   */
  BoxEdge.prototype.clone = function(){
    var edge = new BoxEdge();
    edge.padding = this.padding.clone();
    edge.border = this.border.clone();
    edge.margin = this.margin.clone();
    return edge;
  },
  /**
   clear all edge values
   @memberof Nehan.BoxEdge
   */
  BoxEdge.prototype.clear = function(){
    this.padding.clear();
    this.border.clear();
    this.margin.clear();
  },
  /**
   get css object
   @memberof Nehan.BoxEdge
   */
  BoxEdge.prototype.getCss = function(){
    var css = {};
    Nehan.Obj.copy(css, this.padding.getCss());
    Nehan.Obj.copy(css, this.border.getCss());
    Nehan.Obj.copy(css, this.margin.getCss());
    return css;
  },
  /**
   get size of physical width amount size in px.
   @memberof Nehan.BoxEdge
   */
  BoxEdge.prototype.getWidth = function(){
    var ret = 0;
    ret += this.padding.getWidth();
    ret += this.border.getWidth();
    ret += this.margin.getWidth();
    return ret;
  },
  /**
   get size of physical height amount size in px.
   @memberof Nehan.BoxEdge
   */
  BoxEdge.prototype.getHeight = function(){
    var ret = 0;
    ret += this.padding.getHeight();
    ret += this.border.getHeight();
    ret += this.margin.getHeight();
    return ret;
  },
  /**
   get size of measure in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getMeasure = function(flow){
    var ret = 0;
    ret += this.padding.getMeasure(flow);
    ret += this.border.getMeasure(flow);
    ret += this.margin.getMeasure(flow);
    return ret;
  },
  /**
   get size of extent in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getExtent = function(flow){
    var ret = 0;
    ret += this.padding.getExtent(flow);
    ret += this.margin.getExtent(flow);
    ret += this.border.getExtent(flow);
    return ret;
  },
  /**
   get size of measure size in px without margin.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getInnerMeasureSize = function(flow){
    var ret = 0;
    ret += this.padding.getMeasure(flow);
    ret += this.border.getMeasure(flow);
    return ret;
  },
  /**
   get size of extent size in px without margin.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getInnerExtentSize = function(flow){
    var ret = 0;
    ret += this.padding.getExtent(flow);
    ret += this.border.getExtent(flow);
    return ret;
  },
  /**
   get amount size along logical start direction.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getStart = function(flow){
    var ret = 0;
    ret += this.padding.getStart(flow);
    ret += this.border.getStart(flow);
    ret += this.margin.getStart(flow);
    return ret;
  },
  /**
   get amount size along logical end direction.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getEnd = function(flow){
    var ret = 0;
    ret += this.padding.getEnd(flow);
    ret += this.border.getEnd(flow);
    ret += this.margin.getEnd(flow);
    return ret;
  },
  /**
   get amount size along logical before direction.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getBefore = function(flow){
    var ret = 0;
    ret += this.padding.getBefore(flow);
    ret += this.border.getBefore(flow);
    ret += this.margin.getBefore(flow);
    return ret;
  },
  /**
   get amount size along logical after direction.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getAfter = function(flow){
    var ret = 0;
    ret += this.padding.getAfter(flow);
    ret += this.border.getAfter(flow);
    ret += this.margin.getAfter(flow);
    return ret;
  },
  /**
   get before size amount in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getInnerBefore = function(flow){
    var ret = 0;
    ret += this.padding.getBefore(flow);
    ret += this.border.getBefore(flow);
    return ret;
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.setBorderRadius = function(flow, value){
    this.border.setRadius(flow, value);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.setBorderColor = function(flow, value){
    this.border.setColor(flow, value);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.setBorderStyle = function(flow, value){
    this.border.setStyle(flow, value);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   @param required_size {Nehan.BoxFlow}
   @return total cancel size {int}
   */
  BoxEdge.prototype.cancelAfter = function(flow, required_size){
    var rest_size = required_size;

    // first, try to clear margin
    rest_size -= this.margin.cancelAfter(flow, rest_size);
    if(rest_size === 0){
      return required_size;
    }
    // second, try to clear padding
    rest_size -= this.padding.cancelAfter(flow, rest_size);
    if(rest_size === 0){
      return required_size;
    }
    // finally, try to clear border
    rest_size -= this.border.cancelAfter(flow, rest_size);
    if(rest_size === 0){
      return required_size;
    }
    return required_size - rest_size;
  };
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBefore = function(flow){
    this.padding.clearBefore(flow);
    this.border.clearBefore(flow);
    this.margin.clearBefore(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearAfter = function(flow){
    this.padding.clearAfter(flow);
    this.border.clearAfter(flow);
    this.margin.clearAfter(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearEnd = function(flow){
    this.padding.clearEnd(flow);
    this.border.clearEnd(flow);
    this.margin.clearEnd(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBorderStart = function(flow){
    this.border.clearStart(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBorderBefore = function(flow){
    this.border.clearBefore(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBorderAfter = function(flow){
    this.border.clearAfter(flow);
  };

  return BoxEdge;
})();

Nehan.BoxSize = (function(){
  /**
     @memberof Nehan
     @class BoxSize
     @classdesc physical box size 'width' and 'height'.
     @constructor
     @param width {int} - content width
     @param height {int} - content height
  */
  function BoxSize(width, height){
    this.width = width; // content width
    this.height = height; // content height
  }

  /**
   clone box size object with same values.

   @memberof Nehan.BoxSize
   @return {Nehan.BoxSize}
   */
  BoxSize.prototype.clone = function(){
    return new BoxSize(this.width, this.height);
  };
  /**
   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @param extent {int}
   */
  BoxSize.prototype.setExtent = function(flow, extent){
    this[flow.getPropExtent()] = extent;
  };
  /**
   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @param measure {int}
   */
  BoxSize.prototype.setMeasure = function(flow, measure){
    this[flow.getPropMeasure()] = measure;
  };
  /**
   @memberof Nehan.BoxSize
   @return {Object}
   */
  BoxSize.prototype.getCss = function(){
    var css = {};
    css.width = this.width + "px";
    css.height = this.height + "px";
    return css;
  };
  /**
   get content size of measure

   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  BoxSize.prototype.getMeasure = function(flow){
    return this[flow.getPropMeasure()];
  };
  /**
   get content size of extent

   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  BoxSize.prototype.getExtent = function(flow){
    return this[flow.getPropExtent()];
  };

  /**
   compare equality

   @memberof Nehan.BoxSize
   @param size {Nehan.BoxSize}
   @return {bool}
   */
  BoxSize.prototype.isEqualTo = function(size){
    return this.width === size.width && this.height === size.height;
  };

  return BoxSize;
})();

Nehan.BoxPosition = (function(){
  /**
     @memberof Nehan
     @class BoxPosition
     @classdesc logical css 'position' property
     @constructor
     @param position {string}
  */
  function BoxPosition(position){
    this.position = position;
    this.before = null;
    this.end = null;
    this.after = null;
    this.start = null;
  }

  /**
   @memberof Nehan.BoxPosition
   @return {boolean}
   */
  BoxPosition.prototype.isAbsolute = function(){
    return this.position === "absolute";
  };
  /**
   @memberof Nehan.BoxPosition
   @return {Object}
   */
  BoxPosition.prototype.getCss = function(flow){
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
  };

  return BoxPosition;
})();


Nehan.SectionHeader = (function(){
  /**
   @memberof Nehan
   @class SectionHeader
   @classdesc abstraction of section header with header rank, header title, and system unique id(optional).
   @param opt {Object}
   @param opt.id {String} - header_id string
   @param opt.rank {int} - header rank(h1 = 1, h2 = 2, ... etc)
   @param opt.title {String} - header title
   @constructor
   */
  function SectionHeader(opt){
    this.id = (typeof opt.id === "undefined")? -1 : opt.id;
    this.rank = opt.rank || 0;
    this.title = opt.title || "";
  }

  /**
   @memberof Nehan.SectionHeader
   @return {int}
   */
  SectionHeader.prototype.getId = function(){
    return this.id;
  };

  /**
   @memberof Nehan.SectionHeader
   @return {String}
   */
  SectionHeader.prototype.getTitle = function(){
    return this.title;
  };

  /**
   @memberof Nehan.SectionHeader
   @return {int}
   */
  SectionHeader.prototype.getRank = function(){
    return this.rank;
  };

  return SectionHeader;
})();

Nehan.Section = (function(){
  /**
   @memberof Nehan
   @class Section
   @classdesc section tree node with parent, next, child pointer.
   @param opt {Object}
   @param opt.parent {Nehan.Section}
   @param opt.pageNo {int}
   @constructor
  */
  function Section(opt){
    this._parent = opt.parent || null;
    this._pageNo = opt.pageNo || 0;
    this._header = null;
    this._next = null;
    this._child = null;
  }

  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.isRoot = function(){
    return this._parent === null;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasHeader = function(){
    return this._header !== null;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasHeaderId = function(){
    return this.getHeaderId() > 0;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasChild = function(){
    return this._child !== null;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasNext = function(){
    return this._next !== null;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.Section}
   */
  Section.prototype.getNext = function(){
    return this._next;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.Section}
   */
  Section.prototype.getChild = function(){
    return this._child;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.Section}
   */
  Section.prototype.getParent = function(){
    return this._parent;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.SectionHeader}
   */
  Section.prototype.getHeader = function(){
    return this._header;
  };
  /**
   @memberof Nehan.Section
   @return {int}
   */
  Section.prototype.getHeaderId = function(){
    if(this._header){
      return this._header.getId();
    }
    return null;
  };
  /**
   @memberof Nehan.Section
   @param header {Nehan.SectionHeader}
   */
  Section.prototype.setHeader = function(header){
    this._header = header;
  };
  /**
   @memberof Nehan.Section
   @return {int}
   */
  Section.prototype.getRank = function(){
    return this._header? this._header.rank : 0;
  };
  /**
   @memberof Nehan.Section
   @return {String}
   */
  Section.prototype.getTitle = function(){
    return this._header? this._header.title : "no title";
  };
  /**
   @memberof Nehan.Section
   @return {int}
   */
  Section.prototype.getPageNo = function(){
    return this._pageNo;
  };
  /**
   @memberof Nehan.Section
   @param page_no {int}
   */
  Section.prototype.updatePageNo = function(page_no){
    this._pageNo = page_no;
  };
  /**
   @memberof Nehan.Section
   @param section {Nehan.Section}
   */
  Section.prototype.addChild = function(section){
    if(this._child === null){
      this._child = section;
    } else {
      this._child.addNext(section);
    }
  };
  /**
   @memberof Nehan.Section
   @param section {Nehan.Section}
   */
  Section.prototype.addNext = function(section){
    if(this._next === null){
      this._next = section;
    } else {
      this._next.addNext(section);
    }
  };

  return Section;
})();


Nehan.TocContext = (function(){
  /**
     @memberof Nehan
     @class TocContext
     @classdesc context data of toc parsing.
     @constructor
  */
  function TocContext(){
    this.stack = [1];
  }

  /**
   @memberof Nehan.TocContext
   @return {String}
   @example
   * // assume that current toc stack is [1,2,1].
   * ctx.toString(); // "1.2.1"
   */
  TocContext.prototype.toString = function(){
    return this.stack.join(".");
  };
  /**
   countup toc count of current depth.

   @memberof Nehan.TocContext
   @return {Nehan.TocContext}
   @example
   * // assume that current toc stack is [1,2], and
   * // current toc depth is at 1(0 is first).
   * ctx.toString(); // "1.2"
   * ctx.stepNext();
   * ctx.toString(); // "1.3"
   */
  TocContext.prototype.stepNext = function(){
    if(this.stack.length > 0){
      this.stack[this.stack.length - 1]++;
    }
    return this;
  };
  /**
   append toc root

   @memberof Nehan.TocContext
   @return {Nehan.TocContext}
   @example
   * // assume that current toc stack is [1,2].
   * ctx.toString(); // "1.2"
   * ctx.startRoot();
   * ctx.toString(); // "1.2.1"
   */
  TocContext.prototype.startRoot = function(){
    this.stack.push(1);
    return this;
  };
  /**
   finish toc root

   @memberof Nehan.TocContext
   @return {Nehan.TocContext}
   @example
   * // assume that current toc stack is [1,2].
   * ctx.toString(); // "1.2"
   * ctx.startRoot();
   * ctx.toString(); // "1.2.1"
   * ctx.endRoot();
   * ctx.toString(); // "1.2"
   */
  TocContext.prototype.endRoot = function(){
    this.stack.pop();
    return this;
  };

  return TocContext;
})();

Nehan.OutlineContext = (function(){
  /**
     @memberof Nehan
     @class OutlineContext
     @classdesc outline context object. outline is generated by section root element, sectionning element, heading element etc.
     @constructor
     @param markup_name {String} - section root name like "body", "fieldset", "blockquote" etc.
  */
  function OutlineContext(markup_name){
    this.logs = [];
    this.markupName = markup_name || "body";
  }

  /**
   @memberof Nehan.OutlineContext
   @return {boolean}
   */
  OutlineContext.prototype.isEmpty = function(){
    return this.logs.length === 0;
  };

  /**
   @memberof Nehan.OutlineContext
   @return {Object} log object
   */
  OutlineContext.prototype.get = function(index){
    return this.logs[index] || null;
  };

  /**
   @memberof Nehan.OutlineContext
   @return {String}
   */
  OutlineContext.prototype.getMarkupName = function(){
    return this.markupName;
  };

  /**
   @memberof Nehan.OutlineContext
   @param value {Object}
   @return {Nehan.OutlineContext}
   */
  OutlineContext.prototype.add = function(value){
    this.logs.push(value);
    return this;
  };

  return OutlineContext;
})();

/**
 parser module to convert from context to section tree object.

 @namespace Nehan.OutlineContextParser
 */
Nehan.OutlineContextParser = (function(){
  var _parse = function(context, parent, ptr){
    var log = context.get(ptr++);
    if(log === null){
      return null;
    }
    switch(log.name){
    case "start-section":
      var section = new Nehan.Section({
	parent:parent,
	pageNo:log.pageNo
      });
      if(parent){
	parent.addChild(section);
      }
      _parse(context, section, ptr);
      break;

    case "end-section":
      _parse(context, parent.getParent(), ptr);
      break;

    case "set-header":
      var header = new Nehan.SectionHeader({
	id:log.headerId,
	rank:log.rank,
	title:log.title
      });
      if(parent === null){
	var auto_section = new Nehan.Section({
	  parent:null,
	  pageNo:log.pageNo
	});
	auto_section.setHeader(header);
	_parse(context, auto_section, ptr);
      } else if(!parent.hasHeader()){
	parent.setHeader(header);
	_parse(context, parent, ptr);
      } else {
	var rank = log.rank;
	var parent_rank = parent.getRank();
	if(rank < parent_rank){ // higher rank
	  ptr = Math.max(0, ptr - 1);
	  _parse(context, parent.getParent(), ptr);
	} else if(log.rank == parent_rank){ // same rank
	  var next_section = new Nehan.Section({
	    parent:parent,
	    pageNo:log.pageNo
	  });
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  _parse(context, next_section, ptr);
	} else { // lower rank
	  var child_section = new Nehan.Section({
	    parent:parent,
	    pageNo:log.pageNo
	  });
	  child_section.setHeader(header);
	  parent.addChild(child_section);
	  _parse(context, child_section, ptr);
	}
      }
      break;
    }
    return parent;
  };

  return {
    /**
     @memberof Nehan.OutlineContextParser
     @param context {Nehan.OutlineContext}
     @return {Nehan.Section} section tree root
     */
    parse : function(context){
      var ptr = 0;
      var root = new Nehan.Section({
	parent:null,
	pageNo:0
      });
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
/**
 convert section tree({@link Nehan.Section}) to DOMElement.

 @namespace Nehan.SectionTreeConverter
 */
Nehan.SectionTreeConverter = (function(){
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
      link.id = Nehan.Css.addNehanTocLinkPrefix(toc.headerId);
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
      parse(toc_ctx, ol, child, callbacks);
      li.appendChild(ol);
      toc_ctx = toc_ctx.endRoot();
    }
    var next = tree.getNext();
    if(next){
      parse(toc_ctx.stepNext(), parent, next, callbacks);
    }
    return parent;
  };

  return {
    /**
     create DOMElement from section tree object.

     @memberof Nehan.SectionTreeConverter
     @param section_tree {Nehan.Section} - outlie tree object generated by {@link Nehan.OutlineContextParser}({@link Nehan.OutlineContext} -> {@link Nehan.Section})
     @param callbacks {Object} - callbacks object
     @param callbacks.onClickLink {Function} - called when link object is clicked. do nothing by default.
     @param callbacks.createRoot {Function} - called when create dom root node, create <ul> by default.
     @param callbacks.createChild {Function} - called when create dom child, create &lt;li&gt; by default.
     @param callbacks.createLink {Function} - called when create link node in dom child, create &lt;a&gt; by default.
     @param callbacks.createToc {Function} - called when create toc object from toc and tree context.<br>
     * it is used in other callbacks as a callback argument.<br>
     * create {tocPos:xxx, title:xxx, pageNo:xxx, headerId:xxx} by default.
     @param callbacks.createPageNoItem {Function} - called when create page no item node in link object, create nothing by default.
     */
    convert : function(outline_tree, callbacks){
      callbacks = Nehan.Obj.merge({}, default_callbacks, callbacks || {});
      var toc_context = new Nehan.TocContext();
      var root_node = callbacks.createRoot();
      return parse(toc_context, root_node, outline_tree, callbacks); // section tree -> dom node
    }
  };
})();

Nehan.DocumentHeader = (function(){
  /**
     @memberof Nehan
     @class DocumentHeader
     @classdesc html &lt;head&gt; data wrapper.
     @constructor
  */
  function DocumentHeader(){
    this.title = "";
    this.metas = [];
    this.links = [];
    this.scripts = [];
    this.styles = [];
  }

  /**
   @memberof Nehan.DocumentHeader
   @param title {String}
   */
  DocumentHeader.prototype.setTitle = function(title){
    this.title = title;
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {String}
   */
  DocumentHeader.prototype.getTitle = function(){
    return this.title;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addLink = function(markup){
    this.links.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getLinks = function(){
    return this.links;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addMeta = function(markup){
    this.metas.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getMetas = function(){
    return this.metas;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param name {String}
   @return {Nehan.Tag}
   */
  DocumentHeader.prototype.getMetaByName = function(name){
    return Nehan.List.find(this.metas, function(meta){
      return meta.getTagAttr("name") === name;
    });
  };
  /**
   @memberof Nehan.DocumentHeader
   @param name {String}
   @return {String}
   */
  DocumentHeader.prototype.getMetaContentByName = function(name){
    var meta = this.getMetaByName(name);
    return meta? meta.getTagAttr("content") : null;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addScript = function(markup){
    this.scripts.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getScripts = function(){
    return this.scripts;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addStyle = function(markup){
    this.styles.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getStyles = function(){
    return this.styles;
  };

  return DocumentHeader;
})();


Nehan.Clear = (function(){
  /**
   @memberof Nehan
   @class Clear
   @classdesc abstraction of logical float clearance.
   @constructor
   @param direction {String} - "start" or "end" or "both"
   */
  function Clear(direction){
    this.value = direction;
    this.status = this._createStatus(direction || "both");
  }

  /**
   @memberof Nehan.Clear
   @param direction {String}
   @return {bool}
   */
  Clear.prototype.hasDirection = function(direction){
    if(this.value === "both"){
      return true;
    }
    return this.value === direction;
  };
  /**
   @memberof Nehan.Clear
   @param direction {String}
   */
  Clear.prototype.setDone = function(direction){
    this.status[direction] = true;
  };
  /**
   @memberof Nehan.Clear
   @param direction {String}
   @return {bool}
   */
  Clear.prototype.isDoneAll = function(){
    return Nehan.Obj.forall(this.status, function(prop, state){
      return state === true;
    });
  };

  Clear.prototype._createStatus = function(direction){
    var status = {};
    switch(direction){
    case "start": case "end":
      status[direction] = false;
      break;
    case "both":
      status.start = status.end = false;
      break;
    }
    return status;
  };

  return Clear;
})();

Nehan.FloatDirection = (function(){
  /**
     @memberof Nehan
     @class FloatDirection
     @classdesc abstraction of logical float direction.
     @constructor
     @param value {String} - "start" or "end" or "none"
   */
  function FloatDirection(value){
    this.value = value || "none";
  }

  /**
   @memberof Nehan.FloatDirection
   @param is_vert {bool}
   @return {Object}
   */
  FloatDirection.prototype.getCss = function(is_vert){
    var css = {};
    if(!is_vert){
      if(this.isStart()){
	css["css-float"] = "left";
      } else if(this.isEnd()){
	css["css-float"] = "right";
      }
    }
    return css;
  };
  /**
   @memberof Nehan.FloatDirection
   @return {string}
   */
  FloatDirection.prototype.getName = function(){
    return this.value;
  };
  /**
   @memberof Nehan.FloatDirection
   @return {boolean}
   */
  FloatDirection.prototype.isStart = function(){
    return this.value === "start";
  };
  /**
   @memberof Nehan.FloatDirection
   @return {boolean}
   */
  FloatDirection.prototype.isEnd = function(){
    return this.value === "end";
  };
  /**
   @memberof Nehan.FloatDirection
   @return {boolean}
   */
  FloatDirection.prototype.isNone = function(){
    return this.value === "none";
  };

  return FloatDirection;
})();


/**
   pre defined logical float direction collection.
   @namespace Nehan.FloatDirections
 */
Nehan.FloatDirections = {
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  start:(new Nehan.FloatDirection("start")),
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  end:(new Nehan.FloatDirection("end")),
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  none:(new Nehan.FloatDirection("none")),
  /**
     get {@link Nehan.FloatDirection} by float name.
     
     @memberof Nehan.FloatDirections
     @param name {String} - "start" or "end" or "none"
     @return {Nehan.FloatDirection}
  */
  get : function(name){
    return this[name] || null;
  }
};

Nehan.FloatGroup = (function(){
  /**
     @memberof Nehan
     @class FloatGroup
     @classdesc element set with same floated direction.
     @constructor
     @param elements {Array.<Nehan.Box>}
     @param float_direction {Nehan.FloatDirection}
  */
  function FloatGroup(elements, float_direction){
    this.elements = elements || [];
    this.floatDirection = float_direction || Nehan.FloatDirections.get("start");
    this._last = false;
  }

  /**
   @memberof Nehan.FloatGroup
   @return {bool}
   */
  FloatGroup.prototype.isLast = function(){
    return this._last;
  };
  /**
   @memberof Nehan.FloatGroup
   @param is_last {bool}
   */
  FloatGroup.prototype.setLast = function(is_last){
    this._last = is_last;
  };
  /**
   element is popped from float-stack, but unshifted to elements of float-group to keep original stack order.
   *<pre>
   * float-stack  | float-group
   *     [f1,f2]  |        []
   *  => [f1]     |      [f2] (pop f2 from float-stack, unshift f2 to float-group)
   *  => []       |  [f1, f2] (pop f1 from float-stack, unshift f1 to float-group)
   *</pre>

   @memberof Nehan.FloatGroup
   @param element {Nehan.Box}
   */
  FloatGroup.prototype.add = function(element){
    this.elements.unshift(element); // keep original stack order
  };
  /**
   @memberof Nehan.FloatGroup
   @return {boolean}
   */
  FloatGroup.prototype.isFloatStart = function(){
    return this.floatDirection.isStart();
  };
  /**
   @memberof Nehan.FloatGroup
   @return {boolean}
   */
  FloatGroup.prototype.isFloatEnd = function(){
    return this.floatDirection.isEnd();
  };
  /**
   @memberof Nehan.FloatGroup
   @return {Array.<Nehan.Box>}
   */
  FloatGroup.prototype.getElements = function(){
    return this.isFloatStart()? this.elements : Nehan.List.reverse(this.elements);
  };
  /**
   @memberof Nehan.FloatGroup
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  FloatGroup.prototype.getMeasure = function(flow){
    return this.elements.reduce(function(measure, element){
      return measure + element.getLayoutMeasure(flow);
    }, 0);
  };
  /**
   @memberof Nehan.FloatGroup
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  FloatGroup.prototype.getExtent = function(flow){
    return this.elements.reduce(function(extent, element){
      return Math.max(extent, element.getLayoutExtent(flow));
    }, 0);
  };
  /**
   @memberof Nehan.FloatGroup
   @return {Nehan.FloatDirection}
   */
  FloatGroup.prototype.getFloatDirection = function(){
    return this.floatDirection;
  };

  /**
   @memberof Nehan.FloatGroup
   @return {int}
   */
  FloatGroup.prototype.getLength = function(){
    return this.elements.length;
  };

  return FloatGroup;
})();


Nehan.FloatGroupStack = (function(){

  // [float block] -> FloatGroup
  var __pop_float_group = function(flow, float_direction, blocks){
    var head = blocks.pop() || null;
    if(head === null){
      return null;
    }
    var extent = head.getLayoutExtent(flow);
    var group = new Nehan.FloatGroup([head], float_direction);

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

  // [floated element] -> [FloatGroup]
  var __make_float_groups = function(flow, float_direction, blocks){
    var ret = [], group;
    do{
      group = __pop_float_group(flow, float_direction, blocks);
      if(group){
	ret.push(group);
      }
    } while(group !== null);

    if(ret.length > 0){
      ret[0].setLast(true);
    }
    return ret;
  };

  /**
     @memberof Nehan
     @class FloatGroupStack
     @classdesc pop {@link Nehan.FloatGroup} with larger extent from start or end.
     @constructor
     @param flow {Nehan.BoxFlow}
     @param start_blocks {Array.<Nehan.Box>}
     @param end_blocks {Array.<Nehan.Box>}
  */
  function FloatGroupStack(flow, start_blocks, end_blocks){
    var start_groups = __make_float_groups(flow, Nehan.FloatDirections.start, start_blocks);
    var end_groups = __make_float_groups(flow, Nehan.FloatDirections.end, end_blocks);
    this.stack = start_groups.concat(end_groups).sort(function(g1, g2){
      return g1.getExtent(flow) - g2.getExtent(flow);
    });
    var max_group =  Nehan.List.maxobj(this.stack, function(group){
      return group.getExtent(flow);
    });
    this.flow = flow;
    this.lastGroup = null;
    //console.log("max group from %o is %o", this.stack, max_group);
    this.extent = max_group? max_group.getExtent(flow) : 0;
  }

  /**
   @memberof Nehan.FloatGroupStack
   @return {boolean}
   */
  FloatGroupStack.prototype.isEmpty = function(){
    return this.stack.length === 0;
  };
  /**
   @memberof Nehan.FloatGroupStack
   @return {int}
   */
  FloatGroupStack.prototype.getExtent = function(){
    return this.extent;
  };
  /**
   @memberof Nehan.FloatGroupStack
   @return {Nehan.FloatGroup}
   */
  FloatGroupStack.prototype.getLastGroup = function(){
    return this.lastGroup;
  };
  /**
   pop {@link Nehan.FloatGroup} with larger extent from start or end.

   @memberof Nehan.FloatGroupStack
   @return {Nehan.FloatGroup}
   */
  FloatGroupStack.prototype.pop = function(){
    this.lastGroup = this.stack.pop() || null;
    return this.lastGroup;
  };

  return FloatGroupStack;
})();


/**
 @namespace Nehan.LineHeight
 */
Nehan.LineHeight = (function(){
  return {
    /**
     @memberof Nehan.Baseline
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line object
     @param line_height {Number} - target line height(not px, rate only)
     */
    set : function(flow, line, line_height){
      if(line.elements.length === 0){
	return;
      }
      var base_font_size = line.getFontSize();
      var max_line_height = Math.floor(line.maxFontSize * line_height);
      var extent_fix_size = max_line_height - line.maxExtent;
      if(extent_fix_size === 0){
	return;
      }
      var line_fix_size = Math.floor(line.maxFontSize * (line_height - 1));
      var half_leading = Math.round(line_fix_size / 2);
      //console.log("line %o(%s)\n extent_fix_size:%d, line_fix_size:%d", line, line.toString(), extent_fix_size, line_fix_size);

      // notice that edge of line-root is already included in 'parent' block(with same markup).
      // so this edge is set to create proper line-height.
      line.edge = new Nehan.BoxEdge();

      // if there is some inline element that is larger than max-line-height,
      // set half-leading to after only.
      if(extent_fix_size < 0){
	// only one element(like img only line)
	if(line.elements.length <= 1){
	  return; // do nothing
	}
	if(Math.abs(extent_fix_size) >= base_font_size){
	  //console.log("set half leading after(%d)", half_leading);
	  line.edge.padding.setAfter(flow, half_leading);
	  return;
	}
      }

      // if line is decorated by ruby or empha, extra size is already added to before line.
      // so padding is added to after only.
      if(line.isDecorated){
	//console.log("set decorated fix after(%d)", extent_fix_size);
	line.edge.padding.setAfter(flow, Math.abs(extent_fix_size));
	return;
      }

      if(half_leading > 0){
	//console.log("set line half leading to before(%d), after(%d)", half_leading, half_leading);
	line.edge.padding.setBefore(flow, half_leading);
	line.edge.padding.setAfter(flow, half_leading);
      }
    }
  };
})();

/**
 @namespace Nehan.Baseline
 */
Nehan.VerticalAlign = (function(){
  var __set_vert_baseline = function(flow, line){
    Nehan.List.iter(line.elements, function(element){
      var font_size = element.maxFontSize;
      var from_after = Math.floor((line.maxFontSize - font_size) / 2);
      if (from_after > 0){
	var edge = element.edge? element.edge.clone() : new Nehan.BoxEdge();
	edge.padding.setAfter(flow, from_after); // set offset to padding
	element.size.width = (line.maxExtent - from_after);
	
	// set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	Nehan.Obj.copy(element.css, edge.getCss(flow));
      }
    });
  };

  var __set_hori_baseline = function(flow, line){
    Nehan.List.iter(line.elements, function(element){
      var font_size = element.maxFontSize;
      var from_before = line.maxExtent - element.maxExtent;
      //console.log("line.maxExtent:%d, line.maxFontSize:%d, element.extent:%d", line.maxExtent, line.maxFontSize, element.maxExtent);
      if (from_before > 0){
	var edge = element.edge? element.edge.clone() : new Nehan.BoxEdge();
	edge.padding.setBefore(flow, from_before); // set offset to padding

	// set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	Nehan.Obj.copy(element.css, edge.getCss(flow));
      }
    });
  };

  return {
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setMiddle : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setBefore : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setTextBefore : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setAfter : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setTextAfter : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setSub : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setSuper : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     @param percent {int} - percent of line-height
     */
    setPercent : function(flow, line, percent){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     @param px {int}
     */
    setLength : function(flow, line, px){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setBaseline : function(flow, line){
      if(flow.isTextVertical()){
	__set_vert_baseline(flow, line);
      } else {
	__set_hori_baseline(flow, line);
      }
    }
  };
})();


Nehan.TextAlign = (function(){
  /**
     @memberof Nehan
     @class TextAlign
     @classdesc abstraction of logical text align(start, end, center)
     @constructor
     @param value {String} - logical align direction, "start" or "end" or "center"
  */
  function TextAlign(value){
    this.value = value || "start";
  }

  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isStart = function(){
    return this.value === "start";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isEnd = function(){
    return this.value === "end";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isCenter = function(){
    return this.value === "center";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isJustify = function(){
    return this.value === "justify";
  };

  /**
   @memberof Nehan.TextAlign
   @param line {Nehan.Box}
   */
  TextAlign.prototype.setAlign = function(line){
    var style = line.context.style;
    var flow = style.flow;
    var content_measure  = line.getContentMeasure(flow);
    var space_measure = content_measure - line.inlineMeasure;
    if(space_measure <= 0){
      return;
    }
    var padding = new Nehan.Padding();
    if(this.isCenter()){
      var start_offset = Math.floor(space_measure / 2);
      line.size.setMeasure(flow, content_measure - start_offset);
      padding.setStart(flow, start_offset);
      Nehan.Obj.copy(line.css, padding.getCss());
    } else if(this.isEnd()){
      line.size.setMeasure(flow, line.inlineMeasure);
      padding.setStart(flow, space_measure);
      Nehan.Obj.copy(line.css, padding.getCss());
    }
  };

  /**
   @memberof Nehan.TextAlign
   @param line {Nehan.Box}
   */
  TextAlign.prototype.setJustify = function(line){
    var style = line.context.style;
    var flow = style.flow;
    var font_size = style.getFontSize();
    var half_font_size = Math.floor(font_size / 2);
    var quat_font_size = Math.floor(half_font_size / 2);
    var cont_measure = line.getContentMeasure(flow);
    var real_measure = line.inlineMeasure;
    var ideal_measure = font_size * Math.floor(cont_measure / font_size);
    var rest_space = ideal_measure - real_measure;
    var max_thres = style.getFontSize() * 2;
    var extend_parent = function(parent, add_size){
      if(parent){
	var pre_size = parent.size.getMeasure(flow);
	var new_size = pre_size + add_size;
	//console.log("extend parent:%d -> %d", pre_size, new_size);
	parent.size.setMeasure(flow, new_size);
      }
    };
    if(line.hasLineBreak || rest_space >= max_thres || rest_space === 0){
      return;
    }

    var filter_text = function(elements){
      return elements.reduce(function(ret, element){
	if(element instanceof Nehan.Box){
	  // 2015/10/8 update
	  // skip recursive child inline, only select text element of root line.
	  return element.isTextBlock()? ret.concat(filter_text(element.elements || [])) : ret;
	}
	return element? ret.concat(element) : ret;
      }, []);
    };
    var text_elements = filter_text(line.elements);
    if(text_elements.length === 0){
      return;
    }
    var targets = text_elements.filter(function(element){
      return ((element instanceof Nehan.Word) ||
	      (element instanceof Nehan.Char && !element.isKerningChar()));
    });
    if(targets.length === 0){
      return;
    }
    if(rest_space < 0){
      Nehan.List.iter(targets, function(text){
	if(text instanceof Nehan.Word){
	  var del_size;
	  del_size = text.paddingEnd || 0;
	  if(del_size > 0){
	    rest_space += del_size;
	    extend_parent(text.parent, -1 * del_size);
	    text.paddingEnd = 0;
	    //console.log("del space %d from %s", del_size, text.data);
	    if(rest_space >= 0){
	      return false;
	    }
	  }
	  del_size = text.paddingStart || 0;
	  if(del_size > 0){
	    rest_space += del_size;
	    extend_parent(text.parent, -1 * del_size);
	    text.paddingStart = 0;
	    //console.log("del space %d from %s", del_size, text.data);
	    if(rest_space >= 0){
	      return false;
	    }
	  }
	}
	return true;
      });
      return;
    }
    // rest_space > 0
    // so space is not enough, add 'more' space to word.
    //console.info("[%s]some spacing needed! %dpx", line.toString(), rest_space);
    var add_space = Math.max(1, Math.min(quat_font_size, Math.floor(rest_space / targets.length / 2)));
    Nehan.List.iter(targets, function(text){
      text.paddingEnd = (text.paddingEnd || 0) + add_space;
      rest_space -= add_space;
      extend_parent(text.parent, add_space);
      //console.log("add space end %d to [%s]", add_space, text.data);
      if(rest_space <= 0){
	return false;
      }
      if(text instanceof Nehan.Word){
	text.paddingStart = (text.paddingStart || 0) + add_space;
	rest_space -= add_space;
	extend_parent(text.parent, add_space);
	//console.log("add space %d to [%s]", add_space, text.data);
	if(rest_space <= 0){
	  return false;
	}
      }
      return true;
    });
  };

  return TextAlign;
})();


/**
   pre defined text align set

   @namespace Nehan.TextAligns
*/
Nehan.TextAligns = {
  start:(new Nehan.TextAlign("start")),
  end:(new Nehan.TextAlign("end")),
  center:(new Nehan.TextAlign("center")),
  justify:(new Nehan.TextAlign("justify")),
  /**
     @memberof Nehan.TextAligns
     @param value - logical text align direction, "start" or "end" or "center".
     @return {Nehan.TextAlign}
  */
  get : function(value){
    return this[value] || null;
  }
};

Nehan.Break = (function(){
  /**
     @memberof Nehan
     @class Break
     @classdesc logical abstraction for css 'page-break-before' or 'page-break-after'
     @constructor
     @param value {string} - "always" or "avoid" or "left" or "right"
   */
  function Break(value){
    this.value = value;
  }

  /**
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isAlways = function(){
    return this.value === "always";
  };
  /**
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isAvoid = function(){
    return this.value === "avoid";
  };
  /**
   true if breaking at first page of 2-page spread.
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isFirst = function(flow){
    if(flow.isTextVertical()){
      return flow.isBlockLeftToRight()? (this.value === "left") : (this.value === "right");
    }
    return flow.isTextLeftToRight()? (this.value === "left") : (this.value === "right");
  };
  /**
   true if breaking at second page of 2-page spread.
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isSecond = function(flow){
    return this.isFirst(flow) === false;
  };
  /**
   (TODO)
   @memberof Nehan.Break
   @param order {int}
   @return {boolean}
   */
  Break.prototype.isNth = function(order){
  };

  return Break;
})();


/**
   pre defined break collection.
   @namespace Nehan.Breaks
*/
Nehan.Breaks = {
  before:{
    always:(new Nehan.Break("always")),
    avoid:(new Nehan.Break("avoid")),
    left:(new Nehan.Break("left")),
    right:(new Nehan.Break("right")),
    first:(new Nehan.Break("first")), // correspond to break-before:"left"
    second:(new Nehan.Break("second")) // correspond to break-before:"right"
  },
  after:{
    always:(new Nehan.Break("always")),
    avoid:(new Nehan.Break("avoid")),
    left:(new Nehan.Break("left")),
    right:(new Nehan.Break("right")),
    first:(new Nehan.Break("first")), // correspond to break-before:"left"
    second:(new Nehan.Break("second")) // correspond to break-before:"right"
  },
  /**
     @memberof Nehan.Breaks
     @param value {String} - "always", "avoid", "left", "right", "first", "second"
  */
  getBefore : function(value){
    return this.before[value] || null;
  },
  /**
     @memberof Nehan.Breaks
     @param value {String} - "always", "avoid", "left", "right", "first", "second"
  */
  getAfter : function(value){
    return this.after[value] || null;
  }
};


Nehan.Page = (function(){
  /**
     @memberof Nehan
     @class Page
     @classdesc abstract evaluated page object.
     @constructor
     @param opt {Object}
     @param opt.element {DOMElement} - generated DOMElement.
     @param opt.text {string} - text in page.
     @param opt.seekPos {int} - page seek position in literal string pos.
     @param opt.pageNo {int} - page index starts from 0.
     @param opt.charPos {int} - character position of this page from first page.
     @param opt.charCount {int} - character count included in this page object.
     @param opt.percent {int}
  */
  function Page(opt){
    Nehan.Obj.merge(this, {
      tree:null,
      element:null,
      text:"",
      seekPos:0,
      pageNo:0,
      charPos:0,
      charCount:0,
      percent:0
    }, opt);
  }

  return Page;
})();


Nehan.Flow = (function(){
  /**
     @memberof Nehan
     @class Flow
     @classdesc abstraction of flow, left to right as "lr", right to left as "rl", top to bottom as "tb".
     @constructor
     @param dir {String}
     @example
     * new Flow("lr").isHorizontal(); // true
     * new Flow("rl").isHorizontal(); // true
     * new Flow("lr").isLeftToRight(); // true
     * new Flow("rl").isLeftToRight(); // false
     * new Flow("rl").isRightToLeft(); // true
     * new Flow("tb").isHorizontal(); // false
     * new Flow("tb").isVertical(); // true
  */
  function Flow(dir){
    this.dir = dir;
  }

  /**
   @memberof Nehan.Flow
   @param dir {String}
   */
  Flow.prototype.init = function(dir){
    this.dir = dir;
  };
  /**
   @memberof Nehan.Flow
   @return {boolean}
   */
  Flow.prototype.isHorizontal = function(){
    return (this.dir === "lr" || this.dir === "rl");
  };
  /**
   @memberof Nehan.Flow
   @return {boolean}
   */
  Flow.prototype.isVertical = function(){
    return (this.dir === "tb");
  };
  /**
   @memberof Nehan.Flow
   @return {boolean}
   */
  Flow.prototype.isLeftToRight = function(){
    return this.dir === "lr";
  };
  /**
   @memberof Nehan.Flow
   @return {boolean}
   */
  Flow.prototype.isRightToLeft = function(){
    return this.dir === "rl";
  };

  return Flow;
})();


Nehan.BlockFlow = (function(){
  /**
     @memberof Nehan
     @class BlockFlow
     @classdesc flow direction at block level.
     @constructor
     @param dir {string} - "lr" or "rl" or "tb"
     @extends Nehan.Flow
     @example
     * var bf = new BlockFlow("tb");
  */
  function BlockFlow(dir){
    Nehan.Flow.call(this, dir);
  }

  Nehan.Class.extend(BlockFlow, Nehan.Flow);

  /**
     get physical directional property of logical before.

     @memberof Nehan.BlockFlow
     @method getPropBefore
     @return {string}
     @example
     * new BlockFlow("tb").getPropBefore(); // => "top"
     * new BlockFlow("lr").getPropBefore(); // => "left"
     * new BlockFlow("rl").getPropBefore(); // => "right"
  */
  BlockFlow.prototype.getPropBefore = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

  /**
     get physical directional property of logical before.

     @memberof Nehan.BlockFlow
     @method getPropAfter
     @return {string}
     @example
     * new BlockFlow("tb").getPropAfter(); // => "bottom"
     * new BlockFlow("lr").getPropAfter(); // => "right"
     * new BlockFlow("rl").getPropAfter(); // => "left"
  */
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


Nehan.InlineFlow = (function(){
  /**
   @memberof Nehan
   @class InlineFlow
   @classdesc flow abstraction at inline level.
   @constructor
   @extends {Nehan.Flow}
   @param dir {String} - "lr" or "rl"(but not supported) or "tb"
   */
  function InlineFlow(dir){
    Nehan.Flow.call(this, dir);
  }
  Nehan.Class.extend(InlineFlow, Nehan.Flow);

  /**
   @memberof Nehan.InlineFlow
   @return {String}
   @example
   * new InlineFlow("lr").getPropStart(); // "left"
   * new InlineFlow("rl").getPropStart(); // "right"
   * new InlineFlow("tb").getPropStart(); // "top"
   */
  InlineFlow.prototype.getPropStart = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

  /**
   @memberof Nehan.InlineFlow
   @return {String}
   @example
   * new InlineFlow("lr").getPropEnd(); // "right"
   * new InlineFlow("rl").getPropEnd(); // "left"
   * new InlineFlow("tb").getPropEnd(); // "bottom"
   */
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


Nehan.BoxFlow = (function(){
  /**
     @memberof Nehan
     @class BoxFlow
     @classdesc abstract inline and block direction
     @constructor
     @param indir {string} - "lr" or "tb"("rl" not supported yet)
     @param blockdir {string} - "tb" or "lr" or "rl"
  */
  function BoxFlow(indir, blockdir){
    this.inflow = new Nehan.InlineFlow(indir);
    this.blockflow = new Nehan.BlockFlow(blockdir);
  }

  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextLineFirst = function(){
    if(this.isTextVertical() && this.blockflow.isLeftToRight()){
      return true;
    }
    return false;
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isBlockflowVertical = function(){
    return this.blockflow.isVertical();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextVertical = function(){
    return this.inflow.isVertical();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextHorizontal = function(){
    return this.inflow.isHorizontal();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextLeftToRight = function(){
    return this.inflow.isLeftToRight();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextRightToLeft = function(){
    return this.inflow.isRightToLeft();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isBlockLeftToRight = function(){
    return this.blockflow.isLeftToRight();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isBlockRightToLeft = function(){
    return this.blockflow.isRightToLeft();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {Object}
   */
  BoxFlow.prototype.getCss = function(){
    var css = {};

    // notice that "float" property is converted into "cssFloat" in evaluation time.
    if(this.isTextVertical()){
      css["css-float"] = this.isBlockLeftToRight()? "left" : "right";
    } else {
      css["css-float"] = this.isTextLeftToRight()? "left" : "right";
    }
    return css;
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   @example
   * new BlockFlow("tb", "rl").getName(); // "tb-rl"
   * new BlockFlow("lr", "tb").getName(); // "lr-tb"
   */
  BoxFlow.prototype.getName = function(){
    return [this.inflow.dir, this.blockflow.dir].join("-");
  };
  /**
   get physical property name from logical property.
   @memberof Nehan.BoxFlow
   @param prop {string} - logical direction name
   @return {string}
   @example
   * new BlockFlow("tb", "rl").getProp("start"); // "top"
   * new BlockFlow("lr", "tb").getProp("end"); // "right"
   */
  BoxFlow.prototype.getProp = function(prop){
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
    console.error("BoxFlow::getProp, undefined property(%o)", prop);
    throw "BoxFlow::getProp, undefined property";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropStart = function(){
    return this.inflow.getPropStart();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropEnd = function(){
    return this.inflow.getPropEnd();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropBefore = function(){
    return this.blockflow.getPropBefore();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropAfter = function(){
    return this.blockflow.getPropAfter();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropExtent = function(){
    return this.isTextVertical()? "width" : "height";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropMeasure = function(){
    return this.isTextVertical()? "height" : "width";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropWidth = function(){
    return this.isTextVertical()? "extent" : "measure";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropHeight = function(){
    return this.isTextVertical()? "measure" : "extent";
  };
  /**
   get flipped box flow, but result depends on setting of Nehan.Config.boxFlowSet.

   @memberof Nehan.BoxFlow
   @return {Nehan.BoxFlow}
   @example
   * // if  Nehan.Config.boxFlowSet.hori = "lr-tb"
   * // and Nehan.Config.boxFlowSet.vert = "tb-rl"
   * new BlockFlow("tb", "rl").getFlipFlow(); // BoxFlow("lr", "tb")
   * new BlockFlow("lr", "tb").getFlipFlow(); // BoxFlow("tb", "rl")
   */
  BoxFlow.prototype.getFlipFlow = function(){
    return this.isTextVertical()? Nehan.Display.getStdHoriFlow() : Nehan.Display.getStdVertFlow();
  };
  /**
   get physical box size interpreted by this box flow.

   @memberof Nehan.BoxFlow
   @param measure {int}
   @param extent {int}
   @return {Nehan.BoxSize}
   @example
   * new BoxFlow("lr", "tb").getBoxSize(100, 200); // BoxSize(100, 200)
   * new BoxFlow("tb", "rl").getBoxSize(100, 200); // BoxSize(200, 100)
   * new BoxFlow("tb", "lr").getBoxSize(100, 200); // BoxSize(200, 100)
   */
  BoxFlow.prototype.getBoxSize = function(measure, extent){
    var size = new Nehan.BoxSize(0, 0);
    size[this.getPropMeasure()] = measure;
    size[this.getPropExtent()] = extent;
    return size;
  };

  /**
   @memberof Nehan.BoxFlow
   @return {String}
   */
  BoxFlow.prototype.toString = function(){
    return this.getName();
  };

  return BoxFlow;
})();


/**
   pre defined box flow collection.
   @namespace Nehan.BoxFlows
*/
Nehan.BoxFlows = {
  "tb-rl":(new Nehan.BoxFlow("tb", "rl")),
  "tb-lr":(new Nehan.BoxFlow("tb", "lr")),
  "lr-tb":(new Nehan.BoxFlow("lr", "tb")),
  "rl-tb":(new Nehan.BoxFlow("rl", "tb")),
  /**
     get box flow by inflow and blockflow.

     @memberof Nehan.BoxFlows
     @param inflow {string} - "tb" or "lr"
     @param blockflow {string} - "tb" or "lr" or "rl"
     @return {Nehan.BoxFlow}
  */
  get: function(inflow, blockflow){
    return this.getByName([inflow, blockflow].join("-"));
  },
  /**
     get box flow by flow-name.

     @memberof Nehan.BoxFlows
     @param name {string} - "lr-tb" or "tb-rl" or "tb-lr"
     @return {Nehan.BoxFlow}
  */
  getByName : function(name){
    return this[name] || null;
  }
};

// http://www.w3.org/TR/css3-text/#word-break-property
Nehan.WordBreak = (function(){
  /**
     @memberof Nehan
     @class WordBreak
     @classdesc abstract for css word-break property.
     @constructor
     @param value {String} - keep-all/normal/break-all
  */
  function WordBreak(value){
    this.value = value;
  }

  /**
   @memberof Nehan.WordBreak
   @return {boolean}
   */
  WordBreak.prototype.isWordBreakAll = function(){
    return this.value === "break-all";
  };

  /**
   @memberof Nehan.WordBreak
   @return {boolean}
   */
  WordBreak.prototype.isHyphenationEnable = function(){
    return this.value === "normal";
  };

  return WordBreak;
})();


/**
   @namespace Nehan.WordBreaks
*/
Nehan.WordBreaks = {
  "keep-all":(new Nehan.WordBreak("keep-all")),
  "normal":(new Nehan.WordBreak("normal")),
  "break-all":(new Nehan.WordBreak("break-all")),
  "loose":(new Nehan.WordBreak("loose")),
  "break-strict":(new Nehan.WordBreak("break-strict")),
  getByName : function(name){
    return this[name] || null;
  }
};

/**
   utility module to get more strict metrics using canvas.

   @namespace Nehan.TextMetrics
*/
Nehan.TextMetrics = (function(){
  var __span = (function(){
    var span = document.createElement("span");
    Nehan.Obj.copy(span.style, {
      margin:0,
      padding:0,
      border:0,
      lineHeight:1,
      height:"auto",
      visibility:"hidden"
    });
    return span;
  })();

  return {
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {Object} - {width:xxx, height:yyy}
    */
    getMetrics : function(font, text){
      var body = document.body;
      var style = __span.style;
      body.style.display = "block"; // must be visible
      style.font = font.getCssShorthand();
      __span.innerHTML = text;
      body.appendChild(__span);
      var rect = __span.getBoundingClientRect();
      var metrics = {
	width:Math.round(rect.right - rect.left),
	height:Math.round(rect.bottom - rect.top)
      };
      //var metrics = {width:__span.offsetWidth, height:__span.offsetHeight};
      body.removeChild(__span);
      //console.log("metrics(%s):(%d,%d)", text, metrics.width, metrics.height);
      return metrics;
    },
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {int}
    */
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      //console.log("[%s] - %f", text, metrics.width);
      return metrics.width;
    }
  };
})();


Nehan.Text = (function(){
  /**
     @memberof Nehan
     @class Text
     @param content {String}
  */
  function Text(content){
    this.content = this._normalize(content);
  }

  Text.prototype._normalize = function(text){
    return text.replace(/^\n+/, "");
  };

  /**
   check if text consists of white space only

   @memberof Nehan.Text
   @return {boolean}
   */
  Text.prototype.isWhiteSpaceOnly = function(){
    // \s contain multi character space,
    // but we want to replace half one only.
    var replaced = this.content
	  .replace(/ /g, "") // half space
	  .replace(/\n/g, "")
	  .replace(/\t/g, "");
    return replaced === "";
  };

  /**
   @memberof Nehan.Text
   @return {String}
   */
  Text.prototype.getContent = function(){
    return this.content;
  };

  /**
   @memberof Nehan.Text
   @return {Nehan.Char}
   */
  Text.prototype.getHeadChar = function(){
    return new Nehan.Char({data:this.content.substring(0,1)});
  };

  /**
   @memberof Nehan.Text
   @return {Nehan.Text}
   */
  Text.prototype.cutHeadChar = function(){
    this.content = this.content.substring(1);
    return this;
  };

  /**
   @memberof Nehan.Text
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Text.prototype.toString = function(flow){
    return this.getContent();
  };

  return Text;
})();

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
  var __kakko_start = ["\uff62","\u300c","\u300e","\u3010","\u3016","\uff3b","\uff08","\u300a","\u3008","\u226a","\uff1c","\uff5b","\x7b","\x5b","\x28", "\u2772", "\u3014"];
  var __kakko_end = ["\u300d","\uff63","\u300f","\u3011","\u3017","\uff3d","\uff09","\u300b","\u3009","\u226b","\uff1e","\uff5d","\x7d","\x5d","\x29", "\u2773", "\u3015"];
  var __small_kana = ["\u3041","\u3043","\u3045","\u3047","\u3049","\u3063","\u3083","\u3085","\u3087","\u308e","\u30a1","\u30a3","\u30a5","\u30a7","\u30a9","\u30f5","\u30f6","\u30c3","\u30e3","\u30e5","\u30e7","\u30ee"];
  var __head_ng = ["\uff09","\uff0c", "\x5c","\x29","\u300d","\u3011","\u3015","\uff3d","\x5c","\x5d","\u3002","\u300f","\uff1e","\u3009","\u300b","\u3001","\uff0e","\x5c","\x2e","\x2c","\u201d","\u301f"];
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
    this._setup();
  };

  /**
   @memberof Nehan.Char
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Char.prototype.getData = function(flow){
    return flow.isTextVertical()? this._getDataVert() : this._getDataHori();
  };

  /**
   @memberof Nehan.Char
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Char.prototype.toString = function(flow){
    return this.getData(flow);
  };

  Char.prototype._getDataVert = function(){
    var data = this.vertCnv || this.data || this.ref;
    return data + (this.ligature || "");
  };

  Char.prototype._getDataHori = function(){
    var data = this.horiCnv || this.data || this.ref;
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
    css.display = "block";
    css["float"] = "left";
    css["line-height"] = "1em";
    css.height = "1em";
    return css;
  };

  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Char.prototype.getCssHoriEmphaText = function(line){
    var css = {};
    var font_size = line.getFontSize();
    var half_font_size = Math.floor(line.getFontSize() / 2);
    css.display = "block";
    css.width = font_size + "px";
    css.height = half_font_size + "px";
    css["padding-left"] = "0.25em";
    css["line-height"] = half_font_size + "px";
    css["font-size"] = half_font_size + "px";
    css["float"] = "left";
    
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
   @param flow {Nehan.BoxFlow}
   @return {Float | Int}
   */
  Char.prototype.getAdvanceScale = function(flow){
    return flow.isTextVertical()? this.getVertScale() : this.getHoriScale();
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
    if(flow.isTextVertical()){
      this._setMetricsVert(flow, font);
    } else {
      this._setMetricsHori(flow, font);
    }
  };

  Char.prototype._setMetricsVert = function(flow, font){
    var advance_scale = this.getAdvanceScale(flow);
    this.bodySize = (advance_scale != 1)? Math.round(font.size * advance_scale) : font.size;
    if(this.spaceRateStart){
      this.paddingStart = Math.round(this.spaceRateStart * font.size);
    }
    if(this.spaceRateEnd){
      this.paddingEnd = Math.round(this.spaceRateEnd * font.size);
    }
    if(this.isSmallKana()){
      this.bodySize -= Math.floor(font.size * 0.1);
    }
  };

  Char.prototype._setMetricsHori = function(flow, font){
    var advance_scale = this.getAdvanceScale(flow);
    if(this.spaceRateStart){
      this.paddingStart = Math.round(this.spaceRateStart * font.size);
    }
    if(this.spaceRateEnd){
      this.paddingEnd = Math.round(this.spaceRateEnd * font.size);
    }
    /*
    // if italic in horizontal, font-size !== advance size, so strict size is required.
    if(font.isItalic()){
      this.bodySize = Nehan.TextMetrics.getMeasure(font, this.getData(flow));
      console.log("[%s]normal advance:%d, strict advance:%d", this.data, font.size, this.bodySize);
      return;
    }*/
    // if hankaku or small-kana except char-ref or white-space, get strict size
    if((this.isHankaku() || this.isSmallKana()) && !this.isCharRef() && !this.isWhiteSpace()){
      this.bodySize = Nehan.TextMetrics.getMeasure(font, this.getData(flow));
      return;
    }
    if(this.isHalfKana()){
      this.bodySize = Math.round(font.size / 2);
      return;
    }
    this.bodySize = (advance_scale != 1)? Math.round(font.size * advance_scale) : font.size;
  };

  Char.prototype._setVertImg = function(vert_img, vscale, hscale){
    this.vertImg = vert_img;
    this.vscale = vscale;
    this.hscale = hscale;
  };

  Char.prototype._setVertCnv = function(cnv, vscale, hscale){
    this.vertCnv = cnv;
    this.vscale = vscale;
    this.hscale = hscale;
  };

  Char.prototype._setHoriCnv = function(cnv){
    this.horiCnv = cnv;
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

  Char.prototype._setup = function(){
    // for half-size char, rotate 90 and half-scale in horizontal by default.
    if(this.isHankaku()){
      this.hscale = 0.5; // 0.5 as default size
      this._setRotate(90);
    }
    if(this.data){
      this._setupByCharCode(this.data.charCodeAt(0));
    }
    if(this.isSpace()){
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.space;
    } else if(this.isNbsp()){
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.nbsp;
    } else if(this.isEnsp()){
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.ensp;
    } else if(this.isEmsp()){
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.emsp;
    } else if(this.isThinsp()){
      this.vscale = this.hscale = Nehan.Config.spacingSizeRate.thinsp;
    } else if(this.isTabSpace()){
      this.vscale = this.hscale = Math.floor(Nehan.Config.tabCount / 2);
    } else if(this.isLessThanSign()){
      this._setRotateOrVertImg(90, "kakko7", 0.5, 0.5);
    } else if(this.isGreaterThanSign()){
      this._setRotateOrVertImg(90, "kakko8", 0.5, 0.5);
    }
  };

  Char.prototype._setupByCharCode = function(code){
    switch(code){
    case 12300: // LEFT CORNER BRACKET(U+300C)
      this._setVertImg("kakko1", 0.5, 0.5); break;
    case 65378: // HALFWIDTH LEFT CORNER BRACKET(U+FF62)
      this._setVertImg("kakko1", 0.5, 0.5); break;
    case 12301: // RIGHT CORNER BRACKET(U+300D)
      this._setVertImg("kakko2", 0.5, 0.5); break;
    case 65379: // HALFWIDTH RIGHT CORNER BRACKET(U+FF63)
      this._setVertImg("kakko2", 0.5, 0.5); break;
    case 12302: // LEFT WHITE CORNER BRACKET(U+300E)
      this._setVertImg("kakko3", 0.5, 0.5); break;
    case 12303: // RIGHT WHITE CORNER BRACKET(U+300F)
      this._setVertImg("kakko4", 0.5, 0.5); break;
    case 65288: // FULLWIDTH LEFT PARENTHESIS(U+FF08)
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 40: // LEFT PARENTHESIS(U+0028)
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 65371: // FULLWIDTH LEFT CURLY BRACKET(U+FF5B)
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 123: // LEFT CURLY BRACKET(U+007B)
      this._setVertImg("kakko5", 0.5, 0.5); break;
    case 65289: // FULLWIDTH RIGHT PARENTHESIS(U+FF09)
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 41: // RIGHT PARENTHESIS(U+0029)
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 65373: // FULLWIDTH RIGHT CURLY BRACKET(U+FF5D)
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 125: // RIGHT CURLY BRACKET(U+007D)
      this._setVertImg("kakko6", 0.5, 0.5); break;
    case 65308: // FULLWIDTH LESS-THAN SIGN(U+FF1C)
      this._setVertImg("kakko7", 0.5, 0.5); break;
    case 12296: // LEFT ANGLE BRACKET(U+3008)
      this._setVertImg("kakko7", 0.5, 0.5); break;
    case 65310: // FULLWIDTH GREATER-THAN SIGN(U+FF1E)
      this._setVertImg("kakko8", 0.5, 0.5); break;
    case 12297: // RIGHT ANGLE BRACKET(U+3009)
      this._setVertImg("kakko8", 0.5, 0.5); break;
    case 12298: // LEFT DOUBLE ANGLE BRACKET(U+300A)
      this._setVertImg("kakko9", 0.5, 0.5); break;
    case 8810: // MUCH LESS-THAN(U+226A)
      this._setVertImg("kakko9", 0.5, 0.5); break;
    case 12299: // RIGHT DOUBLE ANGLE BRACKET(U+300B)
      this._setVertImg("kakko10", 0.5, 0.5); break;
    case 8811: // MUCH GREATER-THAN(U+226B)
      this._setVertImg("kakko10", 0.5, 0.5); break;
    case 65339: // FULLWIDTH LEFT SQUARE BRACKET(U+FF3B)
      this._setVertImg("kakko11", 0.5, 0.5); break;
    case 12308: // LEFT TORTOISE SHELL BRACKET(U+3014)
      this._setVertImg("kakko11", 0.5, 0.5); break;
    case 91: // LEFT SQUARE BRACKET(U+005B)
      this._setVertImg("kakko11", 0.5, 0.5); break;
    case 65341: // FULLWIDTH RIGHT SQUARE BRACKET(U+FF3D)
      this._setVertImg("kakko12", 0.5, 0.5); break;
    case 12309: // RIGHT TORTOISE SHELL BRACKET(U+3015)
      this._setVertImg("kakko12", 0.5, 0.5); break;
    case 93: // RIGHT SQUARE BRACKET(U+005D)
      this._setVertImg("kakko12", 0.5, 0.5); break;
    case 12304: // LEFT BLACK LENTICULAR BRACKET(U+3010)
    case 12310: // LEFT WHITE LENTICULAR BRACKET(U+3016)
      this._setVertImg("kakko17", 0.5, 0.5); break;
    case 12305: // RIGHT BLACK LENTICULAR BRACKET(U+3011)
    case 12311: // RIGHT WHITE LENTICULAR BRACKET(U+3017)
      this._setVertImg("kakko18", 0.5, 0.5); break;
    case 65306: // FULLWIDTH COLON(U+FF1A)
      this._setVertImg("tenten", 1, 1); break;
    case 58: // COLON(U+003A)
      this._setVertImg("tenten", 0.5, 0.5); break;
   case 12290: // IDEOGRAPHIC FULL STOP(U+3002)
      this._setVertImg("kuten", 0.5, 0.5); break;
    case 65377: // HALFWIDTH IDEOGRAPHIC FULL STOP(U+FF61)
      this._setVertImg("kuten", 0.5, 0.5); break;
    case 65294: // FULLWIDTH FULL STOP(U+FF0E)
      this._setVertImg("period", 1, 1); break;
    case 46: // FULL STOP(U+002E)
      this._setVertImg("period", 1, 1); break;
    case 12289: // IDEOGRAPHIC COMMA(U+3001)
      this._setVertImg("touten", 0.5, 0.5); break;
    case 65380: // HALFWIDTH IDEOGRAPHIC COMMA(U+FF64)
      this._setVertImg("touten", 0.5, 0.5); break;
    case 44: // COMMA(U+002C)
      this._setVertImg("touten", 0.5, 0.5); break;
    case 65292: // FULL WIDTH COMMA(U+FF0C)
      this._setVertImg("touten", 0.5, 1); break;
    case 65374: // FULLWIDTH TILDE(U+FF5E)
      this._setVertImg("kara", 1, 1); break;
    case 12316: // WAVE DASH(U+301C)
      this._setVertImg("kara", 1, 1); break;
    case 8230: // HORIZONTAL ELLIPSIS(U+2026)
      this._setVertImg("mmm", 1, 1); break;
    case 8229: // TWO DOT LEADER(U+2025)
      this._setVertImg("mm", 1, 1); break;
    case 12317: // REVERSED DOUBLE PRIME QUOTATION MARK(U+301D)
      this._setVertImg("dmn1", 1, 1); break;
    case 12318: // DOUBLE PRIME QUOTATION MARK(U+301E)
      this._setRotate(90); break;
    case 12319: // LOW DOUBLE PRIME QUOTATION MARK(U+301F)
      this._setVertImg("dmn2", 1, 1); break;
    case 61: // EQUALS SIGN(U+003D)
    case 8786: // APPROXIMATELY EQUAL TO OR THE IMAGE OF(U+2252)
    case 8800: // NOT EQUAL TO(U+2260)
    case 65309: // FULLWIDTH EQUALS SIGN(U+FF1D)
      this._setVertImg("equal", 1, 1); break;
    case 8212: // EM DASH(U+2014)
      if(__is_ie){
	this._setVertCnv("&#xFF5C;", 1, 1); // FULLWIDTH VERTICAL LINE(U+FF5C)
      } else {
	this._setRotate(90);
      }
      break;
    case 8213: // HORIZONTAL BAR(U+2015)
      this._setRotate(90);
      if(!__is_ie){
	this._setVertCnv("&#x2014;", 1, 1); // HORIZONTAL BAR(U+2015) -> EM DASH(U+2014)
      }
      this._setHoriCnv("&#x2014;"); // use EM DASH(U+2014) if horizontal
      break;
    case 8220: // LEFT DOUBLE QUOTATION MARK(U+201C)
      this._setRotate(90);
      this.hscale = this.vscale = 0.5;
      break;
    case 8221: // RIGHT DOUBLE QUOTATION MARK(U+201D)
      this._setRotate(90);
      this.hscale = this.vscale = 0.5;
      break;
    case 12540: // KATAKANA-HIRAGANA PROLONGED SOUND MARK(U+30FC)
      this._setVertImg("onbiki", 1, 1); break;
    case 65293: // FULLWIDTH HYPHEN-MINUS(U+FF0D)
    case 9472: // BOX DRAWINGS LIGHT HORIZONTAL(U+2500)
      this._setVertCnv("&#x2014;", 1, 1); // EM DASH(U+2014)
      this._setRotate(90);
      break;
    case 8593: // UPWARDS ARROW(U+2191)
      this._setVertCnv("&#x2192;", 1, 1); // RIGHTWARDS ARROW(U+2192)
      break;
    case 8594: // RIGHTWARDS ARROW(U+2192)
      this._setVertCnv("&#x2193;", 1, 1); // DOWNWARDS ARROW(U+2193)
      break;
    case 8658: // RIGHTWARDS DOUBLE ARROW(U+21D2)
      this._setVertCnv("&#x21D3;", 1, 1); // DOWNWARDS DOUBLE ARROW(U+21D3)
      break;
    case 8595: // DOWNWARDS ARROW(U+2193)
      this._setVertCnv("&#x2190;", 1, 1); // LEFTWARDS ARROW(U+2190)
      break;
    case 8592: // LEFTWARDS ARROW(U+2190)
      this._setVertCnv("&#x2191;", 1, 1); // UPWARDS ARROW(U+2191)
      break; 
    case 45: // HYPHEN-MINUS(U+002D)
      this._setRotate(90);
      this.hscale = 0.4; // generally, narrower than half in horizontal
      this.vscale = 0.5;
      break;
    case 8722: // MINUS SIGN(U+2212)
      this._setRotate(90);
      break;
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
  Char.prototype.isLessThanSign = function(){
    return this.ref == "&lt;" || this.data === "\u003c";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isGreaterThanSign = function(){
    return this.ref == "&gt;" || this.data === "\u003e";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isNbsp = function(){
    return this.ref === "&nbsp;" || this.data === "\u00a0";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isThinsp = function(){
    return this.ref === "&thinsp;" || this.data === "\u2009";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isEnsp = function(){
    return this.ref === "&ensp;" || this.data === "\u2002";
  };

  /**
   @memberof Nehan.Char
   @return {boolean}
   */
  Char.prototype.isEmsp = function(){
    return this.ref === "&emsp;" || this.data === "\u2003";
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
  Char.prototype.isIdeographicSpace = function(){
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
    return (data === 8212 || // EM DASH(U+2014)
	    data === 8213);  // HORIZONTAL BAR(U+2015)
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

Nehan.Word = (function(){

  var __cut_word = function(word, font, measure){
    for(var i = word.data.length - 1; i >= 1; i--){
      var head_part = word.data.substring(0, i);
      var part_measure = Math.ceil(Nehan.TextMetrics.getMeasure(font, head_part));
      //console.log("head_part:%s(%d) for %d", head_part, part_measure, measure);
      if(part_measure <= measure){
	var head_word = new Nehan.Word(head_part, true);
	head_word.bodySize = measure;
	return head_word;
      }
    }
    return word;
  };

  /**
     @memberof Nehan
     @class Word
     @classdesc abstraction of alphabetical phrase.
     @constructor
     @param word {String}
     @param divided {boolean} - true if word is divided by too long phrase and overflow inline.
  */
  function Word(word, divided){
    this.data = word;
    this._divided = divided || false;
  }

  /**
   @memberof Nehan.Word
   @return {bool}
   */
  Word.prototype.isHeadNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Word
   @return {bool}
   */
  Word.prototype.isTailNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Word
   @param {Nehan.BoxFlow}
   @return {string}
   */
  Word.prototype.getData = function(flow){
    return flow.isTextVertical()? this._getDataVert() : this._getDataHori();
  };

  Word.prototype._getDataVert = function(){
    // Convert HYPHEN MINUS(U+002D), HYPHEN(U+2010), FIGURE DASH(U+2012), EN DASH(U+2013) to NON-BREAKING HYPHEN(U+2011), but why?
    // Because HYPHEN-MINUS(\u002D) contains line-break.
    // For example, if you set word text including hyphen(like 'foo-hoo') into (200, 16) box,
    // and if you rotate this box for vertical writing, line-break by hyphenation will be executed,
    // because hyphenation is calculated by not 'measure' of (16, 200) = 200, but 'width' of (16, 200) = 16.
    // So line-break is occured(for most case).
    // To block this, property 'hyphens' is prepared in CSS, but it's not implemented in all browser(especially webkit).
    // So we convert them to \u2011, because \u2011 is declared as 'non-breaking-hyphens'.
    this.data = this.data.replace(/[\u002D\u2010\u2012\u2013]/g, "\u2011");

    // fix dash element
    if(Nehan.Env.client.isIE()){
      this.data = this.data.replace(/\u2014/g, "\uFF5C"); // EM DASH -> FULLWIDTH VERTICAL LINE
    } else {
      this.data = this.data.replace(/\u2015/g, "\u2014"); // HORIZONTAL BAR -> EM DASH
    }
    return this.data;
  };

  Word.prototype._getDataHori = function(){
    this.data = this.data.replace(/\u2015/g, "\u2014"); // HORIZONTAL BAR -> EM DASH
    return this.data;
  };

  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssHori = function(line){
    var css = {};
    css["padding-left"] = this.paddingStart + "px";
    css["padding-right"] = this.paddingEnd + "px";
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTrans = function(line){
    var css = {};
    var font_size = line.context.style.getFontSize();
    if(line.context.style.letterSpacing){
      css["letter-spacing"] = line.context.style.letterSpacing + "px";
    }
    css.width = font_size + "px";
    css.height = this.bodySize + "px";
    css["padding-top"] = this.paddingStart + "px";
    css["padding-bottom"] = this.paddingEnd + "px";
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTransBody = function(line){
    var css = {};
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTransBodyTrident = function(line){
    var css = {};
    css.width = line.context.style.getFontSize() + "px";
    css.height = this.bodySize + "px";
    css["transform-origin"] = "50% 50%";

    // force set line-height to measure(this.bodySize) before rotation,
    // and fix offset by translate after rotatation.
    css["line-height"] = this.bodySize + "px";
    var trans = Math.floor((this.bodySize - line.context.style.getFontSize()) / 2);
    if(trans > 0){
      css.transform = "rotate(90deg) translate(-" + trans + "px, 0)";
    }
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTransIE = function(line){
    var css = {}, font_size = line.context.style.getFontSize();
    css["css-float"] = "left";
    css["writing-mode"] = "tb-rl";
    css["letter-spacing"] = (line.context.style.letterSpacing || 0) + "px";
    css["padding-left"] = Math.round(font_size / 2) + "px";
    css["line-height"] = font_size + "px";
    return css;
  };
  /**
   @memberof Nehan.Word
   @return {int}
   */
  Word.prototype.getCharCount = function(){
    return 1; // word is count by 1 character.
  };
  /**
   @memberof Nehan.Word
   @param flow {Nehan.BoxFlow}
   @param letter_spacing {int}
   @return {int}
   */
  Word.prototype.getAdvance = function(flow, letter_spacing){
    var letter_spacing_size = (letter_spacing || 0) * this.getLetterCount();
    var padding_size = (this.paddingStart || 0) + (this.paddingEnd || 0);
    return this.bodySize + letter_spacing_size + padding_size;
  };
  /**
   @memberof Nehan.Word
   @return {boolean}
   */
  Word.prototype.hasMetrics = function(){
    return (typeof this.bodySize !== "undefined");
  };
  /**
   @memberof Nehan.Word
   @return {int}
   */
  Word.prototype.countUpper = function(){
    var count = 0;
    for(var i = 0; i < this.data.length; i++){
      if(/[A-Z]/.test(this.data.charAt(i))){
	count++;
      }
    }
    return count;
  };
  /**
   @memberof Nehan.Word
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   */
  Word.prototype.setMetrics = function(flow, font){
    this.paddingStart = Math.floor(font.size * (this.spaceRateStart || 0));
    this.paddingEnd = Math.floor(font.size * (this.spaceRateEnd || 0));
    this.bodySize = Nehan.TextMetrics.getMeasure(font, this.data);
  };
  /**
   @memberof Nehan.Word
   @return {int}
   */
  Word.prototype.getLetterCount = function(){
    return this.data.length;
  };
  /**
   @memberof Nehan.Word
   @param enable {boolean}
   */
  Word.prototype.setDivided = function(enable){
    this._divided = enable;
  };
  /**
   @memberof Nehan.Word
   @param enable {boolean}
   */
  Word.prototype.isDivided = function(){
    return this._divided;
  };
  /**
   devide word by [measure] size and return first half of word.

   @memberof Nehan.Word
   @param font_size {int}
   @param measure {int}
   @return {Nehan.Word}
   */
  Word.prototype.cutMeasure = function(flow, font, measure){
    var head_word = __cut_word(this, font, measure);
    var rest_str = this.data.slice(head_word.data.length);
    if(rest_str === ""){
      return this;
    }
    this.data = rest_str;
    this.setDivided(true);
    this.setMetrics(flow, font); // update bodySize
    return head_word;
  };
  
  /**
   @memberof Nehan.Word
   @param {Nehan.BoxFlow}
   @return {String}
   */
  Word.prototype.toString = function(flow){
    return this.getData(flow);
  };

  return Word;
})();


Nehan.Tcy = (function(){
  /**
     @memberof Nehan
     @class Tcy
     @classdesc abstraction of tcy(tate-chu-yoko) character.
     @constructor
     @param tcy {String}
  */
  function Tcy(tcy){
    this.data = tcy;
  }

  /**
   @memberof Nehan.Tcy
   @return {bool}
   */
  Tcy.prototype.isHeadNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Tcy
   @return {bool}
   */
  Tcy.prototype.isTailNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Tcy
   @return {string}
   */
  Tcy.prototype.getData = function(){
    return this.data;
  };
  /**
   @memberof Nehan.Tcy
   @return {int}
   */
  Tcy.prototype.getCharCount = function(){
    return 1;
  };
  /**
   @memberof Nehan.Tcy
   @return {int}
   */
  Tcy.prototype.getAdvance = function(flow, letter_spacing){
    return this.bodySize + letter_spacing;
  };
  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Tcy.prototype.getCssVert = function(line){
    var css = {};
    css["text-align"] = "center";
    // if native text-combine-upright is not supported,
    // use normal font-weight.
    if(!Nehan.Env.isTextCombineEnable){
      css["font-weight"] = "normal";
    }
    css["word-break"] = "normal";
    css["height"] = "1em"; // for IE
    return css;
  };
  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Tcy.prototype.getCssHori = function(line){
    var css = {};
    if(this.data.length === 1){
      css.display = "inline-block";
      //css.width = "1em";
      css.width = this.bodySize + "px";
      css["text-align"] = "center";
    }
    return css;
  };
  /**
   @memberof Nehan.Tcy
   @return {boolean}
   */
  Tcy.prototype.hasMetrics = function(){
    return (typeof this.bodySize != "undefined");
  };
  /**
   @memberof Nehan.Tcy
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   */
  Tcy.prototype.setMetrics = function(flow, font){
    if(flow.isTextVertical()){
      this.bodySize = font.size;
    } else {
      this.bodySize = Nehan.TextMetrics.getMeasure(font, this.data);
    }
  };

  /**
   @memberof Nehan.Tcy
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Tcy.prototype.toString = function(flow){
    return this.getData();
  };

  return Tcy;
})();


Nehan.Ruby = (function(){
  /**
     @memberof Nehan
     @class Ruby
     @classdesc abstraction of ruby text.
     @constructor
     @param rbs {Array<Nehan.Char>} - characters of &lt;rb&gt; tag.
     @param rt {Nehan.Tag}
  */
  function Ruby(rbs, rt){
    this.rbs = rbs;
    this.rt = rt;
  }

  /**
   @memberof Nehan.Ruby
   @return {boolean}
   */
  Ruby.prototype.hasMetrics = function(){
    return (typeof this.advanceSize !== "undefined");
  };
  /**
   @memberof Nehan.Ruby
   @return {int}
   */
  Ruby.prototype.getCharCount = function(){
    return this.rbs? this.rbs.length : 0;
  };
  /**
   @memberof Nehan.Ruby
   @return {int}
   */
  Ruby.prototype.getAdvance = function(flow){
    return this.advanceSize;
  };
  /**
   @memberof Nehan.Ruby
   @return {Array<Nehan.Char>}
   */
  Ruby.prototype.getRbs = function(){
    return this.rbs;
  };
  /**
   @memberof Nehan.Ruby
   @return {String}
   */
  Ruby.prototype.getRbString = function(){
    return this.rbs.reduce(function(ret, rb){
      return ret + (rb.data || "");
    }, "");
  };
  /**
   @memberof Nehan.Ruby
   @return {String}
   */
  Ruby.prototype.getRtString = function(){
    return this.rt? this.rt.getContent() : "";
  };
  /**
   @memberof Nehan.Ruby
   @return {int}
   */
  Ruby.prototype.getRtFontSize = function(){
    return this.rtFontSize;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssVertRt = function(line){
    var css = {};
    css["css-float"] = "left";
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssHoriRt = function(line){
    var css = {};
    var rt_font_size = this.getRtFontSize();
    var offset = Math.floor((line.context.style.getFontSize() - this.getRtFontSize()) / 3);
    css["font-size"] = rt_font_size + "px";
    css["line-height"] = rt_font_size + "px";
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssVertRb = function(line){
    var css = {};
    css["css-float"] = "left";
    if(this.padding){
      Nehan.Obj.copy(css, this.padding.getCss());
    }
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssHoriRb = function(line){
    var css = {};
    if(this.padding){
      Nehan.Obj.copy(css, this.padding.getCss());
    }
    css["text-align"] = "center";
    css["line-height"] = "1em";
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   @param letter_spacing {int}
   */
  Ruby.prototype.setMetrics = function(flow, font, letter_spacing){
    this.rtFontSize = Nehan.Display.getRtFontSize(font.size);
    var advance_rbs = this.rbs.reduce(function(ret, rb){
      rb.setMetrics(flow, font);
      return ret + rb.getAdvance(flow, letter_spacing);
    }, 0);
    var advance_rt = this.rtFontSize * this.getRtString().length;
    this.advanceSize = advance_rbs;
    if(advance_rt > advance_rbs){
      var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
      if(this.rbs.length > 0){
	this.padding = new Nehan.Padding();
	this.padding.setStart(flow, ctx_space);
	this.padding.setEnd(flow, ctx_space);
      }
      this.advanceSize += ctx_space + ctx_space;
    }
  };

  /**
   @memberof Nehan.Ruby
   @param {Nehan.BoxFlow}
   @return {String}
   */
  Ruby.prototype.toString = function(flow){
    return this.getRbString();
  };

  return Ruby;
})();


/**
 utility module to check token type.

 @namespace Nehan.Token
 */
Nehan.Token = {
  /**
   @memberof Nehan.Token
   @param {token}
   @return {boolean}
   */
  isText : function(token){
    return (token instanceof Nehan.Text ||
	    token instanceof Nehan.Char ||
	    token instanceof Nehan.Word ||
	    token instanceof Nehan.Tcy ||
	    token instanceof Nehan.Ruby);
  },
  /**
   @memberof Nehan.Token
   @param {token}
   @return {boolean}
   */
  isEmphaTargetable : function(token){
    return token instanceof Nehan.Char || token instanceof Nehan.Tcy;
  },
  /**
   @memberof Nehan.Token
   @param {token}
   @return {boolean}
   */
  isNewLine : function(token){
    return token instanceof Nehan.Char && token.isNewLine();
  },
  /**
   @memberof Nehan.Token
   @param {token}
   @return {boolean}
   */
  isWhiteSpace : function(token){
    return token instanceof Nehan.Char && token.isWhiteSpace();
  }
};


Nehan.ListStyleType = (function(){
  /**
   @memberof Nehan
   @class ListStyleType
   @classdesc abstraction of list-style-type.
   @constructor
   @param pos {String} - "disc", "circle", "square", "lower-alpha" .. etc
   */
  function ListStyleType(type){
    this.type = type || "none";
  }

  var __marker_text = {
    "disc": "&#x2022;", // BULLET
    "circle":"&#x25E6;", // WHITE BULLET
    "square":"&#x25AA;" // BLACK SMALL SQUARE
    //"square":"&#x25AB;" // WHITE SMALL SQUARE
  };

  /**
   @memberof Nehan.ListStyleType
   @return {boolean}
   */
  ListStyleType.prototype.isDecimal = function(){
    return (this.type === "decimal" || this.type === "decimal-leading-zero");
  };
  /**
   @memberof Nehan.ListStyleType
   @return {boolean}
   */
  ListStyleType.prototype.isNone = function(){
    return this.type === "none";
  };
  /**
   @memberof Nehan.ListStyleType
   @return {boolean}
   */
  ListStyleType.prototype.isMark = function(){
    return (this.type === "disc" ||
	    this.type === "circle" ||
	    this.type === "square");
  };
  /**
   @memberof Nehan.ListStyleType
   @return {boolean}
   */
  ListStyleType.prototype.isIncremental = function(){
    return (!this.isNone() && !this.isMark());
  };
  /**
   @memberof Nehan.ListStyleType
   @return {boolean}
   */
  ListStyleType.prototype.isHankaku = function(){
    return (this.type === "lower-alpha" || this.type === "upper-alpha" ||
	    this.type === "lower-roman" || this.type === "upper-roman" ||
	    this.isMark() || this.isDecimal());
  };
  /**
   @memberof Nehan.ListStyleType
   @return {boolean}
   */
  ListStyleType.prototype.isZenkaku = function(){
    return !this.isHankaku();
  };
  /**
   @memberof Nehan.ListStyleType
   @param flow {Nehan.BoxFlow}
   @param count {int}
   @return {String}
   */
  ListStyleType.prototype.getMarkerHtml = function(flow, count){
    var text = this.getMarkerText(count);
    if(this.isZenkaku()){
      return Nehan.Html.tagWrap("span", text, {
	"class":"tcy"
      });
    }
    if(flow.isTextVertical() && this.isIncremental()){
      return Nehan.Html.tagWrap("::marker", "<word>" + text + "</word>");
    }
    return text;
  };
  /**
   @memberof Nehan.ListStyleType
   @return {String}
   */
  ListStyleType.prototype.getMarkerText = function(count){
    if(this.isNone()){
      return Nehan.Const.space;
    }
    if(this.isMark()){
      return __marker_text[this.type] || "";
    }
    count = Math.max(1, count);
    var digit = this._getMarkerDigitString(count);
    return digit + "."; // add period as postfix.
  };

  ListStyleType.prototype._getMarkerDigitString = function(decimal){
    if(this.type === "decimal"){
      return decimal.toString(10);
    }
    if(this.type === "decimal-leading-zero"){
      if(decimal < 10){
	return "0" + decimal.toString(10);
      }
      return decimal.toString(10);
    }
    return Nehan.Cardinal.getStringByName(this.type, decimal);
  };

  return ListStyleType;
})();


Nehan.ListStylePos = (function(){
  /**
   @memberof Nehan
   @class ListStylePos
   @classdesc abstraction of list-style-pos.
   @constructor
   @param pos {String} - "outside" or "inside"
   */
  function ListStylePos(pos){
    this.pos = pos;
  }

  /**
   @memberof Nehan.ListStylePos
   @return {boolean}
   */
  ListStylePos.prototype.isOutside = function(){
    return this.pos === "outside";
  };
  /**
   @memberof Nehan.ListStylePos
   @return {boolean}
   */
  ListStylePos.prototype.isInside = function(){
    return this.pos === "inside";
  };

  return ListStylePos;
})();


Nehan.ListStyleImage = (function(){
  /**
   @memberof Nehan
   @class ListStyleImage
   @classdesc abstraction of list-style-image.
   @constructor
   @param image {String}
   */
  function ListStyleImage(image){
    this.image = image;
  }

  /**
   @memberof Nehan.ListStyleImage
   @param flow {Nehan.BoxFlow}
   @param count {int}
   @return {string}
   */
  ListStyleImage.prototype.getMarkerHtml = function(flow, count, opt){
    opt = opt || {};
    var url = Nehan.Css.getImageURL(this.image); // url('xxx.png') -> 'xxx.png'
    var width = opt.width || Nehan.Config.defaultFontSize;
    var height = opt.height || Nehan.Config.defaultFontSize;
    var classes = ["nehan-list-image"].concat(opt.classes || []);
    return Nehan.Html.tagSingle("img", {
      "src":url,
      "class":classes.join(" "),
      "width":width,
      "height":height
    });
  };

  return ListStyleImage;
})();


Nehan.ListStyle = (function(){
  /**
     @memberof Nehan
     @class ListStyle
     @classdesc abstraction of list-style.
     @constructor
     @param opt {Object}
     @param opt.type {Nehan.ListStyleType}
     @param opt.position {Nehan.ListStylePos}
     @param opt.image {Nehan.ListStyleImage}
  */
  function ListStyle(opt){
    opt = opt || {};
    this.type = new Nehan.ListStyleType(opt.type || "none");
    this.position = new Nehan.ListStylePos(opt.position || "outside");
    this.image = (!opt.image || opt.image === "none")? null : new Nehan.ListStyleImage(opt.image);
  }

  /**
   @memberof Nehan.ListStyle
   @return {boolean}
   */
  ListStyle.prototype.isOutside = function(){
    return this.position.isOutside();
  };
  /**
   @memberof Nehan.ListStyle
   @return {boolean}
   */
  ListStyle.prototype.isInside = function(){
    return this.position.isInside();
  };
  /**
   @memberof Nehan.ListStyle
   @return {boolean}
   */
  ListStyle.prototype.isImageList = function(){
    return (this.image !== null);
  };
  /**
   @memberof Nehan.ListStyle
   @param flow {Nehan.BoxFlow}
   @param count {int}
   @return {String}
   */
  ListStyle.prototype.getMarkerHtml = function(flow, count, opt){
    if(this.image !== null){
      return this.image.getMarkerHtml(flow, count, opt || {});
    }
    var html = this.type.getMarkerHtml(flow, count);
    if(html === "" && this.isOutside()){
      return "&nbsp;";
    }
    return html;
  };

  return ListStyle;
})();

Nehan.TextEmphaStyle = (function(){
  var __default_empha_style = "filled dot";
  var __empha_marks = {
    // dot
    "filled dot":"&#x2022;",
    "open dot":"&#x25E6;",

    // circle
    "filled circle":"&#x25CF;",
    "open circle":"&#x25CB;",

    // double-circle
    "filled double-circle":"&#x25C9;",
    "open double-circle":"&#x25CE;",

    // triangle
    "filled triangle":"&#x25B2;",
    "open triangle":"&#x25B3;",

    // sesame
    "filled sesame":"&#xFE45;",
    "open sesame":"&#xFE46;"
  };

  /**
   @memberof Nehan
   @class TextEmphaStyle
   @classdesc abstraction of text-empha-position.
   @constructor
   @param value {String} - style name. default "none".
   @example
   * new TextEmphaStyle().getText(); // ""
   * new TextEmphaStyle().getText("none"); // ""
   * new TextEmphaStyle("filled dot").getText(); // "&#x2022;";
   * new TextEmphaStyle("foo").getText(); // "foo";
   */
  function TextEmphaStyle(value){
    this.value = value || "none";
  }

  /**
   @memberof Nehan.TextEmphaStyle
   @return {bool}
   */
  TextEmphaStyle.prototype.isEnable = function(){
    return this.value != "none";
  };
  /**
   @memberof Nehan.TextEmphaStyle
   @param value {String} - empha style name
   */
  TextEmphaStyle.prototype.setValue = function(value){
    this.value = value;
  };
  /**
   @memberof Nehan.TextEmphaStyle
   @return {String}
   */
  TextEmphaStyle.prototype.getText = function(){
    if(!this.isEnable()){
      return "";
    }
    return __empha_marks[this.value] || this.value || __empha_marks[__default_empha_style];
  };
  /**
   @memberof Nehan.TextEmphaStyle
   @return {Object}
   */
  TextEmphaStyle.prototype.getCss = function(){
    var css = {};
    //return css["text-emphasis-style"] = this.value;
    return css;
  };

  return TextEmphaStyle;
})();


Nehan.TextEmphaPos = (function(){
  /**
     @memberof Nehan
     @class TextEmphaPos
     @classdesc abstraction of text-empha-position, but not impremented yet.
     @constructor
     @param opt {Object}
     @param opt.hori {String} - horizontal empha pos, default "over"
     @param opt.vert {String} - vertical empha pos, default "right"
  */
  function TextEmphaPos(opt){
    Nehan.Obj.merge(this, {
      hori:"over",
      vert:"right"
    }, opt || {});
  }

  /**
   not implemented yet.

   @memberof Nehan.TextEmphaPos
   @return {Object}
   */
  TextEmphaPos.prototype.getCss = function(line){
    var css = {};
    return css;
  };

  return TextEmphaPos;
})();


Nehan.TextEmpha = (function(){
  /**
   @memberof Nehan
   @class TextEmpha
   @classdesc abstraction of text emphasis.
   @constructor
   @param opt {Object}
   @param opt.style {Nehan.TextEmphaStyle}
   @param opt.position {Nehan.TextEmphaPos}
   @param opt.color {Nehan.Color}
   */
  function TextEmpha(opt){
    opt = opt || {};
    this.style = opt.style || new Nehan.TextEmphaStyle();
    this.position = opt.position || new Nehan.TextEmphaPos();
    this.color = opt.color || new Nehan.Color(Nehan.Config.defaultFontColor);
  }

  /**
   @memberof Nehan.TextEmpha
   @return {boolean}
   */
  TextEmpha.prototype.isEnable = function(){
    return this.style && this.style.isEnable();
  };
  /**
   get text of empha style, see {@link Nehan.TextEmphaStyle}.

   @memberof Nehan.TextEmpha
   @return {String}
   */
  TextEmpha.prototype.getText = function(){
    return this.style? this.style.getText() : "";
  };
  /**
   @memberof Nehan.TextEmpha
   @return {int}
   */
  TextEmpha.prototype.getExtent = function(font_size){
    if(!this.isEnable()){
      return font_size;
    }
    var extent = Math.floor(font_size * (1 + Nehan.Config.defaultEmphaTextRate));
    return (font_size % 2 === 0)? extent : extent + 1;
  };
  /**
   @memberof Nehan.TextEmpha
   @param line {Nehan.Box}
   @param chr {Nehan.Char}
   @return {Object}
   */
  TextEmpha.prototype.getCssVertEmphaWrap = function(line, chr){
    var css = {}, font_size = line.context.style.getFontSize();
    css["text-align"] = "left";
    css.width = this.getExtent(font_size) + "px";
    css.height = chr.getAdvance(line.context.style.flow, line.context.style.letterSpacing || 0) + "px";
    css.position = "relative";
    return css;
  };
  /**
   @memberof Nehan.TextEmpha
   @param line {Nehan.Box}
   @param chr {Nehan.Char}
   @return {Object}
   */
  TextEmpha.prototype.getCssHoriEmphaWrap = function(line, chr){
    var css = {}, font_size = line.getFontSize();
    css.display = "inline-block";
    css.width = chr.getAdvance(line.context.style.flow, line.context.style.letterSpacing) + "px";
    css.height = this.getExtent(font_size) + "px";
    return css;
  };

  return TextEmpha;
})();


/**
 * spacing utility module<br>
 * this module add spacing to char at start/end direction in some contextual condition.

 @namespace Nehan.Spacing
*/
Nehan.Spacing = {
  /**
     @memberof Nehan.Spacing
     @param cur_text {Nehan.Char | Nehan.Word}
     @param prev_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
     @param next_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  add : function(cur_text, prev_text, next_text){
    if(cur_text instanceof Nehan.Char){
      this._addCharSpacing(cur_text, prev_text, next_text);
    } else if(cur_text instanceof Nehan.Word){
      this._addWordSpacing(cur_text, prev_text, next_text);
    }
  },
  /**
     @memberof Nehan.Spacing
     @param cur_char(zenkaku) {Nehan.Char}
     @param prev_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
     @param next_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  _addCharSpacing : function(cur_char, prev_text, next_text){
    if(cur_char.isKakkoStart()){
      this._setSpacingStart(cur_char, prev_text);
    } else if(cur_char.isKakkoEnd() || cur_char.isKutenTouten()){
      this._setSpacingEnd(cur_char, next_text);
    }
  },
  _addWordSpacing : function(cur_word, prev_text, next_text){
    if(prev_text && prev_text instanceof Nehan.Char && !prev_text.isSpaceGroup() && (typeof prev_text.spaceRateEnd === "undefined")){
      cur_word.spaceRateStart = 0.25;
    }
    if(next_text && next_text instanceof Nehan.Char && !next_text.isSpaceGroup() && !next_text.isKakkoStart() && !(next_text.isKutenTouten() && next_text.isZenkaku())){
      cur_word.spaceRateEnd = 0.25;
    }
  },
  _setSpacingStart : function(cur_char, prev_text){
    var space_rate = this._getTextSpaceStart(cur_char, prev_text);
    if(space_rate > 0){
      cur_char.spaceRateStart = space_rate;
    }
  },
  _setSpacingEnd : function(cur_char, next_text){
    if(next_text instanceof Nehan.Char && next_text.isTenten()){
      return;
    }
    var space_rate = this._getTextSpaceEnd(cur_char, next_text);
    if(space_rate > 0){
      cur_char.spaceRateEnd = space_rate;
    }
  },
  // if previous text is not exists or previous text is not left brace(or paren etc),
  // add space to start direction.
  //
  // [example:add space]
  //   (  => [SPACE](
  //   a( => a[SPACE](
  //
  // [example:do nothing]
  //   (( => ((
  //   {( => {(
  _getTextSpaceStart : function(cur_char, prev_text){
    if(prev_text === null){
      return 0.5;
    }
    if(prev_text instanceof Nehan.Char && prev_text.isKakkoStart()){
      return 0;
    }
    return 0.5;
  },
  // if next text is not exists or next text is not right brace(or paren etc),
  // add space to end direction.
  //
  // [example:add space]
  //   )  => )[SPACE]
  //   )a => )[SPACE]a
  //
  // [example:do nothing]
  //   )) => ))
  //   )} => )}
  //   ,( => ,(
  _getTextSpaceEnd : function(cur_char, next_text){
    if(next_text === null){
      return 0.5;
    }
    if(next_text instanceof Nehan.Char && (cur_char.isKutenTouten() && next_text.isKakkoStart())){
      return 0;
    }
    if(next_text instanceof Nehan.Char && (next_text.isKakkoEnd() || next_text.isKutenTouten())){
      return 0;
    }
    return 0.5;
  }
};

Nehan.PartitionUnit = (function(){
  /**
   @memberof Nehan
   @class PartitionUnit
   @classdesc abstraction for unit size of partition.
   @constructor
   @param opt {Object}
   @param opt.weight {int} - partition weight, larger one gets more measure.
   @param opt.isStatic {boolean} - if true, size is fixed.
   */
  function PartitionUnit(opt){
    this.weight = opt.weight || 0;
    this.isStatic = opt.isStatic || false;
  }

  /**
   get unit size in px.

   @memberof Nehan.PartitionUnit
   @param measure {int}
   @param total_weight {int}
   @return {int} size in px
   */
  PartitionUnit.prototype.getSize = function(measure, total_weight){
    return Math.floor(measure * this.weight / total_weight);
  };
  /**
   @memberof Nehan.PartitionUnit
   @param punit {Nehan.ParitionUnit}
   @return {Nehan.PartitionUnit}
   */
  PartitionUnit.prototype.mergeTo = function(punit){
    if(this.isStatic && !punit.isStatic){
      return this;
    }
    if(!this.isStatic && punit.isStatic){
      return punit;
    }
    return (this.weight > punit.weight)? this : punit;
  };

  return PartitionUnit;
})();


Nehan.Partition = (function(){
  /**
   @memberof Nehan
   @class Partition
   @classdesc abstraction for partition of measure size.
   @constructor
   @param punits {Array.<PartitionUnit>}
   */
  function Partition(punits){
    this._punits = punits || []; // partition units
  }

  var __levelize = function(sizes, min_size){
    // filter parts that is smaller than min_size.
    var smaller_parts = sizes.filter(function(size){
      return size < min_size;
    });

    // if all elements has enough space for min_size, nothing to do.
    if(smaller_parts.length === 0){
      return sizes;
    }

    // total size that must be added to small parts.
    var delta_plus_total = smaller_parts.reduce(function(ret, size){
      return ret + (min_size - size);
    }, 0);

    // filter parts that has enough space.
    var larger_parts = sizes.filter(function(size){
      return size - min_size >= min_size; // check if size is more than min_size and over even if min_size is subtracted.
    });

    // if there are no enough rest space, nothing to do.
    if(larger_parts.length === 0){
      return sizes;
    }

    var delta_minus_avg = Math.floor(delta_plus_total / larger_parts.length);
    return sizes.map(function(size){
      return (size < min_size)? min_size : ((size - min_size >= min_size)? size - delta_minus_avg : size);
    });
  };

  /**
   @memberof Nehan.Partition
   @param index {int}
   @return {Nehan.PartitionUnit}
   */
  Partition.prototype.get = function(index){
    return this._punits[index] || null;
  },
  /**
   @memberof Nehan.Partition
   @return {int}
   */
  Partition.prototype.getLength = function(){
    return this._punits.length;
  },
  /**
   @memberof Nehan.Partition
   @return {int}
   */
  Partition.prototype.getTotalWeight = function(){
    return this._punits.reduce(function(ret, punit){
      return ret + punit.weight;
    }, 0);
  },
  /**
   @memberof Nehan.Partition
   @param partition {Nehan.Partition}
   @return {Nehan.Partition}
   */
  Partition.prototype.mergeTo = function(partition){
    if(this.getLength() !== partition.getLength()){
      throw "Partition::mergeTo, invalid merge target(length not same)";
    }
    // merge(this._punits[0], partition._punits[0]),
    // merge(this._punits[1], partition._punits[1]),
    // ...
    // merge(this._punits[n-1], partition._punits[n-1])
    var merged_punits =  this._punits.map(function(punit, i){
      return punit.mergeTo(partition.get(i));
    });
    return new Nehan.Partition(merged_punits);
  },
  /**
   @memberof Nehan.Partition
   @param measure {int} - max measure size in px
   @return {Array<int>} - divided size array
   */
  Partition.prototype.mapMeasure = function(measure){
    var total_weight = this.getTotalWeight();
    var sizes =  this._punits.map(function(punit){
      return punit.getSize(measure, total_weight);
    });
    return __levelize(sizes, Nehan.Config.minTableCellSize);
  };

  return Partition;
})();


// key : partition count
// value : Partition
Nehan.PartitionHashSet = (function(){
  /**
     @memberof Nehan
     @class PartitionHashSet
     @classdesc hash set to manage partitioning of layout. key = partition_count, value = {@link Nehan.Partition}.
     @extends {Nehan.HashSet}
   */
  function PartitionHashSet(){
    Nehan.HashSet.call(this);
  }
  Nehan.Class.extend(PartitionHashSet, Nehan.HashSet);

  /**
     @memberof Nehan.PartitionHashSet
     @param old_part {Nehan.Partition}
     @param new_part {Nehan.Partition}
     @return {Nehan.Partition}
  */
  PartitionHashSet.prototype.merge = function(old_part, new_part){
    return old_part.mergeTo(new_part);
  };

  /**
     get partition size(in px) array.

     @memberof Nehan.PartitionHashSet
     @param opt {Object}
     @param opt.partitionCount {int}
     @param opt.measure {int}
     @return {Array.<int>}
  */
  PartitionHashSet.prototype.getSizes = function(opt){
    var partition = this.get(opt.partitionCount);
    return partition.mapMeasure(opt.measure);
  };

  return PartitionHashSet;
})();


Nehan.LayoutContext = (function(){
  /**
     @memberof Nehan
     @class LayoutContext
     @classdesc generator cursor position set(inline and block).
     @constructor
     @param block {Nehan.BlockContext}
     @param inline {Nehan.InlineContext}
  */
  function LayoutContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  /**
   @memberof Nehan.LayoutContext
   @param element {Nehan.Box}
   @param extent {int}
   */
  LayoutContext.prototype.addBlockElement = function(element, extent){
    this.block.addElement(element, extent);
  };
  /**
   @memberof Nehan.LayoutContext
   @return {Array.<Nehan.Box>}
   */
  LayoutContext.prototype.getBlockElements = function(){
    return this.block.getElements();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockCount = function(){
    return this.getBlockElements().length;
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockCurExtent = function(){
    return this.block.getCurExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockMaxExtent = function(){
    return this.block.getMaxExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockRestExtent = function(){
    return this.block.getRestExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockLineNo = function(){
    return this.block.getLineNo();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.incBlockLineNo = function(){
    return this.block.incLineNo();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isInlineEmpty = function(){
    return this.inline.isEmpty();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isHyphenated = function(){
    return this.inline.isHyphenated();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isLineOver = function(){
    return this.inline.isLineOver();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.hasLineBreak = function(){
    return this.inline.hasLineBreak();
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.resumeLine = function(line){
    this.inline.resumeLine(line);
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setLineBreak = function(status){
    this.inline.setLineBreak(status);
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setLineOver= function(status){
    this.inline.setLineOver(status);
  };
  /**
   @memberof Nehan.LayoutContext
   */
  LayoutContext.prototype.setBreakAfter = function(status){
    this.block.setBreakAfter(status);
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setHyphenated = function(status){
    this.inline.setHyphenated(status);
  };
  /**
   set hanging punctuation across multiple inline-generators.

   [example]
   Think text-gen1(foo) and text-gen2(, and fuga),
   and assume that 'foo' is at the tail of line,
   and ', and fuga' is at the head of next line.

     ## before
     body
       span
         text-gen1(foo)
       text-gen2(, and fuga)
     
   But ',' is head-NG, so ',' is borrowed to text-gen1, and content of text-gen2 is sliced.

     ## after
     body
       span
         text-gen1(foo,)
       text-gen2(and fuga)

   @memberof Nehan.LayoutContext
   @param hanging_punctuation {Object}
   @param hanging_punctuation.data {Nehan.Char}
   @param hanging_punctuation.style {Nehan.Style}
   */
  LayoutContext.prototype.setHangingPunctuation = function(hunging_punctuation){
    this.hangingPunctuation = hunging_punctuation;
  };
  /**
   @memberof Nehan.LayoutContext
   @return hanging_punctuation {Object}
   */
  LayoutContext.prototype.getHangingPunctuation = function(){
    return this.hangingPunctuation || null;
  };
  /**
   @memberof Nehan.LayoutContext
   @param measure {int}
   */
  LayoutContext.prototype.addInlineMeasure = function(measure){
    this.inline.addMeasure(measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @param element {Nehan.Box}
   @param measure {int}
   */
  LayoutContext.prototype.addInlineBoxElement = function(element, measure){
    this.inline.addBoxElement(element, measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @param element {Nehan.Box}
   @param measure {int}
   */
  LayoutContext.prototype.addInlineTextElement = function(element, measure){
    this.inline.addTextElement(element, measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
   */
  LayoutContext.prototype.getInlineLastElement = function(){
    return this.inline.getLastElement();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {Array}
   */
  LayoutContext.prototype.getInlineElements = function(){
    return this.inline.getElements();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineCurMeasure = function(){
    return this.inline.getCurMeasure();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineRestMeasure = function(){
    return this.inline.getRestMeasure();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineMaxMeasure = function(){
    return this.inline.getMaxMeasure();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineMaxExtent = function(){
    return this.inline.getMaxExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineMaxFontSize = function(){
    return this.inline.getMaxFontSize();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineCharCount = function(){
    return this.inline.getCharCount();
  };
  /**
   hyphenate(by sweep) inline element with next head character, return null if nothing happend, or return new tail char if hyphenated.
   @memberof Nehan.LayoutContext
   @param head_char {Nehan.Char}
   @return {Nehan.Char | null}
   */
  LayoutContext.prototype.hyphenateSweep = function(head_char){
    return this.inline.hyphenateSweep(head_char);
  };

  /**
   @memberof Nehan.LayoutContext
   @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
   */
  LayoutContext.prototype.popInlineElement = function(){
    return this.inline.popElement();
  };

  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isBreakAfter = function(){
    return this.block.isBreakAfter();
  };
  return LayoutContext;
})();


Nehan.BlockContext = (function(){
  /** @memberof Nehan
      @class BlockContext
      @classdesc context data of block level.
      @constructor
      @param {int} max_extent - maximus position of block in px.
      @param opt {Object} - optional argument
  */
  function BlockContext(max_extent, opt){
    opt = opt || {};
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
    this.lineNo = opt.lineNo || 0;
    this.breakAfter = false;
  }

  /**
   add box element to this block context
   @memberof Nehan.BlockContext
   @method addElement
   @param element {Nehan.Box} - Box object added to this context
   @param extent {int} - extent size of this element
   */
  BlockContext.prototype.addElement = function(element, extent){
    this.curExtent += extent;
    if(element.pushed){
      this.pushedElements.push(element);
    } else if(element.pulled){
      this.pulledElements.unshift(element);
    } else {
      this.elements.push(element);
    }
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} current extent
   */
  BlockContext.prototype.getCurExtent = function(){
    return this.curExtent;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} current rest size of extent
   */
  BlockContext.prototype.getRestExtent = function(){
    return this.maxExtent - this.curExtent;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} max available size of this block context
   */
  BlockContext.prototype.getMaxExtent = function(){
    return this.maxExtent;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} max available size of this block context
   */
  BlockContext.prototype.getLineNo = function(){
    return this.lineNo;
  };
  /**
   @memberof Nehan.BlockContext
   @return {int} max available size of this block context
   */
  BlockContext.prototype.incLineNo = function(){
    return this.lineNo++;
  };
  /**
   @memberof Nehan.BlockContext
   @return {Array.<Nehan.Box>} current elements added to this block context
   */
  BlockContext.prototype.getElements = function(){
    return this.pulledElements
      .concat(this.elements)
      .concat(this.pushedElements);
  };
  /**
   @memberof Nehan.BlockContext
   @param status {bool}
   */
  BlockContext.prototype.setBreakAfter = function(status){
    this.breakAfter = status;
  };
  /**
   @memberof Nehan.BlockContext
   @return {bool}
   */
  BlockContext.prototype.isBreakAfter = function(){
    return this.breakAfter;
  };

  return BlockContext;
})();


Nehan.InlineContext = (function(){
  /**
     @memberof Nehan
     @class InlineContext
     @classdesc context data of inline level.
     @constructor
     @param max_measure {int} - maximum posistion of inline in px.
  */
  function InlineContext(max_measure){
    this.charCount = 0;
    this.curMeasure = 0;
    this.maxMeasure = max_measure; // const
    this.maxExtent = 0;
    this.maxFontSize = 0;
    this.elements = [];
    this.lineBreak = false; // is line-break included in line?
    this.lineOver = false; // is line full-filled?
    this.hyphenated = false; // is line hyphenated?
  }

  /**
   @memberof Nehan.InlineContext
   @return {boolean}
   */
  InlineContext.prototype.isEmpty = function(){
    return !this.lineBreak && this.elements.length === 0;
  };
  /**
   @memberof Nehan.InlineContext
   @return {boolean}
   */
  InlineContext.prototype.isHyphenated = function(){
    return this.hyphenated;
  };
  /**
   @memberof Nehan.InlineContext
   @return {boolean}
   */
  InlineContext.prototype.isLineOver= function(){
    return this.lineOver;
  };
  /**
   @memberof Nehan.InlineContext
   @return {boolean}
   */
  InlineContext.prototype.hasLineBreak = function(){
    return this.lineBreak;
  };
  /**
   @memberof Nehan.InlineContext
   @param status {boolean}
   */
  InlineContext.prototype.setLineBreak = function(status){
    this.lineBreak = status;
  };
  /**
   @memberof Nehan.InlineContext
   @param status {boolean}
   */
  InlineContext.prototype.setLineOver = function(status){
    this.lineOver = status;
  };
  /**
   @memberof Nehan.InlineContext
   @param status {boolean}
   */
  InlineContext.prototype.setHyphenated = function(status){
    this.hyphenated = status;
  };
  /**
   @memberof Nehan.InlineContext
   @param measure {int}
   */
  InlineContext.prototype.addMeasure = function(measure){
    this.curMeasure += measure;
  };
  /**
   @memberof Nehan.InlineContext
   @param element {Nehan.Box}
   @param measure {int}
   */
  InlineContext.prototype.addTextElement = function(element, measure){
    this.elements.push(element);
    this.curMeasure += measure;
    if(element.getCharCount){
      this.charCount += element.getCharCount();
    }
  };
  /**
   @memberof Nehan.InlineContext
   @param element {Nehan.Box}
   @param measure {int}
   */
  InlineContext.prototype.addBoxElement = function(element, measure){
    this.elements.push(element);
    this.curMeasure += measure;
    this.charCount += (element.charCount || 0);
    if(element.maxExtent){
      this.maxExtent = Math.max(this.maxExtent, element.maxExtent);
    } else {
      this.maxExtent = Math.max(this.maxExtent, element.getLayoutExtent());
    }
    if(element.maxFontSize){
      this.maxFontSize = Math.max(this.maxFontSize, element.maxFontSize);
    }
    if(element.hyphenated){
      this.hyphenated = true;
    }
  };
  /**
   @memberof Nehan.InlineContext
   @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
   */
  InlineContext.prototype.getLastElement = function(){
    return Nehan.List.last(this.elements);
  };
  /**
   get all elements.

   @memberof Nehan.InlineContext
   @return {Array}
   */
  InlineContext.prototype.getElements = function(){
    return this.elements;
  };
  /**
   @memberof Nehan.InlineContext
   @return {int}
   */
  InlineContext.prototype.getCurMeasure = function(){
    return this.curMeasure;
  };
  /**
   @memberof Nehan.InlineContext
   @return {int}
   */
  InlineContext.prototype.getRestMeasure = function(){
    return this.maxMeasure - this.curMeasure;
  };
  /**
   @memberof Nehan.InlineContext
   @return {int}
   */
  InlineContext.prototype.getMaxMeasure = function(){
    return this.maxMeasure;
  };
  /**
   @memberof Nehan.InlineContext
   @return {int}
   */
  InlineContext.prototype.getMaxExtent = function(){
    return this.isEmpty()? 0 : this.maxExtent;
  };
  /**
   @memberof Nehan.InlineContext
   @return {int}
   */
  InlineContext.prototype.getMaxFontSize = function(){
    return this.maxFontSize;
  };
  /**
   @memberof Nehan.InlineContext
   @return {int}
   */
  InlineContext.prototype.getCharCount = function(){
    return this.charCount;
  };
  /**
   @memberof Nehan.InlineContext
   @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
   */
  InlineContext.prototype.popElement = function(){
    return this.elements.pop();
  };
  /**
   @memberof Nehan.InlineContext
   @param {Nehan.Box}
   */
  InlineContext.prototype.resumeLine = function(line){
    this.elements = line.elements;
    this.curMeasure = line.inlineMeasure;
    this.maxFontSize = line.maxFontSize || this.maxFontSize;
    this.maxExtent = line.maxExtent || this.maxExtent;
    this.charCount = line.charCount || this.charCount;
  };
  /**
   hyphenate(by sweep) inline element with next head character, return null if nothing happend, or return new tail char if hyphenated.

   @memberof Nehan.InlineContext
   @param head {Nehan.Char} - head_char at next line.
   @return {Nehan.Char | null}
   */
  InlineContext.prototype.hyphenateSweep = function(head){
    var last = this.elements.length - 1;
    var ptr = last;
    var tail = this.elements[ptr] || null;
    var is_tail_ng = function(tail){
      return (tail && tail.isTailNg && tail.isTailNg())? true : false;
    };
    var is_head_ng = function(head){
      return (head && head.isHeadNg && head.isHeadNg())? true : false;
    };

    if(!is_tail_ng(tail) && !is_head_ng(head)){
      return null;
    }

    //console.log("start hyphenate:tail:%o(tail NG:%o), head:%o(head NG:%o)", tail, is_tail_ng(tail), head, is_head_ng(head));

    // if [word] is divided into [word1], [word2], then
    //    [char][word]<br>[char(head_ng)]
    // => [char][word1]<br>[word2][char(head_ng)]
    // so nothing to hyphenate.
    if(tail && tail instanceof Nehan.Word && tail.isDivided()){
      return null;
    }

    while(ptr >= 0){
      tail = this.elements[ptr];
      if(is_head_ng(head) || is_tail_ng(tail)){
	head = tail;
	ptr--;
      } else {
	break;
      }
    }
    if(ptr < 0){
      return tail;
    }
    // if ptr moved, hyphenation is executed.
    if(0 <= ptr && ptr < last){
      // disable text after new tail pos.
      this.elements = this.elements.filter(function(element){
	return element.pos? (element.pos < head.pos) : true;
      });
      return head; // return new head
    }
    return null; // hyphenate failed or not required.
  };
  
  return InlineContext;
})();


Nehan.HtmlLexer = (function (){
  var __rex_tag = /<:{0,2}[a-zA-Z][^>]*>/;

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
    var close_pos2 = __find_close_pos(buff.substring(restart_pos), tag_name, open_tag_rex, close_tag);
    if(close_pos2 < 0){
      return -1;
    }
    var restart_pos2 = restart_pos + close_pos2 + tag_name.length + 3; // 3 = "</>".length
    var restart_buff = buff.substring(restart_pos2);
    if(restart_buff.length < close_tag.length){
      return -1;
    }
    var final_pos = __find_close_pos(restart_buff, tag_name, open_tag_rex, close_tag);
    if(final_pos < 0){
      return -1;
    }
    return restart_pos2 + final_pos;
  };

  // discard close tags defined as single tag in LexingRule.
  var __replace_single_close_tags = function(str, single_tag_names){
    return single_tag_names.reduce(function(ret, name){
      return ret.replace(new RegExp("</" + name + ">", "g"), "");
    }, str);
  };

  /**
   @memberof Nehan
   @class HtmlLexer
   @classdesc lexer of html tag elements.
   @constructor
   @param src {String}
   @param opt {Object}
   @param opt.flow {Nehan.BoxFlow} - document flow(optional)
   */
  function HtmlLexer(src, opt){
    opt = opt || {};
    this.pos = 0;
    this.buff = this._normalize(src);
    this.src = this.buff;
    this.singleTagNames = opt.singleTagNames || [];
  }

  HtmlLexer.prototype._normalize = function(src){
    src = src.replace(/(<\/[^>]+>)/gm, function(str, p1){
      return p1.toLowerCase();
    }); // convert close tag to lower case(for innerHTML of IE)
    if(this.singleTagNames){
      src = __replace_single_close_tags(src, this.singleTagNames);
    }
    return src;
  };
  /**
   @memberof Nehan.HtmlLexer
   @return {boolean}
   */
  HtmlLexer.prototype.isEmpty = function(){
    return this.src === "";
  };
  /**
   get token and step cusor to next position.

   @memberof Nehan.HtmlLexer
   @return {Nehan.Token}
   */
  HtmlLexer.prototype.get = function(){
    var token = this._getToken();
    if(token){
      token.spos = this.pos;
    }
    return token;
  };
  /**
   get lexer source text

   @memberof Nehan.HtmlLexer
   @return {String}
   */
  HtmlLexer.prototype.getSrc = function(){
    return this.src;
  };
  /**
   get current pos in percentage format.

   @memberof Nehan.HtmlLexer
   @return {int}
   */
  HtmlLexer.prototype.getSeekPercent = function(seek_pos){
    return Math.round(100 * seek_pos / this.src.length);
  };

  HtmlLexer.prototype._stepBuff = function(count){
    var part = this.buff.substring(0, count);
    this.pos += count;
    this.buff = this.buff.slice(count);
    return part;
  };

  HtmlLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var match, content;
    match = this.buff.match(__rex_tag);
    if(match === null){
      content = this._stepBuff(this.buff.length);
      return new Nehan.Text(content);
    }
    if(match.index === 0){
      return this._parseTag(match[0]);
    }
    content = this._stepBuff(match.index);
    content = Nehan.Utils.trimHeadCRLF(content);
    return new Nehan.Text(content);
  };

  HtmlLexer.prototype._getTagContent = function(tag){
    // why we added [\\s|>] for open_tag_rex?
    // if tag_name is "p", 
    // both "<p>" and "<p class='foo'" also must be matched,
    // or if tag_name is "a"
    // "<a>" must be matched but "<address" is not.
    var tag_name = tag.name;
    var open_tag_rex = new RegExp("<" + tag_name + "[\\s|>]");
    var close_tag = "</" + tag_name + ">"; // tag name is already lower-cased by preprocessor.
    var close_pos = __find_close_pos(this.buff, tag_name, open_tag_rex, close_tag);

    if(close_pos >= 0){
      return {closed:true, content:this.buff.substring(0, close_pos)};
    }

    // try to ommit tag close if
    // 1. close pos not found
    // 2. Nehan.Config.enableAutoClose is true
    // 3. tag has no attributes
    // reference: http://www.w3.org/TR/html5/syntax.html#optional-tags
    if(!tag.hasAttr() && Nehan.Config.enableAutoCloseTag){
      var auto_close_pos = this._findAutoClosePos(tag_name);
      if(auto_close_pos > 0){
	return {closed:false, content:this.buff.substring(0, auto_close_pos)};
      }
    }

    console.warn("invalid syntax:%s is not closed properly, use rest content", tag_name);

    // all other case, return whole rest buffer.
    return {closed:false, content:this.buff};
  };

  HtmlLexer.prototype._findAutoClosePos = function(tag_name){
    switch(tag_name){
    case "p": return this._selectClosePos([
      "address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"
    ]);
    case "dt":
    case "dd":
      return this._selectClosePos(["dd", "dt"]);
    case "li":
      return this._selectClosePos(["li"]);
    case "thead":
    case "tbody":
    case "tfoot":
      return this._selectClosePos(["thead", "tbody", "tfoo"]);
    case "tr":
      return this._selectClosePos(["tr"]);
    case "td":
    case "th":
      return this._selectClosePos(["td", "th"]);
    default:
      return -1;
    }
  };

  HtmlLexer.prototype._selectClosePos = function(close_names){
    var matches = close_names.map(function(name){
      return this.buff.indexOf("<" + name);
    }.bind(this)).filter(function(pos){
      return pos > 0;
    }).sort(function(p1, p2){
      return p1 - p2;
    });
    return (matches.length === 0)? -1 : matches[0];
  };

  HtmlLexer.prototype._parseTag = function(tagstr){
    var tag = new Nehan.Tag(tagstr);
    this._stepBuff(tagstr.length);
    var tag_name = tag.getName();
    if(Nehan.List.exists(this.singleTagNames, Nehan.Closure.eq(tag_name))){
      tag._single = true;
      return tag;
    }
    return this._parseChildContentTag(tag);
  };

  HtmlLexer.prototype._parseChildContentTag = function(tag){
    var result = this._getTagContent(tag);
    tag.setContent(result.content);
    if(result.closed){
      this._stepBuff(result.content.length + tag.name.length + 3); // 3 = "</>".length
    } else {
      this._stepBuff(result.content.length);
    }
    return tag;
  };

  return HtmlLexer;
})();

Nehan.TextLexer = (function (){
  var __rex_tcy = /^(?:\d\d|!\?|!!|\?!|\?\?)/;
  var __rex_tail_tcy = /(?:\d\d|!\?|!!|\?!|\?\?)$/;
  var __rex_float = /^\d+\.\d+/;
  var __rex_digit = /^\d+/;
  var __rex_digit_group = /^(?:\d+[.:/])+\d+(?!\d)/;
  var __rex_money = /^(?:\d+,)+\d+/;

  // latin word range
  // \u0021-\u007E, block = Basic Latin(without \u0026, \u003B)
  // \u00C0-\u02A8, block = IPA Extensions
  // \u2000-\u206F, block = General Punctuation
  // \uFB00-\uFB06, block = Alphabetic Presentation Forms(but latin only)
  var __rex_word = /^[\u0021-\u0025\u0027-\u003A\u003C-\u007E\u00C0-\u02A8\u2000-\u206F\uFB00-\uFB06]+/;
  var __rex_char_ref = /^&.+?;/;
  var __rex_half_single_tcy = /^[a-zA-Z0-9!?]/;
  var __typographic_ligature_refs = [
    "&#xFB00;", // ff
    "&#xFB01;", // fi
    "&#xFB02;", // fl
    "&#xFB03;", // ffi
    "&#xFB04;", // ffl
    "&#xFB05;", // ft
    "&#xFB06;"  // st
  ];

  /**
   @memberof Nehan
   @class TextLexer
   @classdesc lexer of html text elements.
   @constructor
   @extends {Nehan.HtmlLexer}
   @param src {String}
  */
  function TextLexer(src){
    Nehan.HtmlLexer.call(this, src);
  }

  Nehan.Class.extend(TextLexer, Nehan.HtmlLexer);

  // @return {Nehan.Char | Nehan.Tcy | Nehan.Word}
  TextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var pat;

    // character reference
    pat = this._matchCharRef();
    if(pat){
      return this._parseAsCharRef(pat);
    }

    // word
    pat = this._matchWord(); // longuest word pattern
    if(pat){
      return this._parseAsWord(pat);
    }

    // single character
    return new Nehan.Char({data:this._stepBuff(1)});
  };

  // @return {Nehan.Char | Nehan.Word}
  TextLexer.prototype._parseAsCharRef = function(pat){
    var chr = new Nehan.Char({ref:this._stepBuff(pat.length)});
    // if typographic_ligature + word, pack as single word.
    if(Nehan.List.exists(__typographic_ligature_refs, Nehan.Closure.eq(pat))){
      var next = this._parseAsWord(pat);
      if(next && next instanceof Nehan.Word){
	next.data = pat + next.data;
	//console.log("(typographic_ligature + word):%o", next.data);
	return next;
      }
      // if look-ahead is not word, push-back to buffer.
      if(next){
	this.buff = next.data + this.buff;
      }
    }
    //console.log("character reference:%o", pat);
    return chr;
  };

  // @return {Nehan.Char | Nehan.Tcy | Nehan.Word}
  TextLexer.prototype._parseAsWord = function(pat){
    var pat2;

    //console.log("longest word:%o", pat);
    // length 1
    if(pat.length === 1){
      if(__rex_half_single_tcy.test(pat)){
	//console.log("tcy(1):%o", pat);
	return new Nehan.Tcy(this._stepBuff(1));
      }
      //console.log("char:%o", pat);
      return new Nehan.Char({data:this._stepBuff(1)});
    }
    // length 2 and tcy pattern
    if(pat.length === 2 && __rex_tcy.test(pat)){
      //console.log("tcy(2):%o", pat);
      return new Nehan.Tcy(this._stepBuff(2));
    }
    pat2 = this._match(__rex_money); // 1,000
    if(pat2){
      //console.log("money?:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    pat2 = this._match(__rex_digit_group); // 2000.01.01, 12:34, 2001/12/12 ... etc
    if(pat2){
      //console.log("digit group?:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    pat2 = this._match(__rex_float); // 1.23
    if(pat2){
      //console.log("float:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    pat2 = this._match(__rex_digit); // 1234
    if(pat2){
      if(pat2.length <= 2){
	//console.log("tcy(digit2):%o", pat2);
	return new Nehan.Tcy(this._stepBuff(pat2.length));
      }
      //console.log("digit:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    // if word + tcy(digit), divide it.
    //pat2 = this._match(/(?<!\d)\d\d$/, pat);
    pat2 = this._match(/^[^\d]\d{1,2}$/, pat); // :12 => word(:) + tcy(12)
    if(pat2){
      //console.log("divided single word:%o", pat2.charAt(0));
      return new Nehan.Word(this._stepBuff(1));
    }
    //console.log("word:%o", pat);
    return new Nehan.Word(this._stepBuff(pat.length));
  };

  TextLexer.prototype._match = function(rex, buff){
    buff = buff || this.buff;
    var rex_result = buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  TextLexer.prototype._matchWord = function(buff){
    return this._match(__rex_word, buff || null);
  };

  TextLexer.prototype._matchCharRef = function(buff){
    return this._match(__rex_char_ref, buff || null);
  };

  return TextLexer;
})();


Nehan.UprightTextLexer = (function(){
  /**
   @memberof Nehan
   @class UprightTextLexer
   @constructor
   @extends {Nehan.TextLexer}
   @param src {String}
  */
  function UprightTextLexer(src){
    Nehan.TextLexer.call(this, src);
  }

  Nehan.Class.extend(UprightTextLexer, Nehan.TextLexer);

  // @return {Nehan.Char(ref)|Nehan.Tcy}
  UprightTextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var pat, data;

    // character reference
    pat = this._matchCharRef();
    if(pat){
      //console.log("single char ref:%o", pat);
      data = this._stepBuff(pat.length);
      return new Nehan.Tcy(data);
    }

    // single character
    data = this._stepBuff(1);
    if(this._matchWord(data)){
      //console.log("single tcy:%s", data);
      return new Nehan.Tcy(data);
    }
    //console.log("single char:%s", data);
    return new Nehan.Char({data:data});
  };

  return UprightTextLexer;
})();

Nehan.TokenStream = (function(){
  /**
   @memberof Nehan
   @class TokenStream
   @classdesc abstraction of token stream
   @constructor
   @param src {String}
   @param opt {Object}
   @param opt.lexer {Lexer} - lexer class(optional)
   @param opt.flow {Nehan.BoxFlow} - document flow(optional)
   @param opt.filter {Function} - token filter function(optional)
   */
  function TokenStream(opt){
    opt = opt || {};
    this.lexer = opt.lexer || null;
    this.tokens = opt.tokens || [];
    this.pos = 0;
    if(this.lexer && this.tokens.length === 0){
      this._loadTokens(opt.filter || null);
    }
  }

  var __set_pseudo = function(tags){
    tags[0].setFirstChild(true);
    tags[0].setOnlyChild(tags.length === 1);
    tags[tags.length - 1].setLastChild(true);
  };

  var __set_pseudo_of_type = function(tags){
    tags[0].setFirstOfType(true);
    tags[0].setOnlyOfType(tags.length === 1);
    tags[tags.length - 1].setLastOfType(true);
  };

  /**
   @memberof Nehan.TokenStream
   @return {boolean}
   */
  TokenStream.prototype.hasNext  = function(){
    return (this.pos < this.tokens.length);
  };
  /**
   @memberof Nehan.TokenStream
   @return {boolean}
   */
  TokenStream.prototype.isEmptyTokens  = function(){
    return this.tokens.length === 0;
  };
  /**
   @memberof Nehan.TokenStream
   @return {boolean}
   */
  TokenStream.prototype.isHead  = function(){
    return this.pos === 0;
  };
  /**
   step backward current stream position.

   @memberof Nehan.TokenStream
   */
  TokenStream.prototype.prev  = function(){
    this.pos = Math.max(0, this.pos - 1);
  };
  /**
   set stream position directly.

   @memberof Nehan.TokenStream
   @param pos {int}
   */
  TokenStream.prototype.setPos  = function(pos){
    this.pos = pos;
  };
  /**
   set current stream position to the beginning of stream.

   @memberof Nehan.TokenStream
   */
  TokenStream.prototype.rewind  = function(){
    this.pos = 0;
  };
  /**
   look current token but not step forward current position.

   @memberof Nehan.TokenStream
   @return {token}
   */
  TokenStream.prototype.peek  = function(off){
    var offset = off || 0;
    var index = Math.max(0, this.pos + offset);
    var token = this.tokens[index];
    if(token){
      token.pos = index;
      return token;
    }
    return null;
  };
  /**
   get current stream token and step forward current position.

   @memberof Nehan.TokenStream
   @return {token}
   */
  TokenStream.prototype.get  = function(){
    var token = this.peek();
    if(token){
      this.pos++;
    }
    return token;
  };
  /**
   get stream soruce as text.

   @memberof Nehan.TokenStream
   @return {String}
   */
  TokenStream.prototype.getSrc  = function(){
    return this.lexer? this.lexer.getSrc() : "";
  };
  /**
   get current stream position.

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getPos  = function(){
    return this.pos;
  };
  /**
   get current token count.

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getTokenCount  = function(){
    return this.tokens.length;
  };
  /**
   get all tokens.

   @memberof Nehan.TokenStream
   @return {Array}
   */
  TokenStream.prototype.getTokens  = function(){
    return this.tokens;
  };
  /**
   get current token position of source text(not stream position).

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getSeekPos  = function(){
    var token = this.tokens[Math.max(0, this.pos)];
    return token? token.spos : this.tokens[this.tokens.length - 1].spos;
  };
  /**
   get current seek pos as percent.

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getSeekPercent  = function(){
    if(this.lexer){
      return this.lexer.getSeekPercent(this.getSeekPos());
    }
    return Math.round(100 * this.pos / this.tokens.length);
  };
  /**
   iterate tokens by [fn].

   @memberof Nehan.TokenStream
   @param fn {Function}
   */
  TokenStream.prototype.iterWhile  = function(fn){
    var token;
    while(this.hasNext()){
      token = this.get();
      if(token === null || !fn(token)){
	this.prev();
	break;
      }
    }
  };
  /**
   step stream position once if [fn(token)] is true.

   @memberof Nehan.TokenStream
   @param fn {Function}
   */
  TokenStream.prototype.skipIf = function(fn){
    var token = this.peek();
    return (token && fn(token))? this.get() : null;
  };
  /**
   read whole stream source.

   @memberof Nehan.TokenStream
   @param filter {Function} - filter function
   @return {Array.<token>}
   */
  TokenStream.prototype._loadTokens  = function(filter){
    var filter_order = 0;
    while(true){
      var token = this.lexer.get();
      if(token === null){
	break;
      }
      if(token instanceof Nehan.Char && token.isLigature()){
	var last = Nehan.List.last(this.tokens);
	if(last instanceof Nehan.Char){
	  last.setLigature(token.data);
	  continue;
	}
      }
      if(filter === null){
	this.tokens.push(token);
      } else if(filter(token)){
	token.order = filter_order++;
	this.tokens.push(token);
      }
    }
    this._setPseudoAttribute(this.tokens);
  };

  TokenStream.prototype._setPseudoAttribute  = function(tokens){
    var tags = tokens.filter(function(token){
      return (token instanceof Nehan.Tag);
    });
    if(tags.length === 0){
      return;
    }
    var type_of_tags = {};
    Nehan.List.iter(tags, function(tag){
      var tag_name = tag.getName();
      if(type_of_tags[tag_name]){
	type_of_tags[tag_name].push(tag);
      } else {
	type_of_tags[tag_name] = [tag];
      }
    });
    __set_pseudo(tags);
    for(var tag_name in type_of_tags){
      __set_pseudo_of_type(type_of_tags[tag_name]);
    }
  };

  return TokenStream;
})();


Nehan.RubyTokenStream = (function(){
  /**
   token stream of &lt;ruby&gt; tag content.

   @memberof Nehan
   @class RubyTokenStream
   @classdesc
   @constructor
   @extends {Nehan.TokenStream}
   @param str {String} - content string of <ruby> tag.
   */
  function RubyTokenStream(str){
    this.tokens = this._parse(new Nehan.TokenStream({
      lexer:new Nehan.HtmlLexer(str)
    }));
    this.pos = 0;
  }
  Nehan.Class.extend(RubyTokenStream, Nehan.TokenStream);

  RubyTokenStream.prototype._parse = function(stream){
    var tokens = [];
    while(stream.hasNext()){
      tokens.push(this._parseRuby(stream));
    }
    return tokens;
  };

  RubyTokenStream.prototype._parseRuby = function(stream){
    var rbs = [];
    var rt = null;
    while(true){
      var token = stream.get();
      if(token === null){
	break;
      }
      if(token instanceof Nehan.Tag && token.getName() === "rt"){
	rt = token;
	break;
      }
      if(token instanceof Nehan.Tag && token.getName() === "rb"){
	rbs = this._parseRb(token.getContent());
      }
      if(token instanceof Nehan.Text){
	rbs = this._parseRb(token.getContent());
      }
    }
    return new Nehan.Ruby(rbs, rt);
  };

  RubyTokenStream.prototype._parseRb = function(content){
    return new Nehan.TokenStream({
      lexer:new Nehan.TextLexer(content)
    }).getTokens();
  };

  return RubyTokenStream;
})();


/**
 @namespace Nehan.DefaultStyle
 */
Nehan.DefaultStyle = (function(){
  var __header_margin = function(ctx){
    var em = ctx.getParentFont().size;
    var rem = ctx.getRootFont().size;
    var before = (ctx.getCurExtent() > 0)? Math.floor(2 * rem - 0.14285 * em) : 0;
    var after = rem;
    return {
      before:before,
      after:after
    };
  };
  return {
    create : function(){
      return {
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
	  "font-style":"italic"
	},
	"area":{
	},
	"article":{
	  "display":"block"
	},
	"aside":{
	  "display":"block"
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
	  "flow":"lr-tb",
	  "box-sizing":"content-box",
	  "hanging-punctuation":"allow-end"
	},
	"br":{
	  "display":"inline"
	},
	"button":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / c
	//-------------------------------------------------------
	"canvas":{
	  "display":"inline"
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
	  "display":"block"
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
	    "after":"1em"
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
	  "display":"block"
	},
	"figcaption":{
	  "display":"block",
	  "text-align":"center",
	  "font-size": "0.8em"
	},
	"footer":{
	  "display":"block"
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
	  "font-size":"2rem",
	  "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
	  "font-weight":"bold",
	  "line-height":"1.4",
	  "margin":__header_margin
	},
	"h2":{
	  "display":"block",
	  "font-size":"1.714rem",
	  "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
	  "font-weight":"bold",
	  "line-height":"1.4",
	  "margin":__header_margin
	},
	"h3":{
	  "display":"block",
	  "font-size":"1.28rem",
	  "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
	  "font-weight":"bold",
	  "line-height":"1.4",
	  "margin":__header_margin
	},
	"h4":{
	  "display":"block",
	  "font-size":"1.071rem",
	  "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
	  "font-weight":"bold",
	  "line-height":"1.4",
	  "margin":__header_margin
	},
	"h5":{
	  "display":"block",
	  "font-size":"1rem",
	  "font-weight":"bold",
	  "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
	  "line-height":"1.4",
	  "margin":__header_margin
	},
	"h6":{
	  "display":"block",
	  "font-weight":"bold",
	  "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
	  "font-size":"1rem",
	  "line-height":"1.4",
	  "margin":__header_margin
	},
	"head":{
	  "display":"none"
	},
	"header":{
	  "display":"block"
	},
	"hr":{
	  "display":"block",
	  "box-sizing":"content-box",
	  "border-color":"#b8b8b8",
	  "border-style":"solid",
	  "line-height":"1",
	  "margin":{
	    "after":"1em"
	  },
	  "extent":"1px",
	  "border-width":{
	    "after":"1px"
	  }
	},
	"hr.space":{
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
	  "display":"block"
	},
	"ins":{
	},
	"img":{
	  "display":"inline"
	  //"box-sizing":"content-box"
	},
	"input":{
	  "display":"inline"
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
	  "line-height":"1.5"
	},
	"li":{
	  "display":"list-item",
	  "margin":{
	    "after":"0.6em"
	  }
	},
	"link":{
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
	},
	"meter":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / n
	//-------------------------------------------------------
	"nav":{
	  "display":"block"
	},
	"noscript":{
	},
	//-------------------------------------------------------
	// tag / o
	//-------------------------------------------------------
	"object":{
	  "display":"inline"
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
	    "after":"1rem"
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
	  "line-height":"1.0",
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
	  "display":"inline"
	},
	"section":{
	  "display":"block"
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
	  "display":"inline"
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
	  "table-layout":"fixed",
	  //"table-layout":"auto",
	  "background-color":"white",
	  "border-collapse":"collapse", // 'separate' is not supported yet.
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
	  "display":"table-row-group",
	  "border-collapse":"inherit"
	},
	"td":{
	  "display":"table-cell",
	  "border-width":"1px",
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
	  "display":"inline"
	},
	"tfoot":{
	  "display":"table-footer-group",
	  "border-width":"1px",
	  "border-color":"#a8a8a8",
	  "border-collapse":"inherit",
	  "border-style":"solid",
	  "font-style":"italic"
	},
	"th":{
	  "display":"table-cell",
	  "line-height":"1.4",
	  "border-width":"1px",
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
	  "border-width":"1px",
	  "border-color":"#a8a8a8",
	  "border-collapse":"inherit",
	  "border-style":"solid"
	},
	"time":{
	  "display":"inline"
	},
	"title":{
	},
	"tr":{
	  "display":"table-row",
	  "border-collapse":"inherit",
	  "border-color":"#a8a8a8",
	  "border-width":"1px",
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
	//-------------------------------------------------------
	// tag / v
	//-------------------------------------------------------
	"var":{
	  "display":"inline"
	},
	"video":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / w
	//-------------------------------------------------------
	"wbr":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / others
	//-------------------------------------------------------
	"?xml":{
	},
	"!doctype":{
	},
	// <page-break> is nehan.js original tag.
	"page-break":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// rounded corner
	//-------------------------------------------------------
	".rounded":{
	  "padding":{
	    before:"1.6em",
	    end:"1.0em",
	    after:"1.6em",
	    start:"1.0em"
	  },
	  "border-radius":"10px"
	},
	//-------------------------------------------------------
	// font-size classes
	//-------------------------------------------------------
	".xx-large":{
	  "font-size": Nehan.Config.absFontSizes["xx-large"]
	},
	".x-large":{
	  "font-size": Nehan.Config.absFontSizes["x-large"]
	},
	".large":{
	  "font-size": Nehan.Config.absFontSizes.large
	},
	".medium":{
	  "font-size": Nehan.Config.absFontSizes.medium
	},
	".small":{
	  "font-size": Nehan.Config.absFontSizes.small
	},
	".x-small":{
	  "font-size": Nehan.Config.absFontSizes["x-small"]
	},
	".xx-small":{
	  "font-size": Nehan.Config.absFontSizes["xx-small"]
	},
	".larger":{
	  "font-size": Nehan.Config.absFontSizes.larger
	},
	".smaller":{
	  "font-size": Nehan.Config.absFontSizes.smaller
	},
	//-------------------------------------------------------
	// box-sizing classes
	//-------------------------------------------------------
	".content-box":{
	  "box-sizing":"content-box"
	},
	".border-box":{
	  "box-sizing":"border-box"
	},
	".margin-box":{
	  "box-sizing":"margin-box"
	},
	//-------------------------------------------------------
	// display classes
	//-------------------------------------------------------
	".disp-none":{
	  "display":"none"
	},
	".disp-block":{
	  "display":"block"
	},
	".disp-inline":{
	  "display":"inline"
	},
	".disp-iblock":{
	  "display":"inline-block"
	},
	//-------------------------------------------------------
	// text-align classes
	//-------------------------------------------------------
	".ta-start":{
	  "text-align":"start"
	},
	".ta-center":{
	  "text-align":"center"
	},
	".ta-end":{
	  "text-align":"end"
	},
	".ta-justify":{
	  "text-align":"justify"
	},
	//-------------------------------------------------------
	// float classes
	//-------------------------------------------------------
	".float-start":{
	  "float":"start"
	},
	".float-end":{
	  "float":"end"
	},
	//-------------------------------------------------------
	// float classes
	//-------------------------------------------------------
	".clear-start":{
	  "clear":"start"
	},
	".clear-end":{
	  "clear":"end"
	},
	".clear-both":{
	  "clear":"both"
	},
	//-------------------------------------------------------
	// flow classes
	//-------------------------------------------------------
	".flow-lr-tb":{
	  "flow":"lr-tb"
	},
	".flow-tb-rl":{
	  "flow":"tb-rl"
	},
	".flow-tb-lr":{
	  "flow":"tb-lr"
	},
	".flow-rl-tb":{
	  "flow":"rl-tb"
	},
	".flow-flip":{
	  "flow":"flip"
	},
	//-------------------------------------------------------
	// list-style-position classes
	//-------------------------------------------------------
	".lsp-inside":{
	  "list-style-position":"inside"
	},
	".lsp-outside":{
	  "list-style-position":"outside"
	},
	//-------------------------------------------------------
	// list-style-type classes
	//-------------------------------------------------------
	".lst-none":{
	  "list-style-type":"none"
	},
	".lst-decimal":{
	  "list-style-type":"decimal"
	},
	".lst-disc":{
	  "list-style-type":"disc"
	},
	".lst-circle":{
	  "list-style-type":"circle"
	},
	".lst-square":{
	  "list-style-type":"square"
	},
	".lst-decimal-leading-zero":{
	  "list-style-type":"decimal-leading-zero"
	},
	".lst-lower-alpha":{
	  "list-style-type":"lower-alpha"
	},
	".lst-upper-alpha":{
	  "list-style-type":"upper-alpha"
	},
	".lst-lower-latin":{
	  "list-style-type":"lower-latin"
	},
	".lst-upper-latin":{
	  "list-style-type":"upper-latin"
	},
	".lst-lower-roman":{
	  "list-style-type":"lower-roman"
	},
	".lst-upper-roman":{
	  "list-style-type":"upper-roman"
	},
	".lst-lower-greek":{
	  "list-style-type":"lower-greek"
	},
	".lst-upper-greek":{
	  "list-style-type":"upper-greek"
	},
	".lst-cjk-ideographic":{
	  "list-style-type":"cjk-ideographic"
	},
	".lst-hiragana":{
	  "list-style-type":"hiragana"
	},
	".lst-hiragana-iroha":{
	  "list-style-type":"hiragana-iroha"
	},
	".lst-katakana":{
	  "list-style-type":"katakana"
	},
	".lst-katakana-iroha":{
	  "list-style-type":"katakana-iroha"
	},
	//-------------------------------------------------------
	// text-combine-upright
	//-------------------------------------------------------
	".tcy":{
	  "text-combine-upright":"horizontal"
	},
	//-------------------------------------------------------
	// text emphasis
	//-------------------------------------------------------
	".empha-dot-filled":{
	  "text-emphasis-style":"filled dot"
	},
	".empha-dot-open":{
	  "text-emphasis-style":"open dot"
	},
	".empha-circle-filled":{
	  "text-emphasis-style":"filled circle"
	},
	".empha-circle-open":{
	  "text-emphasis-style":"open circle"
	},
	".empha-double-circle-filled":{
	  "text-emphasis-style":"filled double-circle"
	},
	".empha-double-circle-open":{
	  "text-emphasis-style":"open double-circle"
	},
	".empha-triangle-filled":{
	  "text-emphasis-style":"filled triangle"
	},
	".empha-triangle-open":{
	  "text-emphasis-style":"open triangle"
	},
	".empha-sesame-filled":{
	  "text-emphasis-style":"filled sesame"
	},
	".empha-sesame-open":{
	  "text-emphasis-style":"open sesame"
	},
	//-------------------------------------------------------
	// break
	//-------------------------------------------------------
	".break-before":{
	  "break-before":"always"
	},
	".break-after":{
	  "break-after":"always"
	},
	//-------------------------------------------------------
	// word-break
	//-------------------------------------------------------
	".wb-all":{
	  "word-break":"break-all"
	},
	".wb-normal":{
	  "word-break":"normal"
	},
	".wb-keep":{
	  "word-break":"keep-all"
	},
	//-------------------------------------------------------
	// combination
	//-------------------------------------------------------
	"ul ul":{
	  margin:{before:"0"}
	},
	"ul ol":{
	  margin:{before:"0"}
	},
	"ol ol":{
	  margin:{before:"0"}
	},
	"ol ul":{
	  margin:{before:"0"}
	},
	//-------------------------------------------------------
	// list marker
	//-------------------------------------------------------
	"li::marker":{
	  padding:{end:"0.3em"}
	},
	//-------------------------------------------------------
	// other utility classes
	//-------------------------------------------------------
	".drop-caps::first-letter":{
	  "display":"block",
	  "box-sizing":"content-box",
	  "float":"start",
	  "font-size":"4em",
	  "measure":"1em",
	  "extent":"1em",
	  "padding":{before:"0.1em"},
	  "line-height":"1"
	},
	".gap-start":{
	  "margin":{
	    "start":"1em"
	  }
	},
	".gap-end":{
	  "margin":{
	    "end":"1em"
	  }
	},
	".gap-after":{
	  "margin":{
	    "after":"1em"
	  }
	},
	".gap-before":{
	  "margin":{
	    "before":"1em"
	  }
	}
      };
    } // function : create(){
  }; // return
})();

Nehan.Box = (function(){
  /**
   @memberof Nehan
   @class Box
   @classdesc Box abstraction. Note that 'size' is treated as 'box-sizing:content-box' in evaluation phase.
   @constrctor
   @param args {Nehan.Object}
   @param args.size {Nehan.BoxSize}
   @param args.context {Nehan.RenderingContext}
   @param args.type {string}
   @param args.elements {Array.<Nehan.Box|Nehan.Tcy|Nehan.Char|Nehan.Word|Nehan.Ruby>}
   @param {Nehan.RenderingContext}
   */
  function Box(args){
    args = args || {};
    this._type = args.type || "block";
    this.size = args.size || new Nehan.BoxSize(0, 0);
    this.display = args.display || "block";
    this.context = args.context;
    this.css = args.css || {};
    this.content = (typeof args.content !== "undefined")? args.content : null;
    this.edge = args.edge || null;
    this.classes = args.classes || [];
    this.charCount = args.charCount || 0;
    this.breakAfter = args.breakAfter || false;
    this.elements = args.elements || [];
    this.pushed = args.pushed || false;
    this.pulled = args.pulled || false;
    this.elements.forEach(function(element){
      element.parent = this;
    }.bind(this));
  }

  var __filter_text = function(elements){
    return elements.reduce(function(ret, element){
      if(element instanceof Nehan.Box){
	return ret.concat(__filter_text(element.elements || []));
      }
      return element? ret.concat(element) : ret;
    }, []);
  };

  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isLine = function(){
    return this._type === "line-block";
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isResumableLine = function(max_measure){
    if(!this.isLine()){
      return false;
    }
    if(this.hasLineBreak){
      return false;
    }
    if(this.hyphenated){
      return false;
    }
    if(this.getCacheCount() === 0){
      return false;
    }
    if(this.context.layoutContext && this.context.layoutContext.getInlineMaxMeasure() === max_measure){
      return false;
    }
    return this.inlineMeasure < max_measure;
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isVoid = function(){
    if(this.elements.length === 0){
      return true;
    }
    if(this.isInvalidSize()){
      return true;
    }
    return Nehan.List.forall(this.elements, function(element){
      return !element || (element instanceof Nehan.Box && element.isVoid());
    });
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isTextBlock = function(){
    return this._type === "text-block";
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isRubyText = function(){
    return this._type === "text-block" && this.context.getMarkupName() === "ruby";
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isEmphaText = function(){
    return this._type === "line-block" && this.context.style.isTextEmphaEnable();
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isDecoratedText = function(){
    return this.isRubyText() || this.isEmphaText();
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isInvalidSize = function(){
    return (this.size.width <= 0 || this.size.height <= 0);
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getFontSize = function(){
    return this.context.getFontSize();
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getCacheCount = function(){
    return this.cacheCount || 0;
  };
  /**
   filter text objects.

   @memberof Nehan.Box
   @return {Array.<Nehan.Char | Nehan.Word | Nehan.Tcy | Nehan.Ruby>}
   */
  Box.prototype.getTextElements = function(){
    return __filter_text(this.elements || []);
  };
  /**
   filter text object and concat it as string, mainly used for debugging.

   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Box.prototype.toString = function(flow){
    var texts = __filter_text(this.elements || []);
    flow = flow || this.getFlow();
    return texts.reduce(function(ret, text){
      return ret + text.toString(flow);
    }, "") || "<<empty>>";
  };
  /**
   @memberof Nehan.Box
   @return {Array.<string>}
   */
  Box.prototype.getDomClassName = function(){
    return this.classes? this.classes.map(Nehan.Css.addNehanPrefix).join(" ") : "";
  };
  /**
   @memberof Nehan.Box
   @return {string}
   */
  Box.prototype.getContent = function(){
    return this.content || null;
  };
  /**
   @memberof Nehan.Box
   @return {Function}
   */
  Box.prototype.getDomHook = function(){
    // default hook
    var oncreate = this.context.style.getCssAttr("oncreate") || null;

    // oncreate of text-block is already captured by parent line
    if(this.isTextBlock()){
      return this.context.style.getCssAttr("ontext") || null;
    }
    if(this.isLine()){
      return this.context.style.getCssAttr("online") || oncreate;
    }
    return this.context.style.getCssAttr("onblock") || oncreate;
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getAttrs = function(){
    // attributes of text-block is already captured by parent line
    if(this.isTextBlock()){
      return null;
    }
    return this.context.style.markup.attrs;
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getBoxCss = function(){
    switch(this.display){
    case "block": return this.getCssBlock();
    case "inline": return this.getCssInline();
    case "inline-block": return this.getCssInlineBlock();
    }
    console.error("undefined display:", this.display);
    //throw "Box::getBoxCss, undefined display";
    return {width:0, height:0, display:"none"};
  };
  /**
   @memberof Nehan.Box
   @return {Nehan.BoxFlow}
   */
  Box.prototype.getFlow = function(){
    return this.context.style.flow;
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getCssBlock = function(){
    return this.context.style.getCssBlock(this);
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getCssInline = function(){
    if(this.isTextBlock()){
      return this.context.style.getCssTextBlock(this);
    }
    return this.context.style.getCssLineBlock(this);
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getCssInlineBlock = function(){
    return this.context.style.getCssInlineBlock(this);
  };
  /**
   @memberof Nehan.Box
   @param line {Nehan.Box}
   @return {Object}
   */
  Box.prototype.getCssHoriInlineImage = function(line){
    return this.context.style.getCssHoriInlineImage(line, this);
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getContentMeasure = function(flow){
    flow = flow || this.context.style.flow;
    return this.size.getMeasure(flow);
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getContentExtent = function(flow){
    flow = flow || this.context.style.flow;
    return this.size.getExtent(flow);
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getContentWidth = function(){
    return this.size.width;
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getContentHeight = function(){
    return this.size.height;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getEdgeMeasure = function(flow){
    flow = flow || this.context.style.flow;
    return this.edge? this.edge.getMeasure(flow) : 0;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getEdgeExtent = function(flow){
    flow = flow || this.context.style.flow;
    return this.edge? this.edge.getExtent(flow) : 0;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getLayoutMeasure = function(flow){
    flow = flow || this.context.style.flow;
    if(this.context.style.isPositionAbsolute()){
      return 0;
    }
    return this.getContentMeasure(flow) + this.getEdgeMeasure(flow);
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getLayoutExtent = function(flow){
    flow = flow || this.context.style.flow;
    if(this.context.style.isPositionAbsolute()){
      return 0;
    }
    return this.getContentExtent(flow) + this.getEdgeExtent(flow);
  };
  /**
   @memberof Nehan.Box
   @return {Nehan.Box}
   */
  Box.prototype.clearBorderBefore = function(){
    if(this.edge){
      this.edge.clearBorderBefore(this.context.style.flow);
    }
    return this;
  };
  /**
   @memberof Nehan.Box
   @return {Nehan.Box}
   */
  Box.prototype.clearBorderAfter = function(){
    if(this.edge){
      this.edge.clearBorderAfter(this.context.style.flow);
    }
    return this;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @param extent {int}
   @return {Nehan.Box}
   */
  Box.prototype.resizeExtent = function(flow, extent){
    this.size.setExtent(flow, extent);
    return this;
  };

  return Box;
})();

Nehan.DocumentContext = (function(){
  // unique document id
  var __document_id = 0;

  /**
   @memberof Nehan
   @class Nehan.DocumentContext
   @constructor
  */
  function DocumentContext(){
    this.documentLang = Nehan.Config.defaultLang;
    this.documentType = "html";
    this.documentHeader = null;
    this.pages = [];
    this.charPos = 0;
    this.anchors = {};
    this.outlineContexts = [];
    this.documentId = __document_id++;
    this.headerId = 0; // unique header-id
    this.blockId = 0; // unique block-id
    this.paragraphId = 0; // unique paragraph-id
    this.lineBreakCount = 0; // count of <BR> tag, used to generate paragraph-id(<block_id>-<br_count>).
  }

  /**
   @memberof Nehan.DocumentContext
   @param document_type {String}
   */
  DocumentContext.prototype.setDocumentType = function(document_type){
    this.documentType = document_type;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {String}
   */
  DocumentContext.prototype.getDocumentType = function(){
    return this.documentType;
  };
  /**
   @memberof Nehan.DocumentContext
   @param document_header {Nehan.DocumentHeader}
   */
  DocumentContext.prototype.setDocumentHeader = function(document_header){
    this.documentHeader = document_header;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {Nehan.DocumentHeader}
   */
  DocumentContext.prototype.getDocumentHeader = function(){
    return this.documentHeader;
  };
  /**
   @memberof Nehan.DocumentContext
   @param char_pos {int}
   */
  DocumentContext.prototype.stepCharPos = function(char_pos){
    this.charPos += char_pos;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.getCharPos = function(){
    return this.charPos;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.getPageNo = function(){
    return this.pages.length;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.getPageCount = function(){
    return this.pages.length;
  };
  /**
   @memberof Nehan.DocumentContext
   @param page {Nehan.Box | Nehan.Page}
   */
  DocumentContext.prototype.addPage = function(page){
    this.pages.push(page);
  };
  /**
   @memberof Nehan.DocumentContext
   @param outline_context {Nehan.OutlineContext}
   */
  DocumentContext.prototype.addOutlineContext = function(outline_context){
    this.outlineContexts.push(outline_context);
  };
  /**
   @memberof Nehan.DocumentContext
   @param name {String}
   */
  DocumentContext.prototype.addAnchor = function(name){
    this.anchors[name] = this.getPageNo();
  };
  /**
   @memberof Nehan.DocumentContext
   @param name {String}
   @return {int}
   */
  DocumentContext.prototype.getAnchorPageNo = function(name){
    return (typeof this.anchors[name] === "undefined")? null : this.anchors[name];
  };
  /**
   @memberof Nehan.DocumentContext
   @return {String}
   */
  DocumentContext.prototype.genHeaderId = function(){
    return [__document_id, this.headerId++].join("-");
  };
  /**
   @memberof Nehan.DocumentContext
   @return {int}
   */
  DocumentContext.prototype.genBlockId = function(){
    return this.blockId++;
  };
  /**
   @memberof Nehan.DocumentContext
   */
  DocumentContext.prototype.incLineBreakCount = function(){
    this.lineBreakCount++;
  };
  /**
   @memberof Nehan.DocumentContext
   @return {String}
   */
  DocumentContext.prototype.getParagraphId = function(){
    return [this.blockId, this.lineBreakCount].join("-");
  };
  /**
   * create outline element for [section_root_name], returns multiple elements,<br>
   * because there may be multiple section root(&lt;figure&gt;, &lt;fieldset&gt; ... etc) in document.<br>
   * for details of callback function, see {@link Nehan.SectionTreeConverter}.

   @memberof Nehan.DocumentContext
   @param section_root_name {String}
   @param callbacks {Object} - hooks for each outline element.
   @param callbacks.onClickLink {Function}
   @param callbacks.createRoot {Function}
   @param callbacks.createChild {Function}
   @param callbacks.createLink {Function}
   @param callbacks.createToc {Function}
   @param callbacks.createPageNoItem {Function}
   */
  DocumentContext.prototype.createOutlineElementByName = function(section_root_name, callbacks){
    var contexts = this._getOutlineContextByName(section_root_name);
    return contexts.reduce(function(ret, context){
      var element = this._convertOutlineContextToElement(context, callbacks);
      return element? ret.concat(element) : ret;
    }.bind(this), []);
  };

  DocumentContext.prototype._getOutlineContextByName = function(section_root_name){
    return this.outlineContexts.filter(function(context){
      return context.getMarkupName() === section_root_name;
    });
  };

  DocumentContext.prototype._convertOutlineContextToElement = function(context, callbacks){
    var tree = Nehan.OutlineContextParser.parse(context);
    return tree? Nehan.SectionTreeConverter.convert(tree, callbacks) : null;
  };

  return DocumentContext;
})();


Nehan.PageEvaluator = (function(){
  /**
     @memberof Nehan
     @class PageEvaluator
     @classdesc evaluate {@link Nehan.Box} as {@link Nehan.Page}.
     @constructor
  */
  function PageEvaluator(context){
    this.context = context;
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype._getEvaluator = function(){
    var body_selector = this.context.selectors.get("body") || new Nehan.SelectorEntry("body", {flow:Nehan.Config.defaultBoxFlow});
    var flow = body_selector.getEntries().flow || Nehan.Config.defaultBoxFlow;
    return (flow === "tb-rl" || flow === "tb-lr")? new Nehan.VertEvaluator(this.context) : new Nehan.HoriEvaluator(this.context);
  };

  /**
   evaluate {@link Nehan.Box}, output {@link Nehan.Page}.

   @memberof Nehan.PageEvaluator
   @param tree {Nehan.Box}
   @return {Nehan.Page}
   */
  PageEvaluator.prototype.evaluate = function(tree){
    return tree? new Nehan.Page({
      tree:tree,
      element:this.evaluator.evaluate(tree),
      text:tree.text,
      percent:tree.percent,
      seekPos:tree.seekPos,
      pageNo:tree.pageNo,
      charPos:tree.charPos,
      charCount:tree.charCount
    }) : null;
  };

  return PageEvaluator;
})();


Nehan.PageParser = (function(){
  /**
     @memberof Nehan
     @class PageParser
     @consturctor
     @param text {String} - html source text
  */
  function PageParser(generator){
    this.generator = generator;
  }

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

  /**
   @memberof Nehan.PageParser
   @param opt {Object}
   @param opt.onProgress {Function} - fun tree:{@link Nehan.Box} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onPage {Function} - fun page:{@link Nehan.Page} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> context:{@link Nehan.RenderingContext} -> ()
   @param opt.onError {Function} - fun error:{String} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} upper bound of page count
   */
  PageParser.prototype.parse = function(opt){
    // set defaults
    opt = Nehan.Obj.merge({}, {
      capturePageText: false,
      maxPageCount: Nehan.Config.maxPageCount,
      onPage: null,
      onComplete: function(time, ctx){},
      onProgress: function(tree, ctx){},
      onError: function(error){}
    }, opt || {});

    // if onPage is defined, rewrite onProgress callback.
    if(opt.onPage){
      var original_onprogress = opt.onProgress;
      opt.onProgress = function(tree, ctx){
	//console.log("tree:", tree);
	original_onprogress(tree, ctx);
	var page = this.generator.context.getPage(tree.pageNo);
	if(page){
	  //console.log("page:", page);
	  opt.onPage(page, ctx);
	}
      }.bind(this);
    }

    this._setTimeStart();
    this._parse(opt);
  };

  PageParser.prototype._setTimeStart = function(){
    this._timeStart = (new Date()).getTime();
    return this._timeStart;
  };

  PageParser.prototype._getTimeElapsed = function(){
    return (new Date()).getTime() - this._timeStart;
  };

  PageParser.prototype._parse = function(opt){
    if(!this.generator.hasNext() || (this.generator.context.yieldCount >= opt.maxPageCount)){
      opt.onComplete.call(this, this._getTimeElapsed(), this.generator.context);
      return;
    }
    var tree = this.generator.yield();
    if(tree){
      if(opt.capturePageText){
	tree.text = tree.toString();
      }
      opt.onProgress.call(this, tree, this.generator.context);
    }
    reqAnimationFrame(function(){
      this._parse(opt);
    }.bind(this));
  };

  return PageParser;
})();


Nehan.SelectorContext = (function(){
  /**
   @memberof Nehan
   @class SelectorContext
   @param prop {String} - callee property name
   @param style {Nehan.Style}
   @param context {Nehan.RenderingContext}
   */
  function SelectorContext(prop, style, context){
    this.prop = new Nehan.CssProp(prop);
    this.style = style;
    this.layoutContext = context.layoutContext;
    this.documentContext = context.documentContext;
  }

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computeRemSize = function(em){
    var base_size = this.style.getRootFont().size;
    return Math.floor(base_size * em);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computeEmSize = function(em){
    var base_size = this.getParentStyle().getFont().size;
    return Math.floor(base_size * em);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computePercentMeasure = function(percent){
    var max_size = this.getParentStyle().contentMeasure;
    return Math.floor(max_size * percent / 100);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computePercentExtent = function(percent){
    var max_size = this.getParentStyle().contentExtent;
    return Math.floor(max_size * percent / 100);
  };

  /**
   @memberof Nehan.SelectorContext
   */
  SelectorContext.prototype.debug = function(){
    console.log("[markup]:%s(content:%s)", this.getMarkup().getSrc(), this.getMarkupContent().substring(0,10));
    console.log("[property]:%s", this.prop.getName());
    console.log("[box-flow]:%s", this.getFlow().toString());
    console.log("[cursor]:(cur extent = %d, rest extent = %d)", this.getCurExtent(), this.getRestExtent());
    console.log("[font]:%o(parent:%o, root:%o)", this.getFont(), this.getParentFont(), this.getRootFont());
    console.log("[font size]:%d(em size:%d)", this.getFont().size, this.getParentFont().size);
    console.log("[pseudo]:child index:%d(last = %o), type index:%d(last = %o)", this.getChildIndex(), this.isLastChild(), this.getChildIndexOfType(), this.isLastOfType());
  };

  /**
   @memberof Nehan.SelectorContext
   @description see {@link Nehan.Style}::find
   @param predicate {Function} - predicate test function, {Nehan.Style} -> {bool}
   @return {Nehan.Style}
   */
  SelectorContext.prototype.find = function(predicate){
    return this.style.find(predicate);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getCurExtent = function(){
    return this.layoutContext.getBlockCurExtent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestExtent = function(){
    return this.layoutContext.getBlockRestExtent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.BoxFlow}
   */
  SelectorContext.prototype.getFlow = function(){
    // avoid infinite recursion!
    if(this.prop.getName() === "flow"){
      return this.style.parent.getFlow();
    }
    return this.style.flow || this.style._loadFlow();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Font}
   */
  SelectorContext.prototype.getFont = function(){
    // avoid infinite recursion!
    if(this.prop.getName() === "font"){
      console.warn("can't load font from font property itself.");
      return this.style.parent.getFont(); // use parent font
    }
    return this.style.font || this.style._loadFont({forceLoad:true});
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Font}
   */
  SelectorContext.prototype.getParentFont = function(){
    return this.style.getParentFont();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Font}
   */
  SelectorContext.prototype.getRootFont = function(){
    return this.style.getRootFont();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Style}
   */
  SelectorContext.prototype.getParentStyle = function(){
    return this.style.parent;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.BoxFlow}
   */
  SelectorContext.prototype.getParentFlow = function(){
    var parent = this.getParentStyle();
    return parent? parent.flow : Nehan.Display.getStdBoxFlow();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Tag}
   */
  SelectorContext.prototype.getMarkup = function(){
    return this.style.markup;
  };

  /**
   @memberof Nehan.SelectorContext
   @method getMarkupContent
   @return {String}
   */
  SelectorContext.prototype.getMarkupContent = function(){
    return this.getMarkup().getContent();
  };

  /**
   @memberof Nehan.SelectorContext
   @method getDocumentHeader
   @return {Nehan.DocumentHeader}
   */
  SelectorContext.prototype.getMarkupContent = function(){
    return this.getMarkup().getContent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestMeasure = function(){
    return this.layoutContext? this.layoutContext.getInlineRestMeasure() : null;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestExtent = function(){
    return this.layoutContext? this.layoutContext.getBlockRestExtent() : null;
  };

  /**
   index number of nth-child

   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getChildIndex = function(){
    return this.style.getChildIndex();
  };

  /**
   index number of nth-child-of-type

   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getChildIndexOfType = function(){
    return this.style.getChildIndexOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @method getCssAttr
   @param name {String}
   @param def_value {default_value} - [def_value] is returned if [name] not found.
   */
  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this.style.getCssAttr(name, def_value);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isFirstChild = function(){
    return this.style.isFirstChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isFirstOfType = function(){
    return this.style.isFirstOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isLastChild = function(){
    return this.style.isLastChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isLastOfType = function(){
    return this.style.isLastOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isOnlyChild = function(){
    return this.style.isOnlyChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isOnlyOfType = function(){
    return this.style.isOnlyOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isMarkupEmpty = function(){
    return this.style.isMarkupEmpty();
  };

  /**
   @memberof Nehan.SelectorContext
   @method isTextVertical
   @return {boolean}
   */
  SelectorContext.prototype.isTextVertical = function(){
    return this.getFlow().isTextVertical();
  };

  /**
   @memberof Nehan.SelectorContext
   @method isTextHorizontal
   @return {boolean}
   */
  SelectorContext.prototype.isTextHorizontal = function(){
    return this.isTextVertical() === false;
  };

  /**
   @memberof Nehan.SelectorContext
   @method setMarkupContent
   @param content {String}
   @return {Nehan.SelectorContext}
   */
  SelectorContext.prototype.setMarkupContent = function(content){
    this.getMarkup().setContent(content);
    return this;
  };

  /**
   @memberof Nehan.SelectorContext
   @method setCssAttr
   @param name {String}
   @param value {css_value}
   @return {Nehan.SelectorContext}
   */
  SelectorContext.prototype.setCssAttr = function(name, value){
    this.style.setCssAttr(name, value);
    return this;
  };

  return SelectorContext;
})();


Nehan.DomCreateContext = (function(){
  /**
     @memberof Nehan
     @class DomCreateContext
     @classdesc context object that is passed to "oncreate" callback.
     "oncreate" is called when document of target selector is converted into dom element.
     @constructor
     @param dom {HTMLElement}
     @param box {Nehan.Box}
  */
  function DomCreateContext(dom, box, callee){
    this.dom = dom;
    this.box = box;
  }

  /**
   @memberof Nehan.DomCreateContext
   @return {HTMLElement}
   */
  DomCreateContext.prototype.getElement = function(){
    return this.dom;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Box}
   */
  DomCreateContext.prototype.getBox = function(){
    return this.box;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Box}
   */
  DomCreateContext.prototype.getParentBox = function(){
    return this.box.parent;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.BoxSize}
   */
  DomCreateContext.prototype.getBoxSize = function(){
    return this.box.size;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.BoxSize}
   */
  DomCreateContext.prototype.getParentBoxSize = function(){
    return this.box.parent.size;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Style}
   */
  DomCreateContext.prototype.getStyle = function(){
    return this.box.context.style;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Style}
   */
  DomCreateContext.prototype.getParentStyle = function(){
    return this.box.context.parent.style;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Tag}
   */
  DomCreateContext.prototype.getMarkup = function(){
    return this.getStyle().getMarkup();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Tag}
   */
  DomCreateContext.prototype.getParentMarkup = function(){
    return this.getParentStyle().getMarkup();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildCount = function(){
    return this.getStyle().getChildCount();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getParentChildCount = function(){
    return this.getParentStyle().getChildCount();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildIndex = function(){
    return this.getStyle().getChildIndex();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildIndexOfType = function(){
    return this.getStyle().getChildIndexOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isTextVertical = function(){
    return this.getStyle().isTextVertical();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isTextHorizontal = function(){
    return this.getStyle().isTextHorizontal();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isMarkupEmpty = function(){
    return this.getStyle().isMarkupEmpty();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isFirstChild = function(){
    return this.getStyle().isFirstChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isFirstOfType = function(){
    return this.getStyle().isFirstChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isOnlyChild = function(){
    return this.getStyle().isFirstOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isOnlyOfType = function(){
    return this.getStyle().isOnlyOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isLastChild = function(){
    return this.getStyle().isLastChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isLastOfType = function(){
    return this.getStyle().isLastOfType();
  };

  return DomCreateContext;
})();

Nehan.Style = (function(){
  /**
   @memberof Nehan
   @class Style
   @classdesc abstraction of document tree hierarchy with selector values, associated markup, cursor_context.
   @constructor
   @param context {Nehan.RenderingContext}
   @param markup {Nehan.Tag} - markup of style
   @param paernt {Nehan.Style} - parent style
   @param force_css {Object} - system css that must be applied.
   */
  function Style(context, markup, parent, force_css){
    this._initialize(context, markup, parent, force_css || {});
  }

  Style.prototype._initialize = function(context, markup, parent, force_css){
    this.context = context;
    this.markup = markup;
    this.markupName = markup.getName();
    this.parent = parent || null;

    // notice that 'this.children' is not children of each page.
    // for example, assume that <body> consists 2 page(<div1>, <div2>).
    //
    // <body><div1>page1</div1><div2>page2</div2></body>
    //
    // at this case, global chilren of <body> is <div1> and <div2>.
    // but for '<body> of page1', <div1> is the only child, and <div2> is for '<body> of page2' also.
    this.children = [];

    this.next = null; // next sibling
    this.prev = null; // prev sibling

    // initialize tree
    if(parent){
      parent.appendChild(this);
    }

    // create selector cache key
    this.selectorCacheKey = this._computeSelectorCacheKey();

    this.managedCss = new Nehan.CssHashSet();
    this.unmanagedCss = new Nehan.CssHashSet();
    this.callbackCss = new Nehan.CssHashSet();

    // load managed css from
    // 1. load selector css.
    // 2. load inline css from 'style' property of markup.
    // 3. load callback css 'onload'.
    // 4. load system required css(force_css).
    this._registerCssValues(this._loadSelectorCss(markup, parent));
    this._registerCssValues(this._loadInlineCss(markup));
    var onload = this.callbackCss.get("onload");
    if(onload){
      this._registerCssValues(onload(this._createSelectorContext("onload")) || {});
    }
    this._registerCssValues(force_css);

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
    var box_position = this._loadBoxPosition();
    if(box_position){
      this.boxPosition = box_position;
    }
    var border_collapse = this._loadBorderCollapse();
    if(border_collapse){
      this.borderCollapse = border_collapse;
    }
    var text_align = this._loadTextAlign();
    if(text_align){
      this.textAlign = text_align;
    }
    var text_empha = this._loadTextEmpha();
    if(text_empha){
      this.textEmpha = text_empha;
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
    var word_break = this._loadWordBreak();
    if(word_break){
      this.wordBreak = word_break;
    }
    var white_space = this._loadWhiteSpace();
    if(white_space){
      this.whiteSpace = white_space;
    }
    var hanging_punctuation = this._loadHangingPunctuation();
    if(hanging_punctuation){
      this.hangingPunctuation = hanging_punctuation;
    }
    var edge = this._loadEdge(this.flow, this.getFontSize());
    if(edge){
      this.edge = edge;
    }
    // static size is defined in selector or tag attr.
    this.staticMeasure = this._loadStaticMeasure();
    this.staticExtent = this._loadStaticExtent();

    // context size(outer size and content size) is defined by
    // 1. parent content size
    // 2. edge size
    // 3. static size
    this.initContextSize(this.staticMeasure, this.staticExtent);

    // margin-cancel or edge-collapse after context size is calculated.
    if(this.edge){
      if(this.edge.margin){
	Nehan.MarginCancel.cancel(this);
      }
      // border collapse after context size is calculated.
      if(this.edge.border && this.getBorderCollapse() === "collapse" && this.display !== "table"){
	Nehan.BorderCollapse.collapse(this);
      }
    }

    // disable some unmanaged css properties depending on loaded style values.
    this._disableUnmanagedCssProps(this.unmanagedCss);
  };
  /**
   calculate contexual box size of this style.

   @memberof Nehan.Style
   @method initContextSize
   @param measure {int}
   @param extent {int}
   @description <pre>
   *
   * (a) outer_size
   * 1. if direct size is given, use it as outer_size.
   * 2. else if parent exists, use content_size of parent.
   * 3. else if parent not exists(root), use layout size defined in display.js.
   
   * (b) content_size
   * 1. if edge(margin/padding/border) is defined, content_size = parent_content_size - edge_size
   *    1.1. if box-sizing is "margin-box", margin/padding/border are included in width/height, so
   *         content_width  = width  - (margin + padding + border).width
   *         content_height = height - (margin + padding + border).height
   *    1.2  if box-sizing is "border-box", padding/border are included in width/height, so
   *         content_width  = width  - (padding + border).width
   *         content_height = height - (padding + border).height
   *    1.3  if box-sizing is "content-box", edge_size is not included in width/height, so
   *         content_width  = width
   *         content_height = height
   * 2. else(no edge),  content_size = outer_size
   *</pre>
   */
  Style.prototype.initContextSize = function(measure, extent){
    this.initContextMeasure(measure);
    this.initContextExtent(extent);
  };
  /**
   calculate contexual box measure

   @memberof Nehan.Style
   @method initContextMeasure
   @param measure {int}
   */
  Style.prototype.initContextMeasure = function(measure){
    this.measure = measure || this.getParentContentMeasure();
    this.contentMeasure = this._computeContentMeasure(this.measure);
  };
  /**
   calculate contexual box extent

   @memberof Nehan.Style
   @method initContextExtent
   @param extent {int}
   */
  Style.prototype.initContextExtent = function(extent){
    this.extent = extent || this.getParentContentExtent();
    this.contentExtent = this._computeContentExtent(this.extent);
  };
  /**
   update context size, and propagate update to children.

   @memberof Nehan.Style
   @param measure {int}
   @param extent {int}
   */
  Style.prototype.updateContextSize = function(measure, extent){
    // measure of marker or table is always fixed.
    if(this.markupName === "marker" || this.display === "table"){
      return this;
    }
    this.initContextSize(measure, extent);

    // force re-culculate context-size of children based on new context-size of parent.
    Nehan.List.iter(this.children, function(child){
      child.updateContextSize(null, null);
    });

    return this;
  };
  /**
   append child style context

   @memberof Nehan.Style
   @param child_style {Nehan.Style}
   */
  Style.prototype.appendChild = function(child_style){
    if(this.children.length > 0){
      var last_child = Nehan.List.last(this.children);
      last_child.next = child_style;
      child_style.prev = last_child;
    }
    this.children.push(child_style);
  };
  /**
   @memberof Nehan.Style
   @param child_style {Nehan.Style}
   @return {Nehan.Style | null} removed child or null if nothing removed.
   */
  Style.prototype.removeChild = function(child_style){
    var index = Nehan.List.indexOf(this.children, function(child){
      return child === child_style;
    });
    if(index >= 0){
      var removed_child = this.children.splice(index, 1);
      return removed_child;
    }
    return null;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isDisabled = function(){
    if(this.display === "none"){
      return true;
    }
    if(Nehan.List.exists(Nehan.Config.disabledMarkups, Nehan.Closure.eq(this.getMarkupName()))){
      return true;
    }
    if(this.contentMeasure <= 0 || this.contentExtent <= 0){
      return true;
    }
    if(this.parent && this.contentMeasure > this.getRootStyle().contentMeasure){
      console.warn("too large content %o skipped:(measure = %d)", this, this.contentMeasure);
      return true;
    }
    if(this.markup.isCloseTag()){
      return true;
    }
    if(!this.markup.isSingleTag() && this.isMarkupEmpty() && this.getContent() === ""){
      return true;
    }
    return false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isBlock = function(){
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
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isRoot = function(){
    return this.getMarkupName() === "body";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isChildBlock = function(){
    return this.isBlock() && !this.isRoot();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isInlineBlock = function(){
    return this.display === "inline-block";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isInline = function(){
    if(this.getMarkupName() === "first-line"){
      return true;
    }
    return this.display === "inline";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isInlineRoot = function(){
    // Check if current inline is anonymous line block.
    // Note that inline-generators of root line share the style-context with parent block element,
    // So we use 'this.isBlock() || tis.isInlineBlock()' for checking method.
    // 1. line-object is just under the block element,
    //  <body>this text is included in anonymous line block</body>
    //
    // 2. line-object is just under the inline-block element.
    //  <div style='display:inline-block'>this text is included in anonymous line block</div>
    return this.isBlock() || this.isInlineBlock() || this.isFloated();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isManagedCssProp = function(prop){
    return Nehan.List.exists(Nehan.Config.managedCssProps, Nehan.Closure.eq(prop));
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isCallbackCssProp = function(prop){
    return Nehan.List.exists(Nehan.Config.callbackCssProps, Nehan.Closure.eq(prop));
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isFloatStart = function(){
    return this.floatDirection? this.floatDirection.isStart() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isFloatEnd = function(){
    return this.floatDirection? this.floatDirection.isEnd() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isFloated = function(){
    return this.isFloatStart() || this.isFloatEnd();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isPushed = function(){
    return this.getMarkupAttr("pushed") !== null;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isTableCell = function(){
    return this.display === "table-cell";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isPulled = function(){
    return this.getMarkupAttr("pulled") !== null;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isPasted = function(){
    return this.getMarkupAttr("pasted") !== null;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isLineBreak = function(){
    return this.markupName === "br";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isTextEmphaEnable = function(){
    return (this.textEmpha && this.textEmpha.isEnable())? true : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isTextVertical = function(){
    return this.flow.isTextVertical();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isTextHorizontal = function(){
    return this.flow.isTextHorizontal();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isPositionAbsolute = function(){
    return this.boxPosition? this.boxPosition.isAbsolute() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isPre = function(){
    return this.whiteSpace === "pre";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isPageBreak = function(){
    switch(this.getMarkupName()){
    case "page-break": case "end-page":
      return true;
    default:
      return false;
    }
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isBreakBefore = function(){
    return this.breakBefore? !this.breakBefore.isAvoid() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isBreakAfter = function(){
    return this.breakAfter? !this.breakAfter.isAvoid() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isFirstChild = function(){
    return this.markup.isFirstChild();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isFirstOfType = function(){
    return this.markup.isFirstOfType();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isLastChild = function(){
    return this.markup.isLastChild();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isLastOfType = function(){
    return this.markup.isLastOfType();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isOnlyChild = function(){
    return this.markup.isOnlyChild();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isOnlyOfType = function(){
    return this.markup.isOnlyOfType();
  };
  /**
   @memberof Nehan.Style
   @description Looks through styles from current to parent, returning the first style that passes a truth test 'predicate', return null if not found.
   @param predicate {Function} - predicate test function, {Nehan.Style} -> {bool}
   @return {Nehan.Style}
   */
  Style.prototype.find = function(predicate){
    if(predicate(this)){
      return this;
    }
    if(this.parent){
      return this.parent.find(predicate);
    }
    return null;
  };
  /**
   @memberof Nehan.Style
   @param args {Array.<Nehan.CompoundSelector>}
   @return {boolean}
   */
  Style.prototype.not = function(args){
    return Nehan.List.forall(args, function(arg){
      return !arg.test(this);
    }.bind(this));
  };
  /**
   @memberof Nehan.Style
   @param args {Array.<Nehan.CompoundSelector>}
   @return {boolean}
   */
  Style.prototype.matches = function(args){
    return Nehan.List.exists(args, function(arg){
      return arg.test(this);
    }.bind(this));
  };
  /**
   @memberof Nehan.Style
   @param args {Array.<String>} - lang name list
   @return {boolean}
   */
  Style.prototype.lang = function(args){
    var lang = this.getMarkupAttr("lang");
    if(!lang){
      return false;
    }
    return Nehan.List.exists(args, Nehan.Closure.eq(lang));
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isMarkupEmpty = function(){
    return this.markup.isEmpty();
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isWordBreakAll = function(){
    return this.wordBreak? this.wordBreak.isWordBreakAll() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isHyphenationEnable = function(){
    return this.wordBreak? this.wordBreak.isHyphenationEnable() : false;
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isHangingPuncEnable = function(){
    return this.hangingPunctuation && this.hangingPunctuation === "allow-end";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isContentBox = function(){
    return this.boxSizing === "content-box";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isBorderBox = function(){
    return this.boxSizing === "border-box";
  };
  /**
   @memberof Nehan.Style
   @return {boolean}
   */
  Style.prototype.isMarginBox = function(){
    return this.boxSizing === "margin-box";
  };
  /**
   search property from markup attributes first, and css values second.

   @memberof Nehan.Style
   @param name {String}
   @param def_value {default_value}
   @return {value}
   */
  Style.prototype.getAttr = function(name, def_value){
    var ret = this.getMarkupAttr(name);
    if(typeof ret !== "undefined" && ret !== null){
      return ret;
    }
    ret = this.getCssAttr(name);
    if(typeof ret !== "undefined" && ret !== null){
      return ret;
    }
    return (typeof def_value !== "undefined")? def_value : null;
  };
  /**
   @memberof Nehan.Style
   @param name {String}
   @param def_value {default_value}
   @return {value}
   */
  Style.prototype.getMarkupAttr = function(name, def_value){
    // if markup is "<img src='aaa.jpg'>"
    // getMarkupAttr("src") => 'aaa.jpg'
    if(name === "id"){
      return this.markup.id;
    }
    return this.markup.getAttr(name, def_value);
  };
  Style.prototype._evalCssAttr = function(prop, value){
    // if value is function, call with selector context, and format the returned value.
    if(typeof value === "function"){
      var context = this._createSelectorContext(prop);
      var entry = Nehan.CssParser.formatEntry(prop, value(context));
      return entry.value;
    }
    if(typeof value === "object"){
      return Nehan.Obj.map(value, function(prop, value){
	return this._evalCssAttr(prop, value);
      }.bind(this));
    }
    return value;
  };
  /**
   @memberof Nehan.Style
   @param name {String}
   @param value {css_value}
   */
  Style.prototype.setCssAttr = function(name, value){
    var entry = Nehan.CssParser.formatEntry(name, value);
    var target_css = this.isManagedCssProp(entry.getPropName())? this.managedCss : this.unmanagedCss;
    target_css.add(entry.getPropName(), entry.getValue());
  };
  /**
   @memberof Nehan.Style
   @param name {String}
   @def_value {default_value}
   @return {css_value}
   @description <pre>
   * notice that subdivided properties like 'margin-before' as [name] are always not found,
   * even if you defined them in setStyle(s).
   * because all subdivided properties are already converted into unified name in loading process.
   */
  Style.prototype.getCssAttr = function(name, def_value){
    var ret;
    ret = this.managedCss.get(name);
    if(ret !== null){
      return this._evalCssAttr(name, ret);
    }
    ret = this.unmanagedCss.get(name);
    if(ret !== null){
      return this._evalCssAttr(name, ret);
    }
    ret = this.callbackCss.get(name);
    if(ret !== null){
      return ret;
    }
    return (typeof def_value !== "undefined")? def_value : null;
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getParentMarkupName = function(){
    return this.parent? this.parent.getMarkupName() : null;
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Tag}
   */
  Style.prototype.getMarkup = function(){
    return this.markup;
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getMarkupName = function(){
    return this.markup.getName();
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getMarkupPath = function(){
    return this.markup.getPath();
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getMarkupId = function(){
    return this.markup.getId();
  };
  /**
   @memberof Nehan.Style
   @return {Array.<String>}
   */
  Style.prototype.getMarkupClasses = function(){
    return this.markup.getClasses();
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getMarkupContent = function(){
    return this.markup.getContent();
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getMarkupPos = function(){
    return this.markup.pos;
  };
  /**
   @memberof Nehan.Style
   @param name {String}
   @return {String}
   */
  Style.prototype.getMarkupData = function(name){
    return this.markup.getData(name);
  };
  /**
   @memberof Nehan.Style
   @param name {String}
   @param value {String}
   @return {String}
   */
  Style.prototype.setMarkupAttr = function(name, value){
    return this.markup.setAttr(name, value);
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getContent = function(){
    var content = this.getCssAttr("content") || this.markup.getContent();
    var before = this.context.selectors.getValuePe(this, "before");
    if(!Nehan.Obj.isEmpty(before)){
      content = Nehan.Html.tagWrap("::before", before.content || "") + content;
    }
    var after = this.context.selectors.getValuePe(this, "after");
    if(!Nehan.Obj.isEmpty(after)){
      content = content + Nehan.Html.tagWrap("::after", after.content || "");
    }
    var first_letter = this.context.selectors.getValuePe(this, "first-letter");
    if(!Nehan.Obj.isEmpty(first_letter)){
      content = Nehan.Utils.replaceFirstLetter(content, function(letter){
	return Nehan.Html.tagWrap("::first-letter", letter);
      });
    }
    var first_line = this.context.selectors.getValuePe(this, "first-line");
    if(!Nehan.Obj.isEmpty(first_line)){
      content = Nehan.Html.tagWrap("::first-line", content);
    }
    content = Nehan.Config.formatTagContent(this.flow, content) || content;
    return content;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getHeaderRank = function(){
    if(this.markup.isHeaderTag()){
      return parseInt(this.markup.getName().substring(1), 10);
    }
    return 0;
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getAnchorName = function(){
    var href = this.markup.getAttr("href") || "";
    return new Nehan.Uri(href).getAnchorName();
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getSelectorCacheKey = function(){
    return this.selectorCacheKey;
  };
  /**
   @memberof Nehan.Style
   @param pseudo_element_name {String}
   @return {String}
   */
  Style.prototype.getSelectorCacheKeyPe = function(pseudo_element_name){
    return this.selectorCacheKey + "::" + pseudo_element_name;
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Font}
   */
  Style.prototype.getFont = function(){
    return this.font || this.getParentFont();
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Font}
   */
  Style.prototype.getParentFont = function(){
    return this.parent? this.parent.getFont() : Nehan.Display.getStdFont();
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Style}
   */
  Style.prototype.getRootStyle = function(){
    if(this.isRoot() || !this.parent){
      return this;
    }
    return this.parent.getRootStyle();
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Font}
   */
  Style.prototype.getRootFont = function(){
    return this.getRootStyle().getFont();
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getFontSize = function(){
    return this.getFont().size;
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getFontFamily = function(){
    return this.getFont().family;
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.TextAlign}
   */
  Style.prototype.getTextAlign = function(){
    return this.textAlign || Nehan.TextAligns.get("start");
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getTextCombineUpright = function(){
    return this.getCssAttr("text-combine-upright", null);
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getTextOrientation = function(){
    return this.getCssAttr("text-orientation", "mixed");
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getLetterSpacing = function(){
    return this.letterSpacing || 0;
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.ListStyle}
   */
  Style.prototype.getListStyle = function(){
    if(this.listStyle){
      return this.listStyle;
    }
    if(this.display === "list-item" && this.parent){
      return this.parent.getListStyle() || new Nehan.ListStyle(); // default list style
    }
    return null;
  };
  /**
   @memberof Nehan.Style
   @param order {int}
   @return {String}
   */
  Style.prototype.getListMarkerHtml = function(order, opt){
    opt = opt || {};
    if(this.listStyle){
      return this.listStyle.getMarkerHtml(this.flow, order, opt);
    }
    if(this.parent){
      return this.parent.getListMarkerHtml(order, opt);
    }
    return "&nbsp";
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Color}
   */
  Style.prototype.getColor = function(){
    return this.color || (this.parent? this.parent.getColor() : new Nehan.Color(Nehan.Config.defaultFontColor));
  };
  /**
   @memberof Nehan.Style
   @return {String}
   */
  Style.prototype.getBorderCollapse = function(){
    if(this.borderCollapse){
      return (this.borderCollapse === "inherit")? this.parent.getBorderCollapse() : this.borderCollapse;
    }
    return null;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getChildCount = function(){
    return this.children.length;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getChildIndex = function(){
    return Math.max(0, Nehan.List.indexOf(this.getParentChildren(), function(child){
      return child === this;
    }.bind(this)));
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getChildIndexOfType = function(){
    return Math.max(0, Nehan.List.indexOf(this.getParentChildrenOfType(this.getMarkupName()), function(child){
      return child === this;
    }.bind(this)));
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Style}
   */
  Style.prototype.getNthChild = function(nth){
    return this.children[nth] || null;
  };
  /**
   @memberof Nehan.Style
   @return {Array.<Nehan.Style>}
   */
  Style.prototype.getParentChildren = function(){
    return this.parent? this.parent.children : [];
  };
  /**
   @memberof Nehan.Style
   @param nth {int}
   @return {Nehan.Style}
   */
  Style.prototype.getParentNthChild = function(nth){
    return this.parent? this.parent.getNthChild(nth) : null;
  };
  /**
   @memberof Nehan.Style
   @param markup_name {String}
   @return {Nehan.Style}
   */
  Style.prototype.getParentChildrenOfType = function(markup_name){
    return this.getParentChildren().filter(function(child){
      return child.getMarkupName() === markup_name;
    });
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.BoxFlow}
   */
  Style.prototype.getParentFlow = function(){
    return this.parent? this.parent.flow : this.flow;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getParentFontSize = function(){
    return this.parent? this.parent.getFontSize() : Nehan.Config.defaultFontSize;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getParentContentMeasure = function(){
    return this.parent? this.parent.contentMeasure : screen[this.flow.getPropMeasure()];
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getParentContentExtent = function(){
    return this.parent? this.parent.contentExtent : screen[this.flow.getPropExtent()];
  };
  /**
   @memberof Nehan.Style
   @return {Nehan.Style}
   */
  Style.prototype.getNextSibling = function(){
    return this.next;
  };
  /**
   @memberof Nehan.Style
   @return {float | int}
   */
  Style.prototype.getLineHeight = function(){
    var font = this.getFont();
    return font.lineHeight || Nehan.Config.defaultLineHeight;
  };
  /**
   @memberof Nehan.Style
   @return {float | int}
   */
  Style.prototype.getVerticalAlign = function(){
    return this.getCssAttr("vertical-align", "baseline");
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEmphaTextBlockExtent = function(){
    return this.textEmpha.getExtent(this.getFontSize());
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getRubyTextBlockExtent = function(){
    var base_font_size = this.getFontSize();
    var extent = Math.floor(base_font_size * (1 + Nehan.Config.defaultRtRate));
    return (base_font_size % 2 === 0)? extent : extent + 1;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getAutoLineExtent = function(){
    return Math.floor(this.getFontSize() * this.getLineHeight());
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEdgeMeasure = function(flow){
    var edge = this.edge || null;
    return edge? edge.getMeasure(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEdgeExtent = function(flow){
    var edge = this.edge || null;
    return edge? edge.getExtent(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEdgeStart = function(flow){
    var edge = this.edge || null;
    return edge? edge.getStart(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEdgeEnd = function(flow){
    var edge = this.edge || null;
    return edge? edge.getEnd(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEdgeBefore = function(flow){
    var edge = this.edge || null;
    return edge? edge.getBefore(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getEdgeAfter = function(flow){
    var edge = this.edge || null;
    return edge? edge.getAfter(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getInnerEdgeMeasure = function(flow){
    var edge = this.edge || null;
    return edge? edge.getInnerMeasureSize(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getInnerEdgeExtent = function(flow){
    var edge = this.edge || null;
    return edge? edge.getInnerExtentSize(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @return {int}
   */
  Style.prototype.getInnerEdgeBefore = function(flow){
    var edge = this.edge || null;
    return edge? edge.getInnerBefore(flow || this.flow) : 0;
  };
  /**
   @memberof Nehan.Style
   @param block {Nehan.Box}
   @return {Object}
   */
  Style.prototype.getCssBlock = function(block){
    // notice that box-size, box-edge is box local variable,<br>
    // so style of box-size(content-size) and edge-size are generated at Box::getCssBlock
    var css = {};
    var is_vert = this.isTextVertical();
    css.display = "block";
    if(this.font){
      Nehan.Obj.copy(css, this.font.getCss());
    }
    if(this.parent && this.getMarkupName() !== "body"){
      Nehan.Obj.copy(css, this.parent.flow.getCss());
    }
    if(this.color){
      Nehan.Obj.copy(css, this.color.getCss());
    }
    if(this.letterSpacing && !is_vert){
      css["letter-spacing"] = this.letterSpacing + "px";
    }
    if(this.floatDirection){
      Nehan.Obj.copy(css, this.floatDirection.getCss(is_vert));
    }
    if(this.boxPosition){
      Nehan.Obj.copy(css, this.boxPosition.getCss());
    }
    if(this.zIndex){
      css["z-index"] = this.zIndex;
    }
    Nehan.Obj.copy(css, this.unmanagedCss.getValues());
    Nehan.Obj.copy(css, block.size.getCss()); // content size
    if(block.edge){
      Nehan.Obj.copy(css, block.edge.getCss());
    }
    Nehan.Obj.copy(css, block.css); // some dynamic values
    return css;
  };
  /**
   @memberof Nehan.Style
   @param line {Nehan.Box}
   @return {Object}
   */
  Style.prototype.getCssLineBlock = function(line){
    // notice that line-size, line-edge is box local variable,
    // so style of line-size(content-size) and edge-size are generated at Box::getBoxCss
    var css = {};
    Nehan.Obj.copy(css, line.size.getCss());
    if(line.edge){
      Nehan.Obj.copy(css, line.edge.getCss());
    }
    if(this.isInlineRoot()){
      Nehan.Obj.copy(css, this.flow.getCss());
    }
    if(this.font){
      Nehan.Obj.copy(css, this.font.getCss());
    }
    if(this.color){
      Nehan.Obj.copy(css, this.color.getCss());
    }
    if(this.isInlineRoot()){
      css["line-height"] = this.getFontSize() + "px";
    }
    if(this.isTextVertical()){
      css["display"] = "block";
    }
    Nehan.Obj.copy(css, this.unmanagedCss.getValues());
    Nehan.Obj.copy(css, line.css);
    css["background-color"] = this.getCssAttr("background-color", "transparent");
    return css;
  };
  /**
   @memberof Nehan.Style
   @param line {Nehan.Box}
   @return {Object}
   */
  Style.prototype.getCssTextBlock = function(line){
    // notice that line-size, line-edge is box local variable,
    // so style of line-size(content-size) and edge-size are generated at Box::getCssInline
    var css = {};
    Nehan.Obj.copy(css, line.size.getCss());
    if(line.edge){
      Nehan.Obj.copy(css, line.edge.getCss());
    }
    if(this.isTextVertical()){
      css["display"] = "block";
      css["line-height"] = "1em";
      if(Nehan.Env.client.isAppleMobileFamily()){
	css["letter-spacing"] = "-0.001em";
      }
    } else {
      Nehan.Obj.copy(css, this.flow.getCss());
      css["line-height"] = line.maxFontSize + "px";
      if(this.getMarkupName() === "ruby" || this.isTextEmphaEnable()){
	css["display"] = "inline-block";
      }
      if(line.hangingChar){
	delete css["css-float"];
      }
    }
    Nehan.Obj.copy(css, this.unmanagedCss.getValues());
    Nehan.Obj.copy(css, line.css);
    css["background-color"] = this.getCssAttr("background-color", "transparent");
    return css;
  };
  /**
   @memberof Nehan.Style
   @param line {Nehan.Box}
   @return {Object}
   */
  Style.prototype.getCssInlineBlock = function(line){
    var css = this.getCssBlock(line);
    if(this.isTextVertical()){
      if(!this.isFloated()){
	delete css["css-float"];
      }
    } else {
      Nehan.Obj.copy(css, this.flow.getCss());
    }
    css.display = "inline-block";
    return css;
  };
  /**
   @memberof Nehan.Style
   @param line {Nehan.Box}
   @param image {Nehan.Box}
   @return {Object}
   */
  Style.prototype.getCssHoriInlineImage = function(line, image){
    return this.flow.getCss();
  };

  Style.prototype._computeSelectorCacheKey = function(){
    var keys = this.parent? [this.parent.getSelectorCacheKey()] : [];
    keys.push(this.markup.getKey());
    return keys.join(">");
  };

  Style.prototype._computeContentMeasure = function(measure){
    switch(this.boxSizing){
    case "margin-box": return measure - this.getEdgeMeasure();
    case "border-box": return measure - this.getInnerEdgeMeasure();
    case "content-box": return measure;
    default: return measure;
    }
  };

  Style.prototype._computeContentExtent = function(extent){
    switch(this.boxSizing){
    case "margin-box": return extent - this.getEdgeExtent();
    case "border-box": return extent - this.getInnerEdgeExtent();
    case "content-box": return extent;
    default: return extent;
    }
  };

  Style.prototype._computeFontSize = function(val, unit_size){
    var str = String(val).replace(/\/.+$/, ""); // remove line-height value like 'large/150%"'
    var size = Nehan.Config.absFontSizes[str] || str;
    var max_size = this.getParentFontSize();
    var font_size = this._computeUnitSize(size, unit_size, max_size);
    return Math.max(1, Math.min(font_size, Nehan.Config.maxFontSize));
  };

  // [TODO]
  // if em unitted, need to compute strict size.
  Style.prototype._computeLineHeight = function(val){
    var str = String(val);
    if(str.indexOf("%") > 0){
      return parseInt(str, 10) / 100; // 150% -> 1.5
    }
    return parseFloat(val);
  };

  Style.prototype._computeUnitSize = function(val, unit_size, max_size){
    var str = String(val);
    if(str.indexOf("rem") > 0){
      return Nehan.Utils.getEmSize(parseFloat(str), this.getRootFont().size);
    }
    if(str.indexOf("em") > 0){
      return Nehan.Utils.getEmSize(parseFloat(str), unit_size);
    }
    if(str.indexOf("pt") > 0){
      return Nehan.Utils.getPxFromPt(parseFloat(str, 10));
    }
    if(str.indexOf("%") > 0){
      return Nehan.Utils.getPercentValue(parseFloat(str, 10), max_size);
    }
    var px = parseInt(str, 10);
    return isNaN(px)? 0 : px;
  };

  Style.prototype._computeCornerSize = function(val, unit_size){
    var ret = {};
    var max_measure = this.parent? this.parent.contentMeasure : 0;
    var max_extent = this.parent? this.parent.contentExtent: 0;
    for(var prop in val){
      ret[prop] = [0, 0];
      ret[prop][0] = this._computeUnitSize(val[prop][0], unit_size, max_measure);
      ret[prop][1] = this._computeUnitSize(val[prop][1], unit_size, max_extent);
    }
    return ret;
  };

  Style.prototype._computeEdgeSize = function(val, unit_size){
    var ret = {};
    for(var prop in val){
      ret[prop] = this._computeUnitSize(val[prop], unit_size);
    }
    return ret;
  };

  Style.prototype._loadSelectorCss = function(markup, parent){
    switch(markup.getName()){
    case "::marker":
    case "::before":
    case "::after":
    case "::first-letter":
    case "::first-line":
      // notice that style of pseudo-element is defined with parent context.
      var pe_values = this.context.selectors.getValuePe(parent, markup.getPseudoElementName());
      //console.log("[%s::%s] pseudo values:%o", parent.markupName, this.markup.name, pe_values);
      return pe_values;

    default:
      var values = this.context.selectors.getValue(this);
      //console.log("[%s] selector values:%o", this.markup.name, values);
      return values;
    }
  };

  Style.prototype._loadInlineCss = function(markup){
    var style = markup.getAttr("style");
    if(style === null){
      return {};
    }
    var stmts = (style.indexOf(";") >= 0)? style.split(";") : [style];
    var allowed_props = Nehan.Config.allowedInlineStyleProps || [];
    var values = stmts.reduce(function(ret, stmt){
      var nv = stmt.split(":");
      if(nv.length >= 2){
	var prop = Nehan.Utils.trim(nv[0]).toLowerCase();
	var value = Nehan.Utils.trim(nv[1]);
	var entry = Nehan.CssParser.formatEntry(prop, value);
	var fmt_prop = entry.getPropName();
	var fmt_value = entry.getValue();
	if(allowed_props.length === 0 || Nehan.List.exists(allowed_props, Nehan.Closure.eq(fmt_prop))){
	  ret.add(fmt_prop, fmt_value);
	}
      }
      return ret;
    }, new Nehan.CssHashSet()).getValues();
    //console.log("[%s] load inline css:%o", this.markup.name, values);
    return values;
  };

  Style.prototype._disableUnmanagedCssProps = function(unmanaged_css){
    if(this.isTextVertical()){
      // unmanaged 'line-height' is not welcome for vertical-mode.
      unmanaged_css.remove("line-height");
    }
  };

  Style.prototype._registerCssValues = function(values){
    Nehan.Obj.iter(values, function(fmt_prop, value){
      if(this.isCallbackCssProp(fmt_prop)){
	this.callbackCss.add(fmt_prop, value);
      } else if(this.isManagedCssProp(fmt_prop)){
	this.managedCss.add(fmt_prop, this._evalCssAttr(fmt_prop, value));
      } else {
	this.unmanagedCss.add(fmt_prop, this._evalCssAttr(fmt_prop, value));
      }
    }.bind(this));
  };

  Style.prototype._createSelectorContext = function(prop){
    return new Nehan.SelectorContext(prop, this, this.context);
  };

  Style.prototype._loadDisplay = function(){
    switch(this.getMarkupName()){
    case "first-line":
      return "inline";
    case "li-marker":
    case "li-body":
      return "block";
    default:
      return this.getCssAttr("display", "inline");
    }
  };

  Style.prototype._loadFlow = function(){
    var value = this.getCssAttr("flow", "inherit");
    var parent_flow = this.parent? this.parent.flow : Nehan.Display.getStdBoxFlow();
    if(value === "inherit"){
      return parent_flow;
    }
    if(value === "flip"){
      return parent_flow.getFlipFlow();
    }
    return Nehan.BoxFlows.getByName(value);
  };

  Style.prototype._loadBoxPosition = function(){
    var pos_value = this.getCssAttr("position");
    if(!pos_value){
      return null;
    }
    var box_pos = new Nehan.BoxPosition(pos_value);
    var font_size = this.getFontSize();
    Nehan.List.iter(Nehan.Const.cssLogicalBoxDirs, function(dir){
      var value = this.getCssAttr(dir);
      if(value){
	box_pos[value] = this._computeUnitSize(value, font_size);
      }
    }.bind(this));
    return box_pos;
  };

  Style.prototype._loadBorderCollapse = function(){
    return this.getCssAttr("border-collapse");
  };

  Style.prototype._loadColor = function(){
    var value = this.getCssAttr("color", "inherit");
    if(value !== "inherit"){
      return new Nehan.Color(value);
    }
    return null;
  };

  Style.prototype._loadFont = function(opt){
    opt = opt || {};
    var parent_font = this.getParentFont();
    var line_height = this.getCssAttr("line-height", "inherit");
    var css = this.getCssAttr("font", {
      size:"inherit",
      family:"inherit",
      weight:"inherit",
      style:"inherit",
      variant:"inherit",
      lineHeight:"inherit"
    });
    if(line_height !== "inherit"){
      css.lineHeight = line_height;
    }
    var font = new Nehan.Font(css);
    if(parent_font){
      font.inherit(parent_font);
    }
    if(font.size !== parent_font.size){
      font.size = this._computeFontSize(font.size, parent_font.size);
    }
    if(font.lineHeight !== parent_font.lineHeight){
      font.lineHeight = this._computeLineHeight(font.lineHeight);
    }
    // if all inherited, not required to create new one.
    if(!opt.forceLoad && !this.isRoot() && font.isEqual(parent_font)){
      return null;
    }
    //console.log("size:%d, family:%s, weight:%s, style:%s", font.size, font.family, font.weight, font.style);
    return font;
  };

  Style.prototype._loadBoxSizing = function(){
    return this.getCssAttr("box-sizing", "margin-box");
  };

  Style.prototype._loadEdge = function(flow, font_size){
    var padding = this._loadPadding(flow, font_size);
    var margin = this._loadMargin(flow, font_size);
    var border = this._loadBorder(flow, font_size);
    if(padding === null && margin === null && border === null){
      return null;
    }
    return new Nehan.BoxEdge({
      padding:padding,
      margin:margin,
      border:border
    });
  };

  Style.prototype._loadEdgeSize = function(font_size, prop){
    var edge_size = this.getCssAttr(prop);
    if(edge_size === null){
      return null;
    }
    return this._computeEdgeSize(edge_size, font_size);
  };

  Style.prototype._loadPadding = function(flow, font_size){
    var edge_size = this._loadEdgeSize(font_size, "padding");
    if(edge_size === null){
      return null;
    }
    var padding = new Nehan.Padding();
    padding.setSize(flow, edge_size);
    return padding;
  };

  Style.prototype._loadMargin = function(flow, font_size){
    var edge_size = this._loadEdgeSize(font_size, "margin");
    if(edge_size === null){
      return null;
    }
    var margin = new Nehan.Margin();
    margin.setSize(flow, edge_size);

    // if inline, disable margin-before and margin-after.
    if(this.isInline()){
      margin.clearBefore(flow);
      margin.clearAfter(flow);
    }
    return margin;
  };

  Style.prototype._loadBorder = function(flow, font_size){
    var edge_size = this._loadEdgeSize(font_size, "border-width");
    var border_radius = this.getCssAttr("border-radius");
    if(edge_size === null && border_radius === null){
      return null;
    }
    var border = new Nehan.Border();
    if(edge_size){
      border.setSize(flow, edge_size);
    }
    if(border_radius){
      border.setRadius(flow, this._computeCornerSize(border_radius, font_size));
    }
    var border_color = this.getCssAttr("border-color");
    if(border_color){
      border.setColor(flow, border_color);
    }
    var border_style = this.getCssAttr("border-style");
    if(border_style){
      border.setStyle(flow, border_style);
    }
    return border;
  };

  Style.prototype._loadTextAlign = function(){
    var value = this.getCssAttr("text-align", "inherit");
    if(value === "inherit" && this.parent && this.parent.textAlign){
      return this.parent.textAlign;
    }
    return Nehan.TextAligns.get(value || "start");
  };

  Style.prototype._loadTextEmpha = function(){
    var css = this.getCssAttr("text-emphasis", null);
    if(css === null || !css.style || css.style === "none"){
      return null;
    }
    return new Nehan.TextEmpha({
      style:new Nehan.TextEmphaStyle(css.style),
      position:new Nehan.TextEmphaPos(css.position || {hori:"over", vert:"right"}),
      color:(css.color? new Nehan.Color(css.color) : this.getColor())
    });
  };

  Style.prototype._loadFloatDirection = function(){
    var name = this.getCssAttr("float", "none");
    if(name === "none"){
      return null;
    }
    return Nehan.FloatDirections.get(name);
  };

  Style.prototype._loadBreakBefore = function(){
    var value = this.getCssAttr("break-before");
    return value? Nehan.Breaks.getBefore(value) : null;
  };

  Style.prototype._loadBreakAfter = function(){
    var value = this.getCssAttr("break-after");
    return value? Nehan.Breaks.getAfter(value) : null;
  };

  Style.prototype._loadWordBreak = function(){
    var inherit = this.parent? this.parent.wordBreak : Nehan.WordBreaks.getByName("normal");
    var value = this.getCssAttr("word-break");
    return value? Nehan.WordBreaks.getByName(value) : inherit;
  };

  // same as 'word-wrap' in IE.
  // value: 'break-word' or 'normal'
  /*
  Style.prototype._loadOverflowWrap = function(){
    var inherit = this.parent? this.parent.overflowWrap : "normal";
    return this.getCssAttr("overflow-wrap") || inherit;
  };*/

  Style.prototype._loadWhiteSpace = function(){
    var inherit = this.parent? this.parent.whiteSpace : "normal";
    return this.getCssAttr("white-space", inherit);
  };

  Style.prototype._loadHangingPunctuation = function(){
    var inherit = this.parent? this.parent.hangingPunctuation : "none";
    return this.getCssAttr("hanging-punctuation", inherit);
  };

  Style.prototype._loadListStyle = function(){
    var list_style = this.getCssAttr("list-style", null);
    if(list_style === null){
      return null;
    }
    return new Nehan.ListStyle(list_style);
  };

  Style.prototype._loadLetterSpacing = function(font_size){
    var letter_spacing = this.getCssAttr("letter-spacing");
    if(letter_spacing){
      return this._computeUnitSize(letter_spacing, font_size);
    }
    return null;
  };

  // [TODO] not all element allows direct size via attribute, so check tag name before calling getAttr
  Style.prototype._loadStaticMeasure = function(){
    var prop = this.flow.getPropMeasure();
    var max_size = this.getParentContentMeasure();
    var static_size = this.getAttr(prop, null) || this.getAttr("measure", null) || this.getCssAttr(prop, null) || this.getCssAttr("measure", null);
    if(static_size === null){
      return null;
    }
    return this._computeUnitSize(static_size, this.getFontSize(), max_size);
  };

  // [TODO] not all element allows direct size via attribute, so check tag name before calling getAttr
  Style.prototype._loadStaticExtent = function(){
    var prop = this.flow.getPropExtent();
    var max_size = this.getParentContentExtent();
    var static_size = this.getAttr(prop, null) || this.getAttr("extent", null) || this.getCssAttr(prop, null) || this.getCssAttr("extent", null);
    if(static_size === null){
      return null;
    }
    return this._computeUnitSize(static_size, this.getFontSize(), max_size);
  };

  return Style;
})();

Nehan.LayoutGenerator = (function(){
  /**
   @memberof Nehan
   @class LayoutGenerator
   @classdesc abstract super class for all generator
   @constructor
   @param context {Nehan.RenderingContext}
   */
  function LayoutGenerator(context){
    this.context = context;
    this.context.setOwnerGenerator(this);
    this._onInitialize(this.context);
  }

  /**
   @memberof Nehan.LayoutGenerator
   @method hasNext
   @return {bool}
   */
  LayoutGenerator.prototype.hasNext = function(){
    return this.context.hasNext();
  };

  /**
   @memberof Nehan.LayoutGenerator
   @method yield
   @param parent_context {Nehan.LayoutContext} - cursor context from parent generator
   @return {Nehan.Box}
   */
  LayoutGenerator.prototype.yield = function(){
    //console.group("%s _yield:%o", this.context.getName(), this.context);

    // this.context.layoutContext is created.
    this.context.initLayoutContext();

    // call _yield implemented in subclass.
    var box = this._yield();

    // called for each output
    if(box){
      this._onCreate(box);
    }

    // called for final output
    if(box && !this.hasNext()){
      this._onComplete(box);
    }

    // increment yield count
    this.context.yieldCount++;

    // to avoid infinite loop, raise error if too many yielding.
    if(this.context.yieldCount > Nehan.Config.maxYieldCount){
      console.error("[%s]too many yield!:%o", this.context._name, this);
      throw "too many yield";
    }

    //console.groupEnd();

    return box;
  };

  LayoutGenerator.prototype._yield = function(){
    throw "_yield is not defined.";
  };

  LayoutGenerator.prototype._popCache = function(){
    return this.context.popCache();
  };

  // called after new
  LayoutGenerator.prototype._onInitialize = function(context){
  };

  // called for each output
  LayoutGenerator.prototype._onCreate = function(output){
  };

  // called for final output
  LayoutGenerator.prototype._onComplete = function(output){
  };

  return LayoutGenerator;
})();


Nehan.BlockGenerator = (function(){
  /**
   @memberof Nehan
   @class BlockGenerator
   @classdesc generator of generic block element
   @constructor
   @extends Nehan.LayoutGenerator
   @param context {Nehan.RenderingContext}
   */
  function BlockGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(BlockGenerator, Nehan.LayoutGenerator);

  BlockGenerator.prototype._onInitialize = function(context){
    context.initBlockClear();
  };

  BlockGenerator.prototype._onElement = function(element){
  };

  BlockGenerator.prototype._yield = function(){
    var clearance = this.context.yieldClearance();
    if(clearance){
      //console.log("clearance:", clearance);
      return clearance;
    }
    // if break-before available, page-break but only once.
    if(this.context.isBreakBefore()){
      //consoe.log("break before");
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext();
      if(element){
	this._onElement(element);
      }
      var result = this.context.addBlockElement(element);
      if(result === Nehan.Results.OK || result === Nehan.Results.SKIP){
	continue;
      }
      if(result === Nehan.Results.EOF ||
	 result === Nehan.Results.BREAK_AFTER ||
	 result === Nehan.Results.ZERO ||
	 result === Nehan.Results.TOO_MANY_ROLLBACK ||
	 result === Nehan.Results.OVERFLOW){
	break;
      }
      console.error(result);
      throw result;
    }
    return this._createOutput();
  };

  BlockGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this._popCache();
    }

    if(this.context.hasChildLayout()){
      var child = this.context.yieldChildLayout();
      return child;
    }

    // read next token
    var token = this.context.stream? this.context.stream.get() : null;
    if(token === null){
      return null;
    }

    //console.log("block token:%o", token);

    // if texts just under block level, it's delegated to same style inline-generator.
    if(token instanceof Nehan.Text){
      if(token.isWhiteSpaceOnly()){
	return this._getNext();
      }
      this.context.stream.prev();
      var inline_root_gen = this.context.createInlineRootGenerator();
      return inline_root_gen.yield();
    }

    // if tag token, inherit style
    var child_style = this.context.createChildStyle(token);
    var child_gen;

    // if disabled style, just skip
    if(child_style.isDisabled()){
      //console.warn("disabled style:%o(%s):", child_style, child_style.getMarkupName());
      return this._getNext();
    }

    // if page-break, end page
    if(child_style.isPageBreak()){
      this.context.layoutContext.setBreakAfter(true);
      return null;
    }

    // if line-break, output empty line(extent = font-size).
    if(child_style.isLineBreak()){
      return this.context.createLineBox({
	maxExtent:this.context.style.getFontSize()
      });
    }

    if(child_style.isFloated()){
      var first_float_gen = this.context.createChildBlockGenerator(child_style);
      return this.context.createFloatGenerator(first_float_gen).yield();
    }

    // if link tag appears in block context, treat it as inline-block.
    if(child_style.getMarkupName() === "a"){
      child_style.display = "inline-block";
    }

    // if child inline or child inline-block,
    if(child_style.isInline() || child_style.isInlineBlock()){
      this.context.stream.prev();
      child_gen = this.context.createInlineRootGenerator();
      return child_gen.yield();
    }

    // other case, start child block generator
    child_gen = this.context.createChildBlockGenerator(child_style);
    return child_gen.yield();
  };

  BlockGenerator.prototype._onComplete = function(block){
    if(this.context.isBreakAfter()){
      block.breakAfter = true;
    }
  };

  BlockGenerator.prototype._createOutput = function(){
    return this.context.createBlockBox();
  };

  return BlockGenerator;
})();


Nehan.InlineGenerator = (function(){
  /**
   @memberof Nehan
   @class InlineGenerator
   @classdesc inline level generator, output inline level block.
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
   */
  function InlineGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(InlineGenerator, Nehan.LayoutGenerator);

  InlineGenerator.prototype._yield = function(){
    while(this.hasNext()){
      var element = this._getNext();
      var result = this.context.addInlineElement(element);
      if(result === Nehan.Results.OK || result === Nehan.Results.SKIP){
	continue;
      }
      if(result === Nehan.Results.EOF ||
	 result === Nehan.Results.ZERO ||
	 result === Nehan.Results.LINE_BREAK ||
	 result === Nehan.Results.TOO_MANY_ROLLBACK ||
	 result === Nehan.Results.OVERFLOW){
	break;
      }
      console.error(result);
      throw result;
    }
    // skip continuous <br> if element is the last full-filled line.
    if(element && element.lineOver && this.context.child && !this.context.child.hasNext()){
      this.context.stream.skipIf(function(token){
	return (token instanceof Nehan.Tag && token.getName() === "br");
      });
    }
    return this._createOutput();
  };

  InlineGenerator.prototype._createOutput = function(){
    return this.context.createLineBox();
  };

  InlineGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this._popCache();
    }

    if(this.context.hasChildLayout()){
      return this.context.yieldChildLayout();
    }

    // read next token
    var token = this.context.stream.get();
    if(token === null){
      return null;
    }

    //console.log("inline token:%o", token);

    // text block
    if(token instanceof Nehan.Text){
      if(token.getContent() === ""){
	return this._getNext(); // skip
      }
      if(!this.context.isInsidePreBlock() && token.isWhiteSpaceOnly()){
	return this._getNext();
      }
      return this.context.createChildTextGenerator(token).yield();
    }

    // tcy, word
    if(token instanceof Nehan.Tcy || token instanceof Nehan.Word){
      return this.context.createChildTextGeneratorFromStream(
	new Nehan.TokenStream({tokens:[token]})
      ).yield();
    }

    // child inline without stream.
    switch(token.getName()){
    case "br":
      this.context.layoutContext.setLineBreak(true);
      if(!this.context.style.isPre()){
	this.context.stream.iterWhile(function(token){
	  return (token instanceof Nehan.Text && token.isWhiteSpaceOnly());
	});
      }
      return null;

    case "wbr":
      // this.context.layoutContext.setInlineWordBreakable(true); // TODO
      return this._getNext();

    case "page-break": case "end-page":
      this.context.setPageBreak(true);
      return null;

    default:
      break;
    }

    // if not text, it's tag token, inherit style
    var child_style = this.context.createChildStyle(token);

    if(child_style.isDisabled()){
      //console.warn("disabled style:%o(%s)", child_style, child_style.getMarkupName());
      return this._getNext(); // just skip
    }

    // if block element, break inline level, output current inline block,
    // and force terminate generator.
    // this token is parsed again by parent block generator.
    if(child_style.isBlock()){
      this.context.stream.prev();
      this.context.setTerminate(true);
      this.context.layoutContext.setLineBreak(true);
      return null;
    }

    var child_gen = this.context.createChildInlineGenerator(child_style);
    return child_gen.yield();
  };

  return InlineGenerator;
})();


Nehan.InlineBlockGenerator = (function (){
  /**
   @memberof Nehan
   @class InlineBlockGenerator
   @classdesc generator of element with display:'inline-block'.
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function InlineBlockGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(InlineBlockGenerator, Nehan.BlockGenerator);

  // shurink measure by inline level.
  InlineBlockGenerator.prototype._onCreate = function(block){
    if(!block){
      return;
    }
    var max_inline = Nehan.List.maxobj(block.elements, function(element){
      return element.getContentMeasure();
    });
    if(max_inline){
      block.size.setMeasure(this.context.style.flow, max_inline.getContentMeasure());
    }
  };

  return InlineBlockGenerator;
})();

Nehan.TextGenerator = (function(){
  /**
   @memberof Nehan
   @class TextGenerator
   @classdesc inline level generator, output inline level block.
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
   */
  function TextGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(TextGenerator, Nehan.LayoutGenerator);

  TextGenerator.prototype._yield = function(){
    var element;
    while(this.hasNext()){
      element = this._getNext();
      var result = this.context.addTextElement(element);
      if(result === Nehan.Results.OK || result === Nehan.Results.SKIP){
	continue;
      }
      if(result === Nehan.Results.EOF ||
	 result === Nehan.Results.ZERO ||
	 result === Nehan.Results.TOO_MANY_ROLLBACK ||
	 result === Nehan.Results.OVERFLOW){
	break;
      }
      console.error(result);
      throw result;
    }
    return this._createOutput(element);
  };

  TextGenerator.prototype._createOutput = function(last_element){
    if(this.context.layoutContext.isInlineEmpty()){
      //console.warn("empty text block");
      return null;
    }
    if(this.context.isHyphenateEnable(last_element)){
      this.context.hyphenate(last_element);
    }
    return this.context.createTextBox();
  };

  TextGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      var cache = this._popCache();
      return cache;
    }

    // read next token
    var token = this.context.stream.get();
    if(token === null){
      return null;
    }

    // if white-space
    if(Nehan.Token.isWhiteSpace(token)){
      return this._getWhiteSpace(token);
    }

    return this._getText(token);
  };

  TextGenerator.prototype._getWhiteSpace = function(token){
    if(this.context.style.isPre()){
      return this._getWhiteSpacePre(token);
    }
    // skip continuous white-spaces.
    this.context.stream.iterWhile(Nehan.Token.isWhiteSpace);

    // first new-line and tab are treated as single half space.
    if(token.isNewLine() || token.isTabSpace()){
      Nehan.Char.call(token, {data:"\u0020"}); // update by space
    }
    // if white-space is not new-line, use first one.
    return this._getText(token);
  };

  TextGenerator.prototype._getWhiteSpacePre = function(token){
    if(Nehan.Token.isNewLine(token)){
      this.context.layoutContext.setLineBreak(true);
      return null;
    }
    return this._getText(token); // read as normal text
  };

  TextGenerator.prototype._getText = function(token){
    if(!token.hasMetrics()){
      this._setTextMetrics(token);
    }
    if(token instanceof Nehan.Char || token instanceof Nehan.Tcy || token instanceof Nehan.Ruby){
      return token;
    }
    if(token instanceof Nehan.Word){
      return this._getWord(token);
    }
    console.error("Nehan::TextGenerator, undefined token:", token);
    throw "Nehan::TextGenerator, undefined token";
  };

  TextGenerator.prototype._setTextMetrics = function(token){
    // if charactor token, set kerning before setting metrics.
    // because some additional space is added if kerning is enabled or not.
    if(Nehan.Config.kerning){
      if(token instanceof Nehan.Char && token.isKerningChar()){
	this._setTextSpacing(token);
      } else if(token instanceof Nehan.Word){
	this._setTextSpacing(token);
      }
    }
    token.setMetrics(this.context.style.flow, this.context.style.getFont());
  };

  TextGenerator.prototype._setTextSpacing = function(token){
    var next_token = this.context.stream.peek();
    var prev_text = this.context.layoutContext.getInlineLastElement();
    var next_text = next_token && Nehan.Token.isText(next_token)? next_token : null;
    Nehan.Spacing.add(token, prev_text, next_text);
  };

  TextGenerator.prototype._getWord = function(token){
    var rest_measure = this.context.layoutContext.getInlineRestMeasure();
    var advance = token.getAdvance(this.context.style.flow, this.context.style.letterSpacing || 0);
    
    // if there is enough space for this word, just return.
    if(advance <= rest_measure){
      token.setDivided(false);
      return token;
    }
    // at this point, this word is larger than rest space.
    // but if this word size is less than max_measure and 'word-berak' is not 'break-all',
    // just break line and show it at the head of next line.
    if(advance <= this.context.layoutContext.getInlineMaxMeasure() && !this.context.style.isWordBreakAll()){
      return token; // overflow and cached
    }
    // at this point, situations are
    // 1. advance is larger than rest_measure and 'word-break' is set to 'break-all'.
    // 2. or word itself is larger than max_measure.
    // in these case, we must cut this word into some parts.
    var part = token.cutMeasure(this.context.style.flow, this.context.style.getFont(), rest_measure); // get sliced word
    if(!token.isDivided()){
      return token;
    }
    if(token.data !== "" && token.bodySize > 0){
      this.context.stream.prev(); // re-parse this token because rest part is still exists.
    }
    part.bodySize = Math.min(rest_measure, part.bodySize); // sometimes overflows. more accurate logic is required in the future.
    return part;
  };

  TextGenerator.prototype._getMeasure = function(element){
    return element.getAdvance(this.context.style.flow, this.context.style.letterSpacing || 0);
  };

  return TextGenerator;
})();


Nehan.LinkGenerator = (function(){
  /**
   @memberof Nehan
   @class LinkGenerator
   @classdesc generator of &lt;a&gt; tag, set anchor context to {@link Nehan.DocumentContext} if exists.
   @constructor
   @extends {Nehan.InlineGenerator}
   @param context {Nehan.RenderingContext}
   */
  function LinkGenerator(context){
    Nehan.InlineGenerator.call(this, context);
  }
  Nehan.Class.extend(LinkGenerator, Nehan.InlineGenerator);

  LinkGenerator.prototype._onComplete = function(element){
    this.context.addAnchor(); 
  };

  return LinkGenerator;
})();


Nehan.FirstLineGenerator = (function(){
  /**
   @memberof Nehan
   @class FirstLineGenerator
   @constructor
   @extends {Nehan.InlineGenerator}
   @param context {Nehan.RenderingContext}
  */
  function FirstLineGenerator(context){
    Nehan.InlineGenerator.call(this, context);
  }
  Nehan.Class.extend(FirstLineGenerator, Nehan.InlineGenerator);

  FirstLineGenerator.prototype._onCreate = function(element){
    // now first-line is yieled, switch new style
    if(this.context.isFirstOutput()){
      var parent = this.context.parent;
      var old_child = this.context.child;
      var new_inline_root = parent.createChildInlineGenerator(parent.style, this.context.stream).context;
      new_inline_root.child = old_child;
      old_child.updateInlineParent(new_inline_root);
    }
  };

  return FirstLineGenerator;
})();


Nehan.LazyGenerator = (function(){
  /**
   @memberof Nehan
   @class LazyGenerator
   @classdesc lazy generator holds pre-yielded output in construction, and yields it once.
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
   */
  function LazyGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(LazyGenerator, Nehan.LayoutGenerator);

  /**
     @memberof Nehan.LazyGenerator
     @method hasNext
     @override
     @return {boolean}
  */
  LazyGenerator.prototype.hasNext = function(){
    return this.context.terminate !== true;
  };

  /**
     @memberof Nehan.LazyGenerator
     @method yield
     @override
     @return {Nehan.Box}
  */
  LazyGenerator.prototype._yield = function(){
    if(this.context.terminate){
      return null;
    }
    if(this.context.isBreakBefore()){
      return null;
    }
    this.context.setTerminate(true);
    if(this.context.isBreakAfter()){
      this.context.lazyOutput.breakAfter = true;
    }
    return this.context.lazyOutput;
  };

  return LazyGenerator;
})();

/*
 if <body>[float1][float2][other elements]</body>
 style of this generator is 'body.context.style'.
 */
Nehan.FloatGenerator = (function(){
  /**
     @memberof Nehan
     @class FloatGenerator
     @classdesc generator of float layout
     @constructor
     @param context {Nehan.RenderingContext}
  */
  function FloatGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }

  // float generator itself is only mediator for float-targets and float-spaces,
  // and it has no original edge or box level.
  // so we extends not block-geneartor but layout-generator.
  Nehan.Class.extend(FloatGenerator, Nehan.LayoutGenerator);

  // before: [root] -> [space] -> [child]
  //  after: [root] -> [child]
  FloatGenerator.prototype._updateChildParent = function(){
    if(this.context.hasNextFloat()){
      return;
    }
    //console.info("FloatGenerator::_updateChildParent");
    if(this.context.child.hasCache()){
      //console.log("inherit child cache:", this.context.child.peekLastCache());
      this.context.parent.pushCache(this.context.child.popCache());
    }
    if(this.context.child.child){
      this.context.child.child.updateParent(this.context.parent);
    }
  };

  FloatGenerator.prototype._yield = function(){
    //console.log("FloatGen::_yield");
    if(this.context.hasCache()){
      //console.log("FloatGen, use cache");
      return this._popCache();
    }
    var stack = this.context.yieldFloatStack();

    // If stack is empty but there are still active float elements, it's overflow.
    if(stack.isEmpty() && this.context.hasNextFloat()){
      //console.warn("float-target is empty, but has next, so retry in next page");
      return this.context.yieldPageBreak();
    }

    var stack_extent = stack.getExtent();
    var rest_measure = this.context.layoutContext.getInlineRestMeasure();
    if(stack_extent > this.context.getContextMaxExtent()){
      //console.warn("float stack can't be included in parent layout! -> break-after");
      this.context.pushFloatStackCache(stack);
      return this.context.yieldPageBreak();
    }

    return this._yieldFloat(stack, rest_measure, stack_extent);
  };

  // note that final form of this function is always finished by iniline wrap set.
  FloatGenerator.prototype._yieldFloat = function(stack, rest_measure, stack_extent){
    //console.log("_yieldFloat(rest_m:%d, rest_e:%d)", rest_measure, stack_extent);

    // no more rest space
    if(rest_measure <= 0 || stack_extent <= 0){
      //console.warn("no more rest space:(m=%d, e=%d)", rest_measure, stack_extent);
      this._updateChildParent();
      //console.warn("return null");
      return null;
    }

    // no more floated layout, just yield rest area.
    if(stack.isEmpty()){
      //console.warn("no more floating elements");
      return this.context.yieldFloatSpace(stack.getLastGroup(), rest_measure, stack_extent);
    }
    /*
      <------ rest_measure ---->
      --------------------------
      |       |                |
      | group | rest           | => group_set(inline wrap set)
      |       |                |
      --------------------------
    */
    var flow = this.context.style.flow;
    var prev_group = stack.getLastGroup();
    var group = stack.pop(flow); // pop float group(notice that this stack is ordered by extent asc, so largest one is first obtained).
    var rest = this._yieldFloat(stack, rest_measure - group.getMeasure(flow), group.getExtent(flow)); // yield rest area of this group in inline-flow(recursive).
    var group_set = this._wrapInlineSet(group, rest, rest_measure); // wrap these 2 floated layout as one block.

    /*
      To understand rest_extent_space, remember that this func is called recursivelly,
      and argument 'stack_extent' is generated by 'previous' largest float group(g2).
      
      <--- rest_measure --->
      ----------------------------
      |    |                |    |
      | g1 | rest           | g2 |
      |    |                |    |
      ----------------------|    |
      |  rest_extent_space  |    |
      ----------------------------
    */
    var rest_extent_space = stack_extent - group.getExtent(flow);

    // if no more rest extent is left,
    // continuous layout is displayed in parent context.
    if(rest_extent_space <= 0){
      //console.warn("no more rest extent, group set:%o", group_set);
      this._updateChildParent();
      return group_set;
    }

    //console.log("rest extent space:%d", rest_extent_space);

    /*
      <------ rest_measure ---->
      --------------------------
      |       |                |
      | group | rest           | => group_set(inline wrap set)
      |       |                |
      --------------------------
      |  rest_extent_space     | => stack_extent - group_set.extent
      --------------------------
    */
    // if there is space in block direction, yield rest space and wrap them([inline wrap set, rest_extent_space]).
    var space = this.context.yieldFloatSpace(prev_group, rest_measure, rest_extent_space);
    return this._wrapBlockSet([group_set, space]);
  };

  FloatGenerator.prototype._sortFloatRest = function(floated, rest){
    var floated_elements = floated.getElements();
    var elements = floated.isFloatStart()? floated_elements.concat(rest) : [rest].concat(floated_elements);
    return elements.filter(function(element){
      return element !== null;
    });
  };

  // wrap.measure = e1.measure + e2.measure
  // wrap.extent = max(e1.extent, e2.extent)
  // [wrap][e1][e2][/wrap]
  FloatGenerator.prototype._wrapInlineSet = function(floated, rest, measure){
    var flow = this.context.style.flow;
    var elements = this._sortFloatRest(floated, rest || null);
    var extent = (elements.length > 0)? floated.getExtent(flow) : 0;
    var box = this.context.yieldWrapBlock(measure, extent, elements);
    // break after is available only while floated targets are alive.
    box.breakAfter = this.context.hasNextFloat();
    //console.warn("wrap inline set:", box);
    return box;
  };

  // wrap.measure = e1.measure = e2.measure
  // wrap.extent = e1.extent + e2.extent
  // [wrap]
  // [ e1 ]
  // [ e2 ]
  // [/wrap]
  FloatGenerator.prototype._wrapBlockSet = function(blocks){
    var flow = this.context.style.flow;
    var elements = blocks.filter(function(block){ return block !== null; });
    var measure = elements[0].getLayoutMeasure(flow); // block1 and block2 has same measure
    var extent = Nehan.List.sum(elements, 0, function(element){ return element.getLayoutExtent(flow); });
    var box = this.context.yieldWrapBlock(measure, extent, elements);
    //console.warn("wrap block set:", box);
    return box;
  };

  return FloatGenerator;
})();


Nehan.ParallelGenerator = (function(){
  /**
   @memberof Nehan
   @class ParallelGenerator
   @classdesc wrapper generator to generate multicolumn layout like LI(list-mark,list-body) or TR(child TD).
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ParallelGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(ParallelGenerator, Nehan.BlockGenerator);

  ParallelGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);
    context.setParallelGenerators(this._createChildGenerators(context));
    context.stream = null;
  };

  ParallelGenerator.prototype._createChildGenerators = function(context){
    throw "_createChildGenerators is not defined.";
  };

  ParallelGenerator.prototype._popCache = function(){
    var cache = this.context.popCache();
    if(cache && cache.elements){
      cache.elements.forEach(function(element){
	element.breakAfter = false;
      });
    }
    return cache;
  };

  ParallelGenerator.prototype._onElement = function(element){
    element.breakAfter = Nehan.List.exists(element.elements, function(block){
      return block && block.breakAfter;
    }) && this.hasNext();
  };

  ParallelGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this._popCache();
    }
    return this.context.yieldParallelBlocks() || null;
  };

  return ParallelGenerator;
})();



Nehan.SectionRootGenerator = (function(){
  /**
   @memberof Nehan
   @class SectionRootGenerator
   @classdesc generator of sectionning root tag (body, fieldset, figure, blockquote etc).
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function SectionRootGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(SectionRootGenerator, Nehan.BlockGenerator);

  SectionRootGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);
    context.startOutlineContext(); // create new section root
  };

  SectionRootGenerator.prototype._onComplete = function(block){
    this.context.endOutlineContext();
  };

  return SectionRootGenerator;
})();

Nehan.SectionContentGenerator = (function(){
  /**
   @memberof Nehan
   @class SectionContentGenerator
   @classdesc generator of sectionning content tag (section, article, nav, aside).
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function SectionContentGenerator(context){
    Nehan.BlockGenerator.call(this, context);
    this.context.startSectionContext();
  }
  Nehan.Class.extend(SectionContentGenerator, Nehan.BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(block){
    this.context.endSectionContext();
  };

  return SectionContentGenerator;
})();


Nehan.ParagraphGenerator = (function(){
  /**
   @memberof Nehan
   @class ParagraphGenerator
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ParagraphGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(ParagraphGenerator, Nehan.BlockGenerator);

  ParagraphGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);
    context.initParagraphContext();
  };

  return ParagraphGenerator;
})();

Nehan.ListGenerator = (function(){
  /**
   @memberof Nehan
   @class ListGenerator
   @classdesc generator of &lt;ul&gt;, &lt;ol&gt; tag. need to count child item if list-style is set to numeral property like 'decimal'.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function ListGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(ListGenerator, Nehan.BlockGenerator);

  ListGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);
    context.initListContext(); // context.listContext is available.
  };

  return ListGenerator;
})();

Nehan.OutsideListItemGenerator = (function(){
  /**
   @memberof Nehan
   @class OutsideListItemGenerator
   @classdesc list-item with list-style-position:outside.
   @constructor
   @extends {Nehan.ParallelGenerator}
   @param context {Nehan.RenderingContext}
  */
  function OutsideListItemGenerator(context){
    Nehan.ParallelGenerator.call(this, context);
  }
  Nehan.Class.extend(OutsideListItemGenerator, Nehan.ParallelGenerator);

  OutsideListItemGenerator.prototype._createChildGenerators = function(context){
    var list_context = context.getListContext() || {
      itemCount:0,
      indentSize:context.style.getFontSize(),
      bodySize:context.layoutContext.getInlineMaxMeasure() - context.style.getFontSize()
    };
    var list_index = context.style.getChildIndex();

    // <li><li-marker>..</li-marker><li-body>...</li-body>
    return [
      this._createListMarkerGenerator(context, list_context, list_index),
      this._createListBodyGenerator(context, list_context)
    ];
  };

  OutsideListItemGenerator.prototype._onElement = function(box){
    Nehan.ParallelGenerator.prototype._onElement.call(this, box);
    //console.log("OutsideListItemGenerator::_onElement:%o(%s)", box, box.toString());
    var blocks = box.elements || [];
    var list_body = blocks[1];
    // if list body is empty, disable box.
    if(list_body && list_body.isVoid()){
      //console.warn("OutsideListItemGenerator::_onElement, invalid list body disabled");
      box.elements = [];
      box.resizeExtent(this.context.style.flow, 0);
    }
  };

  OutsideListItemGenerator.prototype._createListMarkerGenerator = function(context, list_context, list_index){
    var content = context.parent.style.getListMarkerHtml(list_index + 1);
    //console.log("marker html:%s", content);
    var marker_markup = new Nehan.Tag("::marker", content);
    var marker_style = context.createChildStyle(marker_markup, {
      float:"start",
      measure:list_context.indentSize
    });
    var marker_context = context.createChildContext(marker_style);
    //console.log("OutsideListItemGenerator::marker context:%o", marker_context);
    return new Nehan.BlockGenerator(marker_context);
  };

  OutsideListItemGenerator.prototype._createListBodyGenerator = function(context, list_context){
    var body_markup = new Nehan.Tag("li-body");
    var body_style = context.createChildStyle(body_markup, {
      display:"block",
      float:"start",
      measure:list_context.bodySize
    });
    var body_context =  context.createChildContext(body_style, {
      stream:context.stream // share li.stream for li-body.stream.
    });
    //console.log("li-body context:%o", body_context);
    return new Nehan.BlockGenerator(body_context);
  };

  return OutsideListItemGenerator;
})();

Nehan.InsideListItemGenerator = (function(){
  /**
   @memberof Nehan
   @class InsideListItemGenerator
   @classdesc list-item with list-style-position:inside.
   @constructor
   @extends {Nehan.ParallelGenerator}
   @param context {Nehan.RenderingContext}
  */
  function InsideListItemGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(InsideListItemGenerator, Nehan.BlockGenerator);

  InsideListItemGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);

    var child_index = context.style.getChildIndex();
    var marker_html = context.style.getListMarkerHtml(child_index + 1) + "&nbsp;";
    var marker_stream = new Nehan.TokenStream({
      lexer:context.createHtmlLexer(marker_html)
    });
    context.stream.tokens = marker_stream.getTokens().concat(context.stream.getTokens());
  };

  return InsideListItemGenerator;
})();
  

/*
  type partion_set = (col_count, partition) HashSet.t
  and col_count = int
  and partition = [partition_unit]
  and partition_unit = PartitionUnit(size, is_important)
  and size = int
  and is_important = bool
*/

// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
Nehan.TableGenerator = (function(){
  /**
   @memberof Nehan
   @class TableGenerator
   @classdesc generator of table tag content.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
  */
  function TableGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(TableGenerator, Nehan.BlockGenerator);

  TableGenerator.prototype._onInitialize = function(context){
    Nehan.BlockGenerator.prototype._onInitialize.call(this, context);

    // if table-layout is auto, need to calc partition before parsing.
    if(context.style.getCssAttr("table-layout") === "auto"){
      context.initTablePartition(context.stream); // context.tablePartition is generated.
    }
  };

  return TableGenerator;
})();


// parent : table | thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
Nehan.TableRowGenerator = (function(){
  /**
   @memberof Nehan
   @class TableRowGenerator
   @classdesc generator of table row(TR) content.
   @constructor
   @extends {Nehan.ParallelGenerator}
   @param context {Nehan.RenderingContext}
  */
  function TableRowGenerator(context){
    Nehan.ParallelGenerator.call(this, context);
  }
  Nehan.Class.extend(TableRowGenerator, Nehan.ParallelGenerator);

  TableRowGenerator.prototype._createChildGenerators = function(context){
    var child_styles = this._getChildStyles(context);
    return child_styles.map(function(child_style){
      return context.createChildBlockGenerator(child_style);
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(context){
    var partition = context.getTablePartition();
    var stream = context.stream;
    var child_tags = stream.getTokens();
    var rest_measure = context.style.contentMeasure;
    var part_sizes = partition? partition.getSizes({
      partitionCount:child_tags.length,
      measure:context.style.contentMeasure
    }) : [];
    return child_tags.map(function(cell_tag, i){
      var default_style = context.createChildStyle(cell_tag);
      var static_measure = default_style.staticMeasure;
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_tags.length - i));
      if(part_sizes.length > 0){
	measure = part_sizes[i];
      }
      rest_measure -= measure;
      default_style.floatDirection = Nehan.FloatDirections.get("start");
      default_style.initContextMeasure(measure);
      return default_style;
    });
  };

  TableRowGenerator.prototype._getChildTags = function(stream){
    return stream.getTokens().filter(Nehan.Closure.isTagName(["td", "th"]));
  };

  return TableRowGenerator;
})();

Nehan.TableCellGenerator = (function(){
  /**
   @memberof Nehan
   @class TableCellGenerator
   @classdesc generator of table-cell(td, th) content.
   @constructor
   @extends {Nehan.SectionRootGenerator}
   @param context {Nehan.RenderingContext}
  */
  function TableCellGenerator(context){
    Nehan.SectionRootGenerator.call(this, context);
  }
  Nehan.Class.extend(TableCellGenerator, Nehan.SectionRootGenerator);

  return TableCellGenerator;
})();


Nehan.HeaderGenerator = (function(){
  /**
   @memberof Nehan
   @class HeaderGenerator
   @classdesc generator of header tag(h1 - h6) conetnt, and create header context when complete.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
   */
  function HeaderGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(HeaderGenerator, Nehan.BlockGenerator);

  HeaderGenerator.prototype._onComplete = function(block){
    var header_id = this.context.startHeaderContext();
    block.id = Nehan.Css.addNehanHeaderPrefix(header_id);
  };
  
  return HeaderGenerator;
})();


Nehan.BodyGenerator = (function(){
  /**
   @memberof Nehan
   @class BodyGenerator
   @classdesc generator of &lt;body&gt; element
   @extends Nehan.SectionRootGenerator
   @constructor
   @param context {Nehan.RenderingContext}
   */
  function BodyGenerator(context){
    Nehan.SectionRootGenerator.call(this, context);
  }
  Nehan.Class.extend(BodyGenerator, Nehan.SectionRootGenerator);

  BodyGenerator.prototype._onInitialize = function(context){
    var markup = new Nehan.Tag("body", context.text);
    if(!context.style){
      context.style = context.createStyle(markup, null);
    }
    if(!context.stream){
      context.stream = new Nehan.TokenStream({
	lexer:context.createHtmlLexer(context.text)
      });
    }
    Nehan.SectionRootGenerator.prototype._onInitialize.call(this, context);
  };

  BodyGenerator.prototype._createOutput = function(){
    var block = Nehan.BlockGenerator.prototype._createOutput.call(this);
    if(!block || block.isInvalidSize()){
      return null; // skip invalid block
    }
    block.seekPos = this.context.stream.getSeekPos();
    block.charPos = this.context.documentContext.getCharPos();
    block.percent = this.context.stream.getSeekPercent();
    block.pageNo = this.context.documentContext.getPageNo();

    this.context.documentContext.stepCharPos(block.charCount || 0);

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(this.context.documentContext.getPageNo() >= Nehan.Config.maxPageCount){
      this.context.setTerminate(true);
    }

    // body output is treated as page box.
    this.context.addPage(block);
    return block;
  };

  return BodyGenerator;
})();

Nehan.HtmlGenerator = (function(){
  /**
   @memberof Nehan
   @class HtmlGenerator
   @classdesc generator of &lt;html&gt; tag content.
   @constructor
   @param context {Nehan.RenderingContext}
  */
  function HtmlGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(HtmlGenerator, Nehan.LayoutGenerator);

  HtmlGenerator.prototype._yield = function(){
    return this.context.yieldChildLayout();
  };

  HtmlGenerator.prototype._onInitialize = function(context){
    if(!context.stream){
      context.stream = context.createHtmlStream(context.text);
    }
    context.documentContext.documentLang = context.getLang();
    var body_tag = null;
    while(context.stream.hasNext()){
      var tag = context.stream.get();
      switch(tag.getName()){
      case "head":
	this._parseDocumentHeader(context, new Nehan.TokenStream({
	  filter:Nehan.Closure.isTagName(["title", "meta", "link", "style", "script"]),
	  lexer:context.createHtmlLexer(tag.getContent())
	}));
	break;
      case "body":
	body_tag = tag;
	break;
      }
    }
    body_tag = body_tag || new Nehan.Tag("body", context.stream.getSrc());
    var body_style = context.createChildStyle(body_tag);
    var body_context = context.createChildContext(body_style);
    new Nehan.BodyGenerator(body_context);
  };

  HtmlGenerator.prototype._parseDocumentHeader = function(context, stream){
    var document_header = new Nehan.DocumentHeader();
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
    context.documentContext.setDocumentHeader(document_header);
  };

  return HtmlGenerator;
})();


Nehan.DocumentGenerator = (function(){
  /**
   @memberof Nehan
   @class DocumentGenerator
   @classdesc generator of formal html content including &lt;!doctype&gt; tag.
   @constructor
   @param text {String} - html source text
   @param context {Nehan.RenderingContext}
  */
  function DocumentGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(DocumentGenerator, Nehan.LayoutGenerator);

  DocumentGenerator.prototype._yield = function(){
    return this.context.yieldChildLayout();
  };

  DocumentGenerator.prototype._onInitialize = function(context){
    context.stream = context.createDocumentStream(context.text);

    var html_tag = null;
    while(context.stream.hasNext()){
      var tag = context.stream.get();
      switch(tag.getName()){
      case "!doctype":
	// var doc_type = tag.getSrc().split(/\s+/)[1];
	context.documentContext.setDocumentType("html"); // TODO
	break;
      case "html":
	html_tag = tag;
	break;
      }
    }
    html_tag = html_tag || new Nehan.Tag("html", context.stream.getSrc());
    var html_style = context.createChildStyle(html_tag);
    var html_context = context.createChildContext(html_style, {
      stream:context.createHtmlStream(html_tag.getContent())
    });
    new Nehan.HtmlGenerator(html_context);
  };

  return DocumentGenerator;
})();


Nehan.LayoutEvaluator = (function(){
  /**
     @memberof Nehan
     @class LayoutEvaluator
     @classdesc evaluate {@link Nehan.Box}, and output DOMElement.
     @constructor
     @param direction {String} - "hori" or "vert"
  */
  function LayoutEvaluator(context, direction){
    this.context = context;
    this.direction = direction;
  }

  /**
   @memberof Nehan.LayoutEvaluator
   @param tree {Nehan.Box}
   @return {DOMElement}
   */
  LayoutEvaluator.prototype.evaluate = function(tree){
    return this._getEvaluator(tree)._evaluate(tree);
  };

  LayoutEvaluator.prototype._getEvaluator = function(tree){
    var is_vert = tree.context.style.isTextVertical();
    if(this.direction === "vert" && !is_vert){
      return new Nehan.HoriEvaluator(this.context);
    }
    if(this.direction === "hori" && is_vert){
      return new Nehan.VertEvaluator(this.context);
    }
    return this;
  };

  LayoutEvaluator.prototype._createElement = function(name, opt){
    opt = opt || {};
    var css = opt.css || {};
    var attrs = opt.attrs? ((opt.attrs instanceof Nehan.TagAttrs)? opt.attrs.attrs : opt.attrs) : {};
    var dataset = opt.attrs? opt.attrs.dataset : {};
    var dom = document.createElement(name);
    if(opt.className){
      dom.className = opt.className;
    }
    if(opt.content){
      dom.innerHTML = opt.content;
    }
    if(typeof opt.blockId !== "undefined"){
      dataset["blockId"] = opt.blockId;
    }
    if(typeof opt.paragraphId !== "undefined"){
      dataset["paragraphId"] = opt.paragraphId;
    }

    // store css value to dom.style[<camelized-css-property>]
    Nehan.Obj.iter(css, function(prop, value){
      try {
	dom.style[Nehan.Utils.camelize(prop)] = value;
      } catch(error){
	console.warn("try to set %s:%o, but failed:%o", prop, value, error);
      }
    });

    // notice that class(className in style object) is given by variable "Box::classes".
    // why? because
    // 1. markup of anonymous line is shared by parent block, but both are given different class names.
    // 2. sometimes we add some special class name like "nehan-div", "nehan-body", "nehan-p"... etc.
    Nehan.Obj.iter(attrs, function(attr_name, value){ // pure attributes(without dataset defined in TagAttrs::attrs)
      // "style" is readonly and "class" is already set by opt.className.
      if(attr_name === "id"){
	dom[attr_name] = Nehan.Css.addNehanPrefix(value);
      } else if(attr_name !== "style" && attr_name !== "class"){
	try {
	  dom[attr_name] = value;
	} catch(e){
	  console.error("try to set %o to %s but failed.", value, attr_name);
	}
      }
    });

    // dataset attributes(defined in TagAttrs::dataset)
    Nehan.Obj.copy(dom.dataset, dataset);
    return dom;
  };

  LayoutEvaluator.prototype._createClearFix = function(clear){
    var div = document.createElement("div");
    div.style.clear = clear || "both";
    return div;
  };

  LayoutEvaluator.prototype._appendChild = function(root, child){
    if(child instanceof Array){
      Nehan.List.iter(child, function(child){
	this._appendChild(root, child);
      }.bind(this));
    } else {
      root.appendChild(child);
    }
  };

  LayoutEvaluator.prototype._evaluate = function(tree, opt){
    var root = this._evalElementRoot(tree, opt || {});
    var dom = root.innerHTML? root : tree.elements.reduce(function(root, child){
      if(child._type === "void"){
	return root; // do nothing
      }
      this._appendChild(root, this._evalElementChild(tree, child));
      if(child.withBr){ // annotated to add extra br element
	this._appendChild(root, document.createElement("br"));
      }
      if(child.withClearFix){ // annotated to add extra clear fix element
	this._appendChild(root, this._createClearFix());
      }
      return root;
    }.bind(this), root);
    var hook = tree.getDomHook();
    if(hook){
      hook(new Nehan.DomCreateContext(dom, tree));
    }
    return dom;
  };

  LayoutEvaluator.prototype._evalElementRoot = function(tree, opt){
    opt = opt || {};
    return this._createElement(opt.name || "div", {
      className:tree.getDomClassName(),
      attrs:tree.getAttrs(),
      content:(opt.content || tree.getContent()),
      blockId:tree.blockId,
      paragraphId:tree.paragraphId,
      css:(opt.css || tree.getBoxCss())
    });
  };

  LayoutEvaluator.prototype._evalElementChild = function(parent, child){
    switch(parent.display){
    case "inline":
      if(child instanceof Nehan.Box){
	return this._evalInlineChildElement(parent, child);
      }
      return this._evalInlineChildText(parent, child);
    default:
      return this._evalBlockChildElement(parent, child);
    }
  };

  LayoutEvaluator.prototype._evalBlockChildElement = function(parent, element){
    switch(element.context.style.getMarkupName()){
    case "img":
      return this._evalImage(element);
    case "a":
      return this._evalLink(parent, element);
    default:
      return this.evaluate(element);
    }
  };

  LayoutEvaluator.prototype._evalInlineChildElement = function(parent, element){
    switch(element.context.style.getMarkupName()){
    case "img":
      return this._evalInlineImage(parent, element);
    case "a":
      return this._evalLink(parent, element);
    default:
      return this._evalInlineChildTree(parent, element);
    }
  };

  // override by HoriEvaluator
  LayoutEvaluator.prototype._evalInlineChildTree = function(parent, element){
    return this._evaluate(element);
  };

  LayoutEvaluator.prototype._evalInlineChildText = function(parent, element){
    if(parent.context.style.isTextEmphaEnable() && Nehan.Token.isEmphaTargetable(element)){
      return this._evalEmpha(parent, element);
    }
    return this._evalTextElement(parent, element);
  };

  LayoutEvaluator.prototype._evalImage = function(image){
    return this._evaluate(image, {name:"img"});
  };

  LayoutEvaluator.prototype._evalInlineImage = function(line, image){
    return this._evalImage(image);
  };

  // if link uri has anchor address, add page-no to dataset where the anchor is defined.
  LayoutEvaluator.prototype._evalLink = function(line, link){
    var uri = new Nehan.Uri(link.context.style.getMarkupAttr("href"));
    var anchor_name = uri.getAnchorName();
    if(anchor_name){
      link.classes.push("nehan-anchor-link");
      var page_no = this.context.getAnchorPageNo(anchor_name);
      if(page_no){
	link.context.style.markup.setAttr("data-page", page_no);
      }
    }
    return this._evalLinkElement(line, link);
  };

  LayoutEvaluator.prototype._evalTextElement = function(line, text){
    if(text instanceof Nehan.Char){
      return this._evalChar(line, text);
    }
    if(text instanceof Nehan.Word){
      return this._evalWord(line, text);
    }
    if(text instanceof Nehan.Tcy){
      return this._evalTcy(line, text);
    }
    if(text instanceof Nehan.Ruby){
      return this._evalRuby(line, text);
    }
    console.error("invalid text element:%o", text);
    throw "invalid text element"; 
  };

  return LayoutEvaluator;
})();


Nehan.VertEvaluator = (function(){
  /**
     @memberof Nehan
     @class VertEvaluator
     @classdesc evaluate {@link Nehan.Box} as vertical layout, and output DOMElement.
     @constructor
     @extends {Nehan.LayoutEvaluator}
  */
  function VertEvaluator(context){
    Nehan.LayoutEvaluator.call(this, context, "vert");
  }
  Nehan.Class.extend(VertEvaluator, Nehan.LayoutEvaluator);

  VertEvaluator.prototype._evalLinkElement = function(line, link){
    return this._evaluate(link, {
      name:(link.isTextBlock()? "div" : "a")
    });
  };

  VertEvaluator.prototype._evalRuby = function(line, ruby){
    return [
      this._evalRb(line, ruby),
      this._evalRt(line, ruby)
    ];
  };

  VertEvaluator.prototype._evalRb = function(line, ruby){
    var rb_style = line.context.createChildStyle(new Nehan.Tag("rb"));
    var rb_context = line.context.createChildContext(rb_style);
    var rb_line = rb_context.createLineBox({
      elements:ruby.getRbs()
    });
    return this._evaluate(rb_line, {
      css:ruby.getCssVertRb(line)
    });
  };

  VertEvaluator.prototype._evalRt = function(line, ruby){
    var rt_style = line.context.createChildStyle(ruby.rt);
    var rt_context = line.context.createChildContext(rt_style);
    var rt_generator = new Nehan.InlineGenerator(rt_context);
    var rt_line = rt_generator.yield();
    Nehan.Obj.copy(rt_line.css, ruby.getCssVertRt(line));
    return this._evaluate(rt_line);
  };

  VertEvaluator.prototype._evalWord = function(line, word){
    if(Nehan.Env.isTransformEnable){
      if(Nehan.Env.client.isTrident()){
	return this._evalWordTransformTrident(line, word);
      }
      return this._evalWordTransform(line, word);
    } else if(Nehan.Env.client.isIE()){
      return this._evalWordIE(line, word);
    } else {
      return "";
    }
  };

  VertEvaluator.prototype._evalWordTransform = function(line, word){
    var div_wrap = this._createElement("div", {
      css:word.getCssVertTrans(line)
    });
    var div_word = this._createElement("div", {
      content:word.getData(line.getFlow()),
      className:"nehan-rotate-90",
      css:word.getCssVertTransBody(line)
    });
    div_wrap.appendChild(div_word);
    return div_wrap;
  };

  VertEvaluator.prototype._evalWordTransformTrident = function(line, word){
    var div_wrap = this._createElement("div", {
      css:word.getCssVertTrans(line)
    });
    var div_word = this._createElement("div", {
      content:word.getData(line.getFlow()),
      //className:"nehan-rotate-90",
      css:word.getCssVertTransBodyTrident(line)
    });
    div_wrap.appendChild(div_word);
    return div_wrap;
  };

  VertEvaluator.prototype._evalWordIE = function(line, word){
    return this._createElement("div", {
      content:word.getData(line.getFlow()),
      className:"nehan-vert-ie",
      css:word.getCssVertTransIE(line)
    }); // NOTE(or TODO):clearfix in older version after this code
  };

  VertEvaluator.prototype._evalRotateChar = function(line, chr){
    if(Nehan.Env.isTransformEnable){
      return this._evalRotateCharTransform(line, chr);
    } else if(Nehan.Env.client.isIE()){
      return this._evalRotateCharIE(line, chr);
    } else {
      return this._evalCharWithBr(line, chr);
    }
  };

  VertEvaluator.prototype._evalRotateCharTransform = function(line, chr){
    var css = (Nehan.Env.client.isIE() && chr.isDash())? chr.getCssVertDashIE() : {};
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      className:"nehan-rotate-90",
      css:css
    });
  };

  VertEvaluator.prototype._evalRotateCharIE = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      className:"nehan-vert-ie",
      css:chr.getCssVertRotateCharIE(line)
    }); // NOTE(or TODO):clearfix in older version after this code
  };

  VertEvaluator.prototype._evalTcy = function(line, tcy){
    var classes = Nehan.Env.isTextCombineEnable? ["nehan-tcy", "nehan-text-combine-upright"] : ["nehan-tcy"];
    return this._createElement("div", {
      content:tcy.data,
      className:classes.join(" "),
      css:tcy.getCssVert(line)
    });
  };

  VertEvaluator.prototype._evalChar = function(line, chr){
    var is_vert_glyph_enable = Nehan.Config.useVerticalGlyphIfEnable && Nehan.Env.isVerticalGlyphEnable;
    if(chr.isVertChar()){
      if(is_vert_glyph_enable){
	return this._evalVerticalGlyph(line, chr);
      }
      return this._evalImgChar(line, chr);
    }
    if(chr.isSpaceGroup()){
      return this._evalSpace(line, chr);
    }
    if(chr.isTabSpace()){
      return this._evalTabChar(line, chr);
    }
    if(chr.isRotateChar()){
      if(is_vert_glyph_enable){
	return this._evalVerticalGlyph(line, chr);
      }
      return this._evalRotateChar(line, chr);
    }
    if(chr.isSmallKana()){
      return this._evalSmallKana(line, chr);
    }
    if(chr.isPaddingEnable()){
      return this._evalPaddingChar(line, chr);
    }
    if(line.letterSpacing){
      return this._evalCharLetterSpacing(line, chr);
    }
    if(chr.isSingleHalfChar()){
      return this._evalCharSingleHalfChar(line, chr);
    }
    if(chr.isHalfKana()){
      return this._evalCharHalfKana(line, chr);
    }
    if(chr.isPaddingEnable()){
      return this._evalCharWithSpacing(line, chr);
    }
    return this._evalCharWithBr(line, chr);
  };

  VertEvaluator.prototype._evalCharWithSpacing = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssPadding(line)
    });
  };

  // for example, if we use <div> instead, parent bg-color is not inherited.
  VertEvaluator.prototype._evalCharWithBr = function(line, chr){
    chr.withBr = true;
    return document.createTextNode(Nehan.Html.unescape(chr.getData(line.getFlow())));
  };

  VertEvaluator.prototype._evalCharLetterSpacing = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssVertLetterSpacing(line)
    });
  };

  VertEvaluator.prototype._evalCharSingleHalfChar = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssVertSingleHalfChar(line)
    });
  };

  VertEvaluator.prototype._evalCharHalfKana = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssVertHalfKana(line)
    });
  };

  VertEvaluator.prototype._evalEmpha = function(line, chr){
    var char_part = this._evalEmphaSrc(line, chr);
    var empha_part = this._evalEmphaText(line, chr);
    var wrap = this._createElement("div", {
      className:"nehan-empha-wrap",
      css:line.context.style.textEmpha.getCssVertEmphaWrap(line, chr)
    });
    wrap.appendChild(char_part);
    wrap.appendChild(empha_part);
    return wrap;
  };

  VertEvaluator.prototype._evalEmphaSrc = function(line, chr){
    return this._createElement("span", {
      content:chr.getData(line.getFlow()),
      className:"nehan-empha-src"
    });
  };

  VertEvaluator.prototype._evalEmphaText = function(line, chr){
    return this._createElement("span", {
      content:line.context.style.textEmpha.getText(),
      className:"nehan-empha-text",
      css:chr.getCssVertEmphaText(line)
    });
  };

  VertEvaluator.prototype._evalPaddingChar = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssPadding(line)
    });
  };

  VertEvaluator.prototype._evalImgChar = function(line, chr){
    var color = line.color || new Nehan.Color(Nehan.Config.defaultFontColor);
    var font_rgb = color.getRgb();
    var palette_color = Nehan.Palette.getColor(font_rgb).toUpperCase();
    return this._createElement("img", {
      className:"nehan-img-char",
      attrs:{
	src:chr.getImgSrc(palette_color)
      },
      css:chr.getCssVertImgChar(line)
    });
  };

  VertEvaluator.prototype._evalVerticalGlyph = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      className:"nehan-vert-glyph",
      css:chr.getCssVertGlyph(line)
    });
  };

  VertEvaluator.prototype._evalSmallKana = function(line, chr){
    var tag_name = (line.context.style.textEmpha && line.context.style.textEmpha.isEnable())? "span" : "div";
    return this._createElement(tag_name, {
      content:chr.getData(line.getFlow()),
      css:chr.getCssVertSmallKana()
    });
  };

  VertEvaluator.prototype._evalSpace = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      className:"nehan-space",
      css:chr.getCssVertSpaceChar(line)
    });
  };

  VertEvaluator.prototype._evalTabChar = function(line, chr){
    return this._createElement("div", {
      content:"&nbsp;",
      className:"nehan-tab",
      css:chr.getCssVertTabChar(line)
    });
  };

  return VertEvaluator;
})();


Nehan.HoriEvaluator = (function(){
  /**
     @memberof Nehan
     @class HoriEvaluator
     @classdesc evaluate {@link Nehan.Box} as horizontal layout, and output DOMElement.
     @constructor
     @extends {Nehan.LayoutEvaluator}
  */
  function HoriEvaluator(context){
    Nehan.LayoutEvaluator.call(this, context, "hori");
  }
  Nehan.Class.extend(HoriEvaluator, Nehan.LayoutEvaluator);

  HoriEvaluator.prototype._evalInlineChildTree = function(line, tree){
    return this._evaluate(tree, {
      name:"span"
    });
  };

  HoriEvaluator.prototype._evalLinkElement = function(line, link){
    return this._evaluate(link, {
      name:(link.isTextBlock()? "span" : "a")
    });
  };

  HoriEvaluator.prototype._evalInlineImage = function(line, image){
    return this._evaluate(image, {
      name:"img",
      css:image.getCssHoriInlineImage(line)
    });
  };

  HoriEvaluator.prototype._evalRuby = function(line, ruby){
    return [
      this._evalRt(line, ruby),
      this._evalRb(line, ruby)
    ];
  };

  HoriEvaluator.prototype._evalRb = function(line, ruby){
    var rb_style = line.context.createChildStyle(new Nehan.Tag("rb"));
    var rb_context = line.context.createChildContext(rb_style);
    var rb_line = rb_context.createLineBox({
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
      css:ruby.getCssHoriRt(line)
    });
  };

  HoriEvaluator.prototype._evalWord = function(line, word){
    return this._createElement("span", {
      content:word.getData(line.getFlow()),
      css:word.getCssHori(line)
    });
  };

  HoriEvaluator.prototype._evalTcy = function(line, tcy){
    return this._createElement("span", {
      css:tcy.getCssHori(line),
      content:tcy.data
    });
  };

  HoriEvaluator.prototype._evalChar = function(line, chr){
    if(chr.isSpaceGroup()){
      return this._evalSpace(line, chr);
    }
    if(chr.isTabSpace()){
      return this._evalTabChar(line, chr);
    }
    if(chr.isCharRef()){
      return document.createTextNode(Nehan.Html.unescape(chr.getData(line.getFlow())));
    }
    if(chr.isKerningChar()){
      return this._evalKerningChar(line, chr);
    }
    if(chr.isPaddingEnable()){
      return this._evalCharWithSpacing(line, chr);
    }
    var data = chr.getData(line.getFlow());
    if(data.charAt(0) === "&"){
      return document.createTextNode(Nehan.Html.unescape(data));
    }
    return document.createTextNode(chr.getData(line.getFlow()));
  };

  HoriEvaluator.prototype._evalCharWithSpacing = function(line, chr){
    return this._createElement("span", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssPadding(line)
    });
  };

  HoriEvaluator.prototype._evalEmpha = function(line, chr){
    var char_part = this._evalEmphaSrc(line, chr);
    var empha_part = this._evalEmphaText(line, chr);
    var wrap = this._createElement("span", {
      css:line.context.style.textEmpha.getCssHoriEmphaWrap(line, chr)
    });
    wrap.appendChild(empha_part);
    wrap.appendChild(char_part);
    return wrap;
  };

  HoriEvaluator.prototype._evalEmphaSrc = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(line.getFlow()),
      className:"nehan-empha-src",
      css:chr.getCssHoriEmphaSrc(line)
    });
  };

  HoriEvaluator.prototype._evalEmphaText = function(line, chr){
    return this._createElement("div", {
      content:line.context.style.textEmpha.getText(),
      className:"nehan-empha-text",
      css:chr.getCssHoriEmphaText(line)
    });
  };

  HoriEvaluator.prototype._evalKerningChar = function(line, chr){
    var css = chr.getCssPadding(line);
    if(chr.isKakkoStart()){
      css["margin-left"] = "-0.5em";
      return this._createElement("span", {
	content:chr.getData(line.getFlow()),
	className:"nehan-char-kakko-start",
	css:css
      });
    }
    if(chr.isKakkoEnd()){
      css["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.getData(line.getFlow()),
	className:"nehan-char-kakko-end",
	css:css
      });
    }
    if(chr.isKutenTouten()){
      css["margin-right"] = "-0.5em";
      return this._createElement("span", {
	content:chr.getData(line.getFlow()),
	className:"nehan-char-kuto",
	css:css
      });
    }
    return document.createTextNode(chr.getData(line.getFlow()));
  };

  HoriEvaluator.prototype._evalPaddingChar = function(line, chr){
    return this._createElement("span", {
      content:chr.getData(line.getFlow()),
      css:chr.getCssPadding(line)
    });
  };

  HoriEvaluator.prototype._evalSpace = function(line, chr){
    return this._createElement("span", {
      content:chr.getData(line.getFlow()),
      className:"nehan-space",
      css:chr.getCssHoriSpaceChar(line)
    });
  };

  HoriEvaluator.prototype._evalTabChar = function(line, chr){
    return this._createElement("span", {
      content:"&nbsp;",
      className:"nehan-tab",
      css:chr.getCssHoriTabChar(line)
    });
  };

  return HoriEvaluator;
})();


/**
 result codes for internal operation

 @namespace Nehan.Results
*/
Nehan.Results = {
  OK:"ok",
  SKIP:"skip",
  EOF:"eof",
  BREAK_AFTER:"break-after",
  ZERO:"zero",
  LINE_BREAK:"line-break",
  OVERFLOW:"overflow",
  TOO_MANY_ROLLBACK:"too many rollback"
};

// system internal context
// undocumented rendering context class
Nehan.RenderingContext = (function(){
  function RenderingContext(opt){
    opt = opt || {};
    this.yieldCount = 0;
    this.terminate = false;
    this.cachedElements = [];
    this.generator = opt.generator || null;
    this.parent = opt.parent || null;
    this.child = opt.child || null;
    this.style = opt.style || null;
    this.text = opt.text || "";
    this.stream = opt.stream || null;
    this.layoutContext = opt.layoutContext || null;
    this.selectors = opt.selectors || new Nehan.Selectors(Nehan.DefaultStyle.create());
    this.singleTagNames = opt.singleTagNames || new Nehan.LowerNameSet();
    this.documentContext = opt.documentContext || new Nehan.DocumentContext();
    this.pageEvaluator = opt.pageEvaluator || new Nehan.PageEvaluator(this);
  }

  // -----------------------------------------------
  // [add]
  // -----------------------------------------------
  RenderingContext.prototype.addPage = function(page){
    this.documentContext.addPage(page);
  };

  RenderingContext.prototype.addSingleTagName = function(name){
    this.singleTagNames.add(name);
  };

  RenderingContext.prototype.addSingleTagNames = function(names){
    this.singleTagNames.addValues(names);
  };

  RenderingContext.prototype.addAnchor = function(anchor_name){
    anchor_name = anchor_name || this.getAnchorName();
    if(anchor_name){
      this.documentContext.addAnchor(anchor_name);
    }
  };

  RenderingContext.prototype.addBlockElement = function(element){
    if(element === null){
      //console.log("[%s]:eof", this._name);
      return Nehan.Results.EOF;
    }
    var flow = this.style.flow;
    var max_size = this.getContextMaxExtentForAdd();
    var max_measure = this.layoutContext.getInlineMaxMeasure();
    var element_size = element.getLayoutExtent(flow);
    var prev_block_count = this.layoutContext.getBlockCount();
    var prev_extent = this.layoutContext.getBlockCurExtent();
    var next_extent = prev_extent + element_size;

    // if layout over, try to cancel after edge.
    if(next_extent > max_size){
      var over_size = next_extent - max_size;
      if(element.edge && (element.edge.getAfter(flow) >= over_size || element_size > this.getRootContentExtent())){
	var cancel_size = element.edge.cancelAfter(flow, over_size);
	next_extent -= cancel_size;
	element_size -= cancel_size;
      }
      // still overflow
      if(next_extent > max_size){
	// if element size is larger than root extent, it's never included. so skip it without caching.
	if(element_size > this.getRootContentExtent()){
	  console.warn("skip too large block element:%o(%d)", element, element_size);
	  return Nehan.Results.SKIP;
	}
	//console.warn("first atomic element overflow:%o(%s)", element, element.toString());
      }
    }

    //this.debugBlockPush(element, element_size);

    if(element.isResumableLine(max_measure) && this.hasChildLayout() && this.child.isInline()){
      this.child.setResumeLine(element);
      return Nehan.Results.SKIP;
    }

    if(next_extent <= max_size){
      this.layoutContext.addBlockElement(element, element_size);
      if(element.hasLineBreak){
	this.documentContext.incLineBreakCount();
      }
    }
    if(next_extent > max_size){
      var result = this.pushCache(element);
      if(result !== Nehan.Results.OK){
	return result;
      }
    }
    if(next_extent >= max_size){
      //console.warn("break after(block over)");
      this.layoutContext.setBreakAfter(true);
    }
    // inherit child block over
    if(element.breakAfter){
      //console.warn("break after(inherit)");
      this.layoutContext.setBreakAfter(true);
    }
    if(this.layoutContext.isBreakAfter()){
      return Nehan.Results.BREAK_AFTER;
    }
    return Nehan.Results.OK;
  };

  // flag from child: lineOver, lineBreak
  // flag to parent: lineBreak
  RenderingContext.prototype.addInlineElement = function(element){
    //console.log("add inline element:%s", (element? element.toString() : "?"));
    if(element === null){
      //console.log("[%s]:eof", this._name);
      return Nehan.Results.EOF;
    }
    var max_size = this.layoutContext.getInlineMaxMeasure();
    var element_size = this.getElementLayoutMeasure(element);
    var prev_measure = this.layoutContext.getInlineCurMeasure(this.style.flow);
    var next_measure = prev_measure + element_size;

    //this.debugInlinePush(element, element_size);

    if(element_size === 0){
      return Nehan.Results.ZERO;
    }
    if(this.layoutContext.getInlineElements().length === 0 && next_measure > max_size && element_size > this.getRootContentMeasure()){
      console.warn("skip too large inline element:%o(%d", element, element_size);
      return Nehan.Results.SKIP; // just skip it.
    }
    if(next_measure <= max_size){
      this.layoutContext.addInlineBoxElement(element, element_size);
      if(element.hangingPunctuation){
	this.addHangingPunctuation(element);
      }
      if(element.hasLineBreak){
	this.layoutContext.setLineBreak(true);
	return Nehan.Results.LINE_BREAK;
      }
      if(element.lineOver){
	this.layoutContext.setLineOver(true);
	return Nehan.Results.OVERFLOW;
      }
    }
    if(next_measure > max_size){
      var result = this.pushCache(element);
      if(result !== Nehan.Results.OK){
	return result;
      }
    }
    if(next_measure >= max_size){
      return Nehan.Results.OVERFLOW;
    }
    return Nehan.Results.OK;
  };

  RenderingContext.prototype.addTextElement = function(element){
    if(element === null){
      return Nehan.Results.EOF;
    }
    var max_size = this.layoutContext.getInlineMaxMeasure();
    var element_size = this.getTextMeasure(element);
    var prev_measure = this.layoutContext.getInlineCurMeasure(this.style.flow);
    var next_measure = prev_measure + element_size;
    var next_token = this.stream.peek();

    //this.debugTextPush(element, element_size);

    if(element_size === 0){
      return Nehan.Results.ZERO;
    }
    // skip head space for first word element if not 'white-space:pre'
    if(prev_measure === 0 &&
       max_size === this.style.contentMeasure &&
       this.style.isPre() === false &&
       next_token instanceof Nehan.Word &&
       element instanceof Nehan.Char &&
       element.isWhiteSpace()){
      return Nehan.Results.SKIP;
    }
    if(next_measure <= max_size){
      this.layoutContext.addInlineTextElement(element, element_size);
    }
    if(next_measure > max_size){
      var result = this.pushCache(element);
      if(result !== Nehan.Results.OK){
	return result;
      }
    }
    if(next_measure >= max_size){
      this.layoutContext.setLineOver(true);
      return Nehan.Results.OVERFLOW;
    }
    return Nehan.Results.OK;
  };

  RenderingContext.prototype.addHangingPunctuation = function(element){
    if(element.hangingPunctuation.style === this.style){
      var chr = this.yieldHangingChar(element.hangingPunctuation.data);
      this.layoutContext.addInlineBoxElement(chr, 0);
    } else {
      this.layoutContext.setHangingPunctuation(element.hangingPunctuation); // inherit to parent generator
    }
  };

  // -----------------------------------------------
  // [clear]
  // -----------------------------------------------
  RenderingContext.prototype.clearCache = function(cache){
    this.cachedElements = [];
  };

  // -----------------------------------------------
  // [create]
  // -----------------------------------------------
  RenderingContext.prototype.create = function(opt){
    return new RenderingContext({
      parent:opt.parent || null,
      style:opt.style || null,
      stream:opt.stream || null,
      layoutContext:this.layoutContext || null,
      selectors:this.selectors, // always same
      singleTagNames:this.singleTagNames, // always same
      documentContext:this.documentContext, // always same
      pageEvaluator:this.pageEvaluator // always same
    });
  };

  RenderingContext.prototype.createHtmlLexer = function(content){
    return new Nehan.HtmlLexer(content, {
      singleTagNames:this.singleTagNames.getValues()
    });
  };

  RenderingContext.prototype.createDocumentStream = function(text){
    var stream = new Nehan.TokenStream({
      filter:Nehan.Closure.isTagName(["!doctype", "html"]),
      lexer:this.createHtmlLexer(text)
    });
    if(stream.isEmptyTokens()){
      stream.tokens = [new Nehan.Tag("html", text)];
    }
    return stream;
  };

  RenderingContext.prototype.createHtmlStream = function(text){
    var stream = new Nehan.TokenStream({
      filter:Nehan.Closure.isTagName(["head", "body"]),
      lexer:this.createHtmlLexer(text)
    });
    if(stream.isEmptyTokens()){
      stream.tokens = [new Nehan.Tag("body", text)];
    }
    return stream;
  };

  RenderingContext.prototype.createRootGenerator = function(root){
    switch(root){
    case "document":
      return new Nehan.DocumentGenerator(this);
    case "html":
      return new Nehan.HtmlGenerator(this);
    default:
      return new Nehan.BodyGenerator(this);
    }
  };

  RenderingContext.prototype.createFlipLayoutContext = function(){
    var measure = this.getParentRestExtent();
    var extent = this.getParentContentMeasure();
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(extent),
      new Nehan.InlineContext(measure)
    );
  };

  RenderingContext.prototype.createInlineLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.getContextMaxExtent()),
      new Nehan.InlineContext(this.getContextMaxMeasure())
    );
  };

  RenderingContext.prototype.createBlockLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.getContextMaxExtent()),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
  };

  RenderingContext.prototype.createInlineBlockLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.getContextMaxExtent()),
      new Nehan.InlineContext(this.getContextMaxMeasure())
    );
  };

  RenderingContext.prototype.createLayoutContext = function(){
    if(this.hasFlipFlow()){
      return this.createFlipLayoutContext();
    }
    if(!this.style || this.style.getMarkupName() === "html"){
      return null;
    }
    if(this.isInline()){
      return this.createInlineLayoutContext();
    }
    if(this.style.isInlineBlock()){
      return this.createInlineBlockLayoutContext();
    }
    return this.createBlockLayoutContext();
  };

  RenderingContext.prototype.createListMarkerOption = function(item_style){
    var list_style = item_style.getListStyle();
    if(!list_style.isImageList()){
      return {};
    }
    return {
      width:item_style.getFontSize(),
      height:item_style.getFontSize()
    };
  };

  RenderingContext.prototype.createListContext = function(){
    var item_tags = this.stream.getTokens();
    var item_count = item_tags.length;
    var indent_size = 0;

    // find max marker size from all list items.
    item_tags.forEach(function(item_tag, index){
      // wee neeed [li][li::marker] context.
      var item_style = this.createTmpChildStyle(item_tag);
      var item_context = this.createChildContext(item_style);
      var marker_tag = new Nehan.Tag("::marker");
      var marker_option = this.createListMarkerOption(item_style);
      var marker_html = this.style.getListMarkerHtml(index + 1, marker_option);
      marker_tag.setContent(marker_html);
      var marker_style = item_context.createTmpChildStyle(marker_tag);
      //console.log("marker style:%o", marker_style);
      var marker_context = item_context.createChildContext(marker_style);
      var marker_box = new Nehan.InlineGenerator(marker_context).yield();
      var marker_measure = marker_box? marker_box.getLayoutMeasure() : 0;
      //console.log("RenderingContext::marker context:%o", marker_context);
      indent_size = Math.max(indent_size, marker_measure);
    }.bind(this));

    //console.info("indent size:%d, body size:%d", indent_size, (this.style.contentMeasure - indent_size));

    return {
      itemCount:item_count,
      indentSize:indent_size,
      bodySize:(this.style.contentMeasure - indent_size)
    };
  };

  RenderingContext.prototype.createTablePartition = function(stream){
    var pset = new Nehan.PartitionHashSet(), content;
    while(stream.hasNext()){
      var token = stream.get();
      if(token === null){
	break;
      }
      if(token instanceof Nehan.Tag === false){
	continue;
      }
      switch(token.getName()){
      case "tbody": case "thead": case "tfoot":
	content = token.getContent();
	var pset2 = this.createTablePartition(new Nehan.TokenStream({
	  filter:Nehan.Closure.isTagName(["tr"]),
	  lexer:this.createHtmlLexer(content)
	}));
	pset = pset.union(pset2);
	break;

      case "tr":
	content = token.getContent();
	var cell_tags = new Nehan.TokenStream({
	  filter:Nehan.Closure.isTagName(["td", "th"]),
	  lexer:this.createHtmlLexer(content)
	}).getTokens();
	var cell_count = cell_tags.length;
	var partition = this.createCellPartition(cell_tags);
	pset.add(cell_count, partition);
	break;
      }
    }
    stream.rewind();
    return pset;
  };

  RenderingContext.prototype.createCellPartition = function(cell_tags){
    var partition_count = cell_tags.length;
    var partition_units = cell_tags.map(function(cell_tag){
      return this.createCellPartitionUnit(cell_tag, partition_count);
    }.bind(this));
    return new Nehan.Partition(partition_units);
  };

  RenderingContext.prototype.createCellPartitionUnit = function(cell_tag, partition_count){
    var measure = cell_tag.getAttr("measure") || cell_tag.getAttr("width") || null;
    if(measure){
      return new Nehan.PartitionUnit({weight:measure, isStatic:true});
    }
    var content = cell_tag.getContent();
    var lines = cell_tag.getContent().replace(/<br \/>/g, "\n").replace(/<br>/g, "\n").split("\n");
    // this sizing algorithem is not strict, but still effective,
    // especially for text only table.
    var max_line = Nehan.List.maxobj(lines, function(line){ return line.length; });
    var max_weight = Math.floor(this.style.contentMeasure / 2);
    var min_weight = Math.floor(this.style.contentMeasure / (partition_count * 2));
    var weight = max_line.length * this.style.getFontSize();
    // less than 50% of parent size, but more than 50% of average partition size.
    weight = Math.max(min_weight, Math.min(weight, max_weight));

    // but confirm that weight is more than single font size of parent style.
    weight = Math.max(this.style.getFontSize(), weight);
    return new Nehan.PartitionUnit({weight:weight, isStatic:false});
  };

  RenderingContext.prototype.createOutlineElement = function(callbacks){
    return this.createOutlineElementByName("body", callbacks || {});
  };

  RenderingContext.prototype.createOutlineElementByName = function(outline_name, callbacks){
    var outlines = this.documentContext.createOutlineElementByName(outline_name, callbacks);
    return (outlines.length > 0)? outlines[0] : null;
  };

  RenderingContext.prototype.createChildContext = function(child_style, opt){
    opt = opt || {};
    this.child = this.create({
      parent:this,
      style:child_style,
      stream:(opt.stream || this.createStream(child_style))
    });
    child_style.context = this.child;
    return this.child;
  };

  RenderingContext.prototype.createStyle = function(markup, parent_style, args){
    return new Nehan.Style(this, markup, parent_style, args || {});
  };

  RenderingContext.prototype.createChildStyle = function(markup, args){
    return new Nehan.Style(this, markup, this.style, args || {});
  };

  RenderingContext.prototype.createTmpChildStyle = function(markup, args){
    var style = this.createChildStyle(markup, args);
    this.style.removeChild(style);
    return style;
  };

  RenderingContext.prototype.createStream = function(style){
    var markup_name = style.getMarkupName();
    var markup_content = style.getContent();
    if(style.getTextCombineUpright() === "horizontal" || markup_name === "tcy"){
      return new Nehan.TokenStream({
	tokens:[new Nehan.Tcy(markup_content)]
      });
    }
    switch(markup_name){
    case "html":
      var html_stream = new Nehan.TokenStream({
	filter:Nehan.Closure.isTagName(["head", "body"]),
	lexer:this.createHtmlLexer(markup_content)
      });
      if(html_stream.isEmptyTokens()){
	html_stream.tokens = [new Nehan.Tag("body", markup_content)];
      }
      return html_stream;

    case "tbody": case "thead": case "tfoot":
      return new Nehan.TokenStream({
	filter:Nehan.Closure.isTagName(["tr"]),
	lexer:this.createHtmlLexer(markup_content)
      });
    case "tr":
      return new Nehan.TokenStream({
	filter:Nehan.Closure.isTagName(["td", "th"]),
	lexer:this.createHtmlLexer(markup_content)
      });
    case "ul": case "ol":
      return new Nehan.TokenStream({
	filter:Nehan.Closure.isTagName(["li"]),
	lexer:this.createHtmlLexer(markup_content)
      });
    case "word":
      return new Nehan.TokenStream({
	tokens:[new Nehan.Word(markup_content)]
      });
    case "ruby":
      return new Nehan.RubyTokenStream(markup_content);
    default:
      return new Nehan.TokenStream({
	lexer:this.createHtmlLexer(markup_content)
      });
    }
  };

  RenderingContext.prototype.createListItemGenerator = function(item_context){
    var list_style = item_context.style.getListStyle();
    if(list_style.isOutside()){
      return new Nehan.OutsideListItemGenerator(item_context);
    }
    return new Nehan.InsideListItemGenerator(item_context);
  };

  RenderingContext.prototype.createFloatGenerator = function(first_float_gen){
    //console.warn("create float generator!");
    var max_measure = this.layoutContext.getInlineMaxMeasure();
    var float_measure = first_float_gen.context.style.contentMeasure;
    var floated_generators = [first_float_gen];
    if(float_measure > max_measure){
      //console.log("can't create float:(%d > %d)", float_measure, max_measure);
      this.stream.prev();
      first_float_gen.context.lazyOutput = this.yieldWhiteSpace();
      return new Nehan.LazyGenerator(first_float_gen.context);
    }
    this.stream.iterWhile(function(token){
      if(token instanceof Nehan.Text && token.isWhiteSpaceOnly()){
	return true; // skip and continue
      }
      if(token instanceof Nehan.Tag === false){
	return false; // break
      }
      var child_style = this.createChildStyle(token);
      if(!child_style.isFloated()){
	this.style.removeChild(child_style);
	return false; // break
      }
      float_measure += child_style.contentMeasure;
      if(float_measure > max_measure){
	//console.log("skip to next block level:%o", child_style);
	this.style.removeChild(child_style);
	return false; // break
      }
      var generator = this.createChildBlockGenerator(child_style);
      floated_generators.push(generator);
      return true; // continue
    }.bind(this));

    var float_root_style = this.createTmpChildStyle(new Nehan.Tag("float-root"), {display:"block"});
    var float_root_context = this.createChildContext(float_root_style);
    float_root_context.floatedGenerators = floated_generators;

    var space_style = float_root_context.createChildStyle(new Nehan.Tag("space"), {display:"block"});
    var space_context = float_root_context.createChildContext(space_style, {stream:this.stream});
    var space_gen = new Nehan.BlockGenerator(space_context);

    return new Nehan.FloatGenerator(float_root_context);
  };

  RenderingContext.prototype.createChildBlockGenerator = function(child_style, child_stream){
    //console.log("createChildBlockGenerator(%s):%s", child_style.getMarkupName(), child_style.markup.getContent());
    child_stream = child_stream || this.createStream(child_style);
    var child_context = this.createChildContext(child_style, {
      stream:child_stream
    });

    var direct_block = child_context.yieldBlockDirect();
    if(direct_block){
      child_context.lazyOutput = direct_block;
      return new Nehan.LazyGenerator(child_context);
    }

    // switch generator by display
    switch(child_style.display){
    case "list-item":
      return this.createListItemGenerator(child_context);

    case "table":
      return new Nehan.TableGenerator(child_context);

    case "table-row":
      return new Nehan.TableRowGenerator(child_context);

    case "table-cell":
      return new Nehan.TableCellGenerator(child_context);
    }

    // switch generator by markup name
    switch(child_style.getMarkupName()){
    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      return new Nehan.SectionRootGenerator(child_context);

    case "section":
    case "article":
    case "nav":
    case "aside":
      return new Nehan.SectionContentGenerator(child_context);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return new Nehan.HeaderGenerator(child_context);

    case "ul":
    case "ol":
      return new Nehan.ListGenerator(child_context);

    case "p":
      return new Nehan.ParagraphGenerator(child_context);

    default:
      return new Nehan.BlockGenerator(child_context);
    }
  };

  // create inline root, and parse again.
  // example:
  // [p(block)][text][/p(block)] ->[p(block)][p(inline)][text][/p(inline)][/p(block)]
  RenderingContext.prototype.createInlineRootGenerator = function(){
    return this.createChildInlineGenerator(this.style, this.stream);
  };

  RenderingContext.prototype.createChildInlineGenerator = function(style, stream){
    var child_context = this.createChildContext(style, {
      stream:(stream || this.createStream(style))
    });

    var direct_block = child_context.yieldInlineDirect();
    if(direct_block){
      child_context.lazyOutput = direct_block;
      return new Nehan.LazyGenerator(child_context);
    }

    if(this.parent && this.parent.style !== style && style.isInlineBlock()){
      return new Nehan.InlineBlockGenerator(child_context);
    }
    switch(style.getMarkupName()){
    case "::first-line":
      return new Nehan.FirstLineGenerator(child_context);
    case "ruby":
      return new Nehan.TextGenerator(child_context);
    case "a":
      return new Nehan.LinkGenerator(child_context);
    default:
      return new Nehan.InlineGenerator(child_context);
    }
  };

  // @param text {Nehan.Text}
  RenderingContext.prototype.createTextStream = function(text){
    switch(this.style.getTextOrientation()){
    case "sideways":
      return new Nehan.TokenStream({
	tokens:[new Nehan.Word(text.getContent())]
      });
    case "upright":
      return new Nehan.TokenStream({
	lexer:new Nehan.UprightTextLexer(text.getContent())
      });
    case "mixed":
    default:
      return new Nehan.TokenStream({
	lexer:new Nehan.TextLexer(text.getContent())
      });
    }
  };

  RenderingContext.prototype.createChildTextGenerator = function(text){
    return new Nehan.TextGenerator(
      this.createChildContext(this.style, {
	stream:this.createTextStream(text)
      })
    );
  };

  RenderingContext.prototype.createChildTextGeneratorFromStream = function(stream){
    return new Nehan.TextGenerator(
      this.createChildContext(this.style, {
	stream:stream
      })
    );
  };

  RenderingContext.prototype.createBlockBoxClasses = function(){
    var classes = ["nehan-block", "nehan-" + this.getMarkupName()];
    if(this.style.markup.isHeaderTag()){
      classes.push("nehan-header");
    }
    classes = classes.concat(this.style.markup.getClasses());
    return classes;
  };

  RenderingContext.prototype.createLineBoxClasses = function(){
    var classes = ["nehan-inline", "nehan-inline-" + this.style.flow.getName()];
    classes = classes.concat(this.style.markup.getClasses());
    if(!this.isInlineRoot()){
      classes.concat("nehan-" + this.getMarkupName());
    }
    return classes;
  };

  RenderingContext.prototype.createBlockBoxContextEdge = function(){
    if(!this.style.edge){
      return null;
    }
    if(this.style.getMarkupName() === "hr"){
      return this.style.edge; // can't modify
    }
    var use_before_edge = this.isFirstOutput();
    var use_after_edge = !this.hasNext();
    if(use_before_edge && use_after_edge){
      return this.style.edge;
    }
    var edge = this.style.edge.clone();
    if(!use_before_edge){
      edge.clearBefore(this.style.flow);
    }
    if(!use_after_edge){
      edge.clearAfter(this.style.flow);
    }
    return edge;
  };

  RenderingContext.prototype.createBlockBox = function(opt){
    opt = opt || {};
    var elements = opt.elements || this.layoutContext.getBlockElements();
    var measure = (typeof opt.measure !== "undefined")? opt.measure : this.layoutContext.getInlineMaxMeasure();
    var extent = this.getBlockBoxOutputExtent(opt.extent || null);
    var box = new Nehan.Box({
      display:((this.style.display === "inline-block")? this.style.display : "block"),
      type:"block",
      size:this.style.flow.getBoxSize(measure, extent),
      edge:(opt.noEdge? null : this.createBlockBoxContextEdge()),
      context:this,
      elements:elements,
      content:((typeof opt.content !== "undefined")? opt.content : null),
      classes:this.createBlockBoxClasses(),
      charCount:elements.reduce(function(total, element){
	return total + (element.charCount || 0);
      }, 0),
      breakAfter:this.layoutContext.isBreakAfter(),
      pushed:this.style.isPushed(),
      pulled:this.style.isPulled()
    });

    /*
    if(this.getMarkupName() !== "hr" && (box.elements.length === 0 || box.isInvalidSize())){
      //console.warn("zero block?");
    }*/
    //this.debugBlockBox(box);
    return box;
  };

  RenderingContext.prototype.createLineBox = function(opt){
    opt = opt || {};
    var is_inline_root = this.isInlineRoot();
    var elements = opt.elements || this.layoutContext.getInlineElements();
    var measure = is_inline_root? this.getContextMaxMeasure() : this.layoutContext.getInlineCurMeasure();
    var max_extent = opt.maxExtent || this.layoutContext.getInlineMaxExtent() || this.style.getFontSize() || this.staticExtent;
    if(this.style.staticMeasure && !is_inline_root){
      measure = this.style.contentMeasure;
    }
    var line_size = this.style.flow.getBoxSize(measure, max_extent);
    var line = new Nehan.Box({
      type:"line-block",
      display:"inline",
      size:line_size,
      context:this,
      elements:elements,
      classes:this.createLineBoxClasses(),
      charCount:(opt.charCount || this.layoutContext.getInlineCharCount()),
      edge:((this.style.edge && !is_inline_root)? this.style.edge : null), // edge of root line is disabled because it's already included by parent block.,
      content:opt.content || null
    });

    line.maxFontSize = this.layoutContext.getInlineMaxFontSize();
    line.maxExtent = this.layoutContext.getInlineMaxExtent();
    line.hasLineBreak = this.layoutContext.hasLineBreak();
    line.lineOver = this.layoutContext.isLineOver();
    line.hangingPunctuation = this.layoutContext.getHangingPunctuation();
    line.isDecorated = Nehan.List.exists(elements, function(element){
      return element instanceof Nehan.Box && (element.isDecorated || element.isDecoratedText());
    });

    if(is_inline_root){
      // backup other line data. mainly required to restore inline-context.
      line.lineNo = opt.lineNo;
      line.hyphenated = this.layoutContext.isHyphenated();
      line.inlineMeasure = this.layoutContext.getInlineCurMeasure(); // actual measure
      line.classes.push("nehan-root-line");

      // set text-align
      if(this.style.textAlign && (this.style.textAlign.isCenter() || this.style.textAlign.isEnd())){
	this.style.textAlign.setAlign(line);
      } else if(this.style.textAlign && this.style.textAlign.isJustify()){
	this.style.textAlign.setJustify(line);
      }

      var line_height = this.style.getLineHeight();

      // set line-height
      Nehan.LineHeight.set(this.style.flow, line, line_height);

      // set vertical-align(currently 'baseline' only)
      Nehan.VerticalAlign.setBaseline(this.style.flow, line);
    }

    // set position in parent stream.
    if(this.parent && this.parent.stream){
      line.pos = Math.max(0, this.parent.stream.getPos() - 1);
    }

    if(this.style.isInlineRoot()){
      this.layoutContext.incBlockLineNo();
    }

    if(line.elements.length === 0 && !line.hasLineBreak){
      //console.warn("zero line?", line);
      line.edge = null;
      line.resizeExtent(this.style.flow, 0);
    }
    //console.info("[create line box] %o, yieldCount:%d", line, this.yieldCount);
    return line;
  };

  RenderingContext.prototype.createTextBox = function(opt){
    opt = opt || {};
    //console.log("text box: opt.measure:%d, curMeasure:%d", opt.measure, this.layoutContext.getInlineCurMeasure());
    var elements = opt.elements || this.layoutContext.getInlineElements();
    var extent = this.layoutContext.getInlineMaxExtent() || this.style.getFontSize();
    var measure = opt.measure || this.layoutContext.getInlineCurMeasure();

    if(this.layoutContext.isInlineEmpty()){
      extent = 0;
    } else if(this.style.isTextEmphaEnable()){
      extent = this.style.getEmphaTextBlockExtent();
    } else if(this.style.markup.name === "ruby"){
      extent = this.style.getRubyTextBlockExtent();
    }
    var text_box = new Nehan.Box({
      size:this.style.flow.getBoxSize(measure, extent),
      context:this,
      type:"text-block",
      display:"inline",
      elements:elements,
      classes:["nehan-text-block"].concat(this.style.markup.getClasses()),
      charCount:this.layoutContext.getInlineCharCount(),
      content:(typeof opt.content !== "undefined")? opt.content : null
    });
    text_box.maxFontSize = this.layoutContext.getInlineMaxFontSize() || this.style.getFontSize();
    text_box.maxExtent = extent;
    text_box.hasLineBreak = this.layoutContext.hasLineBreak(); // is line-break is included?
    text_box.hyphenated = this.layoutContext.isHyphenated();
    text_box.lineOver = this.layoutContext.isLineOver(); // is line full-filled?
    text_box.hangingPunctuation = this.layoutContext.getHangingPunctuation();
    text_box.isEmpty = this.layoutContext.isInlineEmpty();

    // set position in parent stream.
    if(this.parent && this.parent.stream){
      text_box.pos = Math.max(0, this.parent.stream.getPos() - 1);
    }
    //console.info("[create text box] %o(isVoid=%o), yieldCount:%d", text_box, text_box.isVoid(), this.yieldCount);
    return text_box;
  };

  // -----------------------------------------------
  // [debug]
  // -----------------------------------------------
  RenderingContext.prototype.debugBlockBox = function(box){
    console.info(
      "[create block box]%o(%s)\n box.breakAfter:%o, context.breakAfter:%o, box.isVoid:%o",
      box,
      box.toString(),
      box.breakAfter,
      this.layoutContext.isBreakAfter(),
      box.isVoid()
    );
  };

  RenderingContext.prototype.debugBlockPush = function(element, extent){
    var name = this.getName();
    var size = element.size;
    var bc = this.layoutContext.block;
    var str = element.toString();
    var max = this.getContextMaxExtentForAdd();
    var prev = bc.curExtent;
    var next = prev + extent;
    var parent_rest = this.parent && this.parent.layoutContext? this.parent.layoutContext.getBlockRestExtent() : this.layoutContext.getBlockRestExtent();
    console.log("[add block] %s:%o(%dx%d), e(%d/%d) -> e(%d/%d), +%d(prest:%d)\n%s", name, element, size.width, size.height, prev, max, next, max, extent, parent_rest, str);
    if(next > max){
      console.warn("over %c%d", "color:red", (next - max));
    }
  };

  RenderingContext.prototype.debugInlinePush = function(element, measure){
    var name = this.getName();
    var ic = this.layoutContext.inline;
    var str = element.toString();
    var max = ic.maxMeasure;
    var prev = ic.curMeasure;
    var next = prev + measure;
    console.log("[add inline] %s:%o(%s), m(%d/%d) -> m(%d/%d), +%d", name, element, str, prev, max, next, max, measure);
  };

  RenderingContext.prototype.debugTextPush = function(element, measure){
    var name = this.getName();
    var ic = this.layoutContext.inline;
    var str = element.data || "";
    var max = ic.maxMeasure;
    var prev = ic.curMeasure;
    var next = prev + measure;
    console.log("[add text] %s:%o(%s), m(%d/%d) -> m(%d/%d), +%d", name, element, str, prev, max, next, max, measure);
  };

  // -----------------------------------------------
  // [end]
  // -----------------------------------------------
  RenderingContext.prototype.endOutlineContext = function(){
    // called when section root(body, blockquote, fieldset, figure, td) ends.
    this.documentContext.addOutlineContext(this.getOutlineContext());
  };

  RenderingContext.prototype.endSectionContext = function(){
    // called when section content(article, aside, nav, section) ends.
    this.getOutlineContext().add({
      name:"end-section",
      type:this.getMarkupName()
    });
  };

  // -----------------------------------------------
  // [extend]
  // -----------------------------------------------
  RenderingContext.prototype.extend = function(opt){
    return new RenderingContext({
      parent:opt.parent || this.parent,
      style:opt.style || this.style,
      stream:opt.stream || this.stream,
      layoutContext:this.layoutContext || this.layoutContext,
      selectors:this.selectors, // always same
      singleTagNames:this.singleTagNames, // always same
      documentContext:this.documentContext, // always same
      pageEvaluator:this.pageEvaluator // always same
    });
  };

  // -----------------------------------------------
  // [gen]
  // -----------------------------------------------
  RenderingContext.prototype.genBlockId = function(){
    return this.documentContext.genBlockId();
  };

  RenderingContext.prototype.genRootBlockId = function(){
    return this.documentContext.genRootBlockId();
  };

  // -----------------------------------------------
  // [get]
  // -----------------------------------------------
  RenderingContext.prototype.getDocumentLang = function(){
    return this.documentContext.documentLang;
  };

  RenderingContext.prototype.getLang = function(){
    return this.style.getMarkupAttr("lang") || "";
  };

  RenderingContext.prototype.getFlow = function(){
    return this.style.flow;
  };

  RenderingContext.prototype.getMarkupName = function(){
    return this.style? this.style.getMarkupName() : "";
  };

  RenderingContext.prototype.getMarkupPath = function(){
    return this.style? this.style.getMarkupPath() : "";
  };

  RenderingContext.prototype.getDisplay = function(){
    return this.style? this.style.display : "";
  };

  RenderingContext.prototype.getFontSize = function(){
    return this.style? this.style.getFontSize() : Nehan.Config.defaultFontSize;
  };

  RenderingContext.prototype.getAnchorName = function(){
    return this.style.getAnchorName();
  };

  RenderingContext.prototype.getStreamTokens = function(){
    return this.stream? this.stream.tokens : [];
  };

  RenderingContext.prototype.getRootContentExtent = function(){
    return this.style.getRootStyle().contentExtent;
  };

  RenderingContext.prototype.getRootContentMeasure = function(){
    return this.style.getRootStyle().contentMeasure;
  };

  RenderingContext.prototype.getWritingDirection = function(){
    return "vert"; // TODO
  };

  RenderingContext.prototype.getPage = function(index){
    var page = this.documentContext.pages[index] || null;
    if(page instanceof Nehan.Box){
      page = this.pageEvaluator.evaluate(page);
      this.documentContext.pages[index] = page;
      return page;
    }
    return page;
  };

  RenderingContext.prototype.getPageCount = function(){
    return this.documentContext.getPageCount();
  };

  RenderingContext.prototype.getChildContext = function(){
    return this.child || null;
  };

  RenderingContext.prototype.getContent = function(){
    return this.stream? this.stream.getSrc() : "";
  };

  RenderingContext.prototype.getListContext = function(){
    if(this.listContext){
      return this.listContext;
    }
    if(this.parent){
      return this.parent.getListContext();
    }
    return null;
  };

  RenderingContext.prototype.getBlockRestExtent = function(){
    return this.layoutContext.getBlockRestExtent();
  };

  RenderingContext.prototype.getContextMaxMeasure = function(){
    // rt is child style of ruby, but inline cursor starts from beginning of parent inline.
    if(this.style.getMarkupName() === "rt"){
      return this.parent.layoutContext.getInlineMaxMeasure();
    }
    var max_size = (this.parent && this.parent.layoutContext)? this.parent.layoutContext.getInlineRestMeasure() : this.style.contentMeasure;
    return Math.min(max_size, this.style.contentMeasure);
  };

  RenderingContext.prototype.getEdgeExtent = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getEdgeExtent(this.style.flow);
  };

  // for box-sizing:border-box
  RenderingContext.prototype.getInnerEdgeBefore = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getInnerEdgeBefore(this.style.flow);
  };

  RenderingContext.prototype.getEdgeBefore = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getEdgeBefore();
  };

  RenderingContext.prototype.getEdgeAfter = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getEdgeAfter();
  };

  RenderingContext.prototype.getBlockBoxOutputExtent = function(direct_extent){
    var auto_extent = this.layoutContext.getBlockCurExtent();
    var static_extent = this.style.staticExtent || null;
    var content_extent = this.style.contentExtent;
    var is_float_space = this.isFloatSpace();
    var is_iblock = this.style.isInlineBlock();

    if(auto_extent === 0 && !this.style.isPasted()){
      return 0;
    }
    if(this.isBody()){
      return content_extent;
    }
    if(is_float_space){
      return Math.min(auto_extent, content_extent);
    }
    if(static_extent){
      return content_extent;
    }
    return direct_extent || auto_extent;
  };

  RenderingContext.prototype.getParentRestExtent = function(){
    if(this.parent && this.parent.layoutContext){
      return this.parent.layoutContext.getBlockRestExtent();
    }
    return null;
  };

  RenderingContext.prototype.getParentContentMeasure = function(){
    if(this.parent && this.parent.layoutContext){
      return this.parent.layoutContext.getInlineMaxMeasure();
    }
    return null;
  };

  // Size of after edge is not removed from content size,
  // because edge of extent direction can be sweeped to next page.
  // In constrast, size of start/end edge is always included,
  // because size of measure direction is fixed in each pages.
  RenderingContext.prototype.getContextMaxExtent = function(){
    var rest_size = this.getParentRestExtent() || this.style.extent;
    var max_size = this.style.staticExtent? Math.min(rest_size, this.style.staticExtent) : rest_size;
    switch(this.style.boxSizing){
    case "content-box":
      return max_size;
    case "border-box":
      return this.isFirstOutput()? Math.max(0, max_size - this.getInnerEdgeBefore()) : max_size;
    case "margin-box": default:
      return this.isFirstOutput()? Math.max(0, max_size - this.getEdgeBefore()) : max_size;
    }
  };

  // max extent size at the phase of adding actual element.
  RenderingContext.prototype.getContextMaxExtentForAdd = function(){
    var max_size = this.layoutContext.getBlockMaxExtent();
    var tail_edge_size = this.getEdgeAfter();

    // if final, tail edge size is required.
    if(!this.hasNext()){
      return max_size - tail_edge_size;
    }
    return max_size;
  };

  RenderingContext.prototype.getElementLayoutExtent = function(element){
    return element.getLayoutExtent(this.style.flow);
  };

  RenderingContext.prototype.getElementLayoutMeasure = function(element){
    return element.getLayoutMeasure(this.style.flow);
  };

  RenderingContext.prototype.getTextMeasure = function(element){
    return element.getAdvance(this.style.flow, this.style.letterSpacing || 0);
  };

  RenderingContext.prototype.getName = function(){
    var markup_name = this.getMarkupPath();
    if(this.generator instanceof Nehan.DocumentGenerator){
      return "(root)";
    }
    if(this.generator instanceof Nehan.TextGenerator){
      return markup_name + "(text)";
    }
    if(this.generator instanceof Nehan.InlineGenerator){
      return markup_name + "(inline)";
    }
    if(this.generator instanceof Nehan.InlineBlockGenerator){
      return markup_name + "(iblock)";
    }
    if(this.generator instanceof Nehan.BlockGenerator){
      return markup_name + "(block)" + (this.hasFlipFlow()? ":flip" : "");
    }
    return markup_name + "(" + this.getDisplay() + ")";
  };

  RenderingContext.prototype.getAnchorPageNo = function(anchor_name){
    return this.documentContext.getAnchorPageNo(anchor_name);
  };
  
  RenderingContext.prototype.getParentStyle = function(){
    return this.parent? this.parent.style : null;
  };

  RenderingContext.prototype.getHeaderRank = function(){
    if(this.style){
      return this.style.getHeaderRank();
    }
    return 0;
  };

  RenderingContext.prototype.getTablePartition = function(){
    if(this.tablePartition){
      return this.tablePartition;
    }
    if(this.parent){
      return this.parent.getTablePartition();
    }
    return null;
  };

  RenderingContext.prototype.getOutlineContext = function(){
    return this.outlineContext || (this.parent? this.parent.getOutlineContext() : null);
  };

  RenderingContext.prototype.getSiblingContext = function(){
    if(this.getMarkupName() === "rt"){
      return null;
    }
    var root_line = this.parent;
    while(root_line && root_line.style === this.style){
      root_line = root_line.parent || null;
    }
    return root_line || this.parent || null;
  };

  RenderingContext.prototype.getSiblingStyle = function(){
    var sibling = this.getSiblingContext();
    return (sibling && sibling.style)? sibling.style : null;
  };

  RenderingContext.prototype.getSiblingStream = function(){
    var sibling = this.getSiblingContext();
    return (sibling && sibling.stream)? sibling.stream : null;
  };

  // -----------------------------------------------
  // [has]
  // -----------------------------------------------
  RenderingContext.prototype.hasNext = function(){
    if(this.terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    if(this.child && this.hasChildLayout()){
      return true;
    }
    if(this.floatGenerators && this.hasNextFloat()){
      return true;
    }
    if(this.parallelGenerators && this.hasNextParallelLayout()){
      return true;
    }
    return this.stream? this.stream.hasNext() : false;
  };

  RenderingContext.prototype.hasChildLayout = function(){
    return this.child && this.child.generator && this.child.generator.hasNext();
  };

  RenderingContext.prototype.hasNextFloat = function(){
    return this.floatedGenerators && Nehan.List.exists(this.floatedGenerators, function(gen){
      return gen.hasNext();
    });
  };

  RenderingContext.prototype.hasNextParallelLayout = function(){
    return this.parallelGenerators && Nehan.List.exists(this.parallelGenerators, function(gen){
      return gen.hasNext();
    });
  };

  RenderingContext.prototype.hasCache = function(){
    return this.cachedElements.length > 0;
  };

  RenderingContext.prototype.hasFloatStackCache = function(){
    return this.floatStackCaches && this.floatStackCaches.length > 0;
  };

  RenderingContext.prototype.hasStaticExtent = function(){
    return (typeof this.style.staticExtent !== "undefined");
  };

  RenderingContext.prototype.hasStaticMeasure = function(){
    return (typeof this.style.staticMeasure !== "undefined");
  };

  RenderingContext.prototype.hasFlipFlow = function(){
    if(!this.parent || !this.parent.style || this.isBody()){
      return false;
    }
    return (this.parent.style.flow !== this.style.flow);
  };

  // -----------------------------------------------
  // [hyphenate]
  // -----------------------------------------------
  // hyphenate between two different inline generator.
  // [example]
  // <p>hoge<ruby>hige<rt>xx</rt></ruby>,hage</p>
  // => line1:hogehige
  // => line2:,hage (head NG!)
  //
  // => line1:hogehige, (hanging punctuation)
  // => line2:hage
  RenderingContext.prototype.hyphenateSibling = function(last_element, sib_context){
    var next_token = sib_context.stream.peek();
    var tail = this.layoutContext.getInlineLastElement();
    var head = (next_token instanceof Nehan.Text)? next_token.getHeadChar() : null;
    //console.log("hyphenate sib:last = %o, tail = %o, head = %o", last_element, tail, head);
    //console.log("cur_context inline.cur = %d, inline.rest = %d", this.layoutContext.inline.curMeasure, this.layoutContext.inline.getRestMeasure());
    //console.log("sib_context inline.cur = %d, inline.rest = %d", sib_context.layoutContext.inline.curMeasure, sib_context.layoutContext.inline.getRestMeasure());

    if(this.layoutContext.getInlineRestMeasure() > sib_context.getFontSize()){
      //console.log("not required!");
      return;
    }
    if(this.style.isHangingPuncEnable() && head && head.isHeadNg()){
      //console.log("hanging punc!");
      next_token.cutHeadChar();
      this.layoutContext.setHangingPunctuation({
	data:head,
	style:this.getSiblingStyle()
      });
      return;
    } else if(tail && tail instanceof Nehan.Char && tail.isTailNg() && this.layoutContext.getInlineElements().length > 1){
      //console.log("sweep!");
      this.layoutContext.popInlineElement();
      this.stream.setPos(tail.pos);
      this.layoutContext.setLineBreak(true);
      this.layoutContext.setHyphenated(true);
      this.clearCache();
    }
  };

  RenderingContext.prototype.hyphenate = function(last_element){
    // by stream.getToken(), stream pos has been moved to next pos already, so cur pos is the next head.
    var line_head_orig = this.peekLastCache() || this.stream.peek(); // original head token of next line.
    //console.log("line_head_orig:%o, last_element:%o", line_head_orig, last_element);
    if(line_head_orig === null){
      //console.log("line_head_orig:%o, last_element:%o", line_head_orig, last_element);
      var sibling = this.getSiblingContext();
      if(sibling && sibling.stream && sibling.layoutContext){
	//console.log("hyphenate sibling sibling:%o", sibling);
	this.hyphenateSibling(last_element, sibling);
      }
      return;
    }
    // hyphenate by hanging punctuation.
    var line_head_next = this.stream.peek();
    line_head_next = (line_head_next && line_head_orig.pos === line_head_next.pos)? this.stream.peek(1) : line_head_next;
    var is_single_head_ng = function(head, line_head_next){
      return (head instanceof Nehan.Char && head.isHeadNg()) &&
	!(line_head_next instanceof Nehan.Char && line_head_next.isHeadNg());
    };
    if(this.style.isHangingPuncEnable() && is_single_head_ng(line_head_orig, line_head_next)){
      this.layoutContext.addInlineTextElement(line_head_orig, 0);
      if(line_head_next){
	this.stream.setPos(line_head_next.pos);
      } else {
	this.stream.get();
      }
      this.layoutContext.setLineBreak(true);
      this.layoutContext.setHyphenated(true);
      this.clearCache();
      return;
    }
    // hyphenate by sweep.
    var line_head_new = this.layoutContext.hyphenateSweep(line_head_orig); // if fixed, new_head token is returned.
    if(line_head_new){
      //console.log("hyphenate by sweep:line_head_orig:%o, line_head_new:%o", line_head_orig, line_head_new);
      var hyphenated_measure = line_head_new.bodySize || 0;
      if(Math.abs(line_head_new.pos - line_head_orig.pos) > 1){
	hyphenated_measure = Math.abs(line_head_new.pos - line_head_orig.pos) * this.style.getFontSize(); // [FIXME] this is not accurate size.
      }
      this.layoutContext.addInlineMeasure(-1 * hyphenated_measure); // subtract sweeped measure.
      //console.log("hyphenate and new head:%o", line_head_new);
      this.stream.setPos(line_head_new.pos);
      this.layoutContext.setLineBreak(true);
      this.layoutContext.setHyphenated(true);
      this.clearCache(); // stream position changed, so disable cache.
    }
  };

  // -----------------------------------------------
  // [init]
  // -----------------------------------------------
  RenderingContext.prototype.initLayoutContext = function(){
    this.layoutContext = this.createLayoutContext();
    if(this.layoutContext){
      //console.log("available space(m = %d, e = %d)", this.layoutContext.getInlineMaxMeasure(), this.layoutContext.getBlockMaxExtent());
    }
    if(this.hasFlipFlow()){
      this.updateContextSize(
	this.layoutContext.getInlineMaxMeasure(),
	this.layoutContext.getBlockMaxExtent()
      );
    }
    if(this.resumeLine){
      this.layoutContext.resumeLine(this.resumeLine);
      this.resumeLine = null;
    }
  };

  RenderingContext.prototype.initBlockClear = function(){
    var value = this.style.getCssAttr("clear");
    if(value){
      this.clear = new Nehan.Clear(value);
    }
  };

  RenderingContext.prototype.initListContext = function(){
    this.listContext = this.createListContext();
    return this.listContext;
  };

  RenderingContext.prototype.initParagraphContext = function(){
    this.style.setMarkupAttr("data-paragraph-id", this.documentContext.paragraphId++);
  };

  RenderingContext.prototype.initTablePartition = function(stream){
    this.tablePartition = this.createTablePartition(stream);
  };

  // -----------------------------------------------
  // [is]
  // -----------------------------------------------
  RenderingContext.prototype.isBody = function(){
    return this.getMarkupName() === "body";
  };

  RenderingContext.prototype.isInline = function(){
    return (
      this.style.isInline() ||
      this.generator instanceof Nehan.TextGenerator ||
      this.generator instanceof Nehan.InlineGenerator
    );
  };

  RenderingContext.prototype.isInlineRoot = function(){
    if(this.parent && this.parent.style !== this.style){
      return false;
    }
    if(this.generator instanceof Nehan.TextGenerator){
      return false;
    }
    return (this.generator instanceof Nehan.InlineGenerator ||
	    this.generator instanceof Nehan.InlineBlockGenerator);
  };

  RenderingContext.prototype.isBreakBefore = function(){
    // can't break before first page
    if(this.documentContext.getPageNo() === 0){
      return false;
    }
    return this.isFirstOutput() && this.style.isBreakBefore();
  };

  RenderingContext.prototype.isBreakAfter = function(){
    return !this.hasNext() && this.style.isBreakAfter();
  };

  RenderingContext.prototype.isFirstOutput = function(){
    return this.yieldCount === 0;
  };

  RenderingContext.prototype.isTextVertical = function(){
    return this.style.isTextVertical();
  };

  RenderingContext.prototype.isFloatStart = function(){
    return this.style? this.style.isFloatStart() : false;
  };

  RenderingContext.prototype.isFloatEnd = function(){
    return this.style? this.style.isFloatEnd() : false;
  };

  RenderingContext.prototype.isFloatSpace = function(){
    return this.style.getMarkupName() === "space";
  };

  RenderingContext.prototype.isHyphenateEnable = function(last_element){
    if(this.layoutContext.isInlineEmpty()){
      return false;
    }
    if(this.layoutContext.hasLineBreak()){
      return false;
    }
    if(!this.style.isHyphenationEnable()){
      return false;
    }
    // [tail-ng-char:1em][word:3em(over)] -> hyphenate at [tail-ng-char:1em]
    if(last_element && last_element.getAdvance && last_element.getAdvance() > this.style.getFontSize()){
      return true;
    }
    // if there is space more than 1em, restrict hyphenation.
    if(this.layoutContext.getInlineRestMeasure() > this.style.getFontSize()){
      return false;
    }
    return true;
  };

  RenderingContext.prototype.isInsidePreBlock = function(){
    return this.parent && this.parent.style.isPre();
  };

  // -----------------------------------------------
  // [peek]
  // -----------------------------------------------
  RenderingContext.prototype.peekLastCache = function(){
    return Nehan.List.last(this.cachedElements);
  };

  RenderingContext.prototype.peekSiblingNextToken = function(){
    var sibling_stream = this.getSiblingStream();
    return sibling_stream? sibling_stream.peek() : null;
  };

  RenderingContext.prototype.peekSiblingNextHeadChar = function(){
    var head_c1;
    var token = this.peekSiblingNextToken();
    if(token instanceof Nehan.Text){
      head_c1 = token.getContent().substring(0,1);
      return new Nehan.Char({data:head_c1});
    }
    // if parent next token is not Nehan::Text,
    // it's hard to find first character, so skip it.
    return null;
  };

  // -----------------------------------------------
  // [pop]
  // -----------------------------------------------
  RenderingContext.prototype.popCache = function(){
    var cache = this.cachedElements.pop();
    if(cache){
      //console.info("use cache:%o(%s)", cache, this.stringOfElement(cache));
      cache.breakAfter = false;
      if(cache.lineOver){
	cache.lineOver = false;
	cache.edge.clearEnd(this.getFlow());
      }
    }
    return cache;
  };

  RenderingContext.prototype.popFloatStackCache = function(){
    return this.floatStackCaches.pop();
  };

  // -----------------------------------------------
  // [prefetch]
  // -----------------------------------------------
  RenderingContext.prototype.prefetchContext = function(markups){
    return markups.reduce(function(ctx, markup){
      var style = ctx.createChildStyle(markup);
      return ctx.createChildContext(style);
    }.bind(this), this);
  };

  // -----------------------------------------------
  // [push]
  // -----------------------------------------------
  RenderingContext.prototype.pushCache = function(element){
    var size = (element instanceof Nehan.Box)? element.getLayoutExtent(this.style.flow) : (element.bodySize || 0);
    //console.log("push cache:%o(e = %d, text = %s)", element, size, this.stringOfElement(element));
    element.cacheCount = (element.cacheCount || 0) + 1;
    if(element.cacheCount >= Nehan.Config.maxRollbackCount){
      console.error("too many rollback! context:%o, element:%o(%s)", this, element, this.stringOfElement(element));
      this.setTerminate(true);
      return Nehan.Results.TOO_MANY_ROLLBACK;
    }
    this.cachedElements.push(element);
    return Nehan.Results.OK;
  };

  RenderingContext.prototype.pushFloatStackCache = function(cache){
    this.floatStackCaches = this.floatStackCaches || [];
    this.floatStackCaches.push(cache);
  };

  // -----------------------------------------------
  // [set]
  // -----------------------------------------------
  RenderingContext.prototype.setTerminate = function(status){
    this.terminate = status;
  };

  RenderingContext.prototype.setOwnerGenerator = function(generator){
    this.generator = generator;
    this._name = this.getName();
  };

  RenderingContext.prototype.setParallelGenerators = function(generators){
    this.parallelGenerators = generators;
  };

  RenderingContext.prototype.setResumeLine = function(line){
    //console.warn("setResumeLine:%o(%s)", line, line.toString());
    this.resumeLine = line;
  };

  RenderingContext.prototype.setPageBreak = function(status){
    if(this.isInline() && this.parent){
      this.parent.setPageBreak(status);
    } else if(this.layoutContext){
      this.layoutContext.setBreakAfter(status);
    }
  };

  RenderingContext.prototype.setStyle = function(key, value){
    // if selecte value itself is function, treat it as 'onload' callback.
    if(typeof value === "function"){
      value = {onload:value};
    }
    this.selectors.setValue(key, value);
    return this;
  };

  RenderingContext.prototype.setStyles = function(values){
    for(var key in values){
      this.setStyle(key, values[key]);
    }
    return this;
  };

  // -----------------------------------------------
  // [start]
  // -----------------------------------------------
  RenderingContext.prototype.startOutlineContext = function(){
    // called when section root(body, blockquote, fieldset, figure, td) starts.
    this.outlineContext = new Nehan.OutlineContext(this.getMarkupName());
  };

  RenderingContext.prototype.startSectionContext = function(){
    // called when section content(article, aside, nav, section) starts.
    this.getOutlineContext().add({
      name:"start-section",
      type:this.getMarkupName(),
      pageNo:this.documentContext.getPageNo()
    });
  };

  RenderingContext.prototype.startHeaderContext = function(){
    // called when heading content(h1-h6) starts.
    var header_id = this.documentContext.genHeaderId();
    this.getOutlineContext().add({
      name:"set-header",
      headerId:header_id,
      pageNo:this.documentContext.getPageNo(),
      type:this.getMarkupName(),
      rank:this.style.getHeaderRank(),
      title:this.style.getContent()
    });
    return header_id;
  };

  // -----------------------------------------------
  // [stringOf]
  // -----------------------------------------------
  RenderingContext.prototype.stringOfElement = function(element){
    if(element instanceof Nehan.Box){
      return element.toString();
    }
    return element.data || "<obj>";
  };

  // -----------------------------------------------
  // [update]
  // -----------------------------------------------
  RenderingContext.prototype.updateContextStaticSize = function(measure, extent){
    this.style.staticMeasure = measure;
    this.style.staticExtent = extent;
    this.style.updateContextSize(measure, extent);
  };

  RenderingContext.prototype.updateContextSize = function(measure, extent){
    this.style.updateContextSize(measure, extent);
  };

  RenderingContext.prototype.updateParent = function(parent_context){
    if(this.isInline()){
      this.updateInlineParent(parent_context);
    }
    this.updateBlockParent(parent_context);
  };

  RenderingContext.prototype.updateBlockParent = function(parent_context){
    //console.log("[update block parent] %s > %s", parent_context._name, this._name);
    this.parent = parent_context;
    parent_context.child = this;
    this.updateContextSize(parent_context.style.contentMeasure, parent_context.style.contentExtent);
    if(this.child){
      this.child.updateParent(this);
    }
  };

  RenderingContext.prototype.updateInlineParent = function(parent_context){
    //console.log("[update inline parent] %s > %s", parent_context._name, this._name);
    this.style = parent_context.style;
    this.parent = parent_context;
    parent_context.child = this;
    var cache = this.peekLastCache();
    if(cache && this.generator instanceof Nehan.TextGenerator && cache.setMetrics){
      cache.setMetrics(this.style.flow, this.style.getFont());
    }
    if(this.child){
      this.child.updateParent(this);
    }
  };

  // -----------------------------------------------
  // [yield]
  // -----------------------------------------------
  RenderingContext.prototype.yieldChildLayout = function(){
    return this.child.generator.yield();
  };

  RenderingContext.prototype.yieldWrapBlock = function(measure, extent, elements){
    return new Nehan.Box({
      size:this.style.flow.getBoxSize(measure, extent),
      display:"block",
      context:this,
      elements:elements
    });
  };

  RenderingContext.prototype.yieldPageBreak = function(){
    return new Nehan.Box({
      display:"block",
      context:this,
      size:new Nehan.BoxSize(0,0),
      breakAfter:true
    });
  };

  RenderingContext.prototype.yieldWhiteSpace = function(){
    return new Nehan.Box({
      display:"block",
      context:this,
      size:this.style.flow.getBoxSize(
	this.layoutContext.getInlineMaxMeasure(),
	this.layoutContext.getBlockMaxExtent()
      ),
      elements:[]
    });
  };

  RenderingContext.prototype.yieldClearance = function(){
    if(!this.clear || !this.parent || !this.parent.floatGroup){
      return null;
    }
    var float_group = this.parent.floatGroup;
    var float_direction = float_group.getFloatDirection();
    var direction_name = float_direction.getName();

    // if meet the final output of the last float stack with same clear direction,
    // yield white space but set done status to clear object.
    if(float_group.isLast() && this.clear.hasDirection(direction_name)){
      this.clear.setDone(direction_name);
      return this.yieldWhiteSpace();
    }
    // if any other clear direction that is not cleared, continue yielding white space.
    if(!this.clear.isDoneAll()){
      return this.yieldWhiteSpace();
    }
    return null;
  };

  RenderingContext.prototype.yieldEmpty = function(opt){
    var box = new Nehan.Box({
      display:this.getDisplay(),
      context:this,
      size:new Nehan.BoxSize(0,0)
    });
    box.isEmpty = true;
    Nehan.Obj.copy(box, opt || {});
    return box;
  };

  RenderingContext.prototype.yieldBlockDirect = function(){
    if(this.style.isPasted()){
      return this.yieldPastedBlock();
    }
    switch(this.style.getMarkupName()){
    case "img": return this.yieldImage();
    case "hr": return this.yieldHorizontalRule();
    }
    return null;
  };

  RenderingContext.prototype.yieldInlineDirect = function(){
    if(this.style.isPasted()){
      return this.yieldPastedLine();
    }
    switch(this.style.getMarkupName()){
    case "img": return this.yieldImage();
    }
    return null;
  };

  RenderingContext.prototype.yieldPastedLine = function(){
    return new Nehan.Box({
      type:"line-block",
      display:"inline",
      context:this,
      size:this.style.flow.getBoxSize(this.style.contentMeasure, this.style.contentExtent),
      content:this.style.getContent()
    });
  };

  RenderingContext.prototype.yieldPastedBlock = function(){
    return this.createBlockBox({
      measure:this.style.contentMeasure,
      extent:this.style.contentExtent,
      content:this.style.getContent()
    });
  };

  RenderingContext.prototype.yieldImage = function(){
    // image size always considered as horizontal mode.
    var width = this.style.getMarkupAttr("width")? parseInt(this.style.getMarkupAttr("width"), 10) : (this.style.staticMeasure || this.style.getFontSize());
    var height = this.style.getMarkupAttr("height")? parseInt(this.style.getMarkupAttr("height"), 10) : (this.style.staticExtent || this.style.getFontSize());
    var image = new Nehan.Box({
      display:this.style.display, // inline, block, inline-block
      size:new Nehan.BoxSize(width, height),
      context:this,
      edge:this.style.edge || null,
      classes:["nehan-block", "nehan-image"].concat(this.style.markup.getClasses()),
      pushed:this.style.isPushed(),
      pulled:this.style.isPulled(),
      breakAfter:this.style.isBreakAfter()
    });
    return image;
  };

  RenderingContext.prototype.yieldHorizontalRule = function(){
    return this.createBlockBox({
      elements:[],
      extent:2
    });
  };

  RenderingContext.prototype.yieldHangingChar = function(chr){
    chr.setMetrics(this.style.flow, this.style.getFont());
    var font_size = this.style.getFontSize();
    var chr_text = this.createTextBox({
      elements:[chr],
      measure:chr.bodySize,
      extent:font_size,
      charCount:0,
      maxExtent:font_size,
      maxFontSize:font_size
    });
    chr_text.hangingChar = true;
    return chr_text;
  };

  RenderingContext.prototype.yieldParallelBlocks = function(chr){
    var blocks = this.parallelGenerators.map(function(gen){
      return gen.yield();
    });

    if(blocks.every(Nehan.Closure.eq(null))){
      return null;
    }

    var flow = this.style.flow;
    var max_block =  Nehan.List.maxobj(blocks, function(block){
      return block? block.getLayoutExtent(flow) : 0;
    });
    //console.log("max parallel cell:%o(extent = %d)", max_block, max_block.getLayoutExtent());
    var wrap_measure = this.layoutContext.getInlineMaxMeasure();
    var wrap_extent = max_block.getLayoutExtent(flow);
    var inner_extent = max_block.getContentExtent(flow);
    var uniformed_blocks = blocks.map(function(block, i){
      var context = this.parallelGenerators[i].context;
      if(block === null){
	return context.createBlockBox({
	  elements:[],
	  extent:inner_extent
	});
      }
      return block.resizeExtent(flow, inner_extent);
    }.bind(this));

    return this.yieldWrapBlock(wrap_measure, wrap_extent, uniformed_blocks);
  };

  RenderingContext.prototype.yieldFloatStack = function(){
    //console.log("context::yieldFloatStack");
    if(this.hasFloatStackCache()){
      //console.log("context::use float stack cache");
      return this.popFloatStackCache();
    }
    var start_blocks = [], end_blocks = [];
    Nehan.List.iter(this.floatedGenerators, function(gen){
      var block = gen.yield();
      //console.log("float box:%o(content extent:%d)", block, block.getContentExtent());
      if(!block || block.getContentExtent() <= 0){
	return;
      }
      if(gen.context.isFloatStart()){
	start_blocks.push(block);
      } else if(gen.context.isFloatEnd()){
	end_blocks.push(block);
      }
    });
    return new Nehan.FloatGroupStack(this.style.flow, start_blocks, end_blocks);
  };

  RenderingContext.prototype.yieldFloatSpace = function(float_group, measure, extent){
    //console.info("yieldFloatSpace(float_group = %o, m = %d, e = %d)", float_group, measure, extent);
    this.child.updateContextStaticSize(measure, extent);
    this.child.floatGroup = float_group;
    return this.yieldChildLayout();
  };

  return RenderingContext;
})();

Nehan.PagedElement = (function(){
  /**
     @memberof Nehan
     @class PagedElement
     @classdesc DOM element with {@link Nehan.Document}
  */
  function NehanPagedElement(){
    this.pageNo = 0;
    this.document = new Nehan.Document();
    this.element = document.createElement("div");
  }

  /**
   check if current page position is at last.

   @memberof Nehan.PagedElement
   @return {boolean}
   */
  NehanPagedElement.prototype.isLastPage = function(){
    return this.getPageNo() + 1 >= this.getPageCount();
  };
  /**
   get inner DOMElement containning current page element.

   @memberof Nehan.PagedElement
   */
  NehanPagedElement.prototype.getElement = function(){
    return this.element;
  };
  /**
   get content text

   @memberof Nehan.PagedElement
   @return {String}
   */
  NehanPagedElement.prototype.getContent = function(){
    return this.document.getContent();
  };
  /**
   @memberof Nehan.PagedElement
   @return {int}
   */
  NehanPagedElement.prototype.getPageCount = function(){
    return this.document.getPageCount();
  };
  /**
   @memberof Nehan.PagedElement
   @param index {int}
   @return {Nehan.Page}
   */
  NehanPagedElement.prototype.getPage = function(index){
    return this.document.getPage(index);
  };
  /**
   get current page index

   @memberof Nehan.PagedElement
   @return {int}
   */
  NehanPagedElement.prototype.getPageNo = function(){
    return this.pageNo;
  };
  /**
   set inner page position to next page and return next page if exists, else null.

   @memberof Nehan.PagedElement
   @return {Nehan.Page | null}
   */
  NehanPagedElement.prototype.setNextPage = function(){
    if(this.pageNo + 1 < this.getPageCount()){
      return this.setPage(this.pageNo + 1);
    }
    return null;
  };
  /**
   set inner page posision to previous page and return previous page if exists, else null.

   @memberof Nehan.PagedElement
   @return {Nehan.Page | null}
   */
  NehanPagedElement.prototype.setPrevPage = function(){
    if(this.pageNo > 0){
      return this.setPage(this.pageNo - 1);
    }
    return null;
  };
  /**
   * set selector value. [name] is selector key, value is selector value.<br>
   * see example at setStyle of {@link Nehan.Engine}.

   @memberof Nehan.PagedElement
   @param name {String} - selector string
   @param value {selector_value}
   */
  NehanPagedElement.prototype.setStyle = function(name, value){
    this.document.setStyle(name, value);
    return this;
  };
  /**
   set selector key and values. see example at setStyles of {@link Nehan.Engine}.

   @memberof Nehan.PagedElement
   @param value {Object}
   */
  NehanPagedElement.prototype.setStyles = function(values){
    this.document.setStyles(values);
    return this;
  };
  /**
   set content string.
   @memberof Nehan.PagedElement
   @param content {String} - html text.
   */
  NehanPagedElement.prototype.setContent = function(content, opt){
    this.document.setContent(content);
    this.document.render(opt || {});
    this.setPage(0);
    return this;
  };
  /**
   start parsing.
   @memberof Nehan.PagedElement
   @param opt {Object} - optinal argument
   @param opt.onProgress {Function} - fun {@link Nehan.Box} -> {@link Nehan.PagedElement} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> {@link Nehan.PagedElement} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} - upper bound of page count
   */
  NehanPagedElement.prototype.render = function(opt){
    this.document.render(opt);
    return this;
  };
  /**
   set current page index to [page_no]

   @memberof Nehan.PagedElement
   @param page_no {int}
   @return {Nehan.Page | null}
   */
  NehanPagedElement.prototype.setPage = function(page_no){
    var page = this.getPage(page_no);
    if(page === null || page.element === null){
      //console.error("page_no(%d) is not found", page_no);
      return null;
    }
    this.pageNo = page_no;
    while(this.element.firstChild){
      this.element.removeChild(this.element.firstChild);
    }
    this.element.appendChild(page.element);
    return page;
  };
  /**<pre>
   * create outline element of "<body>",
   * if multiple body exists, only first one is returned.
   * about callback argument, see {@link Nehan.SectionTreeConverter}.
   *</pre>
   @memberof Nehan.PagedElement
   @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
   */
  NehanPagedElement.prototype.createOutlineElement = function(callbacks){
    return this.document.createOutlineElement(callbacks);
  };

  return NehanPagedElement;
})();

/**
   @namespace Nehan
   @memberof Nehan
   @method createPagedElement
   @return {Nehan.PagedElement}
*/
Nehan.createPagedElement = function(){
  return new Nehan.PagedElement();
};

Nehan.Document = (function(){
  /**
   @memberof Nehan
   @class Document
   @classdesc document abstraction for paged-media.
   @constructor
   */
  function Document(){
    this.text = "no text";
    this.styles = {};
    this.generator = null; // disabled until 'render' is called.
  }

  /**
   @memberof Nehan.Document
   @param opt {Object}
   @param opt.root {String} - html root context ['document' | 'html' | 'body']. Default value is defined in {@link Nehan.Config}.defaultRoot.
   @param opt.onProgress {Function} - fun tree:{@link Nehan.Box} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onPage {Function} - fun page:{@link Nehan.Page} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> context:{@link Nehan.RenderingContext} -> ()
   @param opt.onError {Function} - fun error:{String} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} upper bound of page count
   @return {Nehan.Document}
   */
  Document.prototype.render = function(opt){
    opt = opt || {};
    this.generator = Nehan.createRootGenerator({
      root:opt.root || Nehan.Config.defaultRoot,
      text:this.text,
      styles:this.styles
    });
    new Nehan.PageParser(this.generator).parse(opt);
    return this;
  };
  
  /**
   @memberof Nehan.Document
   @param index {int}
   @return {Nehan.Page}
   */
  Document.prototype.getPage = function(index){
    if(!this.generator){
      return null;
    }
    return this.generator.context? this.generator.context.getPage(index) : null;
  };

  /**
   @memberof Nehan.Document
   @param index {int} - page index(starts from zero).
   @return {Nehan.Page}
   */
  Document.prototype.getPageCount = function(index){
    if(!this.generator){
      return 0;
    }
    return this.generator.context? this.generator.context.getPageCount() : 0;
  };

  /**
   @memberof Nehan.Document
   @param text {String} - content html text.
   @return {Nehan.Document}
   */
  Document.prototype.setContent = function(text){
    this.text = text;
    return this;
  };

  /**
   @memberof Nehan.Document
   @return {String} - content html text.
   */
  Document.prototype.getContent = function(){
    return this.text;
  };

  /**
   @memberof Nehan.Document
   @param key {String} - selector key
   @param value {Object} - selector value
   @return {Nehan.Document}
   @example
   * var doc = new Nehan.Document();
   * doc.setStyle("body", {fontSize:"16px"});
   */
  Document.prototype.setStyle = function(key, value){
    this.styles[key] = value;
    return this;
  };

  /**
   @memberof Nehan.Document
   @param values {Object} - (selector, value) set
   @return {Nehan.Document}
   @example
   * var doc = new Nehan.Document();
   * doc.setStyles({
   *   body:{
   *     fontSize:"16px"
   *   },
   *   h1:{
   *     margin:{after:"1rem"}
   *   }
   * });
   */
  Document.prototype.setStyles = function(values){
    for(var key in values){
      this.setStyle(key, values[key]);
    }
    return this;
  };

  /**
   @memberof Nehan.Document
   @param anchor_name {String}
   @return {int}
   */
  Document.prototype.getAnchorPageNo = function(anchor_name){
    if(!this.generator){
      return -1;
    }
    return this.generator.context? this.generator.context.getAnchorPageNo(anchor_name) : -1;
  };

  /**
   @memberof Nehan.Document
   @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
   @return {DOMElement}
   */
  Document.prototype.createOutlineElement = function(callbacks){
    if(!this.generator){
      return null;
    }
    return this.generator.context? this.generator.context.createOutlineElementByName("body", callbacks) : null;
  };

  return Document;
})();

Nehan.globalStyles = Nehan.globalStyles || {};
Nehan.globalSingleTagNames = new Nehan.LowerNameSet();

/**
 set global style.

 @memberof Nehan
 @param selector_key {String}
 @param value {selector_value}
 @return {Nehan}
 */
Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.globalStyles[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.globalStyles[selector_key] = entry;
  return this;
};

/**
 set global styles.

 @memberof Nehan
 @param values {Object}
 @return {Nehan}
 */
Nehan.setStyles = function(values){
  for(var selector_key in values){
    Nehan.setStyle(selector_key, values[selector_key]);
  }
  return this;
};

/**
 set global single tag name

 @memberof Nehan
 @param name {String} - single tag name
 @return {Nehan}
*/
Nehan.addSingleTagName = function(name){
  Nehan.globalSingleTagNames.add(name);
  return this;
};

/**
 set global single tag names

 @memberof Nehan
 @param names {Array} - single tag name list
 @return {Nehan}
*/
Nehan.addSingleTagNames = function(names){
  Nehan.globalSingleTagNames.addValues(names);
  return this;
};

/**
 @param opt {Object}
 @param opt.root {String} - context root
 @param opt.text {String} - html string
 @param opt.styles {Object} - context local styles
 @return {Nehan.DocumentGenerator | Nehan.HtmlGenerator | Nehan.BodyGenerator}
 */
Nehan.createRootGenerator = function(opt){
  opt = opt || {};
  var context = new Nehan.RenderingContext({
    text:Nehan.Html.normalize(opt.text || "no text"),
    singleTagNames:(
      new Nehan.LowerNameSet()
	.addValues(Nehan.Config.defaultSingleTagNames)
	.addValues(Nehan.globalSingleTagNames.getValues())
    )
  });
  return context
    .setStyles(Nehan.globalStyles)
    .setStyles(opt.styles || {})
    .createRootGenerator(opt.root || Nehan.Config.defaultRoot);
};

/**
 @param opt {Object}
 @param opt.root {String} - context root
 @param opt.text {String} - html string
 @param opt.styles {Object} - context local styles
 @return {Nehan.RenderingContext}
 */
Nehan.createRootContext = function(opt){
  return Nehan.createRootGenerator(opt || {}).context;
};

