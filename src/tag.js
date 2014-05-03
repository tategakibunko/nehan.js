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
    this.dataset = this._parseDataset(this.attrs);
    this.id = this._parseId(this.attrs["id"] || ""); // add "nehan-" prefix if not started with "nehan-".
    this.classes = this._parseClasses(this.attrs["class"] || ""); // add "nehan-" prefix for each class if not started with "nehan-".
    this.attrs["class"] = this.classes.join(" ");
    if(this.id){
      this.attrs.id = this.id;
    }
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
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
    },
    setAttr : function(name, value){
      this.attrs[name] = value;
      if(name.indexOf("data-") === 0){
	this.dataset[this._parseDataName(name)] = value;
      }
    },
    getData : function(name){
      return this.dataset[name] || null;
    },
    setData : function(name, value){
      this.dataset[name] = value;
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
    },
    _parseDataset : function(attrs){
      var dataset = {};
      for(var name in attrs){
	if(name.indexOf("data-") === 0){
	  dataset[this._parseDataName(name)] = attrs[name];
	}
      }
      return dataset;
    },
    _parseDataName : function(name){
      return Utils.camelize(name.slice(5));
    }
  };

  return Tag;
})();

