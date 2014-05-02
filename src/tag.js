var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this.src = src;
    this.content = content || "";
    this.name = this._parseName(this.src);
    this.attr = TagAttrParser.parse(this.src);
    this.id = this._parseId(); // add "nehan-" prefix if not started with "nehan-".
    this.classes = this._parseClasses(this.attr["class"] || "");
    this.datasetCamel = {}; // dataset with no "data-" prefixes, and camel case => {name:"taro", familyName:"yamada"} 
    this.datasetSneak = {}; // dataset with "data-" prefixes => {"data-name":"taro", "data-family-name":"yamada"}
    this._parseDataset(this.datasetCamel, this.datasetSneak); // parse and set data-set values
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
      var ret = this.attr[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    setAttr : function(name, value){
      this.attr[name] = value;
    },
    setDataset : function(name, value){
      this.datasetSneak[name] = value;
      this.datasetCamel[Utils.camelize(name)] = value;
    },
    // getDataset('familyName') => 'yamada'
    getDataset : function(camel_name, def_value){
      var ret = this.datasetCamel[camel_name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    // return sneak case attrs
    // => {"name":"taro", "family-name":"yamada"}
    getDatasetAttr : function(){
      return this.datasetSneak;
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
      return (typeof this.attr.name !== "undefined");
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
    _parseId : function(){
      var id = this.attr.id || "";
      return (id === "")? id : ((this.attr.id.indexOf("nehan-") === 0)? "nehan-" + id : id);
    },
    // <p class='hi hey'>
    // => ["hi", "hey"]
    _parseClasses : function(class_value){
      class_value = Utils.trim(class_value.replace(/\s+/g, " "));
      var classes = (class_value === "")? [] : class_value.split(/\s+/);
      return List.map(classes, function(klass){
	return (klass.indexOf("nehan-") === 0)? klass : "nehan-" + klass;
      });
    },
    // <p class='hi hey'>
    // => [".hi", ".hey"]
    _parseCssClasses : function(classes){
      return List.map(classes, function(class_name){
	return "." + class_name;
      });
    },
    // parse all attributes that are started by "data-", and store both to
    // 1. sneak cased dict(dataset_sneak)
    // 2. camel cased dict(dataset_camel)
    _parseDataset : function(dataset_camel, dataset_sneak){
      for(var name in this.attr){
	if(name.indexOf("data-") === 0){
	  var value = this.attr[name];
	  var sneak_name = name.slice(5); // "data-family-name" -> "family-name"
	  var camel_name = Utils.camelize(sneak_name); // "family-name" -> "familyName"
	  dataset_sneak[sneak_name] = value;
	  dataset_camel[camel_name] = value;
	}
      }
    }
  };

  return Tag;
})();

