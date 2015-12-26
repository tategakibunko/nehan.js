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
     true if client browser supports text-combine

     @memberof Nehan.Env
     @type {boolean}
     */
    isTextCombineEnable : __is_text_combine_enable
  };
})();
