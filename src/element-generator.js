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
  commit : function(){
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
    var font_size = parent? parent.fontSize : Layout.fontSize;
    var measure = parent? parent.getContentMeasure(parent.flow) : Layout.getStdMeasure();
    return this.markup.getStaticSize(font_size, measure);
  },
  _yieldStaticElement : function(parent, tag){
    switch(tag.getName()){
    case "img":
      return (new ImageGenerator(tag, this.context)).yield(parent);
    case "ibox":
      return (new InlineBoxGenerator(tag, this.context)).yield(parent);
    case "div":
      if(tag.hasFlow()){
	return (new InlinePageGenerator(tag, this.context)).yield(parent);
      }
      return (new InlineBoxGenerator(tag, this.context)).yield(parent);
    default:
      return (new InlinePageGenerator(tag, this.context)).yield(parent);
    }
  },
  _getBoxType : function(){
    return this.markup.getName();
  },
  _setBoxClasses : function(box, parent){
    List.iter(this.markup.classes, function(klass){
      box.addClass(klass);
    });
  },
  _setBoxStyle : function(box, parent){
    BoxStyle.set(this.markup, box, parent);
  },
  _createBox : function(size, parent){
    var box_type = this._getBoxType();
    var box = Layout.createBox(size, parent, box_type);
    box.markup = this.markup;
    this._onReadyBox(box, parent);
    this._setBoxClasses(box, parent);
    this._setBoxStyle(box, parent);
    this._onCreateBox(box, parent);
    return box;
  }
});

