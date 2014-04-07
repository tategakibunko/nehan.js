// parse : context -> section tree
var OutlineContextParser = (function(){
  var _parse = function(context, parent, ptr){
    var log = context.get(ptr++);
    if(log === null){
      return;
    }
    switch(log.name){
    case "start-section":
      var section = new Section(log.type, parent, log.pageNo);
      if(parent){
	parent.addChild(section);
      }
      arguments.callee(context, section, ptr);
      break;

    case "end-section":
      arguments.callee(context, parent.getParent(), ptr);
      break;

    case "set-header":
      var header = new SectionHeader(log.rank, log.title, log.headerId);
      if(parent === null){
	var auto_section = new Section("section", null, log.pageNo);
	auto_section.setHeader(header);
	arguments.callee(context, auto_section, ptr);
      } else if(!parent.hasHeader()){
	parent.setHeader(header);
	arguments.callee(context, parent, ptr);
      } else {
	var rank = log.rank;
	var parent_rank = parent.getRank();
	if(rank < parent_rank){ // higher rank
	  ptr = Math.max(0, ptr - 1);
	  arguments.callee(context, parent.getParent(), ptr);
	} else if(log.rank == parent_rank){ // same rank
	  var next_section = new Section("section", parent, log.pageNo);
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  arguments.callee(context, next_section, ptr);
	} else { // lower rank
	  var child_section = new Section("section", parent, log.pageNo);
	  child_section.setHeader(header);
	  parent.addChild(child_section);
	  arguments.callee(context, child_section, ptr);
	}
      }
      break;
    }
    return parent;
  };

  return {
    parse : function(context){
      var ptr = 0;
      var root = new Section("section", null, 0);
      return _parse(context, root, ptr);
    }
  };
})();
