var PageGroup = (function(){
  function PageGroup(size){
    this.trees = [];
    this.size = size;
  }

  PageGroup.prototype = {
    add : function(tree){
      if(this.isComplete()){
	throw "overflow";
      }
      this.trees.push(tree);
    },
    commit : function(){
      var first = this.getFirst();
      this.percent = first.percent;
      this.seekPos = first.seekPos;
      this.pageNo = first.pageNo;
    },
    isEmpty : function(){
      return this.trees.length === 0;
    },
    isComplete : function(){
      return this.trees.length >= this.size;
    },
    getFirst : function(){
      return this.trees[0];
    },
    getLast : function(){
      return this.trees[this.trees.length - 1];
    },
    get : function(pos){
      return this.trees[pos];
    },
    getPages : function(){
      return this.trees;
    },
    getSize : function(){
      return this.size;
    },
    getLength : function(){
      return this.trees.length;
    }
  };

  return PageGroup;
})();
