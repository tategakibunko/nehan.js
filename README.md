# nehan.js

## Introduction

nehan.js is dynamic layout engine written in javascript, enable to yield **paged media** in non blocking way.

Almost all html5 tags are supported, and further more, vertical layout(lr-tb, rl-tb) supported.

Available on IE8+, Firefox3.5+, Google Chrome4+, Safari3+, Opera10+ etc.

## Build

nehan.js uses [Grunt](http://gruntjs.com) to concat all scripts.

to make nehan.js,

```
grunt concat:normal
```

and to make nehan.min.js,

```
grunt uglify:normal
grunt concat:min
```

## Install

Include css, js in the ``<head>``

```
<link href="/path/to/nehan.css" type="text/css" rel="stylesheet">
<script src="/path/to/nehan.js" type="text/javascript"></script>
```

## Usage

```
Nehan.setup({
  layout:{
    direction:"hori", // or 'vert'
    width:640,
    height:480,
    fontSize:16
  }
})
.createPageStream("hello, nehan")
.asyncGet({
  onProgress:function(stream){
    var paged_html = stream.getSeekPageResult().getHtml();
    // console.log("page:%s", paged_html);
  },
  onComplete:function(time){
    // console.log("time ellapsed:%f msec", time);
  }
});
```

## Detail

See example directory or

Quick demo and document is found at [nehan.js introduction](http://tb.antiscroll.com/docs/nehan/).

Markup reference is [nehan.js markup reference](http://tb.antiscroll.com/docs/nehan/markup/).

jQuery plugin [jquery.nehan](https://github.com/tategakibunko/jquery.nehan).

## License

MIT License
