# nehan.js

## Introduction

nehan.js is dynamic layout engine written in javascript, enable to yield **paged media** in non blocking way.

Almost all html5 tags are supported, and further more, vertical layout(lr-tb, rl-tb) supported.

Available on IE8+, Firefox3.5+, Google Chrome4+, Safari3+, Opera10+ etc.

## Build

nehan.js uses [Grunt](http://gruntjs.com) to concat all scripts.

to make nehan.js,

    grunt concat:normal

and to make nehan.min.js,

    grunt uglify:normal
	grunt concat:min

## Install

Include css, js in the ``<head>``

	<link href="/path/to/nehan.css" type="text/css" rel="stylesheet">
	<script src="/path/to/nehan.js" type="text/javascript"></script>

## Usage

See example directory.

Quick start document is [nehan.js introduction](http://tategakibunko.mydns.jp/docs/nehan/).

Markup reference is [nehan.js markup reference](http://tategakibunko.mydns.jp/docs/nehan/markup/).

Want a quick tool? check out [jquery.nehan](https://github.com/tategakibunko/jquery.nehan).

## License

MIT License
