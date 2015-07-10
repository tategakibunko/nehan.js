/**
   browser environment object

   @namespace Nehan.Env
*/
Nehan.Env = (function(){
  var __client = new Nehan.Client();
  var __is_transform_enable = !(__client.isIE() && __client.version <= 8);
  var __is_ie_vert_glyph_enable = __client.isIE() && __client.version >= 10;
  var __is_chrome_vert_glyph_enable = __client.isChrome() && __client.version >= 24;
  var __is_safari_vert_glyph_enable = __client.isSafari() && __client.version >= 5;
  var __is_vertical_glyph_enable = __is_chrome_vert_glyph_enable || __is_safari_vert_glyph_enable || __is_ie_vert_glyph_enable;

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
