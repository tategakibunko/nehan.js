// parse : context -> section tree
var OutlineContextParser = (function(){
  var __ptr__ = 0;
  var __outline__ = null;
  var __root__ = null;

  var get_next = function(){
    return __outline__.get(__ptr__++);
  };

  var rollback = function(){
    __ptr__ = Math.max(0, __ptr__ - 1);
  };

  var parse = function(parent){
    var log = get_next();
    if(log === null){
      return;
    }
    switch(log.name){
    case "start-section":
      var section = new Section(log.type, parent, log.pageNo);
      if(parent){
	parent.addChild(section);
      }
      arguments.callee(section);
      break;

    case "end-section":
      arguments.callee(parent.getParent());
      break;

    case "set-header":
      var header = new SectionHeader(log.rank, log.title, log.headerId);
      if(parent === null){
	var auto_section = new Section("section", null, log.pageNo);
	auto_section.setHeader(header);
	arguments.callee(auto_section);
      } else if(!parent.hasHeader()){
	parent.setHeader(header);
	arguments.callee(parent);
      } else {
	var rank = log.rank;
	var parent_rank = parent.getRank();
	if(rank < parent_rank){ // higher rank
	  rollback();
	  arguments.callee(parent.getParent());
	} else if(log.rank == parent_rank){ // same rank
	  var next_section = new Section("section", parent, log.pageNo);
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  arguments.callee(next_section);
	} else { // lower rank
	  var child_section = new Section("section", parent, log.pageNo);
	  child_section.setHeader(header);
	  parent.addChild(child_section);
	  arguments.callee(child_section);
	}
      }
      break;
    }
  };

  return {
    parse : function(outline_context){
      __ptr__ = 0;
      __outline__ = outline_context;
      __root__ = new Section("section", null, 0);
      parse(__root__);
      return __root__;
    }
  };
})();
