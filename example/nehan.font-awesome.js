// nehan.font-awesome.js
// Copyright(c) 2014-, Watanabe Masaki
// license: MIT

/**
   plugin name: nehan-font-awesome
   description: shortcut tag for font-awesome(http://fortawesome.github.io/Font-Awesome/)
   tag_name: fa
   close_tag: not required

   attributes:
     - name: icon name, prefix 'fa-' is not required.

   example:
     <fa name="star">
     <fa name="user">
     <fa name="spin spinner">
*/
Nehan.addSingleTagByName("fa");
Nehan.setStyle("fa", {
  "display":"inline",
  "width":"1em",
  "height":"1em",
  oncreate:function(ctx){
    var $i = document.createElement("i");
    var names = ctx.box.style.markup.getAttr("name").replace(/\s+/g, " ").split(" ");
    var icon_names = ["fa"];
    for(var i = 0; i < names.length; i++){
      icon_names.push("fa-" + names[i]);
    }
    $i.className = icon_names.join(" ");
    ctx.dom.appendChild($i);
    if(ctx.box.style.isTextVertical()){
      ctx.dom.style.textAlign = "center";
    }
  },
  onload:function(ctx){
    ctx.getMarkup().setAttr("pasted", true);
  }
});
