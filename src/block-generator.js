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
  // called when markup is now no stack, parent is decided,
  // but box size is not decided yet.
  _onReadyMarkupEvent : function(parent){
    if(Event.isEnable("onReadyMarkup")){
      Event.callHandlers(this.markup.getCssKeys(), "onReadyMarkup", {
	context:this.context,
	markup:this.markup,
	parent:parent
      });
    }
  },
  // called when box is created, but no style is not loaded.
  _onReadyBox : function(box, parent){
  },
  // called after onReadyBox, and call user defined hook if enabled.
  _onReadyBoxEvent : function(box){
    if(Event.isEnable("onReadyBox")){
      Event.callHandlers(this.markup.getCssKeys(), "onReadyBox", {
	context:this.context,
	box:box
      });
    }
  },
  // called when box is created, and std style is already loaded.
  _onCompleteBox : function(box, parent){
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
  _getEdgeSize : function(box, edge_type){
    var edge_size = this.markup.getCssAttr(edge_type);
    return edge_size? box.parseEdgeSize(edge_size) : null;
  },
  _isFirstChild : function(box, parent){
    // li-marker and li-body are always first childs of 'li', so ignore them.
    if(box._type == "li-marker" || box._type == "li-body"){
      return false;
    }
    return parent.isEmptyChild();
  },
  _setBoxStyle : function(box, parent){
    // if box is first child of parent, enable first-child(pseudo class).
    if(parent && this._isFirstChild(box, parent)){
      this.markup.setFirstChild();
    }
    // set font size
    var base_font_size = parent? parent.fontSize : Layout.fontSize;
    var font_size = this.markup.getCssAttr("font-size", "inherit");
    if(font_size != "inherit"){
      box.fontSize = UnitSize.mapFontSize(font_size, base_font_size);
    }

    // set font color
    var font_color = this.markup.getCssAttr("color", "inherit");
    if(font_color != "inherit"){
      box.color = font_color;
    }

    // get and set edge
    var padding_size = this._getEdgeSize(box, "padding");
    var margin_size = this._getEdgeSize(box, "margin");
    var border_size = this._getEdgeSize(box, "border");
    if(padding_size || margin_size || border_size){
      var edge = new BoxEdge();
      if(padding_size){
	edge.setSize("padding", box.flow, padding_size);
      }
      if(margin_size){
	edge.setSize("margin", box.flow, margin_size);
      }
      if(border_size){
	edge.setSize("border", box.flow, border_size);
      }
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
    var block_align = this.markup.getCssAttr("block-align", "none");
    if(block_align != "none"){
      box.blockAlign = block_align;
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
      box.letterSpacing = UnitSize.mapFontSize(letter_spacing, base_font_size);
    }

    // copy classes from markup.
    List.iter(this.markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _createBox : function(size, parent){
    this._onReadyMarkupEvent(parent);
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    this._onReadyBox(box, parent);
    this._onReadyBoxEvent(box);
    this._setBoxStyle(box, parent);
    this._onCompleteBox(box, parent);
    return box;
  }
});

