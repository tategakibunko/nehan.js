// nehan.tip.js
// Copyright(c) 2014-, Watanabe Masaki
// license: MIT


/**
   plugin name: nehan-tip
   description: create link that shows popup message when clicked.
   tag_name: tip
   close_tag: required
   dependencies: jQuery

   attributes:
     - title: tip title

   example:
     <tip title="this is tip title">this text is popuped when clicked.</tip>
*/
Nehan.setStyle("tip", {
  "display":"inline",
  "background-color":"gold",
  "color":"green",
  // <tip title='cilck me'>some text</tip>
  // => <a href='#' data-title='click me' data-content='some text'>click me</a>
  "onload":function(selector_context){
    var markup = selector_context.getMarkup();
    var tip_title = markup.getAttr("title");
    var tip_content = markup.getContent();
    markup.setAlias("a");
    markup.setAttr("href", "#" + tip_title);
    markup.setData("title", tip_title);
    markup.setData("content", tip_content);
    markup.setContent(tip_title);
  },
  "oncreate":function(dom, style_context){
    var tip_content = style_context.getMarkupData("content");
    dom.onclick = function(){
      alert(tip_content);
      return false;
    };
    /*
    $(dom).click(function(){
      alert(dom.data("content"));
      return false;
    });*/
  }
});
