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
  display:"inline",
  width:"1em",
  height:"1em",
  onload:function(ctx){
    var markup = ctx.getMarkup();
    var icon_names = markup.getAttr("name").replace(/\s+/g, " ").split(" ");
    var fa_icon_names = ["fa"];
    var get_fa_icon_name = function(icon_name){
      return (icon_name.indexOf("fa-") < 0)? "fa-" + icon_name : icon_name;
    };
    for(var i = 0; i < fa_icon_names.length; i++){
      fa_icon_names.push(get_fa_icon_name(fa_icon_names[i]));
    }
    markup.setContent("<i class='" + fa_icon_names.join(" ") + "'></i>");
    markup.setAttr("pasted", true);
  }
});

