var DocumentContext = {
  documentType:"html",
  anchors:{},
  outlineContexts:[],
  header:null,
  getOutlineContextsByName : function(section_root_name){
    return List.filter(this.outlineContexts, function(context){
      return context.getMarkupName() === section_root_name;
    });
  },
  createOutlineElementsByName : function(section_root_name, callbacks){
    var contexts = this.getOutlineContextsByName(section_root_name);
    return List.map(contexts, function(context){
      var tree = OutlineContextParser.parse(context);
      return SectionTreeConverter.convert(tree, callbacks);
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
