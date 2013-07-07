var ElementGenerator = Class.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
  },
  hasNext : function(){
    return false;
  },
  backup : function(){
  },
  rollback : function(){
  },
  // called when box is created, but no style is not loaded.
  _onReadyBox : function(box, parent){
  },
  // called when box is created, and std style is already loaded.
  _onCreateBox : function(box, parent){
  },
  _getMarkupStaticSize : function(parent){
    if(this.markup){
      var font_size = parent? parent.fontSize : Layout.fontSize;
      var measure = parent? parent.getContentMeasure(parent.flow) : Layout.getStdMeasure();
      return this.markup.getStaticSize(font_size, measure);
    }
    return parent.getRestSize();
  },
  _yieldStaticElement : function(parent, tag){
    if(tag.getName() === "img"){
      return (new ImageGenerator(tag, this.context)).yield(parent);
    }
    // if original flow defined, yield as inline page
    if(tag.hasFlow()){
      var size = tag.getStaticSize(parent.fontSize, parent.getContentMeasure());
      return (new InlinePageGenerator(tag, this.context.createInlineRoot())).yield(parent, size);
    }
    // if static size is simply defined, treat as just an embed html with static size.
    return (new InlineBoxGenerator(tag, this.context)).yield(parent);
  },
  _getBoxType : function(){
    return this.markup.getName();
  },
  _setBoxFirstChild : function(box, parent){
    box.firstChild = box.isFirstChildOf(parent);

    // if box is first child of parent,
    // copy style of <this.markup.name>:first-child.
    if(box.firstChild){
      this.markup.setFirstChild();
    }
  },
  _setBoxClasses : function(box, parent){
    List.iter(this.markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _setBoxFontSize : function(box, parent){
    var base_font_size = parent? parent.fontSize : Layout.fontSize;
    var font_size = this.markup.getCssAttr("font-size", "inherit");
    if(font_size != "inherit"){
      box.fontSize = UnitSize.getUnitSize(font_size, base_font_size);
    }
  },
  _setBoxFontColor : function(box, parent){
    var font_color = this.markup.getCssAttr("color");
    if(font_color){
      box.color = new Color(font_color);
    }
  },
  _setBoxFontFamily : function(box, parent){
    var font_family = this.markup.getCssAttr("font-family");
    if(font_family){
      box.setCss("font-family", font_family);
    }
  },
  _setBoxFontStyle : function(box, parent){
    var font_style = this.markup.getCssAttr("font-style");
    if(font_style){
      box.setCss("font-style", font_style);
    }
  },
  _setBoxFontWeight : function(box, parent){
    var font_weight = this.markup.getCssAttr("font-weight");
    if(font_weight){
      box.fontWeight = new FontWeight(font_weight);
    }
  },
  _setBoxSizing : function(box, parent){
    var box_sizing = this.markup.getCssAttr("box-sizing");
    if(box_sizing){
      box.sizing = BoxSizings.getByName(box_sizing);
    }
  },
  _setBoxEdge : function(box, parent){
    var edge = this.markup.getBoxEdge(box.flow, box.fontSize, box.getContentMeasure());
    if(edge){
      box.setEdge(edge);
    }
  },
  _setBoxLineRate : function(box, parent){
    var line_rate = this.markup.getCssAttr("line-rate", "inherit");
    if(line_rate !== "inherit"){
      box.lineRate = line_rate;
    }
  },
  _setBoxTextAlign : function(box, parent){
    var text_align = this.markup.getCssAttr("text-align");
    if(text_align){
      box.textAlign = text_align;
    }
  },
  _setBoxTextIndent : function(box, parent){
    var text_indent = this.markup.getCssAttr("text-indent", "inherit");
    if(text_indent !== "inherit"){
      box.textIndent = UnixSize.getUnitSize(text_indent, box.fontSize);
    }
  },
  _setBoxTextEmphasis : function(box, parent){
    var empha_style = this.markup.getCssAttr("text-emphasis-style");
    if(empha_style){
      var empha_pos = this.markup.getCssAttr("text-emphasis-position", "over");
      var empha_color = this.markup.getCssAttr("text-emphasis-color", "black");
      var text_empha = new TextEmpha();
      text_empha.setStyle(empha_style);
      text_empha.setPos(empha_pos);
      text_empha.setColor(empha_color);
      box.textEmpha = text_empha;
    }
  },
  _setBoxFlowName : function(box, parent){
    var flow_name = this.markup.getCssAttr("flow", "inherit");
    if(flow_name === "flip"){
      box.setFlow(parent.getFlipFlow());
    } else if(flow_name !== "inherit"){
      box.setFlow(BoxFlows.getByName(flow_name));
    }
  },
  _setBoxFloat : function(box, parent){
    var logical_float = this.markup.getCssAttr("float", "none");
    if(logical_float != "none"){
      box.logicalFloat = logical_float;
    }
  },
  _setBoxPageBreak : function(box, parent){
    var page_break_after = this.markup.getCssAttr("page-break-after", false);
    if(page_break_after){
      box.pageBreakAfter = true;
    }
  },
  _setBoxLetterSpacing : function(box, parent){
    var letter_spacing = this.markup.getCssAttr("letter-spacing");
    if(letter_spacing){
      box.letterSpacing = UnitSize.getUnitSize(letter_spacing, box.fontSize);
    }
  },
  _setBoxBackground : function(box, parent){
    var background = this.markup.getCssAttr("background");
    if(background){
      box.setCss("background", background);
    }
  },
  _setBoxBackgroundColor : function(box, parent){
    var background_color = this.markup.getCssAttr("background-color");
    if(background_color){
      box.setCss("background-color", background_color);
    }
  },
  _setBoxBackgroundImage : function(box, parent){
    var background_image = this.markup.getCssAttr("background-image");
    if(background_image){
      box.setCss("background-image", background_image);
    }
  },
  _setBoxBackgroundPosition : function(box, parent){
    var background_pos = this.markup.getCssAttr("background-position");
    if(background_pos){
      box.setCss("background-position", background_pos);
    }
  },
  _setBoxBackgroundRepeat : function(box, parent){
    var background_repeat = this.markup.getCssAttr("background-repeat");
    if(background_repeat){
      box.setCss("background-repeat", background_pos);
    }
  },
  _setBoxStyle : function(box, parent){
    this._setBoxFontSize(box, parent);
    this._setBoxFontColor(box, parent);
    this._setBoxFontFamily(box, parent);
    this._setBoxFontStyle(box, parent);
    this._setBoxFontWeight(box, parent);
    this._setBoxSizing(box, parent);
    this._setBoxEdge(box, parent);
    this._setBoxLineRate(box, parent);
    this._setBoxTextAlign(box, parent);
    this._setBoxTextIndent(box, parent);
    this._setBoxTextEmphasis(box, parent);
    this._setBoxFlowName(box, parent);
    this._setBoxFloat(box, parent);
    this._setBoxPageBreak(box, parent);
    this._setBoxLetterSpacing(box, parent);
    this._setBoxBackground(box, parent);
    this._setBoxBackgroundColor(box, parent);
    this._setBoxBackgroundImage(box, parent);
    this._setBoxBackgroundPosition(box, parent);
    this._setBoxBackgroundRepeat(box, parent);
  },
  _setPseudoElement : function(box, parent){
    // if pseudo-element tag,
    // copy style of <this.markup.name>:<pseudo-name> dynamically.
    if(this.markup.isPseudoElementTag()){
      var pseudo_name = this.markup.getPseudoElementName();
      var pseudo_css_attr = this.markup.getPseudoCssAttr(pseudo_name);
      for(var prop in pseudo_css_attr){
	if(prop !== "content"){
	  this.markup.setCssAttr(prop, pseudo_css_attr[prop]);
	}
      }
    }
  },
  _createBox : function(size, parent){
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    box.markup = this.markup;
    this._onReadyBox(box, parent);
    this._setBoxFirstChild(box, parent);
    this._setPseudoElement(box, parent);
    this._setBoxClasses(box, parent);
    this._setBoxStyle(box, parent);
    this._onCreateBox(box, parent);
    return box;
  }
});

