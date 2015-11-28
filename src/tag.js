// Important Notice:
// to avoid name-conflicts about existing name space of stylesheet,
// all class names and id in nehan.js are forced to be prefixed by "nehan-".
Nehan.Tag = (function (){
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
    this._key = this._createKey();
    this._firstChild = false;
    this._firstOfType = false;
    this._lastChild = false;
    this._lastOfType = false;
    this._onlyChild = false;
    this._onlyOfType = false;
  }

  /**
   @memberof Nehan.Tag
   @return {Nehan.Tag}
   */
  Tag.prototype.clone = function(){
    return new Tag(this.src, this.content);
  };
  /**
   @memberof Nehan.Tag
   @param content {String}
   */
  Tag.prototype.setContent = function(content){
    if(this._fixed){
      return;
    }
    this.content = content;
  };
  /**
   @memberof Nehan.Tag
   @param status {boolean}
   */
  Tag.prototype.setContentImmutable = function(status){
    this._fixed = status;
  };
  /**
   @memberof Nehan.Tag
   @param name {String} - alias markup name
   */
  Tag.prototype.setAlias = function(name){
    this.alias = name;
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param value {attribute_value}
   */
  Tag.prototype.setAttr = function(name, value){
    this.attrs.setAttr(name, value);
  };
  /**
   @memberof Nehan.Tag
   @param attrs {Object}
   */
  Tag.prototype.setAttrs = function(attrs){
    for(var name in attrs){
      this.setAttr(name, attrs[name]);
    }
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param value {dataset_value}
   */
  Tag.prototype.setData = function(name, value){
    this.attrs.setData(name, value);
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setFirstChild = function(status){
    this._firstChild = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setOnlyChild = function(status){
    this._onlyChild = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setOnlyOfType = function(status){
    this._onlyOfType = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setFirstOfType = function(status){
    this._firstOfType = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setLastChild = function(status){
    this._lastChild = status;
  };
  /**
   @memberof Nehan.Tag
   @param status {Bool}
   */
  Tag.prototype.setLastOfType = function(status){
    this._lastOfType = status;
  };
  /**
   @memberof Nehan.Tag
   @param klass {String}
   */
  Tag.prototype.addClass = function(klass){
    this.attrs.addClass(klass);
  };
  /**
   @memberof Nehan.Tag
   @param klass {String}
   */
  Tag.prototype.removeClass = function(klass){
    this.attrs.removeClass(klass);
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getId = function(){
    return this.attrs.getAttr("id");
  };
  /**
   @memberof Nehan.Tag
   @return {Array.<String>}
   */
  Tag.prototype.getClasses = function(){
    return this.attrs.classes;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getName = function(){
    return this.alias || this.name;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getPath = function(){
    var path = this.getName();
    var id = this.getId();
    if(id){
      path += "#" + id;
    }
    var classes = this.getClasses();
    if(classes.length > 0){
      path += "." + classes.join(".");
    }
    return path;
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param def_value {default_value}
   @return {attribute_value}
   */
  Tag.prototype.getAttr = function(name, def_value){
    return this.attrs.getAttr(name, def_value);
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @param def_value {default_value}
   @return {dataset_value}
   */
  Tag.prototype.getData = function(name, def_value){
    return this.attrs.getData(name, def_value);
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getContent = function(){
    return this.content;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getSrc = function(){
    return this.src;
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getWrapSrc = function(){
    if(this.content === ""){
      return this.src;
    }
    return this.src + this.content + "</" + this.name + ">";
  };
  /**
   @memberof Nehan.Tag
   @return {String}
   */
  Tag.prototype.getKey = function(){
    return this._key;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.hasClass = function(klass){
    return this.attrs.hasClass(klass);
  };
  /**
   @memberof Nehan.Tag
   @param name {String}
   @return {boolean}
   */
  Tag.prototype.hasAttr = function(name){
    return this.attrs.hasAttr(name);
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isHeaderTag = function(){
    return Nehan.List.exists(["h1", "h2", "h3", "h4", "h5", "h6"], Nehan.Closure.eq(this.name));
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isAnchorTag = function(){
    return this.name === "a" && this.getTagAttr("name") !== null;
  };
  /**
   @memberof Nehan.Tag
   */
  Tag.prototype.isAnchorLinkTag = function(){
    var href = this.getTagAttr("href");
    return this.name === "a" && href && href.indexOf("#") >= 0;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isPageBreakTag = function(){
    return this.name === "page-break" || this.name === "end-page" || this.name === "pbr";
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isCloseTag = function(){
    return this.name.charAt(0) === "/";
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isSingleTag = function(){
    return this._single || false;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isEmpty = function(){
    return this.content === "";
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isFirstChild = function(){
    return this._firstChild;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isOnlyChild = function(){
    return this._onlyChild;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isOnlyOfType = function(){
    return this._onlyOfType;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isFirstOfType = function(){
    return this._firstOfType;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isLastChild = function(){
    return this._lastChild;
  };
  /**
   @memberof Nehan.Tag
   @return {boolean}
   */
  Tag.prototype.isLastOfType = function(){
    return this._lastOfType;
  };

  Tag.prototype._getTagAttrSrc = function(src){
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
  };

  Tag.prototype._createKey = function(){
    return this.getName() + "[" + this.attrs.getKey() + "]";
  };

  Tag.prototype._parseName = function(src){
    return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
  };

  Tag.prototype._parseTagAttrs = function(tag_name, tag_src){
    var attr_src = this._getTagAttrSrc(tag_src);
    if(tag_name.length === attr_src.length){
      return new Nehan.TagAttrs("");
    }
    return new Nehan.TagAttrs(attr_src);
  };

  return Tag;
})();

