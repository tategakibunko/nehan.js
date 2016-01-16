// nehan.lazy.js
// Copyright(c) 2014-, Watanabe Masaki
// license: MIT

/**
   plugin name: lazy
   description: shortcut tag for lazy content
   tag_name: lazy
   close_tag: required

   attributes:
     - width {Int}: width of lazy area, prior to width of 'size' if both attributes are defined.
     - height {Int}: height of lazy area, prior to height of 'size' if both attributes are defined.
     - size {String}: shortcut attribute for width and height, format is '{width}x{height}'.

   example:
     <lazy size="200x300">lazy content</lazy>
     <lazy width="200" height="300">lazy content</lazy>
*/
Nehan.setStyle("lazy", {
  "display":"block",
  "onload":function(selector_context){
    var markup = selector_context.getMarkup();
    var size = markup.getAttr("size", "200x200").split("x");
    var width = markup.getAttr("width") || size[0] || 200;
    var height = markup.getAttr("height") || size[1] || 200;
    markup.setAttr("lazy", true);
    markup.setAttr("width", width);
    markup.setAttr("height", height);
    selector_context.setCssAttr("overflow", "scroll");
  }
});
