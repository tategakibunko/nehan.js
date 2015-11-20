/**
   system configuration
   @namespace Nehan.Config
*/
Nehan.Config = {
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
     max rety count when something troubles.
     @memberof Nehan.Config
     @type {int}
     @default 20
  */
  maxRollbackCount:4,

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
     @default false
  */
  enableAutoCloseTag:false,

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
    "textarea"
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

    // In style-context, we load 'line-height' prop and stored the value to this.lineHeight, so why this prop is unmanaged?
    // Because in vertical mode, native 'line-height' is used in special purpose to make vertical line.
    // So we avoid this prop stored as managed css prop.
    //"line-height",

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
    "text-combine",
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
  ]
};
