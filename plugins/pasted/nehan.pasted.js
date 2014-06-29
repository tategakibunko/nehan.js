// nehan.pasted.js
// Copyright(c) 2014-, Watanabe Masaki
// license: MIT

/**
   plugin name: nehan-pasted
   description: shortcut tag for pasted content
   tag_name: pasted
   close_tag: required

   attributes:
     - width {Int}: width of pasted area, prior to width of 'size' if both attributes are defined.
     - height {Int}: height of pasted area, prior to height of 'size' if both attributes are defined.
     - size {String}: shortcut attribute for width and height, format is '{width}x{height}'.

   example:
     <pasted size="200x300">pasted content</pasted>
     <pasted width="200" height="300">pasted content</pasted>
*/
Nehan.setStyle("pasted", {
  "display":"block",
  "onload":function(selector_context){
    var markup = selector_context.getMarkup();
    var size = markup.getAttr("size", "200x200").split("x");
    var width = markup.getAttr("width") || size[0] || 200;
    var height = markup.getAttr("height") || size[1] || 200;
    markup.setAttr("pasted", true);
    markup.setAttr("width", width);
    markup.setAttr("height", height);
    selector_context.setCssAttr("overflow", "scroll");
  }
});
