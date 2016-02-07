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
   markups that may require pre loading process.

   @memberof Nehan.Config
   @type {Array.<string>}
   */
  preloadMarkups:[
    "img", "math"
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
    "word-break",
    "white-space"
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
    "area",
    "base",
    "br",
    "embed",
    "col",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "wbr",
    "?xml",
    "!doctype",

    // nehan special tag for page-break
    "end-page", // deprecated tag, for backward compatibility
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
   @type {Object}
   */
  spacingSizeRate:{
    space:0.25, // U+0020
    thinsp:0.2, // &thinsp;
    nbsp:0.38,  // &nbsp;
    ensp:0.5,   // &ensp;
    emsp:1.0    // &emsp;
  },
  /**
   @memberof Nehan.Config
   @type {Object}
   */
  mathjax:{
    maxRetryCount:3,
    retryWait:300
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
      .replace(/\u2019/g, "\u0027")  // RIGHT SINGLE QUOTATION MARK(U+2019) -> APOSTROPHE(U+0027)
      .replace(/\uFF62/g, "\u300C")  // HALFWIDTH LEFT CORNER BRACKET(U+FF62) -> LEFT CORNER BRACKET(U+300C)
      .replace(/\uFF63/g, "\u300D")  // HALFWIDTH RIGHT CORNER BRACKET(U+FF63) -> RIGHT CORNER BRACKET(U+300D)
      .replace(/\uFF0C/g, "\u3001")  // FULLWIDTH COMMA(U+FF0C) -> IDEOGRAPHIC COMMA(U+3001)
      .replace(/\uFF64/g, "\u3001")  // HALF SIZE IDEOGRAPHIC COMMA(U+FF64) -> IDEOGRAPHIC COMMA(U+3001)
      .replace(/\uFF61/g, "\u3002")  // HALFWIDTH IDEOGRAPHIC FULL STOP(U+FF61) -> IDEOGRAPHIC FULL STOP(U+3002)
    ;
  }
};
