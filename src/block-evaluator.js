var BlockEvaluator = (function(){
  function BlockEvaluator(){
    this.inlineEvaluatorH = new HorizontalInlineEvaluator(this);
    this.inlineEvaluatorV = new VerticalInlineEvaluator(this);
  }

  BlockEvaluator.prototype = {
    evaluate : function(box, ctx){
      switch(box._type){
      case "br":
	return this.evalBreak(box, ctx);
      case "hr":
	return this.evalHorizontalRule(box, ctx);
      case "ibox":
	return this.evalInlineBox(box, ctx);
      case "ipage":
	return this.evalInlinePage(box, ctx);
      case "img":
	return this.evalImage(box, ctx);
      case "table":
	return this.evalTable(box, ctx);
      case "text-line":
	return this.evalTextLine(box, ctx);
      default:
	return this.evalBox(box, ctx);
      }
    },
    evalBox : function(box, ctx){
      var attr = {
	"style":Css.attr(box.getCss()),
	"class":box.getCssClasses()
      };
      if(box.id){
	attr.id = box.id;
      }
      return Html.tagWrap("div", this.evalBoxChilds(box.getChilds(), ctx), attr);
    },
    evalBoxChilds : function(childs, ctx){
      var self = this;
      return List.fold(childs, "", function(ret, box){
	return [ret, self.evaluate(box, ctx)].join("\n");
      });
    },
    evalTextLine : function(box, ctx){
      if(box.isTextVertical()){
	return this.inlineEvaluatorV.evaluate(box, ctx);
      }
      return this.inlineEvaluatorH.evaluate(box, ctx);
    },
    evalInlineBox : function(box, ctx){
      return Html.tagWrap("div", box.content, {
	"style":Css.attr(box.getCss()),
	"class":box.getCssClasses()
      });
    },
    evalHorizontalRule : function(box, ctx){
      return this.evalInlineBox(box, ctx);
    },
    evalBreak : function(box, ctx){
      return this.evalInlineBox(box, ctx);
    },
    evalImage : function(box, ctx){
      var content = this.evalImageContent(box, ctx);
      return Html.tagWrap("div", content, {
	"style":Css.attr(box.getCss()),
	"class":box.getCssClasses()
      });
    },
    evalImageContent : function(box, ctx){
      return Html.tagSingle("img", {
	"src": box.src,
	"width": box.getContentWidth(),
	"height": box.getContentHeight()
      });
    },
    evalInlinePage : function(box, ctx){
      var ctx2 = ctx.createInlineRoot();
      return this.evalBox(box, ctx2);
    },
    evalTable : function(box, ctx){
      var ctx2 = ctx.createInlineRoot();
      return this.evalBox(box, ctx2);
    }
  };

  return BlockEvaluator;
})();

