var StyleContext = (function(){

  // parent : parent style context
  function StyleContext(markup, parent){
    this.markup = this._inheritMarkup(markup, parent);
    this.parent = parent;
    this.display = this._loadDisplay(markup); // required
    this.flow = this._loadFlow(markup, parent); // required
    this.boxSizing = this._loadBoxSizing(markup); // required
    this.childs = []; // children for this style, updated by _appendChild
    var color = this._loadColor(markup, parent);
    if(color){
      this.color = color;
    }
    var font = this._loadFont(markup, parent);
    if(font){
      this.font = font;
    }
    var position = this._loadPosition(markup, parent);
    if(position){
      this.position = position;
    }
    var edge = this._loadEdge(markup, this.flow, this.font);
    if(edge){
      this.edge = edge;
    }
    var line_rate = this._loadLineRate(markup, parent);
    if(line_rate){
      this.lineRate = line_rate;
    }
    var text_align = this._loadTextAlign(markup, parent);
    if(text_align){
      this.textAlign = text_align;
    }
    var text_empha = this._loadTextEmpha(markup, parent);
    if(text_empha){
      this.textEmpha = text_empha;
    }
    var pushed = this._loadPushedAttr(markup);
    if(pushed){
      this.pushed = true;
    }
    var pulled = this._loadPulledAttr(markup);
    if(pulled){
      this.pulled = true;
    }
    var list_style = this._loadListStyle(markup);
    if(list_style){
      this.listStyle = list_style;
    }
    var logical_float = this._loadLogicalFloat(markup);
    if(logical_float){
      this.logicalFloat = logical_float;
    }
    /* TODO
    var logical_break_before = this._loadLogicalBreakBefore(markup);
    if(logical_break_before){
      this.logicalBreakBefore = logical_break;
    }
    var logical_break_after = this._loadLogicalBreakAfter(markup);
    if(logical_break_after){
      this.logicalBreakAfter = logical_break_after;
    }*/

    if(this.parent){
      this.parent._appendChild(this);
    }
  }

  StyleContext.prototype = {
    clone : function(css){
      // no one can clone root style.
      if(this.parent === null){
	return this.createChild("div", css);
      }
      var tag = this.markup.clone();
      tag.setCssAttrs(css || {}); // set dynamic styles
      return new StyleContext(tag, this.parent || null);
    },
    // inherit style with tag_name and css(optional).
    createChild : function(tag_name, css){
      var tag = new Tag("<" + tag_name + ">");
      tag.setCssAttrs(css || {}); // set dynamic styles
      var style = new StyleContext(tag, this);

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
      var measure = opt.measure || this.getStaticMeasure() || this.getContentMeasure();
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
      image.display = this.display;
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
      }
      return line;
    },
    isBlock : function(){
      return this.display === "block";
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
      return this.display === "block";
    },
    isHeader : function(){
      return this.markup.isHeaderTag();
    },
    isFloatStart : function(){
      return this.logicalFloat && this.logicalFloat.isStart();
    },
    isFloatEnd : function(){
      return this.logicalFloat && this.logicalFloat.isEnd();
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
    isFirstChild : function(){
      return this.parent? this.parent.getNthChild(0) === this : false;
    },
    getMarkupName : function(){
      return this.markup.getName();
    },
    getMarkupContent : function(){
      return this.markup.getContent();
    },
    getMarkupPos : function(){
      return this.markup.pos;
    },
    getMarkupAttr : function(name){
      return this.markup.getAttr(name);
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
      var count = this.markup.getCssAttr("orphans");
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
      var static_size = this.markup.getAttr(this.flow.getPropMeasure()) || this.markup.getAttr("measure");
      return static_size? UnitSize.getBoxSize(static_size, this.font.size, max_size) : null;
    },
    getStaticExtent : function(){
      var max_size = this.getLogicalMaxExtent(); // this value is required when static size is set by '%' value.
      var static_size = this.markup.getAttr(this.flow.getPropExtent()) || this.markup.getAttr("extent");
      return static_size? UnitSize.getBoxSize(static_size, this.font.size, max_size) : null;
    },
    getLayoutMeasure : function(){
      var prop = this.flow.getPropMeasure();
      var size = this.markup.getAttr("measure") || this.markup.getAttr(prop) || Layout[prop];
      return parseInt(size, 10);
    },
    getLayoutExtent : function(){
      var prop = this.flow.getPropExtent();
      var size = this.markup.getAttr("extent") || this.markup.getAttr(prop) || Layout[prop];
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
      if(this.edge && !this.isRootLine()){
	Args.copy(css, this.edge.getCss());
      }
      // top level line need to follow parent blockflow.
      if(this.isRootLine()){
	Args.copy(css, this.flow.getCss());
      } else {
	css["text-align"] = "left";
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
      if(this.logicalFloat){
	Args.copy(css, this.logicalFloat.getCss(this.flow));
      }
      css.overflow = "hidden"; // to avoid margin collapsing
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      return css;
    },
    _inheritMarkup : function(markup, parent){
      var parent_markup = parent? parent.markup : null;
      markup = markup.inherit(parent_markup);
      var onload = markup.getCssAttr("onload");
      if(onload){
	markup.setCssAttrs(onload(markup) || {});
      }
      var nth_child = markup.getCssAttr("nth-child");
      if(nth_child){
	markup.setCssAttrs(nth_child(this.getChildIndex(), markup) || {});
      }
      var nth_of_type = markup.getCssAttr("nth-of-type");
      if(nth_of_type){
	markup.setCssAttrs(nth_of_type(this.getChildIndexOfType(), markup) || {});
      }
      return markup;
    },
    _appendChild : function(child_style){
      this.childs.push(child_style);
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
	if(line.style && line.style.markup.getName() === "img"){
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
    _loadDisplay : function(markup){
      return markup.getCssAttr("display", "inline");
    },
    _loadFlow : function(markup, parent){
      var value = markup.getCssAttr("flow", "inherit");
      var parent_flow = parent? parent.flow : Layout.getStdBoxFlow();
      if(value === "inherit"){
	return parent_flow;
      }
      if(value === "flip"){
	return parent_flow.getFlipFlow();
      }
      return BoxFlows.getByName(value);
    },
    _loadPosition : function(markup){
      var value = markup.getCssAttr("position", "relative");
      return new BoxPosition(value, {
	top: markup.getCssAttr("top", "auto"),
	left: markup.getCssAttr("left", "auto"),
	right: markup.getCssAttr("right", "auto"),
	bottom: markup.getCssAttr("bottom", "auto")
      });
    },
    _loadColor : function(markup){
      var value = markup.getCssAttr("color", "inherit");
      if(value !== "inherit"){
	return new Color(value);
      }
    },
    _loadFont : function(markup, parent){
      var parent_font_size = parent? parent.font.size : Layout.fontSize;
      var font = new Font(parent_font_size);
      var font_size = markup.getCssAttr("font-size", "inherit");
      if(font_size !== "inherit"){
	font.size = UnitSize.getFontSize(font_size, parent_font_size);
      }
      var font_family = markup.getCssAttr("font-family", "inherit");
      if(font_family !== "inherit"){
	font.family = font_family;
      } else if(parent === null){
	font.family = Layout.getStdFontFamily();
      }
      var font_weight = markup.getCssAttr("font-weight", "inherit");
      if(font_weight !== "inherit"){
	font.weight = font_weight;
      }
      var font_style = markup.getCssAttr("font-style", "inherit");
      if(font_style !== "inherit"){
	font.style = font_style;
      }
      return font;
    },
    _loadBoxSizing : function(markup){
      return markup.getCssAttr("box-sizing", "margin-box");
    },
    _loadEdge : function(markup, flow, font){
      var padding = markup.getCssAttr("padding");
      var margin = markup.getCssAttr("margin");
      var border_width = markup.getCssAttr("border-width");
      if(padding === null && margin === null && border_width === null){
	return null;
      }
      var edge = new BoxEdge();
      if(padding){
	edge.padding.setSize(flow, UnitSize.getEdgeSize(padding, font.size));
      }
      if(margin){
	edge.margin.setSize(flow, UnitSize.getEdgeSize(margin, font.size));
      }
      if(border_width){
	edge.border.setSize(flow, UnitSize.getEdgeSize(border_width, font.size));
      }
      var border_radius = markup.getCssAttr("border-radius");
      if(border_radius){
	edge.setBorderRadius(flow, UnitSize.getCornerSize(border_radius, font.size));
      }
      var border_color = markup.getCssAttr("border-color");
      if(border_color){
	edge.setBorderColor(flow, border_color);
      }
      var border_style = markup.getCssAttr("border-style");
      if(border_style){
	edge.setBorderStyle(flow, border_style);
      }
      return edge;
    },
    _loadLineRate : function(markup, parent){
      var value = markup.getCssAttr("line-rate");
      var parent_line_rate = parent? parent.lineRate : Layout.lineRate;
      return (value === "inherit")? parent_line_rate : parseFloat(value);
    },
    _loadTextAlign : function(markup, parent){
      var value = markup.getCssAttr("text-align", "inherit");
      var parent_text_align = parent? parent.textAlign : "start";
      return (value === "inherit")? parent_text_align : new TextAlign(value);
    },
    _loadTextEmpha : function(markup, parent){
      var parent_color = parent? parent.getColor() : Layout.fontColor;
      var empha_style = markup.getCssAttr("text-emphasis-style", "none");
      if(empha_style === "none" || empha_style === "inherit"){
	return null;
      }
      var empha_pos = markup.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = markup.getCssAttr("text-emphasis-color", parent_color);
      return new TextEmpha({
	style:new TextEmphaStyle(empha_style),
	pos:new TextEmphaPos(empha_pos),
	color:new Color(empha_color)
      });
    },
    _loadTextEmphaStyle : function(markup, parent){
      var value = markup.getCssAttr("text-emphasis-style", "inherit");
      return (value !== "inherit")? new TextEmphaStyle(value) : null;
    },
    _loadTextEmphaPos : function(markup, parent){
      return markup.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
    },
    _loadTextEmphaColor : function(markup, parent, color){
      return markup.getCssAttr("text-emphasis-color", color.getValue());
    },
    _loadLogicalFloat : function(markup){
      var name = markup.getCssAttr("float", "none");
      if(name === "none"){
	return null;
      }
      return LogicalFloats.get(name);
    },
    _loadLogicalBreakBefore : function(markup){
      return null; // TODO
    },
    _loadLogicalBreakAfter : function(markup){
      return null; // TODO
    },
    _loadListStyle : function(markup){
      var list_style_type = markup.getCssAttr("list-style-type", "none");
      if(list_style_type === "none"){
	return null;
      }
      return new ListStyle({
	type:list_style_type,
	position:markup.getCssAttr("list-style-position", "outside"),
	image:markup.getCssAttr("list-style-image", "none"),
	format:markup.getCssAttr("list-style-format")
      });
    },
    _loadLetterSpacing : function(markup, parent, font){
      var letter_spacing = markup.getCssAttr("letter-spacing");
      if(letter_spacing){
	return UnitSize.getUnitSize(letter_spacing, font.size);
      }
    },
    _loadBackground : function(markup, parent){
      var background = new Background();
      var bg_color = markup.getCssAttr("background-color");
      if(bg_color){
	background.color = new Color(bg_color);
      }
      var bg_image = markup.getCssAttr("background-image");
      if(bg_image){
	background.image = bg_image;
      }
      var bg_pos = markup.getCssAttr("background-position");
      if(bg_pos){
	background.pos = new BackgroundPos2d(
	  new BackgroundPos(bg_pos.inline, bg_pos.offset),
	  new BackgroundPos(bg_pos.block, bg_pos.offset)
	);
      }
      var bg_repeat = markup.getCssAttr("background-repeat");
      if(bg_repeat){
	background.repeat = new BackgroundRepeat2d(
	  new BackgroundRepeat(bg_repeat.inline),
	  new BackgroundRepeat(bg_repeat.block)
	);
      }
    },
    _loadPushedAttr : function(markup){
      return markup.getAttr("pushed") !== null;
    },
    _loadPulledAttr : function(markup){
      return markup.getAttr("pulled") !== null;
    }
  };

  return StyleContext;
})();

