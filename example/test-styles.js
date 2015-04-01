var TestStyles = {
  ".nehan-test-pseudo li:first-child":{
    "color":"green"
  },
  ".nehan-test-pseudo li:last-child":{
    "background-color":"skyblue"
  },
  ".nehan-test-pseudo p:first-of-type":{
    "color":"red"
  },
  ".nehan-test-pseudo p:last-of-type":{
    "color":"blue"
  },
  ".nehan-test-pseudo-only div:only-of-type":{
    "background-color":"#ccc",
    "color":"white",
    "margin":{"after":"1em"}
  },
  ".nehan-test-pseudo-only p:only-child":{
    "background-color":"black",
    "color":"white"
  },
  ".nehan-gen-adj-test a~b":{
    "color":"green"
  },
  ".nehan-adj-test a+b":{
    "color":"red"
  },
  "span[lang]":{
    "font-weight":"bold"
  },
  "span[lang=pt]":{
    "color":"green"
  },
  "span[lang~=en-us]":{
    "color": "blue"
  },
  "span[lang|=zh]":{
    "color": "red"
  },
  "a[href^=#]":{
    "background-color":"gold"
  },
  "a[href$=.cn]":{
    "color": "red"
  },
  "a[href*=example]":{
    "background-color":"#CCCCCC"
  },
  ".nehan-test-stripe li":{
    "color":function(pcontext){
      var nth = pcontext.getChildIndex();
      return (nth % 2 === 0)? "white" : "orange";
    },
    onload:function(scontext){
      var nth = scontext.getChildIndex();
      return (nth % 2 === 0)? {"background-color":"red"} : {"background-color":"blue"};
    }
  },
  ".nehan-test-before::before":{
    "display":"inline",
    "color":"darkred",
    "padding":{
      "end":"5px"
    },
    content:"this is inserted by before"
  },
  ".nehan-test-after::after":{
    "display":"inline",
    "color":"green",
    "padding":{
      "start":"5px"
    },
    content:"this is inserted by after"
  },
  ".nehan-first-line-larger::first-line":{
    "display":"block",
    "font-size":"1.6em"
  },
  ".nehan-my-callback":{
    onload:function(scontext){
      var markup = scontext.getMarkup();
      var rest_extent = scontext.getRestExtent();
      markup.setContent([
	markup.getContent(),
	"<p>this is added by onload(rest extent = " + rest_extent + " at this point)</p>"
      ].join(""));
    }
  }
};
