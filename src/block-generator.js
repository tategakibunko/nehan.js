var BlockGenerator = Class.extend({
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
  yield : function(parent){
    throw "BlockGenerator::yield not impletented";
  },
  getCurGenerator : function(){
    if(this.generator && this.generator.hasNext()){
      return this.generator;
    }
    return null;
  },
  // called when box is created, but no style is not loaded.
  _onReadyBox : function(box, parent){
  },
  // called when box is created, and std style is already loaded.
  _onCreateBox : function(box, parent){
  },
  _getBoxType : function(){
    return this.markup.getName();
  },
  _setEdge : function(box, edge){
    // this makes difference to basic css box model.
    // as paged media has fixed size boundary,
    // we reduce 'inside' of box to embody margin/padding/border,
    // while basic box model add them to 'outside' of box.
    box.setEdgeBySub(edge);
  },
  _isFirstChild : function(box, parent){
    // li-marker and li-body are always first childs of 'li', so ignore them.
    if(box._type == "li-marker" || box._type == "li-body"){
      return false;
    }
    return parent.isEmptyChild();
  },
  _setBoxStyle : function(box, parent){
    // if box is first child of parent,
    // copy style of <this.markup.name>:first-child.
    if(parent && this._isFirstChild(box, parent)){
      this.markup.setFirstChild();
    }
    // set font size
    var base_font_size = parent? parent.fontSize : Layout.fontSize;
    var font_size = this.markup.getCssAttr("font-size", "inherit");
    if(font_size != "inherit"){
      box.fontSize = UnitSize.getUnitSize(font_size, base_font_size);
    }

    // set font color
    var font_color = this.markup.getCssAttr("color", "inherit");
    if(font_color != "inherit"){
      box.color = new Color(font_color);
    }

    // set box edge
    var edge = this.markup.getBoxEdge(box.flow, box.fontSize, box.getContentMeasure());
    if(edge){
      this._setEdge(box, edge);
    }

    // set other variables
    var line_rate = this.markup.getCssAttr("line-rate");
    if(line_rate){
      box.lineRate = line_rate;
    }
    var text_align = this.markup.getCssAttr("text-align");
    if(text_align){
      box.textAlign = text_align;
    }
    var flow_name = this.markup.getCssAttr("flow");
    if(flow_name){
      switch(flow_name){
      case "flip":
	box.setFlow(parent.getFlipFlow());
	break;
      case "inherit":
	box.setFlow(parent.flow);
	break;
      default:
	box.setFlow(BoxFlows.getByName(flow_name));
	break;
      }
    }
    var logical_float = this.markup.getCssAttr("float", "none");
    if(logical_float != "none"){
      box.logicalFloat = logical_float;
    }
    var text_indent = this.markup.getCssAttr("text-indent", 0);
    if(text_indent){
      box.textIndent = box.fontSize;
    }
    var page_break_after = this.markup.getCssAttr("page-break-after", false);
    if(page_break_after){
      box.pageBreakAfter = true;
    }
    var letter_spacing = this.markup.getCssAttr("letter-spacing");
    if(letter_spacing){
      box.letterSpacing = UnitSize.getUnitSize(letter_spacing, base_font_size);
    }

    // read other optional styles not affect layouting issue.
    var markup = this.markup;
    List.iter([
      "background",
      "background-color",
      "background-image",
      "background-repeat",
      "background-position",
      "cursor",
      "font",
      "font-family",
      "font-style",
      "font-weight",
      "opacity",
      "z-index"
    ], function(prop){
      var value = markup.getCssAttr(prop);
      if(value){
	box.setCss(prop, value);
      }
    });

    // copy classes from markup to box object.
    List.iter(this.markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _createBox : function(size, parent){
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    this._onReadyBox(box, parent);
    this._setBoxStyle(box, parent);
    this._onCreateBox(box, parent);
    return box;
  }
});

