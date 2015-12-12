Nehan.PageEvaluator = (function(){
  /**
     @memberof Nehan
     @class PageEvaluator
     @classdesc evaluate {@link Nehan.Box} as {@link Nehan.Page}.
     @constructor
  */
  function PageEvaluator(context){
    this.context = context;
    this.evaluator = this._getEvaluator();
  }

  PageEvaluator.prototype._getEvaluator = function(){
    var body_selector = this.context.selectors.get("body") || new Nehan.Selector("body", {flow:Nehan.Config.defaultBoxFlow});
    var flow = body_selector.getEntries().flow || Nehan.Config.defaultBoxFlow;
    return (flow === "tb-rl" || flow === "tb-lr")? new Nehan.VertEvaluator(this.context) : new Nehan.HoriEvaluator(this.context);
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

