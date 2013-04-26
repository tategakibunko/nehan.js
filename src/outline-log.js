var OutlineLog = (function(){
  function OutlineLog(root_name){
    this.rootName = root_name;
    this.logs = [];
  }

  OutlineLog.prototype = {
    // find same log without page no.
    _isSameLog : function(log1, log2){
      for(var prop in log1){
	if(prop == "pageNo" || prop == "headerId"){
	  continue;
	}
	if(log1[prop] != log2[prop]){
	  return false;
	}
      }
      return true;
    },
    _findLog : function(log){
      for(var i = this.logs.length - 1; i >= 0; i--){
	if(this._isSameLog(log, this.logs[i])){
	  return i;
	}
      }
      return -1;
    },
    addSectionLog : function(log){
      this.logs.push(log);
    },
    addHeaderLog : function(log){
      // if section tag can't be included in parent layout,
      // it's added twice by rollback yielding.
      // in such case, we have to update old one.
      var pos = this._findLog(log);
      if(pos >= 0){
	this.logs[pos] = log; // update log
	return;
      }
      this.logs.push(log);
    },
    get : function(pos){
      return this.logs[pos] || null;
    }
  };

  return OutlineLog;
})();
