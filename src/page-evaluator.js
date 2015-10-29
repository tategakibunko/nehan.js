Nehan.PageEvaluator = (function(){
  /**
     @memberof Nehan
     @class PageEvaluator
     @classdesc evaluate {@link Nehan.Box} as {@link Nehan.Page}.
     @constructor
  */
  function PageEvaluator(){
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype._getEvaluator = function(){
    var body_selector = Selectors.get("body") || new Selector("body", {flow:Nehan.Display.flow});
    var flow = body_selector.getValue().flow || Nehan.Display.flow;
    return (flow === "tb-rl" || flow === "tb-lr")? new Nehan.VertEvaluator() : new Nehan.HoriEvaluator();
  };

  /**
   evaluate {@link Nehan.Box}, output {@link Nehan.Page}.

   @memberof Nehan.PageEvaluator
   @param tree {Nehan.Box}
   @return {Nehan.Page}
   */
  PageEvaluator.prototype.evaluate = function(tree){
    return tree? new Nehan.Page({
      tree:tree,
      element:this.evaluator.evaluate(tree),
      text:tree.text,
      percent:tree.percent,
      seekPos:tree.seekPos,
      pageNo:tree.pageNo,
      charPos:tree.charPos,
      charCount:tree.charCount
    }) : null;
  };

  return PageEvaluator;
})();

