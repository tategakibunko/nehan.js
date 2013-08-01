var ElementGenerator = Class.extend({
  init : function(context){
    this.context = context;
  },
  hasNext : function(){
    return false;
  },
  // called when box is created, but no style is not loaded.
  _onReadyBox : function(box, parent){
  },
  // called when box is created, and std style is already loaded.
  _onCreateBox : function(box, parent){
  },
  _isTextLine : function(element){
    return element instanceof Box && element.isTextLine();
  },
  _yieldStaticElement : function(parent, tag){
    var generator = this._createStaticGenerator(parent, tag);
    return generator.yield(parent);
  },
  _createStaticGenerator : function(parent, tag){
    switch(tag.getName()){
    case "img":
      return new ImageGenerator(this.context.createBlockRoot(tag, null));
    case "ibox":
      return new InlineBoxGenerator(this.context.createBlockRoot(tag, null));
    case "div":
      if(tag.hasFlow()){
	return new InlinePageGenerator(this.context.createBlockRoot(tag));
      }
      return new InlineBoxGenerator(this.context.createBlockRoot(tag, null));
    default:
      return new InlinePageGenerator(this.context.createBlockRoot(tag));
    }
  },
  _createChildInlineTreeGenerator : function(tag){
    switch(tag.getName()){
    case "ruby":
      return new RubyGenerator(this.context.createChildInlineRoot(tag, new RubyTagStream(tag)));
    case "a":
      return new LinkGenerator(this.context.createChildInlineRoot(tag));
    case "first-line":
      return new FirstLineGenerator(this.context.createChildInlineRoot(tag));
    default:
      return new ChildInlineTreeGenerator(this.context.createChildInlineRoot(tag));
    }
  },
  _createInlineBlockGenerator : function(tag){
    return new InlineBlockGenerator(this.context.createInlineBlockRoot(tag));
  },
  _createChildBlockTreeGenerator : function(parent, tag){
    switch(tag.getName()){
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
      return new HeaderGenerator(this.context.createBlockRoot(tag));
    case "section": case "article": case "nav": case "aside":
      return new SectionContentGenerator(this.context.createBlockRoot(tag));
    case "details": case "blockquote": case "figure": case "fieldset":
      return new SectionRootGenerator(this.context.createBlockRoot(tag));
    case "table":
      return new TableGenerator(this.context.createBlockRoot(tag, new TableTagStream(tag)));
    case "tbody": case "thead": case "tfoot":
      return new TableRowGroupGenerator(this.context.createBlockRoot(tag, new DirectTokenStream(tag.tableChilds)));
    case "dl":
      return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag, new DefListTagStream(tag.getContent())));
    case "ul": case "ol":
      return new ListGenerator(this.context.createBlockRoot(tag, new ListTagStream(tag.getContent())));
    case "hr":
      return new HrGenerator(this.context.createBlockRoot(tag, null));
    case "tr":
      return this._createTableRowGenerator(parent, tag);
    case "li":
      return this._createListItemGenerator(parent, tag);
    default:
      return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag));
    }
  },
  _createTableRowGenerator : function(parent, tag){
    var partition = parent.partition.getPartition(tag.tableChilds.length);
    var context2 = this.context.createBlockRoot(tag); // tr
    return new ParallelGenerator(List.map(tag.tableChilds, function(td){
      return new ParaChildGenerator(context2.createBlockRoot(td)); // tr -> td
    }), partition, context2);
  },
  _createListItemGenerator : function(parent, tag){
    var list_style = parent.listStyle || null;
    if(list_style === null){
      return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag));
    }
    if(list_style.isInside()){
      return this._createInsideListItemGenerator(parent, tag);
    }
    return this._createOutsideListItemGenerator(parent, tag);
  },
  _createInsideListItemGenerator : function(parent, tag){
    var marker = parent.listStyle.getMarkerHtml(tag.order + 1);
    var content = Html.tagWrap("span", marker, {
      "class":"nehan-li-marker"
    }) + Const.space + tag.getContent();

    return new ChildBlockTreeGenerator(this.context.createBlockRoot(tag, new TokenStream(content)));
  },
  _createOutsideListItemGenerator : function(parent, tag){
    var context2 = this.context.createBlockRoot(tag);
    var marker = parent.listStyle.getMarkerHtml(tag.order + 1);
    var markup_marker = new Tag("<li-marker>", marker);
    var markup_body = new Tag("<li-body>", tag.getContent());
    return new ParallelGenerator([
      new ParaChildGenerator(context2.createBlockRoot(markup_marker)),
      new ParaChildGenerator(context2.createBlockRoot(markup_body))
    ], parent.partition, context2);
  },
  _getBoxSize : function(parent){
    return this.context.getMarkupStaticSize(parent) || parent.getRestSize();
  },
  _getLineSize : function(parent){
    var measure = parent.getContentMeasure();
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  },
  _getBoxType : function(){
    return this.context.getMarkupName();
  },
  _setBoxClasses : function(box, parent){
    List.iter(this.context.getMarkupClasses(), function(klass){
      box.addClass(klass);
    });
  },
  _setBoxStyle : function(box, parent){
    if(this.context.markup){
      BoxStyle.set(this.context.markup, box, parent);
    }
  },
  _createLine : function(parent){
    var size = this._getLineSize(parent);
    var line = Layout.createTextLine(size, parent);
    line.markup = this.context.markup;
    return line;
  },
  _createBox : function(size, parent){
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    box.markup = this.context.markup;
    this._onReadyBox(box, parent);
    this._setBoxClasses(box, parent);
    this._setBoxStyle(box, parent);
    this._onCreateBox(box, parent);
    return box;
  }
});

