var OutlineGenerator = (function(){
  function OutlineGenerator(logs){
    this._ptr = 0;
    this._logs = logs;
    this._root = new Section("section", null, 0);
  }

  OutlineGenerator.prototype = {
    yield : function(){
      this._parse(this._root, this);
      return this._root;
    },
    _getNext : function(){
      return this._logs.get(this._ptr++);
    },
    _rollback : function(){
      this._ptr = Math.max(0, this._ptr - 1);
    },
    _parse : function(parent, ctx){
      var log = ctx._getNext();
      if(log === null){
	return;
      }
      switch(log.name){
      case "start-section":
	var section = new Section(log.type, parent, log.pageNo);
	if(parent){
	  parent.addChild(section);
	}
	arguments.callee(section, ctx);
	break;

      case "end-section":
	arguments.callee(parent.getParent(), ctx);
	break;

      case "set-header":
	var header = new SectionHeader(log.rank, log.title, log.headerId);
	if(parent === null){
	  var auto_section = new Section("section", null, log.pageNo);
	  auto_section.setHeader(header);
	  arguments.callee(auto_section, ctx);
	} else if(!parent.hasHeader()){
	  parent.setHeader(header);
	  arguments.callee(parent, ctx);
	} else {
	  var rank = log.rank;
	  var parent_rank = parent.getRank();
	  if(rank < parent_rank){ // higher rank
	    ctx._rollback();
	    arguments.callee(parent.getParent(), ctx);
	  } else if(log.rank == parent_rank){ // same rank
	    var next_section = new Section("section", parent, log.pageNo);
	    next_section.setHeader(header);
	    parent.addNext(next_section);
	    arguments.callee(next_section, ctx);
	  } else { // lower rank
	    var child_section = new Section("section", parent, log.pageNo);
	    child_section.setHeader(header);
	    parent.addChild(child_section);
	    arguments.callee(child_section, ctx);
	  }
	}
	break;
      }
    }
  };

  return OutlineGenerator;
})();
