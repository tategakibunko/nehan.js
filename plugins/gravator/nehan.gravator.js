// nehan.gravator.js
// Copyright(c) 2014-, Watanabe Masaki
// license: MIT

/**
   plugin name: nehan-gravator
   description: shortcut tag for gravator(http://www.gravator.com/) icon.
   tag_name: gravator
   close_tag: not required
   dependencies: Javascript-MD5(https://github.com/blueimp/JavaScript-MD5), for md5 hash of email.

   attributes:
     - email {String}: gravator email address
     - size {Int}: icon size

   example:
     <gravator email='someone@example.com' size='64'>
*/
Nehan.addSingleTagByName("gravator");
Nehan.setStyle("gravator", {
  "onload":function(selector_context){
    var markup = selector_context.getMarkup();
    var src_tmpl = "http://www.gravatar.com/avatar/{{md5}}?s={{size}}&d=identicon";
    var email = markup.getAttr("email");
    var size = markup.getAttr("size", 128);
    if(typeof md5 === "undefined"){
      throw "nehan.gravator.js: md5 function is not defined";
    }
    var src = src_tmpl.replace(/{{md5}}/, md5(email)).replace(/{{size}}/, size);
    markup.setAlias("img");
    markup.setAttr("width", size);
    markup.setAttr("height", size);
    markup.setAttr("src", src);
  }
});
