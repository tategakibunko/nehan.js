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
    this.datasetRaw = {}; // dataset with "data-" prefixes => {"data-name":"taro", "data-family-name":"yamada"}
    this._parseDataset(this.datasetCamel, this.datasetRaw); // parse and set data-set values
  }

  Tag.prototype = {
    clone : function(){
      return new Tag(this.src, this.content);
    },
    setContent : function(content){
      this.content = content;
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
      return this.name;
    },
    getAttr : function(name, def_value){
      var ret = this.attr[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    setDataset : function(name_sneak, value){
      this.datasetRaw[name_sneak] = value;
      this.datasetCamel[Utils.camelize(name_sneak)] = value;
    },
    // get dataset by name(camel case)
    // getDataset('name') => 'taro'
    // getDataset('familyName') => 'yamada'
    getDataset : function(name, def_value){
      var ret = this.datasetCamel[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    // dataset name(with "data-" prefix) and value object => {"data-id":xxx, "data-name":yyy}
    getDatasetAttr : function(){
      return this.datasetRaw;
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
    _parseDataset : function(dataset_camel, dataset_raw){
      for(var name in this.attr){
	if(name.indexOf("data-") === 0){
	  var dataset_name = this._parseDatasetName(name); // get camel case name without data prefix.
	  var dataset_value = this.attr[name];
	  dataset_camel[dataset_name] = dataset_value; // stored as camel-case-name & value dict.
	  dataset_raw[name] = dataset_value; // stored as raw-name & value dict.
	}
      }
    },
    // "data-name" => "name"
    // "data-family-name" => "familyName"
    _parseDatasetName : function(prop){
      var hyp_name = prop.slice(5); // 5 is "data-".length
      return Utils.camelize(hyp_name);
    }
  };

  return Tag;
})();

