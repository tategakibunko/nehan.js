var DocumentContext = {
  documentType:"html",
  anchors:{},
  outlineContexts:[],
  header:null,
  // this is shortcut function for getOutlineContextsByName
  // in many case, outline-context is only under "body" context,
  // and this function returns only one outline element just under the "body".
  createBodyOutlineElement : function(callbacks){
    var elements = this.createOutlineElementsByName("body", callbacks);
    if(elements.length > 0){
      return elements[0];
    }
    return null;
  },
  getOutlineContextsByName : function(section_root_name){
    return List.filter(this.outlineContexts, function(context){
      return context.getMarkupName() === section_root_name;
    });
  },
  createOutlineElementsByName : function(section_root_name, callbacks){
    var contexts = this.getOutlineContextsByName(section_root_name);
    return List.fold(contexts, [], function(ret, context){
      var tree = OutlineContextParser.parse(context);
      return tree? ret.concat(SectionTreeConverter.convert(tree, callbacks)) : ret;
    });
  },
  addOutlineContext : function(outline_context){
    this.outlineContexts.push(outline_context);
  },
  addAnchorPageNo : function(name, page_no){
    this.anchors[name] = page_no;
  },
  getAnchorPageNo : function(name){
    return this.anchors[name] || null;
  }
};
