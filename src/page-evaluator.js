var PageEvaluator = (function(){
  function PageEvaluator(ctx){
    this.ctx = ctx || new DocumentContext();
    this.blockEvaluator = new BlockEvaluator(this.ctx);
  }

  PageEvaluator.prototype = {
    evaluate : function(box){
      var html = this.blockEvaluator.evaluate(box, this.ctx);
      var style = List.fold(box.styles, "", function(ret, markup){
	return ret + markup.getWrapSrc();
      });
      return new EvalResult({
	html:[style, html].join(""),
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

