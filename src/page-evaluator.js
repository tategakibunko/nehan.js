var PageEvaluator = (function(){
  function PageEvaluator(){
    this.blockEvaluator = new BlockTreeEvaluator();
  }

  PageEvaluator.prototype = {
    evaluate : function(box){
      return new EvalResult({
	html:this.blockEvaluator.evaluate(box),
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

