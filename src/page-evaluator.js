var PageEvaluator = (function(){
  function PageEvaluator(){
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype = {
    _getEvaluator : function(){
      return (Layout.direction === "vert")? new VertEvaluator() : new HoriEvaluator();
    },
    evaluate : function(body_element){
      return body_element? new Page({
	html:this.evaluator.evaluate(body_element),
	percent:body_element.percent,
	seekPos:body_element.seekPos,
	pageNo:body_element.pageNo,
	charPos:body_element.charPos,
	charCount:body_element.charCount
      }) : null;
    }
  };

  return PageEvaluator;
})();

