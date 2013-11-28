var OutlineBuffer = (function(){
  function OutlineBuffer(root_name){
    this.rootName = root_name;
    this.logs = [];
  }

  OutlineBuffer.prototype = {
    isEmpty : function(){
      return this.logs.length === 0;
    },
    get : function(pos){
      return this.logs[pos] || null;
    },
    getSectionRootName : function(){
      return this.rootName;
    },
    addSectionLog : function(log){
      this.logs.push(log);
    },
    addHeaderLog : function(log){
      // if section tag can't be included in parent layout,
      // it will be added 'twice' by rollback yielding.
      // in such case, we have to overwrite old one.
      var pos = this._findLog(log);
      if(pos >= 0){
	this.logs[pos] = log; // overwrite log
	return;
      }
      this.logs.push(log);
    },
    _findLog : function(log){
      for(var i = this.logs.length - 1; i >= 0; i--){
	if(log.headerId === this.logs[i].headerId){
	  return i;
	}
      }
      return -1;
    }
  };

  return OutlineBuffer;
})();
