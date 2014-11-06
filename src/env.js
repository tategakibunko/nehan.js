Nehan.Env = (function(){
  var __client = new Nehan.Client();
  var __is_transform_enable = !(__client.isIE() && __client.version <= 8);
  var __is_chrome_vert_glyph_enable = __client.isChrome() && __client.version >= 24;
  var __is_safari_vert_glyph_enable = __client.isSafari() && __client.version >= 5;
  var __is_vertical_glyph_enable = __is_chrome_vert_glyph_enable || __is_safari_vert_glyph_enable;

  return {
    client:__client,
    isTransformEnable : __is_transform_enable,
    isVerticalGlyphEnable : __is_vertical_glyph_enable
  };
})();
