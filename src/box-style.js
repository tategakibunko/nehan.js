// style setting from markup to box
var BoxStyle = {
  set : function(markup, box, parent){
    this._setDisplay(markup, box, parent);
    this._setPosition(markup, box, parent);
    this._setZIndex(markup, box, parent);
    this._setColor(markup, box, parent);
    this._setFont(markup, box, parent);
    this._setBoxSizing(markup, box, parent);
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
  _setDisplay : function(markup, box, parent){
    box.display = markup.getCssAttr("display", "block");
  },
  _setPosition : function(markup, box, parent){
    var position = markup.getCssAttr("position", "relative");
    box.position = new BoxPosition(position, {
      top: markup.getCssAttr("top", "auto"),
      left: markup.getCssAttr("left", "auto"),
      right: markup.getCssAttr("right", "auto"),
      bottom: markup.getCssAttr("bottom", "auto")
    });
  },
  _setZIndex : function(markup, box, parent){
    var z_index = markup.getCssAttr("z-index");
    if(z_index){
      box.zIndex = z_index;
    }
  },
  _setClasses : function(markup, box, parent){
    List.iter(markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _setColor : function(markup, box, parent){
    var color = markup.getCssAttr("color");
    if(color){
      box.color = new Color(color);
    }
  },
  _setFont : function(markup, box, parent){
    var font_size = markup.getCssAttr("font-size", "inherit");
    if(font_size !== "inherit"){
      box.font.size = UnitSize.getFontSize(font_size, parent.font.size);
    }
    var font_family = markup.getCssAttr("font-family", "inherit");
    if(font_family !== "inherit"){
      box.font.family = font_family;
    }
    var font_weight = markup.getCssAttr("font-weight", "inherit");
    if(font_weight !== "inherit"){
      box.font.weight = font_weight;
    }
    var font_style = markup.getCssAttr("font-style", "inherit");
    if(font_style !== "inherit"){
      box.font.style = font_style;
    }
  },
  _setBoxSizing : function(markup, box, parent){
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
      edge.padding.setSize(box.flow, UnitSize.getEdgeSize(padding, box.getFontSize()));
    }
    if(margin){
      edge.margin.setSize(box.flow, UnitSize.getEdgeSize(margin, box.getFontSize()));
    }
    if(border_width){
      edge.border.setSize(box.flow, UnitSize.getEdgeSize(border_width, box.getFontSize()));
    }
    if(border_radius){
      edge.setBorderRadius(box.flow, UnitSize.getCornerSize(border_radius, box.getFontSize()));
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
      box.textIndent = Math.max(0, UnitSize.getUnitSize(text_indent, box.getFontSize()));
    }
  },
  _setTextEmphasis : function(markup, box, parent){
    var empha_style = markup.getCssAttr("text-emphasis-style");
    if(empha_style){
      var empha_pos = markup.getCssAttr("text-emphasis-position", {hori:"over", vert:"right"});
      var empha_color = markup.getCssAttr("text-emphasis-color", "black");
      box.textEmpha = new TextEmpha({
	style:new TextEmphaStyle(empha_style),
	pos:new TextEmphaPos(empha_pos),
	color:new Color(empha_color)
      });
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
      box.letterSpacing = UnitSize.getUnitSize(letter_spacing, box.getFontSize());
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

