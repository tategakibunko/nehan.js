var PageEvaluator = (function(){
  function PageEvaluator(){
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype = {
    _getEvaluator : function(){
      return (Layout.direction === "vert")? new VertEvaluator() : new HoriEvaluator();
    },
    evaluate : function(tree){
      return tree? new Page({
	element:this.evaluator.evaluate(tree),
	percent:tree.percent,
	seekPos:tree.seekPos,
	pageNo:tree.pageNo,
	charPos:tree.charPos,
	charCount:tree.charCount
      }) : null;
    }
  };

  return PageEvaluator;
})();

