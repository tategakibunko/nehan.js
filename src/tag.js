// Important Notice:
// to avoid name-conflicts about existing name space of stylesheet,
// all class names and id in nehan.js are forced to be prefixed by "nehan-".
var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attrs = this._parseTagAttrs(this.name, this.src);
  }

  Tag.prototype = {
    clone : function(){
      return new Tag(this.src, this.content);
    },
    setContent : function(content){
      if(this._fixed){
	return;
      }
      this.content = content;
    },
    setContentImmutable : function(status){
      this._fixed = status;
    },
    setAlias : function(name){
      this.alias = name;
    },
    setAttr : function(name, value){
      this.attrs.setAttr(name, value);
    },
    setData : function(name, value){
      this.attrs.setData(name, value);
    },
    addClass : function(klass){
      this.attrs.addClass(klass);
    },
    removeClass : function(klass){
      this.attrs.removeClass(klass);
    },
    getId : function(){
      return this.attrs.id;
    },
    getClasses : function(){
      return this.attrs.classes;
    },
    getClassesRaw : function(){
      return this.attrs.getClassesRaw();
    },
    getName : function(){
      return this.alias || this.name;
    },
    getAttr : function(name, def_value){
      return this.attrs.getAttr(name, def_value);
    },
    getData : function(name, def_value){
      return this.attrs.getData(name, def_value);
    },
    getContent : function(){
      return this.content;
    },
    getSrc : function(){
      return this.src;
    },
    getWrapSrc : function(){
      if(this.content === ""){
	return this.src;
      }
      return this.src + this.content + "</" + this.name + ">";
    },
    hasClass : function(klass){
      return this.attrs.hasClass(klass);
    },
    hasAttr : function(name){
      return this.attrs.hasAttr(name);
    },
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    isCloseTag : function(){
      return this.name.charAt(0) === "/";
    },
    isSingleTag : function(){
      return this._single || false;
    },
    isEmpty : function(){
      return this.content === "";
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
      if(tag_name.length + 2 === attr_src.length){
	return new TagAttrs("");
      }
      return new TagAttrs(attr_src);
    }
  };

  return Tag;
})();

