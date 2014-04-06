var DocumentContext = (function(){
  var __anchors__ = {};
  var __outlines__ = [];
  var __metas__ = {};
  var __header__ = null;
  var __document_type__ = "html";

  return {
    setDocumentType : function(tag){
      // TODO
      //__document_type__ = tag.getSrc().replace(/<!doctype/gi).replace(">").replace(/\s+/g, "");
    },
    setDocumentHeader : function(header){
      __header__ = header;
    },
    getDocumentHeader : function(){
      return __header__;
    },
    getOutlineContext : function(markup_name){
      return List.filter(__outlines__, function(outline_context){
	return outline_context.getMarkupName() === markup_name;
      });
    },
    addOutlineContext : function(outline_context){
      __outlines__.push(outline_context);
    },
    addMetaValue : function(name, value){
      if(typeof __metas__[name] === "undefined"){
	__metas__[name] = [value];
	return;
      }
      __metas__[name].push(value);
    },
    getMetaValue : function(name){
      return __metas__[name] || null;
    },
    addAnchorPageNo : function(name, page_no){
      __anchors__[name] = page_no;
    },
    getAnchorPageNo : function(name){
      return __anchors__[name] || null;
    }
  }
})();


  

