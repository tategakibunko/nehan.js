var Tag = (function (){
  var global_tag_id = 0;
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  var css_attr_cache = {};
  var add_css_attr_cache = function(key, value){
    css_attr_cache[key] = value;
  };
  var get_css_attr_cache = function(key){
    return css_attr_cache[key] || null;
  };
  function Tag(src, content){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this._gtid = global_tag_id++;
    this.src = src;
    this.name = this._parseName(this.src);
    this.parent = null;
    this.contentRaw = content || "";
    this.dataset = {};
    this.tagAttr = {};
    this.cssAttrStatic = {}; // initialized by 'inheritTag'.
    this.cssAttrDynamic = {}; // updated by 'setCssAttr'.
    this.childs = []; // updated by inherit
    this.next = null;
    this.tagAttr = this._parseTagAttr(this.src);
    this.id = this._parseId();
    this.classes = this._parseClasses();
  }

  Tag.prototype = {
    // copy parent settings in 'markup' level
    inherit : function(parent_tag){
      if(this._inherited || !this.hasLayout()){
	return; // avoid duplicate initialize
      }
      //console.log("%s inherit from %s", this.src, parent_tag.src);
      var self = this;
      var cache_key = this.getCssCacheKey(parent_tag);
      this.parent = parent_tag;
      this.parent.addChild(this);
      this.cssAttrStatic = this._parseCssAttr(cache_key);
      // copy 'inherit' value from parent.
      for(var prop in this.cssAttrStatic){
	if(this.cssAttrStatic[prop] === "inherit"){
	  this.setCssAttr(prop, parent_tag.getAttr(prop));
	}
      }
      this._inherited = true;
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
    setFirstLetter : function(){
      // TODO
    },
    setNext : function(tag){
      this.next = tag;
    },
    addChild : function(tag){
      if(this.childs.length > 0){
	List.last(this.childs).setNext(tag);
      }
      this.childs.push(tag);
    },
    addClass : function(klass){
      this.classes.push(klass);
    },
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
    },
    iterTagAttr : function(fn){
      List.each(this.tagAttr, fn);
    },
    iterCssAttrDynamic : function(fn){
      List.each(this.cssAttrDynamic, fn);
    },
    iterCssAttrStatic : function(fn){
      List.each(this.cssAttrStatic, fn);
    },
    iterCssAttr : function(fn){
      this.iterCssAttrStatic(fn);
      this.iterCssAttrDynamic(fn); // dynamic attrs prior to static ones.
    },
    iterAttr : function(fn){
      this.iterCssAttr(fn);
      this.iterTagAttr(fn); // inline attrs prior to css attrs.
    },
    getName : function(){
      return this.name;
    },
    getAttr : function(name, def_value){
      return this.getTagAttr(name) || this.getCssAttr(name) || ((typeof def_value !== "undefined")? def_value : null);
    },
    getParent : function(){
      return this.parent || null;
    },
    getChilds : function(){
      return this.childs;
    },
    getNext : function(){
      return this.next || null;
    },
    getParentChilds : function(){
      return this.parent? this.parent.getChilds() : [];
    },
    getParentTypeChilds : function(){
      var name = this.getName();
      return List.filter(this.getParentChilds(), function(tag){
	return tag.getName() === name;
      });
    },
    getOrder : function(){
      return this.order || -1;
    },
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getTagAttr : function(name, def_value){
      return this.tagAttr[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getCssAttr : function(name, def_value){
      return this.cssAttrDynamic[name] || this.cssAttrStatic[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getDataset : function(name, def_value){
      return this.dataset[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getContentRaw : function(){
      return this.contentRaw;
    },
    getContent : function(){
      if(this.content){
	return this.content;
      }
      this.content = this._parseContent(this.contentRaw);
      return this.content;
    },
    getSrc : function(){
      return this.src;
    },
    getLogicalFloat : function(){
      return this.getCssAttr("float", "none");
    },
    getHeaderRank : function(){
      if(this.getName().match(/h([1-6])/)){
	return parseInt(RegExp.$1, 10);
      }
      return 0;
    },
    getStaticSize : function(font_size, max_size){
      var width = this.getAttr("width");
      var height = this.getAttr("height");
      if(width && height){
	width = UnitSize.getBoxSize(width, font_size, max_size);
	height = UnitSize.getBoxSize(height, font_size, max_size);
	return new BoxSize(width, height);
      }
      // if size of img is not defined, treat it as character size icon.
      // so, if basic font size is 16px, you can write <img src='/path/to/icon'>
      // instead of writing <img src='/path/to/icon' width='16' height='16'>
      if(this.name === "img"){
	var icon_size = Layout.fontSize;
	return new BoxSize(icon_size, icon_size);
      }
      return null;
    },
    hasStaticSize : function(){
      return (this.getAttr("width") !== null && this.getAttr("height") !== null);
    },
    hasFlow : function(){
      return this.getCssAttr("flow") !== null;
    },
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    hasLayout : function(){
      var name = this.getName();
      return (name != "br" && name != "page-break" && name != "end-page");
    },
    isPseudoElement : function(){
      return this.name === "before" || this.name === "after" || this.name === "first-letter" || this.name === "first-line";
    },
    isClassAttrEnable : function(){
      return (typeof this.tagAttr["class"] != "undefined");
    },
    isFloated : function(){
      return this.getLogicalFloat() != "none";
    },
    isPush : function(){
      return (typeof this.tagAttr.push != "undefined");
    },
    isPull : function(){
      return (typeof this.tagAttr.pull != "undefined");
    },
    isClose : function(){
      return this.name.substring(0,1) === "/";
    },
    isAnchorTag : function(){
      return this.name === "a" && this.getTagAttr("name") !== null;
    },
    isAnchorLinkTag : function(){
      var href = this.getTagAttr("href");
      return this.name === "a" && href && href.indexOf("#") >= 0;
    },
    isEmbeddableTag : function(){
      return this.getCssAttr("embeddable") === "true";
    },
    isBlock : function(){
      // floated block with static size is treated as block level floated box.
      if(this.hasStaticSize() && this.isFloated()){
	return true;
      }
      if(this.isPush() || this.isPull()){
	return true;
      }
      return this.getCssAttr("display", "inline") === "block";
    },
    isInline : function(){
      var display = this.getCssAttr("display", "inline");
      return (display === "inline" || display === "inline-block");
    },
    isInlineBlock : function(){
      return this.getCssAttr("display", "inline") === "inline-block";
    },
    isSingleTag : function(){
      return this.getCssAttr("single") === "true";
    },
    isChildContentTag : function(){
      if(this.isSingleTag()){
	return false;
      }
      return true;
    },
    isTcyTag : function(){
      return this.getCssAttr("text-combine", "") === "horizontal";
    },
    isSectionRootTag : function(){
      return this.getCssAttr("section-root") === "true";
    },
    isSectionTag : function(){
      return this.getCssAttr("section") === "true";
    },
    isBoldTag : function(){
      var name = this.getName();
      return name === "b" || name === "strong";
    },
    isHeaderTag : function(){
      return this.getHeaderRank() > 0;
    },
    // check if 'single' page-break-tag
    // not see page-break-xxx:'always'
    isPageBreakTag : function(){
      var name = this.getName();
      return name === "end-page" || name === "page-break";
    },
    isSameTag : function(dst){
      return this._gtid === dst._gtid;
    },
    // <p id='foo' class='hi hey'>
    // => ["p", "p.hi", "p.hey", "p#foo"]
    getTagKeys : function(){
      var tag_name = this.getName();
      var keys = [tag_name];
      var class_keys = List.map(this.classes, function(class_name){
	return tag_name + "." + class_name;
      });
      var id_keys = this.id? [tag_name + "#" + this.id] : [];
      return keys.concat(class_keys).concat(id_keys);
    },
    // parent_keys: ["div", "div.parent"]
    // child_keys: ["p", "p.child"]
    // =>["div p", "div p.child", "div.parent p", "div.parent p.child"]
    getContextTagKeys : function(parent){
      var parent_keys = parent.getTagKeys();
      var child_keys = this.getTagKeys();
      return List.fold(parent_keys, [], function(ret1, parent_key){
	return ret1.concat(List.fold(child_keys, [], function(ret2, child_key){
	  return ret2.concat([parent_key + " " + child_key]);
	}));
      });
    },
    getCssCacheKey : function(parent){
      return this.getContextTagKeys(parent).join("*");
    },
    getChildIndexFrom : function(childs){
      var self = this;
      return List.indexOf(childs, function(tag){
	return self.isSameTag(tag);
      });
    },
    getChildNth : function(){
      return this.getChildIndexFrom(this.getParentChilds());
    },
    getLastChildNth : function(){
      return this.getChildIndexFrom(List.reverse(this.getParentChilds()));
    },
    getChildOfTypeNth : function(){
      return this.getChildIndexFrom(this.getParentTypeChilds());
    },
    getLastChildOfTypeNth : function(){
      return this.getChildIndexFrom(this.getParentTypeChilds());
    },
    isFirstChild : function(){
      return this.getChildNth() === 0;
    },
    isLastChild : function(){
      var childs = this.getParentChilds();
      return this.getChildNth() === (childs.length - 1);
    },
    isFirstOfType : function(){
      return this.getChildOfTypeNth() === 0;
    },
    isLastOfType : function(){
      var childs = this.getParentTypeChilds();
      return this.getChildOfTypeNth() === (childs.length - 1);
    },
    isOnlyChild : function(){
      return this.getParentChilds().length === 1;
    },
    isOnlyOfType : function(){
      var childs = this.getParentTypeChilds();
      return (childs.length === 1 && this.isSame(childs[0]));
    },
    isRoot : function(){
      return this.parent === null;
    },
    isEmpty : function(){
      return this.getContent() === "";
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
    },
    _parseId : function(){
      return this.tagAttr.id || "";
    },
    // <p class='hi hey'>
    // => ["hi", "hey"]
    _parseClasses : function(){
      var str = this.tagAttr["class"] || "";
      if(str === ""){
	return [];
      }
      return str.split(/\s+/);
    },
    // <p class='hi hey'>
    // => [".hi", ".hey"]
    _parseCssClasses : function(classes){
      return List.map(classes, function(class_name){
	return "." + class_name;
      });
    },
    _parseCssAttr : function(cache_key){
      var cache = get_css_attr_cache(cache_key);
      if(cache === null){
	cache = Selectors.getValue(this);
	add_css_attr_cache(cache_key, cache);
      }
      return cache;
    },
    _appendFirstLetter : function(content){
      return content; // TODO
    },
    _parseContent : function(content_raw){
      var before = ""; // TODO
      var after = ""; // TODO
      return this._appendFirstLetter([before, content_raw, after].join(""));
    },
    // <img src='/path/to/img' push>
    // => {src:'/path/to/img', push:true}
    _parseTagAttr : function(src){
      var self = this;
      var attr = TagAttrParser.parse(this.src);
      for(var name in attr){
	// inline style
	if(name === "style"){
	  // add to dynamic css
	  var inline_css = this._parseInlineStyle(attr[name]);
	  Args.copy(this.cssAttrDynamic, inline_css);
	} else if(name.indexOf("data-") === 0){
	  // <div data-name="john">
	  // => {name:"john"}
	  var dataset_name = this._parseDatasetName(name);
	  this.dataset[dataset_name] = attr[name];
	}
      }
      return attr;
    },
    // "border:0; margin:0"
    // => {border:0, margin:0}
    _parseInlineStyle : function(src){
      var attr = {};
      var stmts = (src.indexOf(";") >= 0)? src.split(";") : [src];
      List.iter(stmts, function(stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]);
	  var val = Utils.trim(nv[1]);
	  attr[prop] = val;
	}
      });
      return attr;
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

