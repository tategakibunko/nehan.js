var PageGroupStream = PageStream.extend({
  init : function(text, group_size){
    this._super(text);
    this.groupSize = group_size;
  },
  getAnchorPageNo : function(anchor_name){
    var page_no = this._super(anchor_name);
    return this.getGroupPageNo(page_no);
  },
  // anchors and outline positions of nehan are returned as 'cell_page_pos'.
  // for example, first page group(size=4) consists of [0,1,2,3] cell pages.
  // so cell page nums '0..3' are equivalent to group page no '0'.
  getGroupPageNo : function(cell_page_no){
    return Math.round(cell_page_no / this.groupSize);
  },
  _yield : function(){
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
  },
  _createEvaluator : function(){
    return new PageGroupEvaluator();
  }
});
