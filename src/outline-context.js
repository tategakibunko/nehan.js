var OutlineContext = (function(){
  function OutlineContext(){
    this.rootLogs = {};
    this.rootStack = [];
    this.curRootSection = "body";
  }

  OutlineContext.prototype = {
    _addHeaderLog : function(log){
      var root_log = this.getRootLog(this.curRootSection);
      root_log.addHeaderLog(log);
    },
    _addSectionLog : function(log){
      var root_log = this.getRootLog(this.curRootSection);
      root_log.addSectionLog(log);
    },
    getRootLog : function(root_name){
      var logs = this.rootLogs[root_name] || new OutlineLog(root_name);
      this.rootLogs[root_name] = logs;
      return logs;
    },
    startSectionRoot : function(root_name){
      this.rootStack.push(root_name);
      this.curRootSection = root_name;
    },
    endSectionRoot : function(root_name){
      this.curRootSection = this.rootStack.pop() || "body";
      return this.curRootSection;
    },
    logStartSection : function(type, page_no){
      this._addSectionLog({
	name:"start-section",
	type:type,
	pageNo:page_no
      });
    },
    logEndSection : function(type){
      this._addSectionLog({
	name:"end-section",
	type:type
      });
    },
    logSectionHeader : function(type, rank, title, page_no, header_id){
      this._addHeaderLog({
	name:"set-header",
	type:type,
	rank:rank,
	title:title,
	pageNo:page_no,
	headerId:header_id // header id is used to associate header box object with outline.
      });
    }
  };

  return OutlineContext;
})();
