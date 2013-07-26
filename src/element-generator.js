var ElementGenerator = Class.extend({
  init : function(context){
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

