var BlockTreeEvaluator = (function(){
  function BlockTreeEvaluator(){
    this.inlineEvaluatorH = new HoriInlineTreeEvaluator(this);
    this.inlineEvaluatorV = new VertInlineTreeEvaluator(this);
  }

  BlockTreeEvaluator.prototype = {
    evaluate : function(box){
      switch(box._type){
      case "br":
	return this.evalBreak(box);
      case "hr":
	return this.evalHr(box);
      case "ibox":
	return this.evalInlineBox(box);
      case "ipage":
	return this.evalInlinePage(box);
      case "img":
	return this.evalImage(box);
      case "table":
	return this.evalTable(box);
      case "text-line":
	return this.evalTextLine(box);
      default:
	return this.evalBox(box);
      }
    },
    evalBox : function(box){
      var markup = box.getMarkup();
      return Html.tagWrap("div", this.evalBoxChilds(box.getChilds()), Args.copy({
	"id":box.id || null,
	"style":Css.toString(box.getCssBlock()),
	"class":box.getCssClasses()
      }, markup? markup.getDatasetAttrsRaw() : {}));
    },
    evalBoxChilds : function(childs){
      var self = this;
      return List.fold(childs, "", function(ret, box){
	return [ret, self.evaluate(box)].join("\n");
      });
    },
    evalTextLine : function(box){
      if(box.isTextVertical()){
	return this.inlineEvaluatorV.evaluate(box);
      }
      return this.inlineEvaluatorH.evaluate(box);
    },
    evalInlineBox : function(box){
      var content = Config.iboxEnable? box.content : "";
      return Html.tagWrap("div", content, {
	"style":Css.toString(box.getCssBlock()),
	"class":box.getCssClasses()
      });
    },
    evalHr : function(box){
      return this.evalInlineBox(box);
    },
    evalBreak : function(box){
      return this.evalInlineBox(box);
    },
    evalImage : function(box){
      var content = this.evalImageContent(box);
      return Html.tagWrap("div", content, {
	"style":Css.toString(box.getCssBlock()),
	"class":box.getCssClasses()
      });
    },
    evalImageContent : function(box){
      var markup = box.getMarkup();
      return Html.tagSingle("img", Args.copy({
	"src": box.src,
	"title":box.getMarkup().getTagAttr("title") || "",
	"width": box.getContentWidth(),
	"height": box.getContentHeight()
      }, markup? markup.getDatasetAttrsRaw() : {}));
    },
    evalInlinePage : function(box){
      return this.evalBox(box);
    },
    evalTable : function(box){
      return this.evalBox(box);
    }
  };

  return BlockTreeEvaluator;
})();

