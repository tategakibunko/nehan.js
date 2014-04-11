var Tag = (function (){
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  var is_inline_style_not_allowed = function(name){
    return List.exists(["padding", "margin", "border"], function(prop){
      return name.indexOf(prop) >= 0;
    });
  };

  function Tag(src, content_raw){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this.src = src;
    this.contentRaw = content_raw || "";
    this.name = this._parseName(this.src);
    this.tagAttr = TagAttrParser.parse(this.src);
    this.id = this.tagAttr.id || "";
    this.classes = this._parseClasses(this.tagAttr["class"] || "");
    this.dataset = {}; // dataset with no "data-" prefixes => {id:"10", name:"taro"} 
    this.datasetRaw = {}; // dataset with "data-" prefixes => {"data-id":"10", "data-name":"taro"}
    this.cssAttrStatic = {}; // updated when 'inherit' called from StyleContext constructor.
    this.cssAttrDynamic = {}; // added by setCssAttr

    // initialize inline-style value
    if(this.tagAttr.style){
      this._parseInlineStyle(this.tagAttr.style || "");
    }
    this._parseDataset(); // initialize data-set values
  }

  Tag.prototype = {
    initSelector : function(style){
      // avoid duplicate initialize
      if(this._initialized){
	return this;
      }
      this.cssAttrStatic = this._getSelectorValue(style); // reget css-attr with parent enabled.
      this._initialized = true;
      return this;
    },
    clone : function(){
      return new Tag(this.src, this.contentRaw);
    },
    setContentRaw : function(content_raw){
      this.contentRaw = content_raw;
    },
    setTagAttr : function(name, value){
      this.tagAttr[name] = value;
    },
    setCssAttr : function(name, value){
      this.cssAttrDynamic[name] = value;
    },
    setCssAttrs : function(obj){
      for(var prop in obj){
	this.setCssAttr(prop, obj[prop]);
      }
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
      var ret = this.getTagAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      ret = this.getCssAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getTagAttr : function(name, def_value){
      var ret = this.tagAttr[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getCssAttr : function(name, def_value){
      var ret = this.cssAttrDynamic[name];
      if(typeof ret !== "undefined"){
	return ret;
      }
      ret = this.cssAttrStatic[name];
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
    isTcyTag : function(){
      return this.getCssAttr("text-combine", "") === "horizontal";
    },
    isSectionRootTag : function(){
      return this.getCssAttr("section-root") === true;
    },
    isSectionTag : function(){
      return this.getCssAttr("section") === true;
    },
    isBoldTag : function(){
      var name = this.getName();
      return name === "b" || name === "strong";
    },
    isHeaderTag : function(){
      return this.getHeaderRank() > 0;
    },
    isPageBreakTag : function(){
      var name = this.getName();
      return name === "end-page" || name === "page-break";
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
      var id = this.tagAttr.id || "";
      return (id === "")? id : ((this.tagAttr.id.indexOf("nehan-") === 0)? "nehan-" + id : id);
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
    // "border:0; margin:0"
    // => {border:0, margin:0}
    _parseInlineStyle : function(src){
      var dynamic_attr = this.cssAttrDynamic;
      var stmts = (src.indexOf(";") >= 0)? src.split(";") : [src];
      List.iter(stmts, function(stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]).toLowerCase();
	  if(!is_inline_style_not_allowed(prop)){
	    var value = Utils.trim(nv[1]);
	    dynamic_attr[prop] = value;
	  }
	}
      });
    },
    _parseDataset : function(){
      for(var name in this.tagAttr){
	if(name.indexOf("data-") === 0){
	  var dataset_name = this._parseDatasetName(name);
	  var dataset_value = this.tagAttr[name];
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

