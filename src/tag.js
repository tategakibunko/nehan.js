var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this.src = src;
    this.name = this._parseName(this.src);
    this.parent = null;
    this.contentRaw = content || "";
    this.dataset = {};
    this.tagAttr = {};
    this.cssAttrContext = {};
    this.cssAttrDynamic = {}; // updated by 'setCssAttr'.
    this.childs = []; // updated by inherit

    this.tagAttr = this._parseTagAttr(this.src);
    this.id = this._parseId();
    this.classes = this._parseClasses();
    this.selectors = this._parseSelectors(this.id, this.classes);
    this.cssAttrContext = this._parseCssAttr(this.selectors);
  }

  // name and value regexp
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // utility functions
  var css_attr_cache = {};
  var add_css_attr_cache = function(key, value){
    css_attr_cache[key] = value;
  };
  var get_css_attr_cache = function(key){
    return css_attr_cache[key] || null;
  };

  Tag.prototype = {
    // copy parent settings in 'markup' level
    inherit : function(parent_tag){
      if(this._inherited){
	return; // avoid duplicate initialize
      }
      var self = this;
      this.parent = parent_tag;
      this.parent.addChild(this);
      if(parent_tag.getName() != "body"){
	var prev_selector_size = this.selectors.length;
	var parent_selectors = parent_tag.getSelectors();
	var ctx_selectors = this._parseContextSelectors(parent_selectors);
	this.selectors = this.selectors.concat(ctx_selectors);
	if(this.selectors.length > prev_selector_size){
	  this.cssAttrContext = this._parseCssAttr(this.selectors); // update style by new selector list
	}
      }
      // copy 'inherit' value from parent.
      for(var prop in this.cssAttrContext){
	if(this.cssAttrContext[prop] === "inherit"){
	  this.setCssAttr(prop, parent_tag.getAttr(prop));
	}
      }
      this.fullSelectorCacheKey = this._getCssCacheKey(this.selectors);
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
    setFirstChild : function(){
      var css = this.getPseudoClassCssAttr("first-child");
      this.setCssAttrs(css);
    },
    setFirstLetter : function(){
      var cache_key = this.getDataset("key");
      var cache = get_css_attr_cache(cache_key);
      if(cache){
	this.setCssAttrs(cache);
      }
    },
    addChild : function(tag){
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
    iterCssAttrContext : function(fn){
      List.each(this.cssAttrContext, fn);
    },
    iterCssAttr : function(fn){
      this.iterCssAttrContext(fn);
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
    getPseudoClassCssAttr : function(class_name){
      var selectors = this._parsePseudoClassSelectors(class_name);
      return this._parseCssAttr(selectors);
    },
    getPseudoElementCssAttr : function(element_name){
      var selectors = this._parsePseudoElementSelectors(element_name);
      return this._parseCssAttr(selectors);
    },
    getSelectors : function(){
      return this.selectors;
    },
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getTagAttr : function(name, def_value){
      return this.tagAttr[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getCssAttr : function(name, def_value){
      return this.cssAttrDynamic[name] || this.cssAttrContext[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    // used for property that could be contructed with multiple values such as margin(start/end/before/after).
    // for example, when we get "margin" of some target,
    // we read style from default css, and context selector css, and inline style,
    // and we must 'merge' them to get strict style settings.
    getCssAttrs : function(name, def_value){
      return List.fold([this.cssAttrContext, this.cssAttrDynamic], [], function(ret, target){
	if(typeof target[name] !== "undefined"){
	  ret.push(target[name]);
	}
	return ret;
      });
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
      // if img tag size not defined, treat it as character size icon.
      // so, if basic font size is 16px, you can write <img src='/path/to/icon'>
      // instead of writing <img src='/path/to/icon' width='16' height='16'>
      if(this.name === "img"){
	var icon_size = Layout.fontSize;
	return new BoxSize(icon_size, icon_size);
      }
      return null;
    },
    getBoxEdge : function(flow, font_size, max_measure){
      var padding = this.getCssAttr("padding");
      var margin = this.getCssAttr("margin");
      var border_width = this.getCssAttr("border-width");
      var border_color = this.getCssAttr("border-color");
      var border_style = this.getCssAttr("border-style");
      var border_radius = this.getCssAttr("border-radius");
      if(padding === null &&
	 margin === null &&
	 border_width === null &&
	 border_radius === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	var padding_size = UnitSize.getEdgeSize(padding, font_size);
	edge.setSize("padding", flow, padding_size);
      }
      if(margin){
	var margin_size = UnitSize.getEdgeSize(margin, font_size);
	edge.setSize("margin", flow, margin_size);
      }
      if(border_width){
	var border_width_size = UnitSize.getEdgeSize(border_width, font_size);
	edge.setSize("border", flow, border_width_size);
      }
      if(border_radius){
	var border_radius_size = UnitSize.getCornerSize(border_radius, font_size);
	edge.setBorderRadius(flow, border_radius_size);
      }
      if(border_color){
	edge.setBorderColor(flow, border_color);
      }
      if(border_style){
	edge.setBorderStyle(flow, border_style);
      }
      return edge;
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
    _getChildIndexFrom : function(childs){
      var self = this;
      return List.indexOf(childs, function(tag){
	return Token.isSame(self, tag);
      });
    },
    getChildNth : function(){
      return this._getChildIndexFrom(this.getParentChilds());
    },
    getLastChildNth : function(){
      return this._getChildIndexFrom(List.reverse(this.getParentChilds()));
    },
    getChildOfTypeNth : function(){
      return this._getChildIndexFrom(this.getParentTypeChilds());
    },
    getLastChildOfTypeNth : function(){
      return this._getChildIndexFrom(this.getParentTypeChilds());
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
      return (childs.length === 1 && Token.isSame(childs[0], this));
    },
    isRoot : function(){
      return this.parent === null;
    },
    isEmpty : function(){
      return this.getContent() === "";
    },
    _getCssCacheKey : function(selectors){
      return selectors.join("*");
    },
    _getPseudoElementCssCacheKey : function(element_name){
      return [this.fullSelectorCacheKey, element_name].join("::");
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
    // <p id='foo' class='hi hey'>
    // => ["p", "p.hi", "p.hey", "p#foo"]
    _parseSelectors : function(id, classes){
      var tag_name = this.getName();
      var basic_selector = [tag_name];
      var class_selectors = List.map(classes, function(class_name){
	return tag_name + "." + class_name;
      });
      var id_selector = id? [tag_name + "#" + id] : [];
      return basic_selector.concat(class_selectors).concat(id_selector);
    },
    // parent_keys: ["div", "div.parent"]
    // child_keys: ["p", "p.child"]
    // =>["div p", "div p.child", "div.parent p", "div.parent p.child"]
    _parseContextSelectors : function(parent_selectors){
      var child_selectors = this.selectors;
      return List.fold(parent_selectors, [], function(ret1, parent_key){
	return ret1.concat(List.fold(child_selectors, [], function(ret2, child_key){
	  return ret2.concat([parent_key + " " + child_key]);
	}));
      });
    },
    // if class_name is "first-child",
    // and this.selectors is ["p", "p.hoge"]
    // => ["p:first-child", "p.hoge:first-child"]
    _parsePseudoClassSelectors : function(class_name){
      return List.map(this.selectors, function(key){
	return key + ":" + class_name;
      });
    },
    // if element_name is "before",
    // and this.selectors is ["p", "p.hoge"]
    // => ["p::before", "p.hoge::before"]
    _parsePseudoElementSelectors : function(element_name){
      return List.map(this.selectors, function(key){
	return key + "::" + element_name;
      });
    },
    _parseCssAttr : function(selectors){
      var cache_key = this._getCssCacheKey(selectors);
      var cache = get_css_attr_cache(cache_key);
      if(cache === null){
	cache = Selectors.getMergedValue(selectors);
	add_css_attr_cache(cache_key, cache);
      }
      return cache;
    },
    _parsePseudoElementContentSrc : function(element_name){
      var css_attr = this.getPseudoElementCssAttr(element_name);
      if(Obj.isEmpty(css_attr)){
	return "";
      }
      var cache_key = this._getPseudoElementCssCacheKey(element_name);
      add_css_attr_cache(css_attr);
      var content = css_attr.content || "";
      return Html.tagWrap(element_name, content, {"data-key":cache_key});
    },
    _appendFirstLetter : function(content){
      var css_attr = this.getPseudoElementCssAttr("first-letter");
      if(Obj.isEmpty(css_attr)){
	return content;
      }
      var cache_key = this._getPseudoElementCssCacheKey(this.selectors, "first-letter");
      add_css_attr_cache(cache_key, css_attr);
      return content.replace(rex_first_letter, function(match, p1, p2, p3){
	return p1 + Html.tagStart("first-letter", {"data-key":cache_key}) + p3 + "</first-letter>";
      });
    },
    _parseContent : function(content_raw){
      var before = this._parsePseudoElementContentSrc("before");
      var after = this._parsePseudoElementContentSrc("after");
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

