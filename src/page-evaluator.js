var PageEvaluator = (function(){
  function PageEvaluator(){
    this.evaluator = new LayoutEvaluator();
  }

  PageEvaluator.prototype = {
    evaluate : function(body_element){
      return new Page({
	html:this.evaluator.evaluate(body_element),
	percent:body_element.percent,
	seekPos:body_element.seekPos,
	pageNo:body_element.pageNo,
	charPos:body_element.charPos,
	charCount:body_element.charCount
      });
    }
  };

  return PageEvaluator;
})();

