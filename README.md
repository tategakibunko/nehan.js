# nehan.js

## Introduction

nehan.js is dynamic and logical html layout engine written in javascript, especially focused on generating **logical paged media** asynchronously.

In nehan.js, you can write styles in javascript context, so `functional css property` is supported(and various other hooks are supported).

Almost all html5 tags are supported, and further more, vertical layout(lr-tb, rl-tb) supported.

Available on IE8+, Firefox3.5+, Google Chrome4+, Safari3+, Opera10+ etc.

See [DEMO](http://tb.antiscroll.com/static/nehan-demo/).

## Install

Include css, js in the ``<head>``

```html
<link href="/path/to/nehan.css" type="text/css" rel="stylesheet">
<script src="/path/to/nehan.js" type="text/javascript"></script>
```

## Application sample

- [Nehan Reader/Paged-media reader for google chrome](https://chrome.google.com/webstore/detail/nehan-reader/bebbekgiffjpgjlgkkhmlgheckolmdcf)
- [Responsivook](http://tb.antiscroll.com/static/responsivook/)

## Screenshot

These screenshots are layout result of [jekyll-nehan](https://github.com/tategakibunko/jekyll-nehan).

### 1. horizontal paged media
<img src="https://raw.github.com/tategakibunko/jekyll-nehan/master/assets/sshot-hori.png" width="300" height="160" />

### 2. vertical paged media
<img src="https://raw.github.com/tategakibunko/jekyll-nehan/master/assets/sshot-vert.png" width="300" height="160" />

## Gettting started

```javascript
var doc = new Nehan.Document();
var target = doc.querySelector("#target");

// set document source html
doc.setContent("<h1>hello, nehan.js!!</h1>");

// set document style
doc.setStyle("body", {
  flow:"lr-tb",
  //flow:"tb-rl", // Japanese vertical style
  fontSize:"16px",
  width:"640px",
  height:"480px"
});

// set other style like this
doc.setStyle("h1", {
  margin:{
    after:"1rem"
  }
});

// start rendering.
doc.render({
  onPage:function(page, ctx){
    console.log("onPage:%o", page);
    page.element.style.marginBottom = "1em";
    target.appendChild(page.element);
  },
  onComplete:function(time, ctx){
    console.log("finish! %f msec", time);
  }
});

// you can obtain page directly by 'getPage'.
var first_page = doc.getPage(0);
var second_page = doc.getPage(1);

// you can get total page-count by 'getPageCount'.
var page_count = doc.getPageCount();

// you can move page by 'setPage'
$("button#back-to-first-page").click(function(){
  doc.setPage(0);
});
```

## Styling

You can set style by `Document::setStyle`.

First argument is `selector-key`, and second one is `selector-value`.

```javascript
doc.setStyle("body", {
  flow:"lr-tb",
  //"flow":"tb-rl", // for Japanese vertical
  fontSize:16,
  width:640,
  height:480,
  // you can use functional css value!
  backgroundColor:function(context){
    context.debug();
    return "wheat";
  },
  // called after after all props in "body" selector are loaded.
  onload:function(context){
    if(screen.width < 600){
      return {fontSize:"0.9em"};
    }
  },
  // called after "body" is converted into DOM Element.
  oncreate:function(context){
    context.dom.onclick = function(){
      alert("body is clicked!");
    };
    // many various context data...
    // console.log("logical box:", context.getBox());
    // console.log("style:", context.getStyle());
    // console.log("markup:", context.getMarkup());
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
