var DocumentContext = (function(){
  var __document_type = "html";
  var __document_header = null;
  var __page_no = 0;
  var __char_pos = 0;
  var __anchors = {};
  var __outline_contexts = [];
  var __header_id = 0; // unique header-id

  var __get_outline_contexts_by_name = function(section_root_name){
    return List.filter(__outline_contexts, function(context){
      return context.getMarkupName() === section_root_name;
    });
  };

  var __create_outline_elements_by_name = function(section_root_name, callbacks){
    var contexts = __get_outline_contexts_by_name(section_root_name);
    if(contexts.length === 0){
      return null;
    }
    // if multiple outline-context exists for one section_root_name, use first one only.
    var tree = OutlineContextParser.parse(contexts[0]);
    return tree? SectionTreeConverter.convert(tree, callbacks) : null;
  };

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
    addOutlineContext : function(outline_context){
      __outline_contexts.push(outline_context);
    },
    addAnchor : function(name){
      __anchors[name] = __page_no;
    },
    getAnchorPageNo : function(name){
      return (typeof __anchors[name] === "undefined")? null : __anchors[name];
    },
    genHeaderId : function(){
      return __header_id++;
    },
    // this is shortcut function for __create_outline_elements_by_name("body", callbacks).
    // in many case, outline-context is only under "body" context,
    // and this function returns only one outline element just under the "body".
    createBodyOutlineElement : function(callbacks){
      return __create_outline_elements_by_name("body", callbacks);
    },
    createOutlineElementsByName : function(section_root_name, callbacks){
      return __create_outline_elements_by_name(section_root_name, callbacks);
    }
  };
})();

