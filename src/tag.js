// Important Notice:
// to avoid name-conflicts about existing name space of stylesheet,
// all class names and id in nehan.js are forced to be prefixed by "nehan-".
var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attrs = TagAttrParser.parse(this.src);
    this.id = this._parseId(this.attrs["id"] || ""); // add "nehan-" prefix if not started with "nehan-".
    this.classes = this._parseClasses(this.attrs["class"] || ""); // add "nehan-" prefix for each class if not started with "nehan-".
  }

  Tag.prototype = {
    clone : function(){
      return new Tag(this.src, this.content);
    },
    setContent : function(content){
      this.content = content;
    },
    setAlias : function(name){
      this.alias = name;
    },
    addClass : function(klass){
      this.classes.push(klass);
    },
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
    },
    getName : function(){
      return this.alias || this.name;
    },
    getAttr : function(name, def_value){
      var ret = this.attrs[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    setAttr : function(name, value){
      this.attrs[name] = value;
    },
    setDataBySneakName : function(sneak_name, value){
      this.dataset.setBySneakName(sneak_name, value);
    },
    getDataBySneakName : function(sneak_name){
      return this.dataset.getBySneakName(sneak_name);
    },
    // getDataset('familyName') => 'yamada'
    getDataByCamelName : function(camel_name){
      return this.dataset.getByCamelName(camel_name);
    },
    iterDatasetByCamelName : function(fn){
      this.dataset.iterByCamelName(fn);
    },
    iterDatasetBySneakName : function(fn){
      this.dataset.iterBySneakName(fn);
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
      return List.exists(this.classes, Closure.eq(klass));
    },
    hasAttr : function(name){
      return (typeof this.attrs.name !== "undefined");
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
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
    },
    // <p id='foo'>
    // => "nehan-foo"
    _parseId : function(id_value){
      return id_value? ((id_value.indexOf("nehan-") < 0)? "nehan-" + id_value : id_value) : null;
    },
    // <p class='hi hey'>
    // => ["nehan-hi", "nehan-hey"]
    _parseClasses : function(class_value){
      class_value = Utils.trim(class_value.replace(/\s+/g, " "));
      var classes = (class_value === "")? [] : class_value.split(/\s+/);
      return List.map(classes, function(klass){
	return (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      });
    },
    // <p class='hi hey'>
    // => [".nehan-hi", ".nehan-hey"]
    _parseCssClasses : function(classes){
      return List.map(classes, function(class_name){
	return "." + class_name;
      });
    }
  };

  return Tag;
})();

