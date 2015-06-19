/**
   global context data for all layout engines defined in same browser window.

   @namespace Nehan.DocumentContext
*/
var DocumentContext = (function(){
  var __document_type = "html";
  var __document_header = null;
  var __page_no = 0;
  var __char_pos = 0;
  var __anchors = {};
  var __outline_contexts = [];
  var __header_id = 0; // unique header-id
  var __block_id = 0; // unique block-id
  var __root_block_id = 0; // unique block-id for direct children of <body>.

  var __get_outline_contexts_by_name = function(section_root_name){
    return Nehan.List.filter(__outline_contexts, function(context){
      return context.getMarkupName() === section_root_name;
    });
  };

  var __convert_outline_context_to_element = function(context, callbacks){
    var tree = OutlineContextParser.parse(context);
    return tree? SectionTreeConverter.convert(tree, callbacks) : null;
  };

  var __create_outline_elements_by_name = function(section_root_name, callbacks){
    var contexts = __get_outline_contexts_by_name(section_root_name);
    return Nehan.List.fold(contexts, [], function(ret, context){
      var element = __convert_outline_context_to_element(context, callbacks);
      return element? ret.concat(element) : ret;
    });
  };

  return {
    /**
       @memberof Nehan.DocumentContext
       @param document_type {String}
    */
    setDocumentType : function(document_type){
      __document_type = document_type;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {String}
    */
    getDocumentType : function(){
      return __document_type;
    },
    /**
       @memberof Nehan.DocumentContext
       @param document_header {Nehan.DocumentHeader}
    */
    setDocumentHeader : function(document_header){
      __document_header = document_header;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {Nehan.DocumentHeader}
    */
    getDocumentHeader : function(){
      return __document_header;
    },
    /**
       @memberof Nehan.DocumentContext
       @param char_pos {int}
    */
    stepCharPos : function(char_pos){
      __char_pos += char_pos;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    getCharPos : function(){
      return __char_pos;
    },
    /**
       @memberof Nehan.DocumentContext
    */
    stepPageNo : function(){
      __page_no++;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    getPageNo : function(){
      return __page_no;
    },
    /**
       @memberof Nehan.DocumentContext
       @param outline_context {Nehan.OutlineContext}
    */
    addOutlineContext : function(outline_context){
      __outline_contexts.push(outline_context);
    },
    /**
       @memberof Nehan.DocumentContext
       @param name {String}
    */
    addAnchor : function(name){
      __anchors[name] = __page_no;
    },
    /**
       @memberof Nehan.DocumentContext
       @param name {String}
       @return {int}
    */
    getAnchorPageNo : function(name){
      return (typeof __anchors[name] === "undefined")? null : __anchors[name];
    },
    /**
       @memberof Nehan.DocumentContext
       @return {String}
    */
    genHeaderId : function(){
      return [Nehan.engineId, __header_id++].join("-");
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    genRootBlockId : function(){
      return __root_block_id++;
    },
    /**
       @memberof Nehan.DocumentContext
       @return {int}
    */
    genBlockId : function(){
      return __block_id++;
    },
    /**
       * this is shortcut function for __create_outline_elements_by_name("body", callbacks).<br>
       * if many outline elements exists(that is, multiple '&lt;body&gt;' exists), use first one only.<br>
       * for details of callback function, see {@link Nehan.SectionTreeConverter}.

       @memberof Nehan.DocumentContext
       @param callbacks {Object} - hooks for each outline element.
       @param callbacks.onClickLink {Function}
       @param callbacks.createRoot {Function}
       @param callbacks.createChild {Function}
       @param callbacks.createLink {Function}
       @param callbacks.createToc {Function}
       @param callbacks.createPageNoItem {Function}
       @return {DOMElement}
    */
    createBodyOutlineElement : function(callbacks){
      var elements = __create_outline_elements_by_name("body", callbacks);
      return (elements.length === 0)? null : elements[0];
    },
    /**
     * create outline element for [section_root_name], returns multiple elements,<br>
     * because there may be multiple section root(&lt;figure&gt;, &lt;fieldset&gt; ... etc) in document.<br>
     * for details of callback function, see {@link Nehan.SectionTreeConverter}.

       @memberof Nehan.DocumentContext
       @param section_root_name {String}
       @param callbacks {Object} - hooks for each outline element.
       @param callbacks.onClickLink {Function}
       @param callbacks.createRoot {Function}
       @param callbacks.createChild {Function}
       @param callbacks.createLink {Function}
       @param callbacks.createToc {Function}
       @param callbacks.createPageNoItem {Function}
    */
    createOutlineElementsByName : function(section_root_name, callbacks){
      return __create_outline_elements_by_name(section_root_name, callbacks);
    }
  };
})();

