var LayoutEvaluator = (function(){
  function LayoutEvaluator(){}

  LayoutEvaluator.prototype = {
    evaluate : function(box){
      if(box === null || typeof box === "undefined"){
	//console.warn("error box:%o", box);
	return "";
      }
      if(this.isFlipBox(box)){
	var flip_evaluator = this.getFlipEvaluator();
	return flip_evaluator.evaluate(box);
      }
      // caution: not box.style.display but box.display
      switch(box.display){
      case "block": return this.evalBlock(box);
      case "inline": return this.evalInline(box);
      case "inline-block": return this.evalInlineBlock(box);
      default: return "";
      }
    },
    evalBlock : function(block){
      return Html.tagWrap("div", this.evalBlockElements(block, block.elements), Args.copy({
	"style":Css.toString(block.getCssBlock()),
	"class":block.classes.join(" ")
      }, block.getDatasetAttr()));
    },
    evalBlockElements : function(parent, elements){
      var self = this;
      return parent.pastedContent? parent.pastedContent : List.fold(elements, "", function(ret, child){
	return ret + (child? self.evalBlockElement(parent, child) : "");
      });
    },
    evalBlockElement : function(parent, element){
      if(element.style && element.style.getMarkupName() === "img"){
	return this.evalBlockImage(element);
      }
      return this.evaluate(element);
    },
    evalInlineBlock : function(iblock){
      return Html.tagWrap("div", this.evalBlockElements(iblock, iblock.elements), Args.copy({
	"style":Css.toString(iblock.getCssInlineBlock()),
	"class":iblock.classes.join(" ")
      }, iblock.getDatasetAttr()));
    },
    evalInline : function(line){
      return Html.tagWrap("div", this.evalInlineElements(line, line.elements), {
	"style":Css.toString(line.getCssInline()),
	"class":line.classes.join(" ")
      });
    },
    evalInlineElements : function(line, elements){
      var self = this;
      return List.fold(elements, "", function(ret, element){
	return ret + self.evalInlineElement(line, element);
      });
    },
    evalInlineElement : function(line, element){
      if(element.display === "inline-block"){
	return this.evalInlineBlock(element);
      }
      if(element instanceof Box){
	switch(element.style.getMarkupName()){
	case "img": return this.evalInlineImage(line, element);
	case "a": return this.evalLink(line, element);
	default: return this.evalInlineChild(line, element);
	}
      }
      var text = this.evalTextElement(line, element);
      if(line.style.isTextEmphaEnable()){
	return this.evalEmpha(line, element, text);
      }
      return text;
    },
    // if link title is not defined, summary of link content is used.
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    evalLink : function(line, link){
      var title = link.style.getMarkupAttr("title") || link.style.getMarkupContent().substring(0, Config.defaultLinkTitleLength);
      var uri = new Uri(link.style.getMarkupAttr("href"));
      var anchor_name = uri.getAnchorName();
      var page_no = anchor_name? DocumentContext.getAnchorPageNo(anchor_name) : "";
      return this.evalLinkElement(line, link, {
	title:title,
	href:uri.getAddress(),
	pageNo:page_no
      });
    },
    evalTextElement : function(line, text){
      switch(text._type){
      case "word": return this.evalWord(line, text);
      case "char": return this.evalChar(line, text);
      case "tcy": return this.evalTcy(line, text);
      case "ruby": return this.evalRuby(line, text);
      default: return "";
      }
    }
  };

  return LayoutEvaluator;
})();

