/**
   system configuration
   @namespace Nehan.Config
*/
var Config = {
  /**
     language setting default ["ja-JP"]
     @memberof Nehan.Config
     @type {string}
  */
  lang:"ja-JP",

  /**
     is debug mode? default [false]
     @memberof Nehan.Config
     @type {boolean}
  */
  debug:false,

  /**
     is kerning enabled? default [true]
     @memberof Nehan.Config
     @type {boolean}
  */
  kerning:true,

  /**
     is justify enabled? default [true]
     @memberof Nehan.Config
     @type {boolean}
  */
  justify:true,

  /**
     max rety count when something troubles. default [20]
     @memberof Nehan.Config
     @type {int}
  */
  maxRollbackCount:20,

  /**
     max available page count for each engine. default [10000]
     @memberof Nehan.Config
     @type {int}
  */
  maxPageCount:10000,

  /**
     use vertical glyph if browser support 'writing-mode'. default [true]
     @memberof Nehan.Config
     @type {boolean}
  */
  useVerticalGlyphIfEnable:true,

  /**
     calculate strict alphabetical metrics using hidden canvas. default [true]
     @memberof Nehan.Config
     @type {boolean}
   */
  useStrictWordMetrics:true,

  /**
     enable ommiting element by start tag. default [false]
     @memberof Nehan.Config
     @type {boolean}
  */
  enableAutoCloseTag:false,

  /**
     default length of html-lexer buffer. default [2000]
     @memberof Nehan.Config
     @type {int}
  */
  lexingBufferLen:2000
};

