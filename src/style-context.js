var StyleContext = (function(){

  // to fetch first text part from content html.
  var __rex_first_letter = /(^(<[^>]+>|[\s\n])*)(\S)/mi;
  
  // these markups are not parsed, just ignored.
  var __disabled_markups = [
    "script",
    "noscript",
    "style",
    "iframe",
    "form",
    "input",
    "select",
    "button",
    "textarea"
  ];

  // these properties must be under control of layout engine.
  var __managed_css_props = [
    "border-color",
    "border-radius",
    "border-style",
    "border-width",
    "box-sizing",
    "break-after",
    "break-before",
    "color",
    "display",
    "extent",
    "embeddable", // flag
    "float",
    "flow",
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "height",
    "interactive", // flag
    "letter-spacing",
    //"line-height",
    "list-style-type",
    "list-style-position",
    "list-style-image",
    "margin",
    "measure",
    "meta", // flag
    "padding",
    "position",
    "section", // flag
    "section-root", // flag
    "text-align",
    "text-emphasis-style",
    "text-emphasis-position",
    "text-emphasis-color",
    "text-combine",
    "width",
    "word-break"
  ];

  // these property are special functional properties
  var __callback_css_props = [
    "onload",
    "oncreate",
    "onblock",
    "online",
    "ontext"
  ];

  var __is_managed_css_prop = function(prop){
    return Nehan.List.exists(__managed_css_props, Nehan.Closure.eq(prop));
  };

  var __is_callback_css_prop = function(prop){
    return Nehan.List.exists(__callback_css_props, Nehan.Closure.eq(prop));
  };

  /**
     @memberof Nehan
     @class StyleContext
     @classdesc abstraction of document tree hierarchy with selector values, associated markup, cursor_context.
     @constructor
     @param markup {Nehan.Tag} - markup of style
     @param paernt {Nehan.StyleContext} - parent style context
     @param args {Object} - option arguments
     @param args.forceCss {Object} - system css that must be applied.
     @param args.cursorContext {Nehan.LayoutContext} - cursor context at the point of this style context created.
  */
  function StyleContext(markup, parent, args){
    this._initialize(markup, parent, args);
  }

  StyleContext.prototype = {
    _initialize : function(markup, parent, args){
      args = args || {};
      this.markup = markup;
      this.markupName = markup.getName();
      this.parent = parent || null;

      // notice that 'this.childs' is not children of each page.
      // for example, assume that <body> consists 2 page(<div1>, <div2>).
      //
      // <body><div1>page1</div1><div2>page2</div2></body>
      //
      // at this case, global chilren of <body> is <div1> and <div2>.
      // but for '<body> of page1', <div1> is the only child, and <div2> is for '<body> of page2' also.
      // so we may create 'contextChilds' to distinguish these difference.
      this.childs = [];

      this.next = null; // next sibling
      this.prev = null; // prev sibling

      // initialize tree
      if(parent){
	parent.appendChild(this);
      }

      // create context for each functional css property.
      this.selectorPropContext = new SelectorPropContext(this, args.cursorContext || null);

      // create selector callback context,
      // this context is passed to "onload" callback.
      // unlike selector-context, this context has reference to all css values associated with this style.
      // because 'onload' callback is called after loading selector css.
      // notice that at this phase, css values are not converted into internal style object.
      // so by updating css value, you can update calculation of internal style object.
      this.selectorContext = new SelectorContext(this, args.cursorContext || null);

      this.managedCss = new Nehan.CssHashSet();
      this.unmanagedCss = new Nehan.CssHashSet();
      this.callbackCss = new Nehan.CssHashSet();

      // load managed css from
      // 1. load selector css.
      // 2. load inline css from 'style' property of markup.
      // 3. load callback css 'onload'.
      // 4. load system required css(args.forceCss).
      this._registerCssValues(this._loadSelectorCss(markup, parent));
      this._registerCssValues(this._loadInlineCss(markup));
      var onload = this.callbackCss.get("onload");
      if(onload){
	this._registerCssValues(onload(this.selectorContext));
      }
      this._registerCssValues(args.forceCss || {});

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
      var border_collapse = this._loadBorderCollapse();
      if(border_collapse){
	this.borderCollapse = border_collapse;
      }
      var edge = this._loadEdge(this.flow, this.getFontSize());
      if(edge){
	this.edge = edge;
      }
      var line_height = this._loadLineHeight();
      if(line_height){
	this.lineHeight = line_height;
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
      var clear = this._loadClear();
      if(clear){
	this.clear = clear;
      }
      var break_before = this._loadBreakBefore();
      if(break_before){
	this.breakBefore = break_before;
      }
      var break_after = this._loadBreakAfter();
      if(break_after){
	this.breakAfter = break_after;
      }
      var word_break = this._loadWordBreak();
      if(word_break){
	this.wordBreak = word_break;
      }
      var white_space = this._loadWhiteSpace();
      if(white_space){
	this.whiteSpace = white_space;
      }
      // static size is defined in selector or tag attr, hightest priority
      this.staticMeasure = this._loadStaticMeasure();
      this.staticExtent = this._loadStaticExtent();

      // context size(outer size and content size) is defined by
      // 1. current static size
      // 2. parent size
      // 3. current edge size.
      this.initContextSize(this.staticMeasure, this.staticExtent);

      // margin or edge collapse after context size is calculated.
      if(this.edge){
	if(this.edge.margin){
	  this._collapseMargin();
	}
	// border collapse after context size is calculated.
	if(this.edge.border && this.getBorderCollapse() === "collapse" && this.display !== "table"){
	  this._collapseBorder(this.edge.border);
	}
      }

      // disable some unmanaged css properties depending on loaded style values.
      this._disableUnmanagedCssProps(this.unmanagedCss);
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.OutlinContext}
    */
    getOutlineContext : function(){
      return this.outlineContext || this.parent.getOutlineContext();
    },
    /**
       called when section root(body, blockquote, fieldset, figure, td) starts.

       @memberof Nehan.StyleContext
    */
    startOutlineContext : function(){
      this.outlineContext = new Nehan.OutlineContext(this.getMarkupName());
    },
    /**
       called when section root(body, blockquote, fieldset, figure, td) ends.

       @memberof Nehan.StyleContext
       @method endOutlineContext
    */
    endOutlineContext : function(){
      DocumentContext.addOutlineContext(this.getOutlineContext());
    },
    /**
       called when section content(article, aside, nav, section) starts.

       @memberof Nehan.StyleContext
       @method startSectionContext
    */
    startSectionContext : function(){
      this.getOutlineContext().startSection({
	type:this.getMarkupName(),
	pageNo:DocumentContext.getPageNo()
      });
    },
    /**
       called when section content(article, aside, nav, section) ends.

       @memberof Nehan.StyleContext
       @method startSectionContext
    */
    endSectionContext : function(){
      this.getOutlineContext().endSection(this.getMarkupName());
    },
    /**
       called when heading content(h1-h6) starts.

       @memberof Nehan.StyleContext
       @method startHeaderContext
       @return {string} header id
    */
    startHeaderContext : function(opt){
      return this.getOutlineContext().addHeader({
	headerId:DocumentContext.genHeaderId(),
	pageNo:DocumentContext.getPageNo(),
	type:opt.type,
	rank:opt.rank,
	title:opt.title
      });
    },
    /**
       calculate contexual box size of this style.

       @memberof Nehan.StyleContext
       @method initContextSize
       @param measure {int}
       @param extent {int}
       @description <pre>
       * [context_size] = (outer_size, content_size)

       * (a) outer_size
       * 1. if direct size is given, use it as outer_size.
       * 2. else if parent exists, use content_size of parent.
       * 3. else if parent not exists(root), use layout size defined in display.js.
      
       * (b) content_size
       * 1. if edge(margin/padding/border) is defined, content_size = outer_size - edge_size
       * 2. else(no edge),  content_size = outer_size
       *</pre>
    */
    initContextSize : function(measure, extent){
      this.initContextMeasure(measure);
      this.initContextExtent(extent);
    },
    /**
       calculate contexual box measure

       @memberof Nehan.StyleContext
       @method initContextMeasure
       @param measure {int}
    */
    initContextMeasure : function(measure){
      this.outerMeasure = measure  || (this.parent? this.parent.contentMeasure : Nehan.Display.getMeasure(this.flow));
      this.contentMeasure = this._computeContentMeasure(this.outerMeasure);
    },
    /**
       calculate contexual box extent

       @memberof Nehan.StyleContext
       @method initContextExtent
       @param extent {int}
    */
    initContextExtent : function(extent){
      this.outerExtent = extent || (this.parent? this.parent.contentExtent : Nehan.Display.getExtent(this.flow));
      this.contentExtent = this._computeContentExtent(this.outerExtent);
    },
    /**
     update context size, but static size is preferred, called from {@link Nehan.FlipGenerator}.

     @memberof Nehan.StyleContext
     @method updateContextSize
     @param measure {int}
     @param extent {int}
    */
    updateContextSize : function(measure, extent){
      this.forceUpdateContextSize(this.staticMeasure || measure, this.staticExtent || extent);
    },
    /**
       force update context size, called from generator of floating-rest-generator.

       @memberof Nehan.StyleContext
       @param measure {int}
       @param extent {int}
    */
    forceUpdateContextSize : function(measure, extent){
      // measure block size of marker block size or table is always fixed.
      if(this.markupName === "li-marker" || this.display === "table"){
	return;
      }
      this.initContextSize(measure, extent);

      // force re-culculate context-size of children based on new context-size of parent.
      Nehan.List.iter(this.childs, function(child){
	child.forceUpdateContextSize(null, null);
      });
    },
    /**
       clone style-context with temporary css

       @memberof Nehan.StyleContext
       @param css {Object}
       @return {Nehan.StyleContext}
    */
    clone : function(css){
      // no one can clone root style.
      var clone_style = this.parent? new StyleContext(this.markup, this.parent, {forceCss:(css || {})}) : this.createChild("div", css);
      if(clone_style.parent){
	clone_style.parent.removeChild(clone_style);
      }
      clone_style.setClone(true);
      return clone_style;
    },
    /**
       append child style context

       @memberof Nehan.StyleContext
       @param child_style {Nehan.StyleContext}
    */
    appendChild : function(child_style){
      if(this.childs.length > 0){
	var last_child = Nehan.List.last(this.childs);
	last_child.next = child_style;
	child_style.prev = last_child;
      }
      this.childs.push(child_style);
    },
    /**
       @memberof Nehan.StyleContext
       @param child_style {Nehan.StyleContext}
       @return {Nehan.StyleContext | null} removed child or null if nothing removed.
    */
    removeChild : function(child_style){
      var index = Nehan.List.indexOf(this.childs, function(child){
	return child === child_style;
      });
      if(index >= 0){
	var removed_child = this.childs.splice(index, 1);
	return removed_child;
      }
      return null;
    },
    /**
       inherit style with tag_name and css(optional).

       @memberof Nehan.StyleContext
       @param tag_name {String}
       @param css {Object}
       @param tag_attr {Object}
       @return {Nehan.StyleContext}
    */
    createChild : function(tag_name, css, tag_attr){
      var tag = new Nehan.Tag("<" + tag_name + ">");
      tag.setAttrs(tag_attr || {});
      return new StyleContext(tag, this, {forceCss:(css || {})});
    },
    /**
       calclate max marker size by total child_count(item_count).

       @memberof Nehan.StyleContext
       @param item_count {int}
    */
    setListItemCount : function(item_count){
      var max_marker_html = this.getListMarkerHtml(item_count);
      // create temporary inilne-generator but using clone style, this is because sometimes marker html includes "<span>" element,
      // and we have to avoid 'appendChild' from child-generator of this tmp generator.
      var tmp_gen = new InlineGenerator(this.clone(), new Nehan.TokenStream(max_marker_html));
      var line = tmp_gen.yield();
      var marker_measure = line? line.inlineMeasure + Math.floor(this.getFontSize() / 2) : this.getFontSize();
      var marker_extent = line? line.size.getExtent(this.flow) : this.getFontSize();
      this.listMarkerSize = this.flow.getBoxSize(marker_measure, marker_extent);
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isClone : function(){
      return this._isClone || false;
    },
    /**
       @memberof Nehan.StyleContext
       @param state {boolean}
    */
    setClone : function(state){
      this._isClone = state;
    },
    /**
     @memberof Nehan.StyleContext
     @return {bool}
    */
    isFloatClear : function(){
      return this.clear && !this.clear.isDone();
    },
    /**
     @memberof Nehan.StyleContext
     @param status {bool}
     */
    setFloatClear : function(status){
      if(this.clear){
	this.clear.setDone(status);
      }
    },
    /**
       @memberof Nehan.StyleContext
       @param opt {Object}
       @param opt.extent {int}
       @param opt.elements {Array.<Nehan.Box>}
       @param opt.breakAfter {boolean}
       @param opt.blockId {int}
       @param opt.rootBlockId {int}
       @param opt.content {String}
       @return {Nehan.Box}
    */
    createBlock : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var measure = this.contentMeasure;
      var extent = this.contentExtent;

      // if elements under <body>, staticExtent or context extent(opt.extent) is available.
      if(this.parent && opt.extent){
	extent = this.staticExtent || opt.extent;
      }

      var edge = this.edge || null;
      if(edge && (!opt.useBeforeEdge || !opt.useAfterEdge) && this.markupName !== "hr"){
	edge = edge.clone();
	if(!opt.useBeforeEdge){
	  edge.clearBefore(this.flow);
	}
	if(!opt.useAfterEdge){
	  edge.clearAfter(this.flow);
	}
      }

      var classes = ["nehan-block", "nehan-" + this.getMarkupName()].concat(this.markup.getClasses());
      var box_size = this.flow.getBoxSize(measure, extent);
      var box = new Box(box_size, this);
      if(this.markup.isHeaderTag()){
	classes.push("nehan-header");
      }
      if(this.isClone()){
	classes.push("nehan-clone");
      }
      if(typeof opt.rootBlockId !== "undefined"){
	box.rootBlockId = opt.rootBlockId;
      }
      box.blockId = opt.blockId;
      box.display = (this.display === "inline-block")? this.display : "block";
      box.edge = edge;
      box.addElements(elements);
      box.classes = classes;
      box.charCount = Nehan.List.fold(elements, 0, function(total, element){
	return total + (element.charCount || 0);
      });
      box.breakAfter = this.isBreakAfter() || opt.breakAfter || false;
      box.content = opt.content || null;
      box.isFirst = opt.isFirst || false;
      box.isLast = opt.isLast || false;
      box.restExtent = opt.restExtent || 0;
      box.restMeasure = opt.restMeasure || 0;
      if(this.isPushed()){
	box.pushed = true;
      } else if(this.isPulled()){
	box.pulled = true;
      }
      //console.log("[%s]block(%o):%s:(%d,%d)", this.markupName, box, box.toString(), box.size.width, box.size.height);
      return box;
    },
    /**
       @memberof Nehan.StyleContext
       @param opt
       @param opt.breakAfter {boolean}
       @return {Nehan.Box}
    */
    createImage : function(opt){
      opt = opt || {};
      // image size always considered as horizontal mode.
      var width = this.getMarkupAttr("width")? parseInt(this.getMarkupAttr("width"), 10) : (this.staticMeasure || this.getFontSize());
      var height = this.getMarkupAttr("height")? parseInt(this.getMarkupAttr("height"), 10) : (this.staticExtent || this.getFontSize());
      var classes = ["nehan-block", "nehan-image"].concat(this.markup.getClasses());
      var image_size = new Nehan.BoxSize(width, height);
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
    /**
       @memberof Nehan.StyleContext
       @param opt
       @param opt.measure {int}
       @param opt.content {String}
       @param opt.charCount {int}
       @param opt.elements {Array.<Nehan.Box>}
       @param opt.maxFontSize {int}
       @param opt.maxExtent {int}
       @param opt.lineBreak {boolean}
       @param opt.breakAfter {boolean}
       @return {Nehan.Box}
    */
    createLine : function(opt){
      opt = opt || {};
      var is_root_line = this.isRootLine();
      var elements = opt.elements || [];
      var max_font_size = opt.maxFontSize || this.getFontSize();
      var max_extent = opt.maxExtent || this.staticExtent || 0;
      var char_count = opt.charCount || 0;
      var content = opt.content || null;
      var measure = this.contentMeasure;
      if((this.parent && opt.measure && !is_root_line) || (this.display === "inline-block")){
	measure = this.staticMeasure || opt.measure;
      }
      var line_size = this.flow.getBoxSize(measure, max_extent);
      var classes = ["nehan-inline", "nehan-inline-" + this.flow.getName()].concat(this.markup.getClasses());
      var line = new Box(line_size, this, "line-block");
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.addElements(elements);
      line.classes = is_root_line? classes : classes.concat("nehan-" + this.getMarkupName());
      line.charCount = char_count;
      line.maxFontSize = max_font_size;
      line.maxExtent = max_extent;
      line.content = content;
      line.isRootLine = is_root_line;
      line.lineBreak = opt.lineBreak || false;

      // edge of top level line is disabled.
      // for example, consider '<p>aaa<span>bbb</span>ccc</p>'.
      // anonymous line block('aaa' and 'ccc') is already edged by <p> in block level.
      // so if line is anonymous, edge must be ignored.
      line.edge = (this.edge && !is_root_line)? this.edge : null;

      // backup other line data. mainly required to restore inline-context.
      if(is_root_line){
	line.lineNo = opt.lineNo;
	line.breakAfter = opt.breakAfter || false;
	line.justified = opt.justified || false;
	line.inlineMeasure = opt.measure || this.contentMeasure;

	// if vertical line, needs some position fix for decorated element(ruby, empha) to align baseline.
	if(this.isTextVertical()){
	  this._setVertBaseline(line);
	} else {
	  this._setHoriBaseline(line);
	}
	if(this.textAlign && !this.textAlign.isStart()){
	  this._setTextAlign(line, this.textAlign);
	}
	var edge_size = Math.floor(line.maxFontSize * this.getLineHeight()) - line.maxExtent;
	if(line.elements.length > 0 && edge_size > 0){
	  line.edge = new Nehan.BoxEdge();
	  line.edge.padding.setBefore(this.flow, (line.lineNo > 0)? edge_size : Math.floor(edge_size / 2));
	}
      }
      //console.log("line(%o):%s:(%d,%d), is_root:%o", line, line.toString(), line.size.width, line.size.height, is_root_line);
      return line;
    },
    /**
       @memberof Nehan.StyleContext
       @param opt
       @param opt.measure {int}
       @param opt.content {String}
       @param opt.charCount {int}
       @param opt.elements {Array.<Nehan.Char | Nehan.Word | Nehan.Tcy>}
       @param opt.maxFontSize {int}
       @param opt.maxExtent {int}
       @param opt.lineBreak {boolean}
       @param opt.breakAfter {boolean}
       @return {Nehan.Box}
    */
    createTextBlock : function(opt){
      opt = opt || {};
      var elements = opt.elements || [];
      var font_size = this.getFontSize();
      var extent = opt.maxExtent || font_size;
      var measure = opt.measure;
      var char_count = opt.charCount || 0;
      var content = opt.content || null;

      if(opt.isEmpty){
	extent = 0;
      } else if(this.isTextEmphaEnable()){
	extent = this.getEmphaTextBlockExtent();
      } else if(this.markup.name === "ruby"){
	extent = this.getRubyTextBlockExtent();
      }
      var line_size = this.flow.getBoxSize(measure, extent);
      var classes = ["nehan-text-block"].concat(this.markup.getClasses());
      var line = new Box(line_size, this, "text-block");
      line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
      line.addElements(elements);
      line.classes = classes;
      line.charCount = char_count;
      line.maxFontSize = font_size;
      line.maxExtent = extent;
      line.content = content;
      line.lineBreak = opt.lineBreak || false;
      line.justified = opt.justified || false;
      line.lineOver = opt.lineOver || false;
      //console.log("text(%o):%s:(%d,%d)", line, line.toString(), line.size.width, line.size.height);
      return line;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isDisabled : function(){
      if(this.display === "none"){
	return true;
      }
      if(Nehan.List.exists(__disabled_markups, Nehan.Closure.eq(this.getMarkupName()))){
	return true;
      }
      if(this.contentMeasure <= 0 || this.contentExtent <= 0){
	return true;
      }
      if(this.markup.isCloseTag()){
	return true;
      }
      if(!this.markup.isSingleTag() && this.isMarkupEmpty() && this.getContent() === ""){
	return true;
      }
      return false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
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
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isRoot : function(){
      return this.parent === null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isChildBlock : function(){
      return this.isBlock() && !this.isRoot();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isInlineBlock : function(){
      return this.display === "inline-block";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isInline : function(){
      return this.display === "inline";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isRootLine : function(){
      // check if current inline is anonymous line block.
      // 1. line-object is just under the block element.
      //  <body>this text is included in anonymous line block</body>
      //
      // 2. line-object is just under the inline-block element.
      //  <div style='display:inline-block'>this text is included in anonymous line block</div>
      return this.isBlock() || this.isInlineBlock();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFloatStart : function(){
      return this.floatDirection && this.floatDirection.isStart();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFloatEnd : function(){
      return this.floatDirection && this.floatDirection.isEnd();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFloated : function(){
      return this.isFloatStart() || this.isFloatEnd();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPushed : function(){
      return this.getMarkupAttr("pushed") !== null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPulled : function(){
      return this.getMarkupAttr("pulled") !== null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPasted : function(){
      return this.getMarkupAttr("pasted") !== null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isLineBreak : function(){
      return this.markupName === "br";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isTextEmphaEnable : function(){
      return (this.textEmpha && this.textEmpha.isEnable())? true : false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPositionAbsolute : function(){
      return this.position.isAbsolute();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPre : function(){
      return this.whiteSpace === "pre";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isPageBreak : function(){
      switch(this.getMarkupName()){
      case "page-break": case "end-page": case "pbr":
	return true;
      default:
	return false;
      }
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isBreakBefore : function(){
      return this.breakBefore? !this.breakBefore.isAvoid() : false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isBreakAfter : function(){
      return this.breakAfter? !this.breakAfter.isAvoid() : false;
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFirstLine : function(){
      return this.markupName === "first-line";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFirstChild : function(){
      return this.markup.isFirstChild();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isFirstOfType : function(){
      return this.markup.isFirstOfType();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isLastChild : function(){
      return this.markup.isLastChild();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isLastOfType : function(){
      return this.markup.isLastOfType();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isOnlyChild : function(){
      return this.markup.isOnlyChild();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isOnlyOfType : function(){
      return this.markup.isOnlyOfType();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isMarkupEmpty : function(){
      return this.markup.isEmpty();
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    isWordBreakAll : function(){
      return this.wordBreak && this.wordBreak === "break-all";
    },
    /**
       @memberof Nehan.StyleContext
       @return {boolean}
    */
    hasFlipFlow : function(){
      return this.parent? (this.flow !== this.parent.flow) : false;
    },
    /**
       @memberof Nehan.StyleContext
    */
    clearBreakBefore : function(){
      this.breakBefore = null;
    },
    /**
       @memberof Nehan.StyleContext
    */
    clearBreakAfter : function(){
      this.breakAfter = null;
    },
    /**
       search property from markup attributes first, and css values second.

       @memberof Nehan.StyleContext
       @param name {String}
       @param def_value {default_value}
       @return {value}
    */
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
    /**
       @memberof Nehan.StyleContext
       @param name {String}
       @param def_value {default_value}
       @return {value}
    */
    getMarkupAttr : function(name, def_value){
      // if markup is "<img src='aaa.jpg'>"
      // getMarkupAttr("src") => 'aaa.jpg'
      if(name === "id"){
	return this.markup.id;
      }
      return this.markup.getAttr(name, def_value);
    },
    _evalCssAttr : function(name, value){
      // "oncreate", "onblock", "online", "ontext" not return style,
      // it's a hook called after this style is converted into dom element on each layout level(block, line, text).
      // so leave it as it is.
      if(name === "oncreate" || name === "onblock" || name == "online" || name === "ontext"){
	return value;
      }
      // if value is function, call with selector context, and format the returned value.
      if(typeof value === "function"){
	return Nehan.CssParser.formatValue(name, value(this.selectorPropContext));
      }
      return Nehan.CssParser.formatValue(name, value);
    },
    /**
       @memberof Nehan.StyleContext
       @param name {String}
       @param value {css_value}
    */
    setCssAttr : function(name, value){
      if(__is_managed_css_prop(name)){
	this.managedCss.add(name, value);
      } else {
	this.unmanagedCss.add(name, value);
      }
    },
    /**
       @memberof Nehan.StyleContext
       @param name {String}
       @def_value {default_value}
       @return {css_value}
       @description <pre>
       * notice that subdivided properties like 'margin-before' as [name] are always not found,
       * even if you defined them in setStyle(s).
       * because all subdivided properties are already converted into unified name in loading process.
    */
    getCssAttr : function(name, def_value){
      var ret;
      ret = this.managedCss.get(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      ret = this.unmanagedCss.get(name);
      if(ret !== null){
	return this._evalCssAttr(name, ret);
      }
      ret = this.callbackCss.get(name);
      if(ret !== null){
	return ret;
      }
      return (typeof def_value !== "undefined")? def_value : null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getParentMarkupName : function(){
      return this.parent? this.parent.getMarkupName() : null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.Tag}
    */
    getMarkup : function(){
      return this.markup;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupName : function(){
      return this.markup.getName();
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupId : function(){
      return this.markup.getId();
    },
    /**
       @memberof Nehan.StyleContext
       @return {Array.<String>}
    */
    getMarkupClasses : function(){
      return this.markup.getClasses();
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupContent : function(){
      return this.markup.getContent();
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getMarkupPos : function(){
      return this.markup.pos;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getMarkupData : function(name){
      return this.markup.getData(name);
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getContent : function(){
      var content = this.getCssAttr("content") || this.markup.getContent();
      var before = Selectors.getValuePe(this, "before");
      if(!Nehan.Obj.isEmpty(before)){
	content = Nehan.Html.tagWrap("before", before.content || "") + content;
      }
      var after = Selectors.getValuePe(this, "after");
      if(!Nehan.Obj.isEmpty(after)){
	content = content + Nehan.Html.tagWrap("after", after.content || "");
      }
      var first_letter = Selectors.getValuePe(this, "first-letter");
      if(!Nehan.Obj.isEmpty(first_letter)){
	content = content.replace(__rex_first_letter, function(match, p1, p2, p3){
	  return p1 + Nehan.Html.tagWrap("first-letter", p3);
	});
      }
      var first_line = Selectors.getValuePe(this, "first-line");
      if(!Nehan.Obj.isEmpty(first_line)){
	content = Nehan.Html.tagWrap("first-line", content);
      }
      return content;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getHeaderRank : function(){
      return this.markup.getHeaderRank();
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.Font}
    */
    getFont : function(){
      return this.font || (this.parent? this.parent.getFont() : Nehan.Display.getStdFont());
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getFontSize : function(){
      return this.getFont().size;
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getFontFamily : function(){
      return this.getFont().family;
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.TextAlign}
    */
    getTextAlign : function(){
      return this.textAlign || Nehan.TextAligns.get("start");
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getTextCombine : function(){
      return this.textCombine || null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getLetterSpacing : function(){
      return this.letterSpacing || 0;
    },
    /**
       @memberof Nehan.StyleContext
       @param order {int}
       @return {String}
    */
    getListMarkerHtml : function(order){
      return this.listStyle? this.listStyle.getMarkerHtml(order) : (this.parent? this.parent.getListMarkerHtml(order) : "");
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getListMarkerSize : function(){
      if(this.listMarkerSize){
	return this.listMarkerSize;
      }
      if(this.parent){
	return this.parent.getListMarkerSize();
      }
      var font_size = this.getFontSize();
      return new Nehan.BoxSize(font_size, font_size);
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.Color}
    */
    getColor : function(){
      return this.color || (this.parent? this.parent.getColor() : new Nehan.Color(Nehan.Display.fontColor));
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.Partition}
    */
    getTablePartition : function(){
      return this.tablePartition || (this.parent? this.parent.getTablePartition() : null);
    },
    /**
       @memberof Nehan.StyleContext
       @return {String}
    */
    getBorderCollapse : function(){
      if(this.borderCollapse){
	return (this.borderCollapse === "inherit")? this.parent.getBorderCollapse() : this.borderCollapse;
      }
      return null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getChildCount : function(){
      return this.childs.length;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getChildIndex : function(){
      var self = this;
      return Nehan.List.indexOf(this.getParentChilds(), function(child){
	return child === self;
      });
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getChildIndexOfType : function(){
      var self = this;
      return Nehan.List.indexOf(this.getParentChildsOfType(this.getMarkupName()), function(child){
	return child === self;
      });
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.StyleContext}
    */
    getNthChild : function(nth){
      return this.childs[nth] || null;
    },
    /**
       @memberof Nehan.StyleContext
       @return {Array.<Nehan.StyleContext>}
    */
    getParentChilds : function(){
      return this.parent? this.parent.childs : [];
    },
    /**
       @memberof Nehan.StyleContext
       @param nth {int}
       @return {Nehan.StyleContext}
    */
    getParentNthChild : function(nth){
      return this.parent? this.parent.getNthChild(nth) : null;
    },
    /**
       @memberof Nehan.StyleContext
       @param markup_name {String}
       @return {Nehan.StyleContext}
    */
    getParentChildsOfType : function(markup_name){
      return Nehan.List.filter(this.getParentChilds(), function(child){
	return child.getMarkupName() === markup_name;
      });
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.BoxFlow}
    */
    getParentFlow : function(){
      return this.parent? this.parent.flow : this.flow;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getParentFontSize : function(){
      return this.parent? this.parent.getFontSize() : Nehan.Display.fontSize;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getParentContentMeasure : function(){
      return this.parent? this.parent.contentMeasure : Nehan.Display.getMeasure(this.flow);
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getParentContentExtent : function(){
      return this.parent? this.parent.contentExtent : Nehan.Display.getExtent(this.flow);
    },
    /**
       @memberof Nehan.StyleContext
       @return {Nehan.StyleContext}
    */
    getNextSibling : function(){
      return this.next;
    },
    /**
       @memberof Nehan.StyleContext
       @return {float | int}
    */
    getLineHeight : function(){
      return this.lineHeight || Nehan.Display.lineHeight || 2;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEmphaTextBlockExtent : function(){
      return this.getFontSize() * 2;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getRubyTextBlockExtent : function(){
      var base_font_size = this.getFontSize();
      var extent = Math.floor(base_font_size * (1 + Nehan.Display.rubyRate));
      return (base_font_size % 2 === 0)? extent : extent + 1;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getAutoLineExtent : function(){
      return Math.floor(this.getFontSize() * this.getLineHeight());
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEdgeMeasure : function(flow){
      var edge = this.edge || null;
      return edge? edge.getMeasure(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEdgeExtent : function(flow){
      var edge = this.edge || null;
      return edge? edge.getExtent(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEdgeBefore : function(flow){
      var edge = this.edge || null;
      return edge? edge.getBefore(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getEdgeAfter : function(flow){
      var edge = this.edge || null;
      return edge? edge.getAfter(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getInnerEdgeMeasure : function(flow){
      var edge = this.edge || null;
      return edge? edge.getInnerMeasureSize(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @return {int}
    */
    getInnerEdgeExtent : function(flow){
      var edge = this.edge || null;
      return edge? edge.getInnerExtentSize(flow || this.flow) : 0;
    },
    /**
       @memberof Nehan.StyleContext
       @param block {Nehan.Box}
       @return {Object}
    */
    getCssBlock : function(block){
      // notice that box-size, box-edge is box local variable,<br>
      // so style of box-size(content-size) and edge-size are generated at Box::getCssBlock
      var css = {};
      var is_vert = this.isTextVertical();
      css.display = "block";
      if(this.font){
	Nehan.Args.copy(css, this.font.getCss());
      }
      if(this.parent){
	Nehan.Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Nehan.Args.copy(css, this.color.getCss());
      }
      if(this.letterSpacing && !is_vert){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      if(this.floatDirection){
	Nehan.Args.copy(css, this.floatDirection.getCss(is_vert));
      }
      if(this.position){
	Nehan.Args.copy(css, this.position.getCss());
      }
      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      this.unmanagedCss.copyValuesTo(css);
      Nehan.Args.copy(css, block.size.getCss(this.flow)); // content size
      if(block.edge){
	Nehan.Args.copy(css, block.edge.getCss());
      }
      Nehan.Args.copy(css, block.css); // some dynamic values
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssLineBlock : function(line){
      // notice that line-size, line-edge is box local variable,
      // so style of line-size(content-size) and edge-size are generated at Box::getBoxCss
      var css = {};
      Nehan.Args.copy(css, line.size.getCss(this.flow));
      if(line.edge){
	Nehan.Args.copy(css, line.edge.getCss());
      }
      if(this.isRootLine()){
	Nehan.Args.copy(css, this.flow.getCss());
      }
      if(this.font && (!this.isRootLine() || this.isFirstLine())){
	Nehan.Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Nehan.Args.copy(css, this.color.getCss());
      }
      if(this.isRootLine()){
	css["line-height"] = this.getFontSize() + "px";
      }
      if(this.isTextVertical()){
	css["display"] = "block";
      }
      this.unmanagedCss.copyValuesTo(css);
      Nehan.Args.copy(css, line.css);
      css["background-color"] = this.getCssAttr("background-color", "transparent");
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssTextBlock : function(line){
      // notice that line-size, line-edge is box local variable,
      // so style of line-size(content-size) and edge-size are generated at Box::getCssInline
      var css = {};
      Nehan.Args.copy(css, line.size.getCss(this.flow));
      if(line.edge){
	Nehan.Args.copy(css, line.edge.getCss());
      }
      if(this.isTextVertical()){
	css["display"] = "block";
	css["line-height"] = "1em";
	if(Nehan.Env.client.isAppleMobileFamily()){
	  css["letter-spacing"] = "-0.001em";
	}
      } else {
	Nehan.Args.copy(css, this.flow.getCss());
	css["line-height"] = line.maxFontSize + "px";

	// enable line-height only when horizontal mode.
	// this logic is required for drop-caps of horizontal mode.
	// TODO: more simple solution.
	var line_height = this.getCssAttr("line-height");
	if(line_height){
	  css["line-height"] = this._computeUnitSize(line_height, this.getFontSize()) + "px";
	}
	if(this.getMarkupName() === "ruby" || this.isTextEmphaEnable()){
	  css["display"] = "inline-block";
	}
      }
      this.unmanagedCss.copyValuesTo(css);
      Nehan.Args.copy(css, line.css);
      css["background-color"] = this.getCssAttr("background-color", "transparent");
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssInlineBlock : function(line){
      var css = this.getCssBlock(line);
      if(this.isTextVertical()){
	if(!this.isFloated()){
	  delete css["css-float"];
	}
      } else {
	Nehan.Args.copy(css, this.flow.getCss());
      }
      css.display = "inline-block";
      return css;
    },
    /**
       @memberof Nehan.StyleContext
       @param line {Nehan.Box}
       @param image {Nehan.Box}
       @return {Object}
    */
    getCssHoriInlineImage : function(line, image){
      return this.flow.getCss();
    },
    _computeContentMeasure : function(outer_measure){
      switch(this.boxSizing){
      case "margin-box": return outer_measure - this.getEdgeMeasure();
      case "border-box": return outer_measure - this.getInnerEdgeMeasure();
      case "content-box": return outer_measure;
      default: return outer_measure;
      }
    },
    _computeContentExtent : function(outer_extent){
      switch(this.boxSizing){
      case "margin-box": return outer_extent - this.getEdgeExtent();
      case "border-box": return outer_extent - this.getInnerEdgeExtent();
      case "content-box": return outer_extent;
      default: return outer_extent;
      }
    },
    _computeFontSize : function(val, unit_size){
      var str = String(val).replace(/\/.+$/, ""); // remove line-height value like 'large/150%"'
      var size = Nehan.Display.fontSizeNames[str] || str;
      var max_size = this.getParentFontSize();
      var font_size = this._computeUnitSize(size, unit_size, max_size);
      return Math.min(font_size, Nehan.Display.maxFontSize);
    },
    _computeUnitSize : function(val, unit_size, max_size){
      var str = String(val);
      if(str.indexOf("rem") > 0){
	var rem_scale = parseFloat(str.replace("rem",""));
	return Math.round(Nehan.Display.fontSize * rem_scale); // use root font-size
      }
      if(str.indexOf("em") > 0){
	var em_scale = parseFloat(str.replace("em",""));
	return Math.round(unit_size * em_scale);
      }
      if(str.indexOf("pt") > 0){
	return Math.round(parseInt(str, 10) * 4 / 3);
      }
      if(str.indexOf("%") > 0){
	return Math.round(max_size * parseInt(str, 10) / 100);
      }
      var px = parseInt(str, 10);
      return isNaN(px)? 0 : px;
    },
    _computeCornerSize : function(val, unit_size){
      var ret = {};
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
      var padding = new Nehan.Padding();
      if(text_align.isCenter()){
	var start_offset = Math.floor(space_measure / 2);
	line.size.setMeasure(this.flow, content_measure - start_offset);
	padding.setStart(this.flow, start_offset);
	Nehan.Args.copy(line.css, padding.getCss());
      } else if(text_align.isEnd()){
	line.size.setMeasure(this.flow, line.inlineMeasure);
	padding.setStart(this.flow, space_measure);
	Nehan.Args.copy(line.css, padding.getCss());
      }
    },
    // argument 'baseline' is not used yet.
    // baseline: central | alphabetic
    // ----------------------------------------------------------------
    // In nehan.js, 'central' is used when vertical writing mode.
    // see http://dev.w3.org/csswg/css-writing-modes-3/#text-baselines
    _setVertBaseline : function(root_line, baseline){
      Nehan.List.iter(root_line.elements, function(element){
	var font_size = element.maxFontSize;
	var from_after = Math.floor((root_line.maxFontSize - font_size) / 2);
	if (from_after > 0){
	  var edge = element.edge || null;
	  edge = edge? edge.clone() : new Nehan.BoxEdge();
	  edge.padding.setAfter(this.flow, from_after); // set offset to padding
	  element.size.width = (root_line.maxExtent - from_after);
	  
	  // set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	  Nehan.Args.copy(element.css, edge.getCss(this.flow));
	}
      }.bind(this));
    },
    _setHoriBaseline : function(root_line, baseline){
      Nehan.List.iter(root_line.elements, function(element){
	var font_size = element.maxFontSize;
	var from_after = root_line.maxExtent - element.maxExtent;
	if (from_after > 0){
	  var edge = element.edge || null;
	  edge = edge? edge.clone() : new Nehan.BoxEdge();
	  edge.padding.setBefore(this.flow, from_after); // set offset to padding
	  //element.size.width = (root_line.maxExtent - from_after);
	  
	  // set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	  Nehan.Args.copy(element.css, edge.getCss(this.flow));
	}
      }.bind(this));
    },
    _loadSelectorCss : function(markup, parent){
      switch(markup.getName()){
      case "before":
      case "after":
      case "first-letter":
      case "first-line":
	// notice that style of pseudo-element is defined with parent context.
	var pe_values = Selectors.getValuePe(parent, markup.getName());
	// console.log("[%s::%s] pseudo values:%o", parent.markupName, this.markup.name, pe_values);
	return pe_values;

      default:
	//return Selectors.getValue(this);
	var values = Selectors.getValue(this);
	//console.log("[%s] selector values:%o", this.markup.name, values);
	return values;
      }
    },
    _loadInlineCss : function(markup){
      var style = markup.getAttr("style");
      if(style === null){
	return {};
      }
      var stmts = (style.indexOf(";") >= 0)? style.split(";") : [style];
      var allowed_props = Nehan.Config.allowedInlineStyleProps || [];
      var values = Nehan.List.fold(stmts, {}, function(ret, stmt){
	var nv = stmt.split(":");
	if(nv.length >= 2){
	  var prop = Nehan.Utils.trim(nv[0]).toLowerCase();
	  var value = Nehan.Utils.trim(nv[1]);
	  var norm_prop = Nehan.CssParser.normalizeProp(prop);
	  var fmt_value = Nehan.CssParser.formatValue(prop, value);
	  if(allowed_props.length === 0 || Nehan.List.exists(allowed_props, Nehan.Closure.eq(norm_prop))){
	    ret[norm_prop] = fmt_value;
	  }
	}
	return ret;
      });
      //console.log("[%s] load inline css:%o", this.markup.name, values);
      return values;
    },
    _disableUnmanagedCssProps : function(unmanaged_css){
      if(this.isTextVertical()){
	// unmanaged 'line-height' is not welcome for vertical-mode.
	unmanaged_css.remove("line-height");
      }
    },
    _registerCssValues : function(values){
      Nehan.Obj.iter(values, function(prop, value){
	if(__is_callback_css_prop(prop)){
	  this.callbackCss.add(prop, value);
	} else if(__is_managed_css_prop(prop)){
	  this.managedCss.add(prop, this._evalCssAttr(prop, value));
	} else {
	  this.unmanagedCss.add(prop, this._evalCssAttr(prop, value));
	}
      }.bind(this));
    },
    _loadDisplay : function(){
      switch(this.getMarkupName()){
      case "first-line":
      case "li-marker":
      case "li-body":
	return "block";
      default:
	return this.getCssAttr("display", "inline");
      }
    },
    _loadFlow : function(){
      var value = this.getCssAttr("flow", "inherit");
      var parent_flow = this.parent? this.parent.flow : Nehan.Display.getStdBoxFlow();
      if(value === "inherit"){
	return parent_flow;
      }
      if(value === "flip"){
	return parent_flow.getFlipFlow();
      }
      return Nehan.BoxFlows.getByName(value);
    },
    _loadPosition : function(){
      var value = this.getCssAttr("position", "static");
      if(value === "start"){
	return null;
      }
      var position = new Nehan.BoxPosition(value);
      var self = this;
      Nehan.List.iter(Nehan.Const.cssBoxDirsLogical, function(dir){
	var value = self.getCssAttr(dir, "auto");
	if(value !== "auto"){
	  position[value] = self._computeUnitSize(start, self.font.size);
	}
      });
      return position;
    },
    _loadBorderCollapse : function(){
      return this.getCssAttr("border-collapse");
    },
    _loadColor : function(){
      var value = this.getCssAttr("color", "inherit");
      if(value !== "inherit"){
	return new Nehan.Color(value);
      }
      return null;
    },
    _loadFont : function(){
      var parent_font = this.getFont();
      var font_size = this.getCssAttr("font-size", "inherit");
      var font_family = this.getCssAttr("font-family", "inherit");
      var font_weight = this.getCssAttr("font-weight", "inherit");
      var font_style = this.getCssAttr("font-style", "inherit");

      // if no special settings, font-style is already defined in parent block.
      // but if parent is inline like <span style='font-size:small'><p>foo</p></span>,
      // then <span>(linline) is terminated when it meets <p>(block), and any box is created by span,
      // so in this case, parent style(span) must be defined by <p>.
      if(this.parent && this.parent.isBlock() && font_size === "inherit" && font_family === "inherit" && font_weight === "inherit" && font_style === "inherit"){
	return null;
      }
      var font = new Nehan.Font(parent_font.size);

      // if root font, initialize font by default styles.
      if(this.parent === null){
	font.family = parent_font.family;
	font.style = parent_font.style;
	font.weight = parent_font.weight;
      }

      if(font_size !== "inherit"){
	font.size = this._computeFontSize(font_size, parent_font.size);
      }
      if(font_family !== "inherit"){
	font.family = font_family;
      }
      if(font_weight !== "inherit"){
	font.weight = font_weight;
      }
      if(font_style !== "inherit"){
	font.style = font_style;
      }
      return font;
    },
    _loadBoxSizing : function(){
      return this.getCssAttr("box-sizing", "margin-box");
    },
    _loadEdge : function(flow, font_size){
      var padding = this._loadPadding(flow, font_size);
      var margin = this._loadMargin(flow, font_size);
      var border = this._loadBorder(flow, font_size);
      if(padding === null && margin === null && border === null){
	return null;
      }
      return new Nehan.BoxEdge({
	padding:padding,
	margin:margin,
	border:border
      });
    },
    _loadEdgeSize : function(font_size, prop){
      var edge_size = this.getCssAttr(prop);
      if(edge_size === null){
	return null;
      }
      return this._computeEdgeSize(edge_size, font_size);
    },
    _loadPadding : function(flow, font_size){
      var edge_size = this._loadEdgeSize(font_size, "padding");
      if(edge_size === null){
	return null;
      }
      var padding = new Nehan.Padding();
      padding.setSize(flow, edge_size);
      return padding;
    },
    _loadMargin : function(flow, font_size){
      var edge_size = this._loadEdgeSize(font_size, "margin");
      if(edge_size === null){
	return null;
      }
      var margin = new Nehan.Margin();
      margin.setSize(flow, edge_size);

      // if inline, disable margin-before and margin-after.
      if(this.isInline()){
	margin.clearBefore(flow);
	margin.clearAfter(flow);
      }
      return margin;
    },
    _findParentEnableBorder : function(style, target){
      if(style.edge && style.edge.border && style.edge.border.getByName(this.flow, target) > 0){
	return style.edge.border;
      }
      return style.parent? this._findParentEnableBorder(style.parent, target) : null;
    },
    _collapseBorder : function(border){
      switch(this.display){
      case "table-header-group":
      case "table-row-group":
      case "table-footer-group":
      case "table-row":
	this._collapseBorderTableRow(border);
	break;
      case "table-cell":
	this._collapseBorderTableCell(border);
	break;
      }
    },
    _collapseBorderTableRow : function(border){
      var parent_start_border = this._findParentEnableBorder(this.parent, "start");
      if(parent_start_border){
	this._collapseBorderBetween(
	  {border:parent_start_border, target:"start"},
	  {border:border, target:"start"}
	);
      }
      var parent_end_border = this._findParentEnableBorder(this.parent, "end");
      if(parent_end_border){
	this._collapseBorderBetween(
	  {border:parent_end_border, target:"end"},
	  {border:border, target:"end"}
	);
      }
      if(this.prev && this.prev.edge && this.prev.edge.border){
	this._collapseBorderBetween(
	  {border:this.prev.edge.border, target:"after"},
	  {border:border, target:"before"}
	);
      }
      if(this.isFirstChild()){
	var parent_before_border = this._findParentEnableBorder(this.parent, "before");
	if(parent_before_border){
	  this._collapseBorderBetween(
	    {border:parent_before_border, target:"before"},
	    {border:border, target:"before"}
	  );
	}
      }
      if(this.isLastChild()){
	var parent_after_border = this._findParentEnableBorder(this.parent, "after");
	if(parent_after_border){
	  this._collapseBorderBetween(
	    {border:parent_after_border, target:"after"},
	    {border:border, target:"after"}
	  );
	}
      }
    },
    _collapseBorderTableCell : function(border){
      if(this.prev && this.prev.edge && this.prev.edge.border){
	this._collapseBorderBetween(
	  {border:this.prev.edge.border, target:"end"},
	  {border:border, target:"start"}
	);
      }
      var parent_before_border = this._findParentEnableBorder(this.parent, "before");
      if(parent_before_border){
	this._collapseBorderBetween(
	  {border:parent_before_border, target:"before"},
	  {border:border, target:"before"}
	);
      }
      var parent_after_border = this._findParentEnableBorder(this.parent, "after");
      if(parent_after_border){
	this._collapseBorderBetween(
	  {border:parent_after_border, target:"after"},
	  {border:border, target:"after"}
	);
      }
      if(this.isFirstChild()){
	var parent_start_border = this._findParentEnableBorder(this.parent, "start");
	if(parent_start_border){
	  this._collapseBorderBetween(
	    {border:parent_start_border, target:"start"},
	    {border:border, target:"start"}
	  );
	}
      }
      if(this.isLastChild()){
	var parent_end_border = this._findParentEnableBorder(this.parent, "end");
	if(parent_end_border){
	  this._collapseBorderBetween(
	    {border:parent_end_border, target:"end"},
	    {border:border, target:"end"}
	  );
	}
      }
    },
    _collapseBorderBetween : function(prev, cur){
      var prev_size = prev.border.getByName(this.flow, prev.target);
      var cur_size = cur.border.getByName(this.flow, cur.target);
      var new_size = Math.max(0, cur_size - prev_size);
      var rm_size = cur_size - new_size;
      switch(cur.target){
      case "before": case "after":
	this.contentExtent += rm_size;
	break;
      case "start": case "end":
	this.contentMeasure += rm_size;
	break;
      }
      cur.border.setByName(this.flow, cur.target, new_size);
    },
    // precondition: this.edge.margin is available
    _collapseMargin : function(){
      if(this.parent && this.parent.edge && this.parent.edge.margin){
	this._collapseMarginParent();
      }
      if(this.prev && this.prev.isBlock() && this.prev.edge){
	// cancel margin between previous sibling and cur element.
	if(this.prev.edge.margin && this.edge.margin){
	  this._collapseMarginSibling();
	}
      }
    },
    // cancel margin between parent and current element
    _collapseMarginParent : function(){
      if(this.isFirstChild()){
	this._collapseMarginFirstChild();
      }
      if(this.isLastChild()){
	this._collapseMarginLastChild();
      }
    },
    // cancel margin between parent and first-child(current element)
    _collapseMarginFirstChild : function(){
      if(this.flow === this.parent.flow){
	this._collapseMarginBetween(
	  {edge:this.parent.edge, target:"before"},
	  {edge:this.edge, target:"before"}
	);
      }
    },
    // cancel margin between parent and first-child(current element)
    _collapseMarginLastChild : function(){
      if(this.flow === this.parent.flow){
	this._collapseMarginBetween(
	  {edge:this.parent.edge, target:"after"},
	  {edge:this.edge, target:"after"}
	);
      }
    },
    // cancel margin prev sibling and current element
    _collapseMarginSibling : function(){
      if(this.flow === this.prev.flow){
	// both prev and cur are floated to same direction
	if(this.isFloated() && this.prev.isFloated()){
	  if(this.isFloatStart() && this.prev.isFloatStart()){
	    // [start] x [start]
	    this._collapseMarginBetween(
	      {edge:this.prev.edge, target:"end"},
	      {edge:this.edge, target:"start"}
	    );
	  } else if(this.isFloatEnd() && this.prev.isFloatEnd()){
	    // [end] x [end]
	    this._collapseMarginBetween(
	      {edge:this.prev.edge, target:"start"},
	      {edge:this.edge, target:"end"}
	    );
	  }
	} else if(!this.isFloated() && !this.prev.isFloated()){
	  // [block] x [block]
	  this._collapseMarginBetween(
	    {edge:this.prev.edge, target:"after"},
	    {edge:this.edge, target:"before"}
	  );
	}
      } else if(this.prev.isTextHorizontal() && this.isTextVertical()){
	// [hori] x [vert]
	this._collapseMarginBetween(
	  {edge:this.prev.edge, target:"after"},
	  {edge:this.edge, target:"before"}
	);
      } else if(this.prev.isTextVertical() && this.isTextHorizontal()){
	if(this.prev.flow.isBlockRightToLeft()){
	  // [vert:tb-rl] x [hori]
	  this._collapseMarginBetween(
	    {edge:this.prev.edge, target:"after"},
	    {edge:this.edge, target:"end"}
	  );
	} else {
	  // [vert:tb-lr] x [hori]
	  this._collapseMarginBetween(
	    {edge:this.prev.edge, target:"after"},
	    {edge:this.edge, target:"start"}
	  );
	}
      }
    },
    // if prev_margin > cur_margin, just clear cur_margin.
    _collapseMarginBetween : function(prev, cur){
      // margin collapsing is ignored if there is a border between two edge.
      if(prev.edge.border && prev.edge.border.getByName(this.flow, prev.target) ||
	 cur.edge.border && cur.edge.border.getByName(this.flow, cur.target)){
	return;
      }
      var prev_size = prev.edge.margin.getByName(this.flow, prev.target);
      var cur_size = cur.edge.margin.getByName(this.flow, cur.target);

      // we use float for layouting each block element in evaluation phase,
      // so standard margin collapsing doesn't work.
      // that is because we use 'differene' of margin for collapsed size.
      var new_size = (prev_size > cur_size)? 0 : cur_size - prev_size;

      cur.edge.margin.setByName(this.flow, cur.target, new_size);

      var rm_size = cur_size - new_size;

      // update content size
      this.contentExtent += rm_size;
    },
    _loadBorder : function(flow, font_size){
      var edge_size = this._loadEdgeSize(font_size, "border-width");
      var border_radius = this.getCssAttr("border-radius");
      if(edge_size === null && border_radius === null){
	return null;
      }
      var border = new Nehan.Border();
      if(edge_size){
	border.setSize(flow, edge_size);
      }
      if(border_radius){
	border.setRadius(flow, this._computeCornerSize(border_radius, font_size));
      }
      var border_color = this.getCssAttr("border-color");
      if(border_color){
	border.setColor(flow, border_color);
      }
      var border_style = this.getCssAttr("border-style");
      if(border_style){
	border.setStyle(flow, border_style);
      }
      return border;
    },
    _loadLineHeight : function(){
      var value = this.getCssAttr("line-height", "inherit");
      if(value === "inherit"){
	return (this.parent && this.parent.lineHeight)? this.parent.lineHeight : Nehan.Display.lineHeight;
      }
      return parseFloat(value || Nehan.Display.lineHeight);
    },
    _loadTextAlign : function(){
      var value = this.getCssAttr("text-align", "inherit");
      if(value === "inherit" && this.parent && this.parent.textAlign){
	return this.parent.textAlign;
      }
      return Nehan.TextAligns.get(value || "start");
    },
    _loadTextEmpha : function(){
      var empha_style = this.getCssAttr("text-emphasis-style", "none");
      if(empha_style === "none" || empha_style === "inherit"){
	return null;
      }
      var empha_pos = this.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = this.getCssAttr("text-emphasis-color");
      return new Nehan.TextEmpha({
	style:new Nehan.TextEmphaStyle(empha_style),
	pos:new Nehan.TextEmphaPos(empha_pos),
	color:(empha_color? new Nehan.Color(empha_color) : this.getColor())
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
      return Nehan.FloatDirections.get(name);
    },
    _loadClear : function(){
      var value = this.getCssAttr("clear");
      return value? new Nehan.Clear(value) : null;
    },
    _loadBreakBefore : function(){
      var value = this.getCssAttr("break-before");
      return value? Nehan.Breaks.getBefore(value) : null;
    },
    _loadBreakAfter : function(){
      var value = this.getCssAttr("break-after");
      return value? Nehan.Breaks.getAfter(value) : null;
    },
    _loadWordBreak : function(){
      return this.getCssAttr("word-break");
    },
    _loadWhiteSpace : function(){
      var inherit = this.parent? this.parent.whiteSpace : "normal";
      return this.getCssAttr("white-space", inherit);
    },
    _loadListStyle : function(){
      var list_style_type = this.getCssAttr("list-style-type", "none");
      if(list_style_type === "none"){
	return null;
      }
      return new Nehan.ListStyle({
	type:list_style_type,
	position:this.getCssAttr("list-style-position", "outside"),
	image:this.getCssAttr("list-style-image", "none")
      });
    },
    _loadLetterSpacing : function(font_size){
      var letter_spacing = this.getCssAttr("letter-spacing");
      if(letter_spacing){
	return this._computeUnitSize(letter_spacing, font_size);
      }
      return null;
    },
    _loadStaticMeasure : function(){
      var prop = this.flow.getPropMeasure();
      var max_size = this.getParentContentMeasure();
      var static_size = this.getAttr(prop) || this.getAttr("measure") || this.getCssAttr(prop) || this.getCssAttr("measure");
      return static_size? this._computeUnitSize(static_size, this.getFontSize(), max_size) : null;
    },
    _loadStaticExtent : function(){
      var prop = this.flow.getPropExtent();
      var max_size = this.getParentContentExtent();
      var static_size = this.getAttr(prop) || this.getAttr("extent") || this.getCssAttr(prop) || this.getCssAttr("extent");
      return static_size? this._computeUnitSize(static_size, this.getFontSize(), max_size) : null;
    }
  };

  return StyleContext;
})();

