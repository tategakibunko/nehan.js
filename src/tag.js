// Important Notice:
// to avoid name-conflicts about existing name space of stylesheet,
// all class names and id in nehan.js are forced to be prefixed by "nehan-".
var Tag = (function (){
  /**
     @memberof Nehan
     @class Tag
     @classdesc abstraction of html tag markup.
     @constructor
     @param src {String} - string of markup part like "&lt;div class='foo'&gt;"
     @param content {String} - content text of markup
  */
  function Tag(src, content){
    this._type = "tag";
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attrs = this._parseTagAttrs(this.name, this.src);
    this._firstChild = false;
    this._firstOfType = false;
    this._lastChild = false;
    this._lastOfType = false;
    this._onlyChild = false;
    this._onlyOfType = false;
  }

  Tag.prototype = {
    /**
       @memberof Nehan.Tag
       @return {Nehan.Tag}
    */
    clone : function(){
      return new Tag(this.src, this.content);
    },
    /**
       @memberof Nehan.Tag
       @param content {String}
    */
    setContent : function(content){
      if(this._fixed){
	return;
      }
      this.content = content;
    },
    /**
       @memberof Nehan.Tag
       @param status {boolean}
    */
    setContentImmutable : function(status){
      this._fixed = status;
    },
    /**
       @memberof Nehan.Tag
       @param name {String} - alias markup name
    */
    setAlias : function(name){
      this.alias = name;
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param value {attribute_value}
    */
    setAttr : function(name, value){
      this.attrs.setAttr(name, value);
    },
    /**
       @memberof Nehan.Tag
       @param attrs {Object}
    */
    setAttrs : function(attrs){
      for(var name in attrs){
	this.setAttr(name, attrs[name]);
      }
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param value {dataset_value}
    */
    setData : function(name, value){
      this.attrs.setData(name, value);
    },
    /**
       @memberof Nehan.Tag
       @param status {Bool}
    */
    setFirstChild : function(status){
      this._firstChild = status;
    },
    /**
       @memberof Nehan.Tag
       @param status {Bool}
    */
    setOnlyChild : function(status){
      this._onlyChild = status;
    },
    /**
       @memberof Nehan.Tag
       @param status {Bool}
    */
    setOnlyOfType : function(status){
      this._onlyOfType = status;
    },
    /**
       @memberof Nehan.Tag
       @param status {Bool}
    */
    setFirstOfType : function(status){
      this._firstOfType = status;
    },
    /**
       @memberof Nehan.Tag
       @param status {Bool}
    */
    setLastChild : function(status){
      this._lastChild = status;
    },
    /**
       @memberof Nehan.Tag
       @param status {Bool}
    */
    setLastOfType : function(status){
      this._lastOfType = status;
    },
    /**
       @memberof Nehan.Tag
       @param klass {String}
    */
    addClass : function(klass){
      this.attrs.addClass(klass);
    },
    /**
       @memberof Nehan.Tag
       @param klass {String}
    */
    removeClass : function(klass){
      this.attrs.removeClass(klass);
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getId : function(){
      return this.attrs.getAttr("id");
    },
    /**
       @memberof Nehan.Tag
       @return {Array.<String>}
    */
    getClasses : function(){
      return this.attrs.classes;
    },
    /**
       @memberof Nehan.Tag
       @return {Array.<String>}
    */
    getClassesRaw : function(){
      return this.attrs.getClassesRaw();
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getName : function(){
      return this.alias || this.name;
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param def_value {default_value}
       @return {attribute_value}
    */
    getAttr : function(name, def_value){
      return this.attrs.getAttr(name, def_value);
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @param def_value {default_value}
       @return {dataset_value}
    */
    getData : function(name, def_value){
      return this.attrs.getData(name, def_value);
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getContent : function(){
      return this.content;
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getSrc : function(){
      return this.src;
    },
    /**
       @memberof Nehan.Tag
       @return {String}
    */
    getWrapSrc : function(){
      if(this.content === ""){
	return this.src;
      }
      return this.src + this.content + "</" + this.name + ">";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    hasClass : function(klass){
      return this.attrs.hasClass(klass);
    },
    /**
       @memberof Nehan.Tag
       @param name {String}
       @return {boolean}
    */
    hasAttr : function(name){
      return this.attrs.hasAttr(name);
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isHeaderTag : function(){
      return List.exists(["h1", "h2", "h3", "h4", "h5", "h6"], Closure.eq(this.name));
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    /**
       @memberof Nehan.Tag
    */
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isPageBreakTag : function(){
      return this.name === "page-break" || this.name === "end-page" || this.name === "pbr";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isCloseTag : function(){
      return this.name.charAt(0) === "/";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isSingleTag : function(){
      return this._single || false;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isEmpty : function(){
      return this.content === "";
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isFirstChild : function(){
      return this._firstChild;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isOnlyChild : function(){
      return this._onlyChild;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isOnlyOfType : function(){
      return this._onlyOfType;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isFirstOfType : function(){
      return this._firstOfType;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isLastChild : function(){
      return this._lastChild;
    },
    /**
       @memberof Nehan.Tag
       @return {boolean}
    */
    isLastOfType : function(){
      return this._lastOfType;
    },
    _getTagAttrSrc : function(src){
      return src
	.replace(/<[\S]+/, "") // cut tag start
	.replace(/^\s+/, "") // cut head space
	.replace("/>", "") // cut tag tail(single tag)
	.replace(">", "") // cut tag tail(normal tag)
	.replace(/\s+$/, "") // cut tail space
	.replace(/\n/g, " ") // conv from multi line to single space
	.replace(/[　|\s]+/g, " ") // conv from multi space to single space
	.replace(/\s+=/g, "=") // cut multi space before '='
	.replace(/=\s+/g, "="); // cut multi space after '='
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
    },
    _parseTagAttrs : function(tag_name, tag_src){
      var attr_src = this._getTagAttrSrc(tag_src);
      if(tag_name.length === attr_src.length){
	return new TagAttrs("");
      }
      return new TagAttrs(attr_src);
    }
  };

  return Tag;
})();

