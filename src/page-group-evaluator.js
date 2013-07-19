var PageGroupEvaluator = (function(){
  function PageGroupEvaluator(){
    this.evaluator = new PageEvaluator();
  }

  PageGroupEvaluator.prototype = {
    evaluate : function(page_group){
      var self = this;
      var char_count = 0;
      var html = [];
      var results = List.map(page_group.getPages(), function(page){
	var ret = self.evaluator.evaluate(page);
	char_count += ret.charCount;
	html.push(ret.html);
	return ret;
      });
      var first = results[0];
      return new EvalResult({
	html:html,
	groupLength:page_group.getSize(),
	percent:first.percent,
	seekPos:first.seekPos,
	pageNo:first.pageNo,
	charPos:first.charPos,
	charCount:char_count
      });
    }
  };

  return PageGroupEvaluator;
})();
