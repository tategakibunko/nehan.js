/*!
 nehan.js
 Copyright (C) 2010 - 2015 Watanabe Masaki<lambda.watanabe[at]gmail.com>
 repository: https://github.com/tategakibunko/nehan.js

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
Nehan.version = "5.1.0";

Nehan.Client = (function(){
  /**
     @memberof Nehan
     @class Client
     @classdesc wrapper class for user browser agent
     @constructor
  */
  function Client(){
    this.userAgent = navigator.userAgent.toLowerCase();
    this.name = navigator.appName.toLowerCase();
    this.version = parseInt(navigator.appVersion, 10);
    this._parseUserAgent(this.userAgent);
  }

  Client.prototype = {
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isWindows : function(){
      return this.userAgent.indexOf("windows") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isMacintosh : function(){
      return this.userAgent.indexOf("macintosh") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isIphone : function(){
      return this.userAgent.indexOf("iphone") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isIpod : function(){
      return this.userAgent.indexOf("ipod") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isIpad : function(){
      return this.userAgent.indexOf("ipad") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isAppleMobileFamily : function(){
      return this.isIphone() || this.isIpod() || this.isIpad();
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isAndroid : function(){
      return this.userAgent.indexOf("android") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isSmartPhone : function(){
      return this.isAppleMobileFamily() || this.isAndroid();
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isWebkit : function(){
      return this.userAgent.indexOf("webkit") >= 0;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isIE : function(){
      return this.name === "msie";
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isTrident : function(){
      return this.isIE() && this.version >= 11;
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isChrome : function(){
      return this.name === "chrome";
    },
    /**
       @memberof Nehan.Client
       @return {boolean}
    */
    isSafari : function(){
      return this.name === "safari";
    },
    _parseUserAgent : function(user_agent){
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
    },
    _parseVersionPureTrident : function(user_agent){
      if(user_agent.match(/rv:([\.\d]+)/)){
	return parseInt(RegExp.$1, 10);
      }
      return this.version;
    },
    _parseVersionNormalClient : function(user_agent, tmp_version){
      if(user_agent.match(/version\/([\.\d]+)/)){
	return parseInt(RegExp.$1, 10);
      }
      return tmp_version;
    },
    _parseVersionAppleMobileFamily : function(user_agent){
      if(user_agent.match(/os ([\d_]+) like/)){
	return parseInt(RegExp.$1, 10); // [iOS major version] = [safari major version]
      }
      return this.version;
    }
  };

  return Client;
})();

/**
   browser environment object

   @namespace Nehan.Env
*/
Nehan.Env = (function(){
  var __client = new Nehan.Client();
  var __is_transform_enable = !(__client.isIE() && __client.version <= 8);
  var __is_chrome_vert_glyph_enable = __client.isChrome() && __client.version >= 24;
  var __is_safari_vert_glyph_enable = __client.isSafari() && __client.version >= 5;
  var __is_vertical_glyph_enable = __is_chrome_vert_glyph_enable || __is_safari_vert_glyph_enable;

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
    isVerticalGlyphEnable : __is_vertical_glyph_enable
  };
})();

// current engine id
Nehan.engineId = 0;

// global style
Nehan.globalStyle = {};

// global single tags
Nehan.__single_tag_names__ = [];
Nehan.__single_tag_rexes__ = [];

/**
   set global style. see example at setStyle of {@link Nehan.Engine}.

   @memberof Nehan
   @param selector_key {String}
   @param value {selector_value}
*/
Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.globalStyle[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.globalStyle[selector_key] = entry;
};

/**
   set global styles. see example at setStyles of {@link Nehan.Engine}.

   @memberof Nehan
   @param values {Object}
 */
Nehan.setStyles = function(values){
  for(var selector_key in values){
    Nehan.setStyle(selector_key, values[selector_key]);
  }
};

/**
   set global single tag name. see example at addSingleTagByName of {@link Nehan.LexingRule}.

   @memberof Nehan
   @param tag_name {String}
*/
Nehan.addSingleTagByName = function(tag_name){
  Nehan.__single_tag_names__.push(tag_name);
};

/**
   set global single tag name by regexp object. see example at addSingleTagByRex of {@link Nehan.LexingRule}.

   @memberof Nehan
   @param rex {RegExp}
*/
Nehan.addSingleTagByRex = function(rex){
  Nehan.__single_tag_rexes__.push(rex);
};

/**
 * This function ends at nehan-setup-end.js(tail part of all source code),<br>
 * to enclose local environment(Style, Display, Config, DocumentContext etc).<br>
 * So each engine has it's own environment.<br>
 * This is usefull to show multiple layout(vertical and horizontal) in a single page.<br>
 * Note that Nehan.setup is alias name of Nehan.createEngine.
 
   @namespace Nehan
   @memberof Nehan
   @method createEngine
   @param engine_args {Object}
   @param engine_args.config {Nehan.Config} - system config
   @param engine_args.display {Nehan.Display} - standard page parameters
   @param engine_args.style {Nehan.Style} - engine local style
   @return {Nehan.Engine}
*/
Nehan.createEngine = Nehan.setup = function(engine_args){
"use strict";
var __engine_args = engine_args || {};

// each time setup is called, engine id is incremented.
Nehan.engineId++;

// this function is closed by nehan-setup-end.js

/**
   system configuration
   @namespace Nehan.Config
*/
var Config = {
  /**
     language setting
     @memberof Nehan.Config
     @type {string}
     @default "ja-JP"
  */
  lang:"ja-JP",

  /**
     is debug mode?
     @memberof Nehan.Config
     @type {boolean}
     @default false
  */
  debug:false,

  /**
     is kerning enabled?
     @memberof Nehan.Config
     @type {boolean}
     @default true
  */
  kerning:true,

  /**
     is justify enabled?
     @memberof Nehan.Config
     @type {boolean}
     @default true
  */
  justify:true,

  /**
     max rety count when something troubles.
     @memberof Nehan.Config
     @type {int}
     @default 20
  */
  maxRollbackCount:20,

  /**
     max available page count for each engine.
     @memberof Nehan.Config
     @type {int}
     @default 10000
  */
  maxPageCount:10000,

  /**
     use vertical glyph if browser support 'writing-mode'.
     @memberof Nehan.Config
     @type {boolean}
     @default true
  */
  useVerticalGlyphIfEnable:true,

  /**
     calculate strict alphabetical metrics using hidden canvas.
     @memberof Nehan.Config
     @type {boolean}
     @default true
   */
  useStrictWordMetrics:true,

  /**
     enable ommiting element by start tag.
     @memberof Nehan.Config
     @type {boolean}
     @default false
  */
  enableAutoCloseTag:false,

  /**
     disable inline style or not.
     @memberof Nehan.Config
     @type {boolean}
     @default false
  */
  disableInlineStyle:false,

  /**
     default length of html-lexer buffer.
     @memberof Nehan.Config
     @type {int}
     @default 2000
  */
  lexingBufferLen:2000
};


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
     standard line-height.

     @memberof Nehan.Display
     @type {Float}
     @default 2.0
  */
  lineHeight: 2.0,
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
     @default "https://raw.githubusercontent.com/tategakibunko/nehan.js/master/char-img"
  */
  fontImgRoot:"https://raw.githubusercontent.com/tategakibunko/nehan.js/master/char-img",

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


/**
   module of html lexing rule

   @namespace Nehan.LexingRule
*/
var LexingRule = (function(){
  var __single_tag_names__ = [
    "br",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "wbr",
    "?xml",
    "!doctype",
    "page-break",
    "end-page",
    "pbr"
  ];

  var __is_single_tag = function(tag_name){
    return List.exists(__single_tag_names__, Closure.eq(tag_name));
  };

  return {
    /**
       @memberof Nehan.LexingRule
       @return {Array.<String>}
    */
    getSingleTagNames : function(){
      return __single_tag_names__;
    },
    /**
       @memberof Nehan.LexingRule
       @param tag_name {String}
       @return {boolean}
       @example
       * LexingRule.isSingleTag("img"); // true
       * LexingRule.isSingleTag("br"); // true
       * LexingRule.isSingleTag("div"); // false
    */
    isSingleTag : function(tag_name){
      return __is_single_tag(tag_name) || false;
    },
    /**
       @memberof Nehan.LexingRule
       @param tag_name {String}
       @example
       * LexingRule.addSingleTagByName("my-custom-single-tag");
       * LexingRule.isSingleTag("my-custom-single-tag"); // true
    */
    addSingleTagByName : function(tag_name){
      tag_name = tag_name.toLowerCase();
      if(!__is_single_tag(tag_name)){
	__single_tag_names__.push(tag_name);
      }
    }
  };
})();


/**
   @namespace Nehan.Style
   @description <pre>

  Important notices about style.js
  ================================

  1. camel case property is not allowed
  -------------------------------------

    OK: {font-size:"16px"}
    NG: {fontSize:"16px"}

  2. some properties uses 'logical' properties
  --------------------------------------------

    [examples]
    Assume that Display.direction is "hori" and Display["hori"] is "lr-tb".

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

  (5.1) box-sizing:[content-box | border-box | margin-box(default)]

  In box-sizing, 'margin-box' is special value in nehan.js, and is box-sizing default value.
  In margin-box, even if margin is included in box-size.

  Why? In normal html, outer size of box can be expanded,
  but in paged layout, outer size is strictly fixed.
  So if you represent margin/border/padding(called in edge in nehan.js),
  the only way is 'eliminating content space'.

  (5.2) flow:[lr-tb | rl-tb | tb-rl | tb-lr | flip]

  This property represent document-mode in nehan.js.

  'lr-tb' means inline flows 'left to right', block flows 'top to bottom'.

  'tb-rl' means inline flows 'top to bottom', block flows 'right to left', and so on.

  'flip' means toggle Display["hori"] and Display["vert"].
  for example, assume that Display["hori"] is "lr-tb", and Display["vert"] is "tb-rl",
  and current document direction(Display.direction) is "hori",
  flow:"flip" means Display["vert"], "tb-rl".
</pre>
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
    "font-size":"2.4em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"0.5em"
    }
  },
  "h2":{
    "display":"block",
    "font-size":"2.0em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"0.75em"
    }
  },
  "h3":{
    "display":"block",
    "font-size":"1.6em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"1em"
    }
  },
  "h4":{
    "display":"block",
    "font-size":"1.4em",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"1.25em"
    }
  },
  "h5":{
    "display":"block",
    "font-size":"1.0em",
    "font-weight":"bold",
    "font-family":"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
    "margin":{
      "after":"1.5em"
    }
  },
  "h6":{
    "display":"block",
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
    "box-sizing":"content-box"
  },
  "input":{
    "display":"inline",
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
    "line-height":"1.5em"
  },
  "li":{
    "display":"list-item",
    "margin":{
      "after":"0.6em"
    }
  },
  "link":{
    "meta":true
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
    "meta":true
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
      "after":"1em"
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
    "line-height":"1.0em",
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
    "table-layout":"fixed",
    //"table-layout":"auto",
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
    "line-height":"1.4em",
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
    "display":"inline"
  },
  //-------------------------------------------------------
  // tag / others
  //-------------------------------------------------------
  "?xml":{
  },
  "!doctype":{
  },
  // <page-break>, <pbr>, <end-page> are all same and nehan.js original tag,
  // defined to keep compatibility of older nehan.js document,
  // and must be defined as logical-break-before, logical-break-after props in the future.
  "page-break":{
    "display":"inline"
  },
  "pbr":{
    "display":"inline"
  },
  "end-page":{
    "display":"inline"
  },
  //-------------------------------------------------------
  // rounded corner
  //-------------------------------------------------------
  ".nehan-rounded":{
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
  ".nehan-xx-large":{
    "font-size": Display.fontSizeNames["xx-large"]
  },
  ".nehan-x-large":{
    "font-size": Display.fontSizeNames["x-large"]
  },
  ".nehan-large":{
    "font-size": Display.fontSizeNames.large
  },
  ".nehan-medium":{
    "font-size": Display.fontSizeNames.medium
  },
  ".nehan-small":{
    "font-size": Display.fontSizeNames.small
  },
  ".nehan-x-small":{
    "font-size": Display.fontSizeNames["x-small"]
  },
  ".nehan-xx-small":{
    "font-size": Display.fontSizeNames["xx-small"]
  },
  ".nehan-larger":{
    "font-size": Display.fontSizeNames.larger
  },
  ".nehan-smaller":{
    "font-size": Display.fontSizeNames.smaller
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
  ".nehan-disp-none":{
    "display":"none"
  },
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
  // word-break
  //-------------------------------------------------------
  ".nehan-wb-all":{
    "word-break":"break-all"
  },
  ".nehan-wb-normal":{
    "word-break":"normal"
  },
  ".nehan-wb-keep":{
    "word-break":"keep-all"
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
    "line-height":"1.0em",
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

/**
   @namespace Nehan.Class
*/
var Class = {};

/**
   @memberof Nehan.Class
   @param childCtor {Object}
   @param parentCtor {Object}
   @return {Object}
*/
Class.extend = function(childCtor, parentCtor) {
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
var List = {
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> ()
  */
  iter : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      fn(lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun index -> obj -> ()
  */
  iteri : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      fn(i, lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> ()
  */
  reviter : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      fn(lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun index -> obj -> ()
  */
  reviteri : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      fn(i, lst[i]);
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
      if(!fn(lst[i])){
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
      ret.push(fn(lst[i]));
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun index -> obj -> obj
     @return {Array}
  */
  mapi : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret.push(fn(i, lst[i]));
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
      ret = fn(ret, lst[i]);
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
      if(fn(lst[i])){
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
      if(fn(obj)){
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
      if(fn(obj)){
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
      if(fn(obj)){
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
      if(fn(lst[i])){
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
    this.iter(lst, function(obj){
      var val = fn(obj);
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
    this.iter(lst, function(obj){
      var val = fn(obj);
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
     @return {Array}
  */
  refcopy : function(lst){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret[i] = lst[i];
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {int}
  */
  count : function(lst, fn){
    var ret = 0;
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	ret++;
      }
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param count {int} - array length
     @param init_val - initialized value filled in new array
     @return {Array}
  */
  create : function(count, init_val){
    var ret = new Array(count);
    if(typeof init_val != "undefined"){
      for(var i = 0; i < count; i++){
	ret[i] = init_val;
      }
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @return {first_object | null}
  */
  first : function(lst){
    return lst[0] || null;
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
     @param lst1 {Array}
     @param lst2 {Array}
     @return {Array.<Array>}
  */
  zip : function(lst1, lst2){
    var ret = [];
    for(var i = 0, len = Math.min(lst1.length, lst2.length); i < len; i++){
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
     * List.zipObj(["a", "b", "c"], [1, 2, 3]); // {a:1, b:2, c:3}
  */
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
var Obj = {
  /**
     @memberof Nehan.Obj
     @param obj {Object}
     @return {boolean}
  */
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
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
     @param fn {Function} - fun prop -> value -> {boolean}
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
  }
};

/**
   misc utility module.

   @namespace Nehan.Utils
*/
var Utils = {
  /**
     @memberof Nehan.Utils
     @param str {String}
  */
  trimHeadCRLF : function(str){
    return str.replace(/^\n+/, "");
  },
  /**
     @memberof Nehan.Utils
     @param str {String}
  */
  trimFootCRLF : function(str){
    return str.replace(/\n+$/, "");
  },
  /**
     @memberof Nehan.Utils
     @param str {String}
  */
  trimCRLF : function(str){
    return this.trimFootCRLF(this.trimHeadCRLF(str));
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
     * Nehan.Utils.camelize("font-size"); // "fontSize"
  */
  camelize : function(name){
    var self = this;
    return (name.indexOf("-") < 0)? name : List.mapi(name.split("-"), function(i, part){
      return (i === 0)? part : self.capitalize(part);
    }).join("");
  }
};

/**
   @namespace Nehan.MathUtils
*/
var MathUtils = {
  /**
     convert [decial] number by [base]

     @memberof Nehan.MathUtils
     @param deciaml {int}
     @param base {int}
     @return {int}
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
  }
};


/**
   requestAnimationFrame wrapper function
   @namespace Nehan
   @function reqAnimationFrame
*/
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
   some set of usefull constant variables.
   @namespace Nehan.Const
*/
var Const = {
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
  cssCorders:[
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssBorderRadius:[
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-left-radius",
    "border-bottom-right-radius"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssBoxDirs:[
    "top",
    "right",
    "bottom",
    "left"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssBoxDirsLogical:[
    "before",
    "end",
    "after",
    "start"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssBoxCornersLogical:[
    "start-before",
    "end-before",
    "end-after",
    "start-after"
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
var Css = {
  /**
     @memberof Nehan.Css
     @param args {Object}
     @return {String}
     @example
     * Css.toString({"color":"red", "font-size":16}); // "color:'red'; 'font-size':16"
  */
  toString : function(args){
    var tmp = [];
    for(var prop in args){
      tmp.push(prop + ":" + args[prop]);
    }
    return tmp.join(";");
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Css.addNehanPrefix("foo"); // "nehan-foo"
  */
  addNehanPrefix : function(name){
    return "nehan-" + name;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Css.addNehanHeaderPrefix("foo"); // "nehan-header-foo"
  */
  addNehanHeaderPrefix : function(name){
    return "nehan-header-" + name;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Css.addNehanTocLinkPrefix("foo"); // "nehan-toc-link-foo"
  */
  addNehanTocLinkPrefix : function(name){
    return "nehan-toc-link-" + name;
  },
  /**
     set vender-prefixed css value like(-webkit-opacity, -moz-opacity etc).

     @memberof Nehan.Css
     @param 
     @param dst {Object}
     @param name {String}
     @param value {String}
     @return {Object}
     @example
     * Css.setCssValueWithVender({}, "writing-mode", "vertical-rl");
  */
  setCssValueWithVender: function(dst, name, value){
    dst[name] = value; // no prefixed version
    List.iter(Const.cssVenderPrefixes, function(prefix){
      dst[prefix + "-" + name] = value;
    });
    return dst;
  }
};

/**
   html utility module

   @namespace Nehan.Html
*/
var Html = {
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
      .replace(/'/g, "&#039;")
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
    * Html.attr({width:"100", height:"200"}); // width='100' height = '200'
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
     * Html.tagWrap("a", "homepage", {href:"#"}); // "<a href='#'>homepage</a>"
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
     * Html.tagSingle("img", {src:"/path/to/img"}); // "<img src='/path/to/img' />"
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
     * Html.tagStart("div"); // "<div>"
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
     * Html.tagEnd("div"); // "</div>"
  */
  tagEnd : function(name){
    return "</" + name + ">";
  }
};

/**
   closure factory
   @namespace Nehan.Closure
*/
var Closure = {
  /**
     @memberof Nehan.Closure
     @return {Function}
     @example
     * var echo = Closure.id();
     * echo(1); // 1
     * echo("yo"); // "yo"
  */
  id : function(){
    return function(x){
      return x;
    };
  },
  /**
     @memberof Nehan.Closure
     @return {Function}
     @example
     * var is_one = Closure.eq(1);
     * is_one(1); // true
     * is_one(2); // false
  */
  eq : function(x){
    return function(y){
      return x == y;
    };
  },
  /**
     @memberof Nehan.Closure
     @return {Function}
     @example
     * var is_not_one = Closure.neq(1);
     * is_not_one(1); // false
     * is_not_one(2); // true
  */
  neq : function(x){
    return function(y){
      return x != y;
    };
  }
};

/**
   @namespace Nehan.Args
*/
var Args = {
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
     copy all value in [args] to [dst] recursively
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} args
     @return {Object} copied dst
  */
  copy2 : function(dst, args){
    dst = dst || {};
    for(var prop in args){
      if(typeof dst[prop] === "object"){
	this.copy2(dst[prop], args[prop]);
      } else {
	dst[prop] = args[prop];
      }
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
  }
};

var HashSet = (function(){
  /**
     @memberof Nehan
     @class HashSet
     @classdesc abstraction of (key, value) set.
     @constructor
   */
  function HashSet(){
    this._values = {};
  }

  HashSet.prototype = {
    /**
       @memberof Nehan.HashSet
       @param fn {Function}
    */
    iter : function(fn){
      Obj.iter(this._values, fn);
    },
    /**
       @memberof Nehan.HashSet
       @param fn {Function}
    */
    filter : function(fn){
      return Obj.filter(this._values, fn);
    },
    /**
       merge new value to old value with same key. simply overwrite by default.

       @memberof Nehan.HashSet
       @param old_value
       @param new_value
    */
    merge : function(old_value, new_value){
      return new_value;
    },
    /**
       return union set between this and [set].

       @memberof Nehan.HashSet
       @param set {Nehan.HashSet}
     */
    union : function(set){
      var self = this;
      set.iter(function(key, value){
	self.add(key, value);
      });
      return this;
    },
    /**
       get value by name(key).

       @memberof Nehan.HashSet
       @name {String}
       @return {value}
    */
    get : function(name){
      return this._values[name] || null;
    },
    /**
       add [value] by [name]. HashSet::merge is called if [name] is already registered.

       @memberof Nehan.HashSet
       @param name {String}
       @param value
    */
    add : function(name, value){
      var old_value = this._values[name] || null;
      this._values[name] = old_value? this.merge(old_value, value) : value;
    },
    /**
     * this function is used when performance matters,<br>
     * instead of using this.union(new HashSet(values))

       @memberof Nehan.HashSet
       @param values {Array}
    */
    addValues : function(values){
      values = values || {};
      for(var prop in values){
	this.add(prop, values[prop]);
      }
    },
    /**
       remove value associated with [name].

       @memberof Nehan.HashSet
       @param name {String}
    */
    remove : function(name){
      delete this._values[name];
    }
  };

  return HashSet;
})();




var CssHashSet = (function(){
  /**
     @memberof Nehan
     @class CssHashSet
     @classdesc hash set for css
     @extends {Nehan.HashSet}
  */
  function CssHashSet(){
    HashSet.call(this);
  }
  Class.extend(CssHashSet, HashSet);

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
    if(typeof old_value === "object"){
      Args.copy(old_value, new_value);
      return old_value;
    }
    return new_value;
  };

  /**
     @memberof Nehan.CssHashSet
     @method copyValuesTo
     @param dst {Object}
  */
  CssHashSet.prototype.copyValuesTo = function(dst){
    return Args.copy(dst, this._values);
  };

  return CssHashSet;
})();

/**
<pre>
  there are css properties that are required to calculate accurate paged-layout,
  and we call them 'managed css properties'.

  managed css properties
  ======================
  after(nehan.js local property, same as 'bottom' if lr-tb)
  before(nehan.js local property, same as 'top' if lr-tb)
  border
  border-width
  border-radius(rounded corner after/before is cleared if page is divided into multiple pages)
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
  width</pre>

  @namespace Nehan.CssParser
*/
var CssParser = (function(){
  var __normalize = function(value){
    return Utils.trim(String(value))
      .replace(/;/g, "")
      .replace(/\n/g, "");
  };

  var __split_space = function(value){
    return (value.indexOf(" ") < 0)? [value] : value.split(/\s+/);
  };

  var __split_slash = function(value){
    return (value.indexOf("/") < 0)? [value] : value.split("/");
  };

  // props: [a,b,c]
  // values:[1,2,3]
  // => {a:1, b:2, c:3}
  var __zip_obj = function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:__zip_obj";
    }
    List.iteri(props, function(i, prop){ ret[prop] = values[i]; });
    return ret;
  };

  var __get_map_2d = function(len){
    return Const.css2dIndex[Math.min(len, 2)] || [];
  };

  var __get_map_4d = function(len){
    return Const.css4dIndex[Math.min(len, 4)] || [];
  };

  // values:[a,b]
  // map: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var __make_values_by_map = function(values, map){
    return List.map(map, function(index){ return values[index]; });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var __make_values_2d = function(values){
    var map = __get_map_2d(values.length);
    return __make_values_by_map(values, map);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0, 1, 0, 1]
  // values:[0,2,3] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var __make_values_4d = function(values){
    var map = __get_map_4d(values.length);
    return __make_values_by_map(values, map);
  };

  var __make_edge_4d = function(values){
    var props = Const.cssBoxDirsLogical; // len = 4
    var values_4d = __make_values_4d(values); // len = 4
    return List.zipObj(props, values_4d);
  };

  var __make_corner_4d = function(values){
    var props = Const.cssBoxCornersLogical; // len = 4
    var values_4d = __make_values_4d(values); // len = 4
    return __zip_obj(props, values_4d);
  };

  var __parse_4d = function(value){
    return __make_edge_4d(__split_space(value));
  };

  var __parse_corner_4d = function(value){
    var values_2d = __make_values_2d(__split_slash(value));
    var values_4d_2d = List.map(values_2d, function(val){
      return __make_values_4d(__split_space(val));
    });
    var values = List.zip(values_4d_2d[0], values_4d_2d[1]);
    return __make_corner_4d(values);
  };

  var __parse_border_abbr = function(value){
    var ret = [];
    var values = __split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"border-width":__parse_4d(values[0])});
    }
    return ret;
  };

  var __parse_list_style_abbr = function(value){
    var ret = [];
    var values = __split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"list-style-type":__parse_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"list-style-image":__parse_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"list-style-position":__parse_4d(values[2])});
    }
    return ret;
  };

  var __parse_font_abbr = function(value){
    return {}; // TODO
  };

  var __parse_background_abbr = function(value){
    return {}; // TODO
  };

  // all subdivided properties are evaluated as unified value.
  // for example, 'margin-before:1em' => 'margin:1em 0 0 0'.
  // so subdivided properties must be renamed to unified property('margin-before' => 'margin').
  var __format_prop = function(prop){
    if(prop.indexOf("margin-") >= 0 || prop.indexOf("padding-") >= 0 || prop.indexOf("border-width-") >= 0){
      return prop.split("-")[0];
    }
    return prop;
  };

  var __format_value = function(prop, value){
    switch(typeof value){
    case "function": case "object": case "boolean":
      return value;
    }
    value = __normalize(value); // number, string
    switch(prop){
      /* TODO: border abbr
    case "border":
      return __parse_border_abbr(value);
      */
    case "border-width":
      return __parse_4d(value);
    case "border-radius":
      return __parse_corner_4d(value);
    case "border-color":
      return __parse_4d(value);
    case "border-style":
      return __parse_4d(value);

      /* TODO: font abbr
    case "font":
      return __parse_font_abbr(value);
      */

      /* TODO: list-style abbr
    case "list-style":
      return __parse_list_style_abbr(value);
      */
    case "margin":
      return __parse_4d(value);
    case "padding":
      return __parse_4d(value);

    // subdivided properties
    case "margin-before": case "padding-before": case "border-width-before":
      return {before:value};
    case "margin-end": case "padding-end": case "border-width-end":
      return {end:value};
    case "margin-after": case "padding-after": case "border-width-after":
      return {after:value};
    case "margin-start": case "padding-start": case "border-width-start":
      return {start:value};      

    // unmanaged properties is treated as it is.
    default: return value;
    }
  };

  return {
    /**
       @memberof Nehan.CssParser
       @param prop {String} - css property name
       @return {String} normalized property name
       @example
       * CssParser.formatProp("margin-start"); // => "margin"
    */
    formatProp : function(prop){
      return __format_prop(prop);
    },
    /**
       @memberof Nehan.CssParser
       @param prop {String} - css property name
       @param value - css value
       @return {Object|int|string|boolean|function}
       @example
       * CssParser.formatValue("margin-start", "1em"); // => {start:"1em"}
       * CssParser.formatValue("margin", "1em 1em 0 0"); // => {before:"1em", end:"1em", after:0, start:0}
    */
    formatValue : function(prop, value){
      return __format_value(prop, value);
    }
  };
})();


var AttrSelector = (function(){
  /**
     @memberof Nehan
     @class AttrSelector
     @classdesc css attribute selector
     @constructor
     @param {string} expr - attribute selector string
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

  AttrSelector.prototype = {
    _normalize : function(expr){
      return expr.replace(/\[/g, "").replace(/\]/g, "");
    },
    _parseSymbol : function(expr){
      var match = expr.match(__rex_symbol);
      if(match){
	return match[0];
      }
      return "";
    },
    _parseOp : function(expr){
      return List.find(__op_symbols, function(symbol){
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
    /**
       @memberof Nehan.AttrSelector
       @method test
       @param style {Nehan.StyleContext}
       @return {boolean} true if style is matched to this attribute selector.
    */
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
  /**
     @memberof Nehan
     @class PseudoSelector
     @classdesc abstraction of css pseudo element or pseudo class selector
     @constructor
     @param expr {String}
     @example
     * var ps = new PseudoSelector("::first-letter").hasPseudoElement(); // true
  */
  function PseudoSelector(expr){
    this.name = this._normalize(expr);
  }

  PseudoSelector.prototype = {
    /**
       @memberof Nehan.PseudoSelector
       @return {boolean}
    */
    hasPseudoElement : function(){
      return (this.name === "before" ||
	      this.name === "after" ||
	      this.name === "first-letter" ||
	      this.name === "first-line");
    },
    /**
       @memberof Nehan.PseudoSelector
       @param style {Nehan.StyleContext}
       @return {boolean}
    */
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
var TypeSelector = (function(){
  /**
     @memberof Nehan
     @class TypeSelector
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
  function TypeSelector(opt){
    this.name = opt.name || null;
    this.nameRex = opt.nameRex || null;
    this.id = opt.id || null;
    this.classes = opt.classes || [];
    this.attrs = opt.attrs || [];
    this.pseudo = opt.pseudo || null;
  }
  
  TypeSelector.prototype = {
    test : function(style){
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
    },
    testName : function(markup_name){
      if(this.name === null){
	return false;
      }
      if(this.name === "*"){
	return true;
      }
      return markup_name === this.name;
    },
    testNameRex : function(markup_name){
      if(this.nameRex === null){
	return false;
      }
      return this.nameRex.test(markup_name);
    },
    testClassNames : function(markup_classes){
      return List.forall(this.classes, function(klass){
	return List.exists(markup_classes, Closure.eq(klass));
      });
    },
    getNameSpec : function(){
      if(this.nameRex){
	return 1;
      }
      if(this.name === null || this.name === "*"){
	return 0;
      }
      return 1;
    },
    getIdSpec : function(){
      return this.id? 1 : 0;
    },
    getClassSpec : function(){
      return this.classes.length;
    },
    getAttrSpec : function(){
      return this.attrs.length;
    },
    getPseudoClassSpec : function(){
      if(this.pseudo){
	return this.pseudo.hasPseudoElement()? 0 : 1;
      }
      return 0;
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
  var __rex_pseudo = /^:{1,2}[\w-_]+/;

  SelectorLexer.prototype = {
    /**
       @memberof Nehan.SelectorLexer
       @return {Array.<Nehan.TypeSelector>}
    */
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
      return new TypeSelector({
	name:name,
	nameRex:name_rex,
	id:id,
	classes:classes,
	attrs:attrs,
	pseudo:pseudo
      });
    },
    _getName : function(){
      return this._getByRex(__rex_name);
    },
    // type name defined by regexp
    // "/h[1-6]/.nehan-some-class span"
    // => /h[1-6]/
    _getNameRex : function(){
      var name_rex = this._getByRex(__rex_name_by_rex);
      if(name_rex === null){
	return null;
      }
      return new RegExp(name_rex.replace(/[\/]/g, ""));
    },
    _getId : function(){
      var id = this._getByRex(__rex_id);
      return id? id.substring(1) : null;
    },
    _getClasses : function(){
      var classes = [];
      while(true){
	var klass = this._getClass();
	if(klass === null){
	  break;
	}
	classes.push(klass);
      }
      return classes;
    },
    _getClass : function(){
      var klass = this._getByRex(__rex_class);
      return klass? klass.substring(1) : null;
    },
    _getAttrs : function(){
      var attrs = [];
      while(true){
	var attr = this._getByRex(__rex_attr);
	if(attr === null){
	  break;
	}
	attrs.push(new AttrSelector(attr));
      }
      return attrs;
    },
    _getPseudo : function(){
      var pseudo = this._getByRex(__rex_pseudo);
      return pseudo? new PseudoSelector(pseudo) : null;
    }
  };

  return SelectorLexer;
})();


/**
   state machine module to check if some selector is matched to destination style context.

   @namespace Nehan.SelectorStateMachine
*/
var SelectorStateMachine = (function(){
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
       return true if all the selector-tokens({@link Nehan.TypeSelector} or combinator) matches the style-context.

       @memberof Nehan.SelectorStateMachine
       @param style {Nehan.StyleContext}
       @param tokens {Array.<Nehan.TypeSelector> | combinator_string}
       @return {boolean}
    */
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


// Selector = [TypeSelector | TypeSelector + combinator + Selector]
var Selector = (function(){
  /**
     @memberof Nehan
     @class Selector
     @classdesc abstraction of css selector.
     @constructor
     @param key {String}
     @param value {css_value}
  */
  function Selector(key, value){
    this.key = this._normalizeKey(key); // selector source like 'h1 > p'
    this.value = this._formatValue(value); // associated css value object like {font-size:16px}
    this.elements = this._getSelectorElements(this.key); // [type-selector | combinator]
    this.spec = this._countSpec(this.elements); // count specificity
  }

  Selector.prototype = {
    /**
       @memberof Nehan.Selector
       @param style {Nehan.StyleContext}
       @return {boolean}
    */
    test : function(style){
      return SelectorStateMachine.accept(style, this.elements);
    },
    /**
       @memberof Nehan.Selector
       @param style {Nehan.StyleContext}
       @param element_name {String} - "before", "after", "first-line", "first-letter"
       @return {boolean}
    */
    testPseudoElement : function(style, element_name){
      return this.hasPseudoElementName(element_name) && this.test(style);
    },
    /**
       @memberof Nehan.Selector
       @param value {css_value}
    */
    updateValue : function(value){
      for(var prop in value){
	var fmt_value = CssParser.formatValue(prop, value[prop]);
	var fmt_prop = CssParser.formatProp(prop);
	var old_value = this.value[fmt_prop] || null;
	if(old_value !== null && typeof old_value === "object" && typeof fmt_value === "object"){
	  Args.copy(old_value, fmt_value);
	} else {
	  this.value[fmt_prop] = fmt_value; // direct value or function
	}
      }
    },
    /**
       @memberof Nehan.Selector
       @return {String}
    */
    getKey : function(){
      return this.key;
    },
    /**
       @memberof Nehan.Selector
       @return {css_value}
    */
    getValue : function(){
      return this.value;
    },
    /**
       @memberof Nehan.Selector
       @return {int} selector specificity
    */
    getSpec : function(){
      return this.spec;
    },
    /**
       @memberof Nehan.Selector
       @return {boolean}
    */
    hasPseudoElement : function(){
      return this.key.indexOf("::") >= 0;
    },
    /**
       @memberof Nehan.Selector
       @param element_name {String} - "first-letter", "first-line"
       @return {boolean}
    */
    hasPseudoElementName : function(element_name){
      return this.key.indexOf("::" + element_name) >= 0;
    },
    // count selector 'specificity'
    // see http://www.w3.org/TR/css3-selectors/#specificity
    _countSpec : function(elements){
      var a = 0, b = 0, c = 0;
      List.iter(elements, function(token){
	if(token instanceof TypeSelector){
	  a += token.getIdSpec();
	  b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	  c += token.getNameSpec();
	}
      });
      return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
    },
    _getSelectorElements : function(key){
      var lexer = new SelectorLexer(key);
      return lexer.getTokens();
    },
    _normalizeKey : function(key){
      key = (key instanceof RegExp)? "/" + key.source + "/" : key;
      return Utils.trim(key).toLowerCase().replace(/\s+/g, " ");
    },
    _formatValue : function(value){
      var ret = {};
      for(var prop in value){
	var fmt_prop = CssParser.formatProp(prop);
	var fmt_value = CssParser.formatValue(prop, value[prop]);
	ret[fmt_prop] = fmt_value;
      }
      return ret;
    }
  };

  return Selector;
})();


/**
   all selector values managed by layout engine.

   @namespace Nehan.Selectors
 */
var Selectors = (function(){
  var __selectors = []; // selector list ordered by specificity desc.
  var __selectors_pe = []; // selector (with pseudo-element) list, ordered by specificity desc.

  // sort __selectors by specificity asc.
  // so higher specificity overwrites lower one.
  var __sort_selectors = function(){
    __selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var __sort_selectors_pe = function(){
    __selectors_pe.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var __is_pe_key = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  var __find_selector = function(selector_key){
    var dst_selectors = __is_pe_key(selector_key)? __selectors_pe : __selectors;
    return List.find(dst_selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  var __update_value = function(selector_key, value){
    var style_value = Style[selector_key]; // old style value, must be found
    Args.copy(style_value, value); // overwrite new value to old
    var selector = __find_selector(selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value);
  };

  var __insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.hasPseudoElement()){
      __selectors_pe.push(selector);
    } else {
      __selectors.push(selector);
    }
    // to speed up 'init_selectors' function, we did not sort immediatelly after inserting value.
    // we sort entries after all selector_key and value are registered.
    return selector;
  };

  // apply Selector::test to style.
  // if matches, copy selector value to result object.
  // offcource, higher specificity overwrite lower one.
  var __get_value = function(style){
    return List.fold(__selectors, {}, function(ret, selector){
      return selector.test(style)? Args.copy(ret, selector.getValue()) : ret;
    });
  };

  // 'p::first-letter'
  // => style = 'p', pseudo_element_name = 'first-letter'
  var __get_value_pe = function(style, pseudo_element_name){
    return List.fold(__selectors_pe, {}, function(ret, selector){
      return selector.testPseudoElement(style, pseudo_element_name)? Args.copy(ret, selector.getValue()) : ret;
    });
  };

  var __set_value = function(selector_key, value){
    // if selector_key already defined, just overwrite it.
    if(Style[selector_key]){
      __update_value(selector_key, value);
      return;
    }
    __insert_value(selector_key, value);

    var selector = __insert_value(selector_key, value);

    // notice that '__sort_selectors'(or '__sort_selectors_pe') is not called in '__insert_value'.
    Style[selector_key] = selector.getValue();
    if(selector.hasPseudoElement()){
      __sort_selectors_pe();
    } else {
      __sort_selectors();
    }
  };

  var __init_selectors = function(){
    // initialize selector list
    Obj.iter(Style, function(key, value){
      __insert_value(key, value);
    });
    __sort_selectors();
    __sort_selectors_pe();
  };

  __init_selectors();

  return {
    /**
       @memberof Nehan.Selectors
       @param selector_key {String}
       @param value {css_value}
       @example
       * Selectors.setValue("li.foo", {"font-size":19});
    */
    setValue : function(selector_key, value){
      __set_value(selector_key, value);
    },
    /**
       @memberof Nehan.Selectors
       @param values {Object}
       @example
       * Selectors.setValues({
       *   "body":{"color":"red", "background-color":"white"},
       *   "h1":{"font-size":24}
       * });
    */
    setValues : function(values){
      for(var selector_key in values){
	__set_value(selector_key, values[selector_key]);
      }
    },
    /**
       get selector css that matches to the style context.

       @memberof Nehan.Selectors
       @param style {Nehan.StyleContext}
       @return {css_value}
    */
    getValue : function(style){
      return __get_value(style);
    },
    /**<pre>
     * get selector css that matches to the pseudo element of some style context.
     * notice that if selector_key is "p::first-letter",
     * pseudo-element is "first-letter" and style-context is "p".
     *</pre>

       @memberof Nehan.Selectors
       @param style {Nehan.StyleContext} - 'parent' style context of pseudo-element
       @param pseudo_element_name {String} - "first-letter", "first-line", "before", "after"
       @return {css_value}
    */
    getValuePe : function(style, pseudo_element_name){
      return __get_value_pe(style, pseudo_element_name);
    }
  };
})();

var TagAttrLexer = (function(){
  var __rex_symbol = /[^=\s]+/;

  /**
     @memberof Nehan
     @class TagAttrLexer
     @classdesc tag attribute string lexer
     @constructor
     @param src {String}
     @description <pre>
     * lexer src is attribute parts of original tag source.
     * so if tag source is "<div class='nehan-float-start'>",
     * then lexer src is "class='nehan-float-start'".
     </pre>
  */
  function TagAttrLexer(src){
    this.buff = src;
    this._error = false;
  }

  TagAttrLexer.prototype = {
    /**
       @memberof Nehan.TagAttrLexer
       @return {boolean}
    */
    isEnd : function(){
      return this._error || (this.buff === "");
    },
    /**
       @memberof Nehan.TagAttrLexer
       @return {symbol}
    */
    get : function(){
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
    },
    _peek : function(){
      return this.buff? this.buff.charAt(0) : null;
    },
    _step : function(length){
      this.buff = this.buff.substring(length);
    },
    _getSymbol : function(){
      //var symbol = HtmlLexer.prototype._getByRex.call(this, __rex_symbol);
      var match = this.buff.match(__rex_symbol);
      var symbol = match? match[0] : null;
      if(symbol){
	this._step(symbol.length);
      }
      return symbol;
    },
    _getLiteral : function(quote_char){
      var quote_end_pos = this.buff.indexOf(quote_char, 1);
      if(quote_end_pos < 0){
	console.error("TagAttrLexer::syntax error:literal not closed(%s)", this.buff);
	this._error = true;
	return null;
      }
      var literal = this.buff.substring(1, quote_end_pos);
      this._step(quote_end_pos + 1);
      return literal;
    }
  };

  return TagAttrLexer;
})();


var TagAttrParser = (function(){
  /**
     @memberof Nehan
     @class TagAttrParser
     @classdesc tag attribute parser
     @constructor
     @param src {String}
  */
  function TagAttrParser(src){
    this._lexer = new TagAttrLexer(src);
    this._attrs = {};
    this._left = null;
  }

  TagAttrParser.prototype = {
    /**
       @memberof Nehan.TagAttrParser
       @return {Object}
    */
    parse : function(){
      while(!this._isEnd()){
	this._parseAttr();
      }
      return this._attrs;
    },
    _isEnd : function(){
      return this._left === null && this._lexer.isEnd();
    },
    _parseAttr : function(){
      var token = this._lexer.get();
      if(token === null){
	if(this._left){
	  this._attrs[this._left] = "true";
	  this._left = null;
	}
      } else if(token === "="){
	if(this._left === null){
	  throw "TagAttrParser::syntax error(=)";
	}
	this._attrs[this._left] = this._lexer.get() || "true";
	this._left = null;
	return;
      } else if(this._left){
	this._attrs[this._left] = "true";
	this._left = token;
      } else {
	this._left = token;
      }
    }
  };

  return TagAttrParser;
})();

var TagAttrs = (function(){
  /**
     @memberof Nehan
     @class TagAttrs
     @classdesc tag attribute set wrapper
     @constructor
     @param src {String}
  */
  function TagAttrs(src){
    var attrs_raw = src? (new TagAttrParser(src)).parse() : {};
    this.classes = this._parseClasses(attrs_raw);
    this.attrs = this._parseAttrs(attrs_raw, this.classes);
    this.dataset = this._parseDataset(attrs_raw);
  }

  var __data_name_of = function(name){
    return Utils.camelize(name.slice(5));
  };

  TagAttrs.prototype = {
    /**
       @memberof Nehan.TagAttrs
       @param name {String} - attribute name
       @return {boolean}
    */
    hasAttr : function(name){
      return (typeof this.attrs.name !== "undefined");
    },
    /**
       @memberof Nehan.TagAttrs
       @param klass {String} - css class name
       @return {boolean}
    */
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    /**
     * add class name, but note that all css classes is force added prefix 'nehan-'.<br>
     * that is, if you add class "foo", it's registered as "nehan-foo"<br>
     * to avoid external css classes defined in client browser window.

       @memberof Nehan.TagAttrs
       @param klass {String} - css class name
       @return {Array.<String>} current css classes
    */
    addClass : function(klass){
      klass = (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      if(!this.hasClass(klass)){
	this.classes.push(klass);
	this.setAttr("class", [this.getAttr("class"), klass].join(" "));
      }
      return this.classes;
    },
    /**
       @memberof Nehan.TagAttrs
       @param klass {String} - css class name(prefiex by "nehan-")
    */
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
      this.setAttr("class", this.classes.join(" "));
      return this.classes;
    },
    /**
       @memberof Nehan.TagAttrs
       @param name {String}
       @param def_value {default_value}
       @return {attribute_value}
    */
    getAttr : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
    },
    /**
       get dataset value

       @memberof Nehan.TagAttrs
       @param name {String}
       @param def_value {default_value}
       @return {dataset_value}
    */
    getData : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.dataset[name] === "undefined")? def_value : this.dataset[name];
    },
    /**
       get classes NOT prefixed by "nehan-".

       @memberof Nehan.TagAttrs
       @return {Array.<String>}
    */
    getClassesRaw : function(){
      return List.map(this.classes, function(klass){
	return klass.replace("nehan-", "");
      });
    },
    /**
       @memberof Nehan.TagAttrs
       @param name {String}
       @param value {attribute_value}
    */
    setAttr : function(name, value){
      if(name.indexOf("data-") === 0){
	this.setData(__data_name_of(name), value);
      } else {
	this.attrs[name] = value;
      }
    },
    /**
       set dataset value

       @memberof Nehan.TagAttrs
       @param name {String}
       @param value {dataset_value}
    */
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
    _parseDatasetValue : function(value){
      switch(value){
      case "true": return true;
      case "false": return false;
      default: return isNaN(value)? value : Number(value);
      }
    },
    _parseDataset : function(attrs_raw){
      var dataset = {};
      for(var name in attrs_raw){
	if(name.indexOf("data-") === 0){
	  dataset[__data_name_of(name)] = this._parseDatasetValue(attrs_raw[name]);
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
  /**
     @memberof Nehan
     @class Tag
     @classdesc abstraction of html tag markup.
     @constructor
     @param src {String} - string of markup part like "&lt;div class='foo'&gt;"
     @param content {String} - content text of markup
  */
  function Tag(src, content){
    this._type = "tag";
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attrs = this._parseTagAttrs(this.name, this.src);
  }

  Tag.prototype = {
    /**
       @memberof Nehan.Tag
       @return {Nehan.Tag}
    */
    clone : function(){
      return new Tag(this.src, this.content);
    },
    /**
       @memberof Nehan.Tag
       @param content {String}
    */
    setContent : function(content){
      if(this._fixed){
	return;
      }
      this.content = content;
    },
    /**
       @memberof Nehan.Tag
       @param status {boolean}
    */
    setContentImmutable : function(status){
      this._fixed = status;
    },
    /**
       @memberof Nehan.Tag
       @param name {String} - alias markup name
    */
    setAlias : function(name){
      this.alias = name;
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param value {attribute_value}
    */
    setAttr : function(name, value){
      this.attrs.setAttr(name, value);
    },
    /**
       @memberof Nehan.Tag
       @param attrs {Object}
    */
    setAttrs : function(attrs){
      for(var name in attrs){
	this.setAttr(name, attrs[name]);
      }
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param value {dataset_value}
    */
    setData : function(name, value){
      this.attrs.setData(name, value);
    },
    /**
       @memberof Nehan.Tag
       @param klass {String}
    */
    addClass : function(klass){
      this.attrs.addClass(klass);
    },
    /**
       @memberof Nehan.Tag
       @param klass {String}
    */
    removeClass : function(klass){
      this.attrs.removeClass(klass);
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getId : function(){
      return this.attrs.id;
    },
    /**
       @memberof Nehan.Tag
       @return {Array.<String>}
    */
    getClasses : function(){
      return this.attrs.classes;
    },
    /**
       @memberof Nehan.Tag
       @return {Array.<String>}
    */
    getClassesRaw : function(){
      return this.attrs.getClassesRaw();
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getName : function(){
      return this.alias || this.name;
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param def_value {default_value}
       @return {attribute_value}
    */
    getAttr : function(name, def_value){
      return this.attrs.getAttr(name, def_value);
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param def_value {default_value}
       @return {dataset_value}
    */
    getData : function(name, def_value){
      return this.attrs.getData(name, def_value);
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getContent : function(){
      return this.content;
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getSrc : function(){
      return this.src;
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getWrapSrc : function(){
      if(this.content === ""){
	return this.src;
      }
      return this.src + this.content + "</" + this.name + ">";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    hasClass : function(klass){
      return this.attrs.hasClass(klass);
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @return {boolean}
    */
    hasAttr : function(name){
      return this.attrs.hasAttr(name);
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isHeaderTag : function(){
      return List.exists(["h1", "h2", "h3", "h4", "h5", "h6"], Closure.eq(this.name));
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    /**
       @memberof Nehan.Tag
    */
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isPageBreakTag : function(){
      return this.name === "page-break" || this.name === "end-page" || this.name === "pbr";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isCloseTag : function(){
      return this.name.charAt(0) === "/";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isSingleTag : function(){
      return this._single || false;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isEmpty : function(){
      return this.content === "";
    },
    _getTagAttrSrc : function(src){
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
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
    },
    _parseTagAttrs : function(tag_name, tag_src){
      var attr_src = this._getTagAttrSrc(tag_src);
      if(tag_name.length === attr_src.length){
	return new TagAttrs("");
      }
      return new TagAttrs(attr_src);
    }
  };

  return Tag;
})();


/**
   utility module to check token type.

   @namespace Nehan.Token
*/
var Token = {
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isTag : function(token){
    return token._type === "tag";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isText : function(token){
    if(token instanceof Text){
      return true;
    }
    return token._type === "char" || token._type === "word" || token._type === "tcy" || token._type === "ruby";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isChar : function(token){
    return token._type === "char";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWord : function(token){
    return token._type === "word";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isTcy : function(token){
    return token._type === "tcy";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isEmphaTargetable : function(token){
    return token._type === "char" || token._type === "tcy";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isNewLine : function(token){
    return token instanceof Char && token.isNewLineChar();
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWhiteSpace : function(token){
    return token instanceof Char && token.isWhiteSpaceChar();
  }
};


var Text = (function(){
  /**
     @memberof Nehan
     @class Text
     @param content {String}
  */
  function Text(content){
    this.content = content;
  }

  Text.prototype = {
    isWhiteSpaceOnly: function(){
      return this.content.replace(/[\s\n]/g, "") === "";
    },
    getContent: function(){
      return this.content;
    }
  };

  return Text;
})();

var Char = (function(){
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
  var __rex_half_char = /[\w!\.\?\/:#;"',]/;

  Char.prototype = {
    /**
       @memberof Nehan.Char
       @return {string}
    */
    getData : function(){
      return this.cnv || this.data;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
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
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertGlyph : function(line){
      var css = {};
      var padding_enable = this.isPaddingEnable();
      if(this.isKakkoStart()){
	if(this.data === "\x28"){ // left parenthis
	  css["height"] = "0.5em"; // it's temporary fix, so maybe need to be refactored.
	} else if(!padding_enable){
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
	Args.copy(css, this.getCssPadding(line));
      }
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVertSingleHalfChar : function(line){
      var css = {};
      css["padding-left"] = "0.25em";
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
    getCssVertEmphaText : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css.display = "inline-block";
      css.width = font_size + "px";
      css.height = font_size + "px";
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
      css["line-height"] = "1em";
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
    getCssVertHalfSpaceChar : function(line){
      var css = {}, font_size = line.style.getFontSize();
      var half = Math.round(font_size / 2);
      css.height = half + "px";
      css["line-height"] = half + "px";
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
      return this.hscale? this.hscale : 1;
    },
    /**
       @memberof Nehan.Char
       @return {Float | Int}
    */
    getVertScale : function(){
      return this.vscale? this.vscale : 1;
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
    _setRotateOrImg : function(angle, img, vscale){
      if(Nehan.Env.isTransformEnable){
	this._setRotate(angle);
	return;
      }
      this._setImg(img, vscale);
    },
    _setupRef : function(c1){
      switch(c1){
      case "&lt;":
	this._setRotateOrImg(90, "kakko7", 0.5);
	break;
      case "&gt;":
	this._setRotateOrImg(90, "kakko8", 0.5);
	break;
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
      case 8221: // right double quotateion mark
      case 8786: // approximately equal to
	this._setRotate(90); break;
      }
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isNewLineChar : function(){
      return this.data === "\n";
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isSpaceChar : function(){
      return (this.data === " " || this.data === "&nbsp;" || this.data === "\t");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isWhiteSpaceChar : function(){
      return this.isNewLineChar() || this.isSpaceChar();
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
    isHalfSpaceChar : function(){
      return (this.isCnvChar() && this.cnv === "&nbsp;");
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKerningChar : function(){
      return this.isKutenTouten() || this.isKakko();
    },
    /**
       @memberof Nehan.Char
       @return {string}
     */
    getImgSrc : function(color){
      return [Display.fontImgRoot, this.img, color + ".png"].join("/");
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
    isVertGlyphEnable : function(){
      return Config.useVerticalGlyphIfEnable && Nehan.Env.isVerticalGlyphEnable;
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
      return List.mem(__head_ng, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isTailNg : function(){
      return List.mem(__tail_ng, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isSmallKana : function(){
      return List.mem(__small_kana, this.data);
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
      return List.mem(__kakko_start, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isKakkoEnd : function(){
      return List.mem(__kakko_end, this.data);
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
      return List.mem(__kuten, this.data);
    },
    /**
       @memberof Nehan.Char
       @return {boolean}
     */
    isTouten : function(){
      return List.mem(__touten, this.data);
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
    }
  };

  return Char;
})();

var Word = (function(){
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
    this._type = "word";
    this._divided = divided || false;
  }

  Word.prototype = {
    /**
       @memberof Nehan.Word
       @return {string}
     */
    getData : function(){
      return this.data;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTrans : function(line){
      var css = {};
      if(line.style.letterSpacing){
	css["letter-spacing"] = line.style.letterSpacing + "px";
      }
      css.width = line.style.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["font-family"] = "monospace";
      return css;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTransBody : function(line){
      var css = {};
      //css["font-family"] = line.style.getFontFamily();
      css["font-family"] = "monospace";
      return css;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
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
	css.transform = "rotate(90deg) translate(-" + trans + "px, 0)";
      }
      return css;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTransIE : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css["font-family"] = "monospace";
      css["css-float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["letter-spacing"] = (line.style.letterSpacing || 0) + "px";
      css["padding-left"] = Math.round(font_size / 2) + "px";
      css["line-height"] = font_size + "px";
      return css;
    },
    /**
       @memberof Nehan.Word
       @return {int}
    */
    getCharCount : function(){
      return 1; // word is count by 1 character.
    },
    /**
       @memberof Nehan.Word
       @param flow {Nehan.BoxFlow}
       @param letter_spacing {int}
       @return {int}
    */
    getAdvance : function(flow, letter_spacing){
      return Math.floor(this.bodySize + (letter_spacing || 0) * this.getLetterCount());
    },
    /**
       @memberof Nehan.Word
       @return {boolean}
    */
    hasMetrics : function(){
      return (typeof this.bodySize !== "undefined");
    },
    /**
       @memberof Nehan.Word
       @return {int}
    */
    countUpper : function(){
      var count = 0;
      for(var i = 0; i < this.data.length; i++){
	if(/[A-Z]/.test(this.data.charAt(i))){
	  count++;
	}
      }
      return count;
    },
    /**
       @memberof Nehan.Word
       @param flow {Nehan.BoxFlow}
       @param font {Nehan.Font}
    */
    setMetrics : function(flow, font){
      if(Config.useStrictWordMetrics && TextMetrics.isEnable()){
	this.bodySize = Math.round(TextMetrics.getMeasure(font, this.data));
	return;
      }
      this.bodySize = Math.round(this.data.length * font.size * 0.5);
      if(font.isBold()){
	this.bodySize += Math.round(Display.boldRate * this.bodySize);
      }
    },
    /**
       @memberof Nehan.Word
       @return {int}
    */
    getLetterCount : function(){
      return this.data.length;
    },
    /**
       @memberof Nehan.Word
       @param enable {boolean}
    */
    setDivided : function(enable){
      this._divided = enable;
    },
    /**
       @memberof Nehan.Word
       @param enable {boolean}
    */
    isDivided : function(){
      return this._divided;
    },
    /**
       devide word by [measure] size and return first half of word.

       @memberof Nehan.Word
       @param font_size {int}
       @param measure {int}
       @return {Nehan.Word}
    */
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
      this.setDivided(true);
      return word_part;
    }
  };
  
  return Word;
})();


var Tcy = (function(){
  /**
     @memberof Nehan
     @class Tcy
     @classdesc abstraction of tcy(tate-chu-yoko) character.
     @constructor
     @param tcy {String}
  */
  function Tcy(tcy){
    this.data = tcy;
    this._type = "tcy";
  }

  Tcy.prototype = {
    /**
       @memberof Nehan.Tcy
       @return {string}
     */
    getData : function(){
      return this.data;
    },
    /**
       @memberof Nehan.Tcy
       @return {int}
    */
    getCharCount : function(){
      return 1;
    },
    /**
       @memberof Nehan.Tcy
       @return {int}
    */
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + letter_spacing;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVert : function(line){
      var css = {};
      css["text-align"] = "center";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssHoriSingleHalfChar : function(line){
      var css = {};
      css["text-align"] = "center";
      return css;
    },
    /**
       @memberof Nehan.Tcy
       @return {boolean}
    */
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined");
    },
    /**
       @memberof Nehan.Tcy
       @param flow {Nehan.BoxFlow}
       @param font {Nehan.Font}
    */
    setMetrics : function(flow, font){
      this.bodySize = font.size;
    }
  };

  return Tcy;
})();


var Ruby = (function(){
  /**
     @memberof Nehan
     @class Ruby
     @classdesc abstraction of ruby text.
     @constructor
     @param rbs {Array<Nehan.Char>} - characters of &lt;rb&gt; tag.
     @param rt {Nehan.Tag}
  */
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
  }

  Ruby.prototype = {
    /**
       @memberof Nehan.Ruby
       @return {boolean}
    */
    hasMetrics : function(){
      return (typeof this.advanceSize !== "undefined");
    },
    /**
       @memberof Nehan.Ruby
       @return {int}
    */
    getCharCount : function(){
      return this.rbs? this.rbs.length : 0;
    },
    /**
       @memberof Nehan.Ruby
       @return {int}
    */
    getAdvance : function(flow){
      return this.advanceSize;
    },
    /**
       @memberof Nehan.Ruby
       @return {Array<Nehan.Char>}
    */
    getRbs : function(){
      return this.rbs;
    },
    /**
       @memberof Nehan.Ruby
       @return {String}
    */
    getRbString : function(){
      return List.map(this.rbs, function(rb){
	return rb.data || "";
      }).join("");
    },
    /**
       @memberof Nehan.Ruby
       @return {String}
    */
    getRtString : function(){
      return this.rt? this.rt.getContent() : "";
    },
    /**
       @memberof Nehan.Ruby
       @return {int}
    */
    getRtFontSize : function(){
      return this.rtFontSize;
    },
    /**
       @memberof Nehan.Ruby
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertRt : function(line){
      var css = {};
      css["css-float"] = "left";
      return css;
    },
    /**
       @memberof Nehan.Ruby
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssHoriRt : function(line){
      var css = {};
      var offset = Math.floor((line.style.getFontSize() - this.getRtFontSize()) / 3);
      css["font-size"] = this.getRtFontSize() + "px";
      css["line-height"] = "1em";
      return css;
    },
    /**
       @memberof Nehan.Ruby
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertRb : function(line){
      var css = {};
      css["css-float"] = "left";
      if(this.padding){
	Args.copy(css, this.padding.getCss());
      }
      return css;
    },
    /**
       @memberof Nehan.Ruby
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssHoriRb : function(line){
      var css = {};
      if(this.padding){
	Args.copy(css, this.padding.getCss());
      }
      css["text-align"] = "center";
      css["line-height"] = "1em";
      return css;
    },
    /**
       @memberof Nehan.Ruby
       @param flow {Nehan.BoxFlow}
       @param font {Nehan.Font}
       @param letter_spacing {int}
    */
    setMetrics : function(flow, font, letter_spacing){
      this.rtFontSize = Display.getRtFontSize(font.size);
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
  /**
     @memberof Nehan
     @class Rgb
     @classdesc abstraction of RGB color value.
     @constructor
     @param value {String}
  */
  function Rgb(value){
    this.value = String(value);
    this.red = parseInt(this.value.substring(0,2), 16);
    this.green = parseInt(this.value.substring(2,4), 16);
    this.blue = parseInt(this.value.substring(4,6), 16);
  }
  
  Rgb.prototype = {
    /**
       @memberof Nehan.Rgb
       @return {String}
    */
    getRed : function(){
      return this.red;
    },
    /**
       @memberof Nehan.Rgb
       @return {String}
    */
    getGreen : function(){
      return this.green;
    },
    /**
       @memberof Nehan.Rgb
       @return {String}
    */
    getBlue : function(){
      return this.blue;
    },
    /**
       @memberof Nehan.Rgb
       @return {String}
    */
    getColorValue : function(){
      return this.value;
    }
  };

  return Rgb;
})();

var Color = (function(){
  /**
     @memberof Nehan
     @class Color
     @classdesc abstraction for css 'color'.
     @param value {String}
  */
  function Color(value){
    this.setValue(value);
  }

  Color.prototype = {
    /**
       @memberof Nehan.Color
       @param value {String}
    */
    setValue : function(value){
      this.value = Colors.get(value);
    },
    /**
       @memberof Nehan.Color
       @return {String}
    */
    getValue : function(){
      return this.value;
    },
    /**
       @memberof Nehan.Color
       @return {String}
       @example
       * new Color("transparent").getCssValue(); // "transparent"
       * new Color("ff0022").getCssValue(); // "#ff0022"
       * new Color("red").getCssValue(); // "#ff0000"
    */
    getCssValue : function(){
      return (this.value === "transparent")? this.value : "#" + this.value;
    },
    /**
       @memberof Nehan.Color
       @return {Nehan.Rgb}
    */
    getRgb : function(){
      return new Rgb(this.value);
    },
    /**
       @memberof Nehan.Color
       @return {Object}
    */
    getCss : function(){
      var css = {};
      css.color = this.getCssValue();
      return css;
    }
  };

  return Color;
})();

/**
   color collection manager
   @namespace Nehan.Colors
*/
var Colors = (function(){
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


/**
   palette color utility module

   @namespace Nehan.Palette
*/
var Palette = (function(){
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
    if(List.exists(palette, Closure.eq(ival))){
      return ival;
    }
    return List.minobj(palette, function(pval){
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
var Cardinal = (function(){
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


/**
   utility module to get more strict metrics using canvas.

   @namespace Nehan.TextMetrics
*/
var TextMetrics = (function(){
  var __canvas = document.createElement("canvas");
  __canvas.style.width = Math.max(Display.width, Display.height) + "px";
  __canvas.style.height = Display.maxFontSize + "px";

  var __canvas_context;
  if(__canvas.getContext){
    __canvas_context = __canvas.getContext("2d");
    __canvas_context.textAlign = "left";
  }

  return {
    /**
       check if client browser is supported.

       @memberof Nehan.TextMetrics
       @return {boolean}
    */
    isEnable : function(){
      return __canvas_context && (typeof __canvas_context.measureText !== "undefined");
    },
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {Object} - {width:xxx, height:yyy}
    */
    getMetrics : function(font, text){
      __canvas_context.font = font.toString(); // to get accurate metrics, font info is required.
      return __canvas_context.measureText(text);
    },
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {int}
    */
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      var space = Math.floor(Display.vertWordSpaceRate * font.size);
      return metrics.width + space;
    }
  };
})();


var ListStyleType = (function(){
  /**
     @memberof Nehan
     @class ListStyleType
     @classdesc abstraction of list-style-type.
     @constructor
     @param pos {String} - "disc", "circle", "square", "lower-alpha" .. etc
  */
  function ListStyleType(type){
    this.type = type;
  }

  var __marker_text = {
    "disc": "&#x2022;",
    "circle":"&#x25CB;",
    "square":"&#x25A0;"
  };

  ListStyleType.prototype = {
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isDecimalList : function(){
      return (this.type === "decimal" || this.type === "decimal-leading-zero");
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isNoneList : function(){
      return this.type === "none";
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isMarkList : function(){
      return (this.type === "disc" ||
	      this.type === "circle" ||
	      this.type === "square");
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isCountableList : function(){
      return (!this.isNoneList() && !this.isMarkList());
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
    isHankaku : function(){
      return (this.type === "lower-alpha" || this.type === "upper-alpha" ||
	      this.type === "lower-roman" || this.type === "upper-roman" ||
	      this.isDecimalList());
    },
    /**
       @memberof Nehan.ListStyleType
       @return {boolean}
    */
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
    /**
       @memberof Nehan.ListStyleType
       @return {String}
    */
    getMarkerHtml : function(count){
      var text = this.getMarkerText(count);
      if(this.isZenkaku()){
	return Html.tagWrap("span", text, {
	  "class":"nehan-tcy"
	});
      }
      return text;
    },
    /**
       @memberof Nehan.ListStyleType
       @return {String}
    */
    getMarkerText : function(count){
      if(this.isNoneList()){
	return Const.space;
      }
      if(this.isMarkList()){
	return __marker_text[this.type] || "";
      }
      var digit = this._getMarkerDigitString(count);
      return digit + "."; // add period as postfix.
    }
  };

  return ListStyleType;
})();


var ListStylePos = (function(){
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

  ListStylePos.prototype = {
    /**
       @memberof Nehan.ListStylePos
       @return {boolean}
    */
    isOutside : function(){
      return this.pos === "outside";
    },
    /**
       @memberof Nehan.ListStylePos
       @return {boolean}
    */
    isInside : function(){
      return this.pos === "inside";
    }
  };

  return ListStylePos;
})();


var ListStyleImage = (function(){
  /**
     @memberof Nehan
     @class ListStyleImage
     @classdesc abstraction of list-style-image.
     @constructor
     @param image {Object}
     @param image.width {Int} - if undefined, use {@link Nehan.Display}.fontSize
     @param image.height {Int} - if undefined, use {@link Nehan.Display}.fontSize
     @param image.url {String}
  */
  function ListStyleImage(image){
    this.image = image;
  }

  ListStyleImage.prototype = {
    /**
       @memberof Nehan.ListStyleImage
       @param count {int}
       @return {string}
    */
    getMarkerHtml : function(count){
      var url = this.image.url;
      var width = this.image.width || Display.fontSize;
      var height = this.image.height || Display.fontSize;
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
    this.type = new ListStyleType(opt.type || "none");
    this.position = new ListStylePos(opt.position || "outside");
    this.image = (opt.image !== "none")? new ListStyleImage(opt.image) : null;
  }

  ListStyle.prototype = {
    /**
       @memberof Nehan.ListStyle
       @return {boolean}
    */
    isMultiCol : function(){
      return this.position.isOutside();
    },
    /**
       @memberof Nehan.ListStyle
       @return {boolean}
    */
    isInside : function(){
      return this.position.isInside();
    },
    /**
       @memberof Nehan.ListStyle
       @return {boolean}
    */
    isImageList : function(){
      return (this.image !== null);
    },
    /**
       @memberof Nehan.ListStyle
       @param count {int}
       @return {String}
    */
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

  Flow.prototype = {
    /**
       @memberof Nehan.Flow
       @param dir {String}
    */
    init : function(dir){
      this.dir = dir;
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isHorizontal : function(){
      return (this.dir === "lr" || this.dir === "rl");
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isVertical : function(){
      return (this.dir === "tb");
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isLeftToRight : function(){
      return this.dir === "lr";
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isRightToLeft : function(){
      return this.dir === "rl";
    }
  };

  return Flow;
})();


var BlockFlow = (function(){
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
    Flow.call(this, dir);
  }

  Class.extend(BlockFlow, Flow);

  /**
     get flipped block direction. If direction is "tb", nothing happend.

     @memberof Nehan.BlockFlow
     @method flip
     @return {string} fliped block direction
     @example
     * new BlockFlow("tb").flip(); // => "tb" (nothing happened)
     * new BlockFlow("lr").flip(); // => "rl"
     * new BlockFlow("rl").flip(); // => "lr"
  */
  BlockFlow.prototype.flip = function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Display.getVertBlockdir();
    default: return "";
    }
  };

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


var InlineFlow = (function(){
  /**
     @memberof Nehan
     @class InlineFlow
     @classdesc flow abstraction at inline level.
     @constructor
     @extends {Nehan.Flow}
     @param dir {String} - "lr" or "rl"(but not supported) or "tb"
   */
  function InlineFlow(dir){
    Flow.call(this, dir);
  }
  Class.extend(InlineFlow, Flow);

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


var BoxFlow = (function(){
  /**
     @memberof Nehan
     @class BoxFlow
     @classdesc abstract inline and block direction
     @constructor
     @param indir {string} - "lr" or "tb"("rl" not supported yet)
     @param blockdir {string} - "tb" or "lr" or "rl"
  */
  function BoxFlow(indir, blockdir){
    this.inflow = new InlineFlow(indir);
    this.blockflow = new BlockFlow(blockdir);
  }

  BoxFlow.prototype = {
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextLineFirst : function(){
      if(this.isTextVertical() && this.blockflow.isLeftToRight()){
	return true;
      }
      return false;
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isBlockflowVertical : function(){
      return this.blockflow.isVertical();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextVertical : function(){
      return this.inflow.isVertical();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextHorizontal : function(){
      return this.inflow.isHorizontal();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextLeftToRight : function(){
      return this.inflow.isLeftToRight();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextRightToLeft : function(){
      return this.inflow.isRightToLeft();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isBlockLeftToRight : function(){
      return this.blockflow.isLeftToRight();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isBlockRightToLeft : function(){
      return this.blockflow.isRightToLeft();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {Object}
    */
    getCss : function(){
      var css = {};

      // notice that "float" property is converted into "cssFloat" in evaluation time.
      if(this.isTextVertical()){
	css["css-float"] = this.isBlockLeftToRight()? "left" : "right";
      } else {
	css["css-float"] = this.isTextLeftToRight()? "left" : "right";
      }
      return css;
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
       @example
       * new BlockFlow("tb", "rl").getName(); // "tb-rl"
       * new BlockFlow("lr", "tb").getName(); // "lr-tb"
    */
    getName : function(){
      return [this.inflow.dir, this.blockflow.dir].join("-");
    },
    /**
       @memberof Nehan.BoxFlow
       @return {String}
       @example
       * new BlockFlow("tb", "rl").getTextHorizontalDir(); // "rl"
       * new BlockFlow("tb", "lr").getTextHorizontalDir(); // "lr"
       * new BlockFlow("lr", "tb").getTextHorizontalDir(); // "" (empty)
    */
    getTextHorizontalDir : function(){
      if(this.isTextHorizontal()){
	return this.inflow.dir;
      }
      return "";
    },
    /**
       get physical property name from logical property.
       @memberof Nehan.BoxFlow
       @param prop {string} - logical direction name
       @return {string}
       @example
       * new BlockFlow("tb", "rl").getProp("start"); // "top"
       * new BlockFlow("lr", "tb").getProp("end"); // "right"
    */
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
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropStart : function(){
      return this.inflow.getPropStart();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropEnd : function(){
      return this.inflow.getPropEnd();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropBefore : function(){
      return this.blockflow.getPropBefore();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropAfter : function(){
      return this.blockflow.getPropAfter();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropExtent : function(){
      return this.isTextVertical()? "width" : "height";
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropMeasure : function(){
      return this.isTextVertical()? "height" : "width";
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropWidth : function(){
      return this.isTextVertical()? "extent" : "measure";
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropHeight : function(){
      return this.isTextVertical()? "measure" : "extent";
    },
    /**
       get flipped box flow, but result depends on setting of Display.boxFlow.

       @memberof Nehan.BoxFlow
       @return {Nehan.BoxFlow}
       @example
       * // if  Display.boxFlow.hori = "lr-tb"
       * // and Display.boxFlow.vert = "tb-rl"
       * new BlockFlow("tb", "rl").getFlipFlow(); // BoxFlow("lr", "tb")
       * new BlockFlow("lr", "tb").getFlipFlow(); // BoxFlow("tb", "rl")
    */
    getFlipFlow : function(){
      return this.isTextVertical()? Display.getStdHoriFlow() : Display.getStdVertFlow();
    },
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
    getBoxSize : function(measure, extent){
      var size = new BoxSize(0, 0);
      size[this.getPropMeasure()] = measure;
      size[this.getPropExtent()] = extent;
      return size;
    }
  };

  return BoxFlow;
})();


/**
   pre defined box flow collection.
   @namespace Nehan.BoxFlows
*/
var BoxFlows = {
  "tb-rl":(new BoxFlow("tb", "rl")),
  "tb-lr":(new BoxFlow("tb", "lr")),
  "lr-tb":(new BoxFlow("lr", "tb")),
  "rl-tb":(new BoxFlow("rl", "tb")),
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

/**
   utiliti module for box physical direction(top, right, bottom, left).

   @namespace Nehan.BoxRect
*/
var BoxRect = {
  /**
     iterate all direction of [obj] by [fn]
     @memberof Nehan.BoxRect
     @param obj {Object}
     @param fn {Function}
   */
  iter : function(obj, fn){
    List.iter(Const.cssBoxDirs, function(dir){
      if(obj[dir]){
	fn(dir, obj[dir]);
      }
    });
  },
  /**
     @memberof Nehan.BoxRect
     @param dst {Object}
     @param flow {Nehan.BoxFlow}
     @param value {Object}
   */
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
var BoxCorner = (function(){
  var __sort = function(dir1, dir2){
    var order = {top:0, bottom:1, left:2, right:3};
    return [dir1, dir2].sort(function (c1, c2){
      return order[c1] - order[c2];
    });
  };
  return {
    /**
       get normalized(and camel-cased) corner property name
       @memberof Nehan.BoxCorner
       @param dir1 {string}
       @param dir2 {string}
       @return {string}
       @example
       * BoxCorner.getCornerName("right", "top"); // => "topRight"
    */
    getCornerName : function(dir1, dir2){
      var dirs = __sort(dir1, dir2);
      return [dirs[0], Utils.capitalize(dirs[1])].join("");
    }
  };
})();

var Font = (function(){
  /**
     @memberof Nehan
     @class Font
     @classdesc css 'font' abstraction
     @constructor
     @param size {int} - font size in px
  */
  function Font(size){
    this.size = size;
  }

  Font.prototype = {
    /**
       @memberof Nehan.Font
       @return {boolean}
    */
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    /**
       @memberof Nehan.Font
       @return {string}
    */
    toString : function(){
      return [
	this.weight || "normal",
	this.style || "normal",
	this.size + "px",
	this.family || "monospace"
      ].join(" ");
    },
    /**
       @memberof Nehan.Font
       @return {Object}
    */
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
  /**
     @memberof Nehan
     @class Edge
     @classdesc abstraction of physical edge size for each css directions(top, right, bottom, left).
     @constructor
     @param type {String} - "margin" or "padding" or "border"
  */
  function Edge(type){
    this._type = type;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }

  Edge.prototype = {
    /**
       @memberof Nehan.Edge
    */
    clear : function(){
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.left = 0;
    },
    /**
       @memberof Nehan.Edge
    */
    clearBefore : function(flow){
      this[flow.getPropBefore()] = 0;
    },
    /**
       @memberof Nehan.Edge
    */
    clearAfter : function(flow){
      this[flow.getPropAfter()] = 0;
    },
    /**
       @memberof Nehan.Edge
       @param dst {Nehan.Edge}
       @return {Nehan.Edge}
    */
    copyTo : function(dst){
      var self = this;
      List.iter(Const.cssBoxDirs, function(dir){
	dst[dir] = self[dir];
      });
      return dst;
    },
    /**
       @memberof Nehan.Edge
       @param dir {String} - "top", "right", "bottom", "left"
       @return {String}
    */
    getDirProp : function(dir){
      return [this._type, dir].join("-");
    },
    /**
       @memberof Nehan.Edge
       @return {Object}
    */
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
    /**
       @memberof Nehan.Edge
       @return {int}
    */
    getWidth : function(){
      return this.left + this.right;
    },
    /**
       @memberof Nehan.Edge
       @return {int}
    */
    getHeight : function(){
      return this.top + this.bottom;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getMeasure : function(flow){
      return flow.isTextVertical()? this.getHeight() : this.getWidth();
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getExtent : function(flow){
      return flow.isBlockflowVertical()? this.getHeight() : this.getWidth();
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param size {Object}
       @param size.top {int}
       @param size.right {int}
       @param size.bottom {int}
       @param size.left {int}
    */
    setSize : function(flow, size){
      BoxRect.setValue(this, flow, size);
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setStart : function(flow, value){
      this[flow.getPropStart()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setEnd : function(flow, value){
      this[flow.getPropEnd()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setBefore : function(flow, value){
      this[flow.getPropBefore()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setAfter : function(flow, value){
      this[flow.getPropAfter()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getStart : function(flow){
      return this[flow.getPropStart()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getEnd : function(flow){
      return this[flow.getPropEnd()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getBefore : function(flow){
      return this[flow.getPropBefore()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getAfter : function(flow){
      return this[flow.getPropAfter()];
    }
  };

  return Edge;
})();

var Radius2d = (function(){
  /**
     @memberof Nehan
     @class Radius2d
     @classdesc abstraction of radius with 2 direction vert and hori.
     @constructor
  */
  function Radius2d(){
    this.hori = 0;
    this.vert = 0;
  }

  Radius2d.prototype = {
    /**
       @memberof Nehan.Radius2d
       @param value {Array<int>} - 2 length array, value[0] as horizontal radius, value[1] as vertical radius.
       @param value.0 {int} - horizontal radius
       @param value.1 {int} - vertical radius
    */
    setSize : function(value){
      this.hori = value[0];
      this.vert = value[1];
    },
    /**
       @memberof Nehan.Radius2d
       @return {String}
    */
    getCssValueHori : function(){
      return this.hori + "px";
    },
    /**
       @memberof Nehan.Radius2d
       @return {String}
    */
    getCssValueVert : function(){
      return this.vert + "px";
    }
  };
  
  return Radius2d;
})();

var BorderRadius = (function(){
  /**
     @memberof Nehan
     @class BorderRadius
     @classdesc logical border radius object
     @constructor
  */
  function BorderRadius(){
    this.topLeft = new Radius2d();
    this.topRight = new Radius2d();
    this.bottomRight = new Radius2d();
    this.bottomLeft = new Radius2d();
  }

  BorderRadius.prototype = {
    /**
       @memberof Nehan.BorderRadius
       @method getArray
       @return {Array.<Nehan.Radius2d>}
    */
    getArray : function(){
      return [
	this.topLeft,
	this.topRight,
	this.bottomRight,
	this.bottomLeft
      ];
    },
    /**
       get css value of border-radius for horizontal direction
       @memberof Nehan.BorderRadius
       @method getCssValueHroi
       @return {Object}
    */
    getCssValueHori : function(){
      return List.map(this.getArray(), function(radius){
	return radius.getCssValueHori();
      }).join(" ");
    },
    /**
       get css value of border-radius for vertical direction
       @memberof Nehan.BorderRadius
       @method getCssValueVert
       @return {Object}
    */
    getCssValueVert : function(){
      return List.map(this.getArray(), function(radius){
	return radius.getCssValueVert();
      }).join(" ");
    },
    /**
       get css value of border-radius for both vert and horizontal direction
       @memberof Nehan.BorderRadius
       @method getCssValue
       @return {Object}
    */
    getCssValue : function(){
      return [this.getCssValueHori(), this.getCssValueVert()].join("/");
    },
    /**
       get css object of border-radius
       @memberof Nehan.BorderRadius
       @method getCss
       @return {Object}
    */
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
    /**
       get corner value
       @memberof Nehan.BorderRadius
       @method getCorner
       @param dir1 {string} - physical direction of logical start or end
       @param dir2 {string} - physical direction of logical before or after
       @return {Nehan.Radius2d}
    */
    getCorner : function(dir1, dir2){
      var name = BoxCorner.getCornerName(dir1, dir2);
      return this[name];
    },
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
    /**
       set corner of logical "start-before"
       @memberof Nehan.BorderRadius
       @method setStartBefore
       @param flow {Nehan.BoxFlow} - base layout flow
       @param value {Array<int>} - 2d radius value
       @example
       * new BorderRadius().setStartBefore(BoxFlows.getByName("lr-tb"), [5, 10]); // horizontal 5px, vertical 10px
    */
    setStartBefore : function(flow, value){
      var radius = this.getCorner(flow.getPropStart(), flow.getPropBefore());
      radius.setSize(value);
    },
    /**
       set corner of logical "start-after"
       @memberof Nehan.BorderRadius
       @method setStartAfter
       @param flow {Nehan.BoxFlow} - base layout flow
       @param value {Array<int>} - 2d radius value
    */
    setStartAfter : function(flow, value){
      var radius = this.getCorner(flow.getPropStart(), flow.getPropAfter());
      radius.setSize(value);
    },
    /**
       set corner of logical "end-before"
       @memberof Nehan.BorderRadius
       @method setEndBefore
       @param flow {Nehan.BoxFlow} - base layout flow
       @param value {Array<int>} - 2d radius value
    */
    setEndBefore : function(flow, value){
      var radius = this.getCorner(flow.getPropEnd(), flow.getPropBefore());
      radius.setSize(value);
    },
    /**
       set corner of logical "end-after"
       @memberof Nehan.BorderRadius
       @method setEndAfter
       @param flow {Nehan.BoxFlow} - base layout flow
       @param value {Array<int>} - 2d radius value
    */
    setEndAfter :  function(flow, value){
      var radius = this.getCorner(flow.getPropEnd(), flow.getPropAfter());
      radius.setSize(value);
    },
    /**
       clear corner values of logical before direction("start-before" and "end-before")
       @memberof Nehan.BorderRadius
       @method clearBefore
       @param flow {Nehan.BoxFlow} - base layout flow
    */
    clearBefore : function(flow){
      this.setStartBefore(flow, [0, 0]);
      this.setEndBefore(flow, [0, 0]);
    },
    /**
       clear corner values of logical before direction("start-after" and "end-after")
       @memberof Nehan.BorderRadius
       @method clearAfter
       @param flow {Nehan.BoxFlow} - base layout flow
    */
    clearAfter : function(flow){
      this.setStartAfter(flow, [0, 0]);
      this.setEndAfter(flow, [0, 0]);
    }
  };

  return BorderRadius;
})();

var BorderColor = (function(){
  /**
     @memberof Nehan
     @class BorderColor
     @classdesc logical border color object
     @constructor
  */
  function BorderColor(){
  }

  BorderColor.prototype = {
    /**
       @memberof Nehan.BorderColor
       @method setColor
       @param flow {Nehan.BoxFlow}
       @param value {Object} - color values, object or array or string available.
       @param value.before {Nehan.Color}
       @param value.end {Nehan.Color}
       @param value.after {Nehan.Color}
       @param value.start {Nehan.Color}
    */
    setColor : function(flow, value){
      var self = this;

      // first, set as it is(obj, array, string).
      BoxRect.setValue(this, flow, value);

      // second, map as color class.
      BoxRect.iter(this, function(dir, val){
	self[dir] = new Color(val);
      });
    },
    /**
       get css object of border color

       @memberof Nehan.BorderColor
       @method getCss
    */
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
  /**
     @memberof Nehan
     @class BorderStyle
     @classdesc logical border style object
     @constructor
  */
  function BorderStyle(){
  }

  BorderStyle.prototype = {
    /**
       @memberof Nehan.BorderStyle
       @method setStyle
       @param flow {Nehan.BoxFlow}
       @param value {Object} - logical style values for each logical direction
       @param value.before {string}
       @param value.end {string}
       @param value.after {string}
       @param value.start {string}
    */
    setStyle : function(flow, value){
      BoxRect.setValue(this, flow, value);
    },
    /**
       get css object of logical border style
       @memberof Nehan.BorderStyle
       @return {Object}
    */
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
  /**
     @memberof Nehan
     @class Padding
     @classdesc abstraction of padding.
     @extends {Nehan.Edge}
  */
  function Padding(){
    Edge.call(this, "padding");
  }
  Class.extend(Padding, Edge);

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


var Margin = (function(){
  /**
     @memberof Nehan
     @class Margin
     @classdesc abstraction of physical margin
     @constructor
     @extends {Nehan.Edge}
  */
  function Margin(){
    Edge.call(this, "margin");
  }
  Class.extend(Margin, Edge);

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


var Border = (function(){
  /**
     @memberof Nehan
     @class Border
     @classdesc logical border object that contains border-width, border-radius, border-style, border-color for each logical directions.
     @constructor
     @extends {Nehan.Edge}
  */
  function Border(){
    Edge.call(this, "border");
  }
  Class.extend(Border, Edge);

  /**
     return cloned border object
     @memberof Nehan.Border
     @method clone
     @return {Nehan.Border}
  */
  Border.prototype.clone = function(){
    var border = this.copyTo(new Border());
    if(this.radius){
      // TODO
      // border.radius = this.radius.clone();
      border.radius = this.radius;
    }
    if(this.style){
      // TODO
      // border.style = this.style.clone();
      border.style = this.style;
    }
    if(this.color){
      // TODO
      // border.color = this.color.clone();
      border.color = this.color;
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
    this.radius = new BorderRadius();
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
    this.color = new BorderColor();
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
    this.style = new BorderStyle();
    this.style.setStyle(flow, style);
  };

  /**
     get css object
     @memberof Nehan.Border
     @method getCss
     @return {Object}
  */
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
  var __default_empha_style = "filled dot";
  var __empha_marks = {
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

  /**
     @memberof Nehan
     @class TextEmphaStyle
     @classdesc abstraction of text-empha-position.
     @constructor
     @param value {String} - style name. default "none".
     @example
     * new TextEmphaStyle().getText(); // ""
     * new TextEmphaStyle().getText("none"); // ""
     * new TextEmphaStyle("filled dot").getText(); // "&#x2022";
     * new TextEmphaStyle("foo").getText(); // "foo";
  */
  function TextEmphaStyle(value){
    this.value = value || "none";
  }

  TextEmphaStyle.prototype = {
    /**
       @memberof Nehan.TextEmphaStyle
       @return {bool}
    */
    isEnable : function(){
      return this.value != "none";
    },
    /**
       @memberof Nehan.TextEmphaStyle
       @param value {String} - empha style name
    */
    setValue : function(value){
      this.value = value;
    },
    /**
       @memberof Nehan.TextEmphaStyle
       @return {String}
    */
    getText : function(){
      if(!this.isEnable()){
	return "";
      }
      return __empha_marks[this.value] || this.value || __empha_marks[__default_empha_style];
    },
    /**
       @memberof Nehan.TextEmphaStyle
       @return {Object}
    */
    getCss : function(){
      var css = {};
      //return css["text-emphasis-style"] = this.value;
      return css;
    }
  };

  return TextEmphaStyle;
})();


var TextEmphaPos = (function(){
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
    Args.merge(this, {
      hori:"over",
      vert:"right"
    }, opt || {});
  }

  TextEmphaPos.prototype = {
    /**
       not implemented yet.

       @memberof Nehan.TextEmphaPos
       @return {Object}
    */
    getCss : function(line){
      var css = {};
      return css;
    }
  };

  return TextEmphaPos;
})();


var TextEmpha = (function(){
  /**
     @memberof Nehan
     @class TextEmpha
     @classdesc abstraction of text emphasis.
     @constructor
     @param opt {Object}
     @param opt.style {Nehan.TextEmphaStyle}
     @param opt.pos {Nehan.TextEmphaPos}
     @param opt.color {Nehan.Color}
  */
  function TextEmpha(opt){
    opt = opt || {};
    this.style = opt.style || new TextEmphaStyle();
    this.pos = opt.pos || new TextEmphaPos();
    this.color = opt.color || new Color(Display.fontColor);
  }

  TextEmpha.prototype = {
    /**
       @memberof Nehan.TextEmpha
       @return {boolean}
    */
    isEnable : function(){
      return this.style && this.style.isEnable();
    },
    /**
       get text of empha style, see {@link Nehan.TextEmphaStyle}.

       @memberof Nehan.TextEmpha
       @return {String}
    */
    getText : function(){
      return this.style? this.style.getText() : "";
    },
    /**
       @memberof Nehan.TextEmpha
       @return {int}
    */
    getExtent : function(font_size){
      return font_size * 3;
    },
    /**
       @memberof Nehan.TextEmpha
       @param line {Nehan.Box}
       @param chr {Nehan.Char}
       @return {Object}
    */
    getCssVertEmphaWrap : function(line, chr){
      var css = {}, font_size = line.style.getFontSize();
      css["text-align"] = "left";
      css.width = this.getExtent(font_size) + "px";
      css.height = chr.getAdvance(line.style.flow, line.style.letterSpacing || 0) + "px";
      return css;
    },
    /**
       @memberof Nehan.TextEmpha
       @param line {Nehan.Box}
       @param chr {Nehan.Char}
       @return {Object}
    */
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

  Uri.prototype = {
    _normalize : function(address){
      return address.replace(/\s/g, "");
    },
    /**
       @memberof Nehan.Uri
       @return {String}
    */
    getAddress : function(){
      return this.address;
    },
    /**
       @memberof Nehan.Uri
       @return {String}
       @example
       * new Uri("http://example.com/top#foo").getAnchorName(); // "foo"
    */
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
    this.padding = opt.padding || new Padding();
    this.border = opt.border || new Border();
    this.margin = opt.margin || new Margin();
  }

  BoxEdge.prototype = {
    /**
       @memberof Nehan.BoxEdge
       @return {Nehan.BoxEdge}
    */
    clone : function(){
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
    clear : function(){
      this.padding.clear();
      this.border.clear();
      this.margin.clear();
    },
    /**
       get css object
       @memberof Nehan.BoxEdge
    */
    getCss : function(){
      var css = {};
      Args.copy(css, this.padding.getCss());
      Args.copy(css, this.border.getCss());
      Args.copy(css, this.margin.getCss());
      return css;
    },
    /**
       get size of physical width amount size in px.
       @memberof Nehan.BoxEdge
     */
    getWidth : function(){
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
    getHeight : function(){
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
    getMeasure : function(flow){
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
    getExtent : function(flow){
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
    getInnerMeasureSize : function(flow){
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
    getInnerExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtent(flow);
      ret += this.border.getExtent(flow);
      return ret;
    },
    /**
       get before size amount in px.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getBefore : function(flow){
      var ret = 0;
      ret += this.padding.getBefore(flow);
      ret += this.border.getBefore(flow);
      ret += this.margin.getBefore(flow);
      return ret;
    },
    /**
       get after size amount in px.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getAfter : function(flow){
      var ret = 0;
      ret += this.padding.getAfter(flow);
      ret += this.border.getAfter(flow);
      ret += this.margin.getAfter(flow);
      return ret;
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    setBorderRadius : function(flow, value){
      this.border.setRadius(flow, value);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    setBorderColor : function(flow, value){
      this.border.setColor(flow, value);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    setBorderStyle : function(flow, value){
      this.border.setStyle(flow, value);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBefore : function(flow){
      this.padding.clearBefore(flow);
      this.border.clearBefore(flow);
      this.margin.clearBefore(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearAfter : function(flow){
      this.padding.clearAfter(flow);
      this.border.clearAfter(flow);
      this.margin.clearAfter(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBorderStart : function(flow){
      this.border.clearStart(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBorderBefore : function(flow){
      this.border.clearBefore(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBorderAfter : function(flow){
      this.border.clearAfter(flow);
    }
  };

  return BoxEdge;
})();

var BoxSize = (function(){
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

  BoxSize.prototype = {
    /**
       clone box size object with same values.

       @memberof Nehan.BoxSize
       @return {Nehan.BoxSize}
    */
    clone : function(){
      return new BoxSize(this.width, this.height);
    },
    /**
       @memberof Nehan.BoxSize
       @param flow {Nehan.BoxFlow}
       @param extent {int}
     */
    setExtent : function(flow, extent){
      this[flow.getPropExtent()] = extent;
    },
    /**
       @memberof Nehan.BoxSize
       @param flow {Nehan.BoxFlow}
       @param measure {int}
     */
    setMeasure : function(flow, measure){
      this[flow.getPropMeasure()] = measure;
    },
    /**
       @memberof Nehan.BoxSize
       @param flow {Nehan.BoxFlow}
       @return {Object}
     */
    getCss : function(flow){
      var css = {};
      css.width = this.width + "px";
      css.height = this.height + "px";
      return css;
    },
    /**
       get content size of measure

       @memberof Nehan.BoxSize
       @param flow {Nehan.BoxFlow}
       @return {int}
     */
    getMeasure : function(flow){
      return this[flow.getPropMeasure()];
    },
    /**
       get content size of extent

       @memberof Nehan.BoxSize
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getExtent : function(flow){
      return this[flow.getPropExtent()];
    }
  };

  return BoxSize;
})();

var BoxPosition = (function(){
  /**
     @memberof Nehan
     @class BoxPosition
     @classdesc logical css 'position' property
     @constructor
     @param position {string}
  */
  function BoxPosition(position){
    this.position = position;
  }

  BoxPosition.prototype = {
    /**
       @memberof Nehan.BoxPosition
       @return {boolean}
    */
    isAbsolute : function(){
      return this.position === "absolute";
    },
    /**
       @memberof Nehan.BoxPosition
       @return {Object}
    */
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
  /**
     @memberof Nehan
     @class Box
     @classdesc box abstraction with size and style context
     @constrctor
     @param {Nehan.BoxSize} box size
     @param {Nehan.StyleContext}
  */
  function Box(size, style, type){
    this.size = size;
    this.style = style;
    this.type = type || "block";
    this.css = {};
  }

  var __filter_text = function(elements){
    return List.fold(elements, [], function(ret, element){
      if(element instanceof Box){
	return ret.concat(__filter_text(element.elements || []));
      }
      return element? ret.concat(element) : ret;
    });
  };

  Box.prototype = {
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isLine : function(){
      return this.type === "line-block";
    },
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isTextBlock : function(){
      return this.type === "text-block";
    },
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isRootLine : function(){
      return this.isRootLine || false;
    },
    /**
       filter text object and concat it as string, mainly used for debugging.

       @memberof Nehan.Box
       @return {string}
    */
    toString : function(){
      var texts = __filter_text(this.elements || []);
      return List.fold(texts, "", function(ret, text){
	var str = (text instanceof Ruby)? text.getRbString() : (text.data || "");
	return ret + str;
      });
    },
    /**
       @memberof Nehan.Box
       @return {string}
    */
    getId : function(){
      return this.id || null;
    },
    /**
       @memberof Nehan.Box
       @return {Array.<string>}
    */
    getClassName : function(){
      return this.classes? this.classes.join(" ") : "";
    },
    /**
       @memberof Nehan.Box
       @return {string}
    */
    getContent : function(){
      return this.content || null;
    },
    /**
       @memberof Nehan.Box
       @return {Function}
    */
    getOnCreate : function(){
      // on create of text-block is already captured by parent line
      if(this.isTextBlock()){
	return null;
      }
      return this.style.getCssAttr("oncreate");
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getAttrs : function(){
      // attributes of text-block is already captured by parent line
      if(this.isTextBlock()){
	return null;
      }
      return this.style.markup.attrs;
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getBoxCss : function(){
      switch(this.display){
      case "block": return this.getCssBlock();
      case "inline": return this.getCssInline();
      case "inline-block": return this.getCssInlineBlock();
      }
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getCssBlock : function(){
      return this.style.getCssBlock(this);
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getCssInline : function(){
      if(this.isTextBlock()){
	return this.style.getCssTextBlock(this);
      }
      return this.style.getCssLineBlock(this);
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getCssInlineBlock : function(){
      return this.style.getCssInlineBlock(this);
    },
    /**
       @memberof Nehan.Box
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssHoriInlineImage : function(line){
      return this.style.getCssHoriInlineImage(line, this);
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getContentMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.size.getMeasure(flow);
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getContentExtent : function(flow){
      flow = flow || this.style.flow;
      return this.size.getExtent(flow);
    },
    /**
       @memberof Nehan.Box
       @return {int}
    */
    getContentWidth : function(){
      return this.size.width;
    },
    /**
       @memberof Nehan.Box
       @return {int}
    */
    getContentHeight : function(){
      return this.size.height;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getEdgeMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getMeasure(flow) : 0;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getEdgeExtent : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getExtent(flow) : 0;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getLayoutMeasure : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentMeasure(flow) + this.getEdgeMeasure(flow);
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getLayoutExtent : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentExtent(flow) + this.getEdgeExtent(flow);
    },
    /**
       @memberof Nehan.Box
    */
    clearBorderBefore : function(){
      if(this.edge){
	this.edge.clearBorderBefore(this.style.flow);
      }
    },
    /**
       @memberof Nehan.Box
    */
    clearBorderAfter : function(){
      if(this.edge){
	this.edge.clearBorderAfter(this.style.flow);
      }
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @param extent {int}
    */
    resizeExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
      return this;
    }
  };

  return Box;
})();

var HtmlLexer = (function (){
  var __rex_tag = /<[a-zA-Z][^>]*>/;

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
    return restart_pos2 + __find_close_pos(buff.substring(restart_pos2), tag_name, open_tag_rex, close_tag);
  };

  /**
     @memberof Nehan
     @class HtmlLexer
     @classdesc lexer of html tag elements.
     @constructor
     @param src {String}
  */
  function HtmlLexer(src){
    this.pos = 0;
    this.buff = this._normalize(src);
    this.src = this.buff;
  }

  // discard close tags defined as single tag in LexingRule.
  var __replace_single_close_tags = function(str){
    return List.fold(LexingRule.getSingleTagNames(), str, function(ret, name){
      return ret.replace(new RegExp("</" + name + ">", "g"), "");
    });
  };

  HtmlLexer.prototype = {
    _normalize : function(src){
      var src = src.replace(/(<\/.+?>)(?:[\s]*)/gm, function(str, p1){
	  return p1.toLowerCase();
      }); // convert close tag to lower case(for innerHTML of IE)
      src = __replace_single_close_tags(src);
      //src = src.replace(/“([^”]+)”/g, "〝$1〟") // convert double quote to double quotation mark
      return src
	.replace(/^[\s]+/, "") // shorten head space
	.replace(/[\s]+$/, "") // discard tail space
	.replace(/\r/g, ""); // discard CR
    },
    /**
       @memberof Nehan.HtmlLexer
       @return {boolean}
    */
    isEmpty : function(){
      return this.src === "";
    },
    /**
       get token and step cusor to next position.

       @memberof Nehan.HtmlLexer
       @return {Nehan.Token}
    */
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    /**
       get lexer source text

       @memberof Nehan.HtmlLexer
       @return {String}
    */
    getSrc : function(){
      return this.src;
    },
    /**
       get current pos in percentage format.

       @memberof Nehan.HtmlLexer
       @return {int}
    */
    getSeekPercent : function(seek_pos){
      return Math.round(100 * seek_pos / this.src.length);
    },
    /**
       @memberof Nehan.HtmlLexer
       @param text {String}
     */
    addText : function(text){
      this.buff = this.buff + this._normalize(text);
    },
    _stepBuff : function(count){
      var part = this.buff.substring(0, count);
      this.pos += count;
      this.buff = this.buff.slice(count);
      return part;
    },
    _getToken : function(){
      if(this.buff === ""){
	return null;
      }
      var match;
      match = this.buff.match(__rex_tag);
      if(match === null){
	return new Text(this._stepBuff(this.buff.length));
      }
      if(match.index === 0){
	return this._parseTag(match[0]);
      }
      return new Text(this._stepBuff(match.index));
    },
    _getTagContent : function(tag_name){
      // why we added [\\s|>] for open_tag_rex?
      // if tag_name is "p", 
      // both "<p>" and "<p class='foo'" also must be matched.
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
    _parseTag : function(tagstr){
      var tag = new Tag(tagstr);
      this._stepBuff(tagstr.length);
      var tag_name = tag.getName();
      if(LexingRule.isSingleTag(tag_name)){
	tag._single = true;
	return tag;
      }
      return this._parseChildContentTag(tag);
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
    }
  };
  return HtmlLexer;
})();



var TextLexer = (function (){
  var __rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var __rex_word = /^[\w!\.\?\/\:#;"',]+/;
  var __rex_char_ref = /^&[^;\s]+;/;

  /**
     @memberof Nehan
     @class TextLexer
     @classdesc lexer of html text elements.
     @constructor
     @param src {String}
  */
  function TextLexer(src){
    HtmlLexer.call(this, src);
  }

  Class.extend(TextLexer, HtmlLexer);

  TextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var str = this._getByRex(__rex_word);
    if(str){
      if(str.length === 1){
	return new Char(this._stepBuff(1), false);
      } else if(str.length === 2 && str.match(__rex_tcy)){
	return new Tcy(this._stepBuff(str.length));
      }
      return new Word(this._stepBuff(str.length));
    }
    str = this._getByRex(__rex_char_ref);
    if(str){
      return new Char(this._stepBuff(str.length), true);
    }
    str = this.buff.substring(0, 1);
    return new Char(this._stepBuff(1), false);
  };

  TextLexer.prototype._getByRex = function(rex){
    var rex_result = this.buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  return TextLexer;
})();


var SectionHeader = (function(){
  /**
     @memberof Nehan
     @class SectionHeader
     @classdesc abstraction of section header with header rank, header title, and system unique id(optional).
     @constructor
  */
  function SectionHeader(rank, title, id){
    this.rank = rank;
    this.title = title;
    this._id = id || 0;
  }

  SectionHeader.prototype = {
    /**
       @memberof Nehan.SectionHeader
       @return {int}
    */
    getId : function(){
      return this._id;
    }
  };

  return SectionHeader;
})();

var Section = (function(){
  /**
     @memberof Nehan
     @class Section
     @classdesc section tree node with parent, next, child pointer.
     @constructor
  */
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
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    isRoot : function(){
      return this._parent === null;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    isAuto : function(){
      return this._auto;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasHeader : function(){
      return this._header !== null;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasHeaderId : function(){
      return this.getHeaderId() > 0;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasChild : function(){
      return this._child !== null;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasNext : function(){
      return this._next !== null;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.Section}
    */
    getNext : function(){
      return this._next;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.Section}
    */
    getChild : function(){
      return this._child;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.Section}
    */
    getParent : function(){
      return this._parent;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.SectionHeader}
    */
    getHeader : function(){
      return this._header;
    },
    /**
       @memberof Nehan.Section
       @return {int}
    */
    getHeaderId : function(){
      if(this._header){
	return this._header.getId();
      }
      return null;
    },
    /**
       @memberof Nehan.Section
       @param header {Nehan.SectionHeader}
    */
    setHeader : function(header){
      this._header = header;
    },
    /**
       @memberof Nehan.Section
    */
    setAuto : function(){
      this._auto = true;
    },
    /**
       @memberof Nehan.Section
       @return {int}
    */
    getRank : function(){
      return this._header? this._header.rank : 0;
    },
    /**
       @memberof Nehan.Section
       @return {String}
    */
    getTitle : function(){
      return this._header? this._header.title : ["untitled", this._type].join(" ");
    },
    /**
       @memberof Nehan.Section
       @return {String}
    */
    getType : function(){
      return this._type;
    },
    /**
       @memberof Nehan.Section
       @return {int}
    */
    getPageNo : function(){
      return this._pageNo;
    },
    /**
       @memberof Nehan.Section
       @param page_no {int}
    */
    updatePageNo : function(page_no){
      this._pageNo = page_no;
    },
    /**
       @memberof Nehan.Section
       @param section {Nehan.Section}
    */
    addChild : function(section){
      if(this._child === null){
	this._child = section;
      } else {
	this._child.addNext(section);
      }
    },
    /**
       @memberof Nehan.Section
       @param section {Nehan.Section}
    */
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
  /**
     @memberof Nehan
     @class TocContext
     @classdesc context data of toc parsing.
     @constructor
  */
  function TocContext(){
    this.stack = [1];
  }

  TocContext.prototype = {
    /**
       @memberof Nehan.TocContext
       @return {String}
       @example
       * // assume that current toc stack is [1,2,1].
       * ctx.toString(); // "1.2.1"
    */
    toString : function(){
      return this.stack.join(".");
    },
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
    stepNext : function(){
      if(this.stack.length > 0){
	this.stack[this.stack.length - 1]++;
      }
      return this;
    },
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
    startRoot : function(){
      this.stack.push(1);
      return this;
    },
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
    endRoot : function(){
      this.stack.pop();
      return this;
    }
  };

  return TocContext;
})();

var OutlineContext = (function(){
  /**
     @memberof Nehan
     @class OutlineContext
     @classdesc outline context object. outline is generated by section root element, sectionning element, heading element etc.
     @constructor
     @param markup_name {String} - section root name like "body", "fieldset", "blockquote" etc.
  */
  function OutlineContext(markup_name){
    this.logs = [];
    this.markupName = markup_name;
  }

  OutlineContext.prototype = {
    /**
       @memberof Nehan.OutlineContext
       @return {boolean}
    */
    isEmpty : function(){
      return this.logs.length === 0;
    },
    /**
       @memberof Nehan.OutlineContext
       @return {Object} log object
    */
    get : function(index){
      return this.logs[index] || null;
    },
    /**
       @memberof Nehan.OutlineContext
       @return {String}
    */
    getMarkupName : function(){
      return this.markupName;
    },
    /**
       @memberof Nehan.OutlineContext
       @param type {String} - markup name
       @return {Nehan.OutlineContext}
    */
    startSection : function(type){
      this.logs.push({
	name:"start-section",
	type:type,
	pageNo:DocumentContext.getPageNo()
      });
      return this;
    },
    /**
       @memberof Nehan.OutlineContext
       @param type {String} - markup name
       @return {Nehan.OutlineContext}
    */
    endSection : function(type){
      this.logs.push({
	name:"end-section",
	type:type
      });
      return this;
    },
    /**
       @memberof Nehan.OutlineContext
       @param opt {Object}
       @param opt.type {String} - markup name
       @param opt.rank {int} - header rank(1 - 6)
       @param opt.title {String} - header title
       @return {String} header id
    */
    addHeader : function(opt){
      // header id is used to associate header box object with outline.
      var header_id = DocumentContext.genHeaderId();
      this.logs.push({
	name:"set-header",
	type:opt.type,
	rank:opt.rank,
	title:opt.title,
	pageNo:DocumentContext.getPageNo(),
	headerId:header_id
      });
      return header_id;
    }
  };

  return OutlineContext;
})();

/**
   parser module to convert from context to section tree object.

   @namespace Nehan.OutlineContextParser
*/
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
      _parse(context, section, ptr);
      break;

    case "end-section":
      _parse(context, parent.getParent(), ptr);
      break;

    case "set-header":
      var header = new SectionHeader(log.rank, log.title, log.headerId);
      if(parent === null){
	var auto_section = new Section("section", null, log.pageNo);
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
	  var next_section = new Section("section", parent, log.pageNo);
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  _parse(context, next_section, ptr);
	} else { // lower rank
	  var child_section = new Section("section", parent, log.pageNo);
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
/**
   convert section tree({@link Nehan.Section}) to DOMElement.

   @namespace Nehan.SectionTreeConverter
*/
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
      callbacks = Args.merge({}, default_callbacks, callbacks || {});
      var toc_context = new TocContext();
      var root_node = callbacks.createRoot();
      return parse(toc_context, root_node, outline_tree, callbacks); // section tree -> dom node
    }
  };
})();

var DocumentHeader = (function(){
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

  DocumentHeader.prototype = {
    /**
       @memberof Nehan.DocumentHeader
       @param title {String}
    */
    setTitle :function(title){
      this.title = title;
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {String}
    */
    getTitle : function(){
      return this.title;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addLink : function(markup){
      this.links.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getLinks : function(){
      return this.links;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addMeta : function(markup){
      this.metas.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getMetas : function(){
      return this.metas;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param name {String}
       @return {Nehan.Tag}
    */
    getMetaByName : function(name){
      return List.find(this.metas, function(meta){
	return meta.getTagAttr("name") === name;
      });
    },
    /**
       @memberof Nehan.DocumentHeader
       @param name {String}
       @return {String}
    */
    getMetaContentByName : function(name){
      var meta = this.getMetaByName(name);
      return meta? meta.getTagAttr("content") : null;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addScript : function(markup){
      this.scripts.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getScripts : function(){
      return this.scripts;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addStyle : function(markup){
      this.styles.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getStyles : function(){
      return this.styles;
    }
  };

  return DocumentHeader;
})();


/**
   global context data for all layout engines defined in same browser window.

   @namespace Nehan.DocumentContext
*/
var DocumentContext = (function(){
  var __document_type = "html";
  var __document_header = null;
  var __page_no = 0;
  var __char_pos = 0;
  var __anchors = {};
  var __outline_contexts = [];
  var __header_id = 0; // unique header-id
  var __block_id = 0; // unique block-id
  var __root_block_id = 0; // unique block-id for direct children of <body>.

  var __get_outline_contexts_by_name = function(section_root_name){
    return List.filter(__outline_contexts, function(context){
      return context.getMarkupName() === section_root_name;
    });
  };

  var __convert_outline_context_to_element = function(context, callbacks){
    var tree = OutlineContextParser.parse(context);
    return tree? SectionTreeConverter.convert(tree, callbacks) : null;
  };

  var __create_outline_elements_by_name = function(section_root_name, callbacks){
    var contexts = __get_outline_contexts_by_name(section_root_name);
    return List.fold(contexts, [], function(ret, context){
      var element = __convert_outline_context_to_element(context, callbacks);
      return element? ret.concat(element) : ret;
    });
  };

  return {
    /**
       @memberof Nehan.DocumentContext
       @param document_type {String}
    */
    setDocumentType : function(document_type){
      __document_type = document_type;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {String}
    */
    getDocumentType : function(){
      return __document_type;
    },
    /**
       @memberof Nehan.DocumentContext
       @param document_header {Nehan.DocumentHeader}
    */
    setDocumentHeader : function(document_header){
      __document_header = document_header;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {Nehan.DocumentHeader}
    */
    getDocumentHeader : function(){
      return __document_header;
    },
    /**
       @memberof Nehan.DocumentContext
       @param char_pos {int}
    */
    stepCharPos : function(char_pos){
      __char_pos += char_pos;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    getCharPos : function(){
      return __char_pos;
    },
    /**
       @memberof Nehan.DocumentContext
    */
    stepPageNo : function(){
      __page_no++;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    getPageNo : function(){
      return __page_no;
    },
    /**
       @memberof Nehan.DocumentContext
       @param outline_context {Nehan.OutlineContext}
    */
    addOutlineContext : function(outline_context){
      __outline_contexts.push(outline_context);
    },
    /**
       @memberof Nehan.DocumentContext
       @param name {String}
    */
    addAnchor : function(name){
      __anchors[name] = __page_no;
    },
    /**
       @memberof Nehan.DocumentContext
       @param name {String}
       @return {int}
    */
    getAnchorPageNo : function(name){
      return (typeof __anchors[name] === "undefined")? null : __anchors[name];
    },
    /**
       @memberof Nehan.DocumentContext
       @return {String}
    */
    genHeaderId : function(){
      return [Nehan.engineId, __header_id++].join("-");
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    genRootBlockId : function(){
      return __root_block_id++;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    genBlockId : function(){
      return __block_id++;
    },
    /**
       * this is shortcut function for __create_outline_elements_by_name("body", callbacks).<br>
       * if many outline elements exists(that is, multiple '&lt;body&gt;' exists), use first one only.<br>
       * for details of callback function, see {@link Nehan.SectionTreeConverter}.

       @memberof Nehan.DocumentContext
       @param callbacks {Object} - hooks for each outline element.
       @param callbacks.onClickLink {Function}
       @param callbacks.createRoot {Function}
       @param callbacks.createChild {Function}
       @param callbacks.createLink {Function}
       @param callbacks.createToc {Function}
       @param callbacks.createPageNoItem {Function}
       @return {DOMElement}
    */
    createBodyOutlineElement : function(callbacks){
      var elements = __create_outline_elements_by_name("body", callbacks);
      return (elements.length === 0)? null : elements[0];
    },
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
    createOutlineElementsByName : function(section_root_name, callbacks){
      return __create_outline_elements_by_name(section_root_name, callbacks);
    }
  };
})();


var TokenStream = (function(){
  /**
     @memberof Nehan
     @class TokenStream
     @classdesc abstraction of token stream with background buffering.
     @constructor
     @param src {String}
  */
  function TokenStream(src, lexer){
    this.lexer = lexer || this._createLexer(src);
    this.tokens = [];
    this.pos = 0;
    this.eof = false;
    this._doBuffer();
  }

  TokenStream.prototype = {
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    hasNext : function(){
      return (!this.eof || this.pos < this.tokens.length);
    },
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    isEmptyLexer : function(){
      return this.lexer.isEmpty();
    },
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    isEmptyTokens : function(){
      return this.tokens.length === 0;
    },
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    isHead : function(){
      return this.pos === 0;
    },
    /**
       @memberof Nehan.TokenStream
       @param text {String}
    */
    addText : function(text){
      // check if already done, and text is not empty.
      if(this.eof && text !== ""){
	this.lexer.addText(text);
	this.eof = false;
      }
    },
    /**
       step backward current stream position.

       @memberof Nehan.TokenStream
    */
    prev : function(){
      this.pos = Math.max(0, this.pos - 1);
    },
    /**
       set stream position directly.

       @memberof Nehan.TokenStream
       @param pos {int}
    */
    setPos : function(pos){
      this.pos = pos;
    },
    /**
       set current stream position to the beginning of stream.

       @memberof Nehan.TokenStream
    */
    rewind : function(){
      this.pos = 0;
    },
    /**
       look current token but not step forward current position.

       @memberof Nehan.TokenStream
       @return {token}
    */
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
    /**
       get current stream token and step forward current position.

       @memberof Nehan.TokenStream
       @return {token}
    */
    get : function(){
      var token = this.peek();
      this.pos++;
      return token;
    },
    /**
       get stream soruce as text.

       @memberof Nehan.TokenStream
       @return {String}
    */
    getSrc : function(){
      return this.lexer.getSrc();
    },
    /**
       get current stream position.

       @memberof Nehan.TokenStream
       @return {int}
    */
    getPos : function(){
      return this.pos;
    },
    /**
       get current token count.

       @memberof Nehan.TokenStream
       @return {int}
    */
    getTokenCount : function(){
      return this.tokens.length;
    },
    /**
       get current token position of source text(not stream position).

       @memberof Nehan.TokenStream
       @return {int}
    */
    getSeekPos : function(){
      var token = this.tokens[this.pos];
      return token? token.spos : 0;
    },
    /**
       get current seek pos as percent.

       @memberof Nehan.TokenStream
       @return {int}
    */
    getSeekPercent : function(){
      var seek_pos = this.getSeekPos();
      return this.lexer.getSeekPercent(seek_pos);
    },
    /**
       read whole stream source, and return all tokens immediately.

       @memberof Nehan.TokenStream
       @return {Array.<token>}
    */
    getAll : function(){
      while(!this.eof){
	this._doBuffer();
      }
      return this.tokens;
    },
    /**
       read whole stream source, and return all tokens immediately, but filter by [fn].

       @memberof Nehan.TokenStream
       @param fn {Function}
       @return {Array.<token>}
    */
    getAllIf : function(fn){
      return List.filter(this.getAll(), function(token){
	return fn(token);
      });
    },
    /**
       iterate tokens by [fn].

       @memberof Nehan.TokenStream
       @param fn {Function}
    */
    iterWhile : function(fn){
      var token;
      while(this.hasNext()){
	token = this.get();
	if(token === null || !fn(token)){
	  this.prev();
	  break;
	}
      }
    },
    /**
       step stream position while [fn(token)] is true.

       @memberof Nehan.TokenStream
       @param fn {Function}
    */
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
  /**
     @memberof Nehan
     @class FilteredTokenStream
     @classdesc token stream that is filtered by [fn](token -> bool).
     @constructor
     @extends {Nehan.TokenStream}
     @param src {String} - html text
     @param fn {Function} - {@link Nehan.Token} -> bool
   */
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
  /**
     @memberof Nehan
     @class DocumentTokenStream
     @classdesc token stream for &lt;document&gt; tag.
     @extends {Nehan.FilteredTokenStream}
  */
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
  /**
     @memberof Nehan
     @class HtmlTokenStream
     @classdesc token stream for &lt;html&gt; tag(head, body).
     @extends {Nehan.FilteredTokenStream}
     @param src {String} - content text of &lt;html&gt; tag.
  */
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
  /**
     @memberof Nehan
     @class HeadTokenStream
     @classdesc tokens of &lt;head&gt; tag content(title, meta, link, style, script).
     @constructor
     @extends {Nehan.FilteredTokenStream}
  */
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
  /**
     token stream of &lt;ruby&gt; tag content.

     @memberof Nehan
     @class RubyTokenStream
     @classdesc 
     @constructor
     @extends {Nehan.TokenStream}
     @param markup {Nehan.Tag}
  */
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
      if(Token.isTag(token) && token.getName() === "rb"){
	rbs = this._parseRb(token.getContent())
      }
      if(token instanceof Text){
	rbs = this._parseRb(token.getContent());
      }
    }
    return new Ruby(rbs, rt);
  };

  RubyTokenStream.prototype._parseRb = function(content){
    var lexer = new TextLexer(content);
    return (new TokenStream(content, lexer)).getAll();
  };

  return RubyTokenStream;
})();


var Page = (function(){
  /**
     @memberof Nehan
     @class Page
     @classdesc abstract evaluated page object.
     @constructor
     @param opt {Object}
     @param opt.element {DOMElement} - generated DOMElement.
     @param opt.seekPos {int} - page seek position in literal string pos.
     @param opt.pageNo {int} - page index starts from 0.
     @param opt.charPos {int} - character position of this page from first page.
     @param opt.charCount {int} - character count included in this page object.
     @param opt.percent {int}
  */
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
  /**
     @memberof Nehan
     @class PageEvaluator
     @classdesc evaluate {@link Nehan.Box} as {@link Nehan.Page}.
     @constructor
  */
  function PageEvaluator(){
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype = {
    _getEvaluator : function(){
      return (Display.direction === "vert")? new VertEvaluator() : new HoriEvaluator();
    },
    /**
       evaluate {@link Nehan.Box}, output {@link Nehan.Page}.

       @memberof Nehan.PageEvaluator
       @param tree {Nehan.Box}
       @return {Nehan.Page}
    */
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
  /**
     @memberof Nehan
     @class PageStream
     @classdesc async stream of paged-media.
     @consturctor
     @param text {String} - html source text
  */
  function PageStream(text){
    this.text = this._createSource(text);
    this._trees = [];
    this._pages = [];
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
  }

  PageStream.prototype = {
    /**
       @memberof Nehan.PageStream
       @param page_no {int} - page index
       @return {boolean}
    */
    hasPage : function(page_no){
      return (typeof this._trees[page_no] != "undefined");
    },
    /**
       @memberof Nehan.PageStream
       @return {boolean}
    */
    hasNext : function(){
      return this.generator.hasNext();
    },
    /**
       @memberof Nehan.PageStream
       @param text {String}
    */
    addText : function(text){
      this.generator.addText(text);
    },
    /**
       @memberof Nehan.PageStream
       @param status {boolean}
    */
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    /**
       calculate all pages by blocking loop.

       @memberof Nehan.PageStream
    */
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
    /**
       calculate all pages by asyncronous way.

       @memberof Nehan.PageStream
       @param opt {Object}
       @param opt.onProgress {Function} - fun {@link Nehan.PageStream} -> {@link Nehan.Box} -> ()
       @param opt.onComplete {Function} - fun {@link Nehan.PageStream} -> ellapse_time:float -> ()
       @param opt.onError {Function} - fun {@link Nehan.PageStream} -> ()
    */
    asyncGet : function(opt){
      Args.merge(this, {
	onComplete : function(self, time){},
	onProgress : function(self, tree){},
	onError : function(self){}
      }, opt || {});
      this._setTimeStart();
      this._asyncGet(opt.wait || 0);
    },
    /**
       @memberof Nehan.PageStream
       @return {int}
    */
    getPageCount : function(){
      return this._trees.length;
    },
    /**
       same as getPage, defined to keep compatibility of older version of nehan.js

       @memberof Nehan.PageStream
       @param page_no {int} - page index starts from 0.
       @deprecated
    */
    get : function(page_no){
      return this.getPage(page_no);
    },
    /**
       get evaluated page object.

       @memberof Nehan.PageStream
       @param page_no {int} - page index starts from 0.
       @return {Nehan.Page}
    */
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
    /**
       get pre evaluated page tree.

       @memberof Nehan.PageStream
       @param page_no {int} - page index starts from 0.
       @return {Nehan.Box}
    */
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
      switch(Display.root){
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


/**
 * kerning utility module<br>
 * notice that in nehan.js, charactors that can be shurinked are already shurinked in it's body size calculation.<br>
 * so this module only 'add' the space to start/end direction, not requiered to be shurinked.

 @namespace Nehan.Kerning
*/
var Kerning = {
  /**
     @memberof Nehan.Kerning
     @param cur_char {Nehan.Char}
     @param prev_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
     @param next_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
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
    if(Token.isChar(prev_text) && prev_text.isKakkoStart()){
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

  FloatDirection.prototype = {
    /**
       @memberof Nehan.FloatDirection
       @param flow {Nehan.BoxFlow}
       @return {Object}
    */
    getCss : function(flow){
      var css = {};
      if(flow.isTextHorizontal()){
	if(this.isStart()){
	  css["css-float"] = "left";
	} else if(this.isEnd()){
	  css["css-float"] = "right";
	}
      }
      return css;
    },
    /**
       @memberof Nehan.FloatDirection
       @return {boolean}
    */
    isStart : function(){
      return this.value === "start";
    },
    /**
       @memberof Nehan.FloatDirection
       @return {boolean}
    */
    isEnd : function(){
      return this.value === "end";
    },
    /**
       @memberof Nehan.FloatDirection
       @return {boolean}
    */
    isNone : function(){
      return this.value === "none";
    }
  };

  return FloatDirection;
})();


/**
   pre defined logical float direction collection.
   @namespace Nehan.FloatDirections
 */
var FloatDirections = {
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  start:(new FloatDirection("start")),
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  end:(new FloatDirection("end")),
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  none:(new FloatDirection("none")),
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

var Break = (function(){
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

  Break.prototype = {
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isAlways : function(){
      return this.value === "always";
    },
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isAvoid : function(){
      return this.value === "avoid";
    },
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isFirst : function(){
      return (Display.getPagingDirection() === "lr")? (this.value === "left") : (this.value === "right");
    },
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isSecond : function(){
      return (Display.getPagingDirection() === "lr")? (this.value === "right") : (this.value === "left");
    },
    /**
       (TODO)
       @memberof Nehan.Break
       @param order {int}
       @return {boolean}
     */
    isNth : function(order){
    }
  };

  return Break;
})();


/**
   pre defined break collection.
   @namespace Nehan.Breaks
*/
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


var TextAlign = (function(){
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

  TextAlign.prototype = {
    /**
       @memberof Nehan.TextAlign
       @return {boolean}
    */
    isStart : function(){
      return this.value === "start";
    },
    /**
       @memberof Nehan.TextAlign
       @return {boolean}
    */
    isEnd : function(){
      return this.value === "end";
    },
    /**
       @memberof Nehan.TextAlign
       @return {boolean}
    */
    isCenter : function(){
      return this.value === "center";
    },
    /**
       @memberof Nehan.TextAlign
       @return {Object}
    */
    getCss : function(line){
      var css = {};
      if(this.value === "center"){
      }
      return css;
    }
  };

  return TextAlign;
})();


/**
   pre defined text align set

   @namespace Nehan.TextAligns
*/
var TextAligns = {
  start:(new TextAlign("start")),
  end:(new TextAlign("end")),
  center:(new TextAlign("center")),
  /**
     @memberof Nehan.TextAligns
     @param value - logical text align direction, "start" or "end" or "center".
     @return {Nehan.TextAlign}
  */
  get : function(value){
    return this[value] || null;
  }
};

var PartitionUnit = (function(){
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

  PartitionUnit.prototype = {
    /**
       get unit size in px.

       @memberof Nehan.PartitionUnit
       @param measure {int}
       @param total_weight {int}
       @return {int} size in px
    */
    getSize : function(measure, total_weight){
      return Math.floor(measure * this.weight / total_weight);
    },
    /**
       @memberof Nehan.PartitionUnit
       @param punit {Nehan.ParitionUnit}
       @return {Nehan.PartitionUnit}
    */
    mergeTo : function(punit){
      if(this.isStatic && !punit.isStatic){
	return this;
      }
      if(!this.isStatic && punit.isStatic){
	return punit;
      }
      return (this.weight > punit.weight)? this : punit;
    }
  };

  return PartitionUnit;
})();


var Partition = (function(){
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
    var smaller_parts = List.filter(sizes, function(size){ return size < min_size; });

    // if all elements has enough space for min_size, nothing to do.
    if(smaller_parts.length === 0){
      return sizes;
    }

    // total size that must be added to small parts.
    var delta_plus_total = List.fold(smaller_parts, 0, function(ret, size){ return ret + (min_size - size); });

    // filter parts that has enough space.
    var larger_parts = List.filter(sizes, function(size){
      return size - min_size >= min_size; // check if size is more than min_size and over even if min_size is subtracted.
    });

    // if there are no enough rest space, nothing to do.
    if(larger_parts.length === 0){
      return sizes;
    }

    var delta_minus_avg = Math.floor(delta_plus_total / larger_parts.length);
    return List.map(sizes, function(size){
      return (size < min_size)? min_size : ((size - min_size >= min_size)? size - delta_minus_avg : size);
    });
  };

  Partition.prototype = {
    /**
       @memberof Nehan.Partition
       @param index {int}
       @return {Nehan.PartitionUnit}
    */
    get : function(index){
      return this._punits[index] || null;
    },
    /**
       @memberof Nehan.Partition
       @return {int}
    */
    getLength : function(){
      return this._punits.length;
    },
    /**
       @memberof Nehan.Partition
       @return {int}
    */
    getTotalWeight : function(){
      return List.fold(this._punits, 0, function(ret, punit){
	return ret + punit.weight;
      });
    },
    /**
       @memberof Nehan.Partition
       @param partition {Nehan.Partition}
       @return {Nehan.Partition}
    */
    mergeTo : function(partition){
      if(this.getLength() !== partition.getLength()){
	throw "Partition::mergeTo, invalid merge target(length not same)";
      }
      // merge(this._punits[0], partition._punits[0]),
      // merge(this._punits[1], partition._punits[1]),
      // ...
      // merge(this._punits[n-1], partition._punits[n-1])
      var merged_punits =  List.mapi(this._punits, function(i, punit){
	return punit.mergeTo(partition.get(i));
      });
      return new Partition(merged_punits);
    },
    /**
       @memberof Nehan.Partition
       @param measure {int} - max measure size in px
       @return {Array<int>} - divided size array
    */
    mapMeasure : function(measure){
      var total_weight = this.getTotalWeight();
      var sizes =  List.map(this._punits, function(punit){
	return punit.getSize(measure, total_weight);
      });
      return __levelize(sizes, Display.minTableCellSize);
    }
  };

  return Partition;
})();


// key : partition count
// value : Partition
var PartitionHashSet = (function(){
  /**
     @memberof Nehan
     @class PartitionHashSet
     @classdesc hash set to manage partitioning of layout. key = partition_count, value = {@link Nehan.Partition}.
     @extends {Nehan.HashSet}
   */
  function PartitionHashSet(){
    HashSet.call(this);
  }
  Class.extend(PartitionHashSet, HashSet);

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


/**
   table partition parser module

   @namespace Nehan.TablePartitionParser
*/
var TablePartitionParser = {
  /**
    @memberof Nehan.TablePartitionParser
    @param style {Nehan.StyleContext}
    @param stream {Nehan.TokenStream}
    @return {Nehan.PartitionHashSet}
  */
  parse : function(style, stream){
    var pset = new PartitionHashSet();
    while(stream.hasNext()){
      var token = stream.get();
      if(token === null){
	break;
      }
      if(!Token.isTag(token)){
	continue;
      }
      switch(token.getName()){
      case "tbody": case "thead": case "tfoot":
	var pset2 = this.parse(style, this._getRowStream(token));
	pset = pset.union(pset2);
	break;

      case "tr":
	var cell_tags = this._getCellStream(token).getAll();
	var cell_count = cell_tags.length;
	var partition = this._getPartition(style, cell_tags);
	pset.add(cell_count, partition);
	break;
      }
    }
    return pset;
  },
  _getPartition : function(style, cell_tags){
    var self = this;
    var partition_count = cell_tags.length;
    var partition_units = List.map(cell_tags, function(cell_tag){
      return self._getPartitionUnit(style, cell_tag, partition_count);
    });
    return new Partition(partition_units);
  },
  _getPartitionUnit : function(style, cell_tag, partition_count){
    var measure = cell_tag.getAttr("measure") || cell_tag.getAttr("width") || null;
    if(measure){
      return new PartitionUnit({weight:measure, isStatic:true});
    }
    var content = cell_tag.getContent();
    var lines = cell_tag.getContent().replace(/<br \/>/g, "\n").replace(/<br>/g, "\n").split("\n");
    // this sizing algorithem is not strict, but still effective,
    // especially for text only table.
    var max_line = List.maxobj(lines, function(line){ return line.length; });
    var max_weight = Math.floor(style.contentMeasure / 2);
    var min_weight = Math.floor(style.contentMeasure / (partition_count * 2));
    var weight = max_line.length * style.getFontSize();
    // less than 50% of parent size, but more than 50% of average partition size.
    weight = Math.max(min_weight, Math.min(weight, max_weight));

    // but confirm that weight is more than single font size of parent style.
    weight = Math.max(style.getFontSize(), weight);
    return new PartitionUnit({weight:weight, isStatic:false});
  },
  _getCellStream : function(tag){
    return new FilteredTokenStream(tag.getContent(), function(token){
      return Token.isTag(token) && (token.getName() === "td" || token.getName() === "th");
    });
  },
  _getRowStream : function(tag){
    return new FilteredTokenStream(tag.getContent(), function(token){
      return Token.isTag(token) && token.getName() === "tr";
    });
  }
};


var SelectorPropContext = (function(){
  /**
     @memberof Nehan
     @class SelectorPropContext
     @classdesc selector context for functional value of style. see example.
     @constructor
     @param style {Nehan.StyleContext}
     @param cursor_context {Nehan.CursorContext}
     @example
     * Nehan.setStyle("body", {
     *   // selector prop context is at callback of functional css value!
     *   width:function(selector_prop_context){
     *     return 500;
     *   }
     * });
  */
  function SelectorPropContext(style, cursor_context){
    this._style = style;
    this._cursorContext = cursor_context || null;
  }

  SelectorPropContext.prototype = {
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.StyleContext}
    */
    getParentStyleContext : function(){
      return this._style.parent;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.BoxFlow}
    */
    getParentFlow : function(){
      var parent = this.getParentStyleContext();
      return parent? parent.flow : Display.getStdBoxFlow();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.Tag}
    */
    getMarkup : function(){
      return this._style.markup;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.DocumentContext}
    */
    getDocumentContext : function(){
      return DocumentContext;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getRestMeasure : function(){
      return this._cursorContext? this._cursorContext.getInlineRestMeasure() : null;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getRestExtent : function(){
      return this._cursorContext? this._cursorContext.getBlockRestExtent() : null;
    },
    /**
       index number of nth-child

       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getChildIndex : function(){
      return this._style.getChildIndex();
    },
    /**
       index number of nth-child-of-type

       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getChildIndexOfType : function(){
      return this._style.getChildIndexOfType;
    }
  };

  return SelectorPropContext;
})();


var SelectorContext = (function(){
  /**
     @memberof Nehan
     @class SelectorContext
     @classdesc context object that is passed to "onload" callback in constructor of {Nehan.StyleContext}.<br>
     * "onload" value is set by style definition(see example).<br>
     * unlike {@link Nehan.SelectorPropContext}, this context has all reference to css values associated with the selector key of "onload" argument in style.
     @constructor
     @extends {Nehan.SelectorPropContext}
     @param style {Nehan.StyleContext}
     @param cursor_context {Nehan.CursorContext}
     @example
     * Nehan.setStyle("body", {
     *   onload:function(selector_context){
     *      // do something
     *   }
     * });
  */
  function SelectorContext(style, cursor_context){
    SelectorPropContext.call(this, style, cursor_context);
  }
  Class.extend(SelectorContext, SelectorPropContext);

  /**
     @memberof Nehan.SelectorContext
     @method isTextVertical
     @return {boolean}
  */
  SelectorContext.prototype.isTextVertical = function(){
    // this function called before initializing style objects in this._style.
    // so this._style.flow is not ready at this time, that is, we need to get the box-flow in manual.
    var parent_flow = this.getParentFlow();
    var flow_name = this.getCssAttr("flow", parent_flow.getName());
    var flow = BoxFlows.getByName(flow_name);
    return (flow && flow.isTextVertical())? true : false;
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
     @method getCssAttr
     @param name {String}
     @param def_value {default_value} - [def_value] is returned if [name] not found.
  */
  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this._style.getCssAttr(name, def_value);
  };

  /**
     @memberof Nehan.SelectorContext
     @method setCssAttr
     @param name {String}
     @param value {css_value}
  */
  SelectorContext.prototype.setCssAttr = function(name, value){
    this._style.setCssAttr(name, value);
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
  var __managed_css_props = [
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
    //"line-height",
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
    "width",
    "word-break"
  ];

  var __is_managed_css_prop = function(prop){
    return List.exists(__managed_css_props, Closure.eq(prop));
  };

  /**
     @memberof Nehan
     @class StyleContext
     @classdesc abstraction of document tree hierarchy with selector values, associated markup, cursor_context.
     @constructor
     @param markup {Nehan.Tag} - markup of style
     @param paernt {Nehan.StyleContext} - parent style context
     @param args {Object} - option arguments
     @param args.forceCss {Object} - system css that must be applied.
     @param args.cursorContext {Nehan.CursorContext} - cursor context at the point of this style context created.
  */
  function StyleContext(markup, parent, args){
    this._initialize(markup, parent, args);
  }

  StyleContext.prototype = {
    _initialize : function(markup, parent, args){
      args = args || {};
      this.markup = markup;
      this.markupName = markup.getName();
      this.parent = parent || null;

      // notice that 'this.childs' is not children of each page.
      // for example, assume that <body> consists 2 page(<div1>, <div2>).
      //
      // <body><div1>page1</div1><div2>page2</div2></body>
      //
      // at this case, global chilren of <body> is <div1> and <div2>.
      // but for '<body> of page1', <div1> is the only child, and <div2> is for '<body> of page2' also.
      // so we may create 'contextChilds' to distinguish these difference.
      this.childs = [];

      this.next = null; // next sibling
      this.prev = null; // prev sibling

      // initialize tree
      if(parent){
	parent.appendChild(this);
      }

      // create context for each functional css property.
      this.selectorPropContext = new SelectorPropContext(this, args.cursorContext || null);

      // create selector callback context,
      // this context is passed to "onload" callback.
      // unlike selector-context, this context has reference to all css values associated with this style.
      // because 'onload' callback is called after loading selector css.
      // notice that at this phase, css values are not converted into internal style object.
      // so by updating css value, you can update calculation of internal style object.
      this.selectorContext = new SelectorContext(this, args.cursorContext || null);

      this.managedCss = new CssHashSet();
      this.unmanagedCss = new CssHashSet();

      // load managed css from
      // 1. load selector css.
      // 2. load inline css from 'style' property of markup.
      // 3. load dynamic callback css(onload) from selector css.
      // 4. load system required css(args.forceCss).
      this.managedCss.addValues(this._loadSelectorCss(markup, parent));
      this.managedCss.addValues(this._loadInlineCss(markup));
      this.managedCss.addValues(this._loadCallbackCss(this.managedCss, "onload"));
      this.managedCss.addValues(args.forceCss, {});

      // load unmanaged css from managed css
      this.unmanagedCss.addValues(this._loadUnmanagedCss(this.managedCss));

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
      var line_height = this._loadLineHeight();
      if(line_height){
	this.lineHeight = line_height;
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
      var word_break = this._loadWordBreak();
      if(word_break){
	this.wordBreak = word_break;
      }
      // static size is defined in selector or tag attr, hightest priority
      this.staticMeasure = this._loadStaticMeasure();
      this.staticExtent = this._loadStaticExtent();

      // context size(outer size and content size) is defined by
      // 1. current static size
      // 2. parent size
      // 3. current edge size.
      this.initContextSize(this.staticMeasure, this.staticExtent);

      // load partition set after context size is calculated.
      if(this.display === "table" && this.getCssAttr("table-layout") === "auto"){
	this.tablePartition = TablePartitionParser.parse(this, new TokenStream(this.getContent()));
      }

      // disable some unmanaged css properties depending on loaded style values.
      this._disableUnmanagedCssProps(this.unmanagedCss);
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.OutlinContext}
    */
    getOutlineContext : function(){
      return this.outlineContext || this.parent.getOutlineContext();
    },
    /**
       called when section root(body, blockquote, fieldset, figure, td) starts.

       @memberof Nehan.StyleContext
    */
    startOutlineContext : function(){
      this.outlineContext = new OutlineContext(this.getMarkupName());
    },
    /**
       called when section root(body, blockquote, fieldset, figure, td) ends.

       @memberof Nehan.StyleContext
       @method endOutlineContext
    */
    endOutlineContext : function(){
      DocumentContext.addOutlineContext(this.getOutlineContext());
    },
    /**
       called when section content(article, aside, nav, section) starts.

       @memberof Nehan.StyleContext
       @method startSectionContext
    */
    startSectionContext : function(){
      this.getOutlineContext().startSection(this.getMarkupName());
    },
    /**
       called when section content(article, aside, nav, section) ends.

       @memberof Nehan.StyleContext
       @method startSectionContext
    */
    endSectionContext : function(){
      this.getOutlineContext().endSection(this.getMarkupName());
    },
    /**
       called when heading content(h1-h6) starts.

       @memberof Nehan.StyleContext
       @method startHeaderContext
       @return {string} header id
    */
    startHeaderContext : function(opt){
      return this.getOutlineContext().addHeader({
	type:opt.type,
	rank:opt.rank,
	title:opt.title
      });
    },
    /**
       calculate contexual box size of this style.

       @memberof Nehan.StyleContext
       @method initContextSize
       @param measure {int}
       @param extent {int}
       @description <pre>
       * [context_size] = (outer_size, content_size)

       * (a) outer_size
       * 1. if direct size is given, use it as outer_size.
       * 2. else if parent exists, use content_size of parent.
       * 3. else if parent not exists(root), use layout size defined in layout.js.
      
       * (b) content_size
       * 1. if edge(margin/padding/border) is defined, content_size = [outer_size] - [edge_size]
       * 2. else(no edge),  content_size = [outer_size]
       *</pre>
    */
    initContextSize : function(measure, extent){
      this.outerMeasure = measure  || (this.parent? this.parent.contentMeasure : Display.getMeasure(this.flow));
      this.outerExtent = extent || (this.parent? this.parent.contentExtent : Display.getExtent(this.flow));
      this.contentMeasure = this._computeContentMeasure(this.outerMeasure);
      this.contentExtent = this._computeContentExtent(this.outerExtent);
    },
    /**
     update context size, but static size is preferred, called from {@link Nehan.FlipGenerator}.

     @memberof Nehan.StyleContext
     @method updateContextSize
     @param measure {int}
     @param extent {int}
    */
    updateContextSize : function(measure, extent){
      this.forceUpdateContextSize(this.staticMeasure || measure, this.staticExtent || extent);
    },
    /**
       force update context size, called from generator of floating-rest-generator.

       @memberof Nehan.StyleContext
       @param measure {int}
       @param extent {int}
    */
    forceUpdateContextSize : function(measure, extent){
      this.initContextSize(measure, extent);

      // force re-culculate context-size of children based on new context-size of parent.
      List.iter(this.childs, function(child){
	child.forceUpdateContextSize(null, null);
      });
    },
    /**
       clone style-context with temporary css

       @memberof Nehan.StyleContext
       @param css {Object}
       @return {Nehan.StyleContext}
    */
    clone : function(css){
      // no one can clone root style.
      var clone_style = this.parent? new StyleContext(this.markup, this.parent, {forceCss:(css || {})}) : this.createChild("div", css);
      if(clone_style.parent){
	clone_style.parent.removeChild(clone_style);
      }
      clone_style.setClone(true);
      return clone_style;
    },
    /**
       append child style context

       @memberof Nehan.StyleContext
       @param child_style {Nehan.StyleContext}
    */
    appendChild : function(child_style){
      if(this.childs.length > 0){
	var last_child = List.last(this.childs);
	last_child.next = child_style;
	child_style.prev = last_child;
      }
      this.childs.push(child_style);
    },
    /**
       @memberof Nehan.StyleContext
       @param child_style {Nehan.StyleContext}
       @return {Nehan.StyleContext | null} removed child or null if nothing removed.
    */
    removeChild : function(child_style){
      var index = List.indexOf(this.childs, function(child){
	return child === child_style;
      });
      if(index >= 0){
	var removed_child = this.childs.splice(index, 1);
	return removed_child;
      }
      return null;
    },
    /**
       inherit style with tag_name and css(optional).

       @memberof Nehan.StyleContext
       @param tag_name {String}
       @param css {Object}
       @param tag_attr {Object}
       @return {Nehan.StyleContext}
    */
    createChild : function(tag_name, css, tag_attr){
      var tag = new Tag("<" + tag_name + ">");
      tag.setAttrs(tag_attr || {});
      return new StyleContext(tag, this, {forceCss:(css || {})});
    },
    /**
       calclate max marker size by total child_count(item_count).

       @memberof Nehan.StyleContext
       @param item_count {int}
    */
    setListItemCount : function(item_count){
      var max_marker_html = this.getListMarkerHtml(item_count);
      // create temporary inilne-generator but using clone style, this is because sometimes marker html includes "<span>" element,
      // and we have to avoid 'appendChild' from child-generator of this tmp generator.
      var tmp_gen = new InlineGenerator(this.clone(), new TokenStream(max_marker_html));
      var line = tmp_gen.yield();
      var marker_measure = line? line.inlineMeasure + Math.floor(this.getFontSize() / 2) : this.getFontSize();
      var marker_extent = line? line.size.getExtent(this.flow) : this.getFontSize();
      this.listMarkerSize = this.flow.getBoxSize(marker_measure, marker_extent);
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isClone : function(){
      return this._isClone || false;
    },
    /**
       @memberof Nehan.StyleContext
       @param state {boolean}
    */
    setClone : function(state){
      this._isClone = state;
    },
    /**
       @memberof Nehan.StyleContext
       @param opt {Object}
       @param opt.extent {int}
       @param opt.elements {Array.<Nehan.Box>}
       @param opt.breakAfter {boolean}
       @param opt.blockId {int}
       @param opt.rootBlockId {int}
       @param opt.content {String}
       @param opt.cancelEdge {Object}
       @param opt.cancelEdge.before {int}
       @param opt.cancelEdge.after {int}
       @return {Nehan.Box}
    */
    createBlock : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var measure = this.contentMeasure;
      var extent = this.contentExtent;

      // if elements under <body>, staticExtent or context extent(opt.extent) is available.
      if(this.parent && opt.extent){
	extent = this.staticExtent || opt.extent;
      }
      var classes = ["nehan-block", "nehan-" + this.getMarkupName()].concat(this.markup.getClasses());
      var box_size = this.flow.getBoxSize(measure, extent);
      var box = new Box(box_size, this);
      if(this.markup.isHeaderTag()){
	classes.push("nehan-header");
      }
      if(this.isClone()){
	classes.push("nehan-clone");
      }
      if(typeof opt.rootBlockId !== "undefined"){
	box.rootBlockId = opt.rootBlockId;
      }
      box.blockId = opt.blockId;
      box.display = (this.display === "inline-block")? this.display : "block";
      box.edge = this._createBlockContextEdge(this.edge || null, opt.cancelEdge || null); // for Box::getLayoutExtent, Box::getLayoutMeasure
      box.elements = elements;
      box.classes = classes;
      box.charCount = List.fold(elements, 0, function(total, element){
	return total + (element.charCount || 0);
      });
      box.breakAfter = this.isBreakAfter() || opt.breakAfter || false;
      box.content = opt.content || null;
      if(this.isPushed()){
	box.pushed = true;
      } else if(this.isPulled()){
	box.pulled = true;
      }
      return box;
    },
    _createBlockContextEdge : function(edge, cancel_edge){
      if(edge === null){
	return null;
      }
      if(cancel_edge === null || (cancel_edge.before === 0 && cancel_edge.after === 0)){
	return edge; // nothing to do
      }
      var context_edge = edge.clone();
      if(cancel_edge.before){
	context_edge.clearBefore(this.flow);
      }
      if(cancel_edge.after){
	context_edge.clearAfter(this.flow);
      }
      return context_edge;
    },
    /**
       @memberof Nehan.StyleContext
       @param opt
       @param opt.breakAfter {boolean}
       @return {Nehan.Box}
    */
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
    /**
       @memberof Nehan.StyleContext
       @param opt
       @param opt.measure {int}
       @param opt.content {String}
       @param opt.charCount {int}
       @param opt.elements {Array.<Nehan.Box>}
       @param opt.maxFontSize {int}
       @param opt.maxExtent {int}
       @param opt.lineBreak {boolean}
       @param opt.breakAfter {boolean}
       @return {Nehan.Box}
    */
    createLine : function(opt){
      opt = opt || {};
      var is_root_line = this.isRootLine();
      var elements = opt.elements || [];
      var max_font_size = opt.maxFontSize || this.getFontSize();
      var max_extent = opt.maxExtent || this.staticExtent || 0;
      var char_count = opt.charCount || 0;
      var content = opt.content || null;
      var measure = this.contentMeasure;
      if((this.parent && opt.measure && !is_root_line) || (this.display === "inline-block")){
	measure = this.staticMeasure || opt.measure;
      }
      var line_size = this.flow.getBoxSize(measure, max_extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()].concat(this.markup.getClasses());
      var line = new Box(line_size, this, "line-block");
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = elements;
      line.classes = is_root_line? classes : classes.concat("nehan-" + this.getMarkupName());
      line.charCount = char_count;
      line.maxFontSize = max_font_size;
      line.maxExtent = max_extent;
      line.content = content;
      line.isRootLine = is_root_line;

      // edge of top level line is disabled.
      // for example, consider '<p>aaa<span>bbb</span>ccc</p>'.
      // anonymous line block('aaa' and 'ccc') is already edged by <p> in block level.
      // so if line is anonymous, edge must be ignored.
      line.edge = (this.edge && !is_root_line)? this.edge : null;

      // backup other line data. mainly required to restore inline-context.
      if(is_root_line){
	line.lineNo = opt.lineNo;
	line.lineBreak = opt.lineBreak || false;
	line.breakAfter = opt.breakAfter || false;
	line.inlineMeasure = opt.measure || this.contentMeasure;

	// if vertical line, needs some position fix for decorated element(ruby, empha) to align baseline.
	if(this.isTextVertical()){
	  this._setVertBaseline(line);
	} else {
	  this._setHoriBaseline(line);
	}
	if(this.textAlign && !this.textAlign.isStart()){
	  this._setTextAlign(line, this.textAlign);
	}
	var edge_size = Math.floor(line.maxFontSize * this.getLineHeight()) - line.maxExtent;
	if(line.elements.length > 0 && edge_size > 0){
	  line.edge = new BoxEdge();
	  line.edge.padding.setBefore(this.flow, (line.lineNo > 0)? edge_size : Math.floor(edge_size / 2));
	}
      }
      //console.log("line(%o):%s:(%d,%d), is_root:%o", line, line.toString(), line.size.width, line.size.height, is_root_line);
      return line;
    },
    /**
       @memberof Nehan.StyleContext
       @param opt
       @param opt.measure {int}
       @param opt.content {String}
       @param opt.charCount {int}
       @param opt.elements {Array.<Nehan.Char | Nehan.Word | Nehan.Tcy>}
       @param opt.maxFontSize {int}
       @param opt.maxExtent {int}
       @param opt.lineBreak {boolean}
       @param opt.breakAfter {boolean}
       @return {Nehan.Box}
    */
    createTextBlock : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var font_size = this.getFontSize();
      var extent = opt.maxExtent || font_size;
      var measure = opt.measure;
      var char_count = opt.charCount || 0;
      var content = opt.content || null;

      if(opt.isEmpty){
	extent = 0;
      } else if(this.isTextEmphaEnable()){
	extent = this.getEmphaTextBlockExtent();
      } else if(this.markup.name === "ruby"){
	extent = this.getRubyTextBlockExtent();
      }
      var line_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-text-block"].concat(this.markup.getClasses());
      var line = new Box(line_size, this, "text-block");
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = elements;
      line.classes = classes;
      line.charCount = char_count;
      line.maxFontSize = font_size;
      line.maxExtent = extent;
      line.content = content;
      //console.log("text(%o):%s:(%d,%d)", line, line.toString(), line.size.width, line.size.height);
      return line;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isDisabled : function(){
      if(this.display === "none"){
	return true;
      }
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
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
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
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isRoot : function(){
      return this.parent === null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isChildBlock : function(){
      return this.isBlock() && !this.isRoot();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isInlineBlock : function(){
      return this.display === "inline-block";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isInline : function(){
      return this.display === "inline";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isRootLine : function(){
      // check if current inline is anonymous line block.
      // 1. line-object is just under the block element.
      //  <body>this text is included in anonymous line block</body>
      //
      // 2. line-object is just under the inline-block element.
      //  <div style='display:inline-block'>this text is included in anonymous line block</div>
      return this.isBlock() || this.isInlineBlock();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFloatStart : function(){
      return this.floatDirection && this.floatDirection.isStart();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFloatEnd : function(){
      return this.floatDirection && this.floatDirection.isEnd();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFloated : function(){
      return this.isFloatStart() || this.isFloatEnd();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPushed : function(){
      return this.getMarkupAttr("pushed") !== null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPulled : function(){
      return this.getMarkupAttr("pulled") !== null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPasted : function(){
      return this.getMarkupAttr("pasted") !== null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isTextEmphaEnable : function(){
      return (this.textEmpha && this.textEmpha.isEnable())? true : false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPositionAbsolute : function(){
      return this.position.isAbsolute();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPre : function(){
      var white_space = this.getCssAttr("white-space", "normal");
      return white_space === "pre";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPageBreak : function(){
      switch(this.getMarkupName()){
      case "page-break": case "end-page": case "pbr":
	return true;
      default:
	return false;
      }
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isBreakBefore : function(){
      return this.breakBefore? !this.breakBefore.isAvoid() : false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isBreakAfter : function(){
      return this.breakAfter? !this.breakAfter.isAvoid() : false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFirstChild : function(){
      var childs = this.getParentChilds();
      return (childs.length > 0 && childs[0] === this);
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFirstOfType : function(){
      var childs = this.getParentChildsOfType(this.getMarkupName());
      return (childs.length > 0 && childs[0] === this);
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isLastChild : function(){
      // for descent parsing, last child can't be gained,
      // this pseudo-class is maybe enabled in future release.

      //return List.last(this.getParentChilds()) === this;
      return false; // TODO
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isLastOfType : function(){
      //return List.last(this.getParentChildsOfType(this.getMarkupName())) === this;
      return false; // TODO
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isOnlyChild : function(){
      var childs = this.getParentChilds();
      return (childs.length === 1 && childs[0] === this);
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isOnlyOfType : function(){
      var childs = this.getParentChildsOfType(this.getMarkupName());
      return (childs.length === 1 && childs[0] === this);
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isMarkupEmpty : function(){
      return this.markup.isEmpty();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isWordBreakAll : function(){
      return this.wordBreak && this.wordBreak === "break-all";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    hasFlipFlow : function(){
      return this.parent? (this.flow !== this.parent.flow) : false;
    },
    /**
       @memberof Nehan.StyleContext
    */
    clearBreakBefore : function(){
      this.breakBefore = null;
    },
    /**
       @memberof Nehan.StyleContext
    */
    clearBreakAfter : function(){
      this.breakAfter = null;
    },
    /**
       search property from markup attributes first, and css values second.

       @memberof Nehan.StyleContext
       @param name {String}
       @param def_value {default_value}
       @return {value}
    */
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
    /**
       @memberof Nehan.StyleContext
       @param name {String}
       @param def_value {default_value}
       @return {value}
    */
    getMarkupAttr : function(name, def_value){
      // if markup is "<img src='aaa.jpg'>"
      // getMarkupAttr("src") => 'aaa.jpg'
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
	return CssParser.formatValue(name, value(this.selectorPropContext));
      }
      return value; // already formatted
    },
    /**
       @memberof Nehan.StyleContext
       @param name {String}
       @param value {css_value}
    */
    setCssAttr : function(name, value){
      if(__is_managed_css_prop(name)){
	this.managedCss.add(name, value);
      } else {
	this.unmanagedCss.add(name, value);
      }
    },
    /**
       @memberof Nehan.StyleContext
       @param name {String}
       @def_value {default_value}
       @return {css_value}
       @description <pre>
       * notice that subdivided properties like 'margin-before' as [name] are always not found,
       * even if you defined them in setStyle(s).
       * because all subdivided properties are already converted into unified name in loading process.
    */
    getCssAttr : function(name, def_value){
      var ret;
      ret = this.managedCss.get(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      ret = this.unmanagedCss.get(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getParentMarkupName : function(){
      return this.parent? this.parent.getMarkupName() : null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupName : function(){
      return this.markup.getName();
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupId : function(){
      // if markup is <p id="foo">, markup.id is "nehan-foo".
      return this.markup.getId();
    },
    /**
       @memberof Nehan.StyleContext
       @return {Array.<String>}
    */
    getMarkupClasses : function(){
      return this.markup.getClasses();
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupContent : function(){
      return this.markup.getContent();
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getMarkupPos : function(){
      return this.markup.pos;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupData : function(name){
      return this.markup.getData(name);
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getContent : function(){
      var content = this.markup.getContent();
      if(this.isPre()){
	content = content.replace(/\n/g, "<br>");
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
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getHeaderRank : function(){
      return this.markup.getHeaderRank();
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getFontSize : function(){
      return this.font.size;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getFontFamily : function(){
      return this.font.family || Display.fontFamily;
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.TextAlign}
    */
    getTextAlign : function(){
      return this.textAlign || TextAligns.get("start");
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getTextCombine : function(){
      return this.textCombine || null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getLetterSpacing : function(){
      return this.letterSpacing || 0;
    },
    /**
       @memberof Nehan.StyleContext
       @param order {int}
       @return {String}
    */
    getListMarkerHtml : function(order){
      return this.listStyle? this.listStyle.getMarkerHtml(order) : (this.parent? this.parent.getListMarkerHtml(order) : "");
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getListMarkerSize : function(){
      return this.listMarkerSize? this.listMarkerSize : (this.parent? this.parent.getListMarkerSize() : this.getFontSize());
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.Color}
    */
    getColor : function(){
      return this.color || (this.parent? this.parent.getColor() : new Color(Display.fontColor));
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.Partition}
    */
    getTablePartition : function(){
      return this.tablePartition || (this.parent? this.parent.getTablePartition() : null);
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getChildCount : function(){
      return this.childs.length;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getChildIndex : function(){
      var self = this;
      return List.indexOf(this.getParentChilds(), function(child){
	return child === self;
      });
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getChildIndexOfType : function(){
      var self = this;
      return List.indexOf(this.getParentChildsOfType(this.getMarkupName()), function(child){
	return child === self;
      });
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.StyleContext}
    */
    getNthChild : function(nth){
      return this.childs[nth] || null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {Array.<Nehan.StyleContext>}
    */
    getParentChilds : function(){
      return this.parent? this.parent.childs : [];
    },
    /**
       @memberof Nehan.StyleContext
       @param nth {int}
       @return {Nehan.StyleContext}
    */
    getParentNthChild : function(nth){
      return this.parent? this.parent.getNthChild(nth) : null;
    },
    /**
       @memberof Nehan.StyleContext
       @param markup_name {String}
       @return {Nehan.StyleContext}
    */
    getParentChildsOfType : function(markup_name){
      return List.filter(this.getParentChilds(), function(child){
	return child.getMarkupName() === markup_name;
      });
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.BoxFlow}
    */
    getParentFlow : function(){
      return this.parent? this.parent.flow : this.flow;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getParentFontSize : function(){
      return this.parent? this.parent.getFontSize() : Display.fontSize;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getParentContentMeasure : function(){
      return this.parent? this.parent.contentMeasure : Display.getMeasure(this.flow);
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getParentContentExtent : function(){
      return this.parent? this.parent.contentExtent : Display.getExtent(this.flow);
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.StyleContext}
    */
    getNextSibling : function(){
      return this.next;
    },
    /**
       @memberof Nehan.StyleContext
       @return {float | int}
    */
    getLineHeight : function(){
      return this.lineHeight || Display.lineHeight || 2;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEmphaTextBlockExtent : function(){
      return this.getFontSize() * 2;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getRubyTextBlockExtent : function(){
      var base_font_size = this.getFontSize();
      var extent = Math.floor(base_font_size * (1 + Display.rubyRate));
      return (base_font_size % 2 === 0)? extent : extent + 1;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getAutoLineExtent : function(){
      return Math.floor(this.getFontSize() * this.getLineHeight());
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEdgeMeasure : function(flow){
      var edge = this.edge || null;
      return edge? edge.getMeasure(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEdgeExtent : function(flow){
      var edge = this.edge || null;
      return edge? edge.getExtent(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {Object} {before:xxx, after:yyy}
    */
    getBlockContextEdge : function(flow){
      flow = flow || this.flow;
      var edge = this.edge || null;
      return {
	before:(edge? edge.getBefore(flow) : 0),
	after:(edge? edge.getAfter(flow) : 0)
      };
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getInnerEdgeMeasure : function(flow){
      var edge = this.edge || null;
      return edge? edge.getInnerMeasureSize(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getInnerEdgeExtent : function(flow){
      var edge = this.edge || null;
      return edge? edge.getInnerExtentSize(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @param block {Nehan.Box}
       @return {Object}
    */
    getCssBlock : function(block){
      // notice that box-size, box-edge is box local variable,<br>
      // so style of box-size(content-size) and edge-size are generated at Box::getCssBlock
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
      if(this.letterSpacing && !this.isTextVertical()){
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
      this.unmanagedCss.copyValuesTo(css);
      Args.copy(css, block.size.getCss(this.flow)); // content size
      if(block.edge){
	Args.copy(css, block.edge.getCss());
      }
      Args.copy(css, block.css); // some dynamic values
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssLineBlock : function(line){
      // notice that line-size, line-edge is box local variable,
      // so style of line-size(content-size) and edge-size are generated at Box::getBoxCss
      var css = {};
      Args.copy(css, line.size.getCss(this.flow));
      if(line.edge){
	Args.copy(css, line.edge.getCss());
      }
      if(this.isRootLine()){
	Args.copy(css, this.flow.getCss());
      }
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.isRootLine()){
	css["line-height"] = this.getFontSize() + "px";
      }
      if(this.isTextVertical()){
	css["display"] = "block";
      }
      this.unmanagedCss.copyValuesTo(css);
      Args.copy(css, line.css);
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssTextBlock : function(line){
      // notice that line-size, line-edge is box local variable,
      // so style of line-size(content-size) and edge-size are generated at Box::getCssInline
      var css = {};
      Args.copy(css, line.size.getCss(this.flow));
      if(line.edge){
	Args.copy(css, line.edge.getCss());
      }
      if(this.isTextVertical()){
	css["display"] = "block";
	css["line-height"] = "1em";
	if(Nehan.Env.client.isAppleMobileFamily()){
	  css["letter-spacing"] = "-0.001em";
	}
      } else {
	Args.copy(css, this.flow.getCss());
	css["line-height"] = line.maxFontSize + "px";

	// enable line-height only when horizontal mode.
	// this logic is required for drop-caps of horizontal mode.
	// TODO: more simple solution.
	var line_height = this.getCssAttr("line-height")
	if(line_height){
	  css["line-height"] = this._computeUnitSize(line_height, this.font.size) + "px";
	}
	if(this.getMarkupName() === "ruby" || this.isTextEmphaEnable()){
	  css["display"] = "inline-block";
	}
      }
      this.unmanagedCss.copyValuesTo(css);
      Args.copy(css, line.css);
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssInlineBlock : function(line){
      var css = this.getCssBlock(line);
      if(this.isTextVertical()){
	if(!this.isFloated()){
	  delete css["css-float"];
	}
      } else {
	Args.copy(css, this.flow.getCss());
      }
      css.display = "inline-block";
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @param image {Nehan.Box}
       @return {Object}
    */
    getCssHoriInlineImage : function(line, image){
      return this.flow.getCss();
    },
    _computeContentMeasure : function(outer_measure){
      switch(this.boxSizing){
      case "margin-box": return outer_measure - this.getEdgeMeasure();
      case "border-box": return outer_measure - this.getInnerEdgeMeasure();
      case "content-box": return outer_measure;
      default: return outer_measure;
      }
    },
    _computeContentExtent : function(outer_extent){
      switch(this.boxSizing){
      case "margin-box": return outer_extent - this.getEdgeExtent();
      case "border-box": return outer_extent - this.getInnerEdgeExtent();
      case "content-box": return outer_extent;
      default: return outer_extent;
      }
    },
    _computeFontSize : function(val, unit_size){
      var str = String(val).replace(/\/.+$/, ""); // remove line-height value like 'large/150%"'
      var size = Display.fontSizeNames[str] || str;
      var max_size = this.getParentFontSize();
      var font_size = this._computeUnitSize(size, unit_size, max_size);
      return Math.min(font_size, Display.maxFontSize);
    },
    _computeUnitSize : function(val, unit_size, max_size){
      var str = String(val);
      if(str.indexOf("rem") > 0){
	var rem_scale = parseFloat(str.replace("rem",""));
	return Math.round(Display.fontSize * rem_scale); // use root font-size
      }
      if(str.indexOf("em") > 0){
	var em_scale = parseFloat(str.replace("em",""));
	return Math.round(unit_size * em_scale);
      }
      if(str.indexOf("pt") > 0){
	return Math.round(parseInt(str, 10) * 4 / 3);
      }
      if(str.indexOf("%") > 0){
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
    // argument 'baseline' is not used yet.
    // baseline: central | alphabetic
    // ----------------------------------------------------------------
    // In nehan.js, 'central' is used when vertical writing mode.
    // see http://dev.w3.org/csswg/css-writing-modes-3/#text-baselines
    _setVertBaseline : function(root_line, baseline){
      List.iter(root_line.elements, function(element){
	var font_size = element.maxFontSize;
	var from_after = Math.floor((root_line.maxFontSize - font_size) / 2);
	if (from_after > 0){
	  var edge = element.edge || null;
	  edge = edge? edge.clone() : new BoxEdge();
	  edge.padding.setAfter(this.flow, from_after); // set offset to padding
	  element.size.width = (root_line.maxExtent - from_after);
	  
	  // set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	  Args.copy(element.css, edge.getCss(this.flow));
	}
      }.bind(this));
    },
    _setHoriBaseline : function(root_line, baseline){
      List.iter(root_line.elements, function(element){
	var font_size = element.maxFontSize;
	var from_after = root_line.maxExtent - element.maxExtent;
	if (from_after > 0){
	  var edge = element.edge || null;
	  edge = edge? edge.clone() : new BoxEdge();
	  edge.padding.setBefore(this.flow, from_after); // set offset to padding
	  //element.size.width = (root_line.maxExtent - from_after);
	  
	  // set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	  Args.copy(element.css, edge.getCss(this.flow));
	}
      }.bind(this));
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
    // nehan.js can change style dynamically by cursor-context.
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
    _loadCallbackCss : function(managed_css, name){
      var callback = managed_css.get(name);
      if(callback === null || typeof callback !== "function"){
	return {};
      }
      var ret = callback(this.selectorContext) || {};
      for(var prop in ret){
	ret[prop] = this._evalCssAttr(prop, ret[prop]);
      }
      return ret;
    },
    _loadInlineCss : function(markup){
      var style = markup.getAttr("style");
      if(style === null || Config.disableInlineStyle){
	return {};
      }
      var stmts = (style.indexOf(";") >= 0)? style.split(";") : [style];
      return List.fold(stmts, {}, function(ret, stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]).toLowerCase();
	  var value = Utils.trim(nv[1]);
	  var fmt_prop = CssParser.formatProp(prop);
	  var fmt_value = CssParser.formatValue(prop, value);
	  ret[fmt_prop] = fmt_value;
	}
	return ret;
      });
    },
    _loadUnmanagedCss : function(managed_css){
      return managed_css.filter(function(prop, value){
	return !__is_managed_css_prop(prop);
      });
    },
    _disableUnmanagedCssProps : function(unmanaged_css){
      if(this.isTextVertical()){
	// unmanaged 'line-height' is not welcome for vertical-mode.
	unmanaged_css.remove("line-height");
      }
    },
    _loadDisplay : function(){
      switch(this.getMarkupName()){
      case "first-line":
      case "li-marker":
      case "li-body":
	return "block";
      default:
	return this.getCssAttr("display", "inline");
      }
    },
    _loadFlow : function(){
      var value = this.getCssAttr("flow", "inherit");
      var parent_flow = this.parent? this.parent.flow : Display.getStdBoxFlow();
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
      var parent_font_size = this.parent? this.parent.font.size : Display.fontSize;
      var font = new Font(parent_font_size);
      var font_size = this.getCssAttr("font-size", "inherit");
      if(font_size !== "inherit"){
	font.size = this._computeFontSize(font_size, parent_font_size);
      }
      var font_family = this.getCssAttr("font-family", "inherit");
      if(font_family !== "inherit"){
	font.family = font_family;
      } else if(this.parent === null){
	font.family = Display.fontFamily;
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
      var padding = this._loadPadding(flow, font_size);
      var margin = this._loadMargin(flow, font_size);
      var border = this._loadBorder(flow, font_size);
      if(padding === null && margin === null && border === null){
	return null;
      }
      return new BoxEdge({
	padding:padding,
	margin:margin,
	border:border
      });
    },
    _loadEdgeSize : function(font_size, prop){
      var edge_size = this.getCssAttr(prop);
      if(edge_size === null){
	return null;
      }
      return this._computeEdgeSize(edge_size, font_size);
    },
    _loadPadding : function(flow, font_size){
      var edge_size = this._loadEdgeSize(font_size, "padding");
      if(edge_size === null){
	return null;
      }
      var padding = new Padding();
      padding.setSize(flow, edge_size);
      return padding;
    },
    _loadMargin : function(flow, font_size){
      var edge_size = this._loadEdgeSize(font_size, "margin");
      if(edge_size === null){
	return null;
      }
      var margin = new Margin();
      margin.setSize(flow, edge_size);

      // cancel margin between previous sibling and cur element if
      // 1. prev sibling element with edge exists.
      // 2. both prev and cur have display "block".
      // 3. both prev and cur have same box flow.
      // 4. both prev and cur is not floated element.
      // 5. prev has margin-after and cur has margin-before.
      if(this.prev && this.prev.display === "block" && !this.prev.isFloated() && this.prev.edge &&
	 this.flow === this.prev.flow &&
	 this.display === "block" && !this.isFloated() &&
	 (this.prev.edge.margin.getAfter(this.flow) > 0) &&
	 (margin.getBefore(this.flow) > 0)){
	this._cancelMargin(this.flow, margin, this.prev.edge.margin);
      }
      // if inline, disable margin-before and margin-after.
      if(this.isInline()){
	margin.clearBefore(flow);
	margin.clearAfter(flow);
      }
      return margin;
    },
    _cancelMargin : function(flow, cur_margin, prev_margin){
      var after = prev_margin.getAfter(flow);
      var before = cur_margin.getBefore(flow);
      if(after >= before){
	cur_margin.setBefore(flow, 0);
      } else {
	cur_margin.setBefore(flow, before - after);
      }
    },
    _loadBorder : function(flow, font_size){
      var edge_size = this._loadEdgeSize(font_size, "border-width");
      if(edge_size === null){
	return null;
      }
      var border = new Border();
      border.setSize(flow, edge_size);

      var border_radius = this.getCssAttr("border-radius");
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
    },
    _loadLineHeight : function(){
      var value = this.getCssAttr("line-height", "inherit");
      if(value === "inherit" && this.parent && this.parent.lineHeight){
	return this.parent.lineHeight;
      }
      return parseFloat(value || Display.lineHeight);
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
    _loadWordBreak : function(){
      return this.getCssAttr("word-break");
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
      var max_size = this.getParentContentMeasure();
      var static_size = this.getAttr(prop) || this.getAttr("measure") || this.getCssAttr(prop) || this.getCssAttr("measure");
      return static_size? this._computeUnitSize(static_size, this.font.size, max_size) : null;
    },
    _loadStaticExtent : function(){
      var prop = this.flow.getPropExtent();
      var max_size = this.getParentContentExtent();
      var static_size = this.getAttr(prop) || this.getAttr("extent") || this.getCssAttr(prop) || this.getCssAttr("extent");
      return static_size? this._computeUnitSize(static_size, this.font.size, max_size) : null;
    }
  };

  return StyleContext;
})();


var CursorContext = (function(){
  /**
     @memberof Nehan
     @class CursorContext
     @classdesc generator cursor position set(inline and block).
     @constructor
     @param block {Nehan.BlockContext}
     @param inline {Nehan.InlineContext}
  */
  function CursorContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  CursorContext.prototype = {
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasBlockSpaceFor : function(extent, opt){
      return this.block.hasSpaceFor(extent, opt);
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.block.hasBreakAfter() || this.inline.hasBreakAfter() || false;
    },
    /**
       @memberof Nehan.CursorContext
       @param element {Nehan.Box}
       @param extent {int}
    */
    addBlockElement : function(element, extent){
      this.block.addElement(element, extent);
    },
    /**
       @memberof Nehan.CursorContext
       @return {Array.<Nehan.Box>}
    */
    getBlockElements : function(){
      return this.block.getElements();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockCurExtent : function(){
      return this.block.getCurExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockLineNo : function(){
      return this.block.getLineNo();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    incBlockLineNo : function(){
      return this.block.incLineNo();
    },
    /**
       @memberof Nehan.CursorContext
       @param is_last_block {boolean}
       @return {Object} {before:[int value], after:[int value]}
    */
    getBlockCancelEdge : function(is_last_block){
      return this.block.getCancelEdge(is_last_block);
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasInlineSpaceFor : function(measure){
      return this.inline.hasSpaceFor(measure);
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    /**
       @memberof Nehan.CursorContext
       @param status {boolean}
    */
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    /**
       @memberof Nehan.CursorContext
    */
    setBreakAfter : function(status){
      this.inline.setBreakAfter(status);
    },
    /**
       @memberof Nehan.CursorContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addInlineBoxElement : function(element, measure){
      this.inline.addBoxElement(element, measure);
    },
    /**
       @memberof Nehan.CursorContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addInlineTextElement : function(element, measure){
      this.inline.addTextElement(element, measure);
    },
    /**
       @memberof Nehan.CursorContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getInlineLastElement : function(){
      return this.inline.getLastElement();
    },
    /**
       @memberof Nehan.CursorContext
       @return {Array}
    */
    getInlineElements : function(){
      return this.inline.getElements();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineCurMeasure : function(){
      return this.inline.getCurMeasure();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineMaxExtent : function(){
      return this.inline.getMaxExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineMaxFontSize : function(){
      return this.inline.getMaxFontSize();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    /**
       justify inline element with next head character, return null if nothing happend, or return new tail char if justified.
       @memberof Nehan.CursorContext
       @param head_char {Nehan.Char}
       @return {Nehan.Char | null}
    */
    justify : function(head_char){
      return this.inline.justify(head_char);
    }
  };

  return CursorContext;
})();


var BlockContext = (function(){
  /** @memberof Nehan
      @class BlockContext
      @classdesc context data of block level.
      @constructor
      @param {int} max_extent - maximus position of block in px.
      @param opt {Object} - optional argument
      @param opt.isFirstBlock {boolean} - is this first generated block by this context object?
      @param opt.contextEdge {Object} - special edge size of this block context
      @param opt.contextEdge.before {int} - before edge size in px
      @param opt.contextEdge.after {int} - after edge size in px
  */
  function BlockContext(max_extent, opt){
    opt = opt || {};
    this.curExtent = 0;
    this.maxExtent = max_extent; // const
    this.pushedElements = [];
    this.elements = [];
    this.pulledElements = [];
    this.breakAfter = false;
    this.contextEdge = opt.contextEdge || {before:0, after:0};
    this.isFirstBlock = (typeof opt.isFirstBlock === "undefined")? true : opt.isFirstBlock;
    this.lineNo = opt.lineNo || 0;
  }

  BlockContext.prototype = {
    /**
       check if this block context has enough size of [extent]
       @memberof Nehan.BlockContext
       @method hasSpaceFor
       @param extent {int} - size of extent in px
       @param is_last_block {boolean} - is this the last output of source block generation? default false
       @return {boolean}
    */
    hasSpaceFor : function(extent, is_last_block){
      is_last_block = is_last_block || false;
      var cancel_size = this.getCancelSize(is_last_block);
      return this.getRestExtent() >= (extent - cancel_size);
    },
    /**
       check if this block context has break after flag.
       @memberof Nehan.BlockContext
       @method hasBreakAfter
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    /**
       add box element to this block context
       @memberof Nehan.BlockContext
       @method addElement
       @param element {Nehan.Box} - Box object added to this context
       @param extent {int} - extent size of this element
    */
    addElement : function(element, extent){
      this.curExtent += extent;
      if(element.breakAfter){
	this.breakAfter = true;
      }
      if(element.pushed){
	this.pushedElements.push(element);
      } else if(element.pulled){
	this.pulledElements.unshift(element);
      } else {
	this.elements.push(element);
      }
    },
    /**
       cancel edge is available if posotion of current block cursor is not at first or at last,
       because first edge of block is already added to parent block in first time yielding,
       and last edge of block is only added to last block.
       @memberof Nehan.BlockContext
       @param is_last_block {boolean}
       @return {Object} {before:[int value], after:[int value]}
    */
    getCancelEdge : function(is_last_block){
      return {
	// if not first output, we can reduce before edge.
	// bacause first edge is only available to 'first' block.
	before:(this.isFirstBlock? 0 : this.contextEdge.before),
	
	// if not last output, we can reduce after edge,
	// because after edge is only available to 'last' block.
	after:(is_last_block? 0 : this.contextEdge.after)
      };
    },
    /**
       get size amount that is abled to be eliminated align to block direction, obtained by {@link Nehan.BlockContext.getCancelEdge}.
       @memberof Nehan.BlockContext
       @param is_last_block {boolean}
       @return {int} canceled size of extent
    */
    getCancelSize : function(is_last_block){
      var cancel_edge = this.getCancelEdge(is_last_block);
      return cancel_edge.before + cancel_edge.after;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} current extent
    */
    getCurExtent : function(){
      return this.curExtent;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} current rest size of extent
    */
    getRestExtent : function(){
      return this.maxExtent - this.curExtent;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} max available size of this block context
    */
    getMaxExtent : function(){
      return this.maxExtent;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} max available size of this block context
    */
    getLineNo : function(){
      return this.lineNo;
    },
    /**
       @memberof Nehan.BlockContext
       @return {int} max available size of this block context
    */
    incLineNo : function(){
      return this.lineNo++;
    },
    /**
       @memberof Nehan.BlockContext
       @return {Array.<Nehan.Box>} current elements added to this block context
    */
    getElements : function(){
      return this.pulledElements
	.concat(this.elements)
	.concat(this.pushedElements);
    }
  };

  return BlockContext;
})();


var InlineContext = (function(){
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
    this.breakAfter = false; // is break-after incuded in line?
  }

  InlineContext.prototype = {
    /**
       @memberof Nehan.InlineContext
       @return {boolean}
    */
    isEmpty : function(){
      return !this.lineBreak && !this.breakAfter && this.elements.length === 0;
    },
    /**
       @memberof Nehan.InlineContext
       @param measure {int}
       @return {boolean}
    */
    hasSpaceFor : function(measure){
      return this.getRestMeasure() >= measure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {boolean}
    */
    hasLineBreak : function(){
      return this.lineBreak;
    },
    /**
       @memberof Nehan.InlineContext
       @param status {boolean}
    */
    setLineBreak : function(status){
      this.lineBreak = status;
    },
    /**
       @memberof Nehan.InlineContext
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.breakAfter;
    },
    /**
       @memberof Nehan.InlineContext
       @param status {boolean}
    */
    setBreakAfter : function(status){
      this.breakAfter = status;
    },
    /**
       @memberof Nehan.InlineContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addTextElement : function(element, measure){
      this.elements.push(element);
      this.curMeasure += measure;
      if(element.getCharCount){
	this.charCount += element.getCharCount();
      }
    },
    /**
       @memberof Nehan.InlineContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addBoxElement : function(element, measure){
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
      if(element.breakAfter){
	this.breakAfter = true;
      }
    },
    /**
       @memberof Nehan.InlineContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getLastElement : function(){
      return List.last(this.elements);
    },
    /**
       get all elements.

       @memberof Nehan.InlineContext
       @return {Array}
    */
    getElements : function(){
      return this.elements;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getCurMeasure : function(){
      return this.curMeasure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getRestMeasure : function(){
      return this.maxMeasure - this.curMeasure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getMaxExtent : function(){
      return this.isEmpty()? 0 : this.maxExtent;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getMaxFontSize : function(){
      return this.maxFontSize;
    },
    /**
       @memberof Nehan.InlineContext
       @return {int}
    */
    getCharCount : function(){
      return this.charCount;
    },
    /**
       justify inline element with next head character, return null if nothing happend, or return new tail char if justified.

       @memberof Nehan.InlineContext
       @param head {Nehan.Char} - head_char at next line.
       @return {Nehan.Char | null}
    */
    justify : function(head){
      var last = this.elements.length - 1, ptr = last, tail;
      while(ptr >= 0){
	tail = this.elements[ptr];
	if(head && head.isHeadNg && head.isHeadNg() || tail.isTailNg && tail.isTailNg()){
	  // if tail and head is not continuous elmenet, for example
	  // [tail(pos=29)][inline element(pos=30)][head(pos=31)]
	  // then justification is already done at inline element, so skip it.
	  if(head && tail && head.pos - tail.pos > 1){
	    break;
	  }
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
	  return element.pos? (element.pos < head.pos) : true;
	});
	return head; // return new head
      }
      return null; // justify failed or not required.
    }
  };

  return InlineContext;
})();


var LayoutGenerator = (function(){
  /**
     @memberof Nehan
     @class LayoutGenerator
     @classdesc root abstract class for all generator
     @constructor
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._parent = null;
    this._child = null;
    this._cachedElements = [];
    this._terminate = false; // used to force terminate generator.
  }

  /**
     @memberof Nehan.LayoutGenerator
     @method yield
     @param parent_context {Nehan.CursorContext} - cursor context from parent generator
     @return {Nehan.Box}
  */
  LayoutGenerator.prototype.yield = function(parent_context){
    // create child cursor context from parent cursor context.
    var context = parent_context? this._createChildContext(parent_context) : this._createStartContext();

    // call _yield implemented in inherited class.
    return this._yield(context);
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method setTerminate
     @param status {boolean}
  */
  LayoutGenerator.prototype.setTerminate = function(status){
    this._terminate = status;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method setChildLayout
     @param generator {Nehan.LayoutGenerator}
  */
  LayoutGenerator.prototype.setChildLayout = function(generator){
    this._child = generator;
    generator._parent = this;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method hasNext
     @return {boolean}
  */
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

  /**
     @memberof Nehan.LayoutGenerator
     @method hasChildLayout
     @return {boolean}
  */
  LayoutGenerator.prototype.hasChildLayout = function(){
    if(this._child && this._child.hasNext()){
      return true;
    }
    return false;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method hasCache
     @return {boolean}
  */
  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method yieldChildLayout
     @param context {Nehan.CursorContext}
     @return {Nehan.Box}
  */
  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._child.yield(context);
    return next;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method peekLastCache
     @return {Nehan.Box | Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  LayoutGenerator.prototype.peekLastCache = function(){
    return List.last(this._cachedElements);
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method pushCache
     @param element {Nehan.Box | Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  LayoutGenerator.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      if(cache_count >= Config.maxRollbackCount){
	console.error("[%s] too many retry:%o", this.style.getMarkupName(), this.style);
	this.setTerminate(true); // this error sometimes causes infinite loop, so force terminate generator.
	return;
      }
    }
    element.cacheCount = cache_count + 1;
    this._cachedElements.push(element);
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method popCache
     @return {Nehan.Box | Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  LayoutGenerator.prototype.popCache = function(){
    var cache = this._cachedElements.pop();
    return cache;
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method clearCache
  */
  LayoutGenerator.prototype.clearCache = function(){
    this._cachedElements = [];
  };

  /**
     @memberof Nehan.LayoutGenerator
     @method addText
     @param text {String}
  */
  LayoutGenerator.prototype.addText = function(text){
    if(this.stream){
      this.stream.addText(text);
    }
  };

  // called 'after' generated each element of target output is added to each context.
  LayoutGenerator.prototype._onAddElement = function(context, block){
  };

  // called 'after' output element is generated.
  LayoutGenerator.prototype._onCreate = function(context, output){
  };

  // called 'after' final output element is generated.
  LayoutGenerator.prototype._onComplete = function(context, output){
  };

  LayoutGenerator.prototype._createStartContext = function(){
    var context = new CursorContext(
      new BlockContext(this.style.contentExtent, {
	isFirstBlock:true,
	contextEdge:this.style.getBlockContextEdge()
      }),
      new InlineContext(this.style.contentMeasure)
    );
    return context;
  };

  LayoutGenerator.prototype._createChildContext = function(parent_context){
    var context_edge = this.style.getBlockContextEdge();
    var is_first_block = this.stream? this.stream.isHead() : true;
    var max_extent = parent_context.getBlockRestExtent() - context_edge.before - context_edge.after;
    return new CursorContext(
      new BlockContext(max_extent, {
	isFirstBlock:is_first_block,
	lineNo:parent_context.lineNo,
	contextEdge:context_edge
      }),
      new InlineContext(this.style.contentMeasure)
    );
  };

  LayoutGenerator.prototype._createStream = function(style){
    switch(style.getMarkupName()){
    case "ruby": return new RubyTokenStream(style.markup);
    default: return new TokenStream(style.getContent());
    } 
  };

  LayoutGenerator.prototype._createFloatGenerator = function(context, first_float_gen){
    var self = this, parent_style = this.style;
    var floated_generators = [first_float_gen];
    var tokens = this.stream.iterWhile(function(token){
      if(Token.isWhiteSpace(token)){
	return true; // continue
      }
      if(!Token.isTag(token)){
	return false;
      }
      var child_style = new StyleContext(token, parent_style, {cursorContext:context});
      if(!child_style.isFloated()){
	parent_style.removeChild(child_style);
	return false;
      }
      var child_stream = self._createStream(child_style);
      var generator = self._createChildBlockGenerator(child_style, child_stream, context);
      floated_generators.push(generator);
      return true; // continue
    });
    return new FloatGenerator(this.style, this.stream, floated_generators);
  };

  LayoutGenerator.prototype._createChildBlockGenerator = function(style, stream, context){
    if(style.hasFlipFlow()){
      return new FlipGenerator(style, stream, context);
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
      return new ListItemGenerator(style, stream);

    case "table":
      return new TableGenerator(style, stream);

    case "table-header-group":
    case "table-row-group":
    case "table-footer-group":
      return new TableRowGroupGenerator(style, stream);

    case "table-row":
      return new TableRowGenerator(style, stream);

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
      return new FirstLineGenerator(style, stream);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      return new SectionRootGenerator(style, stream);

    case "section":
    case "article":
    case "nav":
    case "aside":
      return new SectionContentGenerator(style, stream);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return new HeaderGenerator(style, stream);

    case "ul":
    case "ol":
      return new ListGenerator(style, stream);

    default:
      return new BlockGenerator(style, stream);
    }
  };

  LayoutGenerator.prototype._createTextGenerator = function(style, text){
    var content = text.getContent();
    var lexer = new TextLexer(content);
    var stream = new TokenStream(content, lexer);
    return new TextGenerator(this.style, stream);
  };

  LayoutGenerator.prototype._createChildInlineGenerator = function(style, stream, context){
    if(style.isInlineBlock()){
      return new InlineBlockGenerator(style, stream);
    }
    if(style.isPasted()){
      return new LazyGenerator(style, style.createLine({content:style.getContent()}));
    }
    switch(style.getMarkupName()){
    case "ruby":
      return new TextGenerator(style, stream);
    case "img":
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      return new LazyGenerator(style, style.createImage());
    case "a":
      return new LinkGenerator(style, stream);
    default:
      return new InlineGenerator(style, stream);
    }
  };

  return LayoutGenerator;
})();


var BlockGenerator = (function(){
  /**
     @memberof Nehan
     @class BlockGenerator
     @classdesc generator of generic block element
     @constructor
     @extends Nehan.LayoutGenerator
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function BlockGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
    if(this.style.getParentMarkupName() === "body"){
      this.rootBlockId = DocumentContext.genRootBlockId();
    }
    this.blockId = DocumentContext.genBlockId();
  }
  Class.extend(BlockGenerator, LayoutGenerator);

  BlockGenerator.prototype._yield = function(context){
    if(!context.hasBlockSpaceFor(1, !this.hasNext())){
      return null;
    }

    // if break-before available, page-break but only once.
    if(this.style.isBreakBefore()){
      this.style.clearBreakBefore();
      return null;
    }
    while(true){
      if(!this.hasNext()){
	return this._createOutput(context, true); // output last block
      }
      var element = this._getNext(context);
      var is_last_block = !this.hasNext();
      if(element === null){
	return this._createOutput(context, is_last_block);
      }
      var extent = element.getLayoutExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent, is_last_block)){
	this.pushCache(element);
	return this._createOutput(context, false);
      }
      this._addElement(context, element, extent);
      if(!context.hasBlockSpaceFor(1, is_last_block) || context.hasBreakAfter()){
	return this._createOutput(context, is_last_block);
      }
    }
  };

  /**
     @memberof Nehan.BlockGenerator
     @method popCache
     @return {Nehan.Box} temporary stored cached element for next time yielding.
  */
  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    if(cache && cache.display === "inline"){
      // restore cached line with correct line no
      if(context.getBlockLineNo() === 0){
	cache.lineNo = 0;
	context.incBlockLineNo(); // cached line is next first line, so increment line no in block level context.
      }
      // if cache is inline(with no <br>), and measure size is not same as current block measure, reget it.
      // this is caused by float-generator, because in floating layout, inline measure is changed by it's cursor position.
      if(!cache.lineBreak && cache.getLayoutMeasure(this.style.flow) < this.style.contentMeasure && this._child){
	//console.info("inline float fix, line = %o(%s), context = %o, child_gen = %o", cache, cache.toString(), context, this._child);

	// resume inline context
	var context2 = this._createChildContext(context);
	context2.inline.elements = cache.elements;
	context2.inline.curMeasure = cache.getLayoutMeasure(this.style.flow);
	context2.inline.maxFontSize = cache.maxFontSize || this.style.getFontSize();
	context2.inline.maxExtent = cache.maxExtent || 0;
	context2.inline.charCount = cache.charCount || 0;
	var line = this._child._yield(context2);
	//console.log("line:%o(line no = %d)", line, line.lineNo);
	return line;
      }
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

    //console.log("block token:%o", token);

    // text block
    if(token instanceof Text){
      if(token.isWhiteSpaceOnly()){
	return this._getNext(context);
      }
      var text_gen = this._createTextGenerator(this.style, token);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, text_gen));
      return this.yieldChildLayout(context);
    }

    // if tag token, inherit style
    var child_style = new StyleContext(token, this.style, {cursorContext:context});

    // if disabled style, just skip
    if(child_style.isDisabled()){
      this.style.removeChild(child_style);
      return this._getNext(context);
    }

    // if page-break, end page
    if(child_style.isPageBreak()){
      context.setBreakAfter(true);
      return null;
    }

    var child_stream = this._createStream(child_style);

    if(child_style.isFloated()){
      var first_float_gen = this._createChildBlockGenerator(child_style, child_stream, context);
      this.setChildLayout(this._createFloatGenerator(context, first_float_gen));
      return this.yieldChildLayout(context);
    }

    // if child inline or child inline-block,
    if(child_style.isInlineBlock() || child_style.isInline()){
      var first_inline_gen = this._createChildInlineGenerator(child_style, child_stream, context);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, first_inline_gen));
      return this.yieldChildLayout(context);
    }

    // other case, start child block generator
    this.setChildLayout(this._createChildBlockGenerator(child_style, child_stream, context));
    return this.yieldChildLayout(context);
  };

  BlockGenerator.prototype._addElement = function(context, element, extent){
    context.addBlockElement(element, extent);
    this._onAddElement(context, element);
  };

  BlockGenerator.prototype._createOutput = function(context, is_last_block){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      return null;
    }
    var block_args = {
      blockId:this.blockId,
      extent:extent,
      elements:elements,
      breakAfter:context.hasBreakAfter(),
      cancelEdge:context.getBlockCancelEdge(is_last_block)
    };
    if(typeof this.rootBlockId !== "undefined"){
      block_args.rootBlockId = this.rootBlockId;
    }
    var block = this.style.createBlock(block_args);

    // call _onCreate callback for 'each' output
    this._onCreate(context, block);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, block);
    }
    //console.log(">> block output:%o:(m=%d, e=%d):(%s)", block, block.size.height, block.size.width, block.toString());
    return block;
  };

  return BlockGenerator;
})();


var InlineGenerator = (function(){
  /**
     @memberof Nehan
     @class InlineGenerator
     @classdesc inline level generator, output inline level block.
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
     @param child_generator {Nehan.LayoutGenerator}
     @description <pre>
     * constructor argument child_generator is available when block generator yield
     * child inline level, but firt token is not text element but child inline markup.
     * for example see below.
     *
     * &lt;p&gt;&lt;a href="#"&gt;foo&lt;/a&gt;text,text&lt;/p&gt;
     *
     * &lt;p&gt; is block level, and &lt;a&gt; is inline level, then inline generator is
     * spawned sharing same token stream of &lt;p&gt; and with inline generator of &lt;a&gt; as 'first' inline child generator.
     * this mechanism is mainly performance issue, because inline level markup(&lt;a&gt; in this case) is
     * already parsed and selector style is calculated, so to avoid double parse,
     * we pass the first child generator to the consctuctor of inline generator.
     *</pre>
  */
  function InlineGenerator(style, stream, child_generator){
    LayoutGenerator.call(this, style, stream);
    if(child_generator){
      this.setChildLayout(child_generator);
    }
  }
  Class.extend(InlineGenerator, LayoutGenerator);

  InlineGenerator.prototype._yield = function(context){
    if(!context.hasInlineSpaceFor(1)){
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
      if(!context.hasInlineSpaceFor(1)){
	break;
      }
    }
    return this._createOutput(context);
  };

  InlineGenerator.prototype._createChildContext = function(context){
    var child_context = new CursorContext(
      context.block, // inline generator inherits block context as it is.
      new InlineContext(context.getInlineRestMeasure())
    );
    //console.log("create child context:%o", child_context);
    return child_context;
  };

  InlineGenerator.prototype._createOutput = function(context){
    if(context.isInlineEmpty()){
      return null;
    }
    var line = this.style.createLine({
      lineNo:context.getBlockLineNo(),
      lineBreak:context.hasLineBreak(), // is line break included in?
      breakAfter:context.hasBreakAfter(), // is break after included in?
      measure:context.getInlineCurMeasure(), // actual measure
      elements:context.getInlineElements(), // all inline-child, not only text, but recursive child box.
      charCount:context.getInlineCharCount(),
      maxExtent:(context.getInlineMaxExtent() || this.style.getFontSize()),
      maxFontSize:context.getInlineMaxFontSize()
    });

    //console.log("%o create output(%s): conetxt max measure = %d, context:%o", this, line.toString(), context.inline.maxMeasure, context);

    // set position in parent stream.
    if(this._parent && this._parent.stream){
      line.pos = Math.max(0, this._parent.stream.getPos() - 1);
    }

    if(this.style.isRootLine()){
      context.incBlockLineNo();
    }

    // call _onCreate callback for 'each' output
    this._onCreate(context, line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, line);
    }
    //console.log(">> line:%o, context = %o", line, context);
    return line;
  };

  InlineGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    if(this.hasChildLayout()){
      // block context is delegated, but inline context is always re-constructed.
      // see LayoutGenerator::_createChildContext
      return this.yieldChildLayout(context);
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    //console.log("inline token:%o", token);

    // text block
    if(token instanceof Text){
      if(token.isWhiteSpaceOnly()){
	return this._getNext(context);
      }
      this.setChildLayout(this._createTextGenerator(this.style, token));
      return this.yieldChildLayout(context);
    }

    // if not text, it's tag token, inherit style
    var child_style = new StyleContext(token, this.style, {cursorContext:context});

    if(child_style.isDisabled()){
      return this._getNext(context); // just skip
    }

    var child_stream = this._createStream(child_style);

    // if inline -> block(or floated layout), force terminate inline
    if(child_style.isBlock() || child_style.isFloated()){
      var child_gen = this._createChildBlockGenerator(child_style, child_stream, context);
      if(child_style.isFloated()){
	child_gen = this._createFloatGenerator(context, child_gen);
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
      return (new InlineBlockGenerator(child_style, child_stream)).yield(context);
    }

    // inline child
    switch(child_style.getMarkupName()){
    case "img":
      return child_style.createImage();

    case "br":
      context.setLineBreak(true);
      return null;

    case "page-break": case "pbr": case "end-page":
      context.setBreakAfter(true);
      return null;

    default:
      var child_generator = this._createChildInlineGenerator(child_style, child_stream, context);
      this.setChildLayout(child_generator);
      return this.yieldChildLayout(context);
    }
  };

  InlineGenerator.prototype._breakInline = function(block_gen){
    this.setTerminate(true);
    if(this._parent === null){
      return;
    }
    if(this._parent instanceof InlineGenerator){
      this._parent._breakInline(block_gen);
    } else {
      this._parent.setChildLayout(block_gen);
    }
  };

  InlineGenerator.prototype._getMeasure = function(element){
    return element.getLayoutMeasure(this.style.flow);
  };

  InlineGenerator.prototype._addElement = function(context, element, measure){
    context.addInlineBoxElement(element, measure);

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(context, element);
  };

  return InlineGenerator;
})();


var InlineBlockGenerator = (function (){
  /**
     @memberof Nehan
     @class InlineBlockGenerator
     @classdesc generator of element with display:'inline-block'.
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function InlineBlockGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
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
    return new CursorContext(
      new BlockContext(parent_context.getBlockRestExtent() - this.style.getEdgeExtent()),
      new InlineContext(parent_context.getInlineRestMeasure() - this.style.getEdgeMeasure())
    );
  };

  return InlineBlockGenerator;
})();

var TextGenerator = (function(){
  /**
     @memberof Nehan
     @class TextGenerator
     @classdesc inline level generator, output inline level block.
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
     @param child_generator {Nehan.LayoutGenerator}
  */
  function TextGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
  }
  Class.extend(TextGenerator, LayoutGenerator);

  var __find_head_text = function(element){
    return (element instanceof Box)? __find_head_text(element.elements[0]) : element;
  };

  TextGenerator.prototype._yield = function(context){
    if(!context.hasInlineSpaceFor(1)){
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext(context);
      //console.log("element:%o", (element? (element.data || "?") : "null"));
      if(element === null){
	break;
      }
      var measure = this._getMeasure(element);
      if(measure === 0){
	break;
      }
      if(!context.hasInlineSpaceFor(measure)){
	//console.log("!> text overflow:%o(m=%d)", element, measure);
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, measure);
      //console.log("cur measure:%d", context.inline.curMeasure);
      if(!context.hasInlineSpaceFor(1)){
	break;
      }
    }
    return this._createOutput(context);
  };

  TextGenerator.prototype._createChildContext = function(context){
    return new CursorContext(
      context.block, // inline generator inherits block context as it is.
      new InlineContext(context.getInlineRestMeasure())
    );
  };

  TextGenerator.prototype._createOutput = function(context){
    if(context.isInlineEmpty()){
      return null;
    }
    // justify if this line is generated by overflow(not line-break).
    if(Config.justify && !context.isInlineEmpty() && !context.hasLineBreak()){
      this._justifyLine(context);
    }
    var line = this.style.createTextBlock({
      lineBreak:context.hasLineBreak(), // is line break included in?
      breakAfter:context.hasBreakAfter(), // is break after included in?
      measure:context.getInlineCurMeasure(), // actual measure
      elements:context.getInlineElements(), // all inline-child, not only text, but recursive child box.
      charCount:context.getInlineCharCount(),
      maxExtent:context.getInlineMaxExtent(),
      maxFontSize:context.getInlineMaxFontSize(),
      isEmpty:context.isInlineEmpty()
    });

    // set position in parent stream.
    if(this._parent && this._parent.stream){
      line.pos = Math.max(0, this._parent.stream.getPos() - 1);
    }

    // call _onCreate callback for 'each' output
    this._onCreate(context, line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, line);
    }
    //console.log(">> texts:[%s], context = %o, stream pos:%d, stream:%o", line.toString(), context, this.stream.getPos(), this.stream);
    return line;
  };

  TextGenerator.prototype._justifyLine = function(context){
    // before justify, skip single <br> to avoid double line-break.
    var stream_next = this.stream? this.stream.peek() : null;
    if(stream_next && Token.isTag(stream_next) && stream_next.getName() === "br"){
      this.stream.get(); // skip <br>
    }
    // by stream.getToken(), stream pos has been moved to next pos already, so cur pos is the next head.
    var next_head = this.peekLastCache() || this.stream.peek();
    var new_head = context.justify(next_head); // if justify is occured, new_tail token is gained.
    if(new_head){
      this.stream.setPos(new_head.pos);
      this.clearCache(); // stream position changed, so disable cache.
    }
  };

  TextGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    // read next token
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    //console.log("text token:%o", token);

    // if white-space
    if(Token.isWhiteSpace(token)){
      return this._getWhiteSpace(context, token);
    }

    // if tcy, wrap all content and return Tcy object and force generator terminate.
    if(this.style.getTextCombine() === "horizontal"){
      return this._getTcy(context, token);
    }
    return this._getText(context, token);
  };

  TextGenerator.prototype._breakInline = function(block_gen){
    this.setTerminate(true);
    if(this._parent === null){
      return;
    }
    if(this._parent instanceof TextGenerator){
      this._parent._breakInline(block_gen);
    } else {
      this._parent.setChildLayout(block_gen);
    }
  };

  TextGenerator.prototype._getTcy = function(context, token){
    this.setTerminate(true);
    var tcy = new Tcy(this.style.getMarkupContent());
    return this._getText(context, tcy);
  };

  TextGenerator.prototype._getWhiteSpace = function(context, token){
    if(this.style.isPre()){
      return this._getText(context, token); // read as normal text
    }
    // if not pre, skip continuous white-spaces.
    //this.stream.skipUntil(Token.isNewLine);

    if(Token.isNewLine(token)){
      // skip continuous white-spaces.
      this.stream.skipUntil(Token.isNewLine);
      return this._getNext(context);
    }
    // if white-space is not new-line, use first one.
    return this._getText(context, token);
  };

  TextGenerator.prototype._getText = function(context, token){
    if(!token.hasMetrics()){
      this._setTextMetrics(context, token);
    }
    switch(token._type){
    case "char":
    case "tcy":
    case "ruby":
      return token;
    case "word":
      return this._getWord(context, token);
    }
  };

  TextGenerator.prototype._setTextMetrics = function(context, token){
    // if charactor token, set kerning before setting metrics.
    // because some additional space is added if kerning is enabled or not.
    if(token instanceof Char && Config.kerning){
      this._setCharKerning(context, token);
    }
    token.setMetrics(this.style.flow, this.style.font);
  };

  TextGenerator.prototype._setCharKerning = function(context, char_token){
    var next_token = this.stream.peek();
    var prev_text = context.getInlineLastElement();
    var next_text = next_token && Token.isText(next_token)? next_token : null;
    Kerning.set(char_token, prev_text, next_text);
  };

  TextGenerator.prototype._getWord = function(context, token){
    var rest_measure = context.getInlineRestMeasure();
    var advance = token.getAdvance(this.style.flow, this.style.letterSpacing || 0);
    
    // if there is enough space for this word, just return.
    if(advance <= rest_measure){
      token.setDivided(false);
      return token;
    }
    // at this point, this word is larger than rest space.
    // but if this word size is less than max_measure and 'word-berak' is not 'break-all',
    // just break line and show it at the head of next line.
    if(advance <= context.getInlineMaxMeasure() && !this.style.isWordBreakAll()){
      return token; // overflow and cached
    }
    // at this point, situations are
    // 1. advance is larger than rest_measure and 'word-break' is set to 'break-all'.
    // 2. or word itself is larger than max_measure.
    // in these case, we must cut this word into some parts.
    var part = token.cutMeasure(this.style.getFontSize(), rest_measure); // get sliced word
    part.setMetrics(this.style.flow, this.style.font); // metrics for first half
    token.setMetrics(this.style.flow, this.style.font); // metrics for second half
    if(token.data !== "" && token.bodySize > 0){
      this.stream.prev(); // re-parse this token because rest part is still exists.
    }
    part.bodySize = Math.min(rest_measure, part.bodySize); // sometimes overflows. more accurate logic is required in the future.
    return part;
  };

  TextGenerator.prototype._getMeasure = function(element){
    return element.getAdvance(this.style.flow, this.style.letterSpacing || 0);
  };

  TextGenerator.prototype._addElement = function(context, element, measure){
    context.addInlineTextElement(element, measure);

    // call _onAddElement callback for each 'element' of output.
    this._onAddElement(context, element);
  };

  return TextGenerator;
})();


var LinkGenerator = (function(){
  var __add_anchor = function(style){
    var anchor_name = style.getMarkupAttr("name");
    if(anchor_name){
      DocumentContext.addAnchor(anchor_name);
    }
  };

  /**
     @memberof Nehan
     @class LinkGenerator
     @classdesc generator of &lt;a&gt; tag, set anchor context to {@link Nehan.DocumentContext} if exists.
     @constructor
     @extends {Nehan.InlineGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function LinkGenerator(style, stream){
    InlineGenerator.call(this, style, stream);
    __add_anchor(style); // set anchor at this point
  }
  Class.extend(LinkGenerator, InlineGenerator);

  LinkGenerator.prototype._onComplete = function(context, output){
    __add_anchor(this.style); // overwrite anchor on complete
  };

  return LinkGenerator;
})();


var FirstLineGenerator = (function(){
  /**
   * style of first line generator is enabled until first line is yielded.<br>
   * after yielding first line, parent style is inherited.
   @memberof Nehan
   @class FirstLineGenerator
   @classdesc generator to yield first line block.
   @constructor
   @param style {Nehan.StyleContext}
   @param stream {Nehan.TokenStream}
   @extends {Nehan.BlockGenerator}
  */
  function FirstLineGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(FirstLineGenerator, BlockGenerator);

  FirstLineGenerator.prototype._onAddElement = function(context, element){
    // first-line yieled, so switch style to parent one.
    if(context.getBlockLineNo() === 1){
      this.style = this.style.parent;
      var child = this._child, parent = this;
      while(child){
	child.style = parent.style;
	parent = child;
	child = child._child;
      }
    }
  };

  return FirstLineGenerator;
})();


var LazyGenerator = (function(){
  /**
     @memberof Nehan
     @class LazyGenerator
     @classdesc lazy generator holds pre-yielded output in construction, and yields it once.
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
     @param output {Nehan.Box} - pre yielded output
  */
  function LazyGenerator(style, output){
    LayoutGenerator.call(this, style, null);
    this.output = output; // only output this gen yields.
  }
  Class.extend(LazyGenerator, LayoutGenerator);

  /**
     @memberof Nehan.LazyGenerator
     @method hasNext
     @override
     @return {boolean}
  */
  LazyGenerator.prototype.hasNext = function(){
    return !this._terminate;
  };

  /**
     @memberof Nehan.LazyGenerator
     @method yield
     @override
     @return {Nehan.Box}
  */
  LazyGenerator.prototype.yield = function(context){
    if(this._terminate){ // already yielded
      return null;
    }
    this._terminate = true; // yield only once.
    return this.output;
  };

  return LazyGenerator;
})();

var FlipGenerator = (function(){
  /**
     @memberof Nehan
     @class FlipGenerator
     @classdesc generate fliped layout of [style]
     @constructor
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function FlipGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(FlipGenerator, BlockGenerator);

  /**
     @memberof Nehan.FlipGenerator
     @method yield
     @param context {Nehan.CursorContext}
     @return {Nehan.Box}
  */
  FlipGenerator.prototype.yield = function(context){
    // [measure of this.style] -> [extent of this.style.parent]
    // [extent of this.style]  -> [measure of this.style.parent]
    this.style.updateContextSize(context.getBlockRestExtent(), context.getInlineMaxMeasure());
    return BlockGenerator.prototype.yield.call(this);
  };

  return FlipGenerator;
})();


var FloatGroup = (function(){
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
    this.floatDirection = float_direction || FloatDirections.get("start");
  }

  FloatGroup.prototype = {
    /**
       element is popped from float-stack, but unshifted to elements in float-group to keep original stack order.
     *<pre>
     * float-stack  | float-group
     *     [f1,f2]  |  []
     *  => [f1]     |  [f2] (pop f2 from float-stack, unshift f2 to float-group)
     *  => []       |  [f1, f2] (pop f1 from float-stack, unshift f1 to float-group)
     *</pre>

      @memberof Nehan.FloatGroup
      @param element {Nehan.Box}
    */
    add : function(element){
      this.elements.unshift(element); // keep original stack order
    },
    /**
       @memberof Nehan.FloatGroup
       @return {boolean}
    */
    isFloatStart : function(){
      return this.floatDirection.isStart();
    },
    /**
       @memberof Nehan.FloatGroup
       @return {boolean}
    */
    isFloatEnd : function(){
      return this.floatDirection.isEnd();
    },
    /**
       @memberof Nehan.FloatGroup
       @return {Array.<Nehan.Box>}
    */
    getElements : function(){
      return this.isFloatStart()? this.elements : List.reverse(this.elements);
    },
    /**
       @memberof Nehan.FloatGroup
       @return {int}
    */
    getMeasure : function(flow){
      return List.fold(this.elements, 0, function(measure, element){
	return measure + element.getLayoutMeasure(flow);
      });
    },
    /**
       @memberof Nehan.FloatGroup
       @return {int}
    */
    getExtent : function(flow){
      return List.fold(this.elements, 0, function(extent, element){
	return Math.max(extent, element.getLayoutExtent(flow));
      });
    }
  };

  return FloatGroup;
})();


var FloatGroupStack = (function(){

  // [float block] -> FloatGroup
  var __pop_float_group = function(flow, float_direction, blocks){
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
  var __make_float_groups = function(flow, float_direction, blocks){
    var ret = [], group;
    do{
      group = __pop_float_group(flow, float_direction, blocks);
      if(group){
	ret.push(group);
      }
    } while(group !== null);
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
    var start_groups = __make_float_groups(flow, FloatDirections.get("start"), start_blocks);
    var end_groups = __make_float_groups(flow, FloatDirections.get("end"), end_blocks);
    this.stack = start_groups.concat(end_groups).sort(function(g1, g2){
      return g1.getExtent(flow) - g2.getExtent(flow);
    });
    var max_group = List.maxobj(this.stack, function(group){
      return group.getExtent(flow);
    });
    //console.log("max group from %o is %o", this.stack, max_group);
    this.extent = max_group? max_group.getExtent(flow) : 0;
  }

  FloatGroupStack.prototype = {
    /**
       @memberof Nehan.FloatGroupStack
       @return {boolean}
    */
    isEmpty : function(){
      return this.stack.length === 0;
    },
    /**
       @memberof Nehan.FloatGroupStack
       @return {int}
    */
    getExtent : function(){
      return this.extent;
    },
    /**
       pop {@link Nehan.FloatGroup} with larger extent from start or end.
       @memberof Nehan.FloatGroupStack
       @return {Nehan.FloatGroup}
    */
    pop : function(){
      return this.stack.pop() || null;
    }
  };

  return FloatGroupStack;
})();


var FloatGenerator = (function(){
  /**
   * [caution]<br>
   * constructor argument 'style' is the style of <b>parent</b>.<br>
   * so if &lt;body&gt;&lt;float1&gt;..&lt;/float1&gt;&lt;float2&gt;...&lt;/float2&gt;&lt;/body&gt;,<br>
   * style of this contructor is 'body.style'

     @memberof Nehan
     @class FloatGenerator
     @classdesc generator of float layout
     @constructor
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
     @param floated_generators {Array.<Nehan.LayoutGenerator>} - continuous floated generator collection
  */
  function FloatGenerator(style, stream, floated_generators){
    BlockGenerator.call(this, style, stream);
    this.generators = floated_generators;

    // create child generator to yield rest-space of float-elements with logical-float "start".
    // notice that this generator uses 'clone' of original style, because content size changes by position,
    // but on the other hand, original style is referenced by float-elements as their parent style.
    // so we must keep original style immutable.
    this.setChildLayout(new BlockGenerator(style.clone({"float":"start"}), stream));
  }
  Class.extend(FloatGenerator, LayoutGenerator);

  /**
     @memberof Nehan.FloatGenerator
     @return {boolean}
  */
  FloatGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    return this._hasNextFloat() || this.hasCache();
  };

  FloatGenerator.prototype._hasNextFloat = function(){
    return List.exists(this.generators, function(gen){
      return gen.hasNext();
    });
  };

  FloatGenerator.prototype._yield = function(context){
    var stack = this._yieldFloatStack(context);
    var rest_measure = context.getInlineRestMeasure();
    var rest_extent = stack.getExtent();
    var root_measure = rest_measure;
    if(rest_measure <= 0 || rest_extent <= 0){
      return null;
    }
    return this._yieldFloat(context, stack, root_measure, rest_measure, rest_extent);
  };

  FloatGenerator.prototype._yieldFloat = function(context, stack, root_measure, rest_measure, rest_extent){
    //console.log("_yieldFloat(root_m:%d, rest_m:%d, rest_e:%d)", root_measure, rest_measure, rest_extent);

    if(rest_measure <= 0){
      return null;
    }

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
    var flow = this.style.flow;
    var group = stack.pop(); // pop float group(notice that this stack is ordered by extent asc, so largest one is first obtained).
    var rest_rest_measure = rest_measure - group.getMeasure(flow); // rest of 'rest measure'
    var rest = this._yieldFloat(context, stack, root_measure, rest_rest_measure, group.getExtent(flow)); // yield rest area of this group in inline-flow(recursive).
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

    // if no more rest extent is left, continuous layout is displayed in context of parent generator.
    if(rest_extent_space <= 0){
      if(!this.hasNext()){
	this._child.style.forceUpdateContextSize(root_measure, this._parent.style.contentExtent);
	this._parent._child = this._child;
      }
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
    return this._wrapBlocks([group_set, space]);
  };
  
  FloatGenerator.prototype._sortFloatRest = function(floated, rest){
    var floated_elements = floated.getElements();
    var elements = floated.isFloatStart()? floated_elements.concat(rest) : [rest].concat(floated_elements);
    return List.filter(elements, function(element){ return element !== null; });
  };

  FloatGenerator.prototype._wrapBlocks = function(blocks){
    var flow = this.style.flow;
    var elements = List.filter(blocks, function(block){ return block !== null; });
    var measure = elements[0].getLayoutMeasure(flow); // block1 and block2 has same measure
    var extent = List.sum(elements, 0, function(element){ element.getLayoutExtent(flow); });
    var break_after = List.exists(elements, function(element){ return element.breakAfter; });

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
    var elements = this._sortFloatRest(floated, rest || null);
    var break_after = List.exists(elements, function(element){ return element.breakAfter; });
    return this.style.createChild("div", {"float":"start", measure:measure}).createBlock({
      elements:elements,
      breakAfter:break_after,
      extent:extent
    });
  };
  
  FloatGenerator.prototype._yieldFloatSpace = function(context, measure, extent){
    //console.log("yieldFloatSpace(c = %o, m = %d, e = %d)", context, measure, extent);
    this._child.style.forceUpdateContextSize(measure, extent);
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
  /**
     @memberof Nehan
     @class ParallelGenerator
     @classdesc wrapper generator to generate multicolumn layout like LI(list-mark,list-body) or TR(child TD).
     @constructor
     @extends {Nehan.LayoutGenerator}
     @param style {Nehan.StyleContext}
     @param generators {Array<Nehan.LayoutGenerator>}
  */
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

  /**
     @memberof Nehan.ParallelGenerator
     @method hasNext
     @override
     @param context {Nehan.CurosrContext}
     @return {boolean}
  */
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
	return generators[i].style.createBlock({
	  elements:[],
	  extent:content_extent
	});
      }
      return block.resizeExtent(flow, content_extent);
    });
  };

  ParallelGenerator.prototype._wrapBlocks = function(blocks){
    var flow = this.style.flow;
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
  /**
     @memberof Nehan
     @class SectionRootGenerator
     @classdesc generator of sectionning root tag (body, fieldset, figure, blockquote etc).
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.startOutlineContext(); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onComplete = function(context, block){
    this.style.endOutlineContext();
  };

  return SectionRootGenerator;
})();

var SectionContentGenerator = (function(){
  /**
     @memberof Nehan
     @class SectionContentGenerator
     @classdesc generator of sectionning content tag (section, article, nav, aside).
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function SectionContentGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.startSectionContext();
  }
  Class.extend(SectionContentGenerator, BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(context, block){
    this.style.endSectionContext();
  };

  return SectionContentGenerator;
})();


var ListGenerator = (function(){
  /**
     @memberof Nehan
     @class ListGenerator
     @classdesc generator of &lt;ul&gt;, &lt;ol&gt; tag. need to count child item if list-style is set to numeral property like 'decimal'.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function ListGenerator(style, stream){
    BlockGenerator.call(this, style, stream);

    // by setting max item count, 'this.style.listMarkerSize' is created.
    this.style.setListItemCount(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  return ListGenerator;
})();


var ListItemGenerator = (function(){
  /**
     @memberof Nehan
     @class ListItemGenerator
     @classdesc generator of &lt;li&gt; tag, consists parallel generator of list-item and list-body.
     @constructor
     @extends {Nehan.ParallelGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function ListItemGenerator(style, stream){
    ParallelGenerator.call(this, style, [
      this._createListMarkGenerator(style),
      this._createListBodyGenerator(style, stream)
    ]);
  }
  Class.extend(ListItemGenerator, ParallelGenerator);

  ListItemGenerator.prototype._createListMarkGenerator = function(style){
    var marker_size = style.getListMarkerSize();
    var item_order = style.getChildIndex();
    var marker_text = style.getListMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "measure":measure
    }, {
      "class":"nehan-li-marker"
    });
    return new BlockGenerator(marker_style, new TokenStream(marker_text));
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(style, stream){
    var marker_size = style.getListMarkerSize();
    var measure = style.contentMeasure - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "measure":measure
    }, {
      "class":"nehan-li-body"
    });
    return new BlockGenerator(body_style, stream);
  };

  return ListItemGenerator;
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
var TableGenerator = (function(){
  /**
     @memberof Nehan
     @class TableGenerator
     @classdesc generator of table tag content.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
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
  /**
     @memberof Nehan
     @class TabeRowGroupGenerator
     @classdesc generator of table group(tbody, thead, tfoo) content.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
  function TableRowGroupGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableRowGroupGenerator, BlockGenerator);

  return TableRowGroupGenerator;
})();


// parent : table | thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
var TableRowGenerator = (function(){
  /**
     @memberof Nehan
     @class TableRowGenerator
     @classdesc generator of table row(TR) content.
     @constructor
     @extends {Nehan.ParallelGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
  function TableRowGenerator(style, stream){
    var generators = this._getGenerators(style, stream);
    ParallelGenerator.call(this, style, generators);
  }
  Class.extend(TableRowGenerator, ParallelGenerator);

  TableRowGenerator.prototype._getGenerators = function(style_tr, stream){
    var child_tags = this._getChildTags(stream);
    var child_styles = this._getChildStyles(style_tr, child_tags);
    return List.map(child_styles, function(child_style){
      return new TableCellGenerator(child_style, new TokenStream(child_style.getMarkupContent()));
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(style_tr, child_tags){
    var self = this;
    var rest_measure = style_tr.contentMeasure;
    var partition = style_tr.getTablePartition();
    var part_sizes = partition? partition.getSizes({
      partitionCount:child_tags.length,
      measure:style_tr.contentMeasure
    }) : [];
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, style_tr);
      var static_measure = default_style.staticMeasure;
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_tags.length - i));
      if(part_sizes.length > 0){
	measure = part_sizes[i];
      }
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
  /**
     @memberof Nehan
     @class TableCellGenerator
     @classdesc generator of table-cell(td, th) content.
     @constructor
     @extends {Nehan.SectionRootGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function TableCellGenerator(style, stream){
    SectionRootGenerator.call(this, style, stream);
  }
  // notice that table-cell is sectioning root, so extends SectionRootGenerator.
  Class.extend(TableCellGenerator, SectionRootGenerator);

  return TableCellGenerator;
})();


var HeaderGenerator = (function(){
  /**
     @memberof Nehan
     @class HeaderGenerator
     @classdesc generator of header tag(h1 - h6) conetnt, and create header context when complete.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function HeaderGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(HeaderGenerator, BlockGenerator);

  HeaderGenerator.prototype._getHeaderRank = function(block){
    if(this.style.getMarkupName().match(/h([1-6])/)){
      return parseInt(RegExp.$1, 10);
    }
    return 0;
  };

  HeaderGenerator.prototype._onComplete = function(context, block){
    var header_id = this.style.startHeaderContext({
      type:this.style.getMarkupName(),
      rank:this._getHeaderRank(),
      title:this.style.getMarkupContent()
    });
    block.id = Css.addNehanHeaderPrefix(header_id);
  };
  
  return HeaderGenerator;
})();


var BodyGenerator = (function(){
  /**
     @memberof Nehan
     @class BodyGenerator
     @classdesc generator of &lt;body&gt; element
     @extends Nehan.SectionRootGenerator
     @constructor
     @param text {string} - content source of html
  */
  function BodyGenerator(text){
    var tag = new Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(context, block){
    block.seekPos = this.stream.getSeekPos();
    block.charPos = DocumentContext.getCharPos();
    block.percent = this.stream.getSeekPercent();
    block.pageNo = DocumentContext.getPageNo();

    DocumentContext.stepCharPos(block.charCount || 0);
    DocumentContext.stepPageNo();

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(DocumentContext.getPageNo() >= Config.maxPageCount){
      this.setTerminate(true);
    }
  };

  return BodyGenerator;
})();

var HtmlGenerator = (function(){
  /**
     @memberof Nehan
     @class HtmlGenerator
     @classdesc generator of &lt;html&gt; tag content.
     @constructor
     @param text {String}
  */
  function HtmlGenerator(text){
    this.stream = new HtmlTokenStream(text);
    this.generator = this._createGenerator();
  }

  HtmlGenerator.prototype = {
    /**
       @memberof Nehan.HtmlGenerator
       @return {Nehan.Box}
    */
    yield : function(){
      return this.generator.yield();
    },
    /**
       @memberof Nehan.HtmlGenerator
       @return {boolean}
    */
    hasNext : function(){
      return this.generator.hasNext();
    },
    /**
       @memberof Nehan.HtmlGenerator
       @param status {boolean}
    */
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    /**
       @memberof Nehan.HtmlGenerator
       @param text {String}
    */
    addText : function(text){
      this.generator.addText(text);
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
      DocumentContext.setDocumentHeader(document_header);
    }
  };

  return HtmlGenerator;
})();


var DocumentGenerator = (function(){
  /**
     @memberof Nehan
     @class DocumentGenerator
     @classdesc generator of formal html content including &lt;!doctype&gt; tag.
     @constructor
     @param text {String} - html source text
  */
  function DocumentGenerator(text){
    this.stream = new DocumentTokenStream(text);
    this.generator = this._createGenerator();
  }

  DocumentGenerator.prototype = {
    /**
       @memberof Nehan.DocumentGenerator
       @return {Nehan.Box}
    */
    yield : function(){
      return this.generator.yield();
    },
    /**
       @memberof Nehan.DocumentGenerator
       @return {boolean}
    */
    hasNext : function(){
      return this.generator.hasNext();
    },
    /**
       @memberof Nehan.DocumentGenerator
       @param status {boolean}
    */
    setTerminate : function(status){
      this.generator.setTerminate(status);
    },
    /**
       @memberof Nehan.DocumentGenerator
       @param text {String}
    */
    addText : function(text){
      this.generator.addText(text);
    },
    _createGenerator : function(){
      while(this.stream.hasNext()){
	var tag = this.stream.get();
	switch(tag.getName()){
	case "!doctype":
	  DocumentContext.setDocumentType("html"); // TODO
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
  /**
     @memberof Nehan
     @class LayoutEvaluator
     @classdesc evaluate {@link Nehan.Box}, and output DOMElement.
     @constructor
     @param direction {String} - "hori" or "vert"
  */
  function LayoutEvaluator(direction){
    this.direction = direction;
  }

  LayoutEvaluator.prototype = {
    /**
       @memberof Nehan.LayoutEvaluator
       @param tree {Nehan.Box}
       @return {DOMElement}
    */
    evaluate : function(tree){
      return this._getEvaluator(tree)._evaluate(tree);
    },
    _getEvaluator : function(tree){
      var is_vert = tree.style.isTextVertical();
      if(this.direction === "vert" && !is_vert){
	return new HoriEvaluator();
      }
      if(this.direction === "hori" && is_vert){
	return new VertEvaluator();
      }
      return this;
    },
    _createElement : function(name, opt){
      opt = opt || {};
      var css = opt.css || {};
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
      if(typeof opt.rootBlockId !== "undefined"){
	dataset["rootBlockId"] = opt.rootBlockId;
      }
      if(typeof opt.blockId !== "undefined"){
	dataset["blockId"] = opt.blockId;
      }

      // store css value to dom.style[<camelized-css-property>]
      Obj.iter(css, function(style_name, value){
	dom.style[Utils.camelize(style_name)] = value;
      });

      // notice that class(className in style object) is given by variable "Box::classes".
      // why? because
      // 1. markup of anonymous line is shared by parent block, but both are given different class names.
      // 2. sometimes we add some special class name like "nehan-div", "nehan-body", "nehan-p"... etc.
      Obj.iter(attrs, function(attr_name, value){ // pure attributes(without dataset defined in TagAttrs::attrs)
	// "style" is readonly and "class" is already set by opt.className.
	if(attr_name !== "style" && attr_name !== "class"){
	  try {
	    dom[attr_name] = value;
	  } catch(e){
	    console.error("try to set %o to %s but failed.", value, attr_name);
	  }
	}
      });

      // dataset attributes(defined in TagAttrs::dataset)
      Args.copy(dom.dataset, dataset);

      // call oncreate callback if exists.
      if(opt.oncreate){
	opt.oncreate(dom, opt.styleContext || null);
      }
      return dom;
    },
    _createClearFix : function(clear){
      var div = document.createElement("div");
      div.style.clear = clear || "both";
      return div;
    },
    _appendChild : function(root, child){
      if(child instanceof Array){
	List.iter(child, function(child){
	  this._appendChild(root, child);
	}.bind(this));
      } else {
	root.appendChild(child);
      }
    },
    _evaluate : function(tree, opt){
      var root = this._evalTreeRoot(tree, opt || {});
      return root.innerHTML? root : List.fold(tree.elements, root, function(ret, child){
	this._appendChild(root, this._evalTreeChild(tree, child));
	if(child.withBr){ // annotated to add extra br element
	  this._appendChild(root, document.createElement("br"));
	}
	if(child.withClearFix){ // annotated to add extra clear fix element
	  this._appendChild(root, this._createClearFix());
	}
	return root;
      }.bind(this));
    },
    _evalTreeRoot : function(tree, opt){
      opt = opt || {};
      return this._createElement(opt.name || "div", {
	id:tree.getId(),
	className:tree.getClassName(),
	attrs:tree.getAttrs(),
	oncreate:tree.getOnCreate(),
	content:(opt.content || tree.getContent()),
	rootBlockId:tree.rootBlockId,
	blockId:tree.blockId,
	css:(opt.css || tree.getBoxCss()),
	styleContext:tree.style
      });
    },
    _evalTreeChild : function(parent, child){
      switch(parent.display){
      case "inline":
	if(child instanceof Box){
	  return this._evalInlineChildElement(parent, child);
	}
	return this._evalInlineChildText(parent, child);
      default:
	return this._evalBlockChildElement(parent, child);
      }
    },
    _evalBlockChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this._evalImage(element);
      case "a":
	return this._evalLink(element);
      default:
	return this.evaluate(element);
      }
    },
    _evalInlineChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this._evalInlineImage(parent, element);
      case "a":
	return this._evalLink(parent, element);
      default:
	return this._evalInlineChildTree(parent, element);
      }
    },
    _evalInlineChildTree : function(parent, element){
      return this._evaluate(element);
    },
    _evalInlineChildText : function(parent, element){
      if(parent.style.isTextEmphaEnable() && Token.isEmphaTargetable(element)){
	return this._evalEmpha(parent, element);
      }
      return this._evalTextElement(parent, element);
    },
    _evalImage : function(image){
      return this._evalTreeRoot(image, {name:"img"});
    },
    _evalInlineImage : function(line, image){
      return this._evalImage(image);
    },
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    _evalLink : function(line, link){
      var uri = new Uri(link.style.getMarkupAttr("href"));
      var anchor_name = uri.getAnchorName();
      if(anchor_name){
	var page_no = DocumentContext.getAnchorPageNo(anchor_name);
	link.classes.push("nehan-anchor-link");
	link.style.markup.setAttr("data-page", page_no);
      }
      return this._evalLinkElement(line, link)
    },
    _evalTextElement : function(line, text){
      switch(text._type){
      case "word":
	return this._evalWord(line, text);
      case "char":
	return this._evalChar(line, text);
      case "tcy":
	return this._evalTcy(line, text);
      case "ruby":
	return this._evalRuby(line, text);
      default:
	console.error("invalid text element:%o", text);
	throw "invalid text element"; 
      }
    }
  };

  return LayoutEvaluator;
})();


var VertEvaluator = (function(){
  /**
     @memberof Nehan
     @class VertEvaluator
     @classdesc evaluate {@link Nehan.Box} as vertical layout, and output DOMElement.
     @constructor
     @extends {Nehan.LayoutEvaluator}
  */
  function VertEvaluator(){
    LayoutEvaluator.call(this, "vert");
  }
  Class.extend(VertEvaluator, LayoutEvaluator);

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
    var rb_style = new StyleContext(new Tag("<rb>"), line.style);
    var rb_line = rb_style.createLine({
      elements:ruby.getRbs()
    });
    return this._evaluate(rb_line, {
      css:ruby.getCssVertRb(line)
    });
  };

  VertEvaluator.prototype._evalRt = function(line, ruby){
    var rt = (new InlineGenerator(
      new StyleContext(ruby.rt, line.style),
      new TokenStream(ruby.getRtString()),
      null // outline context
    )).yield();
    Args.copy(rt.css, ruby.getCssVertRt(line));
    return this._evaluate(rt);
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
      css:word.getCssVertTrans(line),
      styleContext:line.style
    });
    var div_word = this._createElement("div", {
      content:word.data,
      className:"nehan-rotate-90",
      css:word.getCssVertTransBody(line),
      styleContext:line.style
    });
    div_wrap.appendChild(div_word);
    return div_wrap;
  };

  VertEvaluator.prototype._evalWordTransformTrident = function(line, word){
    var div_wrap = this._createElement("div", {
      css:word.getCssVertTrans(line),
      styleContext:line.style
    });
    var div_word = this._createElement("div", {
      content:word.data,
      //className:"nehan-rotate-90",
      css:word.getCssVertTransBodyTrident(line),
      styleContext:line.style
    });
    div_wrap.appendChild(div_word);
    return div_wrap;
  };

  VertEvaluator.prototype._evalWordIE = function(line, word){
    return this._createElement("div", {
      content:word.data,
      className:"nehan-vert-ie",
      css:word.getCssVertTransIE(line),
      styleContext:line.style
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
    return this._createElement("div", {
      content:chr.getData(),
      className:"nehan-rotate-90",
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalRotateCharIE = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      className:"nehan-vert-ie",
      css:chr.getCssVertRotateCharIE(line),
      styleContext:line.style
    }); // NOTE(or TODO):clearfix in older version after this code
  };

  VertEvaluator.prototype._evalTcy = function(line, tcy){
    return this._createElement("div", {
      content:tcy.data,
      className:"nehan-tcy",
      css:tcy.getCssVert(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalChar = function(line, chr){
    if(chr.isImgChar()){
      if(chr.isVertGlyphEnable()){
	return this._evalVerticalGlyph(line, chr);
      }
      return this._evalImgChar(line, chr);
    } else if(chr.isHalfSpaceChar(chr)){
      return this._evalHalfSpaceChar(line, chr);
    } else if(chr.isRotateChar()){
      return this._evalRotateChar(line, chr);
    } else if(chr.isSmallKana()){
      return this._evalSmallKana(line, chr);
    } else if(chr.isPaddingEnable()){
      return this._evalPaddingChar(line, chr);
    } else if(line.letterSpacing){
      return this._evalCharLetterSpacing(line, chr);
    } else if(chr.isSingleHalfChar()){
      return this._evalCharSingleHalfChar(line, chr);
    }
    return this._evalCharWithBr(line, chr);
  };

  // for example, if we use <div> instead, parent bg-color is not inherited.
  VertEvaluator.prototype._evalCharWithBr = function(line, chr){
    chr.withBr = true;
    return document.createTextNode(Html.unescape(chr.getData()));
  };

  VertEvaluator.prototype._evalCharLetterSpacing = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      css:chr.getCssVertLetterSpacing(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalCharSingleHalfChar = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      css:chr.getCssVertSingleHalfChar(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalEmpha = function(line, chr){
    var char_part = this._evalEmphaSrc(line, chr);
    var empha_part = this._evalEmphaText(line, chr);
    var wrap = this._createElement("div", {
      className:"nehan-empha-wrap",
      css:line.style.textEmpha.getCssVertEmphaWrap(line, chr),
      styleContext:line.style
    });
    wrap.appendChild(char_part);
    wrap.appendChild(empha_part);
    return wrap;
  };

  VertEvaluator.prototype._evalEmphaSrc = function(line, chr){
    return this._createElement("span", {
      content:chr.getData(),
      className:"nehan-empha-src",
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalEmphaText = function(line, chr){
    return this._createElement("span", {
      content:line.style.textEmpha.getText(),
      className:"nehan-empha-text",
      css:chr.getCssVertEmphaText(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalPaddingChar = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      css:chr.getCssPadding(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalImgChar = function(line, chr){
    var color = line.color || new Color(Display.fontColor);
    var font_rgb = color.getRgb();
    var palette_color = Palette.getColor(font_rgb).toUpperCase();
    return this._createElement("img", {
      className:"nehan-img-char",
      attrs:{
	src:chr.getImgSrc(palette_color)
      },
      css:chr.getCssVertImgChar(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalVerticalGlyph = function(line, chr){
    return this._createElement("div", {
      content:chr.getData(),
      className:"nehan-vert-glyph",
      css:chr.getCssVertGlyph(line),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalSmallKana = function(line, chr){
    var tag_name = (line.style.textEmpha && line.style.textEmpha.isEnable())? "span" : "div";
    return this._createElement(tag_name, {
      content:chr.getData(),
      css:chr.getCssVertSmallKana(),
      styleContext:line.style
    });
  };

  VertEvaluator.prototype._evalHalfSpaceChar = function(line, chr){
    return this._createElement("div", {
      content:"&nbsp;",
      css:chr.getCssVertHalfSpaceChar(line),
      styleContext:line.style
    });
  };

  return VertEvaluator;
})();


var HoriEvaluator = (function(){
  /**
     @memberof Nehan
     @class HoriEvaluator
     @classdesc evaluate {@link Nehan.Box} as horizontal layout, and output DOMElement.
     @constructor
     @extends {Nehan.LayoutEvaluator}
  */
  function HoriEvaluator(){
    LayoutEvaluator.call(this, "hori");
  }
  Class.extend(HoriEvaluator, LayoutEvaluator);

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
    return this._evalTreeRoot(image, {
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
    if(tcy.data.length === 1){
      return this._evalTcySingleHalfChar(line, tcy);
    } 
    return document.createTextNode(Html.unescape(tcy.data));
  };

  HoriEvaluator.prototype._evalTcySingleHalfChar = function(line, tcy){
    return this._createElement("span", {
      css:tcy.getCssHoriSingleHalfChar(line),
      content:tcy.data
    });
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
    var char_part = this._evalEmphaSrc(line, chr);
    var empha_part = this._evalEmphaText(line, chr);
    var wrap = this._createElement("span", {
      css:line.style.textEmpha.getCssHoriEmphaWrap(line, chr),
      styleContext:line.style
    });
    wrap.appendChild(empha_part);
    wrap.appendChild(char_part);
    return wrap;
  };

  HoriEvaluator.prototype._evalEmphaSrc = function(line, chr){
    return this._createElement("div", {
      content:chr.data,
      className:"nehan-empha-src",
      css:chr.getCssHoriEmphaSrc(line),
      styleContext:line.style
    });
  };

  HoriEvaluator.prototype._evalEmphaText = function(line, chr){
    return this._createElement("div", {
      content:line.style.textEmpha.getText(),
      className:"nehan-empha-text",
      css:chr.getCssHoriEmphaText(line),
      styleContext:line.style
    });
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


// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Display, __engine_args.display || {});

Selectors.setValues(Nehan.globalStyle || {}); // set global style.
Selectors.setValues(__engine_args.style || {}); // set local style

// register global single tags
List.iter(Nehan.__single_tag_names__, LexingRule.addSingleTagByName);
List.iter(Nehan.__single_tag_rexes__, LexingRule.addSingleTagByRex);

/**
   @memberof Nehan
   @class Engine
   @constructor
   @classdesc this is logical layout engine module, enclosing following environments.<br>
   * <ul>
   * <li>{@link Nehan.DocumentContext}</li>
   * <li>{@link Nehan.LexingRule}</li>
   * <li>{@link Nehan.Style}</li>
   * <li>{@link Nehan.Selectors}</li>
   * <li>{@link Nehan.Display}</li>
   * <li>{@link Nehan.Config}</li>
   * </ul>
*/
function Engine(){
  this.documentContext = DocumentContext;
  this.lexingRule = LexingRule;
  this.selectors = Selectors;
}

Engine.prototype = {
  /**
     @memberof Nehan.Engine
     @param text {String} - html text
     @return {Nehan.PageStream}
  */
  createPageStream : function(text){
    return new PageStream(text);
  },
  /**<pre>
   * create outline element of "<body>",
   * if multiple body exists, only first one is returned.
   * about callback argument, see {@link Nehan.SectionTreeConverter}.
   *</pre>
     @memberof Nehan.Engine
     @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
   */
  createOutlineElement : function(callbacks){
    return this.documentContext.createBodyOutlineElement(callbacks);
  },
  /*
    get the page index where [anchor_name] is defined in from {@link Nehan.DocumentContext}.

    @memberof Nehan.Engine
    @param anchor_name {String}
  */
  getAnchorPageNo : function(anchor_name){
    return this.documentContext.getAnchorPageNo(anchor_name);
  },
  /**
     register engine local single tag by name.

     @memberof Nehan.Engine
     @param name {String}
  */
  addSingleTagByName : function(name){
    this.lexingRule.addSingleTagByName(name);
  },
  /**
     register engine local single tag by regexp object.

     @memberof Nehan.Engine
     @param rex {RegExp}
  */
  addSingleTagByRex : function(rex){
    this.lexingRule.addSingleTagRex(name);
  },
  /**
     set engine local style

     @memberof Nehan.Engine
     @example
     * engine.setStyle("p", {"font-size":"1.6em"});
  */
  setStyle : function(selector_key, value){
    this.selectors.setValue(selector_key, value);
    return this;
  },
  /**
     set engine local styles

     @memberof Nehan.Engine
     @example
     * engine.setStyles({
     *   "body":{"font-size":18},
     *   "a[href^=#]":{"background-color":"gold"}
     * });
  */
  setStyles : function(values){
    this.selectors.setValues(values);
    return this;
  }
};

return new Engine();

}; // Nehan.createEngine

Nehan.PagedElement = (function(){
  /**
     @memberof Nehan
     @class PagedElement
     @classdesc DOM element with {@link Nehan.PageStream}
     @constructor
     @param engine_args {Object}
     @param engine_args.config {Nehan.Config} - system config
     @param engine_args.display {Nehan.Display} - standard page parameters
     @param engine_args.style {Nehan.Style} - engine local style
  */
  function NehanPagedElement(engine_args){
    this.pageNo = 0;
    this.element = document.createElement("div");
    this.engine = Nehan.createEngine(engine_args);
    this._pageStream = null;
  }

  NehanPagedElement.prototype = {
    /**
       check if current page position is at last.

       @memberof Nehan.PagedElement
       @return {boolean}
    */
    isLastPage : function(){
      return this.getPageNo() + 1 >= this.getPageCount();
    },
    /**
       get nner {@link Nehan.Engine} interfaces.

       @memberof Nehan.PagedElement
       @return {Nehan.Engine}
    */
    getEngine : function(){
      return this.engine;
    },
    /**
       get inner DOMElement containning current page element.

       @memberof Nehan.PagedElement
    */
    getElement : function(){
      return this.element;
    },
    /**
       get content text

       @memberof Nehan.PagedElement
       @return {String}
    */
    getContent : function(){
      return this._pageStream? this._pageStream.text : "";
    },
    /**
       @memberof Nehan.PagedElement
       @return {int}
    */
    getPageCount : function(){
      return this._pageStream? this._pageStream.getPageCount() : 0;
    },
    /**
       @memberof Nehan.PagedElement
       @return {Nehan.Page}
    */
    getPage : function(page_no){
      return this._pageStream? this._pageStream.getPage(page_no) : null;
    },
    /**
       @memberof Nehan.PagedElement
       @param page_no {int} - page index starts from 0.
       @return {DOMElement}
    */
    getPagedElement : function(page_no){
      var page = this.getPage(page_no);
      return page? page.element : null;
    },
    /**
       get current page index

       @memberof Nehan.PagedElement
       @return {int}
    */
    getPageNo : function(){
      return this.pageNo;
    },
    /**
       set inner page position to next page and return next page if exists, else null.

       @memberof Nehan.PagedElement
       @return {Nehan.Page | null}
    */
    setNextPage : function(){
      if(this.pageNo + 1 < this.getPageCount()){
	return this.setPage(this.pageNo + 1);
      }
      return null;
    },
    /**
       set inner page posision to previous page and return previous page if exists, else null.

       @memberof Nehan.PagedElement
       @return {Nehan.Page | null}
    */
    setPrevPage : function(){
      if(this.pageNo > 0){
	return this.setPage(this.pageNo - 1);
      }
      return null;
    },
    /**
     * set selector value. [name] is selector key, value is selector value.<br>
     * see example at setStyle of {@link Nehan.Engine}.

       @memberof Nehan.PagedElement
       @param name {String} - selector string
       @param value {selector_value}
    */
    setStyle : function(name, value){
      this.engine.setStyle(name, value);
      return this;
    },
    /**
       set selector key and values. see example at setStyles of {@link Nehan.Engine}.

       @memberof Nehan.PagedElement
       @param value {Object}
    */
    setStyles : function(values){
      this.engine.setStyles(values);
      return this;
    },
    /**
       set content string to paged element and start parsing.

       @memberof Nehan.PagedElement
       @param content {String} - html text.
       @param opt {Object} - optinal argument
       @param opt.onProgress {Function} - fun tree -> ()
       @param opt.onComplete {Function} - fun time -> ()
       @example
       * paged_element.setContent("<h1>hello, nehan.js!!</h1>", {
       *   onProgress:function(tree){
       *     console.log("page no:%d", tree.pageNo);
       *     console.log("progress:%d", tree.percent);
       *   },
       *   onComplete:function(time){
       *     console.log("complete:%fmsec", time);
       *   }
       * });
    */
    setContent : function(content, opt){
      this._pageStream = this.engine.createPageStream(content);
      this._asyncGet(opt || {});
      return this;
    },
    /**
       append additional text to paged element.

       @memberof Nehan.PagedElement
       @param content {String} - html text.
       @param opt {Object} - optinal argument
       @param opt.onProgress {Function} - fun tree -> ()
       @param opt.onComplete {Function} - fun time -> ()
    */
    addContent : function(content, opt){
      this._pageStream.addText(content);
      this._asyncGet(opt || {});
    },
    /**
       set current page index to [page_no]

       @memberof Nehan.PagedElement
       @param page_no {int}
       @return {Nehan.Page | null}
    */
    setPage : function(page_no){
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
    },
    _asyncGet : function(opt){
      this._pageStream.asyncGet({
	onProgress : function(stream, tree){
	  if(tree.pageNo === 0){
	    this.setPage(tree.pageNo);
	  }
	  if(opt.onProgress){
	    opt.onProgress(tree);
	  }
	}.bind(this),
	onComplete : function(stream, time){
	  if(opt.onComplete){
	    opt.onComplete(time);
	  }
	}.bind(this)
      });
    }
  };
  
  return NehanPagedElement;
})();

/**
   @namespace Nehan
   @memberof Nehan
   @method createPagedElement
   @param engine_args {Object}
   @param engine_args.config {Nehan.Config} - system config
   @param engine_args.display {Nehan.Display} - standard page parameters
   @param engine_args.style {Nehan.Style} - engine local style
   @return {Nehan.PagedElement}
*/
Nehan.createPagedElement = function(engine_args){
  return new Nehan.PagedElement(engine_args || {});
};
