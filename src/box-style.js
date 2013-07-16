// style setting from markup to box
var BoxStyle = {
  set : function(markup, box, parent){
    this._setFontSize(markup, box, parent);
    this._setFontColor(markup, box, parent);
    this._setFontFamily(markup, box, parent);
    this._setFontStyle(markup, box, parent);
    this._setFontWeight(markup, box, parent);
    this._setSizing(markup, box, parent);
    this._setEdge(markup, box, parent);
    this._setLineRate(markup, box, parent);
    this._setTextAlign(markup, box, parent);
    this._setTextIndent(markup, box, parent);
    this._setTextEmphasis(markup, box, parent);
    this._setFlowName(markup, box, parent);
    this._setFloat(markup, box, parent);
    this._setLetterSpacing(markup, box, parent);
    this._setBackground(markup, box, parent);
    this._setClasses(markup, box, parent);
  },
  _setClasses : function(markup, box, parent){
    List.iter(markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _setFontSize : function(markup, box, parent){
    var base_font_size = parent? parent.fontSize : Layout.fontSize;
    var font_size = markup.getCssAttr("font-size", "inherit");
    if(font_size != "inherit"){
      box.fontSize = UnitSize.getUnitSize(font_size, base_font_size);
    }
  },
  _setFontColor : function(markup, box, parent){
    var font_color = markup.getCssAttr("color");
    if(font_color){
      box.color = new Color(font_color);
    }
  },
  _setFontFamily : function(markup, box, parent){
    var font_family = markup.getCssAttr("font-family");
    if(font_family){
      box.setCss("font-family", font_family);
    }
  },
  _setFontStyle : function(markup, box, parent){
    var font_style = markup.getCssAttr("font-style");
    if(font_style){
      box.setCss("font-style", font_style);
    }
  },
  _setFontWeight : function(markup, box, parent){
    var font_weight = markup.getCssAttr("font-weight");
    if(font_weight){
      box.fontWeight = new FontWeight(font_weight);
    }
  },
  _setSizing : function(markup, box, parent){
    var box_sizing = markup.getCssAttr("box-sizing");
    if(box_sizing){
      box.sizing = BoxSizings.getByName(box_sizing);
    }
  },
  _setEdge : function(markup, box, parent){
    var padding = markup.getCssAttr("padding");
    var margin = markup.getCssAttr("margin");
    var border_width = markup.getCssAttr("border-width");
    var border_radius = markup.getCssAttr("border-radius");
    if(padding === null && margin === null && border_width === null && border_radius === null){
      return null;
    }
    var edge = new BoxEdge();
    if(padding){
      edge.setSize("padding", box.flow, UnitSize.getEdgeSize(padding, box.fontSize));
    }
    if(margin){
      edge.setSize("margin", box.flow, UnitSize.getEdgeSize(margin, box.fontSize));
    }
    if(border_width){
      edge.setSize("border", box.flow, UnitSize.getEdgeSize(border_width, box.fontSize));
    }
    if(border_radius){
      edge.setBorderRadius(box.flow, UnitSize.getCornerSize(border_radius, box.fontSize));
    }
    var border_color = markup.getCssAttr("border-color");
    if(border_color){
      edge.setBorderColor(box.flow, border_color);
    }
    var border_style = markup.getCssAttr("border-style");
    if(border_style){
      edge.setBorderStyle(box.flow, border_style);
    }
    box.setEdge(edge);
  },
  _setLineRate : function(markup, box, parent){
    var line_rate = markup.getCssAttr("line-rate", "inherit");
    if(line_rate !== "inherit"){
      box.lineRate = line_rate;
    }
  },
  _setTextAlign : function(markup, box, parent){
    var text_align = markup.getCssAttr("text-align");
    if(text_align){
      box.textAlign = text_align;
    }
  },
  _setTextIndent : function(markup, box, parent){
    var text_indent = markup.getCssAttr("text-indent", "inherit");
    if(text_indent !== "inherit"){
      box.textIndent = UnixSize.getUnitSize(text_indent, box.fontSize);
    }
  },
  _setTextEmphasis : function(markup, box, parent){
    var empha_style = markup.getCssAttr("text-emphasis-style");
    if(empha_style){
      var empha_pos = markup.getCssAttr("text-emphasis-position", "over");
      var empha_color = markup.getCssAttr("text-emphasis-color", "black");
      var text_empha = new TextEmpha();
      text_empha.setStyle(empha_style);
      text_empha.setPos(empha_pos);
      text_empha.setColor(empha_color);
      box.textEmpha = text_empha;
    }
  },
  _setFlowName : function(markup, box, parent){
    var flow_name = markup.getCssAttr("flow", "inherit");
    if(flow_name === "flip"){
      box.setFlow(parent.getFlipFlow());
    } else if(flow_name !== "inherit"){
      box.setFlow(BoxFlows.getByName(flow_name));
    }
  },
  _setFloat : function(markup, box, parent){
    var logical_float = markup.getCssAttr("float", "none");
    if(logical_float != "none"){
      box.logicalFloat = logical_float;
    }
  },
  _setLetterSpacing : function(markup, box, parent){
    var letter_spacing = markup.getCssAttr("letter-spacing");
    if(letter_spacing){
      box.letterSpacing = UnitSize.getUnitSize(letter_spacing, box.fontSize);
    }
  },
  _setBackground : function(markup, box, parent){
    var color = markup.getCssAttr("background-color");
    var image = markup.getCssAttr("background-image");
    var pos = markup.getCssAttr("background-position");
    var repeat = markup.getCssAttr("background-repeat");
    if(color === null && image === null && pos === null && repeat === null){
      return;
    }
    var background = new Background();
    if(color){
      background.color = color;
    }
    if(image){
      background.image = image;
    }
    if(pos){
      background.pos = new BackgroundPos2d(
	new BackgroundPos(pos.inline, pos.offset),
	new BackgroundPos(pos.block, pos.offset)
      );
    }
    if(repeat){
      background.repeat = new BackgroundRepeat2d(
	new BackgroundRepeat(repeat.inline),
	new BackgroundRepeat(repeat.block)
      );
    }
    box.background = background;
  }
};

