// nehan.prettify.js
// Copyright(c) 2015-, Watanabe Masaki
// license: MIT

/**
   plugin name: prettify
   description: prettify code using google code prettify(https://github.com/google/google-code-prettify).
   tag: pre.prettify
   close_tag: not required
   dependencies: google code prettify

   attributes: none

   example:
     <pre class="prettify">alert("hello, prettify!");</pre>
*/
Nehan.setStyles({
  "pre.prettify":{
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
  ".pln":{
    color:"#111111"
  },
  /* string content */
  ".str":{
    color:"#739200"
  },
  /* a keyword */
  ".kwd":{
    //"font-weight":"bold",
    color:"#739200"
  },
  /* a comment */
  ".com":{
    "font-style":"italic",
    color:"#999999"
  },
  /* a type name */
  ".typ":{
    //"font-weight":"bold",
    color:"#ff0055"
  },
  /* a literal value */
  ".lit":{
    color:"#538192"
  },
  /* punctuation */
  ".pun":{
    color:"#111111"
  },
  /* lisp open bracket */
  ".opn":{
    color:"#111111"
  },
  /* lisp close bracket */
  ".clo":{
    color:"#111111"
  },
  /* a markup tag name */
  ".tag":{
    //"font-weight":"bold",
    color:"#111111"
  },
  /* a markup attribute name */
  ".atn":{
    color:"#739200"
  },
  /* a markup attribute value */
  ".atv":{
    color:"#ff0055"
  },
  /* a declaration */
  ".dec":{
    color:"#111111"
  },
  /* a variable name */
  ".var":{
    color:"#111111"
  },
  /* a function name */
  ".fun":{
    color:"#538192"
  }
});
