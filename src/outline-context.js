var OutlineContext = (function(){
  function OutlineContext(){
    this._buffers = {};
    this._stack = [];
    this._curSection = "body";
  }

  OutlineContext.prototype = {
    _addHeaderLog : function(log){
      var root_log = this.getOutlineBuffer(this._curSection);
      root_log.addHeaderLog(log);
    },
    _addSectionLog : function(log){
      var root_log = this.getOutlineBuffer(this._curSection);
      root_log.addSectionLog(log);
    },
    _getCurSection : function(){
      return (this._stack.length > 0)? this._stack[this._stack.length - 1] : "body";
    },
    getOutlineBuffer : function(root_name){
      var buffer = this._buffers[root_name] || new OutlineBuffer(root_name);
      this._buffers[root_name] = buffer;
      return buffer;
    },
    startSectionRoot : function(root_name){
      this._stack.push(root_name);
      this._curSection = root_name;
    },
    endSectionRoot : function(root_name){
      this._stack.pop();
      this._curSection = this._getCurSection();
      return this._curSection;
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
