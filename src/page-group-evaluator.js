var PageGroupEvaluator = (function(){
  function PageGroupEvaluator(group_size){
    this.groupSize = group_size;
    PageEvaluator.call(this);
  }
  Class.extend(PageGroupEvaluator, PageEvaluator);

  // [tree] -> PageGroup
  PageGroupEvaluator.prototype.evaluate = function(trees){
    var self = this;
    var pages = List.map(trees, function(tree){
      return PageEvaluator.prototype.evaluate.call(self, tree);
    });
    return new PageGroup(this.groupSize, pages);
  };

  return PageGroupEvaluator;
})();
