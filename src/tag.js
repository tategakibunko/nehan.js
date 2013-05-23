var Tag = (function (){
  function Tag(src, content){
    this._type = "tag";
    this._inherited = false; // flag to avoid duplicate inheritance
    this.src = this._preprocess(src);
    this.name = this._parseName(this.src);
    this.tagAttr = {};
    this.dataset = {};
    this.cssAttrContext = {};

    // this object is updated by Tag::setCssAttr.
    // notice that this must be defined before this._parseTagAttr.
    this.cssAttrDynamic = {};

    this.tagAttr = this._parseTagAttr(this.src);
    this.classes = this._parseClasses();
    this.selectors = this._parseSelectors(this.classes);
    this.cssAttrStatic = this._parseCssAttrWithCache(this.selectors);
    this.parent = null;
    this.content = this._parseContent(content || "");
  }

  // name and value regexp
  var rex_nv_attr = /(?:\S+)=["']?(?:(?:.(?!["']?\s+(?:\S+)=|["']))+.)["']?/g;
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // utility functions
  var is_style_enable = function(name, prop){
    var element = Style[name] || null;
    return element? (element[prop] || false) : false;
  };
  var is_single_tag = function(name){
    return is_style_enable(name, "single");
  };
  var is_child_content_tag = function(name){
    return is_style_enable(name, "child-content");
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
	this.cssAttrContext = this._parseCssAttrWithCache(ctx_selectors);
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
    setFontSizeUpdate : function(font_size){
      this.fontSize = font_size;
    },
    setFontColorUpdate : function(font_color){
      this.fontColor = font_color;
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
      return this.getTagAttr(name) || this.getCssAttr(name) || def_value || null;
    },
    getPseudoElementName : function(){
      if(this.isPseudoElementTag()){
	return this.getName().substring(1);
      }
      return "";
    },
    getPseudoCssAttr : function(pseudo_name){
      var pseudo_selectors = this._parsePseudoSelectors(pseudo_name);
      return this._parseCssAttrWithCache(pseudo_selectors);
    },
    getSelectors : function(){
      return this.selectors;
    },
    getCssClasses : function(){
      return this.classes.join(" ");
    },
    getTagAttr : function(name, def_value){
      return this.tagAttr[name] || def_value || null;
    },
    getCssAttr : function(name, def_value){
      return this.cssAttrDynamic[name] || this.cssAttrContext[name] || this.cssAttrStatic[name] || def_value || null;
    },
    getDataset : function(name, def_value){
      return this.dataset[name] || def_value || null;
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
	width = UnitSize.mapBoxSize(width, font_size, max_size);
	height = UnitSize.mapBoxSize(height, font_size, max_size);
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
      var border = this.getCssAttr("border");
      if(padding === null && margin === null && border === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	var padding_size = UnitSize.parseEdgeSize(padding, font_size, max_measure);
	edge.setSize("padding", flow, padding_size);
      }
      if(margin){
	var margin_size = UnitSize.parseEdgeSize(margin, font_size, max_measure);
	edge.setSize("margin", flow, margin_size);
      }
      if(border){
	var border_size = UnitSize.parseEdgeSize(border, font_size, max_measure);
	edge.setSize("border", flow, border_size);
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
    isPseudoTag : function(){
      return this.getName().charAt(0) === ":";
    },
    isPseudoElementTag : function(){
      var name = this.getName();
      return (name === ":first-letter" || name === ":first-line");
    },
    isEmphaTag : function(){
      return this.getCssAttr("empha-mark") !== null;
    },
    isEmbeddableTag : function(){
      return this.getCssAttr("embeddable") === true;
    },
    isBlock : function(){
      if(this.isFloated() || this.isPush() || this.isPull()){
	return true;
      }
      return this.getCssAttr("display", "inline") === "block";
    },
    isInline : function(){
      return this.getCssAttr("display", "inline") === "inline";
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
      return is_child_content_tag(this.getName());
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
    _preprocess : function(src){
      return src.replace(/\s*=\s*/g, "=");
    },
    _parseName : function(src){
      return src.replace(/</g, "").replace(/\/?>/g, "").split(/\s/)[0].toLowerCase();
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
    // <p class='hi hey'>
    // => ["p", "p.hi", "p.hey"]
    _parseSelectors : function(classes){
      var tag_name = this.getName();
      return [tag_name].concat(List.map(classes, function(class_name){
	return tag_name + "." + class_name;
      }));
    },
    // get contextual selector(so parent of parent_tag is ignored).
    // if parent_keys are ["div", "div.parent"]
    // and child_keys are ["p", , "p.child"]
    // =>["div p", "div p.child", "div.parent p", "div.parent p.child"]
    _parseContextSelectors : function(parent_selectors){
      var child_selectors = this.selectors;
      return List.fold(parent_selectors, [], function(ret1, parent_key){
	return ret1.concat(List.fold(child_selectors, [], function(ret2, child_key){
	  return ret2.concat([parent_key + " " + child_key]);
	}));
      });
    },
    _parseCssAttr : function(selectors){
      var attr = {};
      List.iter(selectors, function(key){
	Args.copy(attr, Selectors.getValue(key));
      });
      return attr;
    },
    _parseCssAttrWithCache : function(selectors){
      var cache_key = this._getCssCacheKey(selectors);
      var cache = get_css_attr_cache(cache_key);
      if(cache === null){
	cache = this._parseCssAttr(selectors);
	add_css_attr_cache(cache_key, cache);
      }
      return cache;
    },
    // if pseudo_name is "before",
    // and this.selectors is ["p", "p.hoge"]
    // => ["p:before", "p.hoge:before"]
    _parsePseudoSelectors : function(pseudo_name){
      return List.map(this.selectors, function(key){
	return key + ":" + pseudo_name;
      });
    },
    _parsePseudoContent : function(pseudo_name){
      var pseudo_css_attr = this.getPseudoCssAttr(pseudo_name);
      var content = pseudo_css_attr.content || "";
      if(content === ""){
	return "";
      }
      return Html.tagWrap(":" + pseudo_name, Html.escape(content));
    },
    _parsePseudoFirstContent : function(content){
      var first_letter_style = this.getPseudoCssAttr("first-letter");
      var first_line_style = this.getPseudoCssAttr("first-line");
      var first_letter_enable = !Obj.isEmpty(first_letter_style);
      var first_line_enable = !Obj.isEmpty(first_line_style);

      if(!first_letter_enable && !first_line_enable){
	return content;
      }
      var prefix = [], postfix = [];
      if(first_line_enable){
	prefix.push("<:first-line>");
      }
      if(first_letter_enable){
	prefix.push("<:first-letter>");
	postfix.push("</:first-letter>");
      }
      return content.replace(rex_first_letter, function(match, p1, p2, p3){
	return p1 + prefix.join("") + p3 + postfix.join("");
      });
    },
    _parseContent : function(content){
      var before = this._parsePseudoContent("before");
      var after = this._parsePseudoContent("after");
      content = this._parsePseudoFirstContent(content);
      return before + content + after;
    },
    // <img src='/path/to/img' push>
    // => {src:'/path/to/img', push:true}
    _parseTagAttr : function(src){
      var attr = this._parseTagAttrNv(src);
      // single attr is registered as boolean true.
      // if <img src="/path/to/img" push>, attr["push"] = true
      List.iter(this._parseTagAttrSingle(src), function(prop){
	attr[prop] = true;
      });
      return attr;
    },
    // parse (name)=(value) attr
    // <a href="top">
    // => {href:"top"}
    _parseTagAttrNv : function(src){
      var attr = {}, self = this;
      var matches = src.match(rex_nv_attr);
      if(matches === null){
	return attr;
      }
      List.iter(matches, function(nv){
	var parts = nv.split("=");
	if(parts.length >= 2){
	  var prop = parts[0];
	  var val = parts[1];
	  val = val.replace(/['"]/g, "");
	  self._parseTagAttrNvValue(attr, prop, val);
	}
      });
      return attr;
    },
    // parse value that has recursive nv value like "style='border:0'" etc.
    _parseTagAttrNvValue : function(attr, prop, val){
      if(prop === "style"){
	var inline_css = this._parseTagAttrInlineStyle(val);
	Args.copy(this.cssAttrDynamic, inline_css);
      } else if(prop.indexOf("data-") === 0){
	// <div data-name="john">
	// => {name:"john"}
	var dataset_name = this._parseDatasetName(prop);
	this.dataset[dataset_name] = val;
      } else {
	attr[prop] = val;
      }
    },
    // <div style='border:0'>
    // => {border:0}
    _parseTagAttrInlineStyle : function(src){
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
    },
    // <img src="/path/to/img" width="100" height="100" push>
    // => ["push"]
    _parseTagAttrSingle : function(src){
      var parts = src.replace(/<\S+/g,"").replace(/\/?>/g, "").split(/\s+/);
      return List.filter(parts, function(part){
	return (part !== "" && part.indexOf("=") < 0);
      });
    }
  };

  return Tag;
})();

