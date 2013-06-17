var PageEvaluator = (function(){
  function PageEvaluator(ctx){
    this.ctx = ctx || new DocumentContext();
    this.blockEvaluator = new BlockEvaluator(this.ctx);
  }

  PageEvaluator.prototype = {
    evaluate : function(box){
      var html = this.blockEvaluator.evaluate(box, this.ctx);
      var css_content = box.styles.join("\n");
      var style = Html.tagWrap("style", css_content, {"type":"text/css"});
      return new EvalResult({
	html:[style, html].join("\n"),
	percent:box.percent,
	seekPos:box.seekPos,
	pageNo:box.pageNo,
	charPos:box.charPos,
	charCount:box.charCount
      });
    }
  };

  return PageEvaluator;
})();

