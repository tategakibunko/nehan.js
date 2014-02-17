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

This is async example. You can obtain string of paged-media via ``onProgress`` callback.

```
var engine = Nehan.setup({
  layout:{
    direction:"hori", // or 'vert'
    vert:"tb-rl", // or 'tb-lr'
    hori:"lr-tb", // 'rl-tb' not supported.
    width:640,
    height:480,
    fontSize:16
  }
});

var stream = engine.createPageStream("hello, nehan");

stream.asyncGet({
  onProgress:function(stream){
    var paged_html = stream.getSeekPageResult().getHtml();
    // console.log("page:%s", paged_html);
  },
  onComplete:function(time){
    // console.log("time ellapsed:%f msec", time);
  }
});
```

If source text is short and blocking not matter, you can use ``syncGet`` instead of ``asyncGet``.

But be carefull because it takes long time if source text is too long.

```
var engine = Nehan.setup({
  layout:{
    direction:"hori", // or 'vert'
    vert:"tb-rl", // or 'tb-lr'
    hori:"lr-tb", // 'rl-tb' not supported.
    width:640,
    height:480,
    fontSize:16
  }
})

var stream = engine.createPageStream("hello, nehan");
var time = stream.syncGet();

for(var i = 0; i < stream.getPageCount(); i++){
  console.log("page:%s", stream.get(i).getHtml());
}
```

## Detail

See example directory.

Quick demo and document is [here](http://tategakibunko.github.io/nehan.js).

Markup reference is [nehan.js markup reference](http://tb.antiscroll.com/docs/nehan/markup/).

jQuery plugin is [here](https://github.com/tategakibunko/jquery.nehan).

## License

MIT License
