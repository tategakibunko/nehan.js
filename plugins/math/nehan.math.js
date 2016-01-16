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
  display:"inline",
  onload:function(ctx){
    var res = ctx.getPreloadResource();
    var markup = ctx.getMarkup();
    if(!res){
      markup.setContent("[error: MathJax.js is not loaded!]");
      return;
    }
    markup
      .setAttr("extent", res.getAttr("extent", "2.5em"))
      .setAttr("lazy", true)
    ;
  },
  oncreate:function(ctx){
    var res = ctx.getPreloadResource();
    if(!res){
      return;
    }
    if(ctx.isTextVertical()){
      ctx.dom.classList.add("nehan-rotate-90");
      ctx.dom.style.height = "auto";
    }
    ctx.dom.innerHTML = "";
    ctx.dom.appendChild(res.element);
  }
});
