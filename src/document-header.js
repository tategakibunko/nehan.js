Nehan.DocumentHeader = (function(){
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

  /**
   @memberof Nehan.DocumentHeader
   @param title {String}
   */
  DocumentHeader.prototype.setTitle = function(title){
    this.title = title;
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {String}
   */
  DocumentHeader.prototype.getTitle = function(){
    return this.title;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addLink = function(markup){
    this.links.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getLinks = function(){
    return this.links;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addMeta = function(markup){
    this.metas.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getMetas = function(){
    return this.metas;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param name {String}
   @return {Nehan.Tag}
   */
  DocumentHeader.prototype.getMetaByName = function(name){
    return Nehan.List.find(this.metas, function(meta){
      return meta.getTagAttr("name") === name;
    });
  };
  /**
   @memberof Nehan.DocumentHeader
   @param name {String}
   @return {String}
   */
  DocumentHeader.prototype.getMetaContentByName = function(name){
    var meta = this.getMetaByName(name);
    return meta? meta.getTagAttr("content") : null;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addScript = function(markup){
    this.scripts.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getScripts = function(){
    return this.scripts;
  };
  /**
   @memberof Nehan.DocumentHeader
   @param markup {Nehan.Tag}
   */
  DocumentHeader.prototype.addStyle = function(markup){
    this.styles.push(markup);
  };
  /**
   @memberof Nehan.DocumentHeader
   @return {Array.<Nehan.Tag>}
   */
  DocumentHeader.prototype.getStyles = function(){
    return this.styles;
  };

  return DocumentHeader;
})();

