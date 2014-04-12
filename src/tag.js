var Tag = (function (){
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;

  function Tag(src, content_raw){
    this._type = "tag";
    this.src = src;
    this.contentRaw = content_raw || "";
    this.name = this._parseName(this.src);
    this.attr = TagAttrParser.parse(this.src);
    this.id = this._parseId(); // add "nehan-" prefix if not started with "nehan-".
    this.classes = this._parseClasses(this.attr["class"] || "");
    this.dataset = {}; // dataset with no "data-" prefixes => {id:"10", name:"taro"} 
    this.datasetRaw = {}; // dataset with "data-" prefixes => {"data-id":"10", "data-name":"taro"}
    this._parseDataset(); // initialize data-set values
  }

  Tag.prototype = {
    clone : function(){
      return new Tag(this.src, this.contentRaw);
    },
    setContentRaw : function(content_raw){
      this.contentRaw = content_raw;
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
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getAttr : function(name, def_value){
      var ret = this.attr[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getDataset : function(name, def_value){
      var ret = this.dataset[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    // dataset name and value object => {id:xxx, name:yyy}
    getDatasetAttrs : function(){
      return this.dataset;
    },
    // dataset name(with "data-" prefix) and value object => {"data-id":xxx, "data-name":yyy}
    getDatasetAttrsRaw : function(){
      return this.datasetRaw;
    },
    getContentRaw : function(){
      return this.contentRaw;
    },
    getContent : function(style){
      var before = this._getPseudoBefore(style);
      var after = this._getPseudoAfter(style);
      var content = this._setPseudoFirst(style, [before, this.contentRaw, after].join(""));
      return content;
    },
    getSrc : function(){
      return this.src;
    },
    getWrapSrc : function(){
      if(this.contentRaw === ""){
	return this.src;
      }
      return this.src + this.contentRaw + "</" + this.name + ">";
    },
    getHeaderRank : function(){
      if(this.getName().match(/h([1-6])/)){
	return parseInt(RegExp.$1, 10);
      }
      return 0;
    },
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    hasAttr : function(name){
      return (typeof this.attr.name !== "undefined");
    },
    hasPseudoElement : function(){
      return this.name === "before" || this.name === "after" || this.name === "first-letter" || this.name === "first-line";
    },
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    isEmpty : function(){
      return this.contentRaw === "";
    },
    _getSelectorValue : function(style){
      if(this.hasPseudoElement()){
	return Selectors.getValuePe(style.parent || null, this.getName());
      }
      return Selectors.getValue(style);
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
    _setPseudoFirst : function(style, content){
      var first_letter = Selectors.getValuePe(style, "first-letter");
      content = Obj.isEmpty(first_letter)? content : this._setPseudoFirstLetter(content);
      var first_line = Selectors.getValuePe(style, "first-line");
      return Obj.isEmpty(first_line)? content : this._setPseudoFirstLine(content);
    },
    _setPseudoFirstLetter : function(content){
      return content.replace(rex_first_letter, function(match, p1, p2, p3){
	return p1 + Html.tagWrap("first-letter", p3);
      });
    },
    _setPseudoFirstLine : function(content){
      return Html.tagWrap("first-line", content);
    },
    _getPseudoBefore : function(style){
      var attr = Selectors.getValuePe(style, "before");
      return Obj.isEmpty(attr)? "" : Html.tagWrap("before", attr.content || "");
    },
    _getPseudoAfter : function(style){
      var attr = Selectors.getValuePe(style, "after");
      return Obj.isEmpty(attr)? "" : Html.tagWrap("after", attr.content || "");
    },
    _parseDataset : function(){
      for(var name in this.attr){
	if(name.indexOf("data-") === 0){
	  var dataset_name = this._parseDatasetName(name);
	  var dataset_value = this.attr[name];
	  this.dataset[dataset_name] = dataset_value;
	  this.datasetRaw[name] = dataset_value;
	}
      }
    },
    // "data-name" => "name"
    // "data-family-name" => "familyName"
    _parseDatasetName : function(prop){
      var hyp_name = prop.slice(5); // 5 is "data-".length
      return Utils.getCamelName(hyp_name);
    }
  };

  return Tag;
})();

