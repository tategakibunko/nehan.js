var StyleContext = (function(){
  // parent : parent style context
  // force_css : system css that must be applied.
  function StyleContext(markup, parent, force_css){
    this.markup = markup;
    this.parent = parent || null;
    this.childs = []; // children for this style, updated by appendChild
    if(parent){
      parent.appendChild(this);
    }

    // load selector css
    // 1. load from normal selector
    // 2. load from dynamic callback selector named by "onload"
    this.selectorCss = this._loadSelectorCss(markup, parent);
    Args.copy(this.selectorCss, this._loadCallbackCss("onload"));

    // load inline css
    // 1. load from markup attr 'style'
    // 2. load from dynamic callback selector named by "inline"
    // 3. load from constructor argument 'force_css' if exists
    this.inlineCss = this._loadInlineCss(markup);
    Args.copy(this.inlineCss, this._loadCallbackCss("inline"));
    Args.copy(this.inlineCss, force_css || {});

    this.display = this._loadDisplay(); // required
    this.flow = this._loadFlow(); // required
    this.boxSizing = this._loadBoxSizing(); // required
    var color = this._loadColor();
    if(color){
      this.color = color;
    }
    var background = this._loadBackground();
    if(background){
      this.background = background;
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
    var pushed = this._loadPushedAttr();
    if(pushed){
      this.pushed = true;
    }
    var pulled = this._loadPulledAttr();
    if(pulled){
      this.pulled = true;
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
  }

  StyleContext.prototype = {
    clone : function(css){
      // no one can clone root style.
      if(this.parent === null){
	return this.createChild("div", css);
      }
      return new StyleContext(this.markup.clone(), this.parent, css || {});
    },
    // append child style context
    appendChild : function(child_style){
      this.childs.push(child_style);
    },
    // inherit style with tag_name and css(optional).
    createChild : function(tag_name, css){
      var tag = new Tag("<" + tag_name + ">");
      var style = new StyleContext(tag, this, css || {});

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
      var measure = opt.measure || this.getStaticContentMeasure() || this.getContentMeasure();
      var extent = this.parent? (opt.extent || this.getContentExtent()) : this.getContentExtent();
      var box_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-block", "nehan-" + this.getMarkupName()];
      var box = new Box(box_size, this);
      box.display = "block";
      box.elements = elements;
      box.classes = classes;
      box.charCount = List.fold(elements, 0, function(total, element){
	return total + (element? (element.charCount || 0) : 0);
      });
      if(this.edge){
	box.edge = this.edge.clone();
      }
      return box;
    },
    createImage : function(){
      var measure = this.getImageMeasure();
      var extent = this.getImageExtent();
      var image_size = BoxFlows.getByName("lr-tb").getBoxSize(measure, extent); // image size always considered as horizontal mode.
      var image = new Box(image_size, this);
      image.display = this.display; // inline/block
      image.classes = ["nehan-block", "nehan-image"];
      image.charCount = 0;
      if(this.pushed){
	image.pushed = true;
      } else if(this.pulled){
	image.pulled = true;
      }
      if(this.edge){
	image.edge = this.edge.clone();
      }
      return image;
    },
    createLine : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var child_lines = this._filterChildLines(elements);
      var max_font_size = this._computeMaxLineFontSize(child_lines);
      var max_extent = this._computeMaxLineExtent(child_lines, max_font_size);
      var measure = opt.measure || this.getContentMeasure();
      var extent = (this.isRootLine() && child_lines.length > 0)? max_extent : this.getAutoLineExtent();
      var line_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()];
      var line = new Box(line_size, this);
      line.style = this;
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = opt.elements || [];
      line.classes = this.isRootLine()? classes : classes.concat("nehan-" + this.markup.getName());
      line.charCount = opt.charCount || 0;

      // backup other line data. mainly required to restore inline-context.
      if(this.isRootLine()){
	line.br = opt.br || false;
	line.inlineMeasure = opt.inlineMeasure || measure;
	line.texts = opt.texts || [];

	// if vertical line, needs some position fix to align baseline.
	if(this.isTextVertical()){
	  this._alignVertBaselines(child_lines, max_font_size, max_extent);
	}
	if(this.textAlign && !this.textAlign.isStart()){
	  this._setTextAlign(line, this.textAlign);
	}
      }
      return line;
    },
    // nehan.js can change inline-style dynamically by setting 'layout' callback in style.
    //
    // [example]
    // engine.setStyle("p.more-than-extent-100", {
    //   "layout" : function(style, context){
    //	    if(context.getBlockRestExtent() < 100){
    //        return {"page-break-before":"always"};
    //      }
    //   }
    // });
    //
    onLayoutContext : function(context){
      Args.copy(this.inlineCss, this._loadCallbackCss("layout", context));
    },
    isBlock : function(){
      switch(this.display){
      case "block":
      case "table":
      case "table-caption":
      case "table-row":
      case "table-row-group":
      case "table-header-group":
      case "table-footer-group":
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
    isInline : function(){
      return this.display === "inline";
    },
    isRootLine : function(){
      return this.isBlock();
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
      return this.pushed || false;
    },
    isPulled : function(){
      return this.pulled || false;
    },
    isTextEmphaEnable : function(){
      return this.textEmpha && this.textEmpha.isEnable();
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    isPre : function(){
      var white_space = this.getCssAttr("white-space", "normal");
      return white_space === "pre";
    },
    isFirstChild : function(){
      return this.parent? this.parent.getNthChild(0) === this : false;
    },
    isLastChild : function(){
      return false; // TODO
    },
    isFirstOfType : function(){
      return false; // TODO
    },
    isLastOfType : function(){
      return false; // TODO
    },
    isOnlyChild : function(){
      return false; // TODO
    },
    isOnlyOfType : function(){
      return false; // TODO
    },
    isEmpty : function(){
      return false; // TODO
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
    getMarkupAttr : function(name){
      if(name === "id"){
	return this.markup.id;
      }
      return this.markup.getAttr(name);
    },
    // priority: inline css > selector css
    getCssAttr : function(name, def_value){
      var ret;
      ret = this.getInlineCssAttr(name);
      if(ret !== null){
	return ret;
      }
      ret = this.getSelectorCssAttr(name);
      if(ret !== null){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    getInlineCssAttr : function(name){
      return this.inlineCss[name] || null;
    },
    getSelectorCssAttr : function(name){
      return this.selectorCss[name] || null;
    },
    hasMarkupClassName : function(class_name){
      return this.markup.hasClass(class_name);
    },
    getMarkupName : function(){
      return this.markup.getName();
    },
    // if markup is <p id="foo">, markup.id is "nehan-foo".
    getMarkupId : function(){
      return this.markup.id;
    },
    getMarkupContent : function(){
      return this.markup.getContent(this);
    },
    getMarkupPos : function(){
      return this.markup.pos;
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
    getLetterSpacing : function(){
      return this.letterSpacing || 0;
    },
    getColor : function(){
      return this.color || Layout.fontColor;
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
      if(this.isTextEmphaEnable()){
	return this.getEmphaLineExtent();
      }
      if(this.getMarkupName() === "ruby"){
	return this.getRubyLineExtent();
      }
      return Math.floor(this.getFontSize() * this.getLineRate());
    },
    getEdgeMeasure : function(flow){
      return this.edge? this.edge.getMeasureSize(flow || this.flow) : 0;
    },
    getEdgeExtent : function(flow){
      return this.edge? this.edge.getExtentSize(flow || this.flow) : 0;
    },
    // same as getEdgeMeasure, but if contextParent exists, obtain from it.
    getContextEdgeMeasure : function(flow){
      return this.contextParent? this.contextParent.getEdgeMeasure(flow) : this.getEdgeMeasure(flow);
    },
    // same as getEdgeExtent, but if contextParent exists, obtain from it.
    getContextEdgeExtent : function(flow){
      return this.contextParent? this.contextParent.getEdgeExtent(flow) : this.getEdgeExtent(flow);
    },
    getMarkerHtml : function(order){
      return this.listStyle? this.listStyle.getMarkerHtml(order) : "";
    },
    getOrphansCount : function(){
      // orphans count only enabled to child block element.
      if(this.isRoot()){
	return 0;
      }
      var count = this.getCssAttr("orphans");
      return count? parseInt(count, 10) : 0;
    },
    getChildCount : function(){
      return this.childs.length;
    },
    getChildIndex : function(){
      return this.parent? this.parent.findChildIndex(this) : 0;
    },
    getChildIndexOfType : function(){
      return this.parent? this.parent.findChildIndexOfType(this) : 0;
    },
    getNthChild : function(nth){
      return this.childs[nth] || null;
    },
    getParentChilds : function(){
      return this.parent? this.parent.childs : [];
    },
    getNextSibling : function(){
      return null; // TODO
    },
    getOuterSize : function(){
      var measure = this.getOuterMeasure();
      var extent = this.getOuterExtent();
      return this.flow.getBoxSize(measure, extent);
    },
    getOuterMeasure : function(){
      return this.getStaticMeasure() || this.getLogicalMaxMeasure();
    },
    getOuterExtent : function(){
      return this.getStaticExtent() || this.getLogicalMaxExtent();
    },
    getStaticMeasure : function(){
      var max_size = this.getLogicalMaxMeasure(); // this value is required when static size is set by '%' value.
      var static_size = this.getAttr(this.flow.getPropMeasure()) || this.getAttr("measure");
      return static_size? UnitSize.getBoxSize(static_size, this.font.size, max_size) : null;
    },
    getStaticExtent : function(){
      var max_size = this.getLogicalMaxExtent(); // this value is required when static size is set by '%' value.
      var static_size = this.getAttr(this.flow.getPropExtent()) || this.getAttr("extent");
      return static_size? UnitSize.getBoxSize(static_size, this.font.size, max_size) : null;
    },
    getStaticContentMeasure : function(){
      var static_size = this.getStaticMeasure();
      return static_size? Math.max(0, static_size - this.getEdgeMeasure()) : null;
    },
    getStaticContentExtent : function(){
      var static_size = this.getStaticExtent();
      return static_size? Math.max(0, static_size - this.getEdgeExtent()) : null;
    },
    getLayoutMeasure : function(){
      var prop = this.flow.getPropMeasure();
      var size = this.getAttr("measure") || this.getAttr(prop) || Layout[prop];
      return parseInt(size, 10);
    },
    getLayoutExtent : function(){
      var prop = this.flow.getPropExtent();
      var size = this.getAttr("extent") || this.getAttr(prop) || Layout[prop];
      return parseInt(size, 10);
    },
    getLogicalMaxMeasure : function(){
      var max_size = this.parent? this.parent.getContentMeasure(this.flow) : this.getLayoutMeasure();
      return max_size;
    },
    getLogicalMaxExtent : function(){
      var max_size = this.parent? this.parent.getContentExtent(this.flow) : this.getLayoutExtent();
      return (this.display === "block")? max_size : this.font.size;
    },
    getImageMeasure : function(){
      var edge_size = this.getEdgeMeasure();
      var measure = (this.getStaticMeasure() || this.getOuterMeasure()) - edge_size;
      return Math.min(measure, this.getLayoutMeasure() - edge_size);
    },
    getImageExtent : function(){
      var edge_size = this.getEdgeExtent();
      var extent = (this.getStaticExtent() || this.getOuterExtent()) - edge_size;
      return Math.min(extent, this.getLayoutExtent() - edge_size);
    },
    // 'after' loading all properties, we can compute boundary box size.
    getContentSize : function(){
      var measure = this.getContentMeasure();
      var extent = this.getContentExtent();
      return this.flow.getBoxSize(measure, extent);
    },
    getContentMeasure : function(){
      return this.getOuterMeasure() - this.getEdgeContentMeasure();
    },
    getContentExtent : function(){
      return this.getOuterExtent() - this.getEdgeContentExtent();
    },
    getEdgeContentMeasure : function(){
      if(typeof this.edge === "undefined"){
	return 0;
      }
      switch(this.boxSizing){
      case "content-box":
	return 0;
      case "border-box":
	return this.edge.padding.getMeasureSize(this.flow) + this.edge.border.getMeasureSize(this.flow);
      case "padding-box":
	return this.edge.padding.getMeasureSize(this.flow);
      case "margin-box": default:
	return this.edge.getMeasureSize(this.flow);
      }
    },
    getEdgeContentExtent : function(){
      if(typeof this.edge === "undefined"){
	return 0;
      }
      switch(this.boxSizing){
      case "content-box":
	return 0;
      case "border-box":
	return this.edge.padding.getExtentSize(this.flow) + this.edge.border.getExtentSize(this.flow);
      case "padding-box":
	return this.edge.padding.getExtentSize(this.flow);
      case "margin-box": default:
	return this.edge.getExtentSize(this.flow);
      }
    },
    getCssInline : function(){
      var css = {};
      css["line-height"] = "1em";
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.background){
	Args.copy(css, this.background.getCss());
      }
      // edge of top level line is disabled.
      // for example, if line is aaa<span>bbb</span>ccc,
      // parent of 'bbb' is <span>, so it can be edged, but 'aaa' and 'ccc' not,
      // because it's wrapped by 'anonymous block'.
      if(this.edge && !this.isRootLine()){
	Args.copy(css, this.edge.getCss());
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
      return css;
    },
    getCssBlock : function(){
      var css = {};
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.background){
	Args.copy(css, this.background.getCss(this.flow));
      }
      if(this.letterSpacing && !this.flow.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      css.display = "block";
      if(this.floatDirection){
	Args.copy(css, this.floatDirection.getCss(this.flow));
      }
      css.overflow = "hidden"; // to avoid margin collapsing
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      return css;
    },
    findChildIndex : function(style){
      return List.indexOf(this.childs, function(child){
	return child === style;
      });
    },
    findChildsOfType : function(style){
      var name = style.getMarkupName();
      return List.filter(this.childs, function(child){
	return child.getMarkupName() === name;
      });
    },
    findChildIndexOfType : function(style){
      return List.indexOf(this.findChildsOfType(style), function(child){
	return child === style;
      });
    },
    _filterChildLines : function(elements){
      return List.filter(elements, function(element){
	return element.style? true : false;
      });
    },
    _computeMaxLineFontSize : function(child_lines){
      return List.fold(child_lines, this.getFontSize(), function(ret, line){
	return Math.max(ret, line.style.getFontSize());
      });
    },
    // get inline max_extent size after centerizing each font.
    _computeMaxLineExtent : function(child_lines, max_font_size){
      var flow = this.flow;
      return List.fold(child_lines, this.getAutoLineExtent(), function(ret, line){
	var font_size = line.style.getFontSize();
	var font_center_offset = Math.floor((max_font_size - font_size) / 2);
	return Math.max(ret, line.size.getExtent(flow) + font_center_offset);
      });
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
    _alignVertBaselines : function(child_lines, max_font_size, max_extent){
      var flow = this.flow;
      var base_font_size = this.getFontSize();
      var text_center = Math.floor(max_extent / 2);

      List.iter(child_lines, function(line){
	var font_size = line.style.getFontSize();
	var text_center_offset = text_center - Math.floor(font_size / 2);
	// ruby, empha, or all children having different font-size must be fixed because it differs basical line-extent.
	if(!line.style.isTextEmphaEnable() && line.style.getMarkupName() !== "ruby" && font_size === base_font_size){
	  return;
	}
	if(line.style && line.style.getMarkupName() === "img"){
	  return;
	}
	if(text_center_offset > 0){
	  line.edge = line.style.edge? line.style.edge.clone() : new BoxEdge(); // set line.edge(not line.style.edge) to overwrite padding temporally.
	  line.edge.padding.setAfter(flow, text_center_offset); // set new edge(use line.edge not line.style.edge)
	  line.size.setExtent(flow, max_extent - text_center_offset); // set new size
	  Args.copy(line.css, line.edge.getCss()); // overwrite edge
	  Args.copy(line.css, line.size.getCss()); // overwrite size
	}
      });
    },
    _loadSelectorCss : function(markup, parent){
      if(markup.hasPseudoElement()){
	return Selectors.getValuePe(parent, markup.getName());
      }
      return Selectors.getValue(this);
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
	  ret[prop] = value;
	}
	return ret;
      });
    },
    _loadCallbackCss : function(name, context){
      var callback = this.getSelectorCssAttr(name);
      return (callback && typeof callback === "function")? (callback(this, context || null) || {}) : {};
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
      var value = this.getCssAttr("position", "relative");
      return new BoxPosition(value, {
	top: this.getCssAttr("top", "auto"),
	left: this.getCssAttr("left", "auto"),
	right: this.getCssAttr("right", "auto"),
	bottom: this.getCssAttr("bottom", "auto")
      });
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
	font.size = UnitSize.getFontSize(font_size, parent_font_size);
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
	edge.padding.setSize(flow, UnitSize.getEdgeSize(padding, font_size));
      }
      if(margin){
	edge.margin.setSize(flow, UnitSize.getEdgeSize(margin, font_size));
      }
      if(border_width){
	edge.border.setSize(flow, UnitSize.getEdgeSize(border_width, font_size));
      }
      var border_radius = this.getCssAttr("border-radius");
      if(border_radius){
	edge.setBorderRadius(flow, UnitSize.getCornerSize(border_radius, font_size));
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
	return UnitSize.getUnitSize(letter_spacing, font_size);
      }
    },
    _loadBackground : function(){
      var bg_color = this.getCssAttr("background-color");
      var bg_image = this.getCssAttr("background-image");
      var bg_pos = this.getCssAttr("background-position");
      if(bg_color === null && bg_image === null && bg_pos === null){
	return null;
      }
      var background = new Background();
      if(bg_color){
	background.color = new Color(bg_color);
      }
      if(bg_image){
	background.image = bg_image;
      }
      if(bg_pos){
	background.pos = new BackgroundPos2d(
	  new BackgroundPos(bg_pos.inline, bg_pos.offset),
	  new BackgroundPos(bg_pos.block, bg_pos.offset)
	);
      }
      var bg_repeat = this.getCssAttr("background-repeat");
      if(bg_repeat){
	background.repeat = new BackgroundRepeat2d(
	  new BackgroundRepeat(bg_repeat.inline),
	  new BackgroundRepeat(bg_repeat.block)
	);
      }
      return background;
    },
    _loadPushedAttr : function(){
      return this.getMarkupAttr("pushed") !== null;
    },
    _loadPulledAttr : function(){
      return this.getMarkupAttr("pulled") !== null;
    }
  };

  return StyleContext;
})();

