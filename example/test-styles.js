var TestStyles = {
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
    "onload":function(style, context){
      var rest_extent = context.getBlockRestExtent();
      style.markup.setContent([
	style.markup.getContent(),
	"<p>this is added by onload(rest extent = " + rest_extent + " at this point)</p>"
      ].join(""));
    },
    "inline":function(style, context){
      style.markup.setContent([
	style.markup.getContent(),
	"<p>this is added by inline</p>"
      ].join(""));
    }
  }
};
