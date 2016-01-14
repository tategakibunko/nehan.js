// nehan.math.js
// Copyright(c) 2016-, Watanabe Masaki
// license: MIT


/**
   plugin name: math
   description: MathJax support
   tag_name: math
   close_tag: required

   example:
     <math>$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</math>
*/
Nehan.setStyle("math", {
  display:"block",
  onload:function(ctx){
    var res = ctx.getPreloadResource();
    if(!res){
      ctx.getMarkup().setContent("[error: MathJax.js is not loaded!]");
      return;
    }
    ctx.getMarkup()
      .setAttr("extent", res.getAttr("extent", "2.5em"))
      .setAttr("pasted", true)
    ;
  },
  oncreate:function(ctx){
    var res = ctx.getPreloadResource();
    if(!res){
      return;
    }
    ctx.dom.innerHTML = "";
    ctx.dom.appendChild(res.element);
  }
});
