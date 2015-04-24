// nehan.prettify.js
// Copyright(c) 2015-, Watanabe Masaki
// license: MIT

/**
   plugin name: nehan-prettify
   description: prettify code using google code prettify(https://github.com/google/google-code-prettify).
   tag: pre.nehan-prettify
   close_tag: not required
   dependencies: google code prettify

   attributes: none

   example:
     <pre class="nehan-prettify">alert("hello, prettify!");</pre>
*/
Nehan.setStyles({
  "pre.nehan-prettify":{
    "margin":"10px",
    "padding":"8px",
    "background-color":"white",
    "border-width":"1px",
    "border-color":"#aaa",
    "border-style":"solid",
    "font-family":"monospace",
    "font-size":"smaller",
    "line-height":"1.4em",
    onload:function(ctx){
      var markup = ctx.getMarkup();
      var content = markup.getContent();
      var pretty_content = prettyPrintOne(content);
      //console.log(pretty_content);
      markup.setContent(pretty_content);
    }
  },
  ".nehan-pln":{
    color:"#111111"
  },
  /* string content */
  ".nehan-str":{
    color:"#739200"
  },
  /* a keyword */
  ".nehan-kwd":{
    //"font-weight":"bold",
    color:"#739200"
  },
  /* a comment */
  ".nehan-com":{
    "font-style":"italic",
    color:"#999999"
  },
  /* a type name */
  ".nehan-typ":{
    //"font-weight":"bold",
    color:"#ff0055"
  },
  /* a literal value */
  ".nehan-lit":{
    color:"#538192"
  },
  /* punctuation */
  ".nehan-pun":{
    color:"#111111"
  },
  /* lisp open bracket */
  ".nehan-opn":{
    color:"#111111"
  },
  /* lisp close bracket */
  ".nehan-clo":{
    color:"#111111"
  },
  /* a markup tag name */
  ".nehan-tag":{
    //"font-weight":"bold",
    color:"#111111"
  },
  /* a markup attribute name */
  ".nehan-atn":{
    color:"#739200"
  },
  /* a markup attribute value */
  ".nehan-atv":{
    color:"#ff0055"
  },
  /* a declaration */
  ".nehan-dec":{
    color:"#111111"
  },
  /* a variable name */
  ".nehan-var":{
    color:"#111111"
  },
  /* a function name */
  ".nehan-fun":{
    color:"#538192"
  }
});
