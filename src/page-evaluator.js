var PageEvaluator = (function(){
  function PageEvaluator(){
    this.evaluator = new LayoutEvaluator();
  }

  PageEvaluator.prototype = {
    evaluate : function(body_element){
      return new EvalResult({
	html:this.evaluator.evaluate(body_element),
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

