/**
 parser module to convert from context to section tree object.

 @namespace Nehan.OutlineContextParser
 */
Nehan.OutlineContextParser = (function(){
  var _parse = function(context, parent, ptr){
    var log = context.get(ptr++);
    if(log === null){
      return null;
    }
    switch(log.name){
    case "start-section":
      var section = new Nehan.Section(log.type, parent, log.pageNo);
      if(parent){
	parent.addChild(section);
      }
      _parse(context, section, ptr);
      break;

    case "end-section":
      _parse(context, parent.getParent(), ptr);
      break;

    case "set-header":
      var header = new Nehan.SectionHeader({
	id:log.headerId,
	rank:log.rank,
	title:log.title
      });
      if(parent === null){
	var auto_section = new Nehan.Section("section", null, log.pageNo);
	auto_section.setHeader(header);
	_parse(context, auto_section, ptr);
      } else if(!parent.hasHeader()){
	parent.setHeader(header);
	_parse(context, parent, ptr);
      } else {
	var rank = log.rank;
	var parent_rank = parent.getRank();
	if(rank < parent_rank){ // higher rank
	  ptr = Math.max(0, ptr - 1);
	  _parse(context, parent.getParent(), ptr);
	} else if(log.rank == parent_rank){ // same rank
	  var next_section = new Nehan.Section("section", parent, log.pageNo);
	  next_section.setHeader(header);
	  parent.addNext(next_section);
	  _parse(context, next_section, ptr);
	} else { // lower rank
	  var child_section = new Nehan.Section("section", parent, log.pageNo);
	  child_section.setHeader(header);
	  parent.addChild(child_section);
	  _parse(context, child_section, ptr);
	}
      }
      break;
    }
    return parent;
  };

  return {
    /**
     @memberof Nehan.OutlineContextParser
     @param context {Nehan.OutlineContext}
     @return {Nehan.Section} section tree root
     */
    parse : function(context){
      var ptr = 0;
      var root = new Nehan.Section("section", null, 0);
      return _parse(context, root, ptr);
    }
  };
})();
