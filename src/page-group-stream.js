var PageGroupStream = (function(){
  function PageGroupStream(text, group_size){
    PageStream.call(this, text, group_size);
  }
  Class.extend(PageGroupStream, PageStream);
  
  // anchors and outline positions of nehan are returned as 'cell_page_pos'.
  // for example, first page group(size=4) consists of [0,1,2,3] cell pages.
  // so cell page nums '0..3' are equivalent to group page no '0'.
  PageGroupStream.prototype.getGroupPageNo = function(cell_page_no){
    return Math.round(cell_page_no / this.groupSize);
  };

  // () -> [tree]
  PageGroupStream.prototype._yield = function(){
    var trees = [], push = function(tree){
      if(tree){
	trees.push(tree);
      }
    };
    while(trees.length < this.groupSize && this.hasNext()){
      push(this.generator.yield());
    }
    return trees;
  };

  PageGroupStream.prototype._isEvaluated = function(entry){
    return (entry instanceof PageGroup);
  };

  PageGroupStream.prototype._createEvaluator = function(){
    return new PageGroupEvaluator(this.groupSize);
  };

  return PageGroupStream;
})();

