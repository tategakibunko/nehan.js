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

