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
     is justify enabled?
     @memberof Nehan.Config
     @type {boolean}
     @default true
  */
  justify:true,

  /**
     is dangling justify enable?
     Note that this property is enabled only when Nehan.Config.justify is enabled.
     @memberof Nehan.Config
     @type {boolean}
     @default true
  */
  danglingJustify:true,

  /**
     max rety count when something troubles.
     @memberof Nehan.Config
     @type {int}
     @default 20
  */
  maxRollbackCount:20,

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
   convert horizontal-bar(U+2015)  to em-dash(U+2014) for vertical writing-mode.
   note that this flag is not available for IE.
   because in IE, we convert all em-dash to horizontal-bar for em-dash glyph problem(see vert-evaluator.js).

   @memberof Nehan.Config
   @type {boolean}
   @default true
  */
  convertHbarToEmDashIfVert:true,

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
  allowedInlineStyleProps:[]
};
