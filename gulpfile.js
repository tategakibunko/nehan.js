/*
  gulpfile.js for nehan.js

  usage
  =====

  1. to make nehan.js
     gulp nehan.js

  2. to make nehan.min.js
     gulp nehan.min.js

  these files are generated in dist directory.
*/
var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var jshint = require("gulp-jshint");
var ignore = require("gulp-ignore");

// note that orders of these sources matter!
var sources = [
  "COPYING",

  // shared modules
  "src/nehan-start.js",
  "src/display.js",
  "src/client.js",
  "src/env.js",
  "src/class.js",
  "src/list.js",
  "src/args.js",
  "src/obj.js",
  "src/utils.js",
  "src/const.js",
  "src/css.js",
  "src/html.js",
  "src/uri.js",
  "src/tag-attr-lexer.js",
  "src/tag-attr-parser.js",
  "src/tag-attrs.js",
  "src/tag.js",
  "src/closure.js",
  "src/hash-set.js",
  "src/css-hash-set.js",
  "src/css-parser.js",
  "src/attr-selector.js",
  "src/pseudo-selector.js",
  "src/type-selector.js",
  "src/selector-lexer.js",
  "src/selector-state-machine.js",
  "src/selector.js",
  "src/rgb.js",
  "src/colors.js",
  "src/color.js",
  "src/palette.js",
  "src/cardinal.js",
  "src/box-rect.js",
  "src/box-corner.js",
  "src/font.js",
  "src/edge.js",
  "src/radius-2d.js",
  "src/border-radius.js",
  "src/border-color.js",
  "src/border-style.js",
  "src/padding.js",
  "src/margin.js",
  "src/border.js",
  "src/box-edge.js",
  "src/box-size.js",
  "src/box-position.js",
  "src/section-header.js",
  "src/section.js",
  "src/toc-context.js",
  "src/outline-context.js",
  "src/outline-context-parser.js",
  "src/section-tree-converter.js",
  "src/document-header.js",
  "src/float-direction.js",
  "src/float-directions.js",
  "src/text-align.js",
  "src/text-aligns.js",
  "src/break.js",
  "src/breaks.js",
  "src/page.js",
  "src/flow.js",
  "src/block-flow.js",
  "src/inline-flow.js",
  "src/box-flow.js",
  "src/box-flows.js",
  "src/text-metrics.js",
  "src/text.js",
  "src/char.js",
  "src/word.js",
  "src/tcy.js",
  "src/ruby.js",
  "src/token.js",
  "src/list-style-type.js",
  "src/list-style-pos.js",
  "src/list-style-image.js",
  "src/list-style.js",
  "src/text-empha-style.js",
  "src/text-empha-pos.js",
  "src/text-empha.js",
  "src/kerning.js",
  "src/partition-unit.js",
  "src/partition.js",
  "src/partition-hash-set.js",

  // closed modules
  // these modules/classes are referenced by Display/Config/style module.
  // so can't be shared with other engines.
  "src/nehan-setup-start.js",
  "src/config.js",
  "src/lexing-rule.js",
  "src/style.js",
  "src/anim.js",
  "src/selectors.js",
  "src/box.js",
  "src/html-lexer.js",
  "src/text-lexer.js",
  "src/document-context.js",
  "src/token-stream.js",
  "src/ruby-token-stream.js",
  "src/page-evaluator.js",
  "src/page-stream.js",
  "src/selector-prop-context.js",
  "src/selector-context.js",
  "src/style-context.js",
  "src/eval-context.js",
  "src/cursor-context.js",
  "src/block-context.js",
  "src/inline-context.js",
  "src/layout-generator.js",
  "src/block-generator.js",
  "src/inline-generator.js",
  "src/inline-block-generator.js",
  "src/text-generator.js",
  "src/link-generator.js",
  "src/first-line-generator.js",
  "src/lazy-generator.js",
  "src/break-after-generator.js",
  "src/flip-generator.js",
  "src/float-group.js",
  "src/float-group-stack.js",
  "src/float-generator.js",
  "src/parallel-generator.js",
  "src/section-root-generator.js",
  "src/section-content-generator.js",
  "src/list-generator.js",
  "src/list-item-generator.js",
  "src/table-generator.js",
  "src/table-row-generator.js",
  "src/table-cell-generator.js",
  "src/header-generator.js",
  "src/body-generator.js",
  "src/html-generator.js",
  "src/document-generator.js",
  "src/layout-evaluator.js",
  "src/vert-evaluator.js",
  "src/hori-evaluator.js",
  "src/nehan-setup-main.js",
  "src/nehan-setup-end.js",
  "src/paged-element.js"
];

gulp.task("nehan.js", function(){
  gulp.src(sources)
    .pipe(concat("nehan.js"))
    .pipe(gulp.dest("dist/"));
});

gulp.task("nehan.min.js", function(){
  gulp.src("dist/nehan.js")
    .pipe(uglify({preserveComments:"some"}))
    .pipe(rename("nehan.min.js"))
    .pipe(gulp.dest("dist/"));
});

gulp.task("jshint", function(){
  return gulp.src(["src/*.js", "!src/nehan-setup-start.js", "!src/nehan-setup-end.js"])
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});
