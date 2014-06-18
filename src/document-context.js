var DocumentContext = (function(){
  var __document_type = "html";
  var __document_header = null;
  var __page_no = 0;
  var __char_pos = 0;
  var __anchors = {};
  var __outline_contexts = [];

  return {
    setDocumentType : function(document_type){
      __document_type = document_type;
    },
    getDocumentType : function(){
      return __document_type;
    },
    setDocumentHeader : function(document_header){
      __document_header = document_header;
    },
    getDocumentHeader : function(){
      return __document_header;
    },
    stepCharPos : function(char_pos){
      __char_pos += char_pos;
    },
    getCharPos : function(){
      return __char_pos;
    },
    stepPageNo : function(){
      __page_no++;
    },
    getPageNo : function(){
      return __page_no;
    },
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
      return List.filter(__outline_contexts, function(context){
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
      __outline_contexts.push(outline_context);
    },
    addAnchor : function(name){
      __anchors[name] = __page_no;
    },
    getAnchorPageNo : function(name){
      return (typeof __anchors[name] === "undefined")? null : __anchors[name];
    }
  };
})();

