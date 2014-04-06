var PageGroupStream = (function(){
  function PageGroupStream(text, group_size){
    PageStream.call(this, text);
    this.groupSize = group_size;
  }
  Class.extend(PageGroupStream, PageStream);
  
  // anchors and outline positions of nehan are returned as 'cell_page_pos'.
  // for example, first page group(size=4) consists of [0,1,2,3] cell pages.
  // so cell page nums '0..3' are equivalent to group page no '0'.
  PageGroupStream.prototype.getGroupPageNo = function(cell_page_no){
    return Math.round(cell_page_no / this.groupSize);
  };

  PageGroupStream.prototype._yield = function(){
    var group = new PageGroup(this.groupSize);
    var add = function(page){
      group.add(page);
    };
    for(var i = 0; i < this.groupSize; i++){
      if(!this.generator.hasNext()){
	break;
      }
      add(this.generator.yield());
    }
    group.commit();
    return group;
  };

  PageGroupStream.prototype._createEvaluator = function(){
    return new PageGroupEvaluator();
  };

  return PageGroupStream;
})();
