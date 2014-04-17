var StyleContext = (function(){
  var rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;

  // parent : parent style context
  // args :
  //   1. forceCss
  //     system css that must be applied.
  //   2. context
  //     layout-context at the point of this style-context created.
  function StyleContext(markup, parent, args){
    this._initialize(markup, parent, args);
  }

  StyleContext.prototype = {
    _initialize : function(markup, parent, args){
      args = args || {};
      this.markup = markup;
      this.parent = parent || null;
      this.markupName = markup.getName();
      this.childs = []; // children for this style, updated by appendChild
      this.next = null;
      if(parent){
	parent.appendChild(this);
      }

      // initialize css values
      this.selectorCss = {};
      this.inlineCss = {};

      // load selector css
      // 1. load normal selector
      // 2. load dynamic callback selector 'onload'
      Args.copy(this.selectorCss, this._loadSelectorCss(markup, parent));
      Args.copy(this.selectorCss, this._loadCallbackCss("onload", args.context || null));

      // load inline css
      // 1. load normal markup attribute 'style'
      // 2. load dynamic callback selector 'inline'
      // 3. load constructor argument 'args.forceCss' if exists.
      //    notice that 'args.forceCss' is 'system required style'(so highest priority is given).
      Args.copy(this.inlineCss, this._loadInlineCss(markup));
      Args.copy(this.inlineCss, this._loadCallbackCss("inline", args.context || null));
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

      this.staticMeasure = this._loadStaticMeasure();
      this.staticExtent = this._loadStaticExtent();
      this.outerMeasure = this.staticMeasure || (this.parent? this.parent.contentMeasure : Layout.getMeasure(this.flow));
      this.outerExtent = this.staticExtent || (this.parent? this.parent.contentExtent : Layout.getExtent(this.flow));
      this.contentMeasure = this._computeContentMeasure(this.outerMeasure);
      this.contentExtent = this._computeContentExtent(this.outerExtent);
    },
    clone : function(css){
      // no one can clone root style.
      if(this.parent === null){
	return this.createChild("div", css);
      }
      return new StyleContext(this.markup.clone(), this.parent, {forceCss:(css || {})});
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
	//console.log("remove child:%o", removed_child);
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
      var classes = ["nehan-block", "nehan-" + this.getMarkupName()];
      var box = new Box(box_size, this);
      box.display = (this.display === "inline-block")? this.display : "block";
      box.edge = this.edge || null; // for Box::getLayoutExtent, Box::getLayoutMeasure
      box.elements = elements;
      box.classes = classes;
      box.charCount = List.fold(elements, 0, function(total, element){
	return total + (element? (element.charCount || 0) : 0);
      });
      return box;
    },
    createImage : function(){
      var measure = this.contentMeasure;
      var extent = this.contentExtent;

      // image size always considered as horizontal mode.
      var image_size = BoxFlows.getByName("lr-tb").getBoxSize(measure, extent);
      var image = new Box(image_size, this);
      image.display = this.display; // inline/block
      image.edge = this.edge || null;
      image.classes = ["nehan-block", "nehan-image"];
      image.charCount = 0;
      if(this.isPushed()){
	image.pushed = true;
      } else if(this.isPulled()){
	image.pulled = true;
      }
      return image;
    },
    createLine : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var child_lines = this._filterChildLines(elements);
      var max_font_size = this._computeMaxLineFontSize(child_lines);
      var max_extent = this._computeMaxLineExtent(child_lines, max_font_size);
      var measure = (this.parent && opt.measure && this.staticMeasure === null && !this.isRootLine())? opt.measure : this.contentMeasure;
      var extent = (this.isRootLine() && child_lines.length > 0)? max_extent : this.getAutoLineExtent();
      var line_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()];
      var line = new Box(line_size, this);
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.elements = opt.elements || [];
      line.classes = this.isRootLine()? classes : classes.concat("nehan-" + this.markup.getName());
      line.charCount = opt.charCount || 0;

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
	content = content.replace(rex_first_letter, function(match, p1, p2, p3){
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
    getParentChildsOfType : function(markup_name){
      return List.filter(this.getParentChilds(), function(child){
	return child.getMarkupName() === markup_name;
      });
    },
    getParentFlow : function(){
      return this.parent? this.parent.flow : this.flow;
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
      if(this.isTextEmphaEnable()){
	return this.getEmphaLineExtent();
      }
      if(this.getMarkupName() === "ruby"){
	return this.getRubyLineExtent();
      }
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
      if(this.background){
	Args.copy(css, this.background.getCss(this.flow));
      }
      if(this.letterSpacing && !this.flow.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      if(this.floatDirection){
	Args.copy(css, this.floatDirection.getCss(this.flow));
      }
      css.overflow = "hidden"; // to avoid margin collapsing
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
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
      if(this.background){
	Args.copy(css, this.background.getCss());
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
	// if not child text element with same font size, ignore.
	if(!line.style.isTextEmphaEnable() && line.style.getMarkupName() !== "ruby" && font_size === base_font_size){
	  return;
	}
	// baseline is not applicative to image element.
	if(line.style && line.style.getMarkupName() === "img"){
	  return;
	}
	// child text element with different font-size must be fixed baseline.
	if(text_center_offset > 0){
	  line.edge = line.style.edge? line.style.edge.clone() : new BoxEdge(); // set line.edge(not line.style.edge) to overwrite padding temporally.
	  line.edge.padding.setAfter(flow, text_center_offset); // set new edge(use line.edge not line.style.edge)
	  line.size.setExtent(flow, max_extent - text_center_offset); // set new size
	  Args.copy(line.css, line.edge.getCss(flow)); // overwrite edge
	  Args.copy(line.css, line.size.getCss(flow)); // overwrite size
	}
      });
    },
    _loadSelectorCss : function(markup, parent){
      switch(markup.getName()){
      case "before":
      case "after":
      case "first-letter":
      case "first-line":
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
    // engine.setStyle("p.more-than-extent-100", {
    //   "onload" : function(style, context){
    //	    if(context.getBlockRestExtent() < 100){
    //        return {"page-break-before":"always"};
    //      }
    //   }
    // });
    _loadCallbackCss : function(name, context){
      var callback = this.getSelectorCssAttr(name);
      if(callback === null){
	return {};
      }
      if(typeof callback === "function"){
	return callback(this, context || null) || {};
      }
      if(typeof callback === "object"){
	return callback;
      }
      return {};
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
    _loadStaticMeasure : function(){
      var prop = this.flow.getPropMeasure();
      //var max_size = this.getRootMeasure(); // this value is required when static size is set by '%' value.
      var max_size = Layout.getMeasure(this.flow); // this value is required when static size is set by '%' value.
      var static_size = this.getAttr(prop) || this.getAttr("measure") || this.getCssAttr(prop) || this.getCssAttr("measure");
      return static_size? UnitSize.getBoxSize(static_size, this.font.size, max_size) : null;
    },
    _loadStaticExtent : function(){
      var prop = this.flow.getPropExtent();
      //var max_size = this.getRootExtent(); // this value is required when static size is set by '%' value.
      var max_size = Layout.getExtent(this.flow); // this value is required when static size is set by '%' value.
      var static_size = this.getAttr(prop) || this.getAttr("extent") || this.getCssAttr(prop) || this.getCssAttr("extent");
      return static_size? UnitSize.getBoxSize(static_size, this.font.size, max_size) : null;
    }
  };

  return StyleContext;
})();

