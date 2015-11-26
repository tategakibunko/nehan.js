# nehan.js

## Introduction

nehan.js is dynamic and logical html layout engine written in javascript, especially focused on generating **logical paged media** asynchronously.

In nehan.js, you can write styles in javascript context, so `functional css property` is supported(and various other hooks are supported).

Almost all html5 tags are supported, and further more, vertical layout(lr-tb, rl-tb) supported.

Available on IE8+, Firefox3.5+, Google Chrome4+, Safari3+, Opera10+ etc.

See [demo](http://tb.antiscroll.com/static/nehan-demo/) or [playground(Japanese)](http://tb.antiscroll.com/static/editor).

## Install

Include css, js in the ``<head>``

```html
<link href="/path/to/nehan.css" type="text/css" rel="stylesheet">
<script src="/path/to/nehan.js" type="text/javascript"></script>
```

## Application sample

- [Nehan Reader/Paged-media reader for google chrome](https://chrome.google.com/webstore/detail/nehan-reader/bebbekgiffjpgjlgkkhmlgheckolmdcf)
- [nehan.js playground!!](http://tb.antiscroll.com/static/editor/)
- [Responsivook](http://tb.antiscroll.com/static/responsivook/)

## Screenshot

These screenshots are layout result of [jekyll-nehan](https://github.com/tategakibunko/jekyll-nehan).

### 1. horizontal paged media
<img src="https://raw.github.com/tategakibunko/jekyll-nehan/master/assets/sshot-hori.png" width="300" height="160" />

### 2. vertical paged media
<img src="https://raw.github.com/tategakibunko/jekyll-nehan/master/assets/sshot-vert.png" width="300" height="160" />

## Gettting started

```javascript
var document = new Nehan.Document();
var target = document.querySelector("#target");

// set document source html
document.setContent("<h1>hello, nehan.js!!</h1>");

// set document style
document.setStyle("body", {
  flow:"lr-tb",
  //flow:"tb-rl", // Japanese vertical style
  fontSize:"16px",
  width:"640px",
  height:"480px"
});

// set other style like this
document.setStyle("p", {
  margin:{
    after:"1rem"
  }
});

// start rendering.
document.render({
  onPage:function(page, ctx){
    console.log("page %d complete:%o", page.pageNo, page.element);
    page.element.style.marginBottom = "1em";
    target.appendChild(page.element);
  },
  onComplete:function(time, ctx){
    console.log("finish! %f msec", time);
  }
});

// get page by getPage.
var first_page = document.getPage(0);

console.log("first page element:", first_page.element);

// get page count by getPageCount
var page_count = document.getPageCount();

// move page by setPage
$("button#back-to-first-page").click(function(){
  document.setPage(0);
});
```

## Styling

You can set style by `Document::setStyle`.

First argument is `selector key`, and second one is `selector value`.

```javascript
document.setStyle("body", {
  flow:"lr-tb",
  //"flow":"tb-rl", // for Japanese vertical
  fontSize:16,
  width:640,
  height:480,
  // you can use functional css property!
  backgroundColor:function(prop_context){
    // you can get many pseudo-class in javascript.
    // console.log("nth-child:%d", prop_context.getChildIndex());
    // console.log("nth-of-type:%d", prop_context.getChildIndexOfType());
    // console.log("is-last-child:%o", prop_context.isLastChild());
    // console.log("is-only-child:%o", prop_context.isOnlyChild());
    return "wheat";
  },
  // called after after all props in "body" selector are loaded.
  onload:function(selector_context){
    // console.log("nth-child:%d", selector_context.getChildIndex());
    // console.log("markup:%o", selector_context.getMarkup());
  },
  // called after "body" is converted into DOM Element.
  oncreate:function(context){
    context.dom.onclick = function(){
      alert("body is clicked!");
    };
    // many various context data...
    // console.log("box object:", context.box);
    // console.log("box context:", context.box.context);
    // console.log("box style:", context.box.context.style);
    // console.log("box markup:", context.box.context.style.markup);
  }
});
```

## Styling(global style)

You can define global stylel by using `Nehan.setStyle`.

Global styles are shared by all document object created in same browser window.

```javascript
Nehan.setStyle("body", {
  fontSize:16
});

// multiple values by setStyles.
Nehan.setStyles({
  "body":{
    "color":"#ccc"
  },
  "h1":{
    "font-size":"3em"
  }
});
```

## License

MIT License
