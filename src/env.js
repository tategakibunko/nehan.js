var Env = (function(){
  var __client = new Client();
  var __is_transform_enable = !(__client.isIE() && __client.version <= 8);
  var __is_chrome_vert_glyph_enable = __client.isChrome() && __client.version >= 24;
  var __is_safari_vert_glyph_enable = __client.isSafari() && __client.version >= 5;
  var __is_vertical_glyph_enable = __is_chrome_vert_glyph_enable || __is_safari_vert_glyph_enable;

  return {
    clientName : __client.name,
    clientVersion : __client.version,
    isIE : __client.isIE(),
    isTrident : __client.isTrident(),
    isChrome : __client.isChrome(),
    isWebkit : __client.isWebkit(),
    isIphone : __client.isIphone(),
    isIpod : __client.isIpod(),
    isIpad : __client.isIpad(),
    isAppleMobileFamily : __client.isAppleMobileFamily(),
    isAndroid : __client.isAndroid(),
    isSmartPhone : __client.isSmartPhone(),
    isTransformEnable : __is_transform_enable,
    isVerticalGlyphEnable : __is_vertical_glyph_enable
  };
})();
