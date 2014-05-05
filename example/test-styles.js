var TestStyles = {
  ".nehan-test-hoge":{
    onload:function(context){
      var markup = context.getMarkup();
      markup.setContent(markup.getContent() + "う");
    }
  },
  "tip":{
    display:"inline",
    color:"red",
    background:"gold",
    events:{
      mouseover:function(event){
	var $target = $(event.target);
	$target.css("font-weight", "bold");
      },
      mouseout:function(event){
	var $target = $(event.target);
	$target.css("font-weight", "normal");
      },
      click:function(event){
	var $target = $(event.target);
	var tip_content = $target.data("content");
	if(tip_content){
	  alert(tip_content);
	}
	return false;
      }
    },
    onload:function(context){
      var markup = context.getMarkup();
      var tip_title = markup.getAttr("title");
      var tip_content = markup.getContent();
      markup.setData("title", tip_title);
      markup.setData("content", tip_content);
      markup.setContent(tip_title);
    }
  },
  ".nehan-test-pseudo li:first-child":{
    "color":"green"
  },
  ".nehan-test-pseudo p:first-of-type":{
    "font-weight":"bold",
    "color":"red"
  },
  ".nehan-test-pseudo blockquote:only-of-type":{
    "color":"white",
    "background-color":"gray"
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
  ".nehan-first-line-larger::first-line":{
    "display":"block",
    "font-size":"1.6em"
  },
  ".nehan-my-callback":{
    "onload":function(context){
      var markup = context.getMarkup();
      var rest_extent = context.getRestExtent();
      markup.setContent([
	markup.getContent(),
	"<p>this is added by onload(rest extent = " + rest_extent + " at this point)</p>"
      ].join(""));
    }
  }
};
