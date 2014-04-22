var TestStyles = {
  ".nehan-test-stripe li":{
    "color":function(context){
      var nth = context.getChildIndex();
      return (nth % 2 === 0)? "white" : "orange";
    },
    "onload":function(context){
      var nth = context.getChildIndex();
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
  ".nehan-gen-adj-test a~b":{
    "color":"green"
  },
  ".nehan-adj-test a+b":{
    "color":"red"
  },
  ".nehan-first-line-larger::first-line":{
    "display":"block",
    "font-size":"1.6em"
  },
  ".nehan-my-callback":{
    "onload":function(context){
      var rest_extent = context.getRestExtent();
      context.setMarkupContent([
	context.getMarkupContent(),
	"<p>this is added by onload(rest extent = " + rest_extent + " at this point)</p>"
      ].join(""));
    }
  }
};
