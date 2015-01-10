var DocumentHeader = (function(){
  /**
     @memberof Nehan
     @class DocumentHeader
     @classdesc html &lt;head&gt; data wrapper.
     @constructor
  */
  function DocumentHeader(){
    this.title = "";
    this.metas = [];
    this.links = [];
    this.scripts = [];
    this.styles = [];
  }

  DocumentHeader.prototype = {
    /**
       @memberof Nehan.DocumentHeader
       @param title {String}
    */
    setTitle :function(title){
      this.title = title;
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {String}
    */
    getTitle : function(){
      return this.title;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addLink : function(markup){
      this.links.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getLinks : function(){
      return this.links;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addMeta : function(markup){
      this.metas.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getMetas : function(){
      return this.metas;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param name {String}
       @return {Nehan.Tag}
    */
    getMetaByName : function(name){
      return List.find(this.metas, function(meta){
	return meta.getTagAttr("name") === name;
      });
    },
    /**
       @memberof Nehan.DocumentHeader
       @param name {String}
       @return {String}
    */
    getMetaContentByName : function(name){
      var meta = this.getMetaByName(name);
      return meta? meta.getTagAttr("content") : null;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addScript : function(markup){
      this.scripts.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getScripts : function(){
      return this.scripts;
    },
    /**
       @memberof Nehan.DocumentHeader
       @param markup {Nehan.Tag}
    */
    addStyle : function(markup){
      this.styles.push(markup);
    },
    /**
       @memberof Nehan.DocumentHeader
       @return {Array.<Nehan.Tag>}
    */
    getStyles : function(){
      return this.styles;
    }
  };

  return DocumentHeader;
})();

