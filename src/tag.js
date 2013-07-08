var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this.src = src;
    this.name = this._parseName(this.src);
    this.tagAttr = {};
    this.dataset = {};
    this.cssAttrContext = {};

    // this object is updated by Tag::setCssAttr.
    // notice that this must be defined before this._parseTagAttr.
    this.cssAttrDynamic = {};

    this.tagAttr = this._parseTagAttr(this.src);
    this.id = this._parseId();
    this.classes = this._parseClasses();
    this.selectors = this._parseSelectors(this.id, this.classes);
    this.cssAttrStatic = this._parseCssAttr(this.selectors);
    this.parent = null;
    this.content = this._parseContent(content || "");
  }

  // name and value regexp
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // utility functions
  var is_style_enable = function(name, prop){
    var element = Style[name] || null;
    return element? (element[prop] || false) : false;
  };
  var is_single_tag = function(name){
    return is_style_enable(name, "single");
  };
  var is_section_tag = function(name){
    return is_style_enable(name, "section");
  };
  var is_section_root_tag = function(name){
    return is_style_enable(name, "section-root");
  };
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
      this.iterCssAttr(function(prop, val){
	if(val === "inherit"){
	  self.setCssAttr(prop, parent_tag.getAttr(prop));
	}
      });
      if(parent_tag.getName() != "body"){
	var parent_selectors = parent_tag.getSelectors();
	var ctx_selectors = this._parseContextSelectors(parent_selectors);
	this.cssAttrContext = this._parseCssAttr(ctx_selectors);
	this.selectors = this.selectors.concat(ctx_selectors);
      }
      this._inherited = true;
    },
    setContent : function(content){
      this.content = this._parseContent(content);
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
      var style = get_css_attr_cache(cache_key);
      if(style){
	this.setCssAttrs(style);
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
      return this.cssAttrDynamic[name] || this.cssAttrContext[name] || this.cssAttrStatic[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    // used for property that could be contructed with multiple values such as margin(start/end/before/after).
    // for example, when we get "margin" of some target,
    // we read style from default css, and context selector css, and inline style,
    // and we must 'merge' them to get strict style settings.
    getCssAttrs : function(name, def_value){
      return List.fold([this.cssAttrStatic, this.cssAttrContext, this.cssAttrDynamic], [], function(ret, target){
	if(typeof target[name] !== "undefined"){
	  ret.push(target[name]);
	}
	return ret;
      });
    },
    getDataset : function(name, def_value){
      return this.dataset[name] || ((typeof def_value !== "undefined")? def_value : null);
    },
    getOpenTagName : function(){
      var name = this.getName();
      return this.isClose()? name.slice(1) : name;
    },
    getContent : function(){
      return this.content;
    },
    getCloseTag : function(){
      return new Tag(this.getCloseSrc());
    },
    getCloseSrc : function(){
      if(this.isClose()){
	return this.src;
      }
      return "</" + this.getName() + ">";
    },
    getSrc : function(){
      return this.src;
    },
    getWrapSrc : function(){
      return this.src + this.content + this.getCloseSrc();
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
    isSameAs : function(name){
      if(this.alias){
	return this.alias == name;
      }
      return this.name == name;
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
    isOpen : function(){
      if(is_single_tag()){
	return false;
      }
      return this.name.substring(0,1) !== "/";
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
      return this.getCssAttr("embeddable") === true;
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
      return is_single_tag(this.getName());
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
      return is_section_root_tag(this.getName());
    },
    isSectionTag : function(){
      return is_section_tag(this.getName());
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
    _getCssCacheKey : function(selectors){
      return selectors.join(",");
    },
    _getPseudoElementCssCacheKey : function(selectors, element_name){
      return [element_name, this._getCssCacheKey(this.selectors)].join("::");
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
    _parseBeforeContent : function(){
      var pseudo_css_attr = this.getPseudoElementCssAttr("before");
      return pseudo_css_attr.content || "";
    },
    _parseAfterContent : function(){
      var pseudo_css_attr = this.getPseudoElementCssAttr("after");
      return pseudo_css_attr.content || "";
    },
    _parsePseudoFirstLetter : function(content){
      var first_letter_style = this.getPseudoElementCssAttr("first-letter");
      if(Obj.isEmpty(first_letter_style)){
	return content;
      }
      var cache_key = this._getPseudoElementCssCacheKey(this.selectors, "first-letter");
      add_css_attr_cache(cache_key, first_letter_style);
      return content.replace(rex_first_letter, function(match, p1, p2, p3){
	return p1 + Html.tagStart("::first-letter", {"data-key":cache_key}) + p3 + "</::first-letter>";
      });
    },
    _parseContent : function(content){
      var before = this._parseBeforeContent();
      var after = this._parseAfterContent();
      return this._parsePseudoFirstLetter([before, content, after].join(""));
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

