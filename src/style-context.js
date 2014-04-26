var StyleContext = (function(){

  // to fetch first text part from content html.
  var __rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // these markups are not parsed, just ignored.
  var __disabled_markups = [
    "script",
    "noscript",
    "style",
    "input",
    "iframe"
  ];

  // css properties just copied as it is.
  var __unmanaged_css_properties = [
    "background",
    "background-repeat",
    "background-image",
    "background-position",
    "background-color"
  ];

  var get_decorated_inline_elements = function(elements){
    var ret = [];
    List.iter(elements, function(element){
      if(element instanceof Box === false){
	return;
      }
      if(element.style.isTextEmphaEnable() || element.style.getMarkupName() === "ruby"){
	ret.push(element);
      } else if(element.elements){
	ret = ret.concat(get_decorated_inline_elements(element.elements));
      }
    });
    return ret;
  };

  // parent : parent style context
  // args :
  //   1. forceCss
  //     system css that must be applied.
  //   2. layoutContext
  //     layout-context at the point of this style-context created.
  function StyleContext(markup, parent, args){
    this._initialize(markup, parent, args);
  }

  StyleContext.prototype = {
    _initialize : function(markup, parent, args){
      args = args || {};
      this.markup = markup;
      this.markupName = markup.getName();
      this.parent = parent || null;
      this.childs = [];
      this.next = null;

      // initialize tree
      if(parent){
	parent.appendChild(this);
      }

      // create selector context.
      // this value is given as argument of functional css value
      this.selectorContext = new SelectorContext(this, args.layoutContext || null);

      // create selector callback context,
      // this context is passed to "onload" callback.
      // unlike selector-context, this context has reference to selector css,
      // because 'onload' callback is called after loading selector css.
      this.callbackContext = new SelectorCallbackContext(this, args.layoutContext || null);

      // initialize css values
      this.selectorCss = {};
      this.inlineCss = {};

      // load selector css
      // 1. load normal selector
      // 2. load dynamic callback selector 'onload'
      Args.copy(this.selectorCss, this._loadSelectorCss(markup, parent));
      Args.copy(this.selectorCss, this._loadCallbackCss("onload"));

      // load inline css
      // 1. load normal markup attribute 'style'
      // 2. load constructor argument 'args.forceCss' if exists.
      //    notice it is 'system required style', so it has highest priority.
      Args.copy(this.inlineCss, this._loadInlineCss(markup));
      Args.copy(this.inlineCss, args.forceCss || {});

      // always required properties
      this.display = this._loadDisplay(); // required
      this.flow = this._loadFlow(); // required
      this.boxSizing = this._loadBoxSizing(); // required

      // optional properties
      var color = this._loadColor();
      if(color){
	this.color = color;
      }
      var font = this._loadFont();
      if(font){
	this.font = font;
      }
      var position = this._loadPosition();
      if(position){
	this.position = position;
      }
      var edge = this._loadEdge(this.flow, this.getFontSize());
      if(edge){
	this.edge = edge;
      }
      var line_rate = this._loadLineRate();
      if(line_rate){
	this.lineRate = line_rate;
      }
      var text_align = this._loadTextAlign();
      if(text_align){
	this.textAlign = text_align;
      }
      var text_empha = this._loadTextEmpha();
      if(text_empha){
	this.textEmpha = text_empha;
      }
      var text_combine = this._loadTextCombine();
      if(text_combine){
	this.textCombine = text_combine;
      }
      var list_style = this._loadListStyle();
      if(list_style){
	this.listStyle = list_style;
      }
      // keyword 'float' is reserved in js, so we name this prop 'float direction' instead.
      var float_direction = this._loadFloatDirection();
      if(float_direction){
	this.floatDirection = float_direction;
      }
      var break_before = this._loadBreakBefore();
      if(break_before){
	this.breakBefore = break_before;
      }
      var break_after = this._loadBreakAfter();
      if(break_after){
	this.breakAfter = break_after;
      }

      // static size is defined in selector or tag attr, hightest priority
      this.staticMeasure = this._loadStaticMeasure();
      this.staticExtent = this._loadStaticExtent();

      // context size(outer size and content size) is defined by
      // 1. current static size
      // 2. parent size
      // 3. current edge size.
      this.initContextSize(this.staticMeasure, this.staticExtent);
    },
    // [context size] = [outer size] and [content size].
    //
    // (a) outer size
    //   1. if direct size is given, use it as outer size.
    //   2. else if parent exists, current outer size is the content size of parent.
    //   3. else if parent not exists(root), use root layout size.
    //
    // (b) content size
    //   1. if edge exists, content size = [outer size] - [edge size]
    //   2. else(no edge),  content size = [outer size]
    initContextSize : function(measure, extent){
      this.outerMeasure = measure  || (this.parent? this.parent.contentMeasure : Layout.getMeasure(this.flow));
      this.outerExtent = extent || (this.parent? this.parent.contentExtent : Layout.getExtent(this.flow));
      this.contentMeasure = this._computeContentMeasure(this.outerMeasure);
      this.contentExtent = this._computeContentExtent(this.outerExtent);
    },
    // if update static size, update context size too.
    updateStaticSize : function(measure, extent){
      this.staticMeasure = measure;
      this.staticExtent = extent;
      this.updateContextSize(measure, extent);
    },
    // if update context size, update all context size of children too.
    updateContextSize : function(measure, extent){
      this.initContextSize(measure, extent);
      List.iter(this.childs, function(child){
	child.updateContextSize(null, null);
      });
    },
    // clone style-context with temporary css
    clone : function(css){
      // no one can clone root style.
      if(this.parent === null){
	return this.createChild("div", css);
      }
      return new StyleContext(this.markup, this.parent, {forceCss:(css || {})});
    },
    // append child style context
    appendChild : function(child_style){
      if(this.childs.length > 0){
	List.last(this.childs).next = child_style;
      }
      this.childs.push(child_style);
    },
    removeChild : function(child_style){
      var index = List.indexOf(this.childs, Closure.eq(child_style));
      if(index >= 0){
	var removed_child = this.childs.splice(index, 1);
	return removed_child;
      }
      return null;
    },
    // inherit style with tag_name and css(optional).
    createChild : function(tag_name, css){
      var tag = new Tag("<" + tag_name + ">");
      var style = new StyleContext(tag, this, {forceCss:(css || {})});

      // save 'original' parent to child-style, because sometimes it is required by 'grand-child'.
      // for example, in following code, <li-body> is anonymous block,
      // and parent style of <li-body> is <li>.style, and parent of <ul2> is <li-body>.style.
      //
      // <ul>
      //   <li>
      //     <li-mark>1.</li-mark>
      //     <li-body><ul2>...</ul2></li-body>
      //   </li>
      // </ul>
      // 
      // <li-body> is created by <li>.style.createChild("div"), so not have original parent style(<ul>.style) as it's parent style.
      // but <ul>.style is required by <ul2> to get it's accurate content-size.
      // so child anonymous style(<li-mark>, <li-body> in this case) needs to save it's 'original' parent(<ul>.style in this case) as 'contextParent'
      // in addition to <li>.style.
      style.contextParent = this.parent; 
      return style;
    },
    createBlock : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var measure = this.contentMeasure;
      var extent = (this.parent && opt.extent && this.staticExtent === null)? opt.extent : this.contentExtent;
      var box_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-block", "nehan-" + this.getMarkupName()].concat(this.markup.classes);
      var box = new Box(box_size, this);
      box.display = (this.display === "inline-block")? this.display : "block";
      box.edge = this.edge || null; // for Box::getLayoutExtent, Box::getLayoutMeasure
      box.elements = elements;
      box.classes = classes;
      box.charCount = List.fold(elements, 0, function(total, element){
	return total + (element? (element.charCount || 0) : 0);
      });
      box.breakAfter = this.isBreakAfter() || opt.breakAfter || false;
      box.pastedContent = opt.pastedContent || null;
      return box;
    },
    createImage : function(opt){
      opt = opt || {};
      // image size always considered as horizontal mode.
      var width = this.getMarkupAttr("width")? parseInt(this.getMarkupAttr("width"), 10) : (this.staticMeasure || this.font.size);
      var height = this.getMarkupAttr("height")? parseInt(this.getMarkupAttr("height"), 10) : (this.staticExtent || this.font.size);
      var classes = ["nehan-block", "nehan-image"].concat(this.markup.classes);
      var image_size = new BoxSize(width, height);
      var image = new Box(image_size, this);
      image.display = this.display; // inline, block, inline-block
      image.edge = this.edge || null;
      image.classes = classes;
      image.charCount = 0;
      if(this.isPushed()){
	image.pushed = true;
      } else if(this.isPulled()){
	image.pulled = true;
      }
      image.breakAfter = this.isBreakAfter() || opt.breakAfter || false;
      return image;
    },
    createLine : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var max_font_size = opt.maxFontSize || this.getFontSize();
      var max_extent = opt.maxExtent || 0;
      if(this.isTextEmphaEnable()){
	max_extent = Math.max(max_extent, this.getEmphaLineExtent());
      } else if(this.markup.name === "ruby"){
	max_extent = Math.max(max_extent, this.getRubyLineExtent());
      } else {
	max_extent = Math.max(max_extent, this.getAutoLineExtent());
      }
      var measure = (this.parent && opt.measure && this.staticMeasure === null && !this.isRootLine())? opt.measure : this.contentMeasure;
      if(this.display === "inline-block"){
	measure = this.staticMeasure || opt.measure;
      }
      var line_size = this.flow.getBoxSize(measure, max_extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()].concat(this.markup.classes);
      var line = new Box(line_size, this);
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = opt.elements || [];
      line.classes = this.isRootLine()? classes : classes.concat("nehan-" + this.getMarkupName());
      line.charCount = opt.charCount || 0;
      line.maxFontSize = max_font_size;
      line.maxExtent = max_extent;

      // edge of top level line is disabled.
      // for example, consider '<p>aaa<span>bbb</span>ccc</p>'.
      // anonymous line block('aaa' and 'ccc') is already edged by <p> in block level.
      // so if line is anonymous, edge must be ignored.
      line.edge = (this.edge && !this.isRootLine())? this.edge : null;

      // backup other line data. mainly required to restore inline-context.
      if(this.isRootLine()){
	line.br = opt.br || false;
	line.inlineMeasure = opt.measure || this.contentMeasure;
	line.texts = opt.texts || [];

	// if vertical line, needs some position fix for decorated element(ruby, empha) to align baseline.
	if(this.isTextVertical()){
	  this._setVertBaseline(elements, max_font_size, max_extent);
	}
	if(this.textAlign && !this.textAlign.isStart()){
	  this._setTextAlign(line, this.textAlign);
	}
      }
      return line;
    },
    isDisabled : function(){
      return List.exists(__disabled_markups, Closure.eq(this.getMarkupName()));
    },
    isBlock : function(){
      switch(this.display){
      case "block":
      case "table":
      case "table-caption":
      case "table-header-group": // <thead>
      case "table-row-group": // <tbody>
      case "table-footer-group": // <tfoot>
      case "table-row":
      case "table-cell":
      case "list-item":
	return true;
      }
      return false;
    },
    isRoot : function(){
      return this.parent === null;
    },
    isChildBlock : function(){
      return this.isBlock() && !this.isRoot();
    },
    isInlineBlock : function(){
      return this.display === "inline-block";
    },
    isInline : function(){
      return this.display === "inline";
    },
    // check if current inline is anonymous line block.
    // 1. line-object is just under the block element.
    //  <body>this text is included in anonymous line block</body>
    //
    // 2. line-object is just under the inline-block element.
    //  <div style='display:inline-block'>this text is included in anonymous line block</div>
    isRootLine : function(){
      return this.isBlock() || this.isInlineBlock();
    },
    isFloatStart : function(){
      return this.floatDirection && this.floatDirection.isStart();
    },
    isFloatEnd : function(){
      return this.floatDirection && this.floatDirection.isEnd();
    },
    isFloated : function(){
      return this.isFloatStart() || this.isFloatEnd();
    },
    isParallel : function(){
      return this.display === "list-item";
    },
    isPushed : function(){
      return this.getMarkupAttr("pushed") !== null;
    },
    isPulled : function(){
      return this.getMarkupAttr("pulled") !== null;
    },
    isPasted : function(){
      return this.getMarkupAttr("pasted") !== null;
    },
    isTextEmphaEnable : function(){
      return (this.textEmpha && this.textEmpha.isEnable())? true : false;
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    isPositionAbsolute : function(){
      return this.position.isAbsolute();
    },
    isPre : function(){
      var white_space = this.getCssAttr("white-space", "normal");
      return white_space === "pre";
    },
    isBreakBefore : function(){
      return this.breakBefore? !this.breakBefore.isAvoid() : false;
    },
    isBreakAfter : function(){
      return this.breakAfter? !this.breakAfter.isAvoid() : false;
    },
    isFirstChild : function(){
      var childs = this.getParentChilds();
      return (childs.length > 0 && childs[0] === this);
    },
    isFirstOfType : function(){
      var childs = this.getParentChildsOfType(this.getMarkupName());
      return (childs.length > 0 && childs[0] === this);
    },
    // for descent parsing, last child can't be gained,
    // this pseudo-class is maybe enabled in future release.
    isLastChild : function(){
      //return List.last(this.getParentChilds()) === this;
      return false; // TODO
    },
    isLastOfType : function(){
      //return List.last(this.getParentChildsOfType(this.getMarkupName())) === this;
      return false; // TODO
    },
    isOnlyChild : function(){
      var childs = this.getParentChilds();
      return (childs.length === 1 && childs[0] === this);
    },
    isOnlyOfType : function(){
      var childs = this.getParentChildsOfType(this.getMarkupName());
      return (childs.length === 1 && childs[0] === this);
    },
    isEmpty : function(){
      return this.getMarkupContent() === "";
    },
    hasFlipFlow : function(){
      return this.parent? (this.flow !== this.parent.flow) : false;
    },
    hasMarkupClassName : function(class_name){
      return this.markup.hasClass(class_name);
    },
    setCssAttr : function(name, value){
      this.inlineCss[name] = value;
    },
    setCssAttrs : function(obj){
      for(var prop in obj){
	this.setCssAttr(prop, obj[prop]);
      }
    },
    // search property from markup attribute -> css
    getAttr : function(name, def_value){
      var ret = this.getMarkupAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      ret = this.getCssAttr(name);
      if(typeof ret !== "undefined" && ret !== null){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    // if markup is "<img src='aaa.jpg'>"
    // getMarkupAttr("src") => 'aaa.jpg'
    getMarkupAttr : function(name, def_value){
      if(name === "id"){
	return this.markup.id;
      }
      return this.markup.getAttr(name, def_value);
    },
    getMarkupDataset : function(name, def_val){
      return this.markup.getDataset(name, def_val);
    },
    _evalCssAttr : function(name, value){
      // if value is function, call it with style-context(this),
      // and need to format because it's thunk object and not initialized yet.
      if(typeof value === "function"){
	return CssParser.format(name, value(this.selectorContext));
      }
      return value; // already formatted
    },
    // priority: inline css > selector css
    getCssAttr : function(name, def_value){
      var ret;
      ret = this.getInlineCssAttr(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      ret = this.getSelectorCssAttr(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getInlineCssAttr : function(name){
      return this.inlineCss[name] || null;
    },
    getSelectorCssAttr : function(name){
      return this.selectorCss[name] || null;
    },
    getDatasetAttr : function(){
      return this.markup.getDatasetAttr();
    },
    getMarkupName : function(){
      return this.markup.getName();
    },
    // if markup is <p id="foo">, markup.id is "nehan-foo".
    getMarkupId : function(){
      return this.markup.id;
    },
    getMarkupContent : function(){
      return this.markup.getContent();
    },
    getMarkupPos : function(){
      return this.markup.pos;
    },
    getContent : function(){
      var content = this.markup.getContent();
      if(this.isBreakBefore()){
	content = "<page-break>" + content;
      }
      var before = Selectors.getValuePe(this, "before");
      if(!Obj.isEmpty(before)){
	content = Html.tagWrap("before", before.content || "") + content;
      }
      var after = Selectors.getValuePe(this, "after");
      if(!Obj.isEmpty(after)){
	content = content + Html.tagWrap("after", after.content || "");
      }
      var first_letter = Selectors.getValuePe(this, "first-letter");
      if(!Obj.isEmpty(first_letter)){
	content = content.replace(__rex_first_letter, function(match, p1, p2, p3){
	  return p1 + Html.tagWrap("first-letter", p3);
	});
      }
      var first_line = Selectors.getValuePe(this, "first-line");
      if(!Obj.isEmpty(first_line)){
	content = Html.tagWrap("first-line", content);
      }
      return content;
    },
    getHeaderRank : function(){
      return this.markup.getHeaderRank();
    },
    getFontSize : function(){
      return this.font.size;
    },
    getFontFamily : function(){
      return this.font.family || this.flow.isTextVertical()? Layout.vertFontFamily : Layout.horiFontFamily;
    },
    getTextAlign : function(){
      return this.textAlign || TextAligns.get("start");
    },
    getTextCombine : function(){
      return this.textCombine || null;
    },
    getLetterSpacing : function(){
      return this.letterSpacing || 0;
    },
    getMarkerHtml : function(order){
      return this.listStyle? this.listStyle.getMarkerHtml(order) : "";
    },
    getColor : function(){
      return this.color || Layout.fontColor;
    },
    getChildCount : function(){
      return this.childs.length;
    },
    getChildIndex : function(){
      var self = this;
      return List.indexOf(this.getParentChilds(), function(child){
	return child === self;
      });
    },
    getChildIndexOfType : function(){
      var self = this;
      return List.indexOf(this.getParentChildsOfType(this.getMarkupName()), function(child){
	return child === self;
      });
    },
    getNthChild : function(nth){
      return this.childs[nth] || null;
    },
    getParentChilds : function(){
      return this.parent? this.parent.childs : [];
    },
    getParentNthChild : function(nth){
      return this.parent? this.parent.getNthChild(nth) : null;
    },
    getParentChildsOfType : function(markup_name){
      return List.filter(this.getParentChilds(), function(child){
	return child.getMarkupName() === markup_name;
      });
    },
    getParentFlow : function(){
      return this.parent? this.parent.flow : this.flow;
    },
    getParentConentMeasure : function(){
      return this.parent? this.parent.contentMeasure : this.contentMeasure;
    },
    getNextSibling : function(){
      return this.next;
    },
    getLineRate : function(){
      return this.lineRate || Layout.lineRate || 2;
    },
    getEmphaLineExtent : function(){
      return this.getFontSize() * 3;
    },
    getRubyLineExtent : function(){
      var base_font_size = this.getFontSize();
      var base_extent = Math.floor(base_font_size * this.getLineRate());
      var rt_extent = Layout.getRtFontSize(base_font_size);
      return base_extent + rt_extent;
    },
    getAutoLineExtent : function(){
      return Math.floor(this.getFontSize() * this.getLineRate());
    },
    getEdge : function(){
      return this.contextParent? this.contextParent.getEdge() : (this.edge || null);
    },
    getEdgeMeasure : function(flow){
      var edge = this.getEdge();
      return edge? edge.getMeasureSize(flow || this.flow) : 0;
    },
    getEdgeExtent : function(flow){
      var edge = this.getEdge();
      return edge? edge.getExtentSize(flow || this.flow) : 0;
    },
    getInnerEdgeMeasure : function(){
      var edge = this.getEdge();
      return edge? edge.getInnerMeasureSize() : 0;
    },
    getInnerEdgeExtent : function(){
      var edge = this.getEdge();
      return edge? edge.getInnerExtentSize() : 0;
    },
    // notice that box-size, box-edge is box local variable,
    // so style of box-size(content-size) and edge-size are generated at Box::getCssBlock
    getCssBlock : function(){
      var css = {};
      css.display = "block";
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.letterSpacing && !this.flow.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      if(this.floatDirection){
	Args.copy(css, this.floatDirection.getCss(this.flow));
      }
      if(this.position){
	Args.copy(css, this.position.getCss());
      }
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      Args.copy(css, this.getCssUnmanaged());
      css.overflow = "hidden"; // to avoid margin collapsing
      return css;
    },
    // notice that line-size, line-edge is box local variable,
    // so style of line-size(content-size) and edge-size are generated at Box::getCssInline
    getCssInline : function(){
      var css = {};
      css["line-height"] = "1em";
      if(this.parent && this.isRootLine()){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      // top level line need to follow parent blockflow.
      if(this.isRootLine()){
	Args.copy(css, this.flow.getCss());
      }
      if(this.flow.isTextVertical()){
	if(Env.isIphoneFamily){
	  css["letter-spacing"] = "-0.001em";
	}
	if(this.markup.getName() !== "ruby"){
	  css["margin-left"] = css["margin-right"] = "auto";
	  css["text-align"] = "center";
	}
      }
      Args.copy(css, this.getCssUnmanaged());
      return css;
    },
    getCssUnmanaged : function(){
      var css = {}, self = this;
      // copy unmanaged css
      List.iter(__unmanaged_css_properties, function(prop){
	var value = self.getCssAttr(prop);
	if(value){
	  css[prop] = value;
	}
      });
      return css;
    },
    _computeContentMeasure : function(outer_measure){
      switch(this.boxSizing){
      case "margin-box": return outer_measure - this.getEdgeMeasure();
      case "border-box": return outer_measure - this.getInnerEdgeMeasure();
      case "content-box": default: return outer_measure;
      }
    },
    _computeContentExtent : function(outer_extent){
      switch(this.boxSizing){
      case "margin-box": return outer_extent - this.getEdgeExtent();
      case "border-box": return outer_extent - this.getInnerEdgeExtent();
      case "content-box": default: return outer_extent;
      }
    },
    _computeFontSize : function(val, unit_size){
      var str = String(val).replace(/\/.+$/, ""); // remove line-height value like 'large/150%"'
      var size = Layout.fontSizeNames[str] || str;
      return this._computeUnitSize(size, unit_size);
    },
    _computeUnitSize : function(val, unit_size){
      var str = String(val);
      if(str.indexOf("rem") > 0){
	var rem_scale = parseFloat(str.replace("rem",""));
	return Math.round(Layout.fontSize * rem_scale); // use root font-size
      }
      if(str.indexOf("em") > 0){
	var em_scale = parseFloat(str.replace("em",""));
	return Math.round(unit_size * em_scale);
      }
      if(str.indexOf("pt") > 0){
	return Math.round(parseInt(str, 10) * 4 / 3);
      }
      if(str.indexOf("%") > 0){
	var max_size = this.getParentContentMeasure();
	return Math.round(max_size * parseInt(str, 10) / 100);
      }
      var px = parseInt(str, 10);
      return isNaN(px)? 0 : px;
    },
    _computeCornerSize : function(val, unit_size){
      var ret = {}, max_size = this.getParentContent
      for(var prop in val){
	ret[prop] = [0, 0];
	ret[prop][0] = this._computeUnitSize(val[prop][0], unit_size);
	ret[prop][1] = this._computeUnitSize(val[prop][1], unit_size);
      }
      return ret;
    },
    _computeEdgeSize : function(val, unit_size){
      var ret = {};
      for(var prop in val){
	ret[prop] = this._computeUnitSize(val[prop], unit_size);
      }
      return ret;
    },
    _setTextAlign : function(line, text_align){
      var content_measure  = line.getContentMeasure(this.flow);
      var space_measure = content_measure - line.inlineMeasure;
      if(space_measure <= 0){
	return;
      }
      var padding = new Padding();
      if(text_align.isCenter()){
	var start_offset = Math.floor(space_measure / 2);
	line.size.setMeasure(this.flow, content_measure - start_offset);
	padding.setStart(this.flow, start_offset);
	Args.copy(line.css, padding.getCss());
      } else if(text_align.isEnd()){
	line.size.setMeasure(this.flow, line.inlineMeasure);
	padding.setStart(this.flow, space_measure);
	Args.copy(line.css, padding.getCss());
      }
    },
    _setVertBaseline : function(elements, max_font_size, max_extent){
      var flow = this.flow;
      var base_font_size = this.getFontSize();
      var text_center = Math.floor(max_extent / 2); // center line offset

      // before align baseline, align all extents of children to max_extent.
      List.iter(elements, function(element){
	if(element instanceof Box && element.style.getMarkupName() !== "img" && element.style.display !== "inline-block"){
	  element.size.setExtent(flow, max_extent);
	}
      });

      // pickup decorated elements that has different baseline(ruby or empha)
      var decorated_elements = get_decorated_inline_elements(elements);
      List.iter(decorated_elements, function(element){
	var font_size = element.style.getFontSize();
	var text_center_offset = text_center - Math.floor(font_size / 2); // text displayed at half font-size minus from center line.
	if(text_center_offset > 0){
	  var edge = element.style.edge? element.style.edge.clone() : new BoxEdge();
	  edge.padding.setAfter(flow, text_center_offset); // set offset to padding

	  // set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	  Args.copy(element.css, edge.getCss(flow));
	}
      });
    },
    _loadSelectorCss : function(markup, parent){
      switch(markup.getName()){
      case "before":
      case "after":
      case "first-letter":
      case "first-line":
	// notice that parent style is the style base of pseudo-element.
	return Selectors.getValuePe(parent, markup.getName());

      default:
	return Selectors.getValue(this);
      }
    },
    _loadInlineCss : function(markup){
      var style = markup.getAttr("style");
      if(style === null){
	return {};
      }
      var stmts = (style.indexOf(";") >= 0)? style.split(";") : [style];
      return List.fold(stmts, {}, function(ret, stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Utils.trim(nv[0]).toLowerCase();
	  var value = Utils.trim(nv[1]);
	  ret[prop] = CssParser.format(prop, value);
	}
	return ret;
      });
    },
    // nehan.js can change style dynamically by layout-context.
    //
    // [example]
    // engine.setStyle("p", {
    //   "onload" : function(context){
    //      var min_extent = parseInt(context.getMarkupDataset("minExtent"), 10);
    //	    if(context.getRestExtent() < min_extent){
    //        return {"page-break-before":"always"};
    //      }
    //   }
    // });
    //
    // then markup "<p data-min-extent='100'>text</p>" will be broken before
    // if rest extent is less than 100.
    _loadCallbackCss : function(name){
      var callback = this.getSelectorCssAttr(name);
      if(callback === null || typeof callback !== "function"){
	return {};
      }
      var ret = callback(this.callbackContext) || {};
      for(var prop in ret){
	ret[prop] = this._evalCssAttr(prop, ret[prop]);
      }
      return ret;
    },
    _loadDisplay : function(){
      return this.getCssAttr("display", "inline");
    },
    _loadFlow : function(){
      var value = this.getCssAttr("flow", "inherit");
      var parent_flow = this.parent? this.parent.flow : Layout.getStdBoxFlow();
      if(value === "inherit"){
	return parent_flow;
      }
      if(value === "flip"){
	return parent_flow.getFlipFlow();
      }
      return BoxFlows.getByName(value);
    },
    _loadPosition : function(){
      var value = this.getCssAttr("position", "static");
      if(value === "start"){
	return null;
      }
      var position = new BoxPosition(value);
      var self = this;
      List.iter(Const.cssBoxDirsLogical, function(dir){
	var value = self.getCssAttr(dir, "auto");
	if(value !== "auto"){
	  position[value] = self._computeUnitSize(start, self.font.size);
	}
      });
      return position;
    },
    _loadColor : function(){
      var value = this.getCssAttr("color", "inherit");
      if(value !== "inherit"){
	return new Color(value);
      }
    },
    _loadFont : function(){
      var parent_font_size = this.parent? this.parent.font.size : Layout.fontSize;
      var font = new Font(parent_font_size);
      var font_size = this.getCssAttr("font-size", "inherit");
      if(font_size !== "inherit"){
	font.size = this._computeFontSize(font_size, parent_font_size);
      }
      var font_family = this.getCssAttr("font-family", "inherit");
      if(font_family !== "inherit"){
	font.family = font_family;
      } else if(this.parent === null){
	font.family = Layout.getStdFontFamily();
      }
      var font_weight = this.getCssAttr("font-weight", "inherit");
      if(font_weight !== "inherit"){
	font.weight = font_weight;
      }
      var font_style = this.getCssAttr("font-style", "inherit");
      if(font_style !== "inherit"){
	font.style = font_style;
      }
      return font;
    },
    _loadBoxSizing : function(){
      return this.getCssAttr("box-sizing", "margin-box");
    },
    _loadEdge : function(flow, font_size){
      var padding = this.getCssAttr("padding");
      var margin = this.getCssAttr("margin");
      var border_width = this.getCssAttr("border-width");
      if(padding === null && margin === null && border_width === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	edge.padding.setSize(flow, this._computeEdgeSize(padding, font_size));
      }
      if(margin){
	edge.margin.setSize(flow, this._computeEdgeSize(margin, font_size));
      }
      if(border_width){
	edge.border.setSize(flow, this._computeEdgeSize(border_width, font_size));
      }
      var border_radius = this.getCssAttr("border-radius");
      if(border_radius){
	edge.setBorderRadius(flow, this._computeCornerSize(border_radius, font_size));
      }
      var border_color = this.getCssAttr("border-color");
      if(border_color){
	edge.setBorderColor(flow, border_color);
      }
      var border_style = this.getCssAttr("border-style");
      if(border_style){
	edge.setBorderStyle(flow, border_style);
      }
      return edge;
    },
    _loadLineRate : function(){
      var value = this.getCssAttr("line-rate", "inherit");
      if(value === "inherit" && this.parent && this.parent.lineRate){
	return this.parent.lineRate;
      }
      return parseFloat(value || Layout.lineRate);
    },
    _loadTextAlign : function(){
      var value = this.getCssAttr("text-align", "inherit");
      if(value === "inherit" && this.parent && this.parent.textAlign){
	return this.parent.textAlign;
      }
      return TextAligns.get(value || "start");
    },
    _loadTextEmpha : function(){
      var parent_color = this.parent? this.parent.getColor() : Layout.fontColor;
      var empha_style = this.getCssAttr("text-emphasis-style", "none");
      if(empha_style === "none" || empha_style === "inherit"){
	return null;
      }
      var empha_pos = this.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = this.getCssAttr("text-emphasis-color", parent_color);
      return new TextEmpha({
	style:new TextEmphaStyle(empha_style),
	pos:new TextEmphaPos(empha_pos),
	color:new Color(empha_color)
      });
    },
    _loadTextEmphaStyle : function(){
      var value = this.getCssAttr("text-emphasis-style", "inherit");
      return (value !== "inherit")? new TextEmphaStyle(value) : null;
    },
    _loadTextEmphaPos : function(){
      return this.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
    },
    _loadTextEmphaColor : function(color){
      return this.getCssAttr("text-emphasis-color", color.getValue());
    },
    _loadTextCombine : function(){
      return this.getCssAttr("text-combine");
    },
    _loadFloatDirection : function(){
      var name = this.getCssAttr("float", "none");
      if(name === "none"){
	return null;
      }
      return FloatDirections.get(name);
    },
    _loadBreakBefore : function(){
      var value = this.getCssAttr("break-before");
      return value? Breaks.getBefore(value) : null;
    },
    _loadBreakAfter : function(){
      var value = this.getCssAttr("break-after");
      return value? Breaks.getAfter(value) : null;
    },
    _loadListStyle : function(){
      var list_style_type = this.getCssAttr("list-style-type", "none");
      if(list_style_type === "none"){
	return null;
      }
      return new ListStyle({
	type:list_style_type,
	position:this.getCssAttr("list-style-position", "outside"),
	image:this.getCssAttr("list-style-image", "none"),
	format:this.getCssAttr("list-style-format")
      });
    },
    _loadLetterSpacing : function(font_size){
      var letter_spacing = this.getCssAttr("letter-spacing");
      if(letter_spacing){
	return this._computeUnitSize(letter_spacing, font_size);
      }
    },
    _loadStaticMeasure : function(){
      var prop = this.flow.getPropMeasure();
      var static_size = this.getAttr(prop) || this.getAttr("measure") || this.getCssAttr(prop) || this.getCssAttr("measure");
      return static_size? this._computeUnitSize(static_size, this.font.size) : null;
    },
    _loadStaticExtent : function(){
      var prop = this.flow.getPropExtent();
      var static_size = this.getAttr(prop) || this.getAttr("extent") || this.getCssAttr(prop) || this.getCssAttr("extent");
      return static_size? this._computeUnitSize(static_size, this.font.size) : null;
    }
  };

  return StyleContext;
})();

